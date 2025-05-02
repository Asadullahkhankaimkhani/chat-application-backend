import express from "express";
import http from "http";
import { Server } from "socket.io";
import authRoutes from "./auth/routes";
import dotenv from "dotenv";
import connectDB from "./services/db";

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();
const server = http.createServer(app);

// Create Socket.IO instance
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(express.json());

// Routes
app.use("/auth", authRoutes);

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("✅ New client connected");

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected");
  });
});

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
