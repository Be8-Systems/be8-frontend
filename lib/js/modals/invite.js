import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import LANG from '../data/lang';
import ME from '../data/me';
import Modal from './modal';
import Crypto from 'crypto-es';

class InviteModal extends Modal {
    static properties = {
        url: {},
        ME: {}
    };

    constructor () {
        super();

        this.ME = ME;
        this.isGenerated = false;
    }

    createRenderRoot () {
        return this; // prevents creating a shadow root
    }

    #generateSafeLink (parameterName, content) {
        const urlObj = new URL(window.location.href);
        const cipherPW = Crypto.AES.encrypt(content, '392e32oijsdfweoir').toString();
        
        return `${urlObj.origin}?${parameterName}=${encodeURIComponent(cipherPW)}`;
    }

    open () {
        super.open();
        
        this.querySelector('.qr').innerHTML = '';
        new QRCode(this.querySelector('.qr'), { text: this.url });
    }
    
    render () {
        const url = this.#generateSafeLink('join', this.ME.id);
        const content = html`<p>${unsafeHTML(LANG.INVITELINK.replaceAll('{{link}}', this.url))}</p><br /><div class="qr"></div><br />`;

        this.url = url;

        return super.render(content);
    }
}

export default customElements.define('invite-modal-window', InviteModal);
