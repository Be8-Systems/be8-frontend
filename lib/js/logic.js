document.addEventListener('DOMContentLoaded', function () { 
    const app = document.querySelector('app-layout');
    const lockModal = document.querySelector('lock-modal-window');
    const me = { codes: false, id: '123123', nickname: 'Johannes', expire: new Date(), status: 'working' };

    setTimeout(function () {
        console.log('me update');
        app.ME = me;
        lockModal.ME = me; 

        lockModal.open();
    }, 1000);
});

export default function () {}