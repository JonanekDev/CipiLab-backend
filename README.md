# CipiLab Backend
Backend API for Cipilab — a self-hosted home server management platform.

🚧 **Work in Progress** 🚧

## 🚧 Planned features
- Simple service creation and management using Docker containers

- Template system for easy deployment of common services

- System and container monitoring (CPU, RAM, disk, network, temperatures)

- ZFS management (pools, datasets, snapshots, health)

- Server management (system updates, restarts, basic hardware info)

- User and permission system (with optional OAuth integration)

- Backup and restore of configuration and data

- Public service access through integrated Cloudflare Tunnel

- Notifications for outages, updates, and system warnings

- Audit log for tracking actions and events

- Optional AdGuard Home integration for automatic DNS and proxy setup for services in CipiLab

## 🛠️ Technologies
- [Nest.js](https://nestjs.com/) - Backend framework
- [Prisma](https://www.prisma.io/) - Database

## 📋 Requirements
- Running Postgres database


## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
