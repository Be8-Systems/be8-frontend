import { html, css } from 'lit';
import LANG from '../data/lang';
import Modal from './modal';

class InviteModal extends Modal {
    #url = '';

    constructor () {
        super();
    }
    
    render () {
        const content = html`<p>${LANG.INVITELINK.replaceAll('{{link}}', this.#url)}</p><br /><div class="qr"></div><br />`;

        return super.render(content);
    }
}

export default customElements.define('invite-modal-window', InviteModal);
