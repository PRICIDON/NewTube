import { z } from 'zod';
import { protectedProcedure, createTRPCRouter } from '../init';
import {categoriesRouter} from "@/components/categories/server/procedures";
export const appRouter = createTRPCRouter({
    categories: categoriesRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
