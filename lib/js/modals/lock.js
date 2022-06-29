import { html } from 'lit';
import Modal from './modal';
import { domCache } from '../data/data';

class Lock extends Modal {
    static properties = {
        ME: { type: Object }
    };

    #unlockInput = {};

    constructor () {
        super(false);
        this.ME = {};
    }

    createRenderRoot () {
        return this; // prevents creating a shadow root
    }

    enterUnlockCode (e) {
        if (e.keyCode === 13) {
            const code = this.#unlockInput.value;

            if (code === '1000') {
                domCache.toast.notification = {
                    type: 'success',
                    text: 'be8 unlocked',
                };
                
                domCache.toast.open();
                return this.close();
            }

            domCache.toast.notification = {
                type: 'error',
                text: 'wrong unlock code',
            };
            
            domCache.toast.open();
        }
    }

    open () {
        if (this.ME.codes) {
            super.open();
            requestAnimationFrame(() => this.#unlockInput.focus());
        }
    }

    firstUpdated () {
        this.#unlockInput = this.querySelector('input');
    }

    render () {
        const content = html`<p class="create-group-headline">Unlock be8</p><small>Enter your unlock code to use be8</small><input type="text" @keydown="${(e) => this.enterUnlockCode(e)}" maxlength="40">`;
        return super.render(content);
    }
}

export default customElements.define('lock-modal-window', Lock);
