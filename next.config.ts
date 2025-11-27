import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false,
    async rewrites(){
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:5066'
            },
        ];
    }
};
export default nextConfig;