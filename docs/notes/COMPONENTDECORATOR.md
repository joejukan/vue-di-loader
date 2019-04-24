# Component Decorator Usage
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
`vue-di-loader` uses an [Abstract Syntax Tree](https://www.npmjs.com/package/ts-simple-ast) to identify the `name` property in the `@Component` decorator option.  `vue-di-loader` can see the code, but it will not evaluate the code (like it would be done by the app during runtime).  Therefore, it can only extract string literals and inject them as the component name.