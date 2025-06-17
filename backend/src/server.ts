// backend/src/server.ts
import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./trpc.js";
import cors from "cors";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from 'uuid';

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
} ;

// Remove this declaration
// declare module 'express-serve-static-core' {
//   interface Request {
//     organization: Organization;
//   }
// }

const app: Application = express();
const PORT = process.env.PORT || 8003;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 2. Middleware Setup
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8003'],
  credentials: true
}));
app.use(express.json());

// Custom Request interface
interface CustomRequest extends Request {
  organization: Organization;
}

// Type guard function
function isCustomRequest(req: Request): req is CustomRequest {
  return 'organization' in req;
}

// 3. Organization Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const orgId = req.headers['x-yourgpt-organization-id'] as string;
  (req as any).organization = createOrganization(orgId || 'default_org');
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
  const customReq = req as CustomRequest;
  const org = customReq.organization;
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

// Add PATCH endpoint for tour completion
app.patch("/api/organizations/:orgId/users/me", (req: Request, res: Response) => {
  const customReq = req as CustomRequest;
  const org = customReq.organization;
  const { tourCompleted } = req.body;
  
  res.json({
    id: `user_${uuidv4().replace(/-/g, '').slice(0, 24)}`,
    firstName: "John",
    lastName: "Doe",
    email: "john@meingpt.com",
    organizationId: req.params.orgId,
    isOrganizationAdmin: true,
    tourCompleted: tourCompleted || false,
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

// Add analytics endpoint
app.post('/api/analytics/event', (req: Request, res: Response) => {
  const eventData = req.body;
  
  // Log the analytics event (in production, you'd send this to your analytics service)
  console.log('Analytics Event:', {
    event: eventData.n,
    url: eventData.u,
    domain: eventData.d,
    props: eventData.p,
    timestamp: new Date().toISOString()
  });
  
  // Respond with success
  res.status(200).json({ status: 'ok' });
});

// 6. TRPC Configuration
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: ({ req }: { req: Request }) => ({ 
      organization: (req as any).organization
    }),
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