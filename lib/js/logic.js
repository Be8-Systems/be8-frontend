import { domCache } from './data/data';

document.addEventListener('DOMContentLoaded', function () { 
    const app = document.querySelector('app-layout');

    setTimeout(function () {
        console.log('me update');
        app.ME = { id: '123123', nickname: 'Johannes', expire: new Date() };
    }, 3000);
});


export default function () {}