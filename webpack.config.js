const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (_, argv) => {
  const config = {
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "./dist"),
      filename: "payment.js",
      library: "Payment",
      libraryTarget: "umd",
    },
    plugins: [
      new CopyPlugin([
        {
          from: "./src/providers/ingenico/index.js",
          to: "./payment.providers.ingenico.js",
        },
      ]),
    ],
  };

  if (argv.mode === "development") {
    config.devtool = "source-map";
  }

  return config;
};
