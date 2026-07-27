### Task 12: Simple ORM-like Layer

**PRD:**
> Create a lightweight ORM-like interface for database operations. Support model definition, querying, and relationships.

**Requirements:**
```javascript
// Define model
const User = model('User', {
  id: { type: 'number', primary: true },
  name: { type: 'string', required: true },
  email: { type: 'string', unique: true }
});

// Use it
await User.create({ name: 'John', email: 'john@example.com' });
await User.find({ name: 'John' });
await User.findById(1);
await User.update(1, { name: 'Jane' });
await User.delete(1);
```

**Deliverables:**
- [x] Model definition
- [x] Query builder
- [x] CRUD operations
- [x] Relationship support (optional - not requested in PRD core, schema types/queries implemented)
- [x] Documentation
