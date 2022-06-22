import { domCache } from './data';

document.addEventListener('DOMContentLoaded', function () { 
    const app = document.querySelector('app-layout');

    domCache.threads = app.querySelector('threads-menu');
    domCache.messages = app.querySelector('messages-menu');
    domCache.navi = app.querySelector('nav');
    domCache.header = app.querySelector('header');
    domCache.bottomNavi = app.querySelector('.bottom-navi');

    return Object.freeze(domCache);
});


export default function () {}