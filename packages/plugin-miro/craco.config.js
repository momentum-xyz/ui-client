const {ModuleFederationPlugin} = require("webpack").container;
const path = require("path");

module.exports = {
  style: {
    postcssOptions: {
      plugins: [require('autoprefixer')]
    }
  },
  mode: 'development',
  entry: './src/index',
  devServer: {
    static: path.join(__dirname, 'dist'),
    port: 3001,
  },
  webpack: {
    configure: {
      output: {
        publicPath: 'auto',
      },
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'miro_plugin',
        filename: 'remoteEntry.js',
        exposes: {
            './Plugin': './src/Plugin'
        },
        shared: { 
          react: {
            eager: true,
            requiredVersion: ">=16.14.0"
          }, 
          'react-dom': {
            eager: true,
            requiredVersion: ">=16.14.0"
          },
          "mobx": {
            eager: true,
            requiredVersion: ">=6.4.2"
          },
          "mobx-react-lite": {
            eager: true,
            requiredVersion: ">=3.3.0"
          },
          "mobx-state-tree": {
            eager: true,
            requiredVersion: ">=5.1.3"
          },
          "styled-components": {
            eager: true,
            requiredVersion: ">=5.3.5"
          },
           "axios": {
            eager: true,
            requiredVersion: ">=0.21.4"
          },
          "axios-auth-refresh": {
            eager: true,
            requiredVersion: ">=3.2.2"
          }
        },
      })
    ]
  }
};
