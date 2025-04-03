# Project Name: Project Tracker Backend
### Description: A backend service for tracking projects, tasks, and users.
## Technologies Used: 
 ``` Node.js, Express, PostgreSQL, TypeScript, Jest, Docker, Prisma ```
## Getting Started
### 1. Clone the repository
 ``` git@github.com:shubh-kk/project-tracker-BE.git ```
### 2. Navigate to the project directory
```bash
cd project-tracker-BE
```
###3. Install dependencies
```bash
npm install
```
### 4. Set up the database
  - Create a PostgreSQL database and update the `.env` file with your database credentials.
  - Run the following command to set up the database schema:
```bash
npx prisma migrate dev --name init
```
### 5. Start the server
```bash
npm run dev
```
### 6. Run tests
```bash
npm test
```
### 7. Build the project
```bash
npm run build
```
### 8. Run the built project
```bash
npm start
```
## API Endpoints
- `POST /api/users`: Create a new user
- `GET /api/users`: Get all users
- `GET /api/users/:id`: Get a user by ID
- `PUT /api/users/:id`: Update a user by ID
- `DELETE /api/users/:id`: Delete a user by ID
- `POST /api/tasks`: Create a new task
- `GET /api/tasks`: Get all tasks
- `GET /api/tasks/:id`: Get a task by ID
- `PUT /api/tasks/:id`: Update a task by ID
- `DELETE /api/tasks/:id`: Delete a task by ID
- `POST /api/projects`: Create a new project
- `GET /api/projects`: Get all projects
- `GET /api/projects/:id`: Get a project by ID
- `PUT /api/projects/:id`: Update a project by ID
- `DELETE /api/projects/:id`: Delete a project by ID
- `GET /api/projects/:id/tasks`: Get all tasks for a project
- `POST /api/projects/:id/tasks`: Create a new task for a project
- `PUT /api/projects/:id/tasks/:taskId`: Update a task for a project
- `DELETE /api/projects/:id/tasks/:taskId`: Delete a task for a project
- `GET /api/projects/:id/users`: Get all users for a project
- `POST /api/projects/:id/users`: Add a user to a project
- `DELETE /api/projects/:id/users/:userId`: Remove a user from a project
- `GET /api/projects/:id/users/:userId`: Get a user by ID for a project
- `PUT /api/projects/:id/users/:userId`: Update a user by ID for a project
- `DELETE /api/projects/:id/users/:userId`: Delete a user by ID for a project


# # Directory Structure
# The project is structured as follows:
 ```
# project-tracker-BE
# ├── src
# │   ├── routes
# │   │   ├── user.ts
# │   │   └── task.ts
# │   │   └── project.ts
# │   ├── index.ts
# │   ├── middleware.ts
# ├── _test_
# │   ├── routes.test.js
# ├── .env
# ├── .env.example
# ├── .gitignore
# ├── jest.config.js
# ├── package.json
# ├── prisma
# │   ├── schema.prisma
# ├── README.md
# ├── tsconfig.json
 ```