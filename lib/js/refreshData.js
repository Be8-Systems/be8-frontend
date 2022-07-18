export async function getThreads () {
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

export async function getMessages ({ detail }) {
    if (detail.type === 'group') {
        return getGroupMessages(detail);
    }
    if (detail.type === 'user' || detail.type === 'system') {
        return getDialogMessages(detail);
    }
}

export async function getDialogMessages (detail) {
    const raw = await fetch('/getmessages', {
        ...POST,
        body: JSON.stringify(detail)
    });
    const { valid, messages } = await raw.json();

    if (valid) {
        const sanMessages = await decryptMessages(messages);
        
        app.setMessages(sanMessages);
        return await decryptImages(sanMessages);
    }
}

export async function getGroupMessages (detail) {
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
        app.setMessages(sanMessages);
        app.setGroupMember(members);
        return await decryptImages(sanMessages);
    }
}
