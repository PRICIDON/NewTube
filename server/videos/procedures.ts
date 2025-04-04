import { createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {videos, videoUpdateSchema} from "@/db/schema";
import {db} from "@/db";
import {mux} from "@/lib/mux";
import {and, eq} from "drizzle-orm";
import {TRPCError} from "@trpc/server";
import { z } from 'zod'
import {UTApi} from "uploadthing/server";
import {workflow} from "@/lib/qstash";

export const videosRouter = createTRPCRouter({
    create: protectedProcedure.mutation(async ({ctx}) => {
        const { id: userId } = ctx.user

        const upload = await mux.video.uploads.create({
            new_asset_settings: {
                passthrough: userId,
                playback_policy: ["public"],
                input: [
                    {
                        generated_subtitles: [
                            {
                                language_code: "en",
                                name: "English",
                            },
                            {
                                language_code: "ru",
                                name: "Русский",
                            }
                        ]
                    }
                ]
            },
            cors_origin: "*"
        })
        // @ts-ignore
        const [video] = await db.insert(videos).values({
            userId,
            title: "Untitled",
            muxStatus: "waiting",
            muxUploadId: upload.id,

        }).returning()

        return {
            video,
            url: upload.url
        }
    }),
    update: protectedProcedure.input(videoUpdateSchema).mutation(async ({ctx, input}) => {
        const { id: userId } = ctx.user

        if(!input.id) {
            throw new TRPCError({ code: "BAD_REQUEST"})
        }
        if(!userId) {
            throw new TRPCError({ code: "BAD_REQUEST"})
        }

        const [updatedVideo] = await db.update(videos).set({
            title: input.title,
            description: input.description,
            categoryId: input.categoryId,
            visibility: input.visibility,
            updatedAt: new Date()
        }).where(and(
            eq(videos.id, input.id),
            eq(videos.userId, userId),
        )).returning();

        if(!updatedVideo) {
            throw new TRPCError({ code: "NOT_FOUND"})
        }
        return updatedVideo
    }),
    remove: protectedProcedure.input(z.object({
        id: z.string().uuid()
    })).mutation(async ({ctx, input}) => {
        const { id: userId } = ctx.user
        const [removedVideo] = await db.delete(videos).where(and(
                eq(videos.id, input.id),
                eq(videos.userId, userId)
        )).returning();
        if(!removedVideo) {
            throw new TRPCError({ code: "NOT_FOUND"})
        }
        return removedVideo
    }),
    restoreThumbnail: protectedProcedure.input(z.object({id: z.string().uuid()})).mutation(async ({ctx, input}) => {
        const { id: userId } = ctx.user
        const [existingVideo] = await db.select().from(videos).where(and(eq(videos.id, input.id),eq(videos.userId, userId)))
        if (!existingVideo) {
            throw new TRPCError({ code: "NOT_FOUND"})
        }
        if(existingVideo.thumbnailKey) {
            const utapi= new UTApi()
            await utapi.deleteFiles(existingVideo.thumbnailKey)
            await db.update(videos).set({
              thumbnailKey: null, thumbnailUrl: null,
            }).where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
        }
        if (!existingVideo.muxPlaybackId) {
            throw new TRPCError({ code: "BAD_REQUEST"})
        }

        const tempThumbnailUrl = `https://image.mux.com/${existingVideo.muxPlaybackId}/thumbnail.png`;
        const utapi = new UTApi()
        const {data} = await utapi.uploadFilesFromUrl(tempThumbnailUrl)
        if (!data) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR"})
        }

        const [updatedVideo] = await db.update(videos).set({
            thumbnailUrl:data.url,
            thumbnailKey: data.key
        }).where(and(eq(videos.id, input.id),eq(videos.userId, userId))).returning();
        return { updatedVideo }
    }),
    generateThumbnail: protectedProcedure.input(z.object({id: z.string().uuid()})).mutation(async ({ ctx, input }) => {
        const { id: userId } = ctx.user
        const { workflowRunId } = await workflow.trigger({
            url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/title`,
            body: { userId, videoId: input.id  },
        })

        return workflowRunId
    })
})
