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
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('/me', GET).then(raw => raw.json()).then(function ({ error, accObj }) {
        if (error === 'NOTAUTH') {
            return firstTimeVisitor();
        }   
        
        app.ME = accObj;
        return app.openLockModal();
    }).catch(console.error);
});
app.addEventListener('unlock', function ({ detail }) {
    fetch('/codeunlock', {
        ...POST,
        body: JSON.stringify(detail)
    }).then(raw => raw.json()).then(function ({ valid, isValid, isDestroyCode }) {
        if (isDestroyCode) {
            location.reload();
        }
        if (valid && isValid) {
            return detail.done();
        } else {
            return detail.error();
        }
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
    fetch('/codeset', {
        ...POST,
        body: JSON.stringify(detail)
    }).then(raw => raw.json()).then(function (data) {
        if (data.valid) {
            return detail.done();
        }
    });
});
app.addEventListener('updateDestroy', function ({ detail }) {
    console.log(detail);
});
app.addEventListener('updateUnlock', function ({ detail }) {
    console.log(detail);
});
app.addEventListener('setStatus', function ({ detail }) {
    fetch('/statusset', {
        ...POST,
        body: JSON.stringify(detail)
    }).then(raw => raw.json()).then(function (data) {
        if (data.valid) {
            return detail.done();
        }
    });
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