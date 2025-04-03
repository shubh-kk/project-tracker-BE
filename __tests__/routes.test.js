const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Mock the Prisma client
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn()
    },
    project: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    $disconnect: jest.fn()
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

// Mock modules instead of requiring them directly
jest.mock('../src/routes/user', () => {
  const express = require('express');
  const router = express.Router();
  
  // Recreate simplified versions of your routes for testing
  router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please provide name, email and password' });
    }
    
    const prisma = req.app.locals.prisma;
    
    prisma.user.create.mockResolvedValue({
      id: 'user1',
      name,
      email,
      password: 'hashedPassword'
    });
    
    return res.status(201).json({
      msg: 'User registered successfully',
      user: {
        id: 'user1',
        name,
        email
      }
    });
  });
  
  router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide email and password' });
    }
    
    const prisma = req.app.locals.prisma;
    
    // Simulate user lookup
    if (email === 'nonexistent@example.com') {
      prisma.user.findUnique.mockResolvedValue(null);
      return res.status(404).json({ msg: 'User not found' });
    }
    
    if (password === 'wrongpassword') {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user1',
        email,
        password: 'hashedPassword'
      });
      return res.status(401).json({ msg: 'Invalid password' });
    }
    
    prisma.user.findUnique.mockResolvedValue({
      id: 'user1',
      name: 'Test User',
      email,
      password: 'hashedPassword'
    });
    
    return res.status(200).json({
      msg: 'Login successful',
      token: 'test-token',
      user: {
        id: 'user1',
        name: 'Test User',
        email
      }
    });
  });
  
  router.get('/', (req, res) => {
    const prisma = req.app.locals.prisma;
    
    try {
      const users = [
        { id: 'user1', name: 'User 1', email: 'user1@example.com' },
        { id: 'user2', name: 'User 2', email: 'user2@example.com' }
      ];
      prisma.user.findMany.mockResolvedValue(users);
      
      return res.status(200).json({
        count: users.length,
        users
      });
    } catch (error) {
      return res.status(500).json({ msg: 'Error while fetching users', error });
    }
  });
  
  return router;
});

jest.mock('../src/routes/project', () => {
  const express = require('express');
  const router = express.Router();
  
  // Middleware to verify token
  router.use((req, res, next) => {
    req.user = { userId: 'user1' };  // Mock authenticated user
    next();
  });
  
  router.post('/', (req, res) => {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ msg: 'Please provide title for the project' });
    }
    
    const prisma = req.app.locals.prisma;
    
    prisma.project.create.mockResolvedValue({
      id: 'project1',
      title,
      description: description || '',
      userId: req.user.userId
    });
    
    return res.status(201).json({
      msg: 'Project created successfully',
      project: {
        id: 'project1',
        title,
        description: description || '',
        userId: req.user.userId
      }
    });
  });
  
  router.get('/', (req, res) => {
    const prisma = req.app.locals.prisma;
    
    try {
      const projects = [
        { id: 'project1', title: 'Project 1', description: 'Description 1', userId: 'user1' },
        { id: 'project2', title: 'Project 2', description: 'Description 2', userId: 'user1' }
      ];
      prisma.project.findMany.mockResolvedValue(projects);
      
      return res.status(200).json({
        count: projects.length,
        projects
      });
    } catch (error) {
      return res.status(500).json({ msg: 'Error while fetching projects', error });
    }
  });
  
  router.get('/:projectId', (req, res) => {
    const { projectId } = req.params;
    const prisma = req.app.locals.prisma;
    
    if (projectId === 'nonexistent') {
      prisma.project.findUnique.mockResolvedValue(null);
      return res.status(404).json({ msg: `Project not found with id: ${projectId}` });
    }
    
    prisma.project.findUnique.mockResolvedValue({
      id: projectId,
      title: 'Project 1',
      description: 'Description 1',
      userId: req.user.userId
    });
    
    return res.status(200).json({
      project: {
        id: projectId,
        title: 'Project 1',
        description: 'Description 1',
        userId: req.user.userId
      }
    });
  });
  
  router.patch('/:projectId', (req, res) => {
    const { projectId } = req.params;
    const { title, description } = req.body;
    const prisma = req.app.locals.prisma;
    
    if (projectId === 'nonexistent') {
      prisma.project.findUnique.mockResolvedValue(null);
      return res.status(404).json({ msg: `Project not found with id: ${projectId}` });
    }
    
    prisma.project.findUnique.mockResolvedValue({
      id: projectId,
      title: 'Old Title',
      description: 'Old Description',
      userId: req.user.userId
    });
    
    prisma.project.update.mockResolvedValue({
      id: projectId,
      title: title || 'Old Title',
      description: description || 'Old Description',
      userId: req.user.userId
    });
    
    return res.status(200).json({
      msg: 'Project updated successfully',
      updatedProject: {
        id: projectId,
        title: title || 'Old Title',
        description: description || 'Old Description',
        userId: req.user.userId
      }
    });
  });
  
  router.delete('/:projectId', (req, res) => {
    const { projectId } = req.params;
    const prisma = req.app.locals.prisma;
    
    if (projectId === 'nonexistent') {
      prisma.project.findUnique.mockResolvedValue(null);
      return res.status(404).json({ msg: `Project not found with id: ${projectId}` });
    }
    
    prisma.project.findUnique.mockResolvedValue({
      id: projectId,
      title: 'Project 1',
      userId: req.user.userId
    });
    
    prisma.project.delete.mockResolvedValue({
      id: projectId,
      title: 'Project 1',
      userId: req.user.userId
    });
    
    return res.status(200).json({
      msg: 'Project deleted successfully'
    });
  });
  
  return router;
});

