# Webpack Hot Module Replacement
`vue-di-loader` supports integration with Webpack's Hort Module Replacement (HMR) through [vue-hot-reload-api](https://www.npmjs.com/package/vue-hot-reload-api) and the [vue-di-kit](https://www.npmjs.com/package/vue-di-kit) [HMRClass](https://github.com/joejukan/vue-di-kit/blob/master/src/classification/hmr.class.ts).

<br/>**01)** `vue-di-loader` will inject the following code into the `<script />` tag for all the `vue` SFC files during the webpack loading process.<br/>
```typescript
import { HMRClass } from 'vue-di-kit';

// a uniquely generated id will be passed along with the component defined in the SFC file.
let hmr = new HMRClass('ff25e4e0-d2ed-4f40-b663-83c912200c36', Component);

// the HMRClass object will run its process to reload the component.
hmr.hot();
```
<br/>**02)** `vue-di-loader` will inject the following code into the `<script></script>` tag for the `ts` typescript file indicated as the entry during the webpack loading process.<br/>
```typescript
declare let module: any;
if(module.hot){
    module.hot.accept();
}
```
<br/>**03)** When using `NodeJS`, do not put the dev server options in the webpack configuration file `webpack.config.js`.  Instead, [as suggested by webpack](https://webpack.js.org/guides/hot-module-replacement/#via-the-node-js-api), define them on a separate javascript file and run it from there.  Below is an example:<br/>
```javascript
const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

const compilerOptions = require('../webpack.config');

compilerOptions.mode = 'development';
const devServerOptions = {
  contentBase: './built',
  hot: true,
  host: 'localhost',
  progress: true,
  historyApiFallback: true
};

webpackDevServer.addDevServerEntrypoints(compilerOptions, devServerOptions);
const compiler = webpack(compilerOptions);
const server = new webpackDevServer(compiler, devServerOptions);
server.listen(3000, 'localhost', () => {
  console.log('dev server listening on port 3000');
});

```
<br/>