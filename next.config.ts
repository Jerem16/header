import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {},

    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        // ignoreBuildErrors: true,
    },

    images: {
        // augmente la mise en cache par défaut du loader next/image
        minimumCacheTTL: 60 * 60 * 24 * 365, // 365 jours
    },

    async headers() {
        return [
            // Fichiers JS/CSS/JSON générés par Next (hashés)
            //   {
            //     source: "/_next/static/:path*",
            //     headers: [
            //       { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
            //     ],
            //   },

            // CSS “manuellement” dans /css
            //   {
            //     source: "/css/:path*",
            //     headers: [
            //       { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
            //     ],
            //   },

            // SVG, ICO, etc. dans /img et /services
            {
                source: "/img/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
