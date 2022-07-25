import { POST, GET } from './data/header'; 
import { isFirefox } from './data/data';
import { generatePassword, randomNickname, decryptSafeLink } from './utils';
import brokenimage from './data/brokenimage';
import setupSW from './registerServiceWorker';
import initialiseDB from './database';
import Be8 from 'be8-engine';
import sound from './sound';

const app = document.querySelector('app-layout');
const refreshAppComponent = (accObj) => app.ME = accObj;
const actions = Object.freeze({
    newMessage,
    messageRead,
    expiredAcc,
    newConversation,
    groupMemberRemove,
    groupJoin,
    groupCreate: newConversation
});
let be8 = {};

function setupSSE () {
    const source = new EventSource('/events');

    source.addEventListener('message', async function (e) {
        const data = JSON.parse(e.data);
        return await actions[data.action](data);
    }, false);
}

async function groupJoin (detail) {
    const isOpenConversation = detail.groupID === app.getConversationPartner().threadID;

    if (isOpenConversation) {
        await getMessages({ detail });
    }

    await getThreads();
}

async function groupMemberRemove (detail) {
    const isOpenConversation = detail.groupID === app.getConversationPartner().threadID;
    const isME = detail.leavingMember === be8.getAccID(); 

    if (isOpenConversation && !isME) {
        await getMessages({ detail });
    }
    if (isOpenConversation && isME) {
        app.clickOnThread({ partner: 's1' });
    }

    await getThreads();
}

async function newConversation (detail) {
    await getThreads();
    app.clickOnThread(detail);
}

async function expiredAcc (detail) {
    if (detail.threadID === app.getConversationPartner().threadID) {
        app.clickOnThread({ partner: 's1' });
    }

    return await getThreads();
}

async function newMessage (detail) {
    if (detail.threadID === app.getConversationPartner().threadID) {
        await getMessages({ detail });
    }
    if (document.hidden) {
        sound.messageReceived();
    }

    return await getThreads();
}

async function messageRead (detail) {
    if (detail.threadID === app.getConversationPartner().threadID) {
        await getMessages({ detail });
    }
}

async function generateEngine ({ id }, database) {
    be8 = new Be8(id, database);

    Object.freeze(be8);
    return await be8.setup();
}

async function startConversation ({ detail }) {
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
}

async function decryptImages (messages) {
    const imageMessages = messages.filter(function (message) {
        if (message.messageType === 'image') {
            return !app.isImageRendered(message);
        }
    });
    const imageProms = await imageMessages.map(async function (imageMessage) {
        const raw = await fetch('/imageget', {
            ...POST,
            body: JSON.stringify({
                contentID: imageMessage.contentID,
                threadID: imageMessage.threadID,
                sender: imageMessage.sender,
                messageID: imageMessage.messageID
            })
        });

        return await raw.json();
    });
    const images = await Promise.all(imageProms);
    const workingImages = images.filter(image => image.valid);
    const brokenImages = images.filter(image => !image.valid);
    const yourID = be8.getAccID();

    brokenImages.forEach(igM => app.insertImage({ ...igM, content: brokenimage }));
    workingImages.forEach((imageMessage) => {
        const dialogPublicId = imageMessage.sender === yourID ? imageMessage.receiver : imageMessage.sender;
        const idForPublicKey = imageMessage.groupVersionKey ? imageMessage.sender : dialogPublicId;
        const idForPrivateKey = imageMessage.groupVersionKey || yourID;

        return be8.decryptImageSimple(idForPublicKey, idForPrivateKey, imageMessage.content, imageMessage.iv).then(function (content) { 
            return app.insertImage({ ...imageMessage, content });
        });
    });
}

async function decryptMessages (cipherMessages) {
    const yourID = be8.getAccID();
    const proms = cipherMessages.map(async function (message) {
        const dialogPublicId = message.sender === yourID ? message.receiver : message.sender;
        const idForPublicKey = message.groupVersionKey ? message.sender : dialogPublicId;
        const idForPrivateKey = message.groupVersionKey || yourID;
        const hasKey = be8.hasKey(idForPrivateKey);

        if (message.messageType === 'system') {
            return message;
        }
        if (!hasKey) {
            message.valid = false;
            return message;
        }
        if (message.messageType === 'text') {
            const text = await be8.decryptTextSimple(idForPublicKey, idForPrivateKey, message.text, message.iv);

            message.text = text;
        }
        
        return message;
    }); 

    return await Promise.all(proms);
}

