const path = require("path");

module.exports = {
  entry: {
    main: "./src/lib/app.tsx",
  },
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "dist"),
    chunkFilename: "main.[id].js?v=[hash]",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts|jsx|js)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
};
