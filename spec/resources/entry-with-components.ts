import Vue from "vue";
import VueRouter from "vue-router";
import { routes } from "vue-di-kit";
Vue.use(VueRouter);
let OneComponent = Vue;
let TwoComponent = Vue;
let ThreeComponent = Vue;
const router = new VueRouter({routes, mode: 'history'})
let components = {OneComponent, TwoComponent}

let app = new Vue({
    el: '#app',
    data: { name: 'Vue DI Template'},
    template: `
    <div>
        <app-component />
    </div>
    `,
    router,
    components: {
        ...components,
        ThreeComponent
    }
});