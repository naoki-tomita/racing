import { Configuration } from "webpack";
import * as path from "path";

const config: Configuration = {
  entry: "./src/script/index.ts",
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "dist/js")
  },
  resolve: {
    extensions: [ ".ts" ],
  },
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" }
    ],
  }
};

export default config;