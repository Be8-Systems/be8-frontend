import { POST, GET } from './data/header'; 
import { generatePassword, randomNickname } from './utils';
import initialiseDB from './database';
import Be8 from 'be8-engine';

const app = document.querySelector('app-layout');
let be8 = {};

function refreshAPP (accObj) {
    app.ME = accObj;
}

async function generateEngine ({ id }, database) {
    be8 = new Be8(id, database);
    return await be8.setup();
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
        if (message.messageType === 'image') {
            const content = await be8.decryptImageSimple(idForPublicKey, idForPrivateKey, message.text, message.iv);
            message.content = content;
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
        const decryptProms = filteredKeys.map(function ({ groupKey, keyholder, iv }) {
            return be8.decryptTextSimple(keyholder, accID, groupKey, iv);
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
    const [{ publicKey }] = await be8.getCachedKeys();
    await fetch('/setkey', { 
        ...POST,
        body: JSON.stringify({ publicKey })
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

        refreshAPP(accObj);
        await generateEngine(accObj, database);
        await storePublicKey();
        await getThreads();
        return app.openWelcomeWindow(accObj);
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
        return app.setMessages(sanMessages);
    }
}

async function getGroupMessages (detail) {
    const rawMessage = await fetch('/getmessages', {
        ...POST,
        body: JSON.stringify(detail)
    });
    const rawMembers = await fetch('/groupgetmembers', {
        ...POST,
        body: JSON.stringify(detail)
    });
    const { valid, messages } = await rawMessage.json();
    const members = await rawMembers.json();

    if (valid) {
        await syncGroupKeys(detail.groupID);
        const sanMessages = await decryptMessages(messages);
        app.setMessages(sanMessages);
        return app.setGroupMember(members);
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

async function groupJoinMember (groupID) {
    const raw = await fetch('/groupjoinmember', {
        ...POST,
        body: JSON.stringify({ groupID })
    });

    return await raw.json();
}

document.addEventListener('DOMContentLoaded', async function () {
    const database = await initialiseDB();
    const { error, accObj } = await fetch('/me', GET).then(raw => raw.json());

    if (error === 'NOTAUTH') {
        return await firstTimeVisitor(database);
    }   

    refreshAPP(accObj);
    await generateEngine(accObj, database);
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
    }
});
app.addEventListener('threadSelect', async function ({ detail }) {
    if (detail.type === 'group') {
        return getGroupMessages(detail);
    }
    if (detail.type === 'user' || detail.type === 'system') {
        return getDialogMessages(detail);
    }
});
app.addEventListener('writeMessage', async function ({ detail }) {
    const groupVersion = detail.isGroup ? await groupGetVersion(detail.receiver) : false;
    const sender = detail.isGroup ? `${detail.receiver}:${groupVersion}` : be8.getAccID();
    const receiver = detail.isGroup ? be8.getAccID() : detail.receiver;
    const { cipherText, iv } = await be8.encryptTextSimple(sender, receiver, detail.message);

    await fetch('/writemessage', {
        ...POST,
        body: JSON.stringify({
            ...detail,
            ...(detail.isGroup ? { groupVersionKey: `${detail.receiver}:${groupVersion}` } : {}),
            text: cipherText,
            iv
        })
    });
});
app.addEventListener('uploadMedia', async function ({ detail }) {
    const { cipherImage, iv } = await be8.encryptImageSimple(detail.sender, detail.receiver, detail.content);
    const raw = await fetch('/imageupload', { 
        ...POST, 
        body: JSON.stringify({
            ...detail, 
            content: cipherImage, 
            iv
        })
    });
    const { valid } = await raw.json();

    if (valid) {
        return detail.done();
    }
});

export default function () {}