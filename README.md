# 📝 Full-Stack Blog Platform

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

A modern, robust, and highly dynamic full-stack blog platform built utilizing a strict layer-based architectural pattern. This application provides robust content management, granular administrative controls, and an interactive feed for end-users, all powered by an end-to-end strongly typed ecosystem.

---

## 🎯 Default Login Credentials
If you have seeded the database via `database/seed.sql`, you can log in immediately:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@blog.com` | `password` |
| **User** | `alice@blog.com` | `password` |
| **User** | `bob@blog.com` | `password` |

---

## 🚀 Technologies Used

### Frontend Application
* **Framework**: Angular 20 (TypeScript) 
* **Styling**: TailwindCSS v3 (Utility-first styling, ensuring style isolation and responsive layouts)
* **Architecture**: Standalone Components strictly managed with Lazy Loaded Routing and functional guards.
* **State Management**: Reactive signals (`@angular/core`) and Observables (`rxjs`).
* **Testing**: Karma test runner with Jasmine.

### Backend Application
* **Runtime**: Node.js mapped through `tsx` to provide immediate execution of TypeScript code without manual transpilation.
* **Web Framework**: Express v4
* **Language**: TypeScript (Interfaces mapping 1:1 to Database tables ensuring complete type safety throughout the API payload flow).
* **Database Engine**: MySQL 8+ (Relational). Uses `mysql2/promise` for asynchronous connection pooling.
* **Testing**: Jest paired with Supertest to simulate HTTP requests and mocked out the Database abstraction layers. (29/29 rigorous integration tests passing).

---

## 🛡️ Security & Architecture

This application employs strict security guardrails to keep data safe:
* **JSON Web Tokens (JWT)**: Application states and APIs are protected via HttpHeaders intercepting Bearer Tokens.
* **Password Hashing**: `bcryptjs` applies a cost-factor of 10 to salt and hash all user passwords natively.
* **Role-Based Access Control (RBAC)**: Security guards (`role.guard.ts` & `role.middleware.ts`) decouple `USER` capabilities from `ADMIN` capabilities securely.
* **Soft Deletion**: Instead of dropping or permanently wiping user or blog entries, entities are marked with `is_deleted = 1` or `is_active = 0`. This secures relationships like comments against orphaned ID failures and maintains essential audit logs.
* **Scoped Database Access**: Employs the *Principle of Least Privilege*. `root` MySQL user access is discouraged; the app instead communicates through a `blog_user` carrying exact targeted privileges.
* **Payload Validation**: The `express-validator` package chains strict rules to normalize emails, trim inputs, and block bad inputs from even touching the database logic.

---

## ✨ Features & Functionality

### 💻 Public Capabilities
* Browse global feeds featuring infinite scrolling / pagination integration.
* Expand posts to view deeply nested hierarchical comments (Replies nested onto comments).
* Advanced keyword search functionality to explore blog catalogs.

### 👤 User Capabilities (Authenticated)
* JWT-driven Registration, Login, and persistent Sessions.
* **Interactive Navigation**: A premium global Top-Navbar that provides a slick drop-down to access options dynamically.
* **Profile Engine**: A dedicated sub-system to seamlessly handle Usernames and Password modifications securely.
* Dynamic Create, Edit, Read, and Soft-delete operations tailored purely to *owned* blog posts.
* Toggleable interactive "Like/Unlike" actions.
* Multi-level Comment posting and interactions on other user's articles.

### 👑 Administrator Capabilities
* Full view of the internal user dashboard.
* Deactivate misbehaving users securely.
* Hard-disable or moderate specific blog posts that violate site policies.

---

## 🛠️ How To Start & Run

Follow these instructions to instantiate the application locally:

### 1. Database Configuration
For security, please use a scoped database user instead of `root`. Below are the steps you can run from your local MySQL Shell (`mysql -u root -p`):

```sql
-- 1. Create the database
CREATE DATABASE IF NOT EXISTS blog_platform;

-- 2. Create the scoped user and grant all necessary database privileges
CREATE USER IF NOT EXISTS 'blog_user'@'localhost' IDENTIFIED BY 'blog_pass';
GRANT ALL PRIVILEGES ON blog_platform.* TO 'blog_user'@'localhost';
FLUSH PRIVILEGES;

EXIT;
```

Load the schema and mock-data using this new user:
```bash
mysql -u blog_user -pblog_pass blog_platform < database/schema.sql
mysql -u blog_user -pblog_pass blog_platform < database/seed.sql
```

### 2. Backend Initialization
Open a new terminal window to prepare the Node.js backend:
```bash
cd backend
npm install
```

Make sure your `backend/.env` maps to the new user details:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=blog_user
DB_PASSWORD=blog_pass
DB_NAME=blog_platform
JWT_SECRET=super_secret_jwt_signature_change_in_production
JWT_EXPIRES_IN=7d
```

Start the application execution engine:
```bash
npm run dev
```
*(The backend logic now responds on `http://localhost:3000`)*

### 3. Frontend Initialization
In a separate terminal window, initialize the Angular frontend:
```bash
cd frontend
npm install --legacy-peer-deps
```

Compile and serve the frontend:
```bash
npm start
# Alternatively, you can use: ng serve
```
*(The graphical interface will render at `http://localhost:4200`)*

---

*Designed to present highly optimized component engineering, secure API structures, and premium aesthetic interactions.*
