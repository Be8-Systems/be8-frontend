import { POST, GET } from './data/header'; 
import { generatePassword, randomNickname } from './utils';

const app = document.querySelector('app-layout');

function firstTimeVisitor () {
    fetch('/newacc', { 
        ...POST,
        body: JSON.stringify({
            ...generatePassword(),
            nickname: randomNickname()
        })
    }).then(raw => raw.json()).then(function (data) {
        if (data.valid) {
            return fetch('/me', GET).then(raw => raw.json()).then(function (data) {
                app.ME = data.accObj;
            });
        }
     
        console.log(data);
    }).catch();
};

function accAlreadyExists () {
    fetch('/codehas', GET).then(raw => raw.json()).then(function (data) {
        if (data.valid && data.hasCode) {
            return app.openLockModal();
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('/me', GET).then(raw => raw.json()).then(function ({ error, accObj }) {
        if (error === 'NOTAUTH') {
            return firstTimeVisitor();
        }   

        accAlreadyExists(accObj);
        app.ME = accObj;
    }).catch(console.error);
});
app.addEventListener('threadSelect', function ({ detail }) {
    console.log(detail);
    if (detail.id === '3') {
        //app.setMessages(messages);
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