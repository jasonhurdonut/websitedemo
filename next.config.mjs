/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      // runs before filesystem/page routes, so "/" serves the DSAC site
      beforeFiles: [
        { source: '/', destination: '/dsac-website.html' },
      ],
    };
  },
};

export default nextConfig;
