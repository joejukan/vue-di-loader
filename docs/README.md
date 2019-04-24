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