async function getCachedUserIDs () {
    const cachedKeys = await be8.getCachedKeys();
    return cachedKeys.map(acc => acc.accID);
}

async function fetchKeysAndAdd (groupID, cachedVersions) {
    const accID = be8.getAccID();
    const rawKeys = await fetch('/groupGetkeys', {
        ...POST,
        body: JSON.stringify({ groupID, accID }),
    });
    const { groupKeys } = await rawKeys.json();
    const filteredKeys = groupKeys.filter(gk => !cachedVersions.includes(gk.groupVersion));
    const keyholder = filteredKeys.map(fk => fk.keyholder);

    await syncPublicKeys(keyholder);

    if (filteredKeys.length > 0) {
        const decryptProms = filteredKeys.map(async function ({ groupKey, keyholder, iv }) {
            return await be8.decryptTextSimple(keyholder, accID, groupKey, iv);
        });         
        const decryptedKeys = await Promise.all(decryptProms);

        const sanKeys = decryptedKeys.map(function (key, i) {
            const groupKey = JSON.parse(key);
            return { groupKey, version: filteredKeys[i].groupVersion };
        });
        
        return await be8.addGroupKeys(groupID, sanKeys); 
    }
}

async function syncGroupKeys (groupID) {
    const cachedVersions = await be8.getCachedGroupVersions(groupID);
    const lastVersion = cachedVersions[cachedVersions.length - 1];
    const groupVersion = await groupGetVersion(groupID);
    
    if (!lastVersion || parseInt(groupVersion) > parseInt(lastVersion)) {
        return await fetchKeysAndAdd(groupID, cachedVersions);
    }
}

async function syncAllGroupKeys (groupIDs) {
    const proms = groupIDs.map(id => syncGroupKeys(id));
    return await Promise.all(proms);
}

async function syncPublicKeys (extra = []) {
    const cachedIDs = await getCachedUserIDs();
    const accIDs = app.getConversationPartners()
        .concat(extra)
        .filter(id => !id.includes('g') && !cachedIDs.find(cID => cID === id));

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
    const groupIDs = threads.filter(t => t.groupID).map(t => t.groupID);
    const dialogIDs = threads.filter(t => !t.groupID && t.partner !== 's1').map(t => t.partner);
    const allMembersOfGroups = groupIDs.map(async function (groupID) {
        const raw = await fetch('/groupgetmembers', { 
            ...POST,
            body: JSON.stringify({ groupID })
        });
        return await raw.json();
    });
    const members = await Promise.all(allMembersOfGroups);
    const memberIDs = members.flatMap(amg => amg.members.map(m => m.id));
    const uniqueMembersIDs = [...new Set(dialogIDs.concat(memberIDs))];

    await syncAllGroupKeys(groupIDs);
    await syncPublicKeys(uniqueMembersIDs);

    if (!valid) {
        return;
    }

    const decthreads = await decryptMessages(threads);

    return app.setThreads(decthreads);
} 

async function storePublicKey () {
    const publicKey = await be8.getMyPublicKey();
    await fetch('/setkey', { 
        ...POST,
        body: JSON.stringify({ publicKey })
    });
}

async function getMessages ({ detail }) {
    if (detail.type === 'group') {
        return getGroupMessages(detail);
    }
    if (detail.type === 'user' || detail.type === 'system') {
        return getDialogMessages(detail);
    }
}

async function getDialogMessages (detail) {
    const raw = await fetch('/getmessages', {
        ...POST,
        body: JSON.stringify(detail)
    });
    const { valid, messages } = await raw.json();

    if (valid) {
        const sanMessages = await decryptMessages(messages);
        
        await app.setMessages(sanMessages);
        return await decryptImages(sanMessages);
    }
}

async function getGroupMessages (detail) {
    const rawMembers = await fetch('/groupgetmembers', {
        ...POST,
        body: JSON.stringify(detail)
    });
    const rawMessage = await fetch('/getmessages', {
        ...POST,
        body: JSON.stringify(detail)
    });
    const { valid, messages } = await rawMessage.json();
    const members = await rawMembers.json();
    const memberIDs = members.members.map(({ id }) => id);

    if (valid) {
        await syncGroupKeys(detail.groupID);
        await syncPublicKeys(memberIDs);

        const sanMessages = await decryptMessages(messages);
        await app.setMessages(sanMessages);
        await app.setGroupMember(members);
        return await decryptImages(sanMessages);
    }
}

