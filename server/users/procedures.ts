import {baseProcedure, createTRPCRouter} from '@/trpc/init'
import {subscriptions, users, videos} from '@/db/schema'
import {db} from '@/db'
import {eq, getTableColumns, inArray, isNotNull} from 'drizzle-orm'
import {TRPCError} from '@trpc/server'
import {z} from 'zod'

export const usersRouter = createTRPCRouter({
    getOne: baseProcedure.input(z.object({id: z.string().uuid()})).query(async ({ input, ctx }) => {
        const { clerkUserId } = ctx
        const [user] = await db.select().from(users).where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []))
        let userId
        if (user) {
            userId = user.id
        }
        const viewerSubscriptions = db.$with("viewer_subscriptions").as(
            db.select({
                viewerId: subscriptions.viewerId,
                creatorId: subscriptions.creatorId,
            }).from(subscriptions).where(inArray(subscriptions.viewerId, userId ? [userId] : []))
        )
        const [existingUser] = await db
            .with(viewerSubscriptions)
            .select({
                ...getTableColumns(users),
	            viewerSubscribed: isNotNull(viewerSubscriptions.viewerId).mapWith(Boolean),
	            videoCount: db.$count(videos, eq(videos.userId, users.id)),
	            subscriberCount: db.$count(subscriptions, eq(subscriptions.creatorId, users.id)),
	            
            })
            .from(users)
            .leftJoin(viewerSubscriptions, eq(viewerSubscriptions.creatorId, users.id))
            .where(eq(users.id, input.id))
            .limit(1)
        if (!existingUser) throw new TRPCError({ code: "NOT_FOUND"})
        return existingUser
    }),
})
