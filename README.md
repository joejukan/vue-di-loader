# Vue Dependency Injection Webpack Loader
[![Build Status](https://api.travis-ci.org/joejukan/vue-di-loader.svg?branch=master)](http://travis-ci.org/joejukan/vue-di-loader)
[![NPM Version](http://img.shields.io/npm/v/vue-di-loader.svg?style=flat)](https://www.npmjs.org/package/vue-di-loader)
[![NPM Downloads](https://img.shields.io/npm/dm/vue-di-loader.svg?style=flat)](https://npmcharts.com/compare/vue-di-loader?minimal=true)

A Webpack loader the automatically injects child components into apps and parent components during webpack compiling/transpiling.<br/>
`vue-di-loader` works with single file components (**SFC**) that have their script sections written in **TypeScript**.  By scanning the template section for component tags and then injects them into the code and transpiles them in to javascript during the webpack loading process.<br/>

This simplifies the web development process, and leaves code more elegant.<br/><br/>

For example, assume you have a project structure as below:<br/>
```
src/
    assets/
    components/
        app.component.vue
        form.component.vue
    main.html
    main.ts
```
<br/>assume that `app.component.vue` looks like:<br/>
```html
<template>
    <div>
        <h1>{{title}}</h1>
        <router-link to="/form">Go to Form</router-link>
        <router-view></router-view>
    </div>
</template>
```
```html
<script lang="ts">
```
```typescript
import Vue from "vue";
import {Component} from "vue-di-kit";
@Component()
export default class AppComponent extends Vue {
    public title: string = "My App";
}
```
```html
</script>
```

<br/>assume that `form.component.vue` looks like:<br/>
```html
<template>
    <form>
        <label>First Name</label>
        <input type="text" v-model="firstName">
        <br/>
        <label>Last Name</label>
        <input type="text" v-model="lastName">
        <br/>
        <label>Email Address</label>
        <label>{{email}}</label>
    </form>
</template>
```
```html
<script lang="ts">
```
```typescript
import Vue from "vue";
import {Component, Prop, Compute, Routing} from "vue-di-kit";

@Routing('/form')
@Component()
export default class FormComponent extends Vue {
    @Prop({required: true})
    private lastName: string = 'Last';
    @Prop({required: true})
    public firstName: string = 'First';

    @Compute()
    public get email(): string {
        return this.toLowerCase(`${this.firstName}.${this.lastName}@email.com`);
    }

    public toLowerCase(value: string): string{
        return value.toLowerCase();
    }
}
```
```html
</script>
```
<br/>and assume that `main.ts` will be used as the webpack entry module and looks like:<br/>
```typescript
import Vue from "vue";
import VueRouter from "vue-router";
import { routes } from "vue-di-kit";
Vue.use(VueRouter);
Vue.config.devtools = true;
const router = new VueRouter({routes, mode: 'history'})

let app = new Vue({
    el: '#app',
    data: { name: 'Vue DI Template'},
    template: `
    <div>
        <app-component />
    </div>
    `,
    router
});
```

<br/>notice that normally, when using the standard [vue-loader](https://www.npmjs.com/package/vue-loader) and [ts-loader](https://www.npmjs.com/package/ts-loader), the above setup would not work.<br/>

The `main.ts` file does no **imports** for the **SFC** defined in the `components/` sub-directory.  Therfore, webpack has no way to know that it needs to pull the `app.component.vue` and the `form.component.vue` files and inject them in its process.<br/>

However, thanks to the capabilities introduced by [vu-di-kit](https://www.npmjs.com/package/vue-di-kit) and **vue-di-loader**, the necessary injections are done during webpack compilation.<br/>

The **vue-di-loader** can be instructed to search for all the **SFC** in the `components/` sub-directory and inject them into the chunk pulled from `main.ts` before passing to [ts-loader](https://www.npmjs.com/package/ts-loader) for transpilation.<br/>

Hence the chunk coming from **vue-di-loader** to [ts-loader](https://www.npmjs.com/package/ts-loader) will look as follows:<br/>
```typescript
import Vue from "vue";
import { routes } from "vue-di-kit";
import VueRouter from "vue-router";
import AppComponent from "./components/app.component.vue";
import FormComponent from "./components/form.component.vue";

Vue.use(VueRouter);
Vue.config.devtools = true;
const router = new VueRouter({routes, mode: 'history'})

let app = new Vue({
    el: '#app',
    data: { name: 'Vue DI Template'},
    template: `
    <div>
        <app-component />
    </div>
    `,
    router
    ,
    components: {
        'app-component': AppComponent,
        'form-component': FormComponent
    }
});
```

<br/>as can be seen from above, **vue-di-loader** has imported both single file components, and added them into the existing **Vue** object construction.<br/>
The [vu-di-kit](https://www.npmjs.com/package/vue-di-kit) framework kicks in after transpilation to javascript.  The `@Component` decorator will transform the classes defined in the SFC files into actual **Vue** components.   The `@Routing` decorators will inject route definitions into global `routes` array in the [vu-di-kit](https://www.npmjs.com/package/vue-di-kit) module<br/><br/>

### NOTES:
**01)** **vue-di-loader** can transpile **SFC** components (`.vue` files) by itself, so it does not require [vue-loader](https://www.npmjs.com/package/vue-loader).<br/>

**02)** At present, **vue-di-loader** does not transpile `.ts` files into javascript.  It only intercepts whatever is specified as a webpack entry and checks to see if there are any construction of **Vue** objects.  If those conditions are met, it will inject all the **SFC** components it is referred to into the typescript chunk being sent to [ts-loader](https://www.npmjs.com/package/ts-loader).  In the future, **vue-di-loader** may support transpiling `.ts` files by itself.<br/>

**03)** The **vue-di-loader** module has defined a webpack plugin `VueDIPlugin` that can be used to specify which directories or files to search for **SFC** components to inject into the webpack entry.<br/><br/>

## Usage
The typicall webpack config will  look as follows
```javascript
const {resolve, join} = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueDIPlugin } = require('vue-di-loader');

module.exports = {
  entry: './src/main.ts',
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
        options: {
          loaders: {
            'scss': 'style-loader!css-loader!sass-loader',
            'sass': 'style-loader!css-loader!sass-loader?indentedSyntax'
          }
        }
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/],
            }
          },
          {
            loader: 'vue-di-loader',
            options: {}
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'assets/images/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.scss$/,
        use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
            { 
                loader: 'sass-loader',
                options: {
                    includePaths: [ resolve('assets/scss') ]
                } 
            }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
        title: 'Vue DI Template',
        filename: 'index.html',
        inject: 'body',
        path: resolve('dist'),
        publicPath: '/',
        template: resolve('./src/main.html')
    }),
    new VueDIPlugin({
      debug: false,
      components: {
        deep: true,
        path: resolve('./src/components')
      },
      loaders: {
          file: {
              path: resolve('./assets/images')
          },
          sass: {
              path: resolve('./assets/scss')
          }
      }
    })
  ],
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
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

The `VueDIPlugin` is primarily used to identify the directory (or files) of the **SFC** to inject into the entry.
```javascript
new VueDIPlugin({
    // enables or disables debug logs during compilation process
    debug: false,
    components: {
        /* takes a string or an array of strings.  The property can be used to direct the vue-di-loader where 
        to inject the SFC imports should the developer desire different typescript files than the one specified 
        in the webpack entry option. */
        entry: undefined, 

        /* if path is a directory, then this instructs the plugin to check sub directories for 
        single file components.*/
        deep: true,
        
        /* The path or paths to search for SFC.  can be a string or an array of strings. 
        it is recommended to use the resolve function from the path library.*/
        path: resolve('./src/components')
    },
    // configure vue-di-loader to inject imports in support of other loaders
    loaders: {
        // configure vue-di-loader to inject imports in support of the webpack file-loader
        file: {
            /* instruct vue-di-loader to inject import statements for all files specified under the directory path
             into the chunk emitted from the entry ts file.*/
            path: resolve('./assets/images')
        },
        // configure vue-di-loader on how to facilitate the processing of the contents of the <script> tag in the vue files.
        sass: {
            /* instruct vue-di-loader to include scss files found in the directories specified below */
            path: [resolve('./assets/scss')]
        }
    }
})
```
<br/>Note that it is not mandatory to use the `VueDIPlugin`.  The developer is always free to put the imports and the component injection in his/her code.  This may be preferrable if multiple `Vue` instances are used in the web app.  In the future the `VueDIPlugin` and `vue-di-loader` may be updated to target specific `Vue` instances for injection.<br/><br/>

**NOTES**<br/>

**Component Decorator Usage**<br/>
When using the `@Component` decorator with options, `vue-di-loader` check to see if the `name` property is specified.<br/>
```typescript
@Component({name: 'pic'})
export default class PictureComponent extends Vue { ... }
```
What ever is specified in the `name` property will be set as the component's tag name.  If the `name` property is not specified, then `vue-di-loader` will take the kebab format of the class name and set that as the component tag name ('`picture-component`' in the example above).<br/>

Be sure to use a string literal when assigning the name. The string literals can be in single quotes, double quotes and back ticks.<br/>
```typescript
@Component({name: 'component-name'})
// or
@Component({name: "component-name"})
// or
@Component({name: `component-name`})
```

passing in a variable as the name will **not** be picked up by `vue-di-loader`:
```typescript
let name = 'component-name'
@Component({name: name})
export default class PictureComponent extends Vue { ... }
```

<br/>passing in a formatted string expression as the name will **not** be recognized as an expression by `vue-di-loader`; and the expression itself will be passed in as the component name.
```typescript
@Component({name: `${service.getName('picture')}-component`})
export default class PictureComponent extends Vue { ... }
```
`vue-di-loader` uses an [Abstract Syntax Tree](https://www.npmjs.com/package/ts-simple-ast) to identify the `name` property in the `@Component` decorator option.  `vue-di-loader` can see the code, but it will not evaluate the code (like it would be done by the app during runtime).  Therefore, it can only extract string literals and inject them as the component name.<br/>

**Script Section in VUE file**<br/>
The `vue-di-loader` uses [node-sass](https://www.npmjs.com/package/node-sass) to process the contents between the `<script>` tag in the `.vue` file.  The `vue-di-loader` then instructs the component to inject the `<script>` tag into its main HTML element.<br/>
The `VueDIPlugin` provides a means to specify `scss` files to include during the processing of `<script>` tag; making it possible to use variables, that are defined in these external `scss` files, inside the `<script>` tag.

## Installation
Do the following steps to install **vue-di-loader**:
```
npm install vue-di-loader
```

## Authors
**01)** **Joseph Eniojukan** - [joejukan](https://github.com/joejukan)<br/>

## ChangeLog
[CHANGELOG.md](https://github.com/joejukan/vue-di-loader/blob/master/CHANGELOG.md) file for details

## License
This project is licensed under the ISC License - see the [LICENSE.md](https://github.com/joejukan/vue-di-loader/blob/master/LICENSE.md) file for details

Copyright 2018 Joseph Eniojukan

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.