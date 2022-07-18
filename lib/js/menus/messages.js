import { LitElement, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { isPhone, domCache } from '../data/data.js';
import lang from '../data/lang.js';
import { userIcons } from '../data/icons.js';
import { SYSTEMMESSAGES } from '../data/systemmessages.js';
import { randomString } from '../utils';

const maxImageSize = 2097152; // 2mb

class Messages extends LitElement {
    static properties = {
        conversationPartner: { type: Object },
        messages: { type: Array },
        ME: { type: Object }
    };

    #inputActive = true;
    #userModal = document.querySelector('user-modal-window');
    #userGroupModal = document.querySelector('groupuser-modal-window');
    #userSysModal = document.querySelector('sysuser-modal-window');
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
        if (this.conversationPartner.type === 'user') {
            this.#userModal.conversationPartner = this.conversationPartner;
            this.#userModal.open();  
        }  
        if (this.conversationPartner.type === 'group') {
            this.#userGroupModal.conversationPartner = this.conversationPartner;
            this.#userGroupModal.open();  
        }  
        if (this.conversationPartner.type === 'system') {
            this.#userSysModal.conversationPartner = this.conversationPartner;
            this.#userSysModal.open();  
        }  
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
        requestAnimationFrame(() => this.#messageInput.focus());
    }

    firstUpdated () {
        this.#messageInput = this.querySelector('.write-message-input');
        this.#uploadButton = document.querySelector('.fa-photo-film');
    }

    writeMessage (e) {
        if (e.key === 'Enter' && this.#inputActive) {
            const text = this.#messageInput.value.trim();
            const isGroup = !!this.conversationPartner.groupID;
            const receiver =  this.conversationPartner.partner;
            const writeEvent = new CustomEvent('writeMessage', {
                bubbles: false,
                detail: {
                    text: this.#messageInput.value,
                    sender: this.ME.id,
                    receiver,
                    threadID: this.conversationPartner.threadID,
                    isGroup,
                    messageType: 'text',
                    done: () => {
                        this.#inputActive = true;
                        this.#messageInput.value = ''; // to prevent double ^ insert after enter
                        return this.#focus();
                    }
                }
            });

            this.#inputActive = false;

            if (text.length === 0) {
                return;
            }

            return domCache.app.dispatchEvent(writeEvent);
        }
    }

    uploadMedia () {
        this.querySelector('input[type="file"]').click();
    }

    scrollToBottom () {
        requestAnimationFrame(() => { 
            const messages = this.querySelector('.messages'); 

            messages.scrollTop = messages.scrollHeight;
        });
    }

    #sendImage (content) {
        const uploadEvent = new CustomEvent('uploadMedia', {
            bubbles: false,
            detail: {
                contentID: randomString(),
                contentType: 'image',
                content,
                isGroup: !!this.conversationPartner.groupID,
                receiver: this.conversationPartner.partner,
                sender: this.ME.id,
                threadID: this.conversationPartner.threadID,
                messageType: 'image',
                done: () => {}
            }
        });
        
        return domCache.app.dispatchEvent(uploadEvent); 
    }

    #generateImageBlob (file) {
        const reader = new FileReader(); 
        const imgTag = document.createElement('img');
        const url = URL.createObjectURL(file);
    
        reader.onload = () => {         
            imgTag.src = url;
        
            imgTag.onload = () => {
                this.#sendImage(reader.result);
                return URL.revokeObjectURL(url);         
            };
        };
        
        return reader.readAsDataURL(file);
    }

    insertImage (image) {
        const domImage = this.querySelector(`[data-contentid="${image.contentID}"]`);
        const spinner = domImage.previousSibling;

        if (!spinner) {
            return;
        }

        domImage.setAttribute('src', image.content);
        return domImage.parentNode.removeChild(spinner);
    }

    changeInputEvent ({ target }) {
        const file = [...target.files][0];

        if (file.size >= maxImageSize) {
            domCache.toast.notification = {
                type: 'error',
                text: 'Max allowed file size for images is 2mb. Please choose a smaller one.',
            };
            
            return domCache.toast.open();
        }
    
        this.#generateImageBlob(file);
        target.setAttribute('value', ''); // allow double upload of the same picture        
        target.value = null;
    }

    renderWriteContainer () {
        return html`<div class="write-container"><input @keydown="${this.writeMessage}" class="write-message-input" type="text" maxlength="1000"><div><i @click="${this.uploadMedia}" class="fa-solid fa-photo-film hover-font"></i><input class="hide" @change="${this.changeInputEvent}" type="file" accept="image/png, image/gif, image/jpeg"></div></div>`;
    }

    renderConversationPartner () {
        const check = this.conversationPartner.endless ? html`<i class="fa-solid fa-check"></i>` : '';
        const icon = html`<i class="fa-solid fa-${userIcons[this.conversationPartner.type]}"></i>`;
        const idIndicator = this.conversationPartner.type !== 'system' ? html`<span>#${this.conversationPartner.id || this.conversationPartner.groupID}</span>` : '';
        const name = html`<p @click="${this.clickOnUser}" class="hover-font">${icon} ${this.conversationPartner.nickname}</p> ${idIndicator}`;
        const back = html`<i @click="${this.clickOnBack}" class="fa-solid fa-arrow-left ${isPhone ? '' : 'shrink-to-zero'}"></i>`;
        const user = html`<div class="conversation-partner-user">${name}${check}</div>`; 

        return html`<div class="conversation-partner">${back}${user}</div>`;
    }

    #renderMessageContent (message, timeIndicator) {
        if (message.messageType === 'image') {
            return html`<i class="fa-solid fa-spin fa-circle-notch"></i><img data-contentid="${message.contentID}" src="">`;
        }

        return html`<p class="message-text">${message.text} ${timeIndicator}</p>`;
    }

    #renderStatusIndicator (amIsender, status, isGroup) {
        if (!amIsender) {
            return '';
        }
        if (!isGroup && status.length === 1) {
            return html`&nbsp;&nbsp;<i class="fa-solid fa-check read-check"></i><i class="fa-solid fa-check read-check"></i>`;
        }
        if (isGroup && this.#userGroupModal.members.every(m => status.includes(m.id) || m.id === this.ME.id)) {
            return html`&nbsp;&nbsp;<i class="fa-solid fa-check read-check"></i><i class="fa-solid fa-check read-check"></i>`;
        }

        return html`&nbsp;&nbsp;<i class="fa-solid fa-check sent-check"></i>`;
    }

    #getNicknameLine (message) {
        const { nickname, id, memberIcon, color } = this.#userGroupModal.members.find(member => member.id === message.sender);
        return html`<p class="group-color-${color} message-top-line"><span>${memberIcon} ${nickname}</span>&nbsp;&nbsp;<span>#${id}</span></p>`;
    }

    #renderRemoveMessage ({ sender }) {
        const amIsender = sender === this.ME.id;
        return html`<div class="message-container"><div class="message ${amIsender ? 'sent-message' : 'received-message'}">${lang.MESSAGEREMOVED}</div></div>`; 
    }

    #renderUserMessage (message, isGroup) {
        const { messageID, nickname, sender, status, ts } = message;
        const amIsender = sender === this.ME.id; 
        const dateTime = new Date(ts);
        const time = dateTime.toLocaleTimeString();
        const firstLine = isGroup && !amIsender ? this.#getNicknameLine(message) : '';
        const statusIndicator = this.#renderStatusIndicator(amIsender, status, isGroup);
        const thirdLine = html`<small class="message-bottom-line float-right unselectable">${time}${statusIndicator}</small>`;
        const secondLine = this.#renderMessageContent(message, thirdLine);

        return html`<div alt="${nickname}" data-messageid="${messageID}" class="message-container"><div class="message ${amIsender ? 'sent-message' : 'received-message'}">${firstLine}${secondLine}</div></div>`; 
    }

    #renderSysMessage (message) {
        const dateTime = new Date(message.ts);
        const time = dateTime.toLocaleTimeString();
        const secondLine =  SYSTEMMESSAGES[message.text]
                                .replace('{{extra1}}', message.extra1)
                                .replace('{{extra2}}', message.extra2)
                                .replace('{{extra3}}', message.extra3)
                                .replace('{{id}}', this.ME.id)
                                .replace('{{threadID}}', message.threadID)
                                .replace('{{nickname}}', this.ME.nickname)
                                .replace('{{conversationID}}', this.conversationPartner.partner);
        const thirdLine = html`<p><small class="float-right unselectable">${time}</small></p>`;

        return html`<div alt="${message.nickname}" data-messageid="${message.messageID}" class="message-container system-message"><div class="message"><p>${unsafeHTML(secondLine)}</p>${thirdLine}</div></div>`; 
    }
    
    render () {
        const isGroup = this.conversationPartner.type === 'group';
        const messages = repeat(this.messages, message => message.messageID, (message) => {
            const isSysMessage = message.messageType === 'system';

            if (message.messageType === 'removed') {
                return this.#renderRemoveMessage(message);
            }
            if (isSysMessage) {
                return this.#renderSysMessage(message);
            }

            return this.#renderUserMessage(message, isGroup);
        });
        const messagesContainer = html`<div class="messages">${messages}</div>`;

        return html`${this.renderConversationPartner()}${messagesContainer}${this.renderWriteContainer()}`;
    }
}

export default customElements.define('messages-menu', Messages);
