const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const useProd = config =>
  Object.assign({}, config, {
    mode: "production",
    output: {
      filename: "[name].[hash].js"
    },
    module: {
      rules: [
        ...config.module.rules,
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
        }
      ]
    },
    plugins: [
      ...config.plugins,
      new MiniCssExtractPlugin({
        filename: "[name].[hash].css"
      })
    ]
  });

const useDev = config =>
  Object.assign({}, config, {
    mode: "development",
    devtool: "cheap-module-eval-source-map",
    devServer: {
      historyApiFallback: true,
      port: 3000,
      hot: true,
      open: true
    },
    module: {
      rules: [
        ...config.module.rules,
        {
          test: /\.scss$/,
          use: ["style-loader", "css-loader", "sass-loader"]
        }
      ]
    },
    plugins: [...config.plugins, new webpack.HotModuleReplacementPlugin()]
  });

const baseConfig = {
  mode: "none",
  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 1000000
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html"
    })
  ],
  resolve: {
    extensions: [".js", ".jsx"]
  }
};

if (process.env.NODE_ENV === "production") {
  module.exports = useProd(baseConfig);
} else {
  module.exports = useDev(baseConfig);
}
