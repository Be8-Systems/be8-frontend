import { LitElement, html } from 'lit';
import { isPhone, mockupPartner, icons, domCache } from './data/data.js';

class Messages extends LitElement {
    static properties = {
        conversationPartner: {},
    };

    #userModal = {};

    constructor () {
        super();
        this.conversationPartner = mockupPartner;
    }

    createRenderRoot () {
        return this; // prevents creating a shadow root
    }

    clickOnBack () {
        domCache.navi.classList.remove('hide');
        domCache.menus.messagesMenu.classList.add('hide');
        domCache.header.classList.remove('hide');
        domCache.bottomNavi.classList.remove('hide');
        domCache.bottomNavi.querySelector('div').classList.add('active-setting');
    }

    clickOnUser () {
        this.#userModal.conversationPartner = this.conversationPartner;
        this.#userModal.open();  
    }

    focus () {
        return this.querySelector('.write-message-input').focus();
    }

    firstUpdated () {
        this.#userModal = document.querySelector('user-modal-window');
    }

    renderWriteContainer () {
        return html`<div class="write-container"><input class="write-message-input" type="text" maxlength="1000"><div><i class="fa-solid fa-photo-film hover-font"></i></div></div>`;
    }

    renderConversationPartner () {
        const check = this.conversationPartner.endless ? html`<i class="fa-solid fa-check"></i>` : '';
        const icon = html`<i class="fa-solid fa-${icons[this.conversationPartner.type]}"></i>`;
        const name = html`<p @click="${this.clickOnUser}" class="hover-font">${this.conversationPartner.nickname} #${this.conversationPartner.id}</p>`;
        const back = html`<i @click="${this.clickOnBack}" class="fa-solid fa-arrow-left ${isPhone ? '' : 'shrinkToZero'}"></i>`;
        const user = html`<div class="conversation-partner-user">${icon}${name}${check}</div>`; 

        return html`<div class="conversation-partner">${back}${user}</div>`;
    }

    render () {
        const messagesContainer = html`<div class="messages"></div>`; 
        return html`${this.renderConversationPartner()}${messagesContainer}${this.renderWriteContainer()}`;
    }
}

export default customElements.define('messages-menu', Messages);
