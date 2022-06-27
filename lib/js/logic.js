document.addEventListener('DOMContentLoaded', function () { 
    const app = document.querySelector('app-layout');
    const toast = document.querySelector('toast-notification');
    toast.open();

    setTimeout(function () {
        console.log('me update');
        
        app.ME = { id: '123123', nickname: 'Johannes', expire: new Date(), codes: false, status: 'working' };
        
        toast.open();
        toast.notification = { type: 'warning', text: 'why are your? So long text with me you beautiful' };
    }, 5500);
    setTimeout(function () {
        
        toast.open();
        toast.notification = { type: 'error', text: 'much error' };
    }, 12000);
});

export default function () {}