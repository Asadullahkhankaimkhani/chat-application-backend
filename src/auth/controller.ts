import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface User {
  username: string;
  password: string;
}

const users: User[] = []; // In-memory storage for prototype

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.status(201).json({ message: "User registered successfully" });
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user) {
    res.status(400).json({ message: "User not found" });
    return;
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    res.status(401).json({ message: "Invalid password" });
    return;
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
  res.json({ token });
};
