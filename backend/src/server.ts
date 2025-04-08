import express, { Application, Request, Response } from 'express';
import path from 'path';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './trpc'; // Fixed path
import cors from 'cors';
import { z } from "zod";
import { sentryRouter } from '../../api/tunnel/sentry/config';

const app: Application = express();
app.use(express.json());


const PORT = process.env.PORT || 8003;

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Add proper Sentry config endpoint
app.get('/api/tunnel/sentry/config', (req, res) => {
  res.json({
    dsn: 'mock-sentry-dsn', // Hardcode for development
    serverName: 'development'
  });
});

// Change static file serving to:
app.use(express.static(path.join(__dirname, '../../../../dist')));

const mockUser = {
  id: 'user_123',
  name: 'John Doe',
  email: 'john@meingpt.com',
  organizationId: 'default_org', // Add this
  // Add other required fields from your Zod schema
  logoUrl: '',
  avatarUrl: '',
  customPrimaryColor: '#4F46E5',
  defaultModel: 'gpt-4',
  tenantId: 'tenant_123',
  defaultWorkshopId: 'workshop_123'
};

// Middleware
app.use(cors({ 
  origin: 'http://localhost:3000',
  credentials: true
}));

// Routes
app.use('/api/tunnel/sentry', sentryRouter);

app.get('/api/users/me', (req: Request, res: Response) => {
  res.json({
    id: 'user_123',
    name: 'Test User',
    email: 'test@meingpt.com',
    organizationId: 'default_org',
    // Add other required fields
  });
});

// Add organization users endpoint
app.get('/api/organizations/:orgId/users/me', (req, res) => {
  res.json({
    id: 'user_123',
    name: 'Test User',
    email: 'test@meingpt.com',
    organizationId: req.params.orgId,
    // Add other required user fields
    logoUrl: '',
    avatarUrl: '',
    customPrimaryColor: '#4F46E5'
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


app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext: () => ({
      // Mock context
      organization: {
        id: 'default_org',
        name: 'Default Org'
      }
    }),
  })
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});