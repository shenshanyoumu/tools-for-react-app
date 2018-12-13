const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const plugins = require("./plugins");

const extractLibStyle = plugins.extractLibStyle;
const extractProjectStyle = plugins.extractProjectStyle;

const ROOT = process.cwd();
const postcssOptions = {
  plugins: () => [require("autoprefixer")()]
};

module.exports = {
  context: ROOT,
  entry: {
    polyfill: ["babel-polyfill"],
    vendor: [
      "immutable",
      "immer",
      "moment",
      "prop-types",
      "react",
      "react-dom",
      "react-helmet",
      "react-redux",
      "react-router",
      "react-router-config",
      "react-router-dom",
      "react-router-redux",
      "redux"
    ],
    main: "./src/index.jsx"
  },
  output: {
    filename: "js/[name].[chunkhash:6].js",
    chunkFilename: "js/[name].[chunkhash:6].js",
    path: path.resolve(ROOT, "dist"),
    publicPath: "/"
  },
  resolve: {
    modules: ["./src", "./public", "./server", "./node_modules"],
    extensions: [".js", ".jsx", ".less"]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: "happypack/loader?id=js",
        exclude: /node_modules/
      },
      {
        test: /\.jsx?$/,
        use: "happypack/loader?id=js"
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract(["css-loader"])
      },
      {
        test: /\.less/,
        use: extractLibStyle.extract([
          "css-loader",
          {
            loader: "postcss-loader",
            options: postcssOptions
          },
          "happypack/loader?id=less"
        ]),
        include: [path.resolve(ROOT, "node_modules/")],
        exclude: [path.resolve(ROOT, "src/")]
      },
      {
        test: /\.less/,
        use: extractProjectStyle.extract([
          "css-loader",
          {
            loader: "postcss-loader",
            options: postcssOptions
          },
          "happypack/loader?id=less"
        ]),
        include: [path.resolve(ROOT, "src/")],
        exclude: [path.resolve(ROOT, "node_modules/")]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "babel-loader"
          },
          {
            loader: "react-svg-loader",
            options: {
              svgo: {
                plugins: [{ removeTitle: true }],
                floatPrecision: 2
              }
            }
          }
        ]
      },
      {
        test: /\.(png|jpeg|jpg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              name: "images/[name].[ext]"
            }
          }
        ]
      }
    ]
  }
};
