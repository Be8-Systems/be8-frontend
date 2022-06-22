import { LitElement, html } from 'lit';
import { isPhone } from './data.js';

class User extends LitElement {
    constructor () {
        super();
    }

    createRenderRoot () {
        return this; // prevents creating a shadow root
    }

    render () {
        const creds = html`<div class="settings-container"><p>ID: <i>#10344</i></p><p>Nickname: <i>Oliver</i></p><p>Valid until: <i>${new Date().toISOString()}</i></p></div>`;
        const status = html`<div class="settings-container"><p>Status</p><textarea>Hello World</textarea></div>`;

        return html`<h1>User Menu</h1>${creds}${status}`;
    }
}

export default customElements.define('user-menu', User);
