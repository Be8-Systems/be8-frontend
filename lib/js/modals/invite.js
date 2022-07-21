import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { domCache } from '../data/data';
import LANG from '../data/lang';
import ME from '../data/me';
import { generateSafeLink } from '../utils';
import Modal from './modal';

class InviteModal extends Modal {
    static properties = {
        inviteURL: { type: String },
        ME: { type: Object }
    };

    constructor () {
        super();

        this.ME = ME;
        this.isGenerated = false;
    }

    createRenderRoot () {
        return this; // prevents creating a shadow root
    }

    open () {
        const inviteGenerate = new CustomEvent('inviteGenerated', {
            bubbles: false,
            detail: {
                type: 'user', 
                sentInviteLink: true 
            }
        });
        const qr = this.querySelector('.qr');
        
        super.open();
        navigator.clipboard.writeText(this.url).then(() => {
            this.focus();
        });
        
        qr.innerHTML = '';
        new QRCode(qr, { text: this.url });
        return domCache.app.dispatchEvent(inviteGenerate);
    }
    
    render () {
        const url = generateSafeLink('user', this.ME.id);
        const content = html`<p class="create-group-headline">Invite Friends to be8</p><p>${unsafeHTML(LANG.INVITELINK.replaceAll('{{link}}', this.url))}</p><br /><div class="qr"></div><br />`;

        this.url = url;

        return super.render(content);
    }
}

export default customElements.define('invite-modal-window', InviteModal);
