const indexSearch = require('./plugins/search-index');
const feed = require('./plugins/feed');
const sitemap = require('./plugins/sitemap');
// const socialImages = require('./plugins/socialImages'); TODO: failing to run on Netlify

/**
 * parseEnv
 * @description Helper function to check if a variable is defined and parse booleans
 */
function parseEnvValue(value, defaultValue) {
  if (typeof value === 'undefined') return defaultValue;
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return value;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,

  // Images configuration
  images: {
    domains: ['next.isaxcode.com'], // Add your WordPress domain
    formats: ['image/avif', 'image/webp'],
  },

  env: {
    // Convert all environment variables to strings to avoid type errors
    OG_IMAGE_DIRECTORY: '/images/og',
    POSTS_PRERENDER_COUNT: process.env.POSTS_PRERENDER_COUNT || '5',
    WORDPRESS_GRAPHQL_ENDPOINT: process.env.WORDPRESS_GRAPHQL_ENDPOINT || '',
    WORDPRESS_MENU_LOCATION_NAVIGATION: process.env.WORDPRESS_MENU_LOCATION_NAVIGATION || 'PRIMARY',
    WORDPRESS_PLUGIN_SEO: String(parseEnvValue(process.env.WORDPRESS_PLUGIN_SEO, false)),
  },

  // Webpack configuration if needed
  webpack: (config, { isServer }) => {
    // Add any webpack configurations here if needed
    return config;
  },
};

// Plugin configuration
module.exports = () => {
  const plugins = [indexSearch, feed, sitemap];
  return plugins.reduce((acc, plugin) => plugin(acc), nextConfig);
};