var path = require("path");
var webpack = require("webpack");
var BundleTracker = require("webpack-bundle-tracker");

module.exports = {
  context: __dirname,

  mode: process.env.DEBUG == "True" ? "development" : "production",

  entry: {
    main: "./src/index.js"
  },

  output: {
    path: path.resolve("./static/frontend/"),
    filename: "[name]-[hash].js"
  },

  plugins: [new BundleTracker({ filename: "./webpack-stats.json" })],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
