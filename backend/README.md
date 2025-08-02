# Freelance Marketplace Backend

A Spring Boot backend for the Freelance Marketplace application with JWT authentication and MySQL database.

## Features

- **Authentication**: JWT-based authentication with registration and login
- **User Management**: Support for Client and Freelancer roles
- **Project Management**: Create, view, and search projects
- **Application System**: Freelancers can apply to projects, clients can manage applications
- **Database**: MySQL with JPA/Hibernate

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+

## Setup

1. **Database Setup**
   - Create a MySQL database named `freelance_marketplace`
   - Update database credentials in `application.properties` if needed

2. **Configuration**
   - Update `application.properties` with your database credentials:
   ```properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. **Build and Run**
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

The application will start on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Projects
- `GET /api/projects` - Get all open projects
- `POST /api/projects` - Create a new project (Client only)
- `GET /api/projects/{id}` - Get project by ID
- `GET /api/projects/client` - Get projects by current client
- `GET /api/projects/search/skill?skill={skill}` - Search projects by skill
- `GET /api/projects/search/skills?skills={skill1,skill2}` - Search projects by multiple skills

### Applications
- `POST /api/applications` - Apply to a project (Freelancer only)
- `GET /api/applications/project/{projectId}` - Get applications for a project
- `GET /api/applications/freelancer` - Get applications by current freelancer
- `PUT /api/applications/{id}/status?status={status}` - Update application status
- `GET /api/applications/check/{projectId}` - Check if user has applied to project

## Database Schema

The application uses the following main entities:
- **users**: User accounts with roles (CLIENT/FREELANCER)
- **projects**: Project listings with requirements and budget
- **applications**: Freelancer applications to projects
- **project_skills**: Skills required for each project

## Security

- JWT-based authentication
- Password encryption with BCrypt
- Role-based access control
- CORS configuration for frontend integration 