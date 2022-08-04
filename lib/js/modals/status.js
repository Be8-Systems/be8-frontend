import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import Modal from './modal';

class StatusModal extends Modal {
    static properties = {
        status: { type: Array },
        groupMembers: { type: Array },
        type: { type: String },
        ME: { type: Object }
    };

    constructor () {
        super();

        this.isGroup = false;
        this.status = [];
        this.groupMembers = [];
    }

    createRenderRoot () {
        return this; // prevents creating a shadow root
    }

    #renderGroup () {
        const member = this.groupMembers.filter(member => member.id !== this.ME.id);
        const memberSent = member.filter(i => !this.status.find(statu => statu === i.id));
        const memberRead = member.filter(i => this.status.find(statu => statu === i.id));
        const render = (member) => {
            return html`<li class="group-color-${member.color}">${member.memberIcon} ${member.nickname} #${member.id}</li>`;
        };
        const sent = repeat(memberSent, memberSent => memberSent.id, render);
        const read = repeat(memberRead, memberRead => memberRead.id, render);

        return html`<div class="read-container"><h2>Read <i class="fa-solid fa-check read-check float-right"><i class="fa-solid fa-check read-check float-right"></i></h2><ul>${read}</ul></div><div><h2>Not read  <i class="fa-solid fa-check sent-check float-right"></i></h2><ul>${sent}</ul></div>`;
    }

    render () {
        if (this.type === 'group') {
            return super.render(this.#renderGroup());
        }

        return super.render(`groups only`);
    }

}

export default customElements.define('status-modal-window', StatusModal);