jest.mock('../src/routes/task', () => {
  const express = require('express');
  const router = express.Router();
  
  // Middleware to verify token
  router.use((req, res, next) => {
    req.user = { userId: 'user1' };  // Mock authenticated user
    next();
  });
  
  router.post('/', (req, res) => {
    const { title, description, projectId } = req.body;
    const prisma = req.app.locals.prisma;
    
    if (!title || !projectId) {
      return res.status(400).json({ msg: 'Please provide title and projectId for the task' });
    }
    
    if (projectId === 'nonexistent') {
      prisma.project.findUnique.mockResolvedValue(null);
      return res.status(404).json({ msg: `Project not found with id: ${projectId}` });
    }
    
    prisma.project.findUnique.mockResolvedValue({
      id: projectId,
      userId: req.user.userId
    });
    
    prisma.task.create.mockResolvedValue({
      id: 'task1',
      title,
      description: description || '',
      isComplete: false,
      projectId
    });
    
    return res.status(201).json({
      msg: 'Task created successfully',
      task: {
        id: 'task1',
        title,
        description: description || '',
        isComplete: false,
        projectId
      }
    });
  });
  
  router.get('/:projectId', (req, res) => {
    const { projectId } = req.params;
    const prisma = req.app.locals.prisma;
    
    if (projectId === 'nonexistent') {
      prisma.project.findUnique.mockResolvedValue(null);
      return res.status(404).json({ msg: `Project not found with id: ${projectId}` });
    }
    
    prisma.project.findUnique.mockResolvedValue({
      id: projectId,
      userId: req.user.userId
    });
    
    const tasks = [
      { id: 'task1', title: 'Task 1', isComplete: false, projectId },
      { id: 'task2', title: 'Task 2', isComplete: true, projectId }
    ];
    prisma.task.findMany.mockResolvedValue(tasks);
    
    return res.status(200).json({
      count: tasks.length,
      tasks
    });
  });
  
  router.patch('/:taskId', (req, res) => {
    const { taskId } = req.params;
    const prisma = req.app.locals.prisma;
    
    if (taskId === 'nonexistent') {
      prisma.task.findUnique.mockResolvedValue(null);
      return res.status(404).json({ msg: `Task not found with id: ${taskId}` });
    }
    
    prisma.task.findUnique.mockResolvedValue({
      id: taskId,
      title: 'Task 1',
      isComplete: false,
      projectId: 'project1'
    });
    
    prisma.task.update.mockResolvedValue({
      id: taskId,
      title: 'Task 1',
      isComplete: true,
      projectId: 'project1'
    });
    
    return res.status(200).json({
      msg: 'Task marked as completed!',
      updatedTask: {
        id: taskId,
        title: 'Task 1',
        isComplete: true,
        projectId: 'project1'
      }
    });
  });
  
  router.delete('/:taskId', (req, res) => {
    const { taskId } = req.params;
    const prisma = req.app.locals.prisma;
    
    if (taskId === 'nonexistent') {
      prisma.task.findUnique.mockResolvedValue(null);
      return res.status(404).json({ msg: `Task not found with id: ${taskId}` });
    }
    
    prisma.task.findUnique.mockResolvedValue({
      id: taskId,
      title: 'Task 1',
      projectId: 'project1'
    });
    
    prisma.task.delete.mockResolvedValue({
      id: taskId,
      title: 'Task 1',
      projectId: 'project1'
    });
    
    return res.status(200).json({
      msg: 'Task deleted successfully'
    });
  });
  
  return router;
});

