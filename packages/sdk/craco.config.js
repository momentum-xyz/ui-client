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
    port: process.env.PLUGIN_PORT
  },
  webpack: {
    configure: {
      output: {
        publicPath: 'auto',
      },
    },
    plugins: [
      new ModuleFederationPlugin({
        name: process.env.PLUGIN_NAME,
        filename: 'remoteEntry.js',
        exposes: {
            './Plugin': './src/Plugin'
        },
        shared: { 
          react: {
            singleton: true,
            requiredVersion: "^16.14.0"
          }, 
          'react-dom': {
            singleton: true,
            requiredVersion: "^16.14.0"
          },
          "mobx": {
            requiredVersion: "^6.4.2"
          },
          "mobx-react-lite": {
            requiredVersion: "^3.3.0"
          },
          "mobx-state-tree": {
            requiredVersion: "^5.1.3"
          },
          "styled-components": {
            requiredVersion: "^5.3.5"
          },
           "axios": {
            requiredVersion: "^0.21.4"
          },
          "axios-auth-refresh": {
            requiredVersion: "^3.2.2"
          }
        },
      })
    ]
  }
};
