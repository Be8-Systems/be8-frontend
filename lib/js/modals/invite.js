import { html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import LANG from '../data/lang';
import Modal from './modal';
import Crypto from 'crypto-es';

class InviteModal extends Modal {
    static styles = [super.styles, css`
        .qr img {
            margin: 0 auto;
        }
    `];
    static properties = {
        url: {},
        isGenerated: {}
    };

    constructor () {
        super();
        this.isGenerated = false;
    }

    #generateSafeLink (parameterName, content) {
        const urlObj = new URL(window.location.href);
        const cipherPW = Crypto.AES.encrypt(content, '392e32oijsdfweoir').toString();
        
        return `${urlObj.origin}?${parameterName}=${encodeURIComponent(cipherPW)}`;
    }

    open (parameter, data) {
        super.open();
        
        if (this.isGenerated) {
            return;
        }

        const url = this.#generateSafeLink(parameter, data);
        const options =  {
            text: url,
        };
        new QRCode(this.shadowRoot.querySelector('.qr'), options);

        this.url = url;
        this.isGenerated = true;
    }
    
    render () {
        const content = html`<p>${unsafeHTML(LANG.INVITELINK.replaceAll('{{link}}', this.url))}</p><br /><div class="qr"></div><br />`;

        return super.render(content);
    }
}

export default customElements.define('invite-modal-window', InviteModal);
