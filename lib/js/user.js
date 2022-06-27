import { LitElement, html } from 'lit';
import ME from './data/me';

class User extends LitElement {
    static properties = {
        ME: {},
    };

    constructor () {
        super();

        this.ME = ME;
    }

    createRenderRoot () {
        return this; // prevents creating a shadow root
    }

    keyDownStatus (e) {
        console.log(e.target.value); 
    }

    render () {
        const expireDate = new Date(this.ME.expire).toISOString();
        const endlessIcon = this.ME.endless ? html`<i class="fa-solid fa-check danger-color"></i>` : html`<i class="fa-solid fa-times"></i>`;
        const creds = html`<div class="settings-container"><p>ID: <i>#${this.ME.id}</i></p><p>Nickname: <i>${this.ME.nickname}</i></p><p>Valid until: <i>${expireDate}</i></p><p>Endless Account: ${endlessIcon}</p></div>`;
        const status = html`<div class="settings-container"><p>Status</p><textarea @keydown="${e => this.keyDownStatus(e)}">${this.ME.status}</textarea></div>`;
        const endlessToken = html`<div class="settings-container"><p>Endless Token</p><input type="text" maxlength="100"><button>Check</button></div>`;

        return html`<h1>User Menu</h1>${creds}${status}${endlessToken}`;
    }
}

export default customElements.define('user-menu', User);
