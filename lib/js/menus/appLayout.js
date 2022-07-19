import { LitElement, html } from 'lit';
import { isPhone, domCache } from '../data/data.js';
import { memberIcons } from '../data/icons.js';
import LANG from '../data/lang';
import ME from '../data/me';

function isActiveMenu (div) {
    return div.classList.contains('active-setting');
}

function removeActiveMenu (container) {
    const user = container.querySelector('header i.fa-circle-user');
    const divs = [...container.querySelectorAll('.bottom-navi div.active-setting')];

    divs.forEach(div => div.classList.remove('active-setting'));
    user.classList.remove('active-setting');
}

class AppLayout extends LitElement {
    static properties = {
        ME: { type: Object },
    };

    #menus = {
        settingsMenu: {},
        messagesMenu: {},
        userMenu: {},
    };
    #threads = {};
    #userGroupModal = document.querySelector('groupuser-modal-window');
    #modal = document.querySelector('modal-window');
    #inviteModal = document.querySelector('invite-modal-window');
    #panicModal = document.querySelector('panic-modal-window');
    #converModal = document.querySelector('conversation-modal-window');
    #lockModal = document.querySelector('lock-modal-window');
    #codesModal = document.querySelector('codes-modal-window');

    set ME (val) {
        Object.values(this.#menus).forEach(function (menu) {
            menu.ME = val;
        }); 

        this.#userGroupModal.ME = val;
        this.#codesModal.ME = val;
        this.#lockModal.ME = val;
        this.#panicModal.ME = val;
        this.#inviteModal.ME = val;
        this.#converModal.ME = val;
        this.requestUpdate('ME', val);
    }

    constructor () {
        super();
        this.ME = ME;
    }

    createRenderRoot () {
        return this; // prevents creating a shadow root
    }

    clickOnChat (e) {
        const div = e.target.tagName === 'DIV' ? e.target : e.target.parentNode;

        if (isActiveMenu(div)) {
            return;
        }

        this.setActiveMenu('messagesMenu');
        removeActiveMenu(this);
    }

    clickOnUser ({ target }) {
        if (isActiveMenu(target)) {
            return;
        }

        this.setActiveMenu('userMenu');
        removeActiveMenu(this);
        target.classList.add('active-setting');
    }

    clickOnSettings (e) {
        const div = e.target.tagName === 'DIV' ? e.target : e.target.parentNode;

        if (isActiveMenu(div)) {
            return;
        }

        this.setActiveMenu('settingsMenu');
        removeActiveMenu(this);
        div.classList.add('active-setting');
    }

    setActiveMenu (menu) {
        Object.values(this.#menus).forEach(function (menu) {
            if (!menu.classList.contains('hide')) {
                menu.classList.add('hide');
            }
        });

        if (isPhone && menu !== 'messagesMenu') {
            domCache.navi.classList.add('hide');
            this.querySelector('main').classList.add('settings-mobile-menu-active');
        }
        if (isPhone && menu === 'messagesMenu') {
            domCache.navi.classList.remove('hide');
            this.querySelector('main').classList.remove('settings-mobile-menu-active');
            return;
        }
        if (this.#menus[menu] && this.#menus[menu].classList.contains('hide')) {
            return this.#menus[menu].classList.remove('hide');
        }
    }

    clickOnNewConv () {
        return this.#converModal.open();
    }

    clickOnInvite () {
        return this.#inviteModal.open('join');
    }

    clickOnPanic () {
        return this.#panicModal.open(); 
    }

    openWelcomeWindow ({ id, nickname }) {
        return this.#modal.setAndOpen({ HTML: `<h1>Welcome to Be8</h1><p>your new ID is <i class="highlight-color">#${id}</i>, your nickname is <i class="highlight-color">${nickname}</i>. Everything gets deleted after 30 Days you can create as many accs as you want.</p>` });
    }

    firstUpdated () {
        super.connectedCallback();

        const menus = {
            messagesMenu: this.querySelector('messages-menu'),
            settingsMenu: this.querySelector('settings-menu'),
            userMenu: this.querySelector('user-menu'),
        };

        domCache.app = this;
        domCache.menus = menus;
        domCache.threads = this.querySelector('threads-menu');
        domCache.settings = this.querySelector('settings-menu');
        domCache.user = this.querySelector('user-menu');
        domCache.navi = this.querySelector('nav');
        domCache.header = this.querySelector('header');
        domCache.bottomNavi = this.querySelector('.bottom-navi');
        domCache.toast = document.querySelector('toast-notification');

        this.#menus = menus;
        this.#threads = this.querySelector('threads-menu');

        requestAnimationFrame(function () {
            if (isPhone) {
                return;
            }
            
            menus.messagesMenu.focus();
        });
    }

    async openLockModal (done) {
        return this.#lockModal.open(done);
    }

    setGroupMember ({ members, valid }) {
        if (!valid) {
            return;
        }
        
        this.#userGroupModal.members = members.map(function (member, i) {
            member.memberIcon = memberIcons[i <= 16 ? i : i - 16];
            member.color = i + 1;

            return member;
        });
    }

    getConversationPartner () {
        return this.#menus.messagesMenu.conversationPartner;
    }

    insertImage (image) {
        return this.#menus.messagesMenu.insertImage(image);
    }

    setMessages (messages) {
        this.#menus.messagesMenu.messages = messages.filter(m => m.valid); 
        this.#menus.messagesMenu.scrollToBottom();
    }

    setThreads (threads) {
        this.#threads.threads = threads;
        this.#threads.bootStrap();
    }

    clickOnThread ({ partner }) {
        this.#threads.querySelector(`[partner="${partner}"]`)?.click();
    }

    getConversationPartners () {
        return this.#threads.threads.map(t => t.partner).filter(id => id !== 's1');
    }

    render () {
        const header = html`<header><i @click=${(e) => this.clickOnUser(e)} class="fa-solid fa-circle-user hover-font"></i><i @click="${(e) => this.clickOnNewConv(e)}" class="fa-solid fa-pen-clip float-right hover-font"></i></header>`;
        const bottomNavi = html`<div class="bottom-navi"><div @click=${(e) => this.clickOnChat(e)} class="active-setting hover-font"><i class="fa-solid fa-comments"></i><small>${LANG.THREADSTITLE}</small></div><div @click="${(e) => this.clickOnSettings(e)}" class="hover-font"><i class="fa-solid fa-gears"></i><small>Settings</small></div><div @click="${(e) => this.clickOnInvite(e)}" class="hover-font"><i class="fa-solid fa-plus"></i><small>Invite</small></div><div @click="${(e) => this.clickOnPanic(e)}" class="hover-font"><i class="fa-solid fa-bomb"></i><small>Panic</small></div></div>`;
        const menus = html`<messages-menu class="${isPhone ? 'hide' : ''}"></messages-menu><settings-menu class="hide"></settings-menu><user-menu class="hide"></user-menu>`; 

        return html`${header}<nav><h1 class="chats-headline unselectable">Chats</h1><threads-menu></threads-menu></nav>${bottomNavi}<main>${menus}</main>`;
    }
}

export default customElements.define('app-layout', AppLayout);
