# Changelog
All notable changes to this project will be documented in this file.<br/>
The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).<br/><br/>

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