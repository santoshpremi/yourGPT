// src/lib/api/trpc/trpc.ts
import type { AppRouter } from "../../../../backend/src/trpc";
// use this later import type { AppRouter } from "../../../../backend/src/api/appRouter";

import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();
