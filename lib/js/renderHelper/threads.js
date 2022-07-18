import { html } from 'lit';
import { SYSTEMTITLES } from '../data/systemmessages.js';
import { userIcons } from '../data/icons.js';
import { humanReadAbleLastTime } from '../utils.js';

const maxThreadTextLength = 23; 

function generateSanText (text, isSystem) {
    if (isSystem) {
        return SYSTEMTITLES[text];
    }
    if (text.messageType === 'system') {
        return SYSTEMTITLES[text];
    }
    if (text.length <= maxThreadTextLength) {
        return text;
    }
    
    return text.substring(0, maxThreadTextLength) + '…';
}

export default function renderThread ({ endless, expire, nickname, sender, partner, text, threadID, ts, type, status }) {
    const isSystem = type === 'system';
    const dateTime = humanReadAbleLastTime(ts);
    const icon = html`<i class="fa-solid fa-${userIcons[type]} thread-avatar"></i>`;
    const endlessIcon = endless || isSystem ? html`<i class="fa-solid fa-check danger-color"></i>` : '';
    const senderID = isSystem ? '' : html`<span class="float-right">#${partner}<span></span>`;
    const sanText = generateSanText(text, isSystem);
    const readIndicator = html`<span class="thread-read-indicator${status === 'read' ? ' shrink-to-zero' : ''}"></span>`;
    
    return html`<div partner="${partner}" type="${type}" class="thread hover-background">${readIndicator}${icon}<div><p>${nickname}&nbsp;&nbsp;${endlessIcon}${senderID}</p><p>${sanText} <span class="float-right unselectable">${dateTime}</span></p></div></div>`; 
}