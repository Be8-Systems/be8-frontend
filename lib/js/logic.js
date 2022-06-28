document.addEventListener('DOMContentLoaded', function () { 
    const app = document.querySelector('app-layout');

    setTimeout(function () {
        console.log('me update');
        app.ME = { id: '123123', nickname: 'Johannes', expire: new Date(), codes: false, status: 'working' };
    }, 1500);
});

export default function () {}