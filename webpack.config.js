const path = require("path");

const MainProcess = {
  mode: "none",
  entry: "./res/os/main.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "desktop"),
  },
  target: "electron-main",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
};

const RendererProcess = {
  mode: "none",
  entry: "./res/js/main.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "public"),
  },
  target: "electron-renderer",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
        },
      },
    ],
  },
};

module.exports = [MainProcess, RendererProcess];
