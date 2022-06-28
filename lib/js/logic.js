document.addEventListener('DOMContentLoaded', function () { 
    const app = document.querySelector('app-layout');
    const lockModal = document.querySelector('lock-modal-window');

    setTimeout(function () {
        console.log('me update');
        app.ME = { id: '123123', nickname: 'Johannes', expire: new Date(), codes: false, status: 'working' };

        lockModal.open();
    }, 1000);
});

export default function () {}