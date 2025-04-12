import { serve } from "@upstash/workflow/nextjs";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { TITLE_SYSTEM_PROMPT } from "@/lib/system_prompts";

interface InputType {
  userId: string;
  videoId: string;
}

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as InputType;
  const { videoId, userId } = input;

  const video = await context.run("get-video", async () => {
    const [existingVideo] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

    if (!existingVideo) {
      throw new Error("No video found.");
    }
    return existingVideo;
  });

  const transcript = await context.run("get-transcript", async () => {
    const trackUrl = `https://stream.mux.com/${video.muxPlaybackId}/text/${video.muxTrackId}.txt`;
    const response = await fetch(trackUrl);
    return response.text();
  });

  const yandexResponse = await context.run("generate-title", async () => {
    const response = await fetch(
      "https://llm.api.cloud.yandex.net/foundationModels/v1/completion",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Api-Key ${process.env.YANDEX_API_KEY!}`,
        },
        body: JSON.stringify({
          modelUri: `gpt://${process.env.YANDEX_FOLDER_ID}/yandexgpt/latest`,
          completionOptions: {
            stream: false,
            temperature: 0.7,
            maxTokens: 100,
          },
          messages: [
            {
              role: "system",
              text: TITLE_SYSTEM_PROMPT,
            },
            {
              role: "user",
              text: transcript,
            },
          ],
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`YandexGPT Error: ${JSON.stringify(data)}`);
    }

    return data.choices[0]?.message.text;
  });

  await context.run("update-video", async () => {
    const title = yandexResponse;
    if (!title) throw new Error("Failed to generate title");

    await db
      .update(videos)
      .set({ title: title || video.title })
      .where(and(eq(videos.id, video.id), eq(videos.userId, userId)));
  });
});
