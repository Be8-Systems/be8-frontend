import { html } from 'lit';
import { isKeyDownNumber, animateMainToSide, animateSideToMain } from '../utils';
import { domCache } from '../data/data';
import LANG from '../data/lang';
import Modal from './modal';

class ConversationModal extends Modal {
    #modalContent = {}; 
    #createGroup = {};
    #dialogInput = {};
    #groupNameInput = {}
    #groupType = {};

    constructor () {
        super();
    }

    createRenderRoot () {
        return this; // prevents creating a shadow root
    }

    open () {
        super.open();
        requestAnimationFrame(() => this.#dialogInput.focus());
    } 

    clickOnGoToGroup () {
        animateMainToSide(this.#modalContent, this.#createGroup, this.#dialogInput);
    }

    clickOnBackToMain () {
        animateSideToMain(this.#modalContent, this.#createGroup, this.#groupNameInput);
    }

    clickOnCreateGroup () {
        const name = this.#groupNameInput.value.trim();
        const type = this.#groupType.value;

        if (name.length === 0) {
            domCache.toast.notification = {
                type: 'error',
                text: 'Enter a valid name for your group',
            };
            
            return domCache.toast.open();
        }

        domCache.toast.notification = {
            type: 'success',
            text: 'You created the group ' + name,
        };
        
        domCache.toast.open();

        console.log(name, type);
        this.#groupNameInput.value = '';
        return this.close();
    }

    close () {
        super.close();
        this.clickOnBackToMain();
    }

    keyDownOn1to1 (e) {
        if (!isKeyDownNumber(e)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        if (e.keyCode === 13) {
            const id = this.#dialogInput.value.trim();

            if (id.length === 0) {
                domCache.toast.notification = {
                    type: 'error',
                    text: 'Enter a be8 id',
                };
                
                return domCache.toast.open();
            }

            domCache.toast.notification = {
                type: 'success',
                text: 'Your are now chatting with ' + id,
            };
            this.#dialogInput.value = '';

            domCache.toast.open();
            return this.close();
        }
    }

    firstUpdated () {
        this.#modalContent = this.querySelector('.modal-content'); 
        this.#createGroup = this.querySelector('.create-group-content');
        this.#dialogInput = this.#modalContent.querySelector('input');
        this.#groupNameInput = this.#createGroup.querySelector('input');
        this.#groupType = this.#createGroup.querySelector('select');
    }

    render () {
        const content = html`<p>${LANG.CONVERSATION}</p><input @keydown="${(e) => this.keyDownOn1to1(e)}" tabindex="0" type="text"><div @click="${this.clickOnGoToGroup}" class="sub-modal-button hover-background">Create a group <i class="fa-solid fa-arrow-right float-right"></i></div>`;
        const groupsettings = html`<div><p>Name</p><input type="text" maxlength="20"></div><p>Type</p><select><option value="public">public</option><option value="private">private</option></select><button @click="${this.clickOnCreateGroup}">create group</button>`;
        const group = html`<div class="create-group-content hide"><p class="create-group-headline"><i @click="${this.clickOnBackToMain}" class="fa-solid fa-arrow-left hover-font float-left"></i> <span>Create a group</span></p>${groupsettings}</div>`;

        return super.render(content, group);
    }
}

export default customElements.define('conversation-modal-window', ConversationModal);