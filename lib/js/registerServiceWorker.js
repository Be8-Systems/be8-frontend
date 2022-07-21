import { POST } from './data/header'; 

async function ping (data) {
    return await fetch('/subscribe', {
        ...POST,
        body: JSON.stringify(data),
    });
}

async function subscribeSW (swreg) {
    const data = await swreg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BGcpbQEQRF2Ans4lXwnyqd9EnWT2MgNx9j-ns5EoXDtmQZonB1TqGpBuJlw32gqvbHGTZQgh79mYYjp6dX-8zOg',
    });
    await ping(data);
}

async function registerServiceWorker () {
    await navigator.serviceWorker.register('/serviceworker.js');

    if (!('PushManager' in window)) {
        return console.log('Browser does not have push notifications functionality');
    }

    return navigator.serviceWorker.ready.then(function (registration) {
        return registration.pushManager.getSubscription().then(function (subscription) {
            if (subscription === null) {
                return subscribeSW(registration);
            }

            return ping(subscription); 
        }).catch(function (error) {
            if (Notification.permission === 'denied') {
                console.log('Permission for Notifications was denied');
            } else {
                console.log('Unable to subscribe to push.', error);
            }
        });
    });

}

export default function setupSW () {
    if ('serviceWorker' in navigator) {
        return registerServiceWorker();
    }
    return console.log('Browser does not have serviceWorker functionality');
}
