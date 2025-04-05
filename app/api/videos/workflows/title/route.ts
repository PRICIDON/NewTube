import { serve } from "@upstash/workflow/nextjs"
import {db} from "@/db";
import {videos} from "@/db/schema";
import {and, eq} from "drizzle-orm";

interface InputType {
    userId: string
    videoId: string
}

export const { POST } = serve(
  async (context) => {
      const input = context.requestPayload as InputType
      const {videoId, userId} = input
      const existingVideo = await context.run("get-video", async () => {
            const data = await db.select().from(videos).where(and(
                eq(videos.id, videoId),
                eq(videos.userId, userId),
            ))

            if (!data[0]) {
                throw new Error("No video found.")
            }
            return data[0]
      })
      console.log(existingVideo)
      await context.run("initial-step", () => {
          console.log("initial step ran")
      })

      await context.run("second-step", () => {
          console.log("second step ran")
      })
  },

)
