import { serve } from "@upstash/workflow/nextjs"
import {db} from "@/db";
import {videos} from "@/db/schema";
import {and, eq} from "drizzle-orm";
import {DESCRIPTION_SYSTEM_PROMPT} from "@/lib/system_prompts";

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

      const transcript = await context.run("get-transcript", async () => {
          const trackUrl = `https://stream.mux.com/${video.muxPlaybackId}/text/${video.muxTrackId}.txt`
          const response = await fetch(trackUrl)
          return response.text()
      })

      const generatedDescription =  await context.api.openai.call(
          "Call OpenAI",
          {
            token: process.env.OPENAI_API_KEY!,
            operation: "chat.completions.create",
            body: {
              model: "gpt-4o",
              messages: [
                {
                  role: "system",
                  content: DESCRIPTION_SYSTEM_PROMPT,
                },
                {
                  role: "user",
                  content: transcript
                }
              ],
            },
          }
        );

      await context.run("update-video", async () => {
        const description = generatedDescription.body.choices[0]?.message.content;
        if(!description) throw new Error("Bad request");

          await db.update(videos).set({
              description: description || video.description
          }).where(and(
              eq(videos.id, video.id),
              eq(videos.userId, userId),
          ))
      })
  },

)
