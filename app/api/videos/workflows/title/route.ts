import { serve } from "@upstash/workflow/nextjs"
import {db} from "@/db";
import {videos} from "@/db/schema";
import {and, eq} from "drizzle-orm";
import {TITLE_SYSTEM_PROMPT} from "@/lib/system_prompts";

interface InputType {
    userId: string
    videoId: string
}

export const { POST } = serve(
  async (context) => {
      const input = context.requestPayload as InputType
      const {videoId, userId} = input
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

      const generatedTitle =  await context.api.openai.call(
          "Call OpenAI",
          {
            token: process.env.OPENAI_API_KEY!,
            operation: "chat.completions.create",
            body: {
              model: "gpt-4o",
              messages: [
                {
                  role: "system",
                  content: TITLE_SYSTEM_PROMPT,
                },
                {
                  role: "user",
                  content: "Hi everyone? in this tutorial we will be building a youtube clone"
                }
              ],
            },
          }
        );

        // get text:
        const title = generatedTitle.body.choices[0]?.message.content

      await context.run("update-video", async () => {
          await db.update(videos).set({
              title: title || video.title
          }).where(and(
              eq(videos.id, video.id),
              eq(videos.userId, userId),
          ))
      })
  },

)
