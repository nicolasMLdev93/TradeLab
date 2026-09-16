import request from "supertest";
import { app, createUserAndGetToken } from "./auth.helper";
import { truncateAll } from "./db.helper";
import { Currency } from "../models/currency.model";

describe("Wallet endpoints", () => {
  let currencyId: number;

  beforeEach(async () => {
    await truncateAll();

    const currency = await Currency.create({
      symbol: "BTC",
      name: "Bitcoin",
      type: "crypto",
      decimals: 8,
    });
    currencyId = currency.id;
  });

  it("crea wallet para el usuario", async () => {
    const { accessToken } = await createUserAndGetToken();

    const res = await request(app)
      .post("/api/wallets")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ currencyId, address: "0xabc123" });

    expect(res.status).toBe(201);
    expect(res.body.wallet.currencyId).toBe(currencyId);
  });

  it("rechaza moneda duplicada para el mismo usuario", async () => {
    const { accessToken } = await createUserAndGetToken();

    await request(app)
      .post("/api/wallets")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ currencyId });

    const res = await request(app)
      .post("/api/wallets")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ currencyId });

    expect(res.status).toBe(409);
  });

  it("rechaza sin autenticación", async () => {
    const res = await request(app).post("/api/wallets").send({ currencyId });
    expect(res.status).toBe(401);
  });

  it("lista solo wallets del usuario", async () => {
    const { accessToken: t1 } = await createUserAndGetToken({
      email: "u1@test.com",
    });
    const { accessToken: t2 } = await createUserAndGetToken({
      email: "u2@test.com",
      username: "user2",
    });

    await request(app)
      .post("/api/wallets")
      .set("Authorization", `Bearer ${t1}`)
      .send({ currencyId });

    const r1 = await request(app)
      .get("/api/wallets")
      .set("Authorization", `Bearer ${t1}`);
    const r2 = await request(app)
      .get("/api/wallets")
      .set("Authorization", `Bearer ${t2}`);

    expect(r1.body.wallets).toHaveLength(1);
    expect(r2.body.wallets).toHaveLength(0);
  });

  it("elimina wallet propia", async () => {
    const { accessToken } = await createUserAndGetToken();

    const create = await request(app)
      .post("/api/wallets")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ currencyId });

    const res = await request(app)
      .delete(`/api/wallets/${create.body.wallet.id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
  });

  it("no permite borrar wallet ajena", async () => {
    const { accessToken: t1 } = await createUserAndGetToken({
      email: "u1@test.com",
    });
    const { accessToken: t2 } = await createUserAndGetToken({
      email: "u2@test.com",
      username: "user2",
    });

    const create = await request(app)
      .post("/api/wallets")
      .set("Authorization", `Bearer ${t1}`)
      .send({ currencyId });

    const res = await request(app)
      .delete(`/api/wallets/${create.body.wallet.id}`)
      .set("Authorization", `Bearer ${t2}`);

    expect(res.status).toBe(403);
  });
});