const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "./index.html"
});

const nodeProdEnv = new webpack.DefinePlugin({
  "process.env.NODE_ENV": JSON.stringify("production")
});

module.exports = {
  output: {
    library: "GraphQLPlayground",
    libraryTarget: "window",
    libraryExport: "default"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader"
      },
      {
        test: /\.(png|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 65536
            }
          }
        ]
      },
      {
        test: /\.(flow)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              emitFile: false
            }
          }
        ]
      }
    ]
  },
  plugins: [htmlPlugin, nodeProdEnv]
};
