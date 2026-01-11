# TypeScript Microservice with Hexagonal Architecture

A robust, scalable microservice built with **TypeScript**, **Express 5**, and **Sequelize ORM**, following the **Hexagonal (Ports & Adapters) Architecture** pattern. This project demonstrates clean architecture principles with a focus on separation of concerns, testability, and maintainability.

---

## Features

- **Hexagonal Architecture** - Clean separation between domain logic and infrastructure
- **TypeScript** - Full type safety across the entire codebase
- **Express 5** - Latest Express framework with async/await support
- **Sequelize ORM** - Database abstraction with MySQL support
- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control (RBAC)** - Granular permission management
- **Redis Integration** - Caching and session management
- **RPC Communication** - Inter-service communication support
- **Zod Validation** - Runtime schema validation
- **Module Aliases** - Clean import paths with `@modules` and `@share`

---

## Project Structure

```
src/
├── index.ts                    # Application entry point
├── modules/                    # Feature modules (Hexagonal)
│   ├── brand/                  # Brand management module
│   ├── cart/                   # Shopping cart module
│   ├── category/               # Category management module
│   ├── order/                  # Order processing module
│   ├── product/                # Product catalog module
│   └── user/                   # User & authentication module
└── share/                      # Shared utilities & infrastructure
    ├── app-error.ts            # Centralized error handling
    ├── component/              # Core components (DB, Redis, JWT, Config)
    ├── event/                  # Event-driven architecture support
    ├── interface/              # Shared interfaces & contracts
    ├── middleware/             # Express middlewares (Auth, Role)
    ├── model/                  # Shared domain models
    ├── repository/             # Shared repository implementations
    ├── transport/              # HTTP transport utilities
    └── utils/                  # Helper functions
```

### Module Structure (Hexagonal Pattern)

Each module follows this standardized structure:

```
module/
├── index.ts                    # Module setup & route registration
├── model/                      # Domain models & validation schemas
├── interface/                  # Port definitions (abstractions)
├── usecase/                    # Application/business logic
└── infras/                     # Infrastructure layer
    ├── repository/             # Data access implementations
    │   ├── mysql/              # Sequelize implementations
    │   └── rpc/                # RPC client implementations
    └── transport/              # HTTP handlers/controllers
```

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Runtime** | Node.js |
| **Language** | TypeScript 5.x |
| **Framework** | Express 5.x |
| **ORM** | Sequelize 6.x |
| **Database** | MySQL |
| **Cache** | Redis (ioredis) |
| **Authentication** | JWT (jsonwebtoken) |
| **Validation** | Zod |
| **Password Hashing** | bcrypt |
| **HTTP Client** | Axios |
| **Logging** | Morgan |

---

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- MySQL database
- Redis server
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/thanhhoa3514/Microservice-Hexagonal-App.git
   cd ts-microservice
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   
   # Database
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=your_database
   DB_USER=your_username
   DB_PASSWORD=your_password
   
   # Redis
   REDIS_HOST=localhost
   REDIS_PORT=6379
   
   # JWT
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1d
   
   # RPC URLs
   TOKEN_INTROSPECT_RPC_URL=http://localhost:3000/v1/users/auth/introspect
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000`

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/v1/users/auth/register` | Register a new user | ❌ |
| POST | `/v1/users/auth/login` | User login | ❌ |
| GET | `/v1/users/auth/profile` | Get user profile | ✅ |
| PATCH | `/v1/users/auth/profile` | Update user profile | ✅ |

### Users (Admin)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/v1/users` | List all users | ❌ |
| GET | `/v1/users/:id` | Get user by ID | ✅ |
| POST | `/v1/users` | Create a user | ✅ (Admin) |
| PATCH | `/v1/users/:id` | Update a user | ✅ (Admin) |
| DELETE | `/v1/users/:id` | Delete a user | ✅ (Admin) |

### Products

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/v1/products` | List all products | ✅ |
| GET | `/v1/products/:id` | Get product by ID | ✅ |
| POST | `/v1/products` | Create a product | ✅ (Admin) |
| PATCH | `/v1/products/:id` | Update a product | ✅ (Admin) |
| DELETE | `/v1/products/:id` | Delete a product | ✅ (Admin) |

### Categories

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/v1/categories` | List all categories | ✅ |
| POST | `/v1/categories` | Create a category | ✅ (Admin) |
| PATCH | `/v1/categories/:id` | Update a category | ✅ (Admin) |
| DELETE | `/v1/categories/:id` | Delete a category | ✅ (Admin) |

### Brands

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/v1/brands` | List all brands | ✅ |
| POST | `/v1/brands` | Create a brand | ✅ (Admin) |
| PATCH | `/v1/brands/:id` | Update a brand | ✅ (Admin) |
| DELETE | `/v1/brands/:id` | Delete a brand | ✅ (Admin) |

### Cart

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/v1/cart` | Get user's cart | ✅ |
| POST | `/v1/cart` | Add item to cart | ✅ |
| PATCH | `/v1/cart/:id` | Update cart item | ✅ |
| DELETE | `/v1/cart/:id` | Remove item from cart | ✅ |

### Orders

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/v1/orders` | List user's orders | ✅ |
| POST | `/v1/orders` | Create an order | ✅ |
| GET | `/v1/orders/:id` | Get order by ID | ✅ |

---

## 🏛️ Architecture Overview

This project implements the **Hexagonal Architecture** (also known as Ports & Adapters), which provides:

### Core Principles

1. **Domain Isolation** - Business logic is independent of frameworks and external services
2. **Dependency Inversion** - High-level modules don't depend on low-level modules
3. **Testability** - Easy to unit test by mocking ports
4. **Flexibility** - Easy to swap implementations (e.g., change database)

### Layer Responsibilities

```
┌─────────────────────────────────────────────────────────────┐
│                    HTTP Transport Layer                      │
│              (Express Routes & Controllers)                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│                   (Use Cases / Services)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Domain Layer                           │
│               (Entities, Value Objects, Ports)               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Infrastructure Layer                       │
│          (Repositories, External Services, RPC)              │
└─────────────────────────────────────────────────────────────┘
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start development server with nodemon |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm test` | Run tests (to be configured) |

---

## Security Features

- **JWT-based Authentication** - Stateless token authentication
- **Password Hashing** - Secure password storage with bcrypt
- **Role-Based Access Control** - Admin and User roles with granular permissions
- **Token Introspection** - RPC-based token validation for microservices
- **Input Validation** - Request validation using Zod schemas

---

## 🔧 Configuration

### Module Aliases

The project uses module aliases for cleaner imports:

```typescript
// Instead of
import { something } from '../../../share/component/config';

// Use
import { something } from '@share/component/config';
```

Configured aliases:
- `@modules/*` → `src/modules/*`
- `@share/*` → `src/share/*`

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the ISC License.

---

## 👤 Author

**thanhhoa3514**

- GitHub: [@thanhhoa3514](https://github.com/thanhhoa3514)

---

