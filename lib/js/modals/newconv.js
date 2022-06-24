import { html, css } from 'lit';
import LANG from '../data/lang';
import Modal from './modal';

class ConversationModal extends Modal {
    constructor () {
        super();
    }

    createRenderRoot () {
        return this; // prevents creating a shadow root
    }

    open () {
        super.open();
        requestAnimationFrame(() => this.querySelector('input').focus());
    } 

    render () {
        const content = html`<p>${LANG.CONVERSATION}</p><input tabindex="0" type="text"><div class="create-group hover-background">Create a group <i class="fa-solid fa-arrow-right float-right"></i></div>`;
        return super.render(content);
    }
}

export default customElements.define('conversation-modal-window', ConversationModal);