# 🎯 Practice Tasks for Skill Building

## Learning Through Doing

These tasks are designed to help you practice:
- Reading and understanding requirements
- Breaking down problems
- Writing clean, testable code
- Using AI assistants effectively

---

## 📊 Task Categories

| Category | Tasks | Focus Area |
|----------|-------|------------|
| 🟡 Warm-up | 1-3 | Basics, environment |
| 🟢 Beginner | 4-7 | Core skills, tests |
| 🔵 Intermediate | 8-11 | APIs, databases |
| 🟣 Advanced | 12+ | Architecture, optimization |

---

## 🟡 Warm-up Tasks

### Task 1: README Generator

**PRD:**
> Create a tool that generates a README.md file based on user input. The tool should ask for project name, description, installation steps, and usage examples, then create a formatted README.

**Requirements:**
- CLI interface (Node.js or Python)
- Prompt user for project details
- Generate markdown with proper formatting
- Include badges (optional)

**Deliverables:**
- [x] Working CLI tool
- [x] Sample generated README
- [x] 3 test cases

**Hints:**
- Use `inquirer` (Node.js) or `input()` (Python)
- Use template strings for markdown
- Test with different inputs

**Time Estimate:** 1-2 hours

---

### Task 2: Todo List API

**PRD:**
> Build a simple REST API for managing todos. Users should be able to create, read, update, and delete todos. Each todo has a title, description, completion status, and created timestamp.

**Requirements:**
- Endpoints: GET, POST, PUT, DELETE
- In-memory storage (array, no database)
- Input validation
- ID generation for todos

**API Contract:**
```
GET    /todos          - List all todos
GET    /todos/:id      - Get specific todo
POST   /todos          - Create todo
PUT    /todos/:id      - Update todo
DELETE /todos/:id      - Delete todo
```

**Deliverables:**
- [x] Working API with all endpoints
- [x] README with API documentation
- [x] Test suite with 80%+ coverage

**Example Usage:**
```bash
# Create todo
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn AI","description":"Practice prompts"}'
```

**Response: {"id":1,"title":"Learn AI","description":"Practice prompts","completed":false,"createdAt":"2026-07-27T..."}**


**Time Estimate:** 2-3 hours

---

### Task 3: Test Case Writer

**PRD:**
> Given a function, write comprehensive test cases. The tool should analyze the function and generate a test checklist covering normal cases, edge cases, and errors.

**Function to Test:**
```javascript
function applyDiscount(price, customerType, couponCode) {
  if (price < 0) throw new Error('Invalid price');

  let discount = 0;

  if (customerType === 'vip') {
    discount = 0.15;
  } else if (customerType === 'regular') {
    discount = 0.05;
  }

  if (couponCode === 'SAVE20') {
    discount = Math.max(discount, 0.20);
  } else if (couponCode === 'SAVE10') {
    discount = Math.max(discount, 0.10);
  }

  const finalPrice = price * (1 - discount);
  return Math.round(finalPrice * 100) / 100;
}
```

**Deliverables:**
- [x] Test case checklist table
- [ ] Actual test code (Jest/Pytest)
- [ ] Coverage report

**Bonus:** Use AI to generate initial tests, then improve them.

**Time Estimate:** 1-2 hours

---

## 🟢 Beginner Tasks

### Task 4: Password Strength Checker

**PRD:**
> Create a password strength checker that evaluates passwords and provides feedback. The checker should rate passwords as Weak, Fair, Good, or Strong based on length, character variety, and common patterns.

**Requirements:**
- Check for minimum length (8 chars)
- Check for uppercase, lowercase, numbers, special chars
- Detect common passwords (use a small list)
- Provide specific feedback on weaknesses
- Score-based rating system

**Scoring:**
| Criteria | Points |
|----------|--------|
| Length >= 8 | +1 |
| Length >= 12 | +2 |
| Has uppercase | +1 |
| Has lowercase | +1 |
| Has number | +1 |
| Has special char | +1 |
| Not common | +1 |

**Rating:**
- 0-2: Weak
- 3-4: Fair
- 5-6: Good
- 7: Strong

**Deliverables:**
- [ ] Function with clear API
- [ ] Test suite (15+ test cases)
- [ ] README with examples
- [ ] Common passwords list

