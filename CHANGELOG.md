# Changelog
All notable changes to this project will be documented in this file.<br/>
The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).<br/><br/>

## [0.3.0] - 2018-10-01
* updated `package.json` to include the [vue-hot-reload-api](https://www.npmjs.com/package/vue-hot-reload-api) package.
* updated `Configuration` interface by adding a `hot` property.
* updated `ASTClass` class by adding the `injectVueHotReloadApi()` method to inject the vue hot reload api business logic.

## [0.2.0] - 2018-09-29
* updated `package.json` to include the [sass](https://www.npmjs.com/package/sass) package.

## [0.1.0] - 2018-07-17
* updated `README.md` to describe the `VueDIPlugin` options in detail.
* added [moment](https://www.npmjs.com/package/moment) dependency to `package.json`.
* added timestamp to logging.
* added data model (`Configuration` interface) for global `configuration` object.
* added regular expression mechanism to search for SFC references inside the `<template>` tags.
* updated css injection to use the vue `created`, `mounted` and `updated` lifecycle events to inject `<style>` tags into dom.

## [0.0.9] - 2018-07-15
* updated unit test helper to reflect class changes.

## [0.0.8] - 2018-07-15
* updated `README.md` to include documentation on how `vue-di-loader` supports `file-loader` and `node-sass` configuration.
* updated `package.json` to include the [node-sass](https://www.npmjs.com/package/node-sass) package.
* updated unit tests to include file imports and vue dependency injection from different directory levels.
* updated `VueDIPlugin` options to include properties for `file-loader` and `node-sass`.
* updated `VueDIPlugin` class to support imports for `file-loader` and to specify include paths for `node-sass`.
* updated `ASTClass` to support processing the contents of the `<script>` tag in the SFC files.
* updated `DependencyClass` to support a `type` field to distinguish between a `.vue` file dependency and a regular file dependency.
* added `DependencyType` enumeration that defines a `VUE` file type and `FILE` regular file type.
* added `sass` global variable that defines a `path` array string property.

## [0.0.7] - 2018-07-03
* updated readme documentation to provide details on functionality and usage.
* added `ASTParser` class.
* added logging functionality on `ASTClass`.
* added logging functionality on `VueDIPlugin`.
* added `TypeScript` keyword to `package.json`.
* updated loader unit tests to consider use case of setting name property on `@Component` decorator option.
* removed all `eval` function implementation on `ASTClass`.
* added `get` and `exists` methods on `ASTParser`.
* added not on `@Component` decorator usage on `README.md`.

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