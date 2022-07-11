import { html } from 'lit';
import { userIcons } from '../data/icons';
import ME from '../data/lang';
import Modal from './modal';

class SysUsermodal extends Modal {
    static properties = {
        conversationPartner: { type: Object }
    };
    
    constructor () {
        super();
        this.conversationPartner = ME;
    }
    
    render () {
        const icon = html`<i class="fa-solid fa-${userIcons.system}"></i>`;
        const hl = html`<p class="create-group-headline">${icon} ${this.conversationPartner.nickname}</p>`;
        const content = html`${hl}<p>This is a system user you can't send messages to the system user.</p>`;

        return super.render(content);
    }
}

export default customElements.define('sysuser-modal-window', SysUsermodal);