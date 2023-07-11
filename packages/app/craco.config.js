const CompressionPlugin = require('compression-webpack-plugin');
const {ModuleFederationPlugin} = require('webpack').container;

module.exports = {
  style: {
    postcssOptions: {
      plugins: [require('autoprefixer')]
    }
  },
  webpack: {
    plugins: [
      new CompressionPlugin({
        test: /\.(m?js|css|svg|wasm)$/,
        algorithm: 'gzip'
      }),
      new ModuleFederationPlugin({
        name: 'app',
        remotes: {},
        shared: {
          react: {
            singleton: true,
            eager: true,
            requiredVersion: '>=16.14.0'
          },
          'react-dom': {
            singleton: true,
            eager: true,
            requiredVersion: '>=16.14.0'
          },
          mobx: {
            singleton: true,
            eager: true,
            requiredVersion: '^6.4.2'
          },
          'mobx-react-lite': {
            singleton: true,
            eager: true,
            requiredVersion: '^3.3.0'
          },
          'mobx-state-tree': {
            singleton: true,
            eager: true,
            requiredVersion: '^5.1.3'
          },
          'styled-components': {
            singleton: true,
            eager: true,
            requiredVersion: '^5.3.5'
          },
          axios: {
            singleton: true,
            eager: true,
            requiredVersion: '^0.22.0'
          },
          'axios-auth-refresh': {
            singleton: true,
            eager: true,
            requiredVersion: '^3.2.2'
          },
          '@momentum-xyz/sdk': {
            singleton: true,
            eager: true,
            requiredVersion: '0.1.5'
          },
          '@momentum-xyz/ui-kit': {
            singleton: true,
            eager: true,
            requiredVersion: '0.1.4'
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
