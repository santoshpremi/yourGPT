import express, { Application, Request, Response } from 'express';
import path from 'path';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './trpc'; // Fixed path
import cors from 'cors';
import { z } from "zod";
import { sentryRouter } from '../../api/tunnel/sentry/config';

const app: Application = express();
const PORT = process.env.PORT || 8003;

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Change static file serving to:
app.use(express.static(path.join(__dirname, '../../../../dist')));

// Mock data setup
const mockUser = {
  id: 'user_123',
  name: 'John Doe',
  email: 'john@deingpt.com',
  organizationId: 'default_org' // 🔧 Added organizationId
};

// Middleware
app.use(cors({ 
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/tunnel/sentry', sentryRouter);

// Unified API endpoints 🔧
app.get('/api/users/me', (req: Request, res: Response) => {
  res.json(mockUser);
});

app.get('/api/organizations/:orgId/users/me', (req: Request, res: Response) => {
  res.json({
    ...mockUser,
    organizationId: req.params.orgId || 'default-org' // Ensure ID exists
  });
});

// tRPC setup
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
  })
);

// Health check endpoint 🔧
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    version: '1.0.0',
    services: ['auth', 'mock-database']
  });
});

// Frontend fallback 🔧
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});