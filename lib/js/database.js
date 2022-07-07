const connection = indexedDB.open('be8', 1);

connection.onupgradeneeded = function () {
    const db = connection.result;
    const publicKeysStore = db.createObjectStore('publicKeys', { keyPath: 'accID' });
    const privateKeysStore = db.createObjectStore('privateKeys', { keyPath: 'accID' });
    const groupKeysStore = db.createObjectStore('groupKeys', { keyPath: 'accID' });
    const indexs = [
        ['crv', 'crv', { unique: false }],
        ['x', 'x', { unique: false }],
        ['y', 'y', { unique: false }],
        ['kty', 'kty', { unique: false }],
        ['key_ops', 'key_ops', { unique: false }],
        ['ext', 'ext', { unique: false }],
    ];

    indexs.forEach(function (parameters) {
        publicKeysStore.createIndex(...parameters);
        privateKeysStore.createIndex(...parameters);
        groupKeysStore.createIndex(...parameters);
    });
};

connection.onerror = event => console.log(event);

export default connection;