import { html, css } from 'lit';
import LANG from '../data/lang';
import Modal from './modal';

class InviteModal extends Modal {
    constructor () {
        super();
    }
    
    render () {
        const url = '';
        const content = html`<p>${LANG.INVITELINK.replaceAll('{{link}}', url)}</p><br /><div class="qr"></div><br />`;

        return super.render(content);
    }
}

export default customElements.define('invite-modal-window', InviteModal);
