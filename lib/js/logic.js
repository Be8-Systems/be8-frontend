import { POST, GET } from './data/header'; 
import { generatePassword, randomNickname } from './utils';

const app = document.querySelector('app-layout');

function sanitizeMe (accObj) {
    accObj.codes = accObj.codes === 'true';

    app.ME = accObj;
}

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
                sanitizeMe(data.accObj);
                app.openWelcomeWindow(data.accObj);
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
    
        sanitizeMe(accObj);
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
        }
        
        return detail.error();
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
    fetch('/destroyacc', GET).then(raw => raw.json())
        .then(({ valid }) => valid ? detail.done() : false);
});
app.addEventListener('inviteGenerated', function () {
    fetch('/invitelink', {
        ...POST,
        body: JSON.stringify({
            type: 'join', 
            sentInviteLink: true
        })
    }).then(raw => raw.json());
});
app.addEventListener('changeNickName', function ({ detail }) {
    fetch('/changenickname', {
        ...POST,
        body: JSON.stringify(detail)
    }).then(raw => raw.json()).then(function (data) {
        if (data.valid) {
            fetch('/me', GET).then(raw => raw.json()).then(data => sanitizeMe(data.accObj));
        }
    });
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
app.addEventListener('updateCode', function ({ detail }) {
    fetch('/codeupdate', {
        ...POST,
        body: JSON.stringify(detail)
    }).then(raw => raw.json()).then(function ({ valid, reason }) {
        if (reason === 'OLDCODEWRONG') {
            return detail.oldCodeWrong();
        }
        if (valid) {
            return detail.done();
        }
    }).catch(console.error);
});
app.addEventListener('setStatus', function ({ detail }) {
    fetch('/statusset', { ...POST, body: JSON.stringify(detail) });
});
app.addEventListener('setToken', function ({ detail }) {
    fetch('/endlessvalidate', {
        ...POST,
        body: JSON.stringify({ token: detail.token })
    }).then(raw => raw.json()).then(function (data) {
        if (data.valid && data.validate) {
            return fetch('/me', GET).then(raw => raw.json())
                .then(function (meData) {
                    sanitizeMe(meData.accObj);
                    return detail.success();
                });
        }
        if (data.error === 'TOKENNOTEXIST') {
            return detail.wrongToken();
        }
        if (!data.valid && data.tokenInUse) {
            return detail.tokenInUse();
        }
    });
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