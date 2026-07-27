export class Database {
    constructor() {
        // Map to store model names to their array of records
        // e.g., 'User' => [ { id: 1, name: 'John', ... } ]
        this.tables = new Map();

        // Map to track auto-incrementing primary key counters per model
        // e.g., 'User' => 1
        this.counters = new Map();
    }

    /**
     * Retrieve all records for a given model
     * @param {string} modelName 
     * @returns {Array}
     */
    getRecords(modelName) {
        if (!this.tables.has(modelName)) {
            this.tables.set(modelName, []);
        }
        return this.tables.get(modelName);
    }

    /**
     * Save/overwrite the records array for a model
     * @param {string} modelName 
     * @param {Array} records 
     */
    setRecords(modelName, records) {
        this.tables.set(modelName, records);
    }

    /**
     * Generate the next auto-incremented primary key ID for a model
     * @param {string} modelName 
     * @returns {number}
     */
    getNextId(modelName) {
        if (!this.counters.has(modelName)) {
            this.counters.set(modelName, 1);
        }
        const currentId = this.counters.get(modelName);
        this.counters.set(modelName, currentId + 1);
        return currentId;
    }

    /**
     * Clear all tables and counters (useful for testing resets)
     */
    clear() {
        this.tables.clear();
        this.counters.clear();
    }
}

// Export a single shared database instance across models
export const db = new Database();