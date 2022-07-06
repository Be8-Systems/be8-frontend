import { messages, partner, me } from './data/mockup';
 
const app = document.querySelector('app-layout');

document.addEventListener('DOMContentLoaded', function () {
    app.ME = me;
    app.openLockModal();
    app.setThreads([partner, {
        ...partner,
        sender: '2',
        id: '2',
        threadID: '2:1337',
        nickname: 'Karl',
        endless: true,
        ts: (() => {
            const now = new Date(); 
            now.setTime(now.getTime() - 1000 * 60 * 60 * 24 + 1);
            return now;
        })(),
        text: 'Guten Morgen, ich bin gerade am weg'
    }, {
        ...partner,
        sender: '3',
        id: '3',
        nickname: 'Dieter',
        threadID: '3:1337',
        endless: true,
        ts: 'Mon Jun 20 2022 06:01:34 GMT+0000 (Coordinated Universal Time)',
        text: 'Kannst du mir bitte deine'
    }]);
});
app.addEventListener('threadSelect', function ({ detail }) {
    console.log(detail);
    if (detail.id === '3') {
        app.setMessages(messages);
    }
});
app.addEventListener('writeMessage', function ({ detail }) {
    console.log(detail);
});
app.addEventListener('uploadMedia', function ({ detail }) {
    console.log(detail);
});
app.addEventListener('panic', function ({ detail }) {
    console.log(detail);
});
app.addEventListener('inviteGenerated', function ({ detail }) {
    console.log(detail);
});
app.addEventListener('changeNickName', function ({ detail }) {
    console.log(detail);
});
app.addEventListener('setupCodes', function ({ detail }) {
    console.log(detail);
});
app.addEventListener('updateDestroy', function ({ detail }) {
    console.log(detail);
});
app.addEventListener('updateUnlock', function ({ detail }) {
    console.log(detail);
});
app.addEventListener('setStatus', function ({ detail }) {
    console.log(detail);
});
app.addEventListener('setToken', function ({ detail }) {
    console.log(detail);
    //detail.wrongToken();
    detail.success();
});
app.addEventListener('newConversation', function ({ detail }) {
    console.log(detail);
    detail.success();
    //detail.idDoesNotExist();
});
app.addEventListener('createGroup', function ({ detail }) {
    console.log(detail);
    detail.success();
});



export default function () {}