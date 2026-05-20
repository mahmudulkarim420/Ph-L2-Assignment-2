# DevPulse – Internal Tech Issue & Feature Tracker

> A collaborative backend platform for software teams to report bugs, suggest features, and coordinate resolutions.

---

## Features

- ** Role-Based Access Control (RBAC):** Strict permissions dividing system privileges between `contributor` and `maintainer` roles.
- ** JWT Authentication:** Secure stateless authentication and route protection using JSON Web Tokens.
- ** Dynamic Sorting & Filtering:** Powerful endpoints supporting structured filtering (e.g., by status or type) and chronological sorting.
- ** Centralized Error Handling:** Global middleware intercepting errors, masking native DB exceptions, and standardizing JSON failure payloads.
- ** Raw SQL Operations (No ORM/JOINs):** Highly optimized, direct database interactions using the native `pg` driver with parameterized queries. Relationship mapping is seamlessly managed at the application logic layer per strict design constraints.

---

##  Technology Stack

- **Runtime:** Node.js (LTS)
- **Language:** TypeScript (Strict Mode)
- **Framework:** Express.js
- **Database:** PostgreSQL (Native `pg` driver)
- **Security:** `bcrypt` (password hashing), `jsonwebtoken` (Auth)
- **Design Constraints:** **Zero ORMs**, **Zero Query Builders**, and **Zero SQL JOINs** utilized.

---

##  Setup Steps (Local Development)

Follow these steps to get the project running securely on your local machine.

### 1. Clone the Repository
```bash
git clone https://github.com/mahmudulkarim420/Ph-L2-Assignment-2.git
cd Ph-L2-Assignment-2
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and define the following variables:
```env
# Server Configuration
PORT=5000

# Database Connection (Adjust to your local PostgreSQL setup)
CONNECTION_STRING=postgres://username:password@localhost:5432/devpulse

# Security
JWT_SECRET=your_super_secret_cryptographic_key
```

### 4. Run the Development Server
```bash
npm run dev
```
*Note: The server will automatically connect to your database and execute `CREATE TABLE IF NOT EXISTS` commands on startup to scaffold your schema!*

---

##  API Endpoints Summary

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **`POST`** | `/api/auth/signup` | Register a new user (`contributor` or `maintainer`). | Public |
| **`POST`** | `/api/auth/login` | Authenticate and receive a JWT Bearer token. | Public |
| **`POST`** | `/api/issues` | Create a new bug or feature request. | Protected |
| **`GET`** | `/api/issues` | Retrieve all issues (Supports sorting & filtering). | Public |
| **`GET`** | `/api/issues/:id` | Retrieve a specific issue by its ID. | Public |
| **`PATCH`** | `/api/issues/:id` | Update an issue (Strict ownership/role rules apply). | Protected |
| **`DELETE`**| `/api/issues/:id` | Delete an issue. | Maintainer |

> **Note:** All endpoints adhere to a strict response envelope: `{ success, message, data }` for success and `{ success, message, errors }` for failures.

---

##  Database Schema Summary

The database is built on PostgreSQL and consists of two primary tables:

1. **`users` Table:** 
   - Stores user credentials safely (passwords hashed via bcrypt).
   - Manages roles (`contributor` vs `maintainer`).
   - Ensures `email` uniqueness.

2. **`issues` Table:**
   - Tracks `title`, `description`, `type` (bug/feature), and `status` (open/in_progress/resolved).
   - Links back to the user via the `reporter_id` column.

**Architectural Note:** In strict compliance with the project rules, **No SQL JOIN operations** are used. Foreign keys are enforced natively, but entity resolution (e.g., mapping a `reporter` object inside an `issue` payload) is handled securely and efficiently by the TypeScript application service layer.
