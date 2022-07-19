import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { isKeyDownNumber } from '../utils';
import { domCache } from '../data/data';
import LANG from '../data/lang';
import ME from '../data/me';
import Modal from './modal';

class PanicModal extends Modal {
    static properties = {
        ME: { type: Object },
    };

    constructor () {
        super();
        this.ME = ME;
    }

    createRenderRoot () {
        return this; // prevents creating a shadow root
    }

    onKeyPress (e) {
        if (!isKeyDownNumber(e)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        if (e.key === 'Enter') {
            return this.onClickDestroy();
        }
    }

    onClickDestroy () {
        const id = this.querySelector('input').value.trim();
        
        if (id === this.ME.id) {
            const panicEvent = new CustomEvent('panic', {
                bubbles: false,
                detail: {
                    ...this.ME,
                    done: async () => {
                        return location.reload();
                    }
                }
            });

            return domCache.app.dispatchEvent(panicEvent);
        } 
        
        domCache.toast.notification = {
            type: 'error',
            text: 'Wrong code',
        };
        
        return domCache.toast.open(); 
    }

    open () {
        super.open();
        requestAnimationFrame(() => this.querySelector('input').focus());
    } 

    render () {
        const text = unsafeHTML(LANG.PANICTEXT.replaceAll('{{id}}', this.ME.id));
        const content = html`<p>${text}</p><div><input tabindex="0" @keydown="${(e) => this.onKeyPress(e)}" type="number" min="0"></div><button @click="${this.onClickDestroy}" class="danger-background">destroy everything</button>`;

        return super.render(content);
    }
}

export default customElements.define('panic-modal-window', PanicModal);