async function groupGetVersion (groupID) {
    const raw = await fetch('/groupgetcurrentversion', {
        ...POST,
        body: JSON.stringify({ groupID })
    });
    const { groupVersion } = await raw.json();

    return groupVersion;
}

async function getGroupMembers (groupID) {
    const membersRaw = await fetch('/groupgetmembers', {
        ...POST,
        body: JSON.stringify({ groupID })
    });
    const { members } = await membersRaw.json();

    return members;
}

async function updateGroupKeyForParticipants (groupID, groupKey, groupMembers) {
    const keyString = JSON.stringify(groupKey);
    const members = groupMembers || await getGroupMembers(groupID);
    const memberIDs = members.map(m => m.id);
    
    await syncPublicKeys(memberIDs);

    const proms = members.map(async function ({ id }) {
        const keyholder = be8.getAccID();
        const { cipherText, iv } = await be8.encryptTextSimple(keyholder, id, keyString);
        
        return await fetch('/groupstorekey', {
            ...POST,
            body: JSON.stringify({
                keyholder,
                groupID,
                groupKey: cipherText,
                accID: id,
                iv
            })
        });
    });

    return await Promise.all(proms);
}

async function groupIncreaseVersion (groupID) {
    const raw = await fetch('/groupincreaseversion', {
        ...POST,
        body: JSON.stringify({ groupID })
    });
    const { groupVersion } = await raw.json();

    return groupVersion;
}

async function generateGroupKey (groupID) {
    const groupVersion = await groupIncreaseVersion(groupID);
    const [, groupKey] = await be8.generateGroupKeys(groupVersion, groupID);

    return groupKey;
}

async function generateNewGroupKeyBeforeLeave (groupID) {
    const groupKey = await generateGroupKey(groupID);
    const groupMembers = await getGroupMembers(groupID);
    const sanGroupMembers = groupMembers.filter(({ id }) => id !== be8.getAccID());
    
    await updateGroupKeyForParticipants(groupID, groupKey, sanGroupMembers);
    return await syncGroupKeys(groupID);
}

async function joinGroupViaLink (groupID) {
    const { valid } = await groupJoinMember(groupID);

    if (valid) {
        const groupKey = await generateGroupKey(groupID);

        await updateGroupKeyForParticipants(groupID, groupKey);
        await syncGroupKeys(groupID); 
        await fetch('/invitelink', { ...POST, body: JSON.stringify({ type: 'group', usedInviteLink: true }) });
    }
}

async function joinDialogViaLink (joinId) {
    await startConversation({ 
        detail: { 
            id: be8.getAccID(),
            receiverID: joinId,
            success: () => {
                
            }
        } 
    });
    await fetch('/invitelink', { ...POST, body: JSON.stringify({ type: 'user', usedInviteLink: true }) });
}

async function checkURL () {
    const url = new URL(window.location.href);
    const userID = url.searchParams.get('user');
    const groupId = url.searchParams.get('group');

    window.history.replaceState({}, document.title, '/');

    if (userID) {
        return await joinDialogViaLink(decryptSafeLink(userID));
    }
    if (groupId) {
        return await joinGroupViaLink(decryptSafeLink(groupId));
    }    
}

async function groupJoinMember (groupID) {
    const raw = await fetch('/groupjoinmember', {
        ...POST,
        body: JSON.stringify({ groupID })
    });

    return await raw.json();
}

async function recurringVisitor (accObj, database) {
    refreshAppComponent(accObj);
    await generateEngine(accObj, database);
    return await app.openLockModal(async () => {
        await checkURL();
        await getThreads(); 
    });
}

