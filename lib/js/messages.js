import { LitElement, html } from 'lit';
import { isPhone } from './data.js';

class Messages extends LitElement {
    constructor () {
        super();
    }

    createRenderRoot () {
        return this; // prevents creating a shadow root
    }

    render () {
        return html`MESSAGES MENU`;
    }
}

export default customElements.define('messages-menu', Messages);
