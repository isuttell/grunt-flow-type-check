# grunt-flow-type-check

> Run Facebook's Flow static type checker

[![Build Status](http://img.shields.io/travis/isuttell/grunt-flow-type-check.svg?style=flat)](https://travis-ci.org/isuttell/grunt-flow-type-check)
[![Peer Dependencies](http://img.shields.io/david/peer/webcomponents/generator-element.svg?style=flat)](https://david-dm.org/isuttell/grunt-flow-type-check#info=peerDependencies)
[![npm downloads](http://img.shields.io/npm/dm/grunt-flow-type-check.svg?style=flat)](https://www.npmjs.org/package/grunt-flow-type-check)
[![npm release](http://img.shields.io/npm/v/grunt-flow-type-check.svg?style=flat)](https://www.npmjs.org/package/grunt-flow-type-check)

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-flow-type-check --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-flow-type-check');
```

## The "flow" task
_Run this task with the `grunt flow` command._

[Flow](http://flowtype.org) is a static type checker, designed to find type errors in JavaScript programs. Typed Flow code easily transforms down to regular JavaScript, so it runs anywhere.

This tasks requires Flow to be installed on your system. It's currently only available on OSX and linux. Detailed instructions can be found on the [Getting Started](http://flowtype.org/docs/getting-started.html) page. For OSX users, the fastest way to install is using [Brew](http://brew.sh).

```shell
brew update
brew install flow
```

### Overview
In your project's Gruntfile, add a section named `flow` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  flow: {
    app: {
      src: 'src/',            // `.flowconfig` folder
      options: {
        background: false,    // Watch/Server mode
        all: false,           // Check all files regardless
        lib: '',              // Library directory
        module: '',           // Module mode
        weak: false,          // Force weak check
        profile: false,       // Turn on profiling
        stripRoot: false,     // Display relative paths
        showAllErrors: false, // Show more than 50 errors
      }
    }
  }
});
```

### Options

#### src
Type: `String`
Default value: `.`

Default location of `.flowconfig`

#### options.weak
Type: `Boolean`
Default value: `false`

Use the weak option to check the files.

#### options.lib
Type: `String`
Default value: ``

Library folder. This can be defined here or in `flowconfig`.

#### options.showAllErrors
Type: `Boolean`
Default value: `false`

By default only the first 50 errors are shown. This will show all of them.

#### options.module
Type: `String`
Default value: ``

Module can either be `haste` or `node`.

#### options.profile
Type: `Boolean`
Default value: `false`

Provide some basic profiling information on each run.

#### options.all
Type: `Boolean`
Default value: `false`

Checks all files regardless of if they have `/* @flow */` at the top. Use this with care.

#### options.background
Type: `Boolean`
Default value: `false`

Run the Flow server in the background. This is used in conjunction with watch.

### Usage Examples

#### Basic
By default we check for `.flowconfig` in the root directory and then run `flow check`

```js
grunt.initConfig({
  flow: {
    app: {
      src: '.',
      options: {
        background: false,
        stripRoot: true,
        profile: true
      }
    }
  },
});
```

#### Watch
Running `flow check` each time can be slow. Alternatively, you can run the Flow server in the background and use [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch) to get any current errors when a files changes.

```js
grunt.initConfig({
  flow: {
    watch: {
      src: '.',
      options: {
        // Task-specific options go here.
        background: true
      }
    }
  },
  watch : {
      flow: {
        files: ['src/**/*.jsx'],
        tasks: ['flow:watch:status'] // Get the status from the server
      }
    }
});

// Run 'flow:watch:start' before the watch task to start the server
grunt.registerTask('watchFlow', ['flow:watch:start', 'watch']);
```

## Contributing
Please take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using 'grunt test'.

## Release History
* v0.3.0 - Added additional options
* v0.2.1 - Fixed incorrect paths
* v0.2.0 - Added watch support
* v0.1.0 - Initial Release
