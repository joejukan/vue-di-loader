# Webpack Configuration

When using the **vue-di-loader**, it is recommended to use a `webpack.config.js` that looks similar to the one below:

```javascript
const { resolve } = require('path');
const webpack = require('webpack');
const { HotModuleReplacementPlugin, NamedModulesPlugin } = webpack;
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const { VueDIPlugin } = require('vue-di-loader');

module.exports = {
  entry: './src/app.ts',
  mode: 'production',
  output: {
    path: resolve('dist'),
    publicPath: '',
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-di-loader',
        options: {}
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/],
              transpileOnly: true
            }
          },
          {
            loader: 'vue-di-loader',
            options: {}
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        options: {
          name: 'assets/images/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      {test : /\.css$/, loader: 'file-loader', options: {name: 'assets/css/[name].[ext]?[hash]'} },
      { test: /\.html$/, loader: 'html-loader' }
    ]
  },
  plugins: [
    new HotModuleReplacementPlugin({multiStep: false}),
    new NamedModulesPlugin(),
    new ExtractTextPlugin('assets/css/index.css'),
    new FaviconsWebpackPlugin({
      logo: resolve('./assets/images/favicon.png'),
      inject: true,
      icons: {
        favicons: true
      }
    }),
    new CopyWebpackPlugin([
      {from: 'assets/images', to: 'assets/images'},
      {from: 'node_modules/\@fortawesome/fontawesome-free/webfonts/', to: 'assets/webfonts'},
      {from: 'node_modules/\@fortawesome/fontawesome-free/css/all.min.css', to: 'assets/css/fontawesome.css'},
      {from: 'node_modules/vuetify/dist/vuetify.min.css', to: 'assets/css/vuetify.css'},
      {from: 'node_modules/vue/dist/vue.min.js', to: 'assets/js/vue.js'},
      {from: 'node_modules/vue-router/dist/vue-router.min.js', to: 'assets/js/vue-router.js'},
      {from: 'node_modules/vuex/dist/vuex.min.js', to: 'assets/js/vuex.js'},
      {from: 'node_modules/vuetify/dist/vuetify.min.js', to: 'assets/js/vuetify.js'}
    ]),
    new HtmlWebpackPlugin({
      title: 'Vue DI Application',
      filename: 'index.html',
      inject: 'body',
      minify: false,
      path: resolve('dist'),
      publicPath: '/',
      template: resolve('./assets/html/index.html')
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: [
        'assets/css/fontawesome.css',
        'assets/css/vuetify.css',
        'assets/css/index.css',
        'assets/js/vue.js',
        'assets/js/vue-router.js',
        'assets/js/vuex.js',
        'assets/js/vuetify.js'
      ],
      append: false
    }),
    new VueDIPlugin({
      debug: false,
      components: {
        deep: true,
        path: resolve('./src/componentization'),
        hot: true
      },
      loaders: {
        file: {
          path: resolve('./assets/scss')
        }, 
        sass: {
          path: [resolve('./assets/scss')]
        }
      }
    })
  ],
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    plugins: [
      new TsconfigPathsPlugin({
        configFile: "./tsconfig.json",
        logLevel: "debug",
        extensions: [".ts", ".tsx"]
      })
    ]
  },
  externals: {
    vue: 'Vue',
    vuetify: 'Vuetify',
    vuex: 'Vuex',
    'vue-router': 'VueRouter'
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}
```
<br/>The `entry` option can either be string pointing to a file or an array of strings pointing to multiple files.<br/>

The module rule for single file components is where the `vue-di-loader` must be specified:
```javascript
{
  test: /\.vue$/,
  loader: 'vue-di-loader',
  options: {}
}
```

<br/>The module rule for typescript files must specify both [ts-loader](https://www.npmjs.com/package/ts-loader) and `vue-di-loader` in a fashion so that the `vue-di-loader` is executed first.
```javascript
{
  test: /\.tsx?$/,
  use: [
    {
      loader: 'ts-loader',
      options: {
        appendTsSuffixTo: [/\.vue$/],
        transpileOnly: true
      }
    },
    {
        loader: 'vue-di-loader',
        options: {}
    }
  ]
}
```
Note that webpack always starts from the last loader specified in the `use` array and ends with the first.  Also note that in this case the `vue-di-loader` options for sass/scss should not be specified as it is not necessary.<br/>

```javascript
new FaviconsWebpackPlugin({
  logo: resolve('./assets/images/favicon.png'),
  inject: true,
  icons: {
    favicons: true
  }
}),
```
The `FaviconsWebpackPlugin` should be used when it is desired to associated the web application domain with an icon on the browser.<br/>


The `VueDIPlugin` is primarily used to identify the directory (or files) of the **SFC** to inject into the entry.
```javascript
new VueDIPlugin({
    debug: false,
    components: {
        entry: undefined,
        hot: true,
        deep: true,
        path: resolve('./src/components')
    },
    loaders: {
        file: {
            path: resolve('./assets/images')
        },
        sass: {
            path: [resolve('./assets/scss')]
        }
    },
    parsers: {
        dom: false
    }
})
```