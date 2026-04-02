import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { log } from "./index";

let io: SocketIOServer;

export function initSocket(httpServer: HttpServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    log(`Socket connected: ${socket.id}`, "socket.io");

    socket.on("join_admin", () => {
      socket.join("admins");
      log(`Socket ${socket.id} joined admins room`, "socket.io");
    });

    socket.on("disconnect", () => {
      log(`Socket disconnected: ${socket.id}`, "socket.io");
    });
  });

  return io;
}

export function getIO(): SocketIOServer {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}

// Emit a new_contact event to all connected admins
export function emitNewContact(contact: {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: Date;
}) {
  if (io) {
    io.to("admins").emit("new_contact", contact);
  }
}
