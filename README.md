# ⚡ TaskMate — Full-Stack Java Application

> A clean, responsive, and beginner-friendly full-stack task & productivity manager built with **Java 17+ (Spring Boot 3)**, **Spring Data JPA**, **H2 In-Memory Database**, and a **Modern Vanilla JavaScript Frontend**.

---

## 🌟 Key Features

- **Full CRUD Operations**: Create, read, update, delete tasks instantly.
- **RESTful API**: Standardized JSON REST endpoints with validation and error handling.
- **In-Memory Database (H2)**: Zero external setup or SQL server required — starts instantly in memory.
- **Interactive Single-Page UI**:
  - Live KPI statistics cards (Total, In Progress, Completed, Completion Rate).
  - Instant client-side search with debounce.
  - Multi-criteria filtering by Status (All / Pending / Completed), Priority (Low / Medium / High), and Category (Work, Study, Personal, Health, Finance).
  - Dynamic Add & Edit modal dialogs.
  - Toast notifications and visual status badges.
- **Pre-seeded Sample Data**: Comes with realistic demo data on first launch.
- **H2 Web Console**: Inspect database tables, execute SQL queries directly from your browser.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
|---|---|
| **Backend Framework** | Spring Boot 3.3.4 |
| **Language** | Java 17+ (compatible with Java 17, 21, and 25) |
| **Data Persistence** | Spring Data JPA / Hibernate |
| **Database** | H2 Database Engine (In-Memory) |
| **Build Tool** | Apache Maven |
| **Frontend** | HTML5, CSS3 (Modern Glassmorphic Dark UI), Vanilla ES6+ JavaScript |
| **Testing** | JUnit 5 & Spring Boot Test |

```
com.example.taskmate
├── TaskMateApplication.java       # Main Spring Boot Entry Point
├── config
│   └── DataInitializer.java      # Seeds sample tasks on boot
├── controller
│   └── TaskController.java       # Exposes REST API endpoints
├── dto
│   └── TaskStatsDto.java         # DTO for summary KPI metrics
├── model
│   ├── Category.java             # Enum: WORK, STUDY, PERSONAL, HEALTH, FINANCE
│   ├── Priority.java             # Enum: LOW, MEDIUM, HIGH
│   └── Task.java                 # JPA Entity mapped to 'tasks' table
├── repository
│   └── TaskRepository.java       # Spring Data JPA Repository
└── service
    └── TaskService.java          # Business logic & transactional operations
```

Static Frontend:
```
src/main/resources/static/
├── index.html                    # Dashboard UI layout
├── css/styles.css                # Custom styling & responsive layout
└── js/app.js                     # REST API client & DOM manipulation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **JDK 17 or higher** (`java -version`)
- **Maven 3.8+** (`mvn -version`)

### 1. Clone the repository
```bash
git clone https://github.com/harshaavardhinirajaguru-afk/taskmate-fullstack-java.git
cd taskmate-fullstack-java
```

### 2. Build and run
```bash
mvn spring-boot:run
```

### 3. Open in Browser
- **Web Application UI**: [http://localhost:8080](http://localhost:8080)
- **REST API Endpoint**: [http://localhost:8080/api/tasks](http://localhost:8080/api/tasks)
- **H2 Database Console**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
  - *JDBC URL*: `jdbc:h2:mem:taskmatedb`
  - *Username*: `sa`
  - *Password*: *(leave empty)*

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Get all tasks (supports `?completed=`, `?priority=`, `?category=`, `?search=`) |
| `GET` | `/api/tasks/{id}` | Get single task by ID |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/{id}` | Update existing task details |
| `PATCH` | `/api/tasks/{id}/toggle` | Toggle task completion status |
| `DELETE` | `/api/tasks/{id}` | Delete a task |
| `GET` | `/api/tasks/stats` | Get KPI metrics and completion rates |

### Sample POST Request Body:
```json
{
  "title": "Learn Spring Boot & JPA",
  "description": "Understand Entity relationships, Repositories, and REST controllers",
  "priority": "HIGH",
  "category": "STUDY",
  "dueDate": "2026-10-30"
}
```

---

## 🧪 Running Tests

To run unit and integration tests:
```bash
mvn test
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
