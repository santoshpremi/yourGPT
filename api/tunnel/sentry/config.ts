// api/tunnel/sentry/config.ts
import { WebSocketServer, WebSocket } from "ws";
import express, { Express, Request, Response, Router } from "express";
import { createServer } from "http";
import cors from "cors";
import "dotenv/config";

const TUNNEL_PORT = 8003;

// 1. Create Express app
const app: Express = express();

// 2. Configure middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET"],
  }),
);

// 3. Create HTTP server with Express app
const httpServer = createServer(app);
const wsServer = new WebSocketServer({ noServer: true });

// 4. Create and configure router
export const sentryRouter = Router();

sentryRouter.get("/config", (req: Request, res: Response) => {
  try {
    const dsn = process.env.VITE_SENTRY_DSN;

    if (!dsn) {
      return res.status(500).json({ error: "Sentry DSN not configured" });
    }

    res.json({
      dsn: dsn,
      serverName: process.env.NODE_ENV || "development",
    });
  } catch (error) {
    console.error("Config endpoint error:", error);
    res.status(500).json({ error: "Configuration failed" });
  }
});

// 5. Mount router to Express app
app.use("/api/tunnel/sentry", sentryRouter);

// 6. WebSocket handling
wsServer.on("connection", (ws: WebSocket) => {
  ws.on("message", (message: Buffer) => {
    console.log("Sentry tunnel message:", message.toString());
  });
});

// 7. Handle WebSocket upgrades
httpServer.on("upgrade", (request, socket, head) => {
  if (request.url === "/api/tunnel/sentry/ws") {
    wsServer.handleUpgrade(request, socket, head, (ws) => {
      wsServer.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

// 8. Start server
httpServer.listen(TUNNEL_PORT, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${TUNNEL_PORT}`);
});
