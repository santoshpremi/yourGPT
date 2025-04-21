// backend/src/api/workflow/workflowTypes.ts
import { z } from "zod";

export const Workflow = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  index: z.number(),
  departmentId: z.string(),
  templateId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // Add other workflow properties as needed
});

export type Workflow = z.infer<typeof Workflow>;

export const WorkflowCreateInput = Workflow.omit({ 
  id: true,
  createdAt: true,
  updatedAt: true 
});

export const WorkflowUpdateInput = Workflow.partial();

export const WorkflowGetAllInput = z.object({
  departmentId: z.string()
});