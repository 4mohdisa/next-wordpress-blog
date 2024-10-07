const path = require('path');
const { getSitemapData, generateSitemap, generateRobotsTxt } = require('./util');
const WebpackPluginCompiler = require('./plugin-compiler');

module.exports = function sitemap(nextConfig = {}) {
  const { env, outputDirectory, outputName, verbose = false } = nextConfig;

  const plugin = {
    name: 'Sitemap',
    outputDirectory: outputDirectory || './public',
    outputName: outputName || 'sitemap.xml',
    getData: getSitemapData,
    generate: generateSitemap,
    postcreate: generateRobotsTxt,
  };

  const { WORDPRESS_GRAPHQL_ENDPOINT } = env;

  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      let wpConfig = { ...config };

      // Initialize watchOptions if it doesn't exist
      if (!wpConfig.watchOptions) {
        wpConfig.watchOptions = {};
      }

      // Initialize ignored array if it doesn't exist
      if (!wpConfig.watchOptions.ignored) {
        wpConfig.watchOptions.ignored = [];
      } else if (!Array.isArray(wpConfig.watchOptions.ignored)) {
        // Convert to array if it's not already
        wpConfig.watchOptions.ignored = [wpConfig.watchOptions.ignored];
      }

      if (!wpConfig.watchOptions.ignored) {
        wpConfig.watchOptions.ignored = [];
      } else if (!Array.isArray(wpConfig.watchOptions.ignored)) {
        wpConfig.watchOptions.ignored = [wpConfig.watchOptions.ignored];
      }
      

      // Add the plugin
      if (!wpConfig.plugins) {
        wpConfig.plugins = [];
      }

      wpConfig.plugins.push(
        new WebpackPluginCompiler({
          url: WORDPRESS_GRAPHQL_ENDPOINT,
          plugin,
          verbose,
          nextConfig,
        })
      );

      // Call the original webpack config function if it exists
      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(wpConfig, options);
      }

      return wpConfig;
    },
  });
};