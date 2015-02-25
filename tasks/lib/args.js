/*
 * grunt-flow-type-check
 * https://github.com/isuttell/grunt-flow-type-check
 *
 * Copyright (c) 2014 Isaac Suttell
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Commands we accept by running grunt flow:start
 *
 * @type    {Array}
 */
var AVAILABLECOMMANDS = ['start', 'status', 'stop', 'check', 'single'];

/**
 * Flags that are boolean
 *
 * @type    {Object}
 */
var BOOLEANARGS = {
  all: '--all',
  weak: '--weak',
  profile: '--profile', // Ignored since we're using json
  stripRoot: '--strip-root',
  showAllErrors: '--show-all-errors'
};

/**
 * Flags that take input from task options
 *
 * @type    {Object}
 */
var VARIABLEARGS = {
  'lib': '--lib',
  'timeout': '--timeout',
  'retries': '--retries',
};

/**
 * Setups up grunt access
 *
 * @param     {Object}    grunt
 */
exports.init = function(grunt) {

  /**
   * Add the json arg for commands that accept it
   *
   * @param    {String}   cmd       Command to run
   * @param    {Array}    args      Current arguments
   */
  function addJsonArg(cmd, args) {
    // Output to json so we can style it ourselves
    var jsonCommands = ['check', 'single', 'status', 'check-contents'];
    if (jsonCommands.indexOf(cmd) > -1) {
      args.push('--json');
    }
    return args;
  }

  /**
   * Adds arguments for commands that accept them
   *
   * @param    {String}   cmd        Command to run
   * @param    {Array}    args       Current arguments
   * @param    {Object}   options    Grunt task options
   */
  function addFlowArgs(cmd, args, options) {
    var i;
    // Commands to control the server
    var controlCommands = ['start', 'stop', 'check', 'single'];
    if (controlCommands.indexOf(cmd) > -1) {
      // Check for positive boolean arguments
      for (i in BOOLEANARGS) {
        if (options.hasOwnProperty(i) && grunt.util.kindOf(options[i]) === 'boolean' && options[i]) {
          args.push(BOOLEANARGS[i]);
        }
      }

      // Check for arguments that take actual input
      for (i in VARIABLEARGS) {
        if (options.hasOwnProperty(i) && options[i].length > 0) {
          args.push('--' + i);
          args.push(options[i]);
        }
      }
    }
    return args;
  }

  /**
   * Generates the arguments for Flow
   *
   * @param     {String}    command    COMMAND
   * @param     {Object}    options    Grunt task options
   * @param     {Object}    data       this.data from task
   *
   * @return    {Array}
   */
  exports.make = function(command, options, data) {
    var args = [];

    // Figure out what command to run
    if (AVAILABLECOMMANDS.indexOf(command) > -1) {
      args.push(command);
    } else {
      // Default to a basic full check
      args.push('check');
    }

    // Add arguments for commands that output json
    args = addJsonArg(args[0], args, options);

    // Add arguments for for flow commands
    args = addFlowArgs(args[0], args, options);

    if (grunt.util.kindOf(data.src) === 'string') {
      // Where is `.flowconfig`
      args.push(data.src);
    } else if (grunt.util.kindOf(data.files) === 'object') {
      // Switch to single file mode
      args = ['check-contents', '--json'];
    }

    return args;
  };

  return exports;
};
