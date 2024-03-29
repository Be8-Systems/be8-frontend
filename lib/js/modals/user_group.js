import { html } from 'lit';
import { domCache } from '../data/data';
import LANG from '../data/lang';
import { groupMemberIcons } from '../data/icons';
import { repeat } from 'lit-html/directives/repeat.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { isKeyDownNumber, animateMainToSide, animateSideToMain, generateSafeLink, sanitizeTime } from '../utils';
import ME from '../data/lang';
import Modal from './modal';
import lang from '../data/lang';

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
        const event = new CustomEvent('inviteGenerated', {
            detail: {
                sentInviteLink: true,
                type: 'group'
            }
        }); 
        navigator.clipboard.writeText(this.inviteUrl).then(() => {});

        this.state = 'invite';
        animateMainToSide(this.#modalContent, this.#inviteGroupSide);
        return domCache.app.dispatchEvent(event);
    }

    #leaveGroup () {
        this.state = 'leaveGroup';
        animateMainToSide(this.#modalContent, this.#leaveGroupSide);
    }

    open () {        
        const qr = this.querySelector('.qr'); 

        if (qr) {
            qr.innerHTML = '';
            new QRCode(qr, { text: this.inviteUrl });
        }

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

    #sendAddGroupUser (id, input) {
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
                    
                    input.value = '';

                    domCache.toast.open();
                    return this.close();
                },
                warning: (reason) => {
                    domCache.toast.notification = {
                        type: 'warning',
                        text: lang[reason],
                    };
                    
                    return domCache.toast.open();
                }
            }
        });

        return domCache.app.dispatchEvent(event);
    }

    enterBe8Id (e) {
        if (!isKeyDownNumber(e)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
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
 
            return this.#sendAddGroupUser(id,  e.target);
        }
    }

    #clickOnLeaveGroup () {
        const event = new CustomEvent('leaveGroup', {
            bubbles: false,
            detail: {
                ...this.conversationPartner,
                ...this.Me,
                done: () => {
                    return this.close();
                }
            }
        });

        return domCache.app.dispatchEvent(event);
    }

    #renderGroupSettings (amIAdmin) {
        const isPrivate = this.conversationPartner.groupType === 'private';
        const invite = isPrivate ? '' : html`<div class="sub-modal-button hover-background" @click="${this.#inviteUser}"><i class="fa-solid fa-person-circle-plus"></i> Invite User <i class="fa-solid fa-arrow-right float-right"></i></div>`;
        const addUser = amIAdmin || !isPrivate ? html`<div @click="${this.#addUser}" class="sub-modal-button hover-background"><i class="fa-solid fa-plus"></i> Add Member <i class="fa-solid fa-arrow-right float-right"></i></div>` : ''; 

        return html`<div class="group-actions">${addUser}${invite}<div class="sub-modal-button hover-background" @click="${this.#leaveGroup}"><i class="fa-solid fa-person-through-window"></i> Leave Group <i class="fa-solid fa-arrow-right float-right"></i></div></div>`;
    }

    #renderSideGroup (amIAdmin) {
        const isPrivate = this.conversationPartner.groupType === 'private'; 
        const url = generateSafeLink('group', this.conversationPartner.groupID);
        const backToMain = html`<i @click="${this.#clickOnBackToMain}" class="fa-solid fa-arrow-left float-left hover-font"></i>`;
        const addUser = html`<div class="adduser-group-modal hide"><p class="create-group-headline">${backToMain} Add new Member</p><small>Enter a valid be8 id.</small><input @keydown="${e => this.enterBe8Id(e)}" type="number" min="0"></div>`;
        const leaveText = amIAdmin ? LANG.LEAVEGROUPADMIN : LANG.LEAVEGROUPMEMBER;
        const leaveGroup = html`<div class="leave-group-modal hide"><p class="create-group-headline">${backToMain} Leave Group</p><small>${leaveText}</small><div class="leave-group-settings"><button @click="${this.#clickOnLeaveGroup}" class="danger-background">Yes</button><button @click="${this.close}" class="hover-background">No</button></div></div>`;
        const invite = isPrivate ? '' : html`<div class="invite-group-modal hide"><p class="create-group-headline">${backToMain} Invite Friends to your Group</p><p>${unsafeHTML(LANG.INVITELINK.replaceAll('{{link}}', url))}</p><br /><div class="qr"></div><br /></div>`;

        this.inviteUrl = url;

        return html`${addUser}${invite}${leaveGroup}`;
    }

    #clickOnKick (e) {
        const accID = e.target.getAttribute('data-id');
        const event = new CustomEvent('kickMemberFromGroup', {
            bubbles: false,
            detail: {
                ...this.conversationPartner,
                accID,
                done: () => {
                    domCache.toast.notification = {
                        type: 'success',
                        text: 'You kicked ' + accID + ' someone from your group',
                    };
                    
                    return domCache.toast.open();
                }
            }
        });

        return domCache.app.dispatchEvent(event);
    }

    render () {
        const color = this.conversationPartner.groupType === 'public' ? 'orange-background' : 'danger-background';
        const hl = html`<p class="create-group-headline"> <small class="group-type-badge ${color} float-left">${this.conversationPartner.groupType}</small> ${this.conversationPartner.nickname}</p>`;
        const amIAdmin = this.ME.id === this.conversationPartner.admin;
        const settings = this.#renderGroupSettings(amIAdmin);
        const members = repeat(this.members, members => members.id, ({ nickname, id, expire, endless, type }) => {
            const isSystem = type === 'system';
            const endlessIcon = endless || isSystem ? html`<i class="fa-solid fa-check danger-color"></i>` : '';
            const isMe = this.ME.id === id;
            const kick = amIAdmin && !isMe ? html`<span data-id="${id}" @click="${this.#clickOnKick}" class="float-right hover-font">kick</span>` : '';
            const isUserAdmin = this.conversationPartner.admin === id;
            const icon = html`<i class="fa-solid fa-${groupMemberIcons[isUserAdmin ? 'admin' : 'user']}"></i>`;

            return html`<div class="group-member hover-background">${icon}<p class="member-firstline">${nickname} ${endlessIcon}<span class="float-right">#${id}</span></p><p class="member-secondline">${sanitizeTime(expire)}${kick}</p></div>`;
        });
        const maxMembers = html`<p>Members: ${this.members.length} / ${this.conversationPartner.maxMembers}</p>`;
        const content = html`${hl}${maxMembers}<div class="group-members">${members}</div>${settings}`;
        const sideContent = this.#renderSideGroup(amIAdmin); 

        return super.render(content, sideContent);
    }
}

export default customElements.define('groupuser-modal-window', GroupUsermodal);