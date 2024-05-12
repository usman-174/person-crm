/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns: [
            {
                hostname:"images.unsplash.com",
                protocol: "https",
                pathname: "/*",
                port:""
            },
            {
                hostname:"res.cloudinary.com",
                protocol: "https",
                // pathname: "/*",
                // port:""
            }
        ],
    }
};

export default nextConfig;
