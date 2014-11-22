# grunt-flow-type-check

> Run Facebook's Flow static type checker

[![Build Status](http://img.shields.io/travis/isuttell/grunt-flow-type-check.svg?style=flat)](https://travis-ci.org/isuttell/grunt-flow-type-check)
[![Peer Dependencies](http://img.shields.io/david/peer/webcomponents/generator-element.svg?style=flat)](https://david-dm.org/isuttell/grunt-flow-type-check#info=peerDependencies)
[![Github Release](http://img.shields.io/github/release/isuttell/grunt-flow-type-check.svg?style=flat)](https://github.com/isuttell/grunt-flow-type-check/releases)

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
    options: {
      // Task-specific options go here.
      configFile: '.'
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.configFile
Type: `String`
Default value: `'.'`

The directory where `.flowconfig` is located.

### Usage Examples

#### Default Options
By default we check for `.flowconfig` in the root directory and then run `flow check`

```js
grunt.initConfig({
  flow: {
    options: {},
  },
});
```

#### Custom Options
In this example, `.flowconfig` is located in the `src/` directory of the project.

```js
grunt.initConfig({
  flow: {
    options: {
      src: 'src/'
    }
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* v0.1.0 - Initial Release
