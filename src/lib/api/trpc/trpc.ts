import type { AppRouter } from "../../../../backend/src/trpc";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();
