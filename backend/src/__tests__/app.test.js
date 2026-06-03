const request = require('supertest');
const { app } = require('../app');
const UserModel = require('../models/User');
const TaskModel = require('../models/Task');

describe('TaskMaster API', () => {
  let token;

  beforeAll(async () => {
    if (UserModel.reset) UserModel.reset();
    if (TaskModel.reset) TaskModel.reset();

    await UserModel.create('admin', 'admin@taskmaster.com', 'Admin123!');
    const admin = UserModel.findByUsername('admin');
    token = UserModel.generateToken(admin);
  });

  test('GET /health', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  test('GET /metrics', async () => {
    const res = await request(app).get('/metrics');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('http_requests_total');
  });

  test('POST /api/auth/login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'Admin123!' });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('Tasks CRUD', async () => {
    const create = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test task', priority: 'high' });

    expect(create.statusCode).toBe(201);
    const id = create.body.id;

    const list = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(list.body.tasks.length).toBeGreaterThan(0);

    const update = await request(app)
      .put(`/api/tasks/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'done' });

    expect(update.body.status).toBe('done');

    const del = await request(app)
      .delete(`/api/tasks/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(del.statusCode).toBe(204);
  });
});
