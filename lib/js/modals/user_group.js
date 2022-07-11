import { html } from 'lit';
import { domCache } from '../data/data';
import { groupMemberIcons, userIcons } from '../data/icons';
import { repeat } from 'lit-html/directives/repeat.js';
import { sanitizeTime } from '../utils';
import ME from '../data/lang';
import Modal from './modal';

const maxGroupUser = 20;

class GroupUsermodal extends Modal {
    static properties = {
        ME: {},
        conversationPartner: { type: Object },
        members: { type: Array }
    };

    constructor () {
        super();
        this.conversationPartner = ME;
        this.members = [];
    }

    #addUser () {
        const addUserEvent = new CustomEvent('addGroupMember', {
            detail: {
                ...this.conversationPartner
            }
        });

        if (this.members.length >= maxGroupUser) {
            domCache.toast.notification = {
                type: 'error',
                text: 'Group is full, max size of groups is currently ' + maxGroupUser,
            };
            
            return domCache.toast.open();
        }
        
        return domCache.app.dispatchEvent(addUserEvent);
    }

    #inviteUser () {

    }

    #leaveGroup () {
        console.log('leaveGroup');
    }

    #renderGroupSettings () {
        const isPrivate = this.conversationPartner.groupType === 'private';
        const invite = isPrivate ? '' : html`<div class="hover-font" @click="${this.#inviteUser}"><i class="fa-solid fa-person-circle-plus"></i> Invite User</div>`;

        return html`<div class="group-actions"><div @click="${this.#addUser}" class="hover-font"><i class="fa-solid fa-plus"></i> Add User</div>${invite}<div class="hover-font" @click="${this.#leaveGroup}"><i class="fa-solid fa-person-through-window"></i> Leave Group</div></div>`;
    }

    render () {
        const color = this.conversationPartner.groupType === 'public' ? 'orange-background' : 'danger-background';
        const hl = html`<p class="create-group-headline"> <small class="group-type-badge ${color} float-left">${this.conversationPartner.groupType}</small> ${this.conversationPartner.nickname}</p>`;
        const settings = this.#renderGroupSettings();
        const members = repeat(this.members, members => members.id, ({ nickname, id, expire, endless }) => {
            const endlessIcon = endless || isSystem ? html`<i class="fa-solid fa-check danger-color"></i>` : '';
            const amIAdmin = this.ME.id === id;
            const kick = amIAdmin ? '' : html`<span class="float-right hover-font">kick</span>`;
            const icon = html`<i class="fa-solid fa-${groupMemberIcons[amIAdmin ? 'admin' : 'user']}"></i>`;

            return html`<div class="group-member hover-background">${icon}<p class="member-firstline">${nickname} ${endlessIcon}<span class="float-right">#${id}</span></p><p class="member-secondline">${sanitizeTime(expire)}${kick}</p></div>`;
        });
        const content = html`${hl}<div class="group-members">${members}</div>${settings}`;

        return super.render(content);
    }
}

export default customElements.define('groupuser-modal-window', GroupUsermodal);