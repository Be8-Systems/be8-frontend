import { LitElement, html, css } from 'lit';
import { isPhone } from './data.js';

class Threads extends LitElement {
    #icons = Object.freeze({
        user: 'user',
        group: 'users-between-lines"></i>',
        channel: 'object-intersect'
    });
    #activeThreads = [];

    constructor () {
        super();
    }

    createRenderRoot () {
        return this; // prevents creating a shadow root
    }

    #_addThreads (threads) {
        const HTML = threads.map(({ expire, nickname, sender, status, text, threadID, ts, type }) => {
            const icon = `<i class="fa-solid fa-${this.#icons[type]}"></i>`;
            return `<div class="thread">${icon}<p>${nickname} <span>#${sender}<span></p></div>`;        
        });

        this.innerHTML = HTML;
    }

    addThreads (threads) {
        if (!threads || threads.length === 0){
            return;
        }
        
        return this.#_addThreads(threads);
    }
}

export default customElements.define('threads-menu', Threads);
