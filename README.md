# 🛒 AI-Based Multivendor E-commerce SaaS

Welcome to **EAshop** – a scalable, AI-powered, multivendor e-commerce platform built with a modern microservices architecture. This project is designed for SaaS providers and marketplace operators seeking flexibility, performance, and intelligent automation.

---

## 🚀 Features

- **AI-Driven Recommendations**: Personalized product suggestions and smart search.
- **Multivendor Support**: Seamless onboarding and management for multiple vendors.
- **Microservices Architecture**: Each domain (auth, catalog, orders, payments, etc.) is an independent service for scalability and maintainability.
- **SaaS Ready**: Multi-tenancy, subscription management, and white-label capabilities.
- **Modern Dev Experience**: Nx monorepo, CI/CD ready, and developer tooling.
- **Extensible APIs**: RESTful and GraphQL endpoints for integration and customization.
- **Secure by Design**: Role-based access, JWT authentication, and best practices.

---

## 🏗️ Architecture Overview

```
+-------------------+      +-------------------+      +-------------------+
|   API Gateway     | ---> |   Auth Service    | ---> |   User Service    |
+-------------------+      +-------------------+      +-------------------+
         |                        |                           |
         v                        v                           v
+-------------------+      +-------------------+      +-------------------+
| Product Service   |      | Order Service     |      | Payment Service   |
+-------------------+      +-------------------+      +-------------------+
         |                        |                           |
         v                        v                           v
+-------------------+      +-------------------+      +-------------------+
| AI Recommendation |      | Notification Svc  |      | Vendor Mgmt Svc   |
+-------------------+      +-------------------+      +-------------------+
```

- **Each service** is independently deployable and communicates via lightweight APIs or message queues.
- **AI modules** are integrated as separate services for recommendations, search, and analytics.

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Nx CLI](https://nx.dev/)
- [Docker](https://www.docker.com/) (for local microservices)

### Clone & Install

```sh
git clone https://github.com/your-org/eashop.git
cd eashop
npm install
```

---

### ⚡ Setting Up with Nx

[Nx](https://nx.dev/) is a powerful monorepo tool that helps manage and scale your microservices architecture efficiently.

#### Install Nx CLI globally (optional but recommended):

```sh
npm install -g nx
```

#### Useful Nx Commands

- **Run a service in development:**
  ```sh
  npx nx serve <service-name>
  ```
- **Build a service for production:**
  ```sh
  npx nx build <service-name>
  ```
- **Run tests for a service:**
  ```sh
  npx nx test <service-name>
  ```
- **List all available projects:**
  ```sh
  npx nx show projects
  ```
- **Visualize project dependencies:**
  ```sh
  npx nx graph
  ```

For more, see the [Nx documentation](https://nx.dev/).

---

### Run Services

Start a service (e.g., auth):

```sh
npx nx serve auth-service
```

Or run all services with Docker Compose:

```sh
docker-compose up
```

### Build for Production

```sh
npx nx build <service-name>
```

---

## 📦 Project Structure

- `apps/` – Microservices (auth, product, order, payment, etc.)
- `libs/` – Shared libraries (models, utils, AI modules)
- `tools/` – Dev tools and scripts
- `docker/` – Containerization configs

---

## 🤖 AI Capabilities

- **Personalized Recommendations**
- **Smart Search & Filtering**
- **Sales Analytics & Insights**
- **Fraud Detection (optional)**

---

## 📚 Documentation

- [Architecture Docs](docs/architecture.md)
- [API Reference](docs/api.md)
- [Contributing Guide](CONTRIBUTING.md)

---

## For setting the replicated db (prisma working for mongodb)

1. run window powershell as administrator: mongod --replSet rs0 --dbpath "C:\data\db"
2. in cmd prompt run: mongosh --host localhost --port 27017
3. in mongosh run: rs.initiate()
4. in mongosh run: rs.status()
5. to stop current replica set run: rs.stepDown()
6. to stop current mongod run: net stop MongoDB

---

## 🤝 Contributing

We welcome contributions! Please read our [contributing guidelines](CONTRIBUTING.md) to get started.

---

## 📬 Contact & Community

- [Discord](https://discord.gg/your-invite)
- [Issues](https://github.com/your-org/eashop/issues)
- [Blog](https://your-org.dev/blog)

---

> **EAshop** – Powering the next generation of intelligent, scalable marketplaces.
