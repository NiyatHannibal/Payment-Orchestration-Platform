# Unified-Payment-Orchestration-Platform

## Overview
This repository contains the implementation for the SWENG5111 Distributed Systems mini project at Addis Ababa Science and Technology University. The project involves designing and building a distributed application using microservices architecture with Pub/Sub messaging for event-driven communication. Key components include at least three independent microservices (e.g., API Gateway, Auth Service, Core Business Service), synchronous communication via REST/gRPC, asynchronous events via Kafka/RabbitMQ/Redis, and persistence with a database like PostgreSQL or MongoDB.

The final system will demonstrate modularity, scalability, and reliability, aligning with industry best practices for distributed systems.

## Technologies
- **Languages/Frameworks**: [e.g., Node.js/Express, Python/FastAPI, Go] (TBD)
- **Messaging**: Kafka/RabbitMQ/Redis for Pub/Sub
- **Database**: PostgreSQL/MongoDB
- **Containerization**: Docker & Docker Compose (Kubernetes optional)
- **API Docs**: OpenAPI/Swagger
- **Version Control**: Git with GitHub Actions for CI
- **Testing**: Jest/Pytest, Postman/Newman


## Project Structure
```
├── services/          # Microservices source code
│   ├── auth-service/
│   ├── core-service/
│   └── notification-service/
├── docs/              # Diagrams, API specs, reports
├── docker-compose.yml # Local deployment
├── progress.md        # Weekly progress logs
├── team-contract.md   # Team details
└── CONTRIBUTING.md    # Branching and contribution guidelines
```

## How to Contribute
Follow the guidelines in [CONTRIBUTING.md](CONTRIBUTING.md) for branching (e.g., `feature/`, `docs/`), commit standards, and PR process. Use issues for task tracking.

## Progress Logs
See [progress.md](progress.md) for weekly updates, commits, and blockers.