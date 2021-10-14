const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { ESBuildMinifyPlugin } = require('esbuild-loader')

// for local ip change in every new day
const os = require('os');
function getLocalIp() {
  const ifaces = os.networkInterfaces();
  return Object.values(ifaces).find(dev => dev[1]?.address.startsWith('30.'))?.[1]?.address;
}
const localIp = getLocalIp() ?? '0.0.0.0';
console.log('use dev ip address: ', localIp);

/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

/*
 * We've enabled TerserPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/terser-webpack-plugin
 *
 */
// function getConfig(entry, output, html, port) {
//   return {
//     mode: 'development',
//     entry,
//     plugins: [new webpack.ProgressPlugin()],
//     devtool: 'inline-source-map',
//     output,
//     module: {
//       rules: [
//         {
//           test: /\.(ts|tsx)$/,
//           loader: 'esbuild-loader',
//           options: {
//             loader: 'tsx',
//             target: 'es2015',
//           },
//           include: [path.resolve(__dirname, 'src')],
//           exclude: [/node_modules/],
//         },
//         {
//           test: /.css$/,

//           use: [
//             {
//               loader: 'style-loader',
//             },
//             {
//               loader: 'css-loader',
//               options: {
//                 sourceMap: true,
//               },
//             },
//             {
//               loader: 'esbuild-loader',
//               options: {
//                 loader: 'css',
//                 minify: true,
//               },
//             },
//           ],
//         },
//       ],
//     },

//     resolve: {
//       extensions: ['.tsx', '.ts', '.js'],
//       fallback: { path: require.resolve('path-browserify') },
//     },

//     devServer: {
//       port,
//       compress: true,
//       contentBase: path.join(__dirname, 'docs'),
//       allowedHosts: ['0.0.0.0'],
//       host: localIp,
//       open: true,
//     },

//     plugins: [
//       new CleanWebpackPlugin({
//         root: __dirname + '/docs',
//         cleanStaleWebpackAssets: false,
//         cleanOnceBeforeBuildPatterns: ['main.js'],
//       }),
//       new webpack.DefinePlugin({
//         __DEV__: process.env.WEBPACK_DEV_SERVER ? true : false,
//         __SERVER_PATH__: process.env.WEBPACK_DEV_SERVER ? '"ws://' + localIp + ':8081"' : '"wss://www.anxyser.xyz/qianserver"'
//       })
//     ],
//     optimization: {
//       minimizer: [
//         new ESBuildMinifyPlugin({
//           css: true,
//         }),
//       ],
//     },
//   }

// }
// module.exports = [
//   getConfig('./src/index.ts', {
//     path: __dirname + '/docs',
//     filename: 'main.js',
//   }, 'index.html', 9000),
//   getConfig('./src/watch.ts', {
//     path: __dirname + '/docs',
//     filename: 'watch.js',
//   }, 'watch.html', 9001)
// ]

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.ts',
    watch: './src/watch.ts'
  },
  plugins: [new webpack.ProgressPlugin()],
  devtool: 'inline-source-map',
  output: {
    path: __dirname + '/docs',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx',
          target: 'es2015',
        },
        include: [path.resolve(__dirname, 'src')],
        exclude: [/node_modules/],
      },
      {
        test: /.css$/,

        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'css',
              minify: true,
            },
          },
        ],
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: { path: require.resolve('path-browserify') },
  },

  devServer: {
    port: 9000,
    compress: true,
    contentBase: path.join(__dirname, 'docs'),
    allowedHosts: ['0.0.0.0'],
    open: true,
    useLocalIp: true
  },

  plugins: [
    new CleanWebpackPlugin({
      root: __dirname + '/docs',
      cleanStaleWebpackAssets: false,
      cleanOnceBeforeBuildPatterns: ['main.js'],
    }),
    new webpack.DefinePlugin({
      __DEV__: process.env.WEBPACK_DEV_SERVER ? true : false,
      __SERVER_PATH__: process.env.WEBPACK_DEV_SERVER ? '"ws://' + localIp + ':8081"' : '"wss://www.anxyser.xyz/qianserver"'
    })
  ],
  optimization: {
    minimizer: [
      new ESBuildMinifyPlugin({
        css: true,
      }),
    ],
  },
}