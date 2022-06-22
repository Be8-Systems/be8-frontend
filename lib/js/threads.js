import { LitElement, html, css } from 'lit';
import { isPhone } from './data.js';

class Threads extends LitElement {
    #icons = Object.freeze({
        user: 'user',
        group: 'users-rectangle',
        channel: 'object-ungroup'
    });

    static properties = {
        threads: [],
    };

    constructor () {
        super();
        this.threads = [];
    }

    createRenderRoot () {
        return this; // prevents creating a shadow root
    }

    render () {
        const HTML = this.threads.map(({ expire, nickname, sender, status, text, threadID, ts, type }) => {
            const icon = `<i class="fa-solid fa-${this.#icons[type]}"></i>`;
            return `<div sender="${sender}" type="${type}" class="thread">${icon}<div><p>${nickname} <span class="float-right">#${sender}<span></p><p>${text.substring(0, 23)} <span class="float-right">${ts}</span></p></div></div>`;        
        }).join('');

        this.innerHTML = HTML;
    }
}

export default customElements.define('threads-menu', Threads);
