import {
    VideoAssetCreatedWebhookEvent,
    VideoAssetErroredWebhookEvent,
    VideoAssetReadyWebhookEvent, VideoAssetTrackReadyWebhookEvent
} from "@mux/mux-node/resources/webhooks";
import {headers} from "next/headers";
import {mux} from "@/lib/mux";
import {db} from "@/db";
import {videos} from "@/db/schema";
import {eq} from "drizzle-orm";

const SIGNING_SECRET_KEY = process.env.MUX_WEBHOOK_SECRET;

type WebhookEvent = VideoAssetCreatedWebhookEvent | VideoAssetReadyWebhookEvent | VideoAssetErroredWebhookEvent | VideoAssetTrackReadyWebhookEvent

export const POST = async (req: Request) => {
    if (!SIGNING_SECRET_KEY) {
        throw new Error("Missing SIGNING_SECRET_KEY");
    }
    const headersPayload = await headers()
    const muxSignature = headersPayload.get("mux-signature");

    if(!muxSignature) {
        return new Response("No signature found", { status: 401 });
    }

    const payload = await req.json()
    const body = JSON.stringify(payload)

    mux.webhooks.verifySignature(body, {
        "mux-signature": muxSignature
    }, SIGNING_SECRET_KEY);

    switch (payload.type as WebhookEvent["type"]) {
        case "video.asset.created": {
            const data = payload.data as VideoAssetCreatedWebhookEvent["data"];
            if (!data.upload_id) {
                return new Response("No upload ID found", { status: 400 });
            }
            await db.update(videos).set({
                muxAssetId: data.id,
                muxStatus: data.status,
            }).where(eq(videos.muxUploadId, data.upload_id))
            break
        }


    }
    return new Response("Webhook received", { status: 200 });
}
