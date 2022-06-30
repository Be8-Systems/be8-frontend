import { LitElement, html } from 'lit';
import { domCache } from './data/data';
import ME from './data/me';

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

    clickOnNotifications () {
        console.log('Notifications');
    }

    clickOnCodes () {
        return this.#codesModal.open();
    }

    #sendChangeNichnameEvent () {
        const nickName = new CustomEvent('changeNickName', {
            bubbles: false,
            detail: {
                ...this.ME,
            }
        });

        return domCache.app.dispatchEvent(nickName);
    }

    changeName (event) {
        clearTimeout(this.#nicknameTimer);
        
        this.#nicknameTimer = setTimeout(() =>  {
            const input = event.target;

            this.ME.nickname = input.value;
            this.ME = {
                ...this.ME,
                nickname: input.value
            };
            
            this.#sendChangeNichnameEvent();
        }, 900);
    }

    render () {
        const nickname = html`<div class="settings-container"><p>Nickname is ${this.ME.nickname}</p><input @input=${this.changeName} type="text" value="${this.ME.nickname}" maxlength="20"></div>`; 
        const codes = html`<div class="settings-container"><p>Destroy and Unlock</p><button @click="${this.clickOnCodes}" class="danger">Setup</button></div>`;
        const notifications = html`<div class="settings-container"><p>Notifications</p><button @click="${this.clickOnNotifications}">Activate</button></div>`;

        return html`<h1>Settings</h1>${nickname}${notifications}${codes}`;
    }
}

export default customElements.define('settings-menu', SettingsMenu);
