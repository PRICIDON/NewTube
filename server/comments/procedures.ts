import {baseProcedure, createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {z} from "zod";
import {db} from "@/db";
import {commentReactions, comments, users, videoReactions, videos} from "@/db/schema";
import {and, count, desc, eq, getTableColumns, inArray, lt, or} from "drizzle-orm";
import {TRPCError} from "@trpc/server";

export const commentsRouter = createTRPCRouter({
    create: protectedProcedure.input(z.object({videoId: z.string().uuid(), value: z.string()})).mutation(async ({ ctx, input}) => {
        const { id: userId } = ctx.user
        const { videoId, value } = input

        const [createdComment] = await db
            .insert(comments)
            .values({ userId, videoId, value })
            .returning()
        return createdComment;
    }),
    remove: protectedProcedure.input(z.object({id: z.string().uuid()})).mutation(async ({ ctx, input}) => {
        const { id: userId } = ctx.user
        const { id } = input

        const [deleteddComment] = await db
            .delete(comments)
            .where(and(eq(comments.userId, userId), eq(comments.id, id)))
            .returning()
        if (!deleteddComment) {
            throw new TRPCError({ code: "NOT_FOUND" })
        }
        return deleteddComment;
    }),
    getMany: baseProcedure.input(z.object({
        videoId: z.string().uuid(),
        cursor: z.object({
            id: z.string().uuid(),
            updatedAt: z.date()
        }).nullish(),
        limit: z.number().min(1).max(100)
    })).query(async ({ input, ctx }) => {
        const { videoId, cursor, limit } = input
        const { clerkUserId } = ctx
        const [user] = await db.select().from(users).where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []))
        let userId
        if (user) {
            userId = user.id
        }
        const viewerReactions = db.$with("viewer_reactions").as(
            db.select({
                commentId: commentReactions.commentId,
                type: commentReactions.type,
            }).from(commentReactions).where(inArray(commentReactions.userId, userId ? [userId] : []))
        )
        const [data, totalData] = await Promise.all([
            db.with(viewerReactions).select({
                ...getTableColumns(comments),
                user: users,
                // totalCount: db.$count(comments, eq(comments.videoId, videoId)),
                likeCount: db.$count(commentReactions, and(eq(commentReactions.commentId, comments.id), eq(commentReactions.type, "like"))),
                dislikeCount: db.$count(commentReactions, and(eq(commentReactions.commentId, comments.id), eq(commentReactions.type, "dislike"))),
                viewerReactions: viewerReactions.type,
            })
            .from(comments)
            .innerJoin(users, eq(comments.userId, users.id))
            .leftJoin(viewerReactions, eq(viewerReactions.commentId, comments.id))
            .where(and(
                eq(comments.videoId, videoId),
                cursor ? or(
                        lt(comments.updatedAt, cursor.updatedAt),
                        and(
                            eq(comments.updatedAt, cursor.updatedAt),
                            lt(comments.id, cursor.id)
                        )
                    ) : undefined)
            )
            .orderBy(desc(comments.updatedAt), desc(comments.id))
            .limit(limit + 1),
            db
            .select({
                count: count()
            })
            .from(comments)
            .where(eq(comments.videoId, videoId))
        ])
        const hasMore = data.length > limit
        const items = hasMore ? data.slice(0, -1) : data
        const lastItem = items[items.length - 1]
        const nextCursor = hasMore ? { id: lastItem.id, updatedAt: lastItem.updatedAt } : null

        return {
            totalCount: totalData[0].count,
            items,
            nextCursor,
        }
    })
})
