import { Organization } from "../util/credits/phaseUsage";

declare global {
  namespace Express {
    interface Request {
      organization: Organization;
    }
  }
}