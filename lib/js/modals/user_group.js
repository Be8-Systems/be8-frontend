import { html } from 'lit';
import { domCache } from '../data/data';
import LANG from '../data/lang';
import { groupMemberIcons } from '../data/icons';
import { repeat } from 'lit-html/directives/repeat.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { animateMainToSide, animateSideToMain, generateSafeLink, sanitizeTime } from '../utils';
import ME from '../data/lang';
import Modal from './modal';

const maxGroupUser = 20;

class GroupUsermodal extends Modal {
    static properties = {
        ME: { type: Object },
        state: { type: String },
        conversationPartner: { type: Object },
        members: { type: Array },
        inviteUrl: { type: String }
    };

    #inviteGroupSide = {};
    #addUserSide = {};
    #leaveGroupSide = {};
    #modalContent = {};
    #addMemberId = {};

    constructor () {
        super();
        this.conversationPartner = ME;
        this.members = [];
    }

    #addUser () {
        this.state = 'addUser';
        animateMainToSide(this.#modalContent, this.#addUserSide, this.#addMemberId);
    }

    #inviteUser () {
        this.state = 'invite';
        animateMainToSide(this.#modalContent, this.#inviteGroupSide);
    }

    #leaveGroup () {
        this.state = 'leaveGroup';
        animateMainToSide(this.#modalContent, this.#leaveGroupSide);
    }

    #renderGroupSettings () {
        const isPrivate = this.conversationPartner.groupType === 'private';
        const invite = isPrivate ? '' : html`<div class="sub-modal-button hover-background" @click="${this.#inviteUser}"><i class="fa-solid fa-person-circle-plus"></i> Invite User <i class="fa-solid fa-arrow-right float-right"></i></div>`;

        return html`<div class="group-actions"><div @click="${this.#addUser}" class="sub-modal-button hover-background"><i class="fa-solid fa-plus"></i> Add Member <i class="fa-solid fa-arrow-right float-right"></i></div>${invite}<div class="sub-modal-button hover-background" @click="${this.#leaveGroup}"><i class="fa-solid fa-person-through-window"></i> Leave Group <i class="fa-solid fa-arrow-right float-right"></i></div></div>`;
    }

    open () {        
        const qr = this.querySelector('.qr'); 
        
        qr.innerHTML = '';
        new QRCode(qr, { text: this.inviteUrl });

        return super.open();
    }

    close () {
        super.close();
        this.#clickOnBackToMain();
    }

    #clickOnBackToMain () {
        if (this.state === 'invite') {
            animateSideToMain(this.#modalContent, this.#inviteGroupSide);
        }
        if (this.state === 'leaveGroup') {
            animateSideToMain(this.#modalContent, this.#leaveGroupSide);
        }
        if (this.state === 'addUser') {
            animateSideToMain(this.#modalContent, this.#addUserSide);
        }

        this.state = 'main';
    }

    firstUpdated () {
        this.#inviteGroupSide = this.querySelector('.invite-group-modal');
        this.#addUserSide = this.querySelector('.adduser-group-modal');
        this.#leaveGroupSide = this.querySelector('.leave-group-modal');
        this.#modalContent = this.querySelector('.modal-content');
        this.#addMemberId = this.querySelector('.adduser-group-modal input');
    }

    #sendAddGroupUser (id) {
        const event = new CustomEvent('addGroupMember', {
            bubbles: false,
            detail: {
                ...this.conversationPartner,
                id,
                done: () => {
                    domCache.toast.notification = {
                        type: 'success',
                        text: 'You added ' + id + ' to your group',
                    };
                    
                    domCache.toast.open();
                    return this.close();
                }
            }
        });

        return domCache.app.dispatchEvent(event);
    }

    enterBe8Id (e) {
        if (e.key === 'Enter') {
            const id = e.target.value.trim();

            if (id.length === 0) {
                domCache.toast.notification = {
                    type: 'error',
                    text: 'Enter a be8 id',
                };
                
                return domCache.toast.open();
            }
            if (id === this.ME.id) {
                domCache.toast.notification = {
                    type: 'error',
                    text: 'You can not chat with yourself.',
                };
                
                return domCache.toast.open();
            }
 
            return this.#sendAddGroupUser(id);
        }
    }

    #clickOnLeaveGroup () {
        const event = new CustomEvent('leaveGroup', {
            bubbles: false,
            detail: {
                ...this.conversationPartner,
                ...this.Me
            }
        });

        return domCache.app.dispatchEvent(event);
    }

    #renderSiderGroup (amIAdmin) {
        const url = generateSafeLink('group', this.conversationPartner.id);
        const backToMain = html`<i @click="${this.#clickOnBackToMain}" class="fa-solid fa-arrow-left float-left hover-font"></i>`;
        const addUser = html`<div class="adduser-group-modal hide"><p class="create-group-headline">${backToMain} Add new Member</p><small>Enter a valid be8 id.</small><input @keydown="${e => this.enterBe8Id(e)}" type="text"></div>`;
        const leaveText = amIAdmin ? LANG.LEAVEGROUPADMIN : LANG.LEAVEGROUPMEMBER;
        const leaveGroup = html`<div class="leave-group-modal hide"><p class="create-group-headline">${backToMain} Leave Group</p><small>${leaveText}</small><div class="leave-group-settings"><button @click="${this.#clickOnLeaveGroup}" class="danger-background">Yes</button><button @click="${this.close}" class="hover-background">No</button></div></div>`;
        const invite = html`<div class="invite-group-modal hide"><p class="create-group-headline">${backToMain} Invite Friends to your Group</p><p>${unsafeHTML(LANG.INVITELINK.replaceAll('{{link}}', url))}</p><br /><div class="qr"></div><br /></div>`;

        this.inviteUrl = url;

        return html`${addUser}${invite}${leaveGroup}`;
    }

    render () {
        const color = this.conversationPartner.groupType === 'public' ? 'orange-background' : 'danger-background';
        const hl = html`<p class="create-group-headline"> <small class="group-type-badge ${color} float-left">${this.conversationPartner.groupType}</small> ${this.conversationPartner.nickname}</p>`;
        const settings = this.#renderGroupSettings();
        const amIAdmin = this.ME.id === this.conversationPartner.admin;
        const members = repeat(this.members, members => members.id, ({ nickname, id, expire, endless, type }) => {
            const isSystem = type === 'system';
            const endlessIcon = endless || isSystem ? html`<i class="fa-solid fa-check danger-color"></i>` : '';
            const isMe = this.ME.id === id;
            const kick = isMe ? '' : html`<span class="float-right hover-font">kick</span>`;
            const icon = html`<i class="fa-solid fa-${groupMemberIcons[amIAdmin ? 'admin' : 'user']}"></i>`;

            return html`<div class="group-member hover-background">${icon}<p class="member-firstline">${nickname} ${endlessIcon}<span class="float-right">#${id}</span></p><p class="member-secondline">${sanitizeTime(expire)}${kick}</p></div>`;
        });
        const content = html`${hl}<div class="group-members">${members}</div>${settings}`;
        const sideContent = this.#renderSiderGroup(amIAdmin); 

        return super.render(content, sideContent);
    }
}

export default customElements.define('groupuser-modal-window', GroupUsermodal);