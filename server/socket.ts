import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer;

export function initSocket(httpServer: HttpServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("join_admin", () => {
      socket.join("admins");
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
