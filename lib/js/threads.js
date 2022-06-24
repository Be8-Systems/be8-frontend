import { LitElement } from 'lit';
import { isPhone, icons, mockupPartner, domCache } from './data/data.js';

class Threads extends LitElement {
    static properties = {
        threads: {},
    };

    constructor () {
        super();
        this.threads = [mockupPartner, {
            ...mockupPartner,
            sender: '213213',
            nickname: 'Berni',
            endless: true,
            text: 'guten morgen'
        }];
        this.addEventListener('click', (e) => this.clickOnThreads(e));
    }

    clickOnThreads (e) {
        const parent = e.target.expire ? e.target : e.target.closest('.thread');
        const sender = parent.getAttribute('sender');
        const thread = this.threads.find(t => t.sender === sender);

        if (isPhone) {
            domCache.navi.classList.add('hide');
            domCache.messages.classList.remove('hide');
            domCache.header.classList.add('hide');
            domCache.bottomNavi.classList.add('hide');
        }

        domCache.messages.conversationPartner = thread;
        domCache.messages.focus();
    }

    createRenderRoot () {
        return this; // prevents creating a shadow root
    }

    render () {
        const HTML = this.threads.map(({ expire, nickname, sender, text, threadID, ts, type }) => {
            const icon = `<i class="fa-solid fa-${icons[type]}"></i>`;
            return `<div expire="${expire}" id="${threadID}" sender="${sender}" type="${type}" class="thread hover-background">${icon}<div><p>${nickname} <span class="float-right">#${sender}<span></p><p>${text.substring(0, 9)}… <span class="float-right">${new Date(ts).toISOString()}</span></p></div></div>`;        
        }).join('');

        this.innerHTML = HTML;
    }
}

export default customElements.define('threads-menu', Threads);
