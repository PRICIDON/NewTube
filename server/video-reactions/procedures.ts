import {createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {z} from "zod";
import {db} from "@/db";
import {videoReactions} from "@/db/schema";
import {and, eq} from "drizzle-orm";

export const videoReactionsRouter = createTRPCRouter({
    like: protectedProcedure.input(z.object({ videoId: z.string().uuid()})).mutation(async ({ ctx, input}) => {
        const { id: userId } = ctx.user
        const { videoId } = input
        const [existingVideoReactions] = await db
            .select()
            .from(videoReactions)
            .where(and(
                eq(videoReactions.userId, userId),
                eq(videoReactions.videoId, videoId),
                eq(videoReactions.type, "like")
            ))
        if (existingVideoReactions) {
            const [deletedViewerReaction] = await db
                .delete(videoReactions)
                .where(
                    and(
                        eq(videoReactions.userId, userId),
                        eq(videoReactions.videoId, videoId),
                    )
                )
                .returning()
            return deletedViewerReaction
        };
        const [createdVideoReaction] = await db
            .insert(videoReactions)
            .values({ userId, videoId, type: "like" })
            .onConflictDoUpdate({
                target: [videoReactions.userId, videoReactions.videoId],
                set: { type: "like"},
            })
            .returning()
        return createdVideoReaction;
    }),
    dislike: protectedProcedure.input(z.object({ videoId: z.string().uuid()})).mutation(async ({ ctx, input}) => {
        const { id: userId } = ctx.user
        const { videoId } = input
        const [existingVideoReactions] = await db
            .select()
            .from(videoReactions)
            .where(and(
                eq(videoReactions.userId, userId),
                eq(videoReactions.videoId, videoId),
                eq(videoReactions.type, "dislike")
            ))
        if (existingVideoReactions) {
            const [deletedViewerReaction] = await db
                .delete(videoReactions)
                .where(
                    and(
                        eq(videoReactions.userId, userId),
                        eq(videoReactions.videoId, videoId),
                    )
                )
                .returning()
            return deletedViewerReaction
        };
        const [createdVideoReaction] = await db
            .insert(videoReactions)
            .values({ userId, videoId, type: "dislike" })
            .onConflictDoUpdate({
                target: [videoReactions.userId, videoReactions.videoId],
                set: { type: "dislike"},
            })
            .returning()
        return createdVideoReaction;
    })
})
