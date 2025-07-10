import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import type { Request, Response } from 'express';

export interface Context {
  req: Request;
  res: Response;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const createContext = ({ req, res }: CreateExpressContextOptions): Context => {
  // Mock user for demo purposes
  const user = {
    id: 'user1',
    email: 'demo@deingpt.com',
    name: 'Demo User',
  };

  return {
    req,
    res,
    user,
  };
}; 