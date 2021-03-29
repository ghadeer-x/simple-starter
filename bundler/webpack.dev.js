/* eslint-disable import/no-extraneous-dependencies */
const { merge } = require('webpack-merge');
const ip = require('internal-ip');
const webpackConfiguration = require('./webpack.common');
const environment = require('./environment');

const infoColor = (_message) =>
  `\u001b[1m\u001b[34m${_message}\u001b[39m\u001b[22m`;

module.exports = merge(webpackConfiguration, {
  mode: 'development',

  /* Manage source maps generation process */
  devtool: 'eval-source-map',

  /* Development Server Configuration */
  devServer: {
    contentBase: environment.paths.output,
    watchContentBase: true,
    open: true,
    https: false,
    useLocalIp: true,
    disableHostCheck: true,
    historyApiFallback: true,
    compress: true,
    overlay: true,
    hot: false,
    noInfo: true,
    watchOptions: {
      poll: 300,
    },
    ...environment.server,
    after: function (app, server) {
      const { port } = server.options;
      const https = server.options.https ? 's' : '';
      const localIp = ip.v4.sync();
      const domain1 = `http${https}://${localIp}:${port}`;
      const domain2 = `http${https}://localhost:${port}`;

      // eslint-disable-next-line no-console
      console.log(
        `Project running at:\n  - ${infoColor(domain1)}\n  - ${infoColor(
          domain2
        )}`
      );
    },
  },

  /* File watcher options */
  watchOptions: {
    aggregateTimeout: 300,
    poll: 300,
    ignored: /node_modules/,
  },

  /* Additional plugins configuration */
  plugins: [],
});
