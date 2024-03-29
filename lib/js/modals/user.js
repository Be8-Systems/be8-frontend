import { html } from 'lit';
import { userIcons } from '../data/icons';
import { sanitizeTime } from '../utils';
import ME from '../data/lang';
import Modal from './modal';

class Usermodal extends Modal {
    static properties = {
        conversationPartner: { type: Object }
    };

    constructor () {
        super();
        this.conversationPartner = ME;
    }

    render () {
        const dateTime = sanitizeTime(this.conversationPartner.expire);
        const icon = html`<i class="fa-solid fa-${userIcons.user}"></i>`;
        const hl = html`<p class="create-group-headline">${icon} ${this.conversationPartner.nickname}</p>`;
        const id = html`<p><span>ID:</span> <span>${this.conversationPartner.id}</span></p>`;
        const nickname = html`<p><span>Nickname:</span> <span>${this.conversationPartner.nickname}</span></p>`;
        const status = html`<p><span>Status:</span> <span>"${this.conversationPartner.userStatus}"</span></p>`;
        const expire = this.conversationPartner.endless ? '' : html`<p><span>Valid Account:</span> <span>${dateTime}</span></p>`;
        const endlessIcon = this.conversationPartner.endless ? html`<i class="fa-solid fa-check danger-color"></i>` : html`<i class="fa-solid fa-times"></i>`;
        const endless = html`<p><span>Endless Account: </span>${endlessIcon}</p>`;
        const content = html`${hl}${id}${nickname}${expire}${endless}${status}`;

        return super.render(content);
    }
}

export default customElements.define('user-modal-window', Usermodal);