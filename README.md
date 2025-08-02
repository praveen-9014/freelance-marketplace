# Freelance Marketplace

A full-stack freelance marketplace application built with React (frontend) and Spring Boot (backend) with MySQL database.

## Features

### Authentication
- User registration and login with JWT authentication
- Role-based access control (Client/Freelancer)
- Secure password encryption with BCrypt

### Client Functionality
- Post new projects with detailed requirements
- View applications received for each project
- Accept or reject freelancer applications
- Manage project status

### Freelancer Functionality
- Browse available projects
- Filter projects by skills or categories
- Apply to projects with proposals
- Track application status
- View portfolio submissions

### Project Management
- Project creation with budget, deadline, and required skills
- Application tracking and status management
- Real-time updates and notifications

## Tech Stack

### Frontend
- **React 18** with JSX
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Lucide React** for icons

### Backend
- **Spring Boot 3.2.0**
- **Spring Security** with JWT
- **Spring Data JPA** with Hibernate
- **MySQL 8.0** database
- **Maven** for dependency management

## Project Structure

```
project-bolt-sb1-sybrkcbt/
├── project/                 # Frontend React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React context providers
│   │   ├── services/        # API service layer
│   │   └── types/           # Type definitions
│   └── package.json
└── backend/                 # Spring Boot backend
    ├── src/main/java/
    │   └── com/freelance/marketplace/
    │       ├── config/      # Configuration classes
    │       ├── controller/  # REST controllers
    │       ├── dto/         # Data transfer objects
    │       ├── entity/      # JPA entities
    │       ├── repository/  # Data repositories
    │       ├── service/     # Business logic
    │       └── security/    # Security configuration
    └── pom.xml
```

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- Java 17+
- MySQL 8.0+
- Maven 3.6+

### Backend Setup

1. **Database Configuration**
   ```bash
   # Create MySQL database
   CREATE DATABASE freelance_marketplace;
   ```

2. **Update Database Credentials**
   Edit `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. **Build and Run Backend**
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```
   Backend will start on `http://localhost:8080`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd project
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   Frontend will start on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Projects
- `GET /api/projects` - Get all open projects
- `POST /api/projects` - Create new project
- `GET /api/projects/{id}` - Get project by ID
- `GET /api/projects/client` - Get client's projects
- `GET /api/projects/search/skill?skill={skill}` - Search by skill
- `GET /api/projects/search/skills?skills={skill1,skill2}` - Search by multiple skills

### Applications
- `POST /api/applications` - Apply to project
- `GET /api/applications/project/{projectId}` - Get project applications
- `GET /api/applications/freelancer` - Get freelancer's applications
- `PUT /api/applications/{id}/status?status={status}` - Update application status
- `GET /api/applications/check/{projectId}` - Check if user applied

## Database Schema

### Users Table
- `id` (Primary Key)
- `email` (Unique)
- `password` (Encrypted)
- `name`
- `role` (CLIENT/FREELANCER)
- `created_at`

### Projects Table
- `id` (Primary Key)
- `name`
- `description`
- `budget`
- `deadline`
- `status` (OPEN/IN_PROGRESS/COMPLETED)
- `client_id` (Foreign Key)
- `created_at`

### Applications Table
- `id` (Primary Key)
- `proposal_message`
- `expected_price`
- `portfolio_link`
- `status` (PENDING/ACCEPTED/REJECTED)
- `project_id` (Foreign Key)
- `freelancer_id` (Foreign Key)
- `created_at`

### Project Skills Table
- `project_id` (Foreign Key)
- `skill`

## Security Features

- JWT-based authentication
- Password encryption with BCrypt
- Role-based access control
- CORS configuration
- Input validation and sanitization

## Development

### Adding New Features
1. Create entity classes in `backend/src/main/java/com/freelance/marketplace/entity/`
2. Create DTOs in `backend/src/main/java/com/freelance/marketplace/dto/`
3. Create repository interfaces
4. Implement service layer logic
5. Create REST controllers
6. Update frontend components and services

### Testing
- Backend: Use Spring Boot Test framework
- Frontend: Use React Testing Library
- API: Use Postman or similar tools

## Deployment

### Backend Deployment
- Build JAR file: `mvn clean package`
- Deploy to cloud platform (AWS, Azure, etc.)
- Configure environment variables for database and JWT secret

### Frontend Deployment
- Build production files: `npm run build`
- Deploy to static hosting (Netlify, Vercel, etc.)
- Update API base URL for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 