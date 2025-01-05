/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['res.cloudinary.com'],
    },
    experimental: {
        serverComponentsExternalPackages: ["pdfkit"],
      },
};

export default nextConfig;
