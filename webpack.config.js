const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devServer: {
    port: 3000
  },
  plugins: [
    new HTMLPlugin({
      template: './src/index.html'
    }),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        loader: 'url-loader'
      },
    ],
  },
  output: {
    filename: 'bundle.[chunkhash].js',
    path: path.resolve(__dirname, 'dist')
  }
}