**Time Estimate:** 2-3 hours

---

### Task 5: URL Shortener

**PRD:**
> Build a URL shortening service. Users submit a long URL and receive a short code. Accessing the short code redirects to the original URL.

**Requirements:**
- Generate unique short codes (6 characters)
- Store URL mappings (in-memory or file)
- Redirect to original URL
- Handle duplicate submissions
- Custom alias option

**API:**
```
POST   /shorten       - Create short URL
GET    /:code         - Redirect to original
GET    /info/:code    - Get URL info
```

**Deliverables:**
- [ ] Working service
- [ ] Test suite
- [ ] API documentation
- [ ] Example usage

**Bonus:**
- Add expiration time
- Add click tracking

**Time Estimate:** 3-4 hours

---

### Task 6: Data Validator

**PRD:**
> Create a flexible data validation library that validates objects against schemas. Support string, number, email, and date validations with custom error messages.

**Requirements:**
```javascript
// Desired API
const schema = {
  name: { type: 'string', required: true, min: 2, max: 50 },
  email: { type: 'email', required: true },
  age: { type: 'number', min: 18, max: 120 },
  website: { type: 'url', required: false }
};

validate(data, schema);
// Returns: { valid: boolean, errors: [...] }
```

**Supported Types:**
- string (min, max length)
- number (min, max value)
- email (format validation)
- url (format validation)
- date (ISO format)

**Deliverables:**
- [ ] Validation function
- [ ] 10+ test cases per type
- [ ] Clear error messages
- [ ] Usage documentation

**Time Estimate:** 3-4 hours

---

### Task 7: Rate Limiter

**PRD:**
> Create a rate limiting middleware that limits API requests per time window. Track requests by IP address and return proper headers.

**Requirements:**
- Configurable requests per window
- Configurable window duration
- Track by IP address
- Return rate limit headers
- Handle window resets

**Headers to Return:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

**Usage:**
```javascript
app.use(rateLimit({
  windowMs: 60000,    // 1 minute
  max: 100            // 100 requests
}));
```

**Deliverables:**
- [ ] Middleware function
- [ ] Memory-efficient tracking
- [ ] Test suite
- [ ] Usage examples

**Time Estimate:** 3-4 hours

---

## 🔵 Intermediate Tasks

### Task 8: JSON Configuration Manager

**PRD:**
> Build a tool to manage application configuration from JSON files. Support nested values, environment variable interpolation, and schema validation.

**Requirements:**
```javascript
// config.json
{
  "database": {
    "host": "${DB_HOST}",
    "port": "${DB_PORT}",
    "name": "myapp_${NODE_ENV}"
  }
}

// API
config.get('database.host');      // Get value
config.get('database.port', 5432); // With default
config.set('database.port', 3306); // Set value
config.load('./config.json');      // Load file
config.validate(schema);           // Validate
```

**Deliverables:**
- [ ] Configuration manager
- [ ] Environment variable interpolation
- [ ] Schema validation
- [ ] Test suite
- [ ] Documentation

**Time Estimate:** 4-5 hours

---

### Task 9: Simple Cache Layer

**PRD:**
> Implement an in-memory cache with TTL (time-to-live) support. The cache should auto-expire entries, support different data types, and provide cache statistics.

**Requirements:**
```javascript
// API
cache.set('key', 'value', 300);     // Set with 5min TTL
cache.get('key');                    // Get value
cache.del('key');                    // Delete
cache.clear();                       // Clear all
cache.has('key');                    // Check existence
cache.ttl('key', 600);               // Update TTL
cache.stats();                       // Get statistics
```

**Statistics:**
- Total entries
- Total hits
- Total misses
- Hit rate

**Deliverables:**
- [ ] Cache implementation
- [ ] TTL support
- [ ] Statistics tracking
- [ ] Thread-safe (if applicable)
- [ ] Test suite

**Time Estimate:** 4-5 hours

---

### Task 10: Logger with Levels

**PRD:**
> Create a logging library with multiple log levels, output formatting, and transport options (console, file).

**Requirements:**
- Log levels: DEBUG, INFO, WARN, ERROR
- Configurable minimum level
- Timestamps and metadata
- Pretty print vs JSON format
- File rotation (optional)

