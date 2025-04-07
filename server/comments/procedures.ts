import {baseProcedure, createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {z} from "zod";
import {db} from "@/db";
import {commentInsertSchema, comments, users, videoViews} from "@/db/schema";
import {and, eq, getTableColumns} from "drizzle-orm";

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
    getMany: baseProcedure.input(z.object({
        videoId: z.string().uuid(),
    })).query(async ({ input }) => {
        const { videoId } = input
        return db.select({
            ...getTableColumns(comments),
            user: users
        }).from(comments).innerJoin(users, eq(comments.userId, users.id)).where(eq(comments.videoId, videoId))
    })
})
