import Crypto from 'crypto-es';
import { isPhone, isIOS } from './data/data';
import { adjectives, animals } from './data/nicknames';

export const animations = Object.freeze({
    fadeLeftOut: function () {
        return 'animation: fadeLeftOutAnimation 0.3s !important;';
    }, 
    fadeLeftIn: function () {
        return 'animation: fadeLeftInAnimation 0.3s !important;';
    },
    fadeRightOut: function () {
        return 'animation: fadeRightOutAnimation 0.3s !important;';
    },
    fadeRightIn: function () {
        return 'animation: fadeRightInAnimation 0.3s !important;';
    }
});

export function isKeyDownNumber (evt) {
    const charCode = (evt.which) ? evt.which : evt.keyCode;

    if (evt.target.selectionStart === 0 && charCode === 35) {
        return true;
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }

    return true;
}

export function humanReadAbleLastTime (ts) {
    const dateTime = new Date(ts);
    const hours = Math.abs(new Date(ts) - new Date()) / 36e5;
    const date = dateTime.toDateString();
    const time = dateTime.toLocaleTimeString();

    if (hours < 24) {
        return time.substring(0, 5);
    }
    if (hours < 168) {
        return dateTime.toLocaleDateString('en', { weekday: 'long' });    
    }

    return date;
}

export function sanitizeTime (ts) {
    const dateTime = new Date(ts);
    const date = dateTime.toDateString();
    const time = dateTime.toLocaleTimeString();

    return `${date} ${time}`;
}

export function animateSideToMain (main, side, focus) {
    side.style = animations.fadeRightOut();

    setTimeout(() => {
        side.classList.add('hide');
        main.classList.remove('hide');

        side.style = '';
        main.style = animations.fadeLeftIn();

        requestAnimationFrame(() => { 
            focus?.focus();
            main.style = '';
        });
    }, 300);
}

export function animateMainToSide (main, side, focus) {
    main.style = animations.fadeLeftOut();

    setTimeout(() => {
        main.classList.add('hide');
        side.classList.remove('hide');

        main.style = '';
        side.style = animations.fadeRightIn();

        requestAnimationFrame(() => { 
            focus?.focus();
            side.style = ''; 
        });
    }, 300);
}

export function randomString () {
    const charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!?';
    const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

    return [...new Array(32)].map(function () {
        return charset[random(0, charset.length - 1)];
    }).join('');
}

export function generatePassword () {
    const password = randomString();
    const salt = Date.now() + '';
    const cipherPW = Crypto.AES.encrypt(password, salt).toString();
    return Object.freeze({
        password: cipherPW, 
        salt
    }); 
}

export function randomNickname () {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const animale = animals[Math.floor(Math.random() * animals.length)];

    return `${adjective} ${animale}`;
}

export function generateSafeLink (parameterName, content) {
    const urlObj = new URL(window.location.href);
    const cipherPW = Crypto.AES.encrypt(content, 'hamburgerANDpizza0987654e3').toString();

    return `${urlObj.origin}?${parameterName}=${encodeURIComponent(cipherPW)}`;
}

export function decryptSafeLink (ciphter) {
    return decodeURIComponent(Crypto.AES.decrypt(ciphter, 'hamburgerANDpizza0987654e3').toString(Crypto.enc.Utf8));
}

export function findUrls (text) {
    const urls = text.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig);
    return urls || [];
}

export function safariIOSFix () {
    const isPWA = window.navigator.standalone;

    function fixHeight (messageMENU, appLayout) {
        // the bottom element of safari is not calculated into the view port
        if (isIOS) {
            messageMENU.style.height = 'fit-content';
        } else {
            messageMENU.style.height = `${window.innerHeight - 49}px`;
        }

        appLayout.style.height = `${window.innerHeight}px`;

    }

    if (isPhone) {
        const messageMENU = document.querySelector('messages-menu');
        const appLayout = document.querySelector('app-layout'); 
        const messageBox =  document.querySelector('.write-message-input');

        if (!isPWA) {
            fixHeight(messageMENU, appLayout);
        }

        messageBox.onfocus = function () {
            setTimeout(() => {
                messageMENU.style.height = `${window.innerHeight}px`;
                appLayout.style.height = `${window.innerHeight}px`;

                window.scrollTo(0, 0);
                return messageMENU.scrollToBottom();
            }, 350);
        };
        messageBox.onblur = function () {
            setTimeout(() => fixHeight(messageMENU, appLayout), 350);
        };
    }
}