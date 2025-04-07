import {  createTRPCRouter } from '../init';

import {categoriesRouter} from "@/server/categories/procedures";
import {studioRouter} from "@/server/studio/procedures";
import {videosRouter} from "@/server/videos/procedures";
import {videoViewsRouter} from "@/server/video-views/procedures";
import {videoReactionsRouter} from "@/server/video-reactions/procedures";
import {subscriptionsRouter} from "@/server/subscriptions/procedures";

export const appRouter = createTRPCRouter({
    categories: categoriesRouter,
    studio: studioRouter,
    videos: videosRouter,
    videoViews: videoViewsRouter,
    videoReactions: videoReactionsRouter,
    subscriptions: subscriptionsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
