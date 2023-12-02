const config = {
  presets: [
    ["@babel/preset-react"],
    "@babel/preset-env",
    "@babel/preset-typescript",
  ],
  plugins: ["@babel/plugin-transform-modules-commonjs"],
};
module.exports = config;
