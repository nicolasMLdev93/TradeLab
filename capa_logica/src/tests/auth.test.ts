import request from 'supertest';
import { app } from './auth.helper';
import { truncateAll } from './db.helper';

describe('Auth endpoints', () => {
  beforeEach(async () => {
    await truncateAll();
  });

  it('registra un usuario correctamente', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'juanperez',
      email: 'juan@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
    });

    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.user).toMatchObject({
      username: 'juanperez',
      email: 'juan@example.com',
      role: 'user',
    });
    expect(res.body.user).not.toHaveProperty('passwordHash');
    expect(res.body.accessToken).toBeDefined();
  });

  it('rechaza si el email ya existe', async () => {
    const payload = {
      username: 'juanperez',
      email: 'juan@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
    };

    await request(app).post('/api/auth/register').send(payload);
    const res = await request(app).post('/api/auth/register').send(payload);

    expect(res.status).toBe(409);
  });

  it('rechaza password débil', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'juan',
      email: 'juan@example.com',
      password: 'debil',
      confirmPassword: 'debil',
    });

    expect(res.status).toBe(400);
  });

  it('loguea con credenciales válidas', async () => {
    const user = {
      username: 'juan',
      email: 'juan@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
    };
    await request(app).post('/api/auth/register').send(user);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: user.password });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it('rechaza password incorrecta', async () => {
    const user = {
      username: 'juan',
      email: 'juan@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
    };
    await request(app).post('/api/auth/register').send(user);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: 'WrongPassword123' });

    expect(res.status).toBe(401);
  });

  it('devuelve /me con token válido', async () => {
    const reg = await request(app).post('/api/auth/register').send({
      username: 'juan',
      email: 'juan@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
    });

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${reg.body.accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('juan@example.com');
  });

  it('rechaza /me sin token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});