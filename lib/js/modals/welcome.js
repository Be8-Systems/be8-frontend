import { html } from 'lit';
import Modal from './modal';
import { domCache } from '../data/data';

class Welcome extends Modal {
    static properties = {
        ME: { type: Object }
    };

    #nicknameTimer = {}

    constructor () {
        super();
        this.ME = {};
    }

    createRenderRoot () {
        return this; // prevents creating a shadow root
    }

    open () {
        setTimeout(() => this.querySelector('input').focus(), 450);
        return super.open();
    } 

    #clickOnLogin () {
        return super.close();
    }

    #sendChangeNichnameEvent (newNickname, oldNickname) {
        const nickName = new CustomEvent('changeNickName', {
            bubbles: false,
            detail: {
                oldNickname,
                newNickname
            }
        });

        return domCache.app.dispatchEvent(nickName);
    }

    #enterNewNickname (event) {
        clearTimeout(this.#nicknameTimer);
        
        this.#nicknameTimer = setTimeout(() =>  {
            const input = event.target;
            const newNickname = input.value;
            const oldNickname = this.ME.nickname;

            this.ME = {
                ...this.ME,
                nickname: newNickname
            };
            
            this.#sendChangeNichnameEvent(newNickname, oldNickname);

            if (event.key === 'Enter') {
                return super.close();
            }
        }, 450);
    }

    render () {
        const text = html`<div class="welcome-text"><h1>Welcome to Be8</h1><p>your new ID is <i class="highlight-color">#${this.ME.id}</i>, your nickname is <i class="highlight-color">${this.ME.nickname}</i>. Everything gets deleted after 30 Days you can create as many accs as you want.</p></div>`;
        const input = html`<div><p>Change your Nickname:</p><input @keydown="${(e) => this.#enterNewNickname(e)}" type="text" value="${this.ME.nickname}" maxlength="20"></div> <button @click="${this.#clickOnLogin}" class="full-width">Login</button>`;

        return super.render([text, input]);
    }
}

export default customElements.define('welcome-modal-window', Welcome);
