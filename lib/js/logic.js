import { messages, partner, me } from './data/mockup';

document.addEventListener('DOMContentLoaded', function () { 
    const app = document.querySelector('app-layout');
    const lockModal = document.querySelector('lock-modal-window');

    setTimeout(function () {
        console.log('me update');
        app.ME = me;
        lockModal.ME = me; 

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
        app.setMessages(messages);

        lockModal.open();
    }, 1000);
});

export default function () {}