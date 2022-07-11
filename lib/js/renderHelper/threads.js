import { html } from 'lit';
import { SYSTEMTITLES } from '../data/systemmessages.js';
import { userIcons } from '../data/icons.js';
import { humanReadAbleLastTime } from '../utils.js';

function generateSanText (text, isSystem) {
    if (isSystem) {
        return SYSTEMTITLES[text];
    }
    if (text.length <= 25 && SYSTEMTITLES[text]) {
        return SYSTEMTITLES[text];
    }
    
    return text.substring(0, 23) + '…';
}


export default function renderThread ({ endless, expire, nickname, sender, text, threadID, ts, type, status }) {
    const isSystem = type === 'system';
    const dateTime = humanReadAbleLastTime(ts);
    const icon = html`<i class="fa-solid fa-${userIcons[type]} thread-avatar"></i>`;
    const endlessIcon = endless || isSystem ? html`<i class="fa-solid fa-check danger-color"></i>` : '';
    const senderID = isSystem ? '' : html`<span class="float-right">#${sender}<span></span>`;
    const sanText = generateSanText(text, isSystem);
    const readIndicator = html`<span class="thread-read-indicator${status === 'read' ? ' shrink-to-zero' : ''}"></span>`;
    
    return html`<div expire="${expire}" id="${threadID}" sender="${sender}" type="${type}" class="thread hover-background">${readIndicator}${icon}<div><p>${nickname}&nbsp;&nbsp;${endlessIcon}${senderID}</p><p>${sanText} <span class="float-right unselectable">${dateTime}</span></p></div></div>`; 
}