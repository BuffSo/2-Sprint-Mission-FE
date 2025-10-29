/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sprint-fe-project.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/Sprint_Mission/user/**'
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/**' // Adjust the path if you need to limit it further
      },
      {
        protocol: 'https',
        hostname: 'youtube.com',  // Allows images from youtube.com
        port: '',
        pathname: '/**'           // Allows all paths from youtube.com
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',  // Google profile images
        port: '',
        pathname: '/**'
      },
    ],
    domains: ['localhost'],  // localhost 추가
  }
};

export default nextConfig;
