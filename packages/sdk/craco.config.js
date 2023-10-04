const {ModuleFederationPlugin} = require('webpack').container;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const package = require('./package.json');

const {PLUGIN_NAME, PLUGIN_EMULATOR} = process.env;

module.exports = {
  // style: {
  //   postcssOptions: {
  //     plugins: [require('autoprefixer')]
  //   }
  // },
  // mode: 'development',
  // entry: './src/index',
  // devServer: {
  //   static: path.join(__dirname, 'dist'),
  //   port: process.env.PLUGIN_PORT
  // },
  webpack: {
    // configure: {
    //   output: {
    //     publicPath: 'auto',
    //   },
    // },
    configure: (webpackConfig, {paths}) => {
      // needed for using plugin_index.html from sdk instead of having it in each plugin
      const publicPath = path.resolve(require.resolve(package.name), '../public');
      const htmlPath = path.resolve(publicPath, 'plugin_index.html');

      console.log('Using sdk paths', publicPath, htmlPath);
      paths.appHtml = htmlPath;
      paths.appPublic = publicPath;

      webpackConfig.plugins = webpackConfig.plugins.map((webpackPlugin) => {
        // if (webpackPlugin instanceof HtmlWebpackPlugin) {
        if (webpackPlugin.constructor.name === 'HtmlWebpackPlugin') {
          return new HtmlWebpackPlugin({
            template: htmlPath,
            inject: true
          });
        }
        return webpackPlugin;
      });

      // needed for module federation inside app
      if (!PLUGIN_EMULATOR) {
        webpackConfig.output.publicPath = 'auto';
      }

      // console.log('webpackConfig', JSON.stringify(webpackConfig, null, 2));
      return webpackConfig;
    },
    plugins: PLUGIN_EMULATOR
      ? []
      : [
          new ModuleFederationPlugin({
            name: PLUGIN_NAME,
            filename: 'remoteEntry.js',
            exposes: {
              './Plugin': './src/Plugin'
            },
            shared: {
              react: {
                singleton: true,
                requiredVersion: '^18.2.0'
              },
              'react-dom': {
                singleton: true,
                requiredVersion: '^18.2.0'
              },
              mobx: {
                requiredVersion: '^6.4.2'
              },
              '@momentum-xyz/sdk': {
                singleton: true,
                requiredVersion: '^0.1.3'
              },
              '@momentum-xyz/ui-kit': {
                singleton: true,
                requiredVersion: '^0.1.4'
              },
              'mobx-react-lite': {
                requiredVersion: '^3.3.0'
              },
              'mobx-state-tree': {
                requiredVersion: '^5.1.3'
              },
              'styled-components': {
                requiredVersion: '^5.3.5'
              },
              axios: {
                requiredVersion: '^0.22.0'
              },
              'axios-auth-refresh': {
                requiredVersion: '^3.2.2'
              }
            }
          })
        ]
  }
};