**API:**
```javascript
logger.setLevel('INFO');
logger.info('User logged in', { userId: 123 });
logger.error('Database error', { error: err });
logger.debug('Query', { sql: 'SELECT *' });
```

**Deliverables:**
- [ ] Logger class
- [ ] Multiple transports
- [ ] Format options
- [ ] Test suite

**Time Estimate:** 4-5 hours

---

### Task 11: Event Emitter System

**PRD:**
> Implement a publish-subscribe event system. Support one-time listeners, wildcards, and async event handlers.

**Requirements:**
```javascript
// API
emitter.on('user.created', handler);   //Standard
emitter.once('user.created', handler);   // Run once
emitter.off('user.created', handler);    // Unsubscribe/Cleanup
emitter.emit('user.created', data);      //Broadcasting/publishing
emitter.emit('user.*', data);            // Wildcard (*)
```

**Deliverables:**
- [ ] Event emitter
- [ ] Wildcard support
- [ ] Async handler support
- [ ] Error handling
- [ ] Test suite

**Time Estimate:** 4-5 hours

---

## 🟣 Advanced Tasks

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
- [ ] Model definition
- [ ] Query builder
- [ ] CRUD operations
- [ ] Relationship support (optional)
- [ ] Documentation

**Time Estimate:** 6-8 hours

---

## 🎓 How to Approach These Tasks

### Step 1: Understand (15 min)
- Read the PRD carefully
- List requirements clearly
- Identify edge cases
- Ask clarifying questions

### Step 2: Plan (15 min)
- Design the solution
- Create file structure
- Plan API surface
- List test cases

### Step 3: Implement (Main work)
- Start with core functionality
- Add validation
- Handle errors
- Write tests alongside code

### Step 4: Test & Refine (30 min)
- Run all tests
- Check edge cases
- Review code
- Add documentation

### Step 5: Submit
- Create PR/merge request
- Self-review checklist
- Request review from mentor

---

## ✅ Task Completion Checklist

For each task, ensure:

- [ ] All requirements met
- [ ] Tests passing with good coverage
- [ ] README with usage examples
- [ ] Code follows style guide
- [ ] No console.log statements left
- [ ] Error handling implemented
- [ ] Edge cases covered
- [ ] Code is self-documenting

---

## 💡 Tips for Success

1. **Start Small:** Don't over-engineer
2. **Test First:** Write tests before or alongside code
3. **Use AI Wisely:** Let AI generate boilerplate, but understand everything
4. **Ask Questions:** Don't stay stuck for more than 30 min
5. **Learn from Others:** Review code from teammates
6. **Document as You Go:** Don't leave it for the end
7. **Timebox:** Don't spend forever on one task

---

## 📈 Progress Tracking

Track your completed tasks:

| Task | Status | Date | Notes |
|------|--------|------|-------|
| 1. README Generator | ✅ | 2026-07-27 | CLI tool with pytest suite |
| 2. Todo List API | ✅ | 2026-07-27 | FastAPI REST API with pytest suite |
| 3. Test Case Writer | ✅ | 2026-07-27 | Bulleted checklist & Jest tests |
| 4. Password Checker | ✅ | 2026-07-27 | 7-point scoring & Inquirer CLI |
| 5. URL Shortener | ✅ | 2026-07-27 | FastAPI with custom alias & redirection |
| 6. Data Validator | ✅ | 2026-07-27 | Schema validation & 50+ Jest tests |
| 7. Rate Limiter | ✅ | 2026-07-27 | Per-IP middleware, window reset, 11 Jest tests |
| 8. JSON Config Manager | ✅ | 2026-07-27 | Nested get/set, env interpolation, 32 Jest tests |
| 9. Simple Cache Layer | ✅ | 2026-07-27 | TTL & LRU eviction, stats tracker, 9 Jest tests |
| 10. Logger | ✅ | 2026-07-27 | Logger class, multiple formatters/transports, 8 Jest tests |
| 11. Event Emitter | ✅ | 2026-07-27 | Pub-Sub model, bidirectional wildcards, 7 native tests |
| 12. Simple ORM | ✅ | 2026-07-27 | Model schema validation, CRUD operations, 5 pytest tests |

---

**Good luck and happy coding! 🚀**
