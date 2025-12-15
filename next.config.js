/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  turbopack: {
    root: path.resolve(__dirname),
  },
}

module.exports = nextConfig
