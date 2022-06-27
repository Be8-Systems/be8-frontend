import { html } from 'lit';
import { animations, animateMainToSide, animateSideToMain } from '../utils';
import LANG from '../data/lang';
import ME from '../data/me';
import Modal from './modal';

class Codes extends Modal {
    static properties = {
        ME: {},
        state: {}
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
        const newCode = oldInput.value;
        const newCodeConf = newCodeInput.value;
        const old = newCodeConfInput.value;

        if (newCode !== newCodeConf) {
            return;
        }

        console.log(old, newCode, newCodeConf);
    }

    clickOnUpdateDestroy () {
        const [oldInput, newCodeInput, newCodeConfInput] = [...this.#updateDestroy.querySelectorAll('input')];
        const newCode = oldInput.value;
        const newCodeConf = newCodeInput.value;
        const old = newCodeConfInput.value;

        if (newCode !== newCodeConf) {
            return;
        }

        console.log(old, newCode, newCodeConf);
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

    renderUpdateSide () {
        const unlock = html`<div class="unlock-side hide"><p class="create-group-headline"><i @click="${this.backToUpdateSelect}" class="fa-solid fa-arrow-left hover-font float-left"></i> <span>Update Unlock</span></p> <small>Old Code</small><input type="password" maxlength="40"><small>New Code</small><input type="password" maxlength="40"> <small>New Code re-type</small><input type="password" maxlength="40"><button @click="${this.clickOnUpdateUnlock}" class="full-width">Update</button></div>`;
        const destroy = html`<div class="destroy-side hide"><p class="create-group-headline"><i @click="${this.backToUpdateSelect}" class="fa-solid fa-arrow-left hover-font float-left"></i> <span>Update Destroy</span></p>  <small>Old Code</small><input type="password" maxlength="40"><small>New Code</small><input type="password" maxlength="40"> <small>New Code re-type</small><input type="password" maxlength="40"><button @click="${this.clickOnUpdateDestroy}" class="full-width">Update</button></div>`;

        return html`${unlock}${destroy}`;
    }

    renderUpdate () {
        const unlockCode = html`<p @click="${this.goToUpdateUnlock}" class="sub-modal-button hover-background"><span>Unlock Code</span> <i class="fa-solid fa-arrow-right hover-font float-right"></i></p>`;
        const destroyCode = html`<p @click="${this.goToUpdateDestroy}" class="sub-modal-button hover-background"><span>Destroy Code</span> <i class="fa-solid fa-arrow-right hover-font float-right"></i></p>`;

        return html`<p class="create-group-headline">Update</p>${unlockCode}${destroyCode}`;
    }

    open () {
        super.open();

        this.state = 'main';
        requestAnimationFrame(() => this.querySelector('input')?.focus());
    }

    close () {
        super.close();
        this.backToUpdateSelect();
    }

    setup () {
        const inputs = [...this.querySelectorAll('input')];
        const [passwordInput, passwordInputConf, destroyInput, destroyInputConf] = inputs;
        const password = passwordInput.value === passwordInputConf.value;
        const destroy = destroyInput.value === destroyInputConf.value; 

        if (!password) {
            return;
        }
        if (!destroy) {
            return;
        }

        inputs.forEach(input => input.value = '');
        this.close(); 
    }

    renderSetup () {
        const headline = html`<div class="setup-unlock-container"><p class="create-group-headline">Setup</p><small>${LANG.UNLOCKSETUPTEXT}</small></div>`;
        const unlock = html`<div class="setup-unlock-container"><p>Unlock Code</p><small>new password</small><input type="password" maxlength="40"><small>re-type</small><input type="password" maxlength="40"></div>`;
        const destroy = html`<div><p>Destroy Code</p><small>new destory code</small><input type="password" maxlength="40"><small>re-type</small><input type="password" maxlength="40"></div>`;
        
        return html`${headline}${unlock}${destroy}<button @click="${this.setup}" class="full-width">Setup</button>`;
    }

    firstUpdated () {
        this.#modalContent = this.querySelector('.modal-content');
        this.#updateUnlock = this.querySelector('.unlock-side'); 
        this.#updateDestroy = this.querySelector('.destroy-side');
    }

    render () {
        const content = this.ME.codes ? this.renderUpdate() : this.renderSetup();
        const sideContent = this.ME.codes ? this.renderUpdateSide() : '';

        return super.render(content, sideContent);
    }
}

export default customElements.define('codes-modal-window', Codes);