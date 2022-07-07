import start from 'be8-backend';

start({
    staticFiles: './dist/',
    fakeTokens: [
        '12345678901234567890123456789012'
    ]
});