async function firstTimeVisitor (database) {
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

        refreshAppComponent(accObj);
        await generateEngine(accObj, database);
        await storePublicKey();
        await checkURL();
        await getThreads();
        return app.openWelcomeWindow(accObj);
    }
}


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
app.addEventListener('leaveGroup', async function ({ detail }) {
    await generateNewGroupKeyBeforeLeave(detail.groupID);

    const raw = await fetch('/groupleavemember', {
        ...POST,
        body: JSON.stringify(detail)
    });
    const { valid } = await raw.json(detail);
    
    if (valid) {
        return detail.done();
    }
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
      
        return refreshAppComponent(accObj);
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
app.addEventListener('setUserStatus', async function ({ detail }) {
    await fetch('/userstatusset', { ...POST, body: JSON.stringify(detail) });
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

        refreshAppComponent(accObj);
        return detail.success(data);
    }
    if (data.error === 'TOKENNOTEXIST') {
        return detail.wrongToken();
    }
    if (!data.valid && data.tokenInUse) {
        return detail.tokenInUse();
    }
});
app.addEventListener('startConversation', startConversation);
app.addEventListener('createGroup', async function ({ detail }) {
    const raw = await fetch('/groupcreate', {
        ...POST,
        body: JSON.stringify({ nickname: detail.nickname, groupType: detail.groupType })
    });
    const { valid, groupID } = await raw.json();

    if (valid) {
        const { valid } = await groupJoinMember(groupID);
        const groupKey = await generateGroupKey(groupID);
        await updateGroupKeyForParticipants(groupID, groupKey);
        await syncGroupKeys(groupID); 

        if (valid) {
            return detail.success();
        }
    }
});
app.addEventListener('kickMemberFromGroup', async function ({ detail }) {
    const raw = await fetch('/groupkickmember', { ...POST, body: JSON.stringify(detail) });
    const { valid } = await raw.json();

    if (valid) {
        const groupKey = await generateGroupKey(detail.groupID);

        await updateGroupKeyForParticipants(detail.groupID, groupKey);
        await syncGroupKeys(detail.groupID);
        return detail.done();
    }
});
app.addEventListener('addGroupMember', async function ({ detail }) {
    const raw = await fetch('/groupaddmember', {
        ...POST,
        body: JSON.stringify({ memberID: detail.id, groupID: detail.groupID })
    });
    const data = await raw.json();

    if (data.valid) {
        const groupKey = await generateGroupKey(detail.groupID);

        await updateGroupKeyForParticipants(detail.groupID, groupKey);
        await syncGroupKeys(detail.groupID); 
        return detail.done();
    } else {
        return detail.warning(data.reason);
    }
});
app.addEventListener('threadSelect', getMessages);
app.addEventListener('writeMessage', async function ({ detail }) {
    const groupVersion = detail.groupID ? await groupGetVersion(detail.receiver) : false;
    const sender = detail.groupID ? `${detail.receiver}:${groupVersion}` : be8.getAccID();
    const receiver = detail.groupID ? be8.getAccID() : detail.receiver;
    const { cipherText, iv } = await be8.encryptTextSimple(sender, receiver, detail.text);
    const options = {
        ...detail,
        ...(detail.groupID ? { groupVersionKey: `${detail.groupID}:${groupVersion}` } : {}),
        text: cipherText,
        iv
    };

    await fetch('/writemessage', {
        ...POST,
        body: JSON.stringify(options)
    });
    return detail.done();
});
app.addEventListener('uploadMedia', async function ({ detail }) {
    const groupVersion = detail.isGroup ? await groupGetVersion(detail.receiver) : false;
    const sender = detail.isGroup ? `${detail.receiver}:${groupVersion}` : be8.getAccID();
    const receiver = detail.isGroup ? be8.getAccID() : detail.receiver;
    const { cipherImage, iv } = await be8.encryptImageSimple(sender, receiver, detail.content);
    const body = {
        ...detail, 
        ...(detail.isGroup ? { groupVersionKey: `${detail.receiver}:${groupVersion}` } : {}),
        content: cipherImage, 
        iv,
    };
    const raw = await fetch('/imageupload', { 
        ...POST, 
        body: JSON.stringify(body)
    });
    const { valid } = await raw.json();

    if (valid) {
        return detail.done();
    }
});

document.addEventListener('DOMContentLoaded', async function bootstrapApp () {console.log('Beginning of function'); 
    const database = await initialiseDB();
    const raw = await fetch('/me', GET);
    const { error, accObj } = await raw.json();
    console.log('after me'); 
    if (error === 'NOTAUTH') {
        await firstTimeVisitor(database);
    }  else {
        await recurringVisitor(accObj, database);
    }
    console.log('before SSE'); 
    setupSSE();
    return setupSW();
});

export default function () {}