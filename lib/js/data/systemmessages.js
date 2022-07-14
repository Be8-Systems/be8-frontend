export const SYSTEMMESSAGES = Object.freeze({
    WELCOME: 'Welcome to Be8, your nickname is <i class="highlight-color">{{nickname}}</i>. Be8 is the first ever real privacy messenger. Everything is End-to-End encrypted, only your device knows your key! Everything gets deleted after 30 days even your account, but you can create as much accounts as you want. Your id is <i class="highlight-color">#{{id}}</i>. You can find your expire date on the top left. Have fun.',
    STARTCONVERSATION: 'Start conversation with <i class="highlight-color">#{{conversationID}}</i>',
    CREATEDGROUP: 'You created a new group with the id <i class="highlight-color">{{extra1}}</i> and name <i class="highlight-color">{{extra2}}</i>',
    ADDEDTOGROUP: '<i class="highlight-color">{{extra3}}</i> with id <i class="highlight-color">#{{extra1}}</i> added you to group {{extra2}}',
    ACCADDEDTOGROUP: '<i class="highlight-color">{{extra1}}</i> id <i class="highlight-color">#{{extra2}}</i> was added to the group.',
    ACCJOINEDGROUP: '<i class="highlight-color">{{extra2}}</i> with id <i class="highlight-color">{{extra1}}</i> joined {{threadID}}.',
    ACCDELETED: 'Account <i class="highlight-color">#{{extra1}}</i> has been destroyed.',
    CHANGENICKNAME: 'You nickname was changed from <i class="highlight-color">{{extra1}}</i> to <i class="highlight-color">{{extra2}}</i>',
    LEFTGROUP: 'You left group <i class="highlight-color">{{extra2}}</i> with id <i class="highlight-color">#{{extra1}}</i>.',
    ACCLEFTGROUP: '<i class="highlight-color">{{extra2}}</i> with id <i class="highlight-color">#{{extra1}}</i> left <i class="highlight-color">{{threadID}}</i>.',
    KICKEDFROMGROUP: 'You were kicked from group <i class="highlight-color">{{extra2}}</i> with id <i class="highlight-color">#{{extra1}}</i>',
    ACCKICKEDFROMGROUP: '<i class="highlight-color">{{extra2}}</i> with id <i class="highlight-color">#{{extra1}}</i> was kicked from <i class="highlight-color">{{threadID}}</i>.',
    GROUPDELETED: 'Group <i class="highlight-color">{{extra2}}</i> with id <i class="highlight-color">#{{extra1}}</i> was deleted.',
});

// max 30 chars, yeah intendation like this is no allowed
// but in this case it helps to figure out how long your title is.
export const SYSTEMTITLES = Object.freeze({
    WELCOME:           'Welcome to the Be8 messenger',
    STARTCONVERSATION: 'A new conversation started',
    CREATEDGROUP:      'You created a new group',
    ADDEDTOGROUP:      'You were added to the group',
    ACCADDEDTOGROUP:   'User was added to the group',
    ACCJOINEDGROUP:    'Acc joined group',
    ACCDELETED:        'Account you know is destroyed',
    CHANGENICKNAME:    'Your nickname has changed',
    LEFTGROUP:         'An user left the group',
    KICKEDFROMGROUP:   'You were kicked from a group',
    ACCLEFTGROUP:      'Acc left group',
    ACCKICKEDFROMGROUP:'User was kicked from group',
    GROUPDELETED:      'Group was deleted',
    SENTIMAGE:         '🌆 You sent an image',
    RECEIVEDIMAGE:     '🌆 You received an image' 
});
