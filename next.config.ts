import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib//i18n/request.ts");

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

export default withNextIntl(nextConfig);
