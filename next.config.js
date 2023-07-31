/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    COHERE_TOKEN: process.env.COHERE_TOKEN,
  },
}

module.exports = nextConfig
