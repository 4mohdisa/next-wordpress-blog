const path = require('path');
const { getFeedData, generateFeed } = require('./util');

const WebpackPluginCompiler = require('./plugin-compiler');

module.exports = function feed(nextConfig = {}) {
  const { env, outputDirectory, outputName, verbose = false } = nextConfig;

  const plugin = {
    name: 'Feed',
    outputDirectory: outputDirectory || './public',
    outputName: outputName || 'feed.xml',
    getData: getFeedData,
    generate: generateFeed,
  };

  const { WORDPRESS_GRAPHQL_ENDPOINT } = env;

  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      // Ensure watchOptions and ignored are initialized properly
      if (!config.watchOptions) {
        config.watchOptions = {};
      }
  
      // Handle watchOptions.ignored initialization robustly
      const ignored = config.watchOptions.ignored;
  
      if (!Array.isArray(ignored)) {
        // If ignored is not an array, check if it exists
        if (ignored) {
          // If it exists, convert it to an array
          config.watchOptions.ignored = [ignored];
        } else {
          // If it doesn't exist, initialize as an empty array
          config.watchOptions.ignored = [];
        }
      }
  
      // Add the path to ignored array
      if (Array.isArray(config.watchOptions.ignored)) {
        config.watchOptions.ignored.push(path.join('**', plugin.outputDirectory, plugin.outputName));
      } else {
        config.watchOptions.ignored = [path.join('**', plugin.outputDirectory, plugin.outputName)];
      }
  
      // Continue with adding plugins and other webpack configurations...
      config.plugins.push(
        new WebpackPluginCompiler({
          url: WORDPRESS_GRAPHQL_ENDPOINT,
          plugin,
          verbose,
        })
      );
  
      // Call the original webpack config function if it exists
      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }
  
      return config;
    },
  });
  
};
