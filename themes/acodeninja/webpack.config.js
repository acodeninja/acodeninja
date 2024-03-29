const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const join = (...paths) => path.join(__dirname, ...paths);

const makeJsxLoader = (name) => ({
  resolve: {
    extensions: [".js", ".jsx"],
    modules: ["src", "node_modules"],
  },
  entry: {
    [name]: `./src/js/${name}.jsx`,
  },
  output: {
    path: join('static'),
    publicPath: "",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(svg)$/,
        loader: 'file-loader',
        options: {
          name: '/images/[hash].[ext]',
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: '/fonts/[hash].[ext]',
        },
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "./[name].css",
    }),
  ],
});

const makeSassLoader = (name) => ({
  resolve: {
    extensions: [".css", ".scss", ".woff", ".woff2"],
    modules: ["src", "node_modules"],
  },
  entry: {
    [name]: `./src/scss/${name}.scss`,
  },
  target: 'browserslist:last 2 versions',
  output: {
    path: join('static'),
    publicPath: "",
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: './fonts/[hash].[ext]',
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "./[name].css",
    }),
    new CopyPlugin({
      patterns: [
        {from: 'src/images', to: 'images'},
      ],
    }),
  ],
});

module.exports = [
  makeSassLoader('all'),
  makeSassLoader('screen'),
  makeJsxLoader('app'),
];
