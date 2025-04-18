// backend/src/server.ts
import express, { Application, Request, Response } from "express";
import path from "path";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./trpc.js";
import cors from "cors";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from 'uuid';

// Type declarations
declare global {
  namespace Express {
    interface Request {
      organization: Organization;
    }
  }
}

interface Organization {
  id: string;
  name: string;
  domain: string[];
  logoUrl: string;
  avatarUrl: string;
  tenantId: string;
  defaultWorkshopId: string;
  customPrimaryColor: string;
  defaultModel: string;
  isAcademyOnly: boolean;
}

const app: Application = express();
const PORT = process.env.PORT || 8003;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware setup
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8003'],
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../dist')));

// Mock database with Zod-compatible data
const organizations = new Map<string, Organization>([
  ['default_org', createOrganization('default_org')]
]);

app.use((req, res, next) => {
  res.header('Content-Type', 'application/json');
  next();
});

app.get('/api/academy/gamification/xp', (req, res) => {
  res.json({ xp: 0 }); // Direct JSON response
});

app.post('/api/trial/extend', (req, res) => {
  // Add your trial extension logic here
  res.json({ status: 'extended', months: 2 });
});

// Organization middleware
app.use(['/api/organizations/:orgId', '/:organizationId'], 
  (req, res, next) => {
    const orgId = req.params.orgId || req.params.organizationId || 'default_org';
    
    if (!organizations.has(orgId)) {
      organizations.set(orgId, createOrganization(orgId));
    }
    
    const organization = organizations.get(orgId);
    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }
    
    req.organization = organization;
    next();
  }
);

// Helper function to create organizations
function createOrganization(orgId: string): Organization {
  return {
    id: `org_${uuidv4().replace(/-/g, '').slice(0, 24)}`,
    name: `Organization ${orgId}`,
    domain: ['localhost'],
    logoUrl: '/logo.png',
    avatarUrl: '/avatar.png',
    tenantId: uuidv4(),
    defaultWorkshopId: uuidv4(),
    customPrimaryColor: '#4F46E5',
    defaultModel: 'gpt-4',
    isAcademyOnly: false
  };
}

// API Endpoints
// backend/src/server.ts
app.get("/api/organizations/:orgId/users/me", (req, res) => {
  const org = req.organization;
  
  // Return proper JSON structure
  res.json({
    id: "user_123",
    firstName: "John",
    lastName: "Doe",
    email: "john@meingpt.com",
    organizationId: req.params.orgId,
    logoUrl: org.logoUrl,
    avatarUrl: org.avatarUrl,
    tenantId: org.tenantId,
    defaultWorkshopId: org.defaultWorkshopId,
    customPrimaryColor: org.customPrimaryColor,
    defaultModel: org.defaultModel,
    isOrganizationAdmin: true,
    tourCompleted: false,
    roles: ["USER"],
    jobDescription: "Developer",
    onboarded: true,
    isSuperUser: false,
    company: "My Company",
    // Add Zod-required fields
    imageUrl: org.avatarUrl,
    primaryEmail: "john@meingpt.com",
    isSuperUserOnly: false,
    acceptedGuidelines: true
  });
});

// tRPC configuration
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: ({ req }) => ({ organization: req.organization }),
  })
);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});



// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Handle API 404s properly
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// Frontend fallback should come LAST
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});