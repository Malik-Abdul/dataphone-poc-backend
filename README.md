# DataPhone POC

A proof-of-concept internal platform for managing DataPhone phone numbers across multiple telecom carriers, including customer assignment, synchronization, search/filtering, number lifecycle management, and carrier integrations.

## Tech Stack

### Backend

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- Redis
- Docker / Docker Compose

### Frontend

- Next.js
- TypeScript
- Axios

### Carrier Integrations

- Peerless Network
- BulkVS
- Bandwidth

---

# Getting Started

Follow the steps below to run the project locally.

## Prerequisites

Make sure the following are installed on your machine:

- Node.js
- npm
- Docker Desktop

### Docker Desktop

Docker Desktop is required to run the project's PostgreSQL and Redis services.

Install Docker Desktop from the official Docker website:

https://www.docker.com/products/docker-desktop/

After installation, make sure Docker Desktop is running before continuing.

---

## 1. Clone the Repository

Clone the repository and navigate into the project directory:

```bash
git clone <repository-url>

cd dataphone-poc
```

---

## 2. Install Dependencies

Install the project dependencies:

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file in the project root.

You can use the provided `.env.example` file as a template:

```bash
cp .env.example .env
```

Then open `.env` and update the values according to your local environment.

Example:

```env
# Application
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5435
DB_USERNAME=dataphone
DB_PASSWORD=dataphone
DB_DATABASE=dataphone_poc

# Redis
REDIS_HOST=localhost
REDIS_PORT=6380

# JWT
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret

# Carrier Configuration
# Add carrier credentials here when real carrier APIs are enabled.
```

> **Note:** Do not commit the `.env` file to the repository. Use `.env.example` for sharing the required environment variable structure.

---

## 4. Start Docker Services

Make sure Docker Desktop is running, then start the required infrastructure services:

```bash
docker compose up -d
```

This starts the services required by the application, including:

- PostgreSQL
- Redis

You can verify the running containers with:

```bash
docker compose ps
```

To view logs:

```bash
docker compose logs -f
```

To stop the services:

```bash
docker compose down
```

---

## 5. Run the Database Seeder

After PostgreSQL is running, execute the database seeder:

```bash
npm run seed
```

The seeder creates the initial data required for the POC, including users, roles/permissions, customers, carriers, and sample phone numbers where applicable.

This step should be completed before testing the application.

---

## 6. Start the Backend

Run the NestJS application in development mode:

```bash
npm run start:dev
```

The backend will start using the configured port from your `.env` file.

For example:

```text
http://localhost:3000
```

---

# Application Flow

The main workflow of the POC is:

```text
Carrier Portals
      │
      ├── Peerless Network
      ├── BulkVS
      └── Bandwidth
             │
             ▼
      Carrier Integration
             │
             ▼
      DataPhone Backend
             │
             ▼
         PostgreSQL
             │
             ▼
       DataPhone UI
             │
             ▼
      DataPhone Staff
```

The application provides a unified view of phone numbers across carriers instead of requiring staff to manage numbers separately through multiple carrier portals.

---

# Main Features

## Authentication & Authorization

- User authentication
- JWT-based authentication
- Access and refresh token handling
- Role-based access control
- Permission-based authorization
- User management

## Customer Management

- Create customers
- List customers
- Search customers
- View customer phone numbers
- Assign phone numbers to customers

## Phone Number Management

- List phone numbers
- Search phone numbers
- Filter phone numbers
- Filter by carrier
- Filter by status
- Assign numbers to customers
- Move numbers between customers
- Release/disconnect numbers
- Maintain number history

## Carrier Management

The POC supports carrier integrations for:

- Peerless Network
- BulkVS
- Bandwidth

Each carrier has its own adapter implementation so that carrier-specific API logic is separated from the main application.

## Carrier Synchronization

Phone numbers can be synchronized from the supported carriers into the DataPhone system.

Example:

```http
POST /carrier/peerless/sync
POST /carrier/bulkvs/sync
POST /carrier/bandwidth/sync
```

The POC currently supports mocked carrier responses where real carrier credentials/API access are not available.

---

# Development Commands

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run start:dev
```

### Build the application

```bash
npm run build
```

### Run production build

```bash
npm run start:prod
```

### Run database seeder

```bash
npm run seed
```

### Run tests

```bash
npm run test
```

### Run linting

```bash
npm run lint
```

---

# Docker Commands

Start services:

```bash
docker compose up -d
```

Stop services:

```bash
docker compose down
```

Stop services and remove volumes:

```bash
docker compose down -v
```

View running containers:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs -f
```

---

# Environment Configuration

The project uses environment variables for application, database, Redis, authentication, and carrier configuration.

The repository contains:

```text
.env.example
```

Copy it to:

```text
.env
```

and update the values for your local environment.

Never commit production credentials or private API keys to the repository.

---

# Project Structure

```text
src/
├── auth/
├── users/
├── roles/
├── permissions/
├── customers/
├── phone-numbers/
├── carrier/
│   ├── adapters/
│   ├── mocks/
│   ├── carrier.controller.ts
│   ├── carrier.service.ts
│   └── carrier.module.ts
├── database/
└── main.ts
```

---

# Running the Complete Project

For a fresh local setup, the typical sequence is:

```bash
# 1. Clone the repository
git clone <repository-url>

cd dataphone-poc

# 2. Install dependencies
npm install

# 3. Create environment configuration
cp .env.example .env

# 4. Start PostgreSQL and Redis
docker compose up -d

# 5. Seed initial database data
npm run seed

# 6. Start the backend
npm run start:dev
```

After the backend is running, start the frontend according to the frontend setup instructions.

---

# POC Notes

This project is a proof of concept designed to demonstrate a unified DataPhone phone-number management workflow.

Carrier integrations are implemented using an adapter-based architecture. This allows real carrier APIs to be integrated without coupling carrier-specific logic to the core phone-number management system.

Where live carrier credentials or API access are unavailable, mock carrier responses are used to demonstrate the complete application workflow.
