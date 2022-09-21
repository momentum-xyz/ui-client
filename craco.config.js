const CompressionPlugin = require('compression-webpack-plugin');
const {ModuleFederationPlugin} = require("webpack").container;

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
      }),
      new ModuleFederationPlugin({
        name: "core",
        remotes: {},
        shared: {
          react: {singleton: true, eager: true},
          "react-dom": {singleton: true, eager: true},
          mobx: { eager: true },
          "mobx-react-lite": { eager: true },
          "mobx-state-tree": { eager: true },
          "styled-components": { eager: true }
        }
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
