import request from 'supertest';
import { app, createUserAndGetToken } from './auth.helper';
import { truncateAll } from './db.helper';
import { Currency } from '../models/currency.model';
import { Wallet } from '../models/wallet.model';

describe('Transaction endpoints', () => {
  let walletId: number;
  let accessToken: string;

  beforeEach(async () => {
    await truncateAll();

    const currency = await Currency.create({
      symbol: 'BTC',
      name: 'Bitcoin',
      type: 'crypto',
      decimals: 8,
    });

    const auth = await createUserAndGetToken();
    accessToken = auth.accessToken;

    const wallet = await Wallet.create({
      userId: auth.user.id,
      currencyId: currency.id,
      balance: '0',
    });
    walletId = wallet.id;
  });

  it('crea transacción con estado pending', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ walletId, type: 'buy', amount: '0.5', price: '45000.00' });

    expect(res.status).toBe(201);
    expect(res.body.transaction.status).toBe('pending');
  });

  it('rechaza amount negativo', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ walletId, type: 'buy', amount: '-1' });

    expect(res.status).toBe(400);
  });

  it('cambia estado a completed', async () => {
    const create = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ walletId, type: 'buy', amount: '0.5' });

    const res = await request(app)
      .patch(`/api/transactions/${create.body.transaction.id}/status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ status: 'completed' });

    expect(res.status).toBe(200);
    expect(res.body.transaction.status).toBe('completed');
  });

  it('no permite cambiar estado ya completada', async () => {
    const create = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ walletId, type: 'buy', amount: '0.5' });

    await request(app)
      .patch(`/api/transactions/${create.body.transaction.id}/status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ status: 'completed' });

    const res = await request(app)
      .patch(`/api/transactions/${create.body.transaction.id}/status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ status: 'cancelled' });

    expect(res.status).toBe(409);
  });

  it('filtra por status', async () => {
    await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ walletId, type: 'buy', amount: '0.1' });

    const res = await request(app)
      .get('/api/transactions?status=pending')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.body.total).toBe(1);
  });

  it('permite borrar pending', async () => {
    const create = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ walletId, type: 'buy', amount: '0.5' });

    const res = await request(app)
      .delete(`/api/transactions/${create.body.transaction.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
  });

  it('no permite borrar completed', async () => {
    const create = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ walletId, type: 'buy', amount: '0.5' });

    await request(app)
      .patch(`/api/transactions/${create.body.transaction.id}/status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ status: 'completed' });

    const res = await request(app)
      .delete(`/api/transactions/${create.body.transaction.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(409);
  });
});