import { POST, GET } from './data/header'; 
import { generatePassword, randomNickname } from './utils';
import database from './database';
import Be8 from 'be8-engine';

const app = document.querySelector('app-layout');

function sanitizeBooleansInMe (accObj) {
    accObj.codes = accObj.codes === 'true';
    accObj.endless = accObj.endless === 'true';

    app.ME = accObj;
}

async function generateEngine ({ id }, generateKeys = false) {
    globalThis.be8 = new Be8(id, database);

    if (generateKeys) {
        await be8.setup();
    }
}

async function getThreads () {
    const raw = await fetch('/getthreads', GET);
    const { valid, threads } = await raw.json();

    if (!valid) {
        return;
    }

    return app.setThreads(threads);
} 

async function firstTimeVisitor () {
    const raw = await fetch('/newacc', { 
        ...POST,
        body: JSON.stringify({
            ...generatePassword(),
            nickname: randomNickname()
        })
    });
    const data = await raw.json();

    if (data.valid) {
        const raw = await fetch('/me', GET);
        const { accObj } = await raw.json();

        sanitizeBooleansInMe(accObj);
        await generateEngine(accObj, true);
        await getThreads();
        return app.openWelcomeWindow(accObj);
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    const { error, accObj } = await fetch('/me', GET).then(raw => raw.json());

    if (error === 'NOTAUTH') {
        return await firstTimeVisitor();
    }   

    generateEngine(accObj);
    sanitizeBooleansInMe(accObj);
    await app.openLockModal(() => getThreads());
});
app.addEventListener('unlock', async function ({ detail }) {
    const raw = await fetch('/codeunlock', {
        ...POST,
        body: JSON.stringify(detail)
    });
    const { valid, isValid, isDestroyCode } = await raw.json();

    if (isDestroyCode) {
        location.reload();
    }
    if (valid && isValid) {
        return detail.done();
    }
    
    return detail.error();
});
app.addEventListener('panic', async function ({ detail }) {
    const raw = await fetch('/destroyacc', GET);
    const { valid } = await raw.json();
    
    return valid ? detail.done() : false;
});
app.addEventListener('inviteGenerated', async function ({ detail }) {
    await fetch('/invitelink', { ...POST, body: JSON.stringify(detail) });
});
app.addEventListener('changeNickName', async function ({ detail }) {
    const raw = await fetch('/changenickname', {
        ...POST,
        body: JSON.stringify(detail)
    });
    const data = await raw.json(); 

    if (data.valid) {
        const raw = await fetch('/me', GET);
        const { accObj }  = await raw.json();
      
        return sanitizeBooleansInMe(accObj);
    }
});
app.addEventListener('setupCodes', async function ({ detail }) {
    const raw = await fetch('/codeset', {
        ...POST,
        body: JSON.stringify(detail)
    });
    const data = await raw.json(); 

    if (data.valid) {
        return detail.done();
    }
});
app.addEventListener('updateCode', async function ({ detail }) {
    const raw = await fetch('/codeupdate', {
        ...POST,
        body: JSON.stringify(detail)
    });
    const { valid, reason } = await raw.json();

    if (reason === 'OLDCODEWRONG') {
        return detail.oldCodeWrong();
    }
    if (valid) {
        return detail.done();
    }
});
app.addEventListener('setStatus', async function ({ detail }) {
    await fetch('/statusset', { ...POST, body: JSON.stringify(detail) });
});
app.addEventListener('setToken', async function ({ detail }) {
    const raw = await fetch('/endlessvalidate', {
        ...POST,
        body: JSON.stringify({ token: detail.token })
    });
    const data = await raw.json();

    if (data.valid && data.validate) {
        const raw = await fetch('/me', GET);
        const { accObj } = await raw.json();

        sanitizeBooleansInMe(accObj);
        return detail.success();
    }
    if (data.error === 'TOKENNOTEXIST') {
        return detail.wrongToken();
    }
    if (!data.valid && data.tokenInUse) {
        return detail.tokenInUse();
    }
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

export default function () {}