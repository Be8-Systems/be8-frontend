import { html } from 'lit';
import { isKeyDownNumber } from '../utils';
import LANG from '../data/lang';
import ME from '../data/me';
import Modal from './modal';

class PanicModal extends Modal {
    constructor () {
        super();
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
        
        if (id === ME.id) {
            console.log('destroy');
            return this.close();
        } else {
            
        }
    }

    open () {
        super.open();
        requestAnimationFrame(() => this.querySelector('input').focus());
    } 

    render () {
        const text = LANG.PANICTEXT.replaceAll('{{id}}', ME.id)
        const content = html`<p>${text}</p><div><input tabindex="0" @keydown="${(e) => this.onKeyPress(e)}" type="text"></div><button @click="${this.onClickDestroy}" class="danger">destroy everything</button>`;

        return super.render(content);
    }
}

export default customElements.define('panic-modal-window', PanicModal);