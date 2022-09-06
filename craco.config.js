const CompressionPlugin = require('compression-webpack-plugin');

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
    configure: {
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
  }
};
