import start from 'be8-backend';

start({
    staticFiles: ['./dist/', './node_modules/be8-insights/dist/'],
    fakeTokens: [{
        token: '12345678901234567890123456789012',
        type: 'endless'
    }, {
        token: 'promo180_12345678901234567890123',
        type: 'promo',
        validTime: 15_552_000_000 // half a year in milliseconds
    }, {
        token: 'promo365_12345678901234567890123',
        type: 'promo',
        validTime: 31_536_000_000 // a year in milliseconds
    }]
});
