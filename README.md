# 🚀 Distributed API Rate Limiter

A production-oriented distributed API Rate Limiter built with **Java 17, Spring Boot, PostgreSQL, Redis, and Redis Lua Scripting**. Instead of relying on existing rate-limiting libraries, this project implements the complete Token Bucket algorithm from scratch, evolving from a database-backed implementation to an atomic Redis Lua solution capable of handling concurrent requests safely.

---

# Why this exists

Most applications use API gateways or third-party libraries for rate limiting.

This project was built to understand and implement every layer of a production-grade rate limiter—from the Token Bucket algorithm and concurrency handling to Redis-based distributed state management and atomic Lua script execution.

Every design decision, trade-off, and optimization was implemented manually rather than hidden behind a framework.

---

- # Features

- **Atomic Token Bucket implementation using Redis Lua** — the complete rate-limiting algorithm executes inside Redis as a single Lua script, eliminating race conditions and ensuring atomic bucket updates.

- **Distributed-ready architecture** — bucket state is stored in Redis while client configuration is persisted in PostgreSQL, allowing multiple application instances to share the same rate-limiting state.

- **Redis Hash-based bucket storage** — bucket state is modeled as Redis Hashes instead of serialized objects, enabling efficient field-level updates with lower memory usage and no serialization overhead.

- **Per-client configurable rate limits** — each client maintains independent configuration including bucket capacity, refill rate, and enabled status, managed through persistent PostgreSQL storage.

- **Hybrid persistence strategy** — immutable client configuration is stored in PostgreSQL while frequently changing bucket state resides in Redis, reducing database load without sacrificing persistence where needed.

- **Single Redis operation per request** — every rate-limit decision performs one atomic `EVAL` execution, avoiding separate GET and SET operations and minimizing network round-trips.

- **RESTful API design** — exposes clean request and response DTOs with structured JSON responses including request status, remaining tokens, and retry duration.

- **Global exception handling** — centralized error handling provides consistent API responses for validation failures, missing client configurations, and unexpected server errors.

- **Input validation** — request payloads are validated before processing to prevent invalid client identifiers or malformed requests.

- **Dockerized development environment** — Redis and supporting services run inside Docker containers, ensuring consistent local development and deployment environments.

- **Health monitoring** — Spring Boot Actuator exposes application health and readiness endpoints for monitoring and operational visibility.

- **Comprehensive testing** — includes unit tests, Mockito-based service tests, MockMvc controller tests, integration tests using Testcontainers, and concurrent request validation.

- **CI/CD ready** — GitHub Actions automatically builds the project, executes the test suite, and verifies every commit before deployment.

- **Production deployment** — containerized application deployable with Docker Compose and cloud platforms such as Railway, Render, or AWS EC2.

- **Designed for extensibility** — the service layer cleanly separates configuration management from bucket execution, making future algorithms (such as Sliding Window or Leaky Bucket) straightforward to integrate without affecting API consumers.

---

# Engineering Decisions

### PostgreSQL stores configuration

Client configuration changes are infrequent and require persistence.

```
Client ID
Algorithm
Capacity
Refill Rate
Enabled
```

---

### Redis stores bucket state

Bucket state changes on every request.

Keeping it in memory avoids unnecessary database writes and enables high-throughput request processing.

---

### Redis Hash instead of JSON

Instead of serializing entire bucket objects,

```
bucket:client123

availableTokens
lastRefillTime
```

is stored as a Redis Hash.

Advantages:

- field-level updates
- lower memory usage
- faster Lua execution
- no serialization overhead

---

### Redis Lua instead of Java synchronization

Without Lua:

```
GET

↓

Calculate

↓

SET
```

Multiple requests may update the same bucket simultaneously.

With Lua:

```
GET

↓

Calculate

↓

SET
```

Everything executes atomically inside Redis.

No Java locks.
No race conditions.
Single network round-trip.

---

### PostgreSQL + Redis Hybrid Design

Persistent configuration lives in PostgreSQL.

Highly mutable bucket state lives in Redis.

This separation reduces database load while keeping configuration durable.

---

# Architecture

```
                Client Request
                       │
                       ▼
                  REST Controller
                       │
                       ▼
             RateLimiterService
                       │
                       ▼
              RedisLuaService
                       │
                       ▼
          RedisTemplate.execute()
                       │
                       ▼
               tokenBucket.lua
                       │
             Redis Hash Storage
                       │
                       ▼
                  RateLimitResponse
```

---

# API

## Check Rate Limit

```
POST /api/rate-limit
```

Request

```json
{
  "clientId": "client123",
  "requestCost": 1
}
```

Response

```json
{
  "allowed": true,
  "remainingTokens": 9,
  "retryAfterSeconds": 0
}
```

---

# Technology Stack

- Java 17
- Spring Boot 3.5
- Spring Data JPA
- PostgreSQL
- Redis
- Redis Lua
- Docker
- Docker Compose
- Maven
- JUnit 5
- Mockito
- Testcontainers
- GitHub Actions
- Swagger/OpenAPI

---

# Performance Characteristics

- O(1) bucket lookup using Redis Hashes
- Single Redis network round-trip per request
- Atomic Lua execution
- No JVM synchronization
- Distributed-ready architecture
- Constant-time token refill calculations

---

# Testing

The project includes:

- Unit Tests
- Mockito Service Tests
- MockMvc Controller Tests
- Integration Tests
- Testcontainers
- Concurrent Load Tests

Concurrency tests verify that simultaneous requests never consume more tokens than available.

---

## Load Testing

The service was validated under concurrent load using JMeter.

- **200 concurrent requests against a single client (50-token bucket)** → exactly **50 requests allowed**, **150 rejected**, **0 race conditions**.
- **1,000 concurrent requests across multiple clients** → maintained correct bucket isolation with **0 incorrect rate-limit decisions**.
- **Atomic Redis Lua execution** ensured no double-spending of tokens under concurrent access.

---

# Running Locally

```bash
git clone https://github.com/swarajborse/Api_Rate_Limiter.git

cd Api_Rate_Limiter

docker compose up

./mvnw spring-boot:run
```

---

# Key Concepts Demonstrated

- Distributed Rate Limiting
- Token Bucket Algorithm
- Redis Lua Scripting
- Redis Hash Data Modeling
- Concurrency Handling
- REST API Design
- Spring Boot
- PostgreSQL
- Docker
- Clean Architecture
- Exception Handling
- Validation
- Testing
- CI/CD

---
