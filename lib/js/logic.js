import { POST, GET } from './data/header'; 
import { generatePassword, randomNickname } from './utils';
import initialiseDB from './database';
import Be8 from 'be8-engine';

const app = document.querySelector('app-layout');
let be8 = {};

function refreshAPP (accObj) {
    app.ME = accObj;
}

async function generateEngine ({ id }) {
    const database = await initialiseDB();

    be8 = new Be8(id, database);
    return await be8.setup();
}

async function syncPublicKeys () {
    const cachedKeys = await be8.getCachedKeys();
    const cachedIDs = cachedKeys.map(acc => acc.accID);
    const accIDs = app.getConversationPartners().filter(id => !cachedIDs.find(cID => cID === id));

    if (accIDs.length === 0) {
        return; 
    }

    const raw = await fetch('/getkeys', {
        ...POST,
        body: JSON.stringify({ accIDs }),
    });
    const data = await raw.json();

    if (data.valid) {
        return await be8.addPublicKeys(data.publicKeys);
    }
}

async function getThreads () {
    const raw = await fetch('/getthreads', GET);
    const { valid, threads } = await raw.json();

    if (!valid) {
        return;
    }

    app.setThreads(threads);
    return await syncPublicKeys();
} 

async function storePublicKey () {
    const [{ publicKey }] = await be8.getCachedKeys();
    await fetch('/setkey', { 
        ...POST,
        body: JSON.stringify({ publicKey })
    });
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

        refreshAPP(accObj);
        await generateEngine(accObj);
        await storePublicKey();
        await getThreads();
        return app.openWelcomeWindow(accObj);
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    const { error, accObj } = await fetch('/me', GET).then(raw => raw.json());

    if (error === 'NOTAUTH') {
        return await firstTimeVisitor();
    }   

    refreshAPP(accObj);
    await generateEngine(accObj);
    return await app.openLockModal(() => getThreads());
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
    await be8.panic();
    const raw = await fetch('/destroyacc', GET);
    const { valid } = await raw.json();
    
    if (valid) { 
        return await detail.done();
    }
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
      
        return refreshAPP(accObj);
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

        refreshAPP(accObj);
        return detail.success(data);
    }
    if (data.error === 'TOKENNOTEXIST') {
        return detail.wrongToken();
    }
    if (!data.valid && data.tokenInUse) {
        return detail.tokenInUse();
    }
});
app.addEventListener('startConversation', async function ({ detail }) {
    const raw = await fetch('/startConversation', {
        ...POST,
        body: JSON.stringify(detail)
    });
    const data = await raw.json(); 

    if (data.valid) {
        return detail.success();
    }
    if (data.error === 'ACCNOTEXISTS') {
        return detail.idDoesNotExist();
    }
});
app.addEventListener('createGroup', async function ({ detail }) {
    const raw = await fetch('/groupcreate', {
        ...POST,
        body: JSON.stringify({ nickname: detail.nickname, groupType: detail.groupType })
    });
    const data = await raw.json();

    if (data.valid) {
        const raw = await fetch('/groupaddmember', {
            ...POST,
            body: JSON.stringify({ groupID: data.groupID, memberID: detail.id })
        });
        const addData = await raw.json();

        if (addData.valid) {
            return detail.success();
        }
    }
});
app.addEventListener('threadSelect', async function ({ detail }) {
    const raw = await fetch('/getmessages', {
        ...POST,
        body: JSON.stringify(detail)
    });
    const data = await raw.json();

    if (data.valid) {
        return app.setMessages(data.messages);
    }
});
app.addEventListener('writeMessage', async function ({ detail }) {
    await fetch('/writemessage', {
        ...POST,
        body: JSON.stringify(detail)
    });
});
app.addEventListener('uploadMedia', async function ({ detail }) {
    console.log(detail);
});

export default function () {}