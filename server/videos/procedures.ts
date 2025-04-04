import { createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {videos} from "@/db/schema";
import {db} from "@/db";
import {mux} from "@/lib/mux";

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
    })
})
