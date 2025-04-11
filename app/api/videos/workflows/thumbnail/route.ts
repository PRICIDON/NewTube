import { serve } from "@upstash/workflow/nextjs"
import {db} from "@/db";
import {videos} from "@/db/schema";
import {and, eq} from "drizzle-orm";
import {DESCRIPTION_SYSTEM_PROMPT} from "@/lib/system_prompts";
import {UTApi} from "uploadthing/server";

interface InputType {
    userId: string
    videoId: string
    prompt: string
}

export const { POST } = serve(
  async (context) => {
      const utapi = new UTApi()
      const input = context.requestPayload as InputType
      const {videoId, userId, prompt} = input
      const video = await context.run("get-video", async () => {
            const [existingVideo] = await db.select().from(videos).where(and(
                eq(videos.id, videoId),
                eq(videos.userId, userId),
            ))

            if (!existingVideo) {
                throw new Error("No video found.")
            }
            return existingVideo
      })


      const { body } =  await context.call<{data: { url: string}[]}>("generate-thumbnail", {
          url: "https://llm.api.cloud.yandex.net/foundationModels/v1/completion",
          method: "POST",
          body: {
              prompt,
              n: 1,
              modal: "dall-e-3",
              size: "1792x1024"
          },
          headers: {
              authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          }
      });

      const tempThumbnailUrl = body.data[0].url;

      await context.run("cleanup-thumbnail", async () => {
          if(video.thumbnailKey) {
              await utapi.deleteFiles(video.thumbnailKey);
          }
          await db.update(videos).set({
              thumbnailKey: null, thumbnailUrl: null
          }).where(and(
                eq(videos.id, videoId),
                eq(videos.userId, userId),
            ))
      })

      const uploadedThumbnail = await context.run("upload-thumbnail",async () => {
          const { data } = await utapi.uploadFilesFromUrl(tempThumbnailUrl);
          return data
      })


      await context.run("update-video", async () => {
          await db.update(videos).set({
              thumbnailUrl: uploadedThumbnail?.url,
              thumbnailKey: uploadedThumbnail?.key
          }).where(and(
              eq(videos.id, video.id),
              eq(videos.userId, userId),
          ))
      })
  },

)
