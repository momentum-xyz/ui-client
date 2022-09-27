const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const {getLoader, loaderByName} = require('@craco/craco');

const packages = [];
packages.push(path.join(__dirname, '../ui-kit'));

module.exports = {
  style: {
    postcssOptions: {
      plugins: [require('autoprefixer')]
    }
  },
  webpack: {
    plugins: [
      new CompressionPlugin({
        test: /\.(js|css|svg)$/,
        algorithm: 'gzip'
      })
    ],
    configure: (webpackConfig, arg) => {
      const {isFound, match} = getLoader(webpackConfig, loaderByName('babel-loader'));
      if (isFound) {
        const include = Array.isArray(match.loader.include)
          ? match.loader.include
          : [match.loader.include];

        match.loader.include = include.concat(packages);
      }

      return webpackConfig;
    },
    ignoreWarnings: [
      function ignoreSourcemapsloaderWarnings(warning) {
        return (
          warning.module &&
          warning.module.resource.includes('node_modules') &&
          warning.details &&
          warning.details.includes('source-map-loader')
        );
      }
    ]
  }
};
