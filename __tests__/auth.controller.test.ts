import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import request from "supertest";
import express from "express";
import authRoutes from "../src/auth/routes";
import User from "../src/auth/user.model";

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

beforeAll(async () => {
  await mongoose.connect(process.env.DB_HOST as string);
});

afterAll(async () => {
  if (!mongoose.connection.db) throw new Error("No DB connection available");
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

afterEach(async () => {
  await User.deleteMany({}); // Clean up users between tests
});

describe("Auth Routes", () => {
  const testUser = { username: "testuser", password: "testpass" };

  it("should register a new user", async () => {
    const res = await request(app).post("/auth/register").send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
  });

  it("should not register an existing user", async () => {
    await request(app).post("/auth/register").send(testUser); // register once
    const res = await request(app).post("/auth/register").send(testUser); // try again
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Username already taken");
  });

  it("should log in an existing user", async () => {
    await request(app).post("/auth/register").send(testUser);
    const res = await request(app).post("/auth/login").send(testUser);
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("should fail login with wrong password", async () => {
    await request(app).post("/auth/register").send(testUser);
    const res = await request(app).post("/auth/login").send({
      username: "testuser",
      password: "wrongpass",
    });
    expect(res.statusCode).toBe(401);
  });
});
