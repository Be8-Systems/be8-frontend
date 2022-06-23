import { LitElement, html } from 'lit';

const modal = document.querySelector('modal-window');

class SettingsMenu extends LitElement {
    static properties = {
        name: {},
    };
      
    constructor () {
        super();
        this.name = 'Anon';
    }

    createRenderRoot () {
        return this; // prevents creating a shadow root
    }

    clickOnNotifications () {
        console.log('Notifications');
    }

    clickOnCodes () {
        return modal.setAndOpen({ HTML: 'Codes' }); 
    }

    changeName (event) {
        const input = event.target;
        this.name = input.value;
    }

    render () {
        const nickname = html`<div class="settings-container"><p>Nickname is ${this.name}</p><input @input=${this.changeName} type="text" value="${this.name}" maxlength="20"></div>`; 
        const codes = html`<div class="settings-container"><p>Destroy and Unlock</p><button @click="${this.clickOnCodes}" class="danger">Setup</button></div>`;
        const notifications = html`<div class="settings-container"><p>Notifications</p><button @click="${this.clickOnNotifications}">Activate</button></div>`;

        return html`<h1>Settings</h1>${nickname}${notifications}${codes}`;
    }
}

export default customElements.define('settings-menu', SettingsMenu);