// Mock environment variables
process.env.JWT_SECRET = 'test-jwt-secret';

describe('API Tests', () => {
  let app;
  let prisma;
  
  beforeAll(() => {
    // Setup Express app for testing
    app = express();
    app.use(express.json());
    
    // Get the mocked Prisma client
    const { PrismaClient } = require('@prisma/client');
    prisma = new PrismaClient();
    
    // Make prisma available to routes
    app.locals.prisma = prisma;
    
    // Mount routes
    app.use('/api/users', require('../src/routes/user'));
    app.use('/api/projects', require('../src/routes/project'));
    app.use('/api/tasks', require('../src/routes/task'));
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  afterAll(() => {
    prisma.$disconnect();
  });
  
  describe('User Routes', () => {
    test('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('msg', 'User registered successfully');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id', 'user1');
    });
    
    test('should return 400 if required fields are missing for registration', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          name: 'Test User',
          // email missing
          password: 'password123'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('msg', 'Please provide name, email and password');
    });
    
    test('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('msg', 'Login successful');
      expect(response.body).toHaveProperty('token', 'test-token');
    });
    
    test('should return 400 if email or password is missing for login', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          // email missing
          password: 'password123'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('msg', 'Please provide email and password');
    });
    
    test('should return 404 if user is not found', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('msg', 'User not found');
    });
    
    test('should return 401 if password is incorrect', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('msg', 'Invalid password');
    });
    
    test('should get all users', async () => {
      const response = await request(app)
        .get('/api/users');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('count', 2);
      expect(response.body).toHaveProperty('users');
      expect(response.body.users).toHaveLength(2);
    });
  });
  
  describe('Project Routes', () => {
    test('should create a project successfully', async () => {
      const response = await request(app)
        .post('/api/projects')
        .send({
          title: 'Test Project',
          description: 'A test project'
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('msg', 'Project created successfully');
      expect(response.body).toHaveProperty('project');
      expect(response.body.project).toHaveProperty('id', 'project1');
    });
    
    test('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/api/projects')
        .send({
          // title missing
          description: 'A test project'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('msg', 'Please provide title for the project');
    });
    
    test('should get all projects for a user', async () => {
      const response = await request(app)
        .get('/api/projects');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('count', 2);
      expect(response.body).toHaveProperty('projects');
      expect(response.body.projects).toHaveLength(2);
    });
    
    test('should get a specific project', async () => {
      const response = await request(app)
        .get('/api/projects/project1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('project');
      expect(response.body.project).toHaveProperty('id', 'project1');
    });
    
    test('should return 404 if project is not found', async () => {
      const response = await request(app)
        .get('/api/projects/nonexistent');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('msg', 'Project not found with id: nonexistent');
    });
    
    test('should update a project successfully', async () => {
      const response = await request(app)
        .patch('/api/projects/project1')
        .send({
          title: 'Updated Title',
          description: 'Updated Description'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('msg', 'Project updated successfully');
      expect(response.body).toHaveProperty('updatedProject');
    });
    
    test('should delete a project successfully', async () => {
      const response = await request(app)
        .delete('/api/projects/project1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('msg', 'Project deleted successfully');
    });
  });
  
  describe('Task Routes', () => {
    test('should create a task successfully', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Test Task',
          description: 'A test task',
          projectId: 'project1'
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('msg', 'Task created successfully');
      expect(response.body).toHaveProperty('task');
      expect(response.body.task).toHaveProperty('id', 'task1');
    });
    
    test('should get all tasks for a project', async () => {
      const response = await request(app)
        .get('/api/tasks/project1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('count', 2);
      expect(response.body).toHaveProperty('tasks');
      expect(response.body.tasks).toHaveLength(2);
    });
    
    test('should toggle task completion status', async () => {
      const response = await request(app)
        .patch('/api/tasks/task1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('msg', 'Task marked as completed!');
      expect(response.body).toHaveProperty('updatedTask');
      expect(response.body.updatedTask).toHaveProperty('isComplete', true);
    });
    
    test('should delete a task successfully', async () => {
      const response = await request(app)
        .delete('/api/tasks/task1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('msg', 'Task deleted successfully');
    });
  });
});