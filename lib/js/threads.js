import { LitElement, html } from 'lit';
import { isPhone, isDesktop, icons, domCache } from './data/data.js';
import { repeat } from 'lit-html/directives/repeat.js';
import { humanReadAbleLastTime } from './utils';

class Threads extends LitElement {
    static properties = {
        threads: { type: Array },
    };

    #bootStraped = false;

    constructor () {
        super();
        this.threads = [];
        this.addEventListener('click', (e) => this.clickOnThreads(e));
    }

    #setActiveThread (active) {
        if (isDesktop) {
            const oldActive = this.querySelector('.active-thread');

            oldActive?.classList.remove('active-thread');
            active?.classList.add('active-thread');
        }
    }

    clickOnThreads (e) {
        const parent = e.target.expire ? e.target : e.target.closest('.thread');
        const sender = parent.getAttribute('sender');
        const thread = this.threads.find(t => t.sender === sender);
        const threadEvent = new CustomEvent('threadSelect', {
            bubbles: false,
            detail: {
                ...thread,
            }
        });

        if (isPhone) {
            domCache.navi.classList.add('hide');
            domCache.menus.messagesMenu.classList.remove('hide');
            domCache.header.classList.add('hide');
            domCache.bottomNavi.classList.add('hide');
        }
        if (isDesktop) {
            domCache.app.clickOnChat(e);
            domCache.bottomNavi.querySelector('div').classList.add('active-setting');
        }

        this.#setActiveThread(parent);
        domCache.menus.messagesMenu.messages = [];
        domCache.menus.messagesMenu.conversationPartner = thread;
        domCache.menus.messagesMenu.focus();
        domCache.menus.messagesMenu.setInput();
        return domCache.app.dispatchEvent(threadEvent);
    }

    createRenderRoot () {
        return this; // prevents creating a shadow root
    }

    bootStrap () {
        requestAnimationFrame(() => {
            const firstThread = this.querySelector('.thread');

            if (!this.#bootStraped && firstThread && isDesktop) {
                firstThread.click();
                this.#bootStraped = true;
            }
        }); 
    }

    render () {
        return repeat(this.threads, thread => thread.id, ({ endless, expire, nickname, sender, text, threadID, ts, type }) => {
            const dateTime = humanReadAbleLastTime(ts);
            const icon = html`<i class="fa-solid fa-${icons[type]} thread-avatar"></i>`;
            const endlessIcon = endless ? html`<i class="fa-solid fa-check color-danger-font"></i>` : '';

            return html`<div expire="${expire}" id="${threadID}" sender="${sender}" type="${type}" class="thread hover-background">${icon}<div><p>${nickname}&nbsp;&nbsp;${endlessIcon}<span class="float-right">#${sender}<span></p><p>${text.substring(0, 23)}… <span class="float-right unselectable">${dateTime}</span></p></div></div>`; 
        });
    }
}

export default customElements.define('threads-menu', Threads);
