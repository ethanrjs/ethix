export default class Database {
    constructor(dbName, storeName) {
        this.dbName = dbName;
        this.storeName = storeName;
        this.init();
    }

    init() {
        const openRequest = indexedDB.open(this.dbName, 1);

        openRequest.onupgradeneeded = event => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(this.storeName)) {
                db.createObjectStore(this.storeName);
            }
        };

        openRequest.onerror = event => {
            console.error(`database error: ${event.target.error}`);
        };
    }

    async set(key, value) {
        return new Promise((resolve, reject) => {
            const openRequest = indexedDB.open(this.dbName);

            openRequest.onsuccess = event => {
                const db = event.target.result;
                const tx = db.transaction(this.storeName, 'readwrite');
                const store = tx.objectStore(this.storeName);

                const request = store.put(value, key);

                request.onsuccess = () => {
                    resolve();
                };
                request.onerror = () => reject(request.error);
            };

            openRequest.onerror = event => {
                reject(`database error: ${event.target.error}`);
            };
        });
    }

    async get(key) {
        return new Promise((resolve, reject) => {
            const openRequest = indexedDB.open(this.dbName);

            openRequest.onsuccess = event => {
                const db = event.target.result;
                const tx = db.transaction(this.storeName, 'readonly');
                const store = tx.objectStore(this.storeName);

                const request = store.get(key);

                request.onsuccess = () => {
                    resolve(request.result);
                };
                request.onerror = () => reject(request.error);
            };

            openRequest.onerror = event => {
                reject(`database error: ${event.target.error}`);
            };
        });
    }
}
