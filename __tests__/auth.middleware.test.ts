import { authenticateToken } from "../src/auth/middleware";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

describe("JWT Middleware", () => {
  it("should call next() if token is valid", () => {
    const token = jwt.sign(
      { username: "testuser" },
      process.env.JWT_SECRET as string
    );
    const req = {
      headers: { authorization: `Bearer ${token}` },
    } as Request;

    const res = {} as Response;
    const next = jest.fn();

    authenticateToken(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("should send 401 if no token provided", () => {
    const req = {
      headers: {},
    } as Request;

    const res = { sendStatus: jest.fn() } as unknown as Response;
    const next = jest.fn();

    authenticateToken(req, res, next);
    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });
});
