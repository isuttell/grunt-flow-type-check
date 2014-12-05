/*
 * grunt-flow-type-check
 * https://github.com/isuttell/grunt-flow-type-check
 *
 * Copyright (c) 2014 Isaac Suttell
 * Licensed under the MIT license.
 */

'use strict';

var AVAILABLECOMMANDS = ['start', 'status', 'stop', 'check', 'single'];

// Yes or not arguments to flow
var BOOLEANARGS = {
  all: '--all',
  weak: '--weak',
  profile: '--profile', // Ignored since we're using json
  stripRoot: '--strip-root',
  showAllErrors: '--show-all-errors'
};

// Arguments that take input
var VARIABLEARGS = {
  'lib': '--lib',
  'module': '--module',
  'timeout': '--timeout',
  'retries': '--retries',
};

exports.init = function(grunt) {

  // Add the json flag
  function addJsonArg(args, options) {
    // Output to json so we can style it ourselves
    var jsonCommands = ['check', 'single', 'status', 'check-contents'];
    if (jsonCommands.indexOf(args[0]) > -1) {
      args.push('--json');
    }
    return args;
  }

  // Add additional options
  function addFlowArgs(args, options) {
    var i;
    // Commands to control the server
    var controlCommands = ['start', 'stop', 'check', 'single'];
    if (controlCommands.indexOf(args[0]) > -1) {
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
   * Looks for a valid version of a command. First checks the system for the
   * command and then checks if these is a binary in the repo
   *
   * @param     {String}    name    command to look for
   *
   * @return    {String}
   */
  function which(name) {
    var cmd = require('./which')(name);
    var os = require('os');

    // If not, try using the binary in the repo
    if (!cmd && (os.platform() === 'linux' || os.platform() === 'darwin')) {
      // Choose the binary for the platform
      cmd = 'bin/' + os.platform() + '/' + name;

      // Get the absolute path relative to the current folder
      cmd = require('path').resolve(__dirname + '/../../' + cmd);

      // Let the user now they should install it to the system instead of the repo
      grunt.log.error('NOTICE: This task is using a fallback version of Flow. ' +
        'Please install Flow in your system PATH. More info: ' +
        'https://github.com/isuttell/grunt-flow-type-check');
    } else if (!cmd) {
      // If all else fails just try running flow without a path
       /* @covignore */
      cmd = name;
    }

    return cmd;
  }

  /**
   * Run the flow command
   *
   * @param     {Array}       args    Arguments to pass directly to Flow
   * @param     {Object}      opts    spawn process options
   * @param     {Object}      input   (optional) input to pass to child
   * @param     {Function}    done    Callback when done
   */
  exports.run = function(args, opts, input, done) {
    // Is Flow installed on this system?
    var cmd = which('flow');

    // Inform us what we're running
    grunt.verbose.ok('Running ' + cmd + ' ' + args.join(' '));

    // Spawn a child to run flow
    var child = grunt.util.spawn({
      cmd: cmd,
      args: args,
      opts: opts
    }, function(err, result, code) {
      // By default we have no stdout, its pulled from stdio
      var output = false;

      // Report Errors
      /* @covignore */
      if (code === 2 && result.stderr) {
        grunt.warn(result.stderr);
      } else if (code === 0 && result.stderr) {
        grunt.log.ok(result.stderr);
      }

      // Grab and conver the result
      if ((code === 0 || code === 2) && result.stdout.length > 0) {
        output = result.stdout;
        // Conver to json
        if (grunt.util.kindOf(output) === 'string') { output = JSON.parse(output); }
      }

      // Code 127 means we can't find any version for flow that works
      if (code === 127) {
        /* @covignore */
        grunt.warn(
          'You need to have Flow installed ' +
          'and in your system PATH for this task to work. ' +
          'More info: https://github.com/isuttell/grunt-flow-type-check'
        );
      } else if (code === 0) { // Code 0 means success
        return done(true, output);
      } else { // Everything else means we've failed
        return done(false, output);
      }
    });

    // Pipe a single files contents to process
    if (typeof input === 'string') {
      child.stderr.pipe(process.stderr);
      child.stdin.write(input, 'UTF-8', function() {
        child.stdin.end();
      });
    }
  };

  // Setup the flow args
  exports.args = function(command, options, data) {
    var args = [];

    // Figure out what command to run
    if (AVAILABLECOMMANDS.indexOf(command) > -1) {
      args.push(command);
    } else {
      // Default to a basic full check
      args.push('check');
    }

    if (grunt.util.kindOf(data.src) === 'string') {
      // Where is `.flowconfig`
      args.push(data.src);
    } else if (grunt.util.kindOf(data.files) === 'object') {
      // Switch to single file mode
      args = ['check-contents'];
    }

    // Add arguments for commands that output json
    args = addJsonArg(args, options);

    // Add arguments for for flow commands
    args = addFlowArgs(args, options);

    return args;
  };

  return exports;
};
