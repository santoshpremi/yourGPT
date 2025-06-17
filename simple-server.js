// Minimal backend server to get started
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 8003;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8003'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0', message: 'YourGPT Backend is running!' });
});

// Mock user endpoint
app.get('/api/organizations/:orgId/users/me', (req, res) => {
  res.json({
    id: 'user-123',
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@deingpt.com',
    organizationId: req.params.orgId,
    isOrganizationAdmin: true,
    tourCompleted: false,
    roles: ['USER'],
    jobDescription: 'Developer',
    onboarded: true,
    isSuperUser: false,
    company: 'DeinGPT',
    imageUrl: null,
    primaryEmail: 'demo@deingpt.com',
    isSuperUserOnly: false,
    acceptedGuidelines: true
  });
});

// Mock organization endpoint  
app.get('/api/organizations/:orgId', (req, res) => {
  res.json({
    id: req.params.orgId,
    name: 'Demo Organization',
    domain: ['deingpt.com'],
    isAcademyOnly: false,
    customPrimaryColor: '#4F46E5',
    defaultModel: 'gpt-4',
    tenantId: 'demo-tenant',
    defaultWorkshopId: 'demo-workshop',
    logoUrl: '/logo.png',
    avatarUrl: '/avatar.png',
    customTitle: 'YourGPT Demo',
    banners: [],
    phase: 'TRIAL',
    phaseStatus: 'ok'
  });
});

// Basic TRPC endpoint (simplified)
app.post('/api/trpc/:path*', (req, res) => {
  // For now, return empty response for TRPC calls
  res.json({ result: { data: null } });
});

app.get('/api/trpc/:path*', (req, res) => {
  // For now, return empty response for TRPC calls  
  res.json({ result: { data: null } });
});

// Serve static files
app.use(express.static(path.join(__dirname, '../../dist')));

// Fallback for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 YourGPT Backend Server running on http://localhost:${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Frontend: http://localhost:5173 (when Vite is running)`);
});

export default app;
