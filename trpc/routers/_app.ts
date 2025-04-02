import {  createTRPCRouter } from '../init';
import {categoriesRouter} from "@/server/categories/procedures";
import {studioRouter} from "@/server/studio/procedures";
export const appRouter = createTRPCRouter({
    categories: categoriesRouter,
    studio: studioRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
