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
        const creds = html`<div class="settings-container"><p>ID: <i>#${this.ME.id}</i></p><p>Nickname: <i>${this.ME.nickname}</i></p><p>Valid until: <i>${expireDate}</i></p></div>`;
        const status = html`<div class="settings-container"><p>Status</p><textarea @keydown="${e => this.keyDownStatus(e)}">Hello World</textarea></div>`;

        return html`<h1>User Menu</h1>${creds}${status}`;
    }
}

export default customElements.define('user-menu', User);
