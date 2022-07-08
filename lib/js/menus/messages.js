import { LitElement, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { isPhone, icons, domCache } from '../data/data.js';
import SYSTEMMESSAGES from '../data/systemmessages.js';
import { sanitizeTime } from '../utils.js';

class Messages extends LitElement {
    static properties = {
        conversationPartner: { type: Object },
        messages: { type: Array },
        ME: { type: Object }
    };

    #userModal = {};
    #messageInput = {};
    #uploadButton = {};

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

    setActive ({ type }) {
        const isSystem = type === 'system';

        this.#focus();
        this.setInput();
        
        if (isSystem) {
            if (!this.#uploadButton.classList.contains('disabled')) {
                this.#uploadButton.classList.add('disabled');
                this.#uploadButton.classList.add('hover-font');
            }

            this.#messageInput.disabled = true;
        } else {
            if (this.#uploadButton.classList.contains('disabled')) {
                this.#uploadButton.classList.remove('disabled');
                this.#uploadButton.classList.remove('hover-font');
            }

            this.#messageInput.disabled = false;
        }
    }

    setInput (text = '') {
        return this.#messageInput.value = text;   
    }

    #focus () {
        return this.#messageInput.focus();
    }

    firstUpdated () {
        this.#messageInput = this.querySelector('.write-message-input');
        this.#userModal = document.querySelector('user-modal-window');
        this.#uploadButton = document.querySelector('.fa-photo-film');
    }

    writeMessage (e) {
        if (e.keyCode === 13) {
            const message = this.#messageInput.value.trim();
            const writeEvent = new CustomEvent('writeMessage', {
                bubbles: false,
                detail: {
                    message,
                    ...this.ME
                }
            });

            this.#messageInput.value = '';

            return domCache.app.dispatchEvent(writeEvent);
        }
    }

    uploadMedia () {
        const writeEvent = new CustomEvent('uploadMedia', {
            bubbles: false,
            detail: {
                ...this.ME
            }
        });
        
        return domCache.app.dispatchEvent(writeEvent);
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
        const idIndicator = this.conversationPartner.type !== 'system' ? html`#${this.conversationPartner.id}` : '';
        const name = html`<p @click="${this.clickOnUser}" class="hover-font">${icon} ${this.conversationPartner.nickname} ${idIndicator}</p>`;
        const back = html`<i @click="${this.clickOnBack}" class="fa-solid fa-arrow-left ${isPhone ? '' : 'shrinkToZero'}"></i>`;
        const user = html`<div class="conversation-partner-user">${name}${check}</div>`; 

        return html`<div class="conversation-partner">${back}${user}</div>`;
    }

    #renderSecondLine ({ text, type, contentID, ts }) {
        if (type === 'imageMessage') {
            return html`<img data-contentid="${contentID}" src="">`;
        }
        if (type === 'system') {console.log(this.conversationPartner);
            const sanText = SYSTEMMESSAGES[text].replace('{{ts}}', sanitizeTime(ts))
                                                .replace('{{id}}', this.ME.id)
                                                .replace('{{nickname}}', this.ME.nickname)
                                                .replace('{{conversationID}}', this.conversationPartner.sender);
            return html`<p>${unsafeHTML(sanText)}</p>`
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
        /*if (false) { // implement group logic

        }*/

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
