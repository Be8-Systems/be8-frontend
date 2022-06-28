import { html } from 'lit';
import { icons } from '../data/data';
import ME from '../data/lang';
import Modal from './modal';

class Usermodal extends Modal {
    static properties = {
        conversationPartner: {}
    };

    constructor () {
        super();

        this.conversationPartner = ME;
    }

    render () {
        const dateTime = new Date(this.conversationPartner.expire);
        const date = dateTime.toDateString();
        const time = dateTime.toLocaleTimeString();
        const icon = html`<i class="fa-solid fa-${icons[this.conversationPartner.type]}"></i>`;
        const hl = html`<p class="create-group-headline">${icon} ${this.conversationPartner.nickname}</p>`;
        const id = html`<p><span>ID:</span> <span>${this.conversationPartner.id}</span></p>`;
        const nickname = html`<p><span>Nickname:</span> <span>${this.conversationPartner.nickname}</span></p>`;
        const status = html`<p><span>Status:</span> <span>"${this.conversationPartner.status}"</span></p>`;
        const expire = html`<p><span>Valid Account:</span> <span>${date} ${time}</span></p>`;
        const endlessIcon = this.conversationPartner.endless ? html`<i class="fa-solid fa-check danger-color"></i>` : html`<i class="fa-solid fa-times"></i>`;
        const endless = html`<p><span>Endless until: </span>${endlessIcon}</p>`;
        const content = html`${hl}${id}${nickname}${status}${expire}${endless}`;

        return super.render(content);
    }
}

export default customElements.define('user-modal-window', Usermodal);