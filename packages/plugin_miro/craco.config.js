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
            './SpaceApp': './src/SpaceApp'
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
            requiredVersion: false
          }
        },
      }),
    ]
  }
};
