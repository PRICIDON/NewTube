import {createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {z} from "zod";
import {db} from "@/db";
import {commentReactions} from "@/db/schema";
import {and, eq} from "drizzle-orm";

export const commentReactionsRouter = createTRPCRouter({
    like: protectedProcedure.input(z.object({ commentId: z.string().uuid()})).mutation(async ({ ctx, input}) => {
        const { id: userId } = ctx.user
        const { commentId } = input
        const [existingCommentReactions] = await db
            .select()
            .from(commentReactions)
            .where(and(
                eq(commentReactions.userId, userId),
                eq(commentReactions.commentId, commentId),
                eq(commentReactions.type, "like")
            ))
        if (existingCommentReactions) {
            const [deletedViewerReaction] = await db
                .delete(commentReactions)
                .where(
                    and(
                        eq(commentReactions.userId, userId),
                        eq(commentReactions.commentId, commentId),
                    )
                )
                .returning()
            return deletedViewerReaction
        }
        const [createdCommentReaction] = await db
            .insert(commentReactions)
            .values({ userId, commentId, type: "like" })
            .onConflictDoUpdate({
                target: [commentReactions.userId, commentReactions.commentId],
                set: { type: "like"},
            })
            .returning()
        return createdCommentReaction;
    }),
    dislike: protectedProcedure.input(z.object({ commentId: z.string().uuid()})).mutation(async ({ ctx, input}) => {
        const { id: userId } = ctx.user
        const { commentId } = input
        const [existingCommentReactions] = await db
            .select()
            .from(commentReactions)
            .where(and(
                eq(commentReactions.userId, userId),
                eq(commentReactions.commentId, commentId),
                eq(commentReactions.type, "dislike")
            ))
        if (existingCommentReactions) {
            const [deletedViewerReaction] = await db
                .delete(commentReactions)
                .where(
                    and(
                        eq(commentReactions.userId, userId),
                        eq(commentReactions.commentId, commentId),
                    )
                )
                .returning()
            return deletedViewerReaction
        }
        const [createdCommentReaction] = await db
            .insert(commentReactions)
            .values({ userId, commentId, type: "dislike" })
            .onConflictDoUpdate({
                target: [commentReactions.userId, commentReactions.commentId],
                set: { type: "dislike"},
            })
            .returning()
        return createdCommentReaction;
    })
})
