import {
    VideoAssetCreatedWebhookEvent, VideoAssetDeletedWebhookEvent,
    VideoAssetErroredWebhookEvent,
    VideoAssetReadyWebhookEvent, VideoAssetTrackReadyWebhookEvent
} from "@mux/mux-node/resources/webhooks";
import {headers} from "next/headers";
import {mux} from "@/lib/mux";
import {db} from "@/db";
import {videos} from "@/db/schema";
import {eq} from "drizzle-orm";
import {UTApi} from "uploadthing/server";

const SIGNING_SECRET_KEY = process.env.MUX_WEBHOOK_SECRET;

type WebhookEvent = VideoAssetCreatedWebhookEvent | VideoAssetReadyWebhookEvent | VideoAssetErroredWebhookEvent | VideoAssetTrackReadyWebhookEvent | VideoAssetDeletedWebhookEvent

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

    mux.webhooks.verifySignature(body, headersPayload, SIGNING_SECRET_KEY);

    switch (payload.type as WebhookEvent["type"]) {
        case "video.asset.created": {
            const data = payload.data as VideoAssetCreatedWebhookEvent["data"];
            if (!data.upload_id) {
                return new Response("No upload ID found", { status: 400 });
            }
            console.log(data.upload_id);
            await db.update(videos).set({
                muxAssetId: data.id,
                muxStatus: data.status,
            }).where(eq(videos.muxUploadId, data.upload_id))
            break
        }
        case "video.asset.ready": {
            const data = payload.data as VideoAssetReadyWebhookEvent["data"];
            const playbackId = data.playback_ids?.[0].id
            if (!data.upload_id) {
                return new Response("No upload ID found", { status: 400 });
            }
            if(!playbackId) {
                return new Response("No playback ID found", { status: 400 });
            }
            const tempThumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.png`;
            const tempPreviewUrl = `https://image.mux.com/${playbackId}/animated.gif`;
            const duration = data.duration ? Math.round(data.duration * 1000) : 0;

            const utapi = new UTApi()
            const [uploadedThumbnail, uploadedPreview] = await utapi.uploadFilesFromUrl([
                tempThumbnailUrl,
                tempPreviewUrl,
            ])

            if (!uploadedPreview.data || !uploadedThumbnail.data) {
                return new Response("Failed to upload thumbnail or preview", { status: 500 });
            }

            const { key: thumbnailKey, url: thumbnailUrl } = uploadedThumbnail.data;
            const { key:previewKey, url: previewUrl } = uploadedPreview.data;


            await db.update(videos).set({
                muxStatus: data.status,
                muxPlaybackId: playbackId,
                thumbnailUrl,
                thumbnailKey,
                previewUrl,
                previewKey,
                duration,


            }).where(eq(videos.muxUploadId, data.upload_id))
            break
        }
        case "video.asset.errored": {
            const data = payload.data as VideoAssetErroredWebhookEvent["data"];

            if (!data.upload_id) {
                return new Response("No upload ID found", { status: 400 });
            }

            await db.update(videos).set({
                muxStatus: data.status,
            }).where(eq(videos.muxUploadId, data.upload_id))

            break
        }
        case "video.asset.deleted": {
            const data = payload.data as VideoAssetDeletedWebhookEvent["data"];

            if (!data.upload_id) {
                return new Response("No upload ID found", { status: 400 });
            }

            console.log("Deleting video:", data.upload_id);

            await db.delete(videos).where(eq(videos.muxUploadId, data.upload_id))

            break
        }
        case "video.asset.track.ready": {
            const data = payload.data as VideoAssetTrackReadyWebhookEvent["data"] & {
                asset_id: string;
            };

            const assetId = data.asset_id
            const trackId = data.id
            const status = data.status;

            if (!assetId) {
                return new Response("No asset ID found", { status: 400 });
            }

            await db.update(videos).set({
                muxTrackId: trackId,
                muxTrackStatus: status,
            }).where(eq(videos.muxAssetId, assetId))
            break
        }
    }
    return new Response("Webhook received", { status: 200 });
}
