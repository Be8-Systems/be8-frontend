import { LitElement, html } from 'lit';

const isPhone = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

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

        removeActiveMenu(this);
        div.classList.add('active-setting');
    }

    clickOnUser ({ target }) {
        if (isActiveMenu(target)) {
            return;
        }

        removeActiveMenu(this);
        target.classList.add('active-setting');
    }

    clickOnNewConv () {

    }

    clickOnSettings (e) {
        const div = e.target.tagName === 'DIV' ? e.target : e.target.parentNode;

        if (isActiveMenu(div)) {
            return;
        }

        removeActiveMenu(this);
        div.classList.add('active-setting');
    }

    clickOnInvite (e) {

    }

    clickOnPanic (e) {

    }

    render () {
        const bottomNavi = html`<div class="bottom-navi"><div @click=${(e) => this.clickOnChat(e)} class="active-setting"><i class="fa-solid fa-comments"></i><small>Chats</small></div><div @click="${(e) => this.clickOnSettings(e)}"><i class="fa-solid fa-gears"></i><small>Settings</small></div><div @click="${(e) => this.clickOnInvite(e)}"><i class="fa-solid fa-plus"></i><small>Invite</small></div><div @click="${(e) => this.clickOnPanic(e)}"><i class="fa-solid fa-bomb"></i><small>Panic</small></div></div>`;
        const header = html`<header><i @click=${(e) => this.clickOnUser(e)} class="fa-solid fa-circle-user"></i><i @click="${(e) => this.clickOnNewConv(e)}" class="fa-solid fa-pen-clip float-right"></i></header>`;
        const menus = html`<div class="messages-menu${isPhone ? ' hide' : ''}"></div><div class="settings-menu hide"></div><div class="user-menu hide"></div>`; 

        return html`${header}<nav><h1 class="chats-headline">Chats</h1><div class="threads"></div></nav>${bottomNavi}<main>${menus}</main>`;
    }
}

export default customElements.define('app-layout', AppLayout);
