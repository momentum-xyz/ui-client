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
          react: {
            singleton: true, 
            eager: true,
            requiredVersion: ">=16.14.0",
          },
          "react-dom": {
            singleton: true, 
            eager: true,
            requiredVersion: ">=16.14.0"
          },
          mobx: { 
            singleton: true, 
            eager: true,
            requiredVersion: ">=6.4.2"
          },
          "mobx-react-lite": { 
            singleton: true, 
            eager: true,
            requiredVersion: ">=3.3.0"
          },
          "mobx-state-tree": { 
            singleton: true, 
            eager: true,
            requiredVersion: ">=5.1.3"
          },
          "styled-components": { 
            singleton: true, 
            eager: true,
            requiredVersion: ">=5.3.5"
          },
          "axios": {
            singleton: true,
            eager: true,
            requiredVersion: ">=0.21.4"
          },
          "axios-auth-refresh": {
            singleton: true,
            eager: true,
            requiredVersion: ">=3.2.2"
          }
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
