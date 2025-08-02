# Freelance Marketplace - Test Guide

## Prerequisites
- Backend running on http://localhost:8080
- Frontend running on http://localhost:5173
- MySQL database configured

## Test Steps

### 1. Register as a Client
1. Go to http://localhost:5173
2. Click "Sign Up"
3. Fill in details:
   - Name: Test Client
   - Email: client@test.com
   - Password: password123
   - Role: CLIENT
4. Click "Create Account"

### 2. Post a Project (Client)
1. After login, click "Post Project" in the sidebar
2. Fill in project details:
   - Project Name: Test Website Development
   - Description: Need a modern website with React frontend
   - Budget: 5000
   - Deadline: 2024-12-31
   - Required Skills: React, Node.js, CSS
3. Click "Post Project"

### 3. Register as a Freelancer
1. Open a new incognito window
2. Go to http://localhost:5173
3. Click "Sign Up"
4. Fill in details:
   - Name: Test Freelancer
   - Email: freelancer@test.com
   - Password: password123
   - Role: FREELANCER
5. Click "Create Account"

### 4. Apply to Project (Freelancer)
1. After login, you should see the project in "Browse Projects"
2. Click "Apply Now"
3. Fill in application:
   - Proposal Message: I have 3 years of experience in React development...
   - Expected Price: 4500
   - Portfolio Link: https://myportfolio.com
4. Click "Submit Application"

### 5. Review Applications (Client)
1. Go back to the client window
2. Click "My Projects"
3. You should see your project with 1 application
4. Click "Select & Accept" to choose the freelancer

### 6. Check Application Status (Freelancer)
1. Go back to the freelancer window
2. Click "My Applications"
3. You should see your application with "Selected ✓" status

## Expected Results
- Client can post projects and see applications
- Freelancer can browse and apply to projects
- Client can select freelancers
- Freelancer gets notified when selected
- All data persists in MySQL database

## Troubleshooting
- Check browser console for errors
- Verify backend is running on port 8080
- Check MySQL connection in application.properties
- Ensure CORS is properly configured 