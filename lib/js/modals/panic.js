import { html } from 'lit';
import { isKeyDownNumber } from '../utils';
import { domCache } from '../data/data';
import LANG from '../data/lang';
import ME from '../data/me';
import Modal from './modal';

class PanicModal extends Modal {
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

    onKeyPress (e) {
        if (!isKeyDownNumber(e)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        if (e.keyCode === 13) {
            return this.onClickDestroy();
        }
    }

    onClickDestroy () {
        const id = this.querySelector('input').value;
        
        if (id === this.ME.id) {
            console.log('destroy');
            return this.close();
        } else {
            domCache.toast.notification = {
                type: 'error',
                text: 'Wrong code',
            };
            return domCache.toast.open(); 
        }
    }

    open () {
        super.open();
        requestAnimationFrame(() => this.querySelector('input').focus());
    } 

    render () {
        const text = LANG.PANICTEXT.replaceAll('{{id}}', this.ME.id);
        const content = html`<p>${text}</p><div><input tabindex="0" @keydown="${(e) => this.onKeyPress(e)}" type="text"></div><button @click="${this.onClickDestroy}" class="danger">destroy everything</button>`;

        return super.render(content);
    }
}

export default customElements.define('panic-modal-window', PanicModal);