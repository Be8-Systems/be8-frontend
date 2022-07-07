import start from 'be8-backend';

start({
    staticFiles: './dist/',
    fakeTokens: [{
        token: '12345678901234567890123456789012',
        type: 'endless'
    }, {
        token: '12345678901234567890123456789010',
        type: 'promo',
        validTime: 15768000 // half a year in seconds
    }]
});