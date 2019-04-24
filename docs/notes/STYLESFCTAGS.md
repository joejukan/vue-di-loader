# SFC Style Tags
The `vue-di-loader` uses [lib-sass](https://www.npmjs.com/package/lib-sass) to process the contents between the `<style>` tag in the `.vue` file.  The `vue-di-loader` then instructs the component to inject the `<style>` tag into the component's root HTML element.<br/>Note that `Shadow DOM` is not yet supported by `vue-di-loader`.<br/><br/>
The `VueDIPlugin` provides a means to specify `scss` files to include during the processing of `<style>` tag; making it possible to import variables, that are defined in these external `scss` files, inside the `<style>` tag.<br/>
```html
<style>
@import './assets/scss/variable.scss';
.container {
    background-color: $primary;
}
</style>
```

Note that scoped styles `<style scoped>` is not yet supported in the `vue-di-loader`.