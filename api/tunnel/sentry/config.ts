import { WebSocketServer, WebSocket } from 'ws'; // Add WebSocket type
import { createServer, IncomingMessage } from 'http';
import { Socket } from 'net';
import { Router, Request, Response } from 'express';

// WebSocket Server for Sentry Tunnel
const server = createServer();
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (message: Buffer) => {
    console.log('Sentry tunnel message:', message.toString());
    // Add Sentry-specific handling here
  });
});

server.on('upgrade', (request: IncomingMessage, socket: Socket, head: Buffer) => {
  if (request.url === '/api/tunnel/sentry/config') {
    wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
      wss.emit('connection', ws, request);
    });
  }
});

const TUNNEL_PORT = 8003;

export const sentryRouter = Router();
sentryRouter.get('/config', (req: Request, res: Response) => {
  res.json({
    dsn: process.env.VITE_SENTRY_DSN,
    serverName: process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
  });
});