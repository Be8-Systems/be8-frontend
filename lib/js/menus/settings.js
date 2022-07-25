import { LitElement, html } from 'lit';
import { domCache } from '../data/data';
import ME from '../data/me';

class SettingsMenu extends LitElement {
    static properties = {
        ME: { type: Object },
    };

    #nicknameTimer = {}
    #codesModal = document.querySelector('codes-modal-window');
      
    constructor () {
        super();
        this.ME = ME;
    }

    createRenderRoot () {
        return this; // prevents creating a shadow root
    }

    clickOnCodes () {
        return this.#codesModal.open();
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

    changeName (event) {
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
        }, 900);
    }

    render () {
        const version = domCache.app.getAttribute('data-version');
        const nickname = html`<div class="settings-container"><p>Nickname is ${this.ME.nickname}</p><input @input=${this.changeName} type="text" value="${this.ME.nickname}" maxlength="20"></div>`; 
        const codes = html`<div class="settings-container"><p>Destroy and Unlock</p><button @click="${this.clickOnCodes}" class="danger-background">${this.ME.codes ? 'Update' : 'Setup'}</button></div>`;
        const versionContainer = html`<div class="settings-container"><p>Version: ${version}</p></div>`;

        return html`<h1>Settings</h1>${nickname}${codes}${versionContainer}`;
    }
}

export default customElements.define('settings-menu', SettingsMenu);
