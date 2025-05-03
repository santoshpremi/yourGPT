// backend/src/server.ts
import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./trpc.js";
import cors from "cors";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from 'uuid';

// 1. Type Declarations First
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
  imageUrl?: string;
  primaryEmail?: string;
  isSuperUserOnly?: boolean;
  acceptedGuidelines?: boolean;
}

const app: Application = express();
const PORT = process.env.PORT || 8003;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 2. Middleware Setup
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8003'],
  credentials: true
}));
app.use(express.json());

// 3. Organization Middleware
app.use(['/api/organizations/:orgId', '/:organizationId'], 
  (req: Request, res: Response, next: NextFunction) => {
    const orgId = req.params.orgId || req.params.organizationId || 'default_org';
    
    if (!organizations.has(orgId)) {
      organizations.set(orgId, createOrganization(orgId));
    }
    
    req.organization = organizations.get(orgId)!;
    next();
  });

// 4. Static Files After Organization Middleware
app.use(express.static(path.join(__dirname, '../../dist')));

// 5. API Endpoints
app.get('/api/academy/gamification/xp', (req: Request, res: Response) => {
  res.json({ xp: 0 });
});

app.post('/api/trial/extend', (req: Request, res: Response) => {
  res.json({ status: 'extended', months: 2 });
});

app.get("/api/organizations/:orgId/users/me", (req: Request, res: Response) => {
  const org = req.organization;
  res.json({
    id: `user_${uuidv4().replace(/-/g, '').slice(0, 24)}`,
    firstName: "John",
    lastName: "Doe",
    email: "john@meingpt.com",
    organizationId: req.params.orgId,
    isOrganizationAdmin: true,
    tourCompleted: false,
    roles: ["USER"],        
    jobDescription: "Developer",
    onboarded: true,
    isSuperUser: false,
    company: "My Company",
    imageUrl: org.avatarUrl,
    primaryEmail: "john@meingpt.com",
    isSuperUserOnly: false,
    acceptedGuidelines: true
  });
});

// 6. TRPC Configuration
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: ({ req }) => ({ organization: req.organization }),
  })
);

// 7. Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

// 8. Error Handling
app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// 9. Frontend Fallback (Must be last!)
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

// Helper Functions
const organizations = new Map<string, Organization>([
  ['default_org', createOrganization('default_org')]
]);

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

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});