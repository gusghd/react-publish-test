const path = require("path");

module.exports = {
  entry: {
    main: "./src/lib/app.tsx",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
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
    ],
  },
};
