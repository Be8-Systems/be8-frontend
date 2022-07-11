import { LitElement } from 'lit';
import { isPhone, isDesktop, domCache } from '../data/data.js';
import { repeat } from 'lit-html/directives/repeat.js';
import renderThread from '../renderHelper/threads';

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

    #removeThreadReadIndicator (parent) {
        const readIndicator = parent.querySelector('.thread-read-indicator');

        if (!readIndicator.classList.contains('shrink-to-zero')) {
            readIndicator.classList.add('shrink-to-zero');
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

        domCache.menus.messagesMenu.messages = [];
        domCache.menus.messagesMenu.conversationPartner = thread;

        this.#removeThreadReadIndicator(parent);
        this.#setActiveThread(parent);
        domCache.menus.messagesMenu.setActive(thread);
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
        return repeat(this.threads, thread => thread.id, renderThread);
    }
}

export default customElements.define('threads-menu', Threads);
