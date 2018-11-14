var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');

module.exports = {
  context: __dirname,

  mode: process.env.DEBUG == 'True' ? 'development' : 'production',

  entry: {
    main: './meow/frontend/src/index'
  },

  output: {
    path: path.resolve('./meow/frontend/bundles/'),
    filename: '[name]-[hash].js'
  },

  plugins: [new BundleTracker({ filename: './webpack-stats.json' })],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['transform-class-properties']
          }
        }
      },
      {
        test: /\.(css|sass|scss)$/,
        use: [
          {
            loader: 'style-loader' // creates style nodes from JS strings
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          },
          {
            loader: "sass-loader" // translates CSS into CommonJS
          },
        ]
      },
      {
        test: /\.(jpe|jpg|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
      }
    ]
  }
};
