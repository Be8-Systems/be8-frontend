import { LitElement, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { isPhone, domCache } from '../data/data.js';
import lang from '../data/lang.js';
import { userIcons } from '../data/icons.js';
import { SYSTEMMESSAGES } from '../data/systemmessages.js';
import { randomString, findUrls } from '../utils';

const maxImageSize = 2097152; // 2mb

class Messages extends LitElement {
    static properties = {
        conversationPartner: { type: Object },
        messages: { type: Array },
        ME: { type: Object }
    };

    #userModal = document.querySelector('user-modal-window');
    #userGroupModal = document.querySelector('groupuser-modal-window');
    #userSysModal = document.querySelector('sysuser-modal-window');
    #statusModal = document.querySelector('status-modal-window');
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
                this.#uploadButton.classList.remove('hover-font');
            }

            this.#messageInput.disabled = true;
        } else {
            if (this.#uploadButton.classList.contains('disabled')) {
                this.#uploadButton.classList.remove('disabled');
                this.#uploadButton.classList.add('hover-font');
            }

            this.#messageInput.disabled = false;
        }
    }

    setInput (text = '') {
        return this.#messageInput.value = text;   
    }

    #focus () {
        if (!isPhone) {
            requestAnimationFrame(() => this.#messageInput.focus());
        }
    }

    firstUpdated () {
        this.#messageInput = this.querySelector('.write-message-input');
        this.#uploadButton = document.querySelector('.fa-photo-film');
    }

    writeMessage (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            const text = this.#messageInput.value.trim();
            const isGroup = !!this.conversationPartner.groupID;
            const receiver =  this.conversationPartner.partner;
            const groupOptions = { 
                groupID: this.conversationPartner.groupID, 
            };
            const writeEvent = new CustomEvent('writeMessage', {
                bubbles: false,
                detail: {
                    text: this.#messageInput.value,
                    nickname: this.ME.nickname,
                    sender: this.ME.id,
                    endless: this.ME.endless,
                    receiver,
                    threadID: this.conversationPartner.threadID,
                    type: isGroup ? 'group' : 'user',
                    ...(isGroup ? groupOptions : {}),
                    messageType: 'text',
                    done: () => {
                        this.#messageInput.disabled = false;
                        this.#messageInput.value = ''; // to prevent double ^ insert after enter
                        return this.#focus();
                    }
                }
            });

            if (text.length === 0) {
                return;
            }

            this.#messageInput.disabled = true;
            return domCache.app.dispatchEvent(writeEvent);
        }
    }

    uploadMedia () {
        this.querySelector('[type="file"]').click();
    }

    scrollToBottom () {
        requestAnimationFrame(() => { 
            const messages = this.querySelector('.messages'); 
            const diff = messages.scrollHeight -  messages.scrollTop;

            if (diff < 350) {
                messages.scrollTop = messages.scrollHeight;
            }
        });
    }

    #sendImage (content, imgTag) {
        const isGroup = !!this.conversationPartner.groupID;
        const groupOptions = { 
            groupID: this.conversationPartner.groupID, 
        };
        const uploadEvent = new CustomEvent('uploadMedia', {
            bubbles: false,
            detail: {
                contentID: randomString(),
                contentType: 'image',
                content,
                imgHeight: imgTag.height,
                imgWidth: imgTag.width,
                isGroup,
                receiver: this.conversationPartner.partner,
                nickname: this.ME.nickname,
                sender: this.ME.id,
                threadID: this.conversationPartner.threadID,
                messageType: 'image',
                ...(isGroup ? groupOptions : {}),
                type: isGroup ? 'group' : 'user' ,
                done: () => {
                    this.#uploadButton.classList.add('fa-photo-film');
                    this.#uploadButton.classList.remove('disabled', 'fa-circle-notch', 'fa-spin');
                }
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
                this.#sendImage(reader.result, imgTag);
                return URL.revokeObjectURL(url);         
            };
        };
        
        return reader.readAsDataURL(file);
    }

    isImageRendered (message) {
        const img = this.querySelector(`img[data-contentid="${message.contentID}"]`);
        return img?.getAttribute('data-rendered') === 'true';
    }

    insertImage (image) {
        const domImage = this.querySelector(`[data-contentid="${image.contentID}"]`);
        const spinner = domImage?.previousSibling;

        if (!spinner) {
            return;
        }

        domImage.style = '';
        domImage.parentNode.setAttribute('href', image.content);
        domImage.setAttribute('data-rendered', true);
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

        this.#uploadButton.classList.remove('fa-photo-film');
        this.#uploadButton.classList.add('fa-circle-notch', 'fa-spin', 'disabled');
    
        this.#generateImageBlob(file);
        target.setAttribute('value', ''); // allow double upload of the same picture        
        target.value = null;
    }

    renderWriteContainer () {
        return html`<div class="write-container"><textarea placeholder="write a new message" @keydown="${this.writeMessage}" class="write-message-input" type="text" maxlength="1000"></textarea><div><i @click="${this.uploadMedia}" class="fa-solid fa-photo-film hover-font"></i><input class="hide" @change="${this.changeInputEvent}" type="file" accept="image/png, image/gif, image/jpeg"></div></div>`;
    }

    renderConversationPartner () {
        const check = this.conversationPartner.endless ? html`<i class="fa-solid fa-check"></i>` : '';
        const icon = html`<i class="fa-solid fa-${userIcons[this.conversationPartner.type]}"></i>`;
        const idIndicator = this.conversationPartner.type !== 'system' ? html`<span>#${this.conversationPartner.id || this.conversationPartner.groupID}</span>` : '';
        const name = html`<p @click="${this.clickOnUser}" class="hover-font">${icon} ${this.conversationPartner.nickname} ${idIndicator}</p> `;
        const back = html`<i @click="${this.clickOnBack}" class="fa-solid fa-arrow-left ${isPhone ? '' : 'shrink-to-zero'}"></i>`;
        const user = html`<div class="conversation-partner-user">${name}${check}</div>`; 

        return html`<div class="conversation-partner">${back}${user}</div>`;
    }
    
    #renderTextWithURL (text, urls, timeIndicator) {
        let lastText = text;
        const parts = urls.flatMap(function (url) {
            const urlHTML = `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
            const [firstText, ...rest] = lastText.split(url);

            lastText = rest.join(url);
            
            return [firstText, unsafeHTML(urlHTML)];
        });

        parts.push(lastText);

        return html`<p class="message-text">${parts} ${timeIndicator}</p>`;
    }

    #renderTextContent ({ text }, timeIndicator) {
        const urls = findUrls(text);

        if (urls.length === 0) {
            return html`<p class="message-text">${text} ${timeIndicator}</p>`;
        }

        return this.#renderTextWithURL(text, urls, timeIndicator);
    }

    #renderMessageContent (message, timeIndicator) {
        if (message.messageType === 'image') {
            return html`<a href="" download="${message.contentID}.png"><i class="fa-solid fa-spin fa-circle-notch"></i><img download="${message.contentID}" style="height:500px" data-contentid="${message.contentID}" data-rendered="false" src=""></a><p>${timeIndicator}</p>`;
        }

        return this.#renderTextContent(message, timeIndicator);
    }

    #viewStatus (status, isGroup) {
        this.#statusModal.status = status;
        this.#statusModal.groupMembers = this.#userGroupModal.members;
        this.#statusModal.type = isGroup ? 'group' : 'unkown';

        if (!isGroup) {
            return;
        }

        return this.#statusModal.open();
    }

    #renderStatusIndicator (amIsender, status, isGroup) {
        if (!amIsender) {
            return '';
        }
        if (!isGroup && status.length === 1) {
            return html`&nbsp;&nbsp;<i class="fa-solid fa-check read-check"></i><i class="fa-solid fa-check read-check"></i>`;
        }
        if (isGroup && this.#userGroupModal.members.every(m => status.includes(m.id) || m.id === this.ME.id)) {
            return html`&nbsp;&nbsp;<i @click="${() => this.#viewStatus(status, isGroup)}" class="fa-solid fa-check read-check hover-cursor"></i><i @click="${() => this.#viewStatus(status, isGroup)}" class="fa-solid fa-check read-check hover-cursor"></i>`;
        }
        if (isGroup) {
            return html`&nbsp;&nbsp;<i @click="${() => this.#viewStatus(status, isGroup)}" class="fa-solid fa-check sent-check hover-cursor"></i>`;
        }

        return html`&nbsp;&nbsp;<i class="fa-solid fa-check sent-check"></i>`;
    }

    #getNicknameLine (message) {
        const { nickname, id, memberIcon, color, endless } = this.#userGroupModal.members.find(member => member.id === message.sender);
        const endlessIcon = endless ? html`<i class="fa-solid fa-check danger-color"></i>` : '';

        return html`<p class="group-color-${color} message-top-line"><span>${memberIcon} ${nickname} ${endlessIcon}</span>&nbsp;&nbsp;<span>#${id}</span></p>`;
    }

    #renderRemoveMessage ({ sender }) {
        const amIsender = sender === this.ME.id;
        return html`<div class="message-container"><div class="message ${amIsender ? 'sent-message' : 'received-message'}"><p><i class="fa-solid fa-trash-can"></i>&nbsp;${lang.MESSAGEREMOVED}</p></div></div>`; 
    }

    #renderUserMessage (message, isGroup) {
        const { messageID, sender, status, ts } = message;
        const amIsender = sender === this.ME.id; 
        const firstLine = isGroup && !amIsender ? this.#getNicknameLine(message) : '';
        const statusIndicator = this.#renderStatusIndicator(amIsender, status, isGroup);
        const dateTime = new Date(ts);
        const time = dateTime.toLocaleTimeString();
        const thirdLine = html`<small class="message-bottom-line float-right unselectable">${time}${statusIndicator}</small>`;
        const secondLine = this.#renderMessageContent(message, thirdLine);

        return html`<div data-messageid="${messageID}" class="message-container"><div class="message ${amIsender ? 'sent-message' : 'received-message'} message-${message.messageType}">${firstLine}${secondLine}</div></div>`; 
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
