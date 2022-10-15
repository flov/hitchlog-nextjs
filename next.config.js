/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'www.gravatar.com',
      'robohash.org',
      's3-eu-west-1.amazonaws.com',
    ],
  },
};

module.exports = nextConfig;
