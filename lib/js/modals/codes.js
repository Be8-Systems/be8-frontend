import { html } from 'lit';
import { animateMainToSide, animateSideToMain } from '../utils';
import { domCache } from '../data/data';
import LANG from '../data/lang';
import ME from '../data/me';
import Modal from './modal';

function autoRefreshToast () {
    domCache.toast.notification = {
        type: 'success',
        text: 'Your unlock code and destroy code are set. Auto refresh in 2s.',
    };

    domCache.toast.open();
    setTimeout(() => location.reload(), 1750);
}

class Codes extends Modal {
    static properties = {
        ME: { type: Object },
        state: { type: String }
    };

    #modalContent = {}; 
    #updateUnlock = {};
    #updateDestroy = {};

    constructor () {
        super();
        this.ME = ME;
    }

    clickOnUpdateUnlock () {
        const [oldInput, newCodeInput, newCodeConfInput] = [...this.#updateUnlock.querySelectorAll('input')];
        const newCode = newCodeInput.value;
        const newCodeConf = newCodeConfInput.value;
        const oldCode = oldInput.value;
        const updateUnlockEvent = new CustomEvent('updateCode', {
            bubbles: false,
            detail: {
                ...this.ME,
                code: newCode,
                oldCode,
                codeType: 'unlock',
                done: () => {
                    autoRefreshToast();
                    return this.close();
                },
                oldCodeWrong: () => {
                    domCache.toast.notification = {
                        type: 'error',
                        text: 'Your old code is wrong.',
                    };
        
                    return domCache.toast.open();
                }
            }
        });

        if (newCode !== newCodeConf) {
            domCache.toast.notification = {
                type: 'error',
                text: 'Your new code and your re-typed are not identical.',
            };

            return domCache.toast.open();
        }

        return domCache.app.dispatchEvent(updateUnlockEvent);
    }

    clickOnUpdateDestroy () {
        const [oldInput, newCodeInput, newCodeConfInput] = [...this.#updateDestroy.querySelectorAll('input')];
        const newCode = newCodeInput.value;
        const newCodeConf = newCodeConfInput.value;
        const oldCode = oldInput.value;
        const destroyEvent = new CustomEvent('updateCode', {
            bubbles: false,
            detail: {
                ...this.ME,
                code: newCode,
                oldCode,
                codeType: 'destroy',
                done: () => { 
                    autoRefreshToast();
                    return this.close();
                },
                oldCodeWrong: () => {
                    domCache.toast.notification = {
                        type: 'error',
                        text: 'Your old code is wrong.',
                    };
        
                    return domCache.toast.open();
                }
            }
        });

        if (newCode !== newCodeConf) {
            domCache.toast.notification = {
                type: 'error',
                text: 'Your new code and your re-typed are not identical.',
            };
    
            return domCache.toast.open();
        }

        return domCache.app.dispatchEvent(destroyEvent);
    }

    goToUpdateUnlock () {
        const input = this.#updateUnlock.querySelector('input');

        this.state = 'unlock';
        animateMainToSide(this.#modalContent, this.#updateUnlock, input);
    }

    goToUpdateDestroy () {
        const input = this.#updateUnlock.querySelector('input');

        this.state = 'destroy';
        animateMainToSide(this.#modalContent, this.#updateDestroy, input);
    }

    backToUpdateSelect () {
        if (this.state === 'unlock') {
            animateSideToMain(this.#modalContent, this.#updateUnlock);
        }
        if (this.state === 'destroy') {
            animateSideToMain(this.#modalContent, this.#updateDestroy);
        }

        this.state = 'main';
    }

    open () {
        super.open();

        this.state = 'main';
        requestAnimationFrame(() => this.querySelector('input')?.focus());
        this.#updateUnlock = this.querySelector('.unlock-side'); 
        this.#updateDestroy = this.querySelector('.destroy-side');
    }

    close () {
        super.close();
        this.backToUpdateSelect();
    }

    setup () {
        const inputs = [...this.querySelectorAll('input')];
        const [unlockInput, unlockInputConf, destroyInput, destroyInputConf] = inputs;
        const unlock = unlockInput.value;
        const unlockConf = unlockInputConf.value;
        const destroy = destroyInput.value; 
        const destroyConf = destroyInputConf.value
        const sameUnlock = unlock === unlockConf;
        const sameDestroy = destroy === destroyConf; 
        const setupEvent = new CustomEvent('setupCodes', {
            bubbles: false,
            detail: {
                ...this.ME,
                unlockCode: unlock,
                destroyCode: destroy,
                done: () => {
                    autoRefreshToast();
                    inputs.forEach(input => input.value = '');
                    this.close(); 
                }
            }
        });

        if (!sameUnlock) {
            domCache.toast.notification = {
                type: 'error',
                text: 'Unlock and unlock re-type are not equal',
            };
            
            return domCache.toast.open();
        }
        if (!sameDestroy) {
            domCache.toast.notification = {
                type: 'error',
                text: 'Destroy and destroy re-type are not equal',
            };
            
            return domCache.toast.open();
        }
        if (unlock === destroy) {
            domCache.toast.notification = {
                type: 'error',
                text: 'Destroy and unlock are the same code',
            };
            
            return domCache.toast.open();
        }
        if (unlock.length === 0 || unlockConf.length === 0) {
            domCache.toast.notification = {
                type: 'error',
                text: 'You have to enter an unlock code',
            };
            
            return domCache.toast.open();
        }
        if (destroy.length === 0 || destroyConf.length === 0) {
            domCache.toast.notification = {
                type: 'error',
                text: 'You have to enter a destroy code',
            };
            
            return domCache.toast.open();
        }

        return domCache.app.dispatchEvent(setupEvent);
    }

    onKeyPress (e) {
        if (e.key === 'Enter') {
            return this.setup();
        }
    }

    renderUpdateSide () {
        const unlock = html`<div class="unlock-side hide"><p class="create-group-headline"><i @click="${this.backToUpdateSelect}" class="fa-solid fa-arrow-left hover-font float-left"></i> <span>Update Unlock</span></p> <small>Old Code</small><input autocomplete="off"  type="password" maxlength="40"><small>New Code</small><input type="password" maxlength="40"> <small>New Code re-type</small><input type="password" maxlength="40"><button @click="${this.clickOnUpdateUnlock}" class="full-width">Update</button></div>`;
        const destroy = html`<div class="destroy-side hide"><p class="create-group-headline"><i @click="${this.backToUpdateSelect}" class="fa-solid fa-arrow-left hover-font float-left"></i> <span>Update Destroy</span></p>  <small>Old Code</small><input autocomplete="off" type="password" maxlength="40"><small>New Code</small><input type="password" maxlength="40"> <small>New Code re-type</small><input type="password" maxlength="40"><button @click="${this.clickOnUpdateDestroy}" class="full-width">Update</button></div>`;

        return html`${unlock}${destroy}`;
    }

    renderUpdate () {
        const unlockCode = html`<p @click="${this.goToUpdateUnlock}" class="sub-modal-button hover-background"><span>Unlock Code</span> <i class="fa-solid fa-arrow-right hover-font float-right"></i></p>`;
        const destroyCode = html`<p @click="${this.goToUpdateDestroy}" class="sub-modal-button hover-background"><span>Destroy Code</span> <i class="fa-solid fa-arrow-right hover-font float-right"></i></p>`;

        return html`<p class="create-group-headline">Update</p>${unlockCode}${destroyCode}`;
    }

    renderSetup () {
        const headline = html`<div class="setup-unlock-container"><p class="create-group-headline">Setup</p><small>${LANG.UNLOCKSETUPTEXT}</small></div>`;
        const unlock = html`<form class="setup-unlock-container"><p>Unlock Code</p><small>new password</small><input type="password" autocomplete="off" maxlength="40"><small>re-type</small><input type="password" autocomplete="off" maxlength="40"></form>`;
        const destroy = html`<form><p>Destroy Code</p><small>new destory code</small><input type="password" autocomplete="off" maxlength="40"><small>re-type</small><input type="password" autocomplete="off" maxlength="40" @keydown="${(e) => this.onKeyPress(e)}"></form>`;
        
        return html`${headline}${unlock}${destroy}<button @click="${this.setup}" class="full-width">Setup</button>`;
    }
    
    firstUpdated () {
        this.#modalContent = this.querySelector('.modal-content');   
    }

    render () {
        const content = this.ME.codes ? this.renderUpdate() : this.renderSetup();
        const sideContent = this.ME.codes ? this.renderUpdateSide() : '';

        return super.render(content, sideContent);
    }
}

export default customElements.define('codes-modal-window', Codes);