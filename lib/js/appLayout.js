import { LitElement, html } from 'lit';
import { isPhone, domCache } from './data/data.js';
import ME from './data/me';

const modal = document.querySelector('modal-window');
const inviteModal = document.querySelector('invite-modal-window');

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
    #menus = {
        settingsMenu: {},
        messagesMenu: {},
        userMenu: {},
    };
    
    constructor () {
        super();
    }

    createRenderRoot () {
        return this; // prevents creating a shadow root
    }

    clickOnChat (e) {
        const div = e.target.tagName === 'DIV' ? e.target : e.target.parentNode;

        if (isActiveMenu(div)) {
            return;
        }

        this.#setActiveMenu('messagesMenu');
        removeActiveMenu(this);
    }

    clickOnUser ({ target }) {
        if (isActiveMenu(target)) {
            return;
        }

        this.#setActiveMenu('userMenu');
        removeActiveMenu(this);
        target.classList.add('active-setting');
    }

    clickOnSettings (e) {
        const div = e.target.tagName === 'DIV' ? e.target : e.target.parentNode;

        if (isActiveMenu(div)) {
            return;
        }

        this.#setActiveMenu('settingsMenu');
        removeActiveMenu(this);
        div.classList.add('active-setting');
    }

    #setActiveMenu (menu) {
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

        if (this.#menus[menu]) {
            return this.#menus[menu].classList.remove('hide');
        }
    }

    clickOnNewConv () {
        return modal.setAndOpen({ HTML: 'new conv' });
    }

    clickOnInvite () {
        return inviteModal.open('join', ME.id);
    }

    clickOnPanic () {
        return modal.setAndOpen({ HTML: 'Panic' }); 
    }

    firstUpdated () {
        super.connectedCallback();
        this.#menus = {
            messagesMenu: this.querySelector('messages-menu'),
            settingsMenu: this.querySelector('settings-menu'),
            userMenu: this.querySelector('user-menu'),
        };
    }

    render () {
        const bottomNavi = html`<div class="bottom-navi"><div @click=${(e) => this.clickOnChat(e)} class="active-setting"><i class="fa-solid fa-comments"></i><small>Chats</small></div><div @click="${(e) => this.clickOnSettings(e)}"><i class="fa-solid fa-gears"></i><small>Settings</small></div><div @click="${(e) => this.clickOnInvite(e)}"><i class="fa-solid fa-plus"></i><small>Invite</small></div><div @click="${(e) => this.clickOnPanic(e)}"><i class="fa-solid fa-bomb"></i><small>Panic</small></div></div>`;
        const header = html`<header><i @click=${(e) => this.clickOnUser(e)} class="fa-solid fa-circle-user"></i><i @click="${(e) => this.clickOnNewConv(e)}" class="fa-solid fa-pen-clip float-right"></i></header>`;
        const menus = html`<messages-menu class="${isPhone ? 'hide' : ''}"></messages-menu><settings-menu class="hide"></settings-menu><user-menu class="hide"></user-menu>`; 

        return html`${header}<nav><h1 class="chats-headline">Chats</h1><threads-menu></threads-menu></nav>${bottomNavi}<main>${menus}</main>`;
    }
}

export default customElements.define('app-layout', AppLayout);
