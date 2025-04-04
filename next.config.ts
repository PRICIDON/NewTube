import type { NextConfig } from "next";
import { RemotePattern } from "next/dist/shared/lib/image-config";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "image.mux.com"
            },
            {
                protocol: "https",
                hostname: "utfs.io",
            }
        ]
    }
};

export default nextConfig;
