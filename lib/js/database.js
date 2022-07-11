const connection = indexedDB.open('be8', 1);
const initialiseDB = new Promise(function (success, error) {
    connection.onupgradeneeded = function () {
        const db = connection.result;
        const publicKeysStore = db.createObjectStore('publicKeys', { keyPath: 'accID' });
        const privateKeysStore = db.createObjectStore('privateKeys', { keyPath: 'accID' });
        const groupKeysStore = db.createObjectStore('groupKeys', { keyPath: ['groupID', 'version'] });
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
        return success();
    };
    
    connection.onsuccess = function () {
        return success();
    };
    
    connection.onerror = function (event) {
        console.log(event);
        return error();
    };
});

export default async function () {
    await initialiseDB;
    return connection;
}