const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { extendDefaultPlugins } = require('svgo');

const environment = require('./environment');

module.exports = {
  // devtool: 'source-map',
  entry: {
    app: path.resolve(environment.paths.source, 'app.js'),
  },
  output: {
    filename: 'bundle.[name].js',
    path: environment.paths.output,
  },
  module: {
    rules: [
      // CSS
      {
        test: /\.((c|sa|sc)ss)$/i,
        use: [
          MiniCSSExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      // JS
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },

      // Images
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: environment.limits.images,
              name: '[path][name].[ext]',
              context: path.resolve(environment.paths.source, 'static/images'),
              outputPath: 'assets/images',
              publicPath: '../images',
              useRelativePaths: true,
            },
          },
        ],
      },

      // {
      //   test: /\.(glb|gltf)$/,
      //   use: [
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         limit: environment.limits.images,
      //         name: '[path][name].[ext]',
      //         context: path.resolve(environment.paths.source, 'static'),
      //         outputPath: 'assets',
      //         publicPath: 'assets',
      //         useRelativePaths: true,
      //       },
      //     },
      //   ],
      // },

      // Fonts
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: environment.limits.fonts,
              name: '[path][name].[ext]',
              context: path.resolve(environment.paths.source, 'static/fonts'),
              outputPath: 'assets/fonts',
              publicPath: '../fonts',
              useRelativePaths: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCSSExtractPlugin({
      filename: 'assets/css/[name].css',
    }),
    new ImageMinimizerPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      minimizerOptions: {
        // Lossless optimization with custom option
        plugins: [
          ['gifsicle', { interlaced: true }],
          ['jpegtran', { progressive: true }],
          ['optipng', { optimizationLevel: 5 }],
          [
            'svgo',
            {
              plugins: extendDefaultPlugins([
                {
                  name: 'removeViewBox',
                  active: false,
                },
              ]),
            },
          ],
        ],
      },
    }),
    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: ['**/*', '!stats.json'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(environment.paths.source, 'static'),
          to: path.resolve(environment.paths.output, 'assets'),
        },
      ],
    }),
    new HTMLWebpackPlugin({
      inject: true,
      hash: false,
      filename: 'index.html',
      template: path.resolve(environment.paths.source, 'index.html'),
      favicon: path.resolve(environment.paths.source, 'favicon.ico'),
    }),
  ],
};
