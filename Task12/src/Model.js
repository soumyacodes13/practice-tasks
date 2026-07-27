import { db } from './Database.js';

export class ModelInstance {
    constructor(modelName, schema, data) {
        this._modelName = modelName;
        this._schema = schema;
        Object.assign(this, data);
    }
}

export class Model {
    constructor(name, schema) {
        this.name = name;
        this.schema = schema;
        this.primaryKey = null;

        // Identify primary key field from schema
        for (const [field, config] of Object.entries(schema)) {
            if (config.primary) {
                this.primaryKey = field;
                break;
            }
        }
    }

    /**
     * Validate data fields against schema definitions
     * @private
     */
    _validate(data, isUpdate = false, currentId = null) {
        const validated = {};
        const records = db.getRecords(this.name);

        for (const [field, config] of Object.entries(this.schema)) {
            const value = data[field];

            // 1. Check required fields (skip validation if it is an update and field is not provided)
            if (config.required && !isUpdate && (value === undefined || value === null)) {
                throw new Error(`Field '${field}' is required`);
            }

            if (value !== undefined && value !== null) {
                // 2. Type validation
                if (typeof value !== config.type) {
                    throw new Error(`Field '${field}' must be of type '${config.type}', got '${typeof value}'`);
                }

                // 3. Unique validation
                if (config.unique) {
                    const duplicate = records.find(rec => {
                        if (isUpdate && this.primaryKey && rec[this.primaryKey] === currentId) {
                            return false; // Skip checking against itself on updates
                        }
                        return rec[field] === value;
                    });
                    if (duplicate) {
                        throw new Error(`Field '${field}' must be unique. Value '${value}' already exists.`);
                    }
                }

                validated[field] = value;
            }
        }

        return validated;
    }

    /**
     * Create a new record in the database
     * @param {Object} data 
     * @returns {Promise<ModelInstance>}
     */
    async create(data) {
        const records = db.getRecords(this.name);
        const toSave = { ...data };

        // Auto-increment primary key if configured and not manually provided
        if (this.primaryKey && this.schema[this.primaryKey].type === 'number') {
            if (toSave[this.primaryKey] === undefined) {
                toSave[this.primaryKey] = db.getNextId(this.name);
            }
        }

        const validated = this._validate(toSave);
        records.push(validated);
        db.setRecords(this.name, records);

        return new ModelInstance(this.name, this.schema, validated);
    }

    /**
     * Find all records matching query conditions
     * @param {Object} query 
     * @returns {Promise<Array<ModelInstance>>}
     */
    async find(query = {}) {
        const records = db.getRecords(this.name);
        const filtered = records.filter(rec => {
            return Object.entries(query).every(([key, val]) => rec[key] === val);
        });

        return filtered.map(rec => new ModelInstance(this.name, this.schema, rec));
    }

    /**
     * Find a single record by primary key ID
     * @param {*} id 
     * @returns {Promise<ModelInstance|null>}
     */
    async findById(id) {
        if (!this.primaryKey) {
            throw new Error(`Model '${this.name}' does not have a primary key defined`);
        }

        const records = db.getRecords(this.name);
        const match = records.find(rec => rec[this.primaryKey] === id);

        if (!match) return null;
        return new ModelInstance(this.name, this.schema, match);
    }

    /**
     * Update an existing record by primary key ID
     * @param {*} id 
     * @param {Object} updates 
     * @returns {Promise<ModelInstance>}
     */
    async update(id, updates) {
        if (!this.primaryKey) {
            throw new Error(`Model '${this.name}' does not have a primary key defined`);
        }

        const records = db.getRecords(this.name);
        const recordIndex = records.findIndex(rec => rec[this.primaryKey] === id);

        if (recordIndex === -1) {
            throw new Error(`Record with ID ${id} not found`);
        }

        const currentRecord = records[recordIndex];
        const mergedData = { ...currentRecord, ...updates };
        
        // Ensure primary key value cannot be changed
        mergedData[this.primaryKey] = id;

        const validated = this._validate(mergedData, true, id);
        
        records[recordIndex] = validated;
        db.setRecords(this.name, records);

        return new ModelInstance(this.name, this.schema, validated);
    }

    /**
     * Delete an existing record by primary key ID
     * @param {*} id 
     * @returns {Promise<boolean>}
     */
    async delete(id) {
        if (!this.primaryKey) {
            throw new Error(`Model '${this.name}' does not have a primary key defined`);
        }

        const records = db.getRecords(this.name);
        const initialLength = records.length;
        const filtered = records.filter(rec => rec[this.primaryKey] !== id);

        if (filtered.length === initialLength) {
            return false;
        }

        db.setRecords(this.name, filtered);
        return true;
    }
}

/**
 * Model factory function
 * @param {string} name 
 * @param {Object} schema 
 * @returns {Model}
 */
export function model(name, schema) {
    return new Model(name, schema);
}
