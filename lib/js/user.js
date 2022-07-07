import { LitElement, html } from 'lit';
import { domCache } from './data/data';
import { sanitizeTime } from './utils';
import ME from './data/me';

const tokenLength = 32;

class User extends LitElement {
    static properties = {
        ME: { type: Object },
    };

    #statusTimer = {};
    #tokenInput = {};

    constructor () {
        super();
        this.ME = ME;
    }

    createRenderRoot () {
        return this; // prevents creating a shadow root
    }

    clickOnEndlessToken () {
        const token = this.#tokenInput.value.trim();
        const tokenEvent = new CustomEvent('setToken', {
            bubbles: false,
            detail: {
                ...this.ME,
                token,
                wrongToken: () => {
                    domCache.toast.notification = {
                        type: 'error',
                        text: 'Your token is invalid',
                    };
                    
                    return domCache.toast.open();
                },
                tokenInUse : () => {
                    domCache.toast.notification = {
                        type: 'error',
                        text: 'This token is already in use',
                    };
                    
                    return domCache.toast.open();
                },
                success: () => {
                    domCache.toast.notification = {
                        type: 'success',
                        text: 'Your acc is upgraded to endless',
                    };
                    
                    this.#tokenInput.value = '';
                    domCache.toast.open();
                }
            }
        });

        if (token.length < tokenLength) {
            domCache.toast.notification = {
                type: 'error',
                text: 'Your token is too short',
            };
            
            return domCache.toast.open();
        }

        return domCache.app.dispatchEvent(tokenEvent);
    }

    #sendStatusChangeEvent (status) {
        const statusEvent = new CustomEvent('setStatus', {
            bubbles: false,
            detail: {
                status
            }
        });

        return domCache.app.dispatchEvent(statusEvent);
    }

    keyDownStatus (event) {
        clearTimeout(this.#statusTimer);
        
        this.#statusTimer = setTimeout(() =>  {
            const status = event.target.value.trim();

            if (this.ME.status === status) {
                return clearTimeout(this.#statusTimer);
            }

            this.ME = {
                ...this.ME,
                status
            };
            
            this.#sendStatusChangeEvent(status);
        }, 400);
    }

    firstUpdated () {
        this.#tokenInput = this.querySelector('input');
    }

    render () {
        const expireDate = sanitizeTime(this.ME.expire);
        const endlessIcon = this.ME.endless ? html`<i class="fa-solid fa-check danger-color"></i>` : html`<i class="fa-solid fa-times"></i>`;
        const validLine = this.ME.endless ? '' : html`<p>Valid until: <i>${expireDate}</i></p>`;
        const creds = html`<div class="settings-container"><p>ID: <i>#${this.ME.id}</i></p><p>Nickname: <i>${this.ME.nickname}</i></p>${validLine}<p>Endless Account: ${endlessIcon}</p></div>`;
        const status = html`<div class="settings-container"><p>Status</p><textarea @keydown="${e => this.keyDownStatus(e)}" maxlength="280">${this.ME.status}</textarea></div>`;
        const endlessToken = this.ME.endless ? '' : html`<div class="settings-container"><p>Token</p><input type="text" maxlength="${tokenLength}"><button @click="${this.clickOnEndlessToken}">Check</button></div>`;

        return html`<h1>User Menu</h1>${creds}${status}${endlessToken}`;
    }
}

export default customElements.define('user-menu', User);
