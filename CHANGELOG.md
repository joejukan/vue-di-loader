# Changelog
All notable changes to this project will be documented in this file.<br/>
The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).<br/><br/>

## [0.0.7] - 2018-07-02
* updated readme documentation to provide details on functionality and usage.
* added `ASTParser` class.
* added logging functionality on `ASTClass`.
* added logging functionality on `VueDIPlugin`.

## [0.0.6] - 2018-07-02
* updated root index definition type to point to `./lib/loader`.
* updated `package.json` moving `vue-di-kit` from dev dependency to a regular dependency.
* added `VueDIPlugin` class to be used to scan all SFC files and pitch them beforehand.
* updated webpack loader to support only `.vue` files and `.ts` files specified as the application entry.
* updated `ASTClass` with the `inject` function that injects pitched components into the entry application.
* updated `DependencyClass` vue file regex and added a constructor that accepts no arguments. 
* addded simple unit test for plugin.
* added `env.js` helper script to set system environment variable.
* update `ASTClass`to add try and catch case over the organizeImports command method.

## [0.0.5] - 2018-07-01
* added support for default imports.
* upgraded `vue-di-kit` to version `0.0.4`.
* added `@types/webpack` version `4.4.4` to package.json.
* added `VueDIPlugin` class.
* added `PluginOptions` interface.

## [0.0.4] - 2018-06-28
* updated webpack loader name to `vue-di-loader`, allowing webpack to properly identify the loader.
* updated `loader.ts` to export pitch function, allowing webpack to detect the pitch function.
* updated `package.json` main field to point to `loader.js`, allowing webpack to point to the loader function.
* updated `ASTClass` pitch function so that `Component` decorators without a parameter will not through a null exception.

## [0.0.3] - 2018-06-27
* fixed webpack loader name.

## [0.0.2] - 2018-06-27
* upgraded [vue-di-kit](https://www.npmjs.com/package/vue-di-kit) to version `0.0.3`

## [0.0.1] - 2018-06-26
* initial release