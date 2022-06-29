import { LitElement, html } from 'lit';
import { isPhone, icons, domCache } from './data/data.js';
import { repeat } from 'lit-html/directives/repeat.js';

class Messages extends LitElement {
    static properties = {
        conversationPartner: { type: Object },
        messages: { type: Array },
        ME: { type: Object }
    };

    #userModal = {};
    #messageInput = {};

    constructor () {
        super();
        this.conversationPartner = {};
        this.messages = [];
    }

    createRenderRoot () {
        return this; // prevents creating a shadow root
    }

    // only triggerable via mobile
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

    setInput (text = '') {
        return this.#messageInput.value = text;   
    }

    focus () {
        return this.#messageInput.focus();
    }

    firstUpdated () {
        this.#messageInput = this.querySelector('.write-message-input');
        this.#userModal = document.querySelector('user-modal-window');
    }

    writeMessage (e) {
        if (e.keyCode === 13) {
            const message = this.#messageInput.value.trim();

            this.#messageInput.value = '';

            return console.log(message);
        }
    }

    uploadMedia () {
        return console.log('upload');
    }

    scrollToBottom () {
        requestAnimationFrame(() => { 
            const messages = this.querySelector('.messages'); 

            messages.scrollTop = messages.scrollHeight;
        });
    }

    renderWriteContainer () {
        return html`<div class="write-container"><input @keydown="${this.writeMessage}" class="write-message-input" type="text" maxlength="1000"><div><i @click="${this.uploadMedia}" class="fa-solid fa-photo-film hover-font"></i></div></div>`;
    }

    renderConversationPartner () {
        const check = this.conversationPartner.endless ? html`<i class="fa-solid fa-check"></i>` : '';
        const icon = html`<i class="fa-solid fa-${icons[this.conversationPartner.type]}"></i>`;
        const name = html`<p @click="${this.clickOnUser}" class="hover-font">${icon} ${this.conversationPartner.nickname} #${this.conversationPartner.id}</p>`;
        const back = html`<i @click="${this.clickOnBack}" class="fa-solid fa-arrow-left ${isPhone ? '' : 'shrinkToZero'}"></i>`;
        const user = html`<div class="conversation-partner-user">${name}${check}</div>`; 

        return html`<div class="conversation-partner">${back}${user}</div>`;
    }

    #renderSecondLine ({ text, type, contentID }) {
        if (type === 'imageMessage') {
            const image = 'data:image/png;base64,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';
            return html`<img data-contentid="${contentID}" src="${image}">`;
        }

        return html`<p>${text}</p>`;
    }

    #renderStatusIndicator (amIsender, status, isGroup) {
        if (!amIsender) {
            return '';
        }
        if (!isGroup && status.length === 1) {
            return html`&nbsp;&nbsp;<i class="fa-solid fa-check"></i><i class="fa-solid fa-check"></i>`;
        }
        if (false) { // implement group logic

        }

        return html`&nbsp;&nbsp;<i class="fa-solid fa-check"></i>`;
    }

    render () {
        const isGroup = this.conversationPartner.type === 'group';
        const messages = repeat(this.messages, message => message.messageID, (message) => {
            const { messageID, nickname, sender, status, ts } = message;
            const dateTime = new Date(ts);
            const amIsender = sender === this.ME.id; 
            const time = dateTime.toLocaleTimeString();
            const firstLine = html``;
            const secondLine = this.#renderSecondLine(message);
            const statusIndicator = this.#renderStatusIndicator(amIsender, status, isGroup);
            const thirdLine = html`<p><small class="float-right unselectable">${time}${statusIndicator}</small></p>`;
            
            return html`<div alt="${nickname}" data-messageid="${messageID}" class="message-container"><div class="message ${amIsender ? 'sent-message' : 'received-message'}">${firstLine}${secondLine}${thirdLine}</div></div>`; 
        });
        const messagesContainer = html`<div class="messages">${messages}</div>`;

        return html`${this.renderConversationPartner()}${messagesContainer}${this.renderWriteContainer()}`;
    }
}

export default customElements.define('messages-menu', Messages);
