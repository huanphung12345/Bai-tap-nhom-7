/**
 * 🏋️ FitTrack - Storage Manager
 * Abstracts localStorage/sessionStorage with error handling
 */

class StorageManager {
    constructor(useSessionStorage = false) {
        this.store = useSessionStorage ? sessionStorage : localStorage;
        this.prefix = 'fittrack_';
    }

    /**
     * Get item
     */
    get(key) {
        try {
            const item = this.store.getItem(this.prefix + key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error(`Error reading ${key}:`, e);
            return null;
        }
    }

    /**
     * Set item
     */
    set(key, value) {
        try {
            this.store.setItem(this.prefix + key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error(`Error writing ${key}:`, e);
            return false;
        }
    }

    /**
     * Remove item
     */
    remove(key) {
        try {
            this.store.removeItem(this.prefix + key);
            return true;
        } catch (e) {
            console.error(`Error removing ${key}:`, e);
            return false;
        }
    }

    /**
     * Clear all items
     */
    clear() {
        try {
            const keys = [];
            for (let i = 0; i < this.store.length; i++) {
                const key = this.store.key(i);
                if (key.startsWith(this.prefix)) {
                    keys.push(key);
                }
            }
            keys.forEach(key => this.store.removeItem(key));
            return true;
        } catch (e) {
            console.error('Error clearing storage:', e);
            return false;
        }
    }

    /**
     * Get all items
     */
    getAll() {
        const result = {};
        try {
            for (let i = 0; i < this.store.length; i++) {
                const key = this.store.key(i);
                if (key.startsWith(this.prefix)) {
                    const cleanKey = key.replace(this.prefix, '');
                    result[cleanKey] = this.get(cleanKey);
                }
            }
        } catch (e) {
            console.error('Error getting all items:', e);
        }
        return result;
    }

    /**
     * Check if item exists
     */
    has(key) {
        return this.store.getItem(this.prefix + key) !== null;
    }

    /**
     * Get storage size (approximate)
     */
    getSize() {
        let size = 0;
        for (let i = 0; i < this.store.length; i++) {
            const key = this.store.key(i);
            if (key.startsWith(this.prefix)) {
                const item = this.store.getItem(key);
                size += item.length + key.length;
            }
        }
        return size;
    }
}

export const LocalStorage = new StorageManager(false);
export const SessionStorage = new StorageManager(true);
