import Database from './Database.js'; // Assume your Database class is in Database.js

class FileSystem {
    constructor(dbName, storeName) {
        this.db = new Database(dbName, storeName);
    }

    async writeFile(path, data) {
        await this.db.set(path, data);
    }

    async readFile(path) {
        const data = await this.db.get(path);
        if (data === undefined) {
            throw new Error(`filesystem >> file not found at ${path}`);
        }
        return data;
    }

    async mkdir(path) {
        // using null to signify that this key represents a directory
        await this.db.set(path, null);
    }

    async rmdir(path) {
        const isDirectory = (await this.db.get(path)) === null;
        if (!isDirectory) {
            throw new Error(`filesystem >> not a directory at ${path}`);
        }
        await this.db.set(path, undefined); // removing the directory marker
    }

    async unlink(path) {
        const isFile = (await this.db.get(path)) !== null;
        if (!isFile) {
            throw new Error(`filesystem >> not a file at ${path}`);
        }
        await this.db.set(path, undefined); // removing the file
    }

    // readdir
    async readdir(path) {
        const keys = await this.db.keys();
        const files = keys.filter(key => key.startsWith(path + '/'));
        const directories = keys.filter(
            key => key.startsWith(path + '/') && key !== path + '/'
        );
        return {
            files,
            directories
        };
    }
}

// Example Usage
const fs = new FileSystem('ethix-files', 'files');
export default fs;
