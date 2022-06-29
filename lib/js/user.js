import { LitElement, html } from 'lit';
import { domCache } from './data/data';
import { sanitizeTime } from './utils';
import ME from './data/me';

class User extends LitElement {
    static properties = {
        ME: { type: Object },
    };

    #tokenInput = {};

    constructor () {
        super();
        this.ME = ME;
    }

    createRenderRoot () {
        return this; // prevents creating a shadow root
    }

    clickOnEndlessToken () {
        const value = this.#tokenInput.value.trim();
        const check = false;

        if (value.length < 10) {
            domCache.toast.notification = {
                type: 'error',
                text: 'Your token is too short',
            };
            
            return domCache.toast.open();
        }
        if (check) {
            domCache.toast.notification = {
                type: 'error',
                text: 'Your token is invalid',
            };
            
            return domCache.toast.open();
        }

        requestAnimationFrame(() => {
            domCache.toast.notification = {
                type: 'success',
                text: 'Your acc is upgraded to endless',
            };
            
            this.#tokenInput.value = '';
            return domCache.toast.open();
        });
    }

    keyDownStatus (e) {
        console.log(e.target.value); 
    }

    firstUpdated () {
        this.#tokenInput = this.querySelector('input');
    }

    render () {
        const expireDate = sanitizeTime(this.ME.expire);
        const endlessIcon = this.ME.endless ? html`<i class="fa-solid fa-check danger-color"></i>` : html`<i class="fa-solid fa-times"></i>`;
        const creds = html`<div class="settings-container"><p>ID: <i>#${this.ME.id}</i></p><p>Nickname: <i>${this.ME.nickname}</i></p><p>Valid until: <i>${expireDate}</i></p><p>Endless Account: ${endlessIcon}</p></div>`;
        const status = html`<div class="settings-container"><p>Status</p><textarea @keydown="${e => this.keyDownStatus(e)}" maxlength="280">${this.ME.status}</textarea></div>`;
        const endlessToken = html`<div class="settings-container"><p>Endless Token</p><input type="text" maxlength="100"><button @click="${this.clickOnEndlessToken}">Check</button></div>`;

        return html`<h1>User Menu</h1>${creds}${status}${endlessToken}`;
    }
}

export default customElements.define('user-menu', User);
