import request from 'supertest';
import { app, createAdminAndGetToken, createUserAndGetToken } from './auth.helper';
import { truncateAll } from './db.helper';

describe('Currency endpoints', () => {
  beforeEach(async () => {
    await truncateAll();
  });

  it('lista vacía al inicio', async () => {
    const res = await request(app).get('/api/currencies');
    expect(res.status).toBe(200);
    expect(res.body.currencies).toEqual([]);
  });

  it('admin puede crear una moneda', async () => {
    const { accessToken } = await createAdminAndGetToken();

    const res = await request(app)
      .post('/api/currencies')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ symbol: 'BTC', name: 'Bitcoin', type: 'crypto', decimals: 8 });

    expect(res.status).toBe(201);
    expect(res.body.currency.symbol).toBe('BTC');
  });

  it('usuario normal recibe 403', async () => {
    const { accessToken } = await createUserAndGetToken();

    const res = await request(app)
      .post('/api/currencies')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ symbol: 'BTC', name: 'Bitcoin', type: 'crypto', decimals: 8 });

    expect(res.status).toBe(403);
  });

  it('rechaza símbolo duplicado', async () => {
    const { accessToken } = await createAdminAndGetToken();

    await request(app)
      .post('/api/currencies')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ symbol: 'BTC', name: 'Bitcoin', type: 'crypto', decimals: 8 });

    const res = await request(app)
      .post('/api/currencies')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ symbol: 'BTC', name: 'Bitcoin 2', type: 'crypto', decimals: 8 });

    expect(res.status).toBe(409);
  });
});