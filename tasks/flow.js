 /*
 * grunt-flow-type-check
 * https://github.com/isuttell/grunt-flow-type-check
 *
 * Copyright (c) 2014 Isaac Suttell
 * Licensed under the MIT license.
 */

'use strict';

var style = require('./lib/style');
var async = require('async');

// Yes or not arguments to flow
var booleanArgs = {
  all: '--all',
  weak: '--weak',
  profile: '--profile', // Ignored since we're using json
  stripRoot: '--strip-root',
  showAllErrors: '--show-all-errors'
};

// Arguments that take input
var variableArgs = {
  'lib': '--lib',
  'module': '--module',
  'timeout': '--timeout',
  'retries': '--retries',
};

module.exports = function(grunt) {

  // Flow control library
  var flow = require('./lib/run').init(grunt);

  function addJsonArg(args, options) {
    // Output to json so we can style it ourselves
    var jsonCommands = ['check', 'single', 'status'];
    if (jsonCommands.indexOf(args[0]) > -1) {
      args.push('--json');
    }
    return args;
  }

  function addFlowArgs(args, options) {
    var i;
    // Commands to control the server
    var controlCommands = ['start', 'stop', 'check', 'single'];
    if (controlCommands.indexOf(args[0]) > -1) {
      // Check for positive boolean arguments
      for (i in booleanArgs) {
        if (options.hasOwnProperty(i) && grunt.util.kindOf(options[i]) === 'boolean' && options[i]) {
          args.push(booleanArgs[i]);
        }
      }

      // Check for arguments that take actual input
      for (i in variableArgs) {
        if (options.hasOwnProperty(i) && options[i].length > 0) {
          args.push('--' + i);
          args.push(options[i]);
        }
      }
    }
    return args;
  }

  grunt.registerMultiTask('flow', 'Facebook\'s Flow static type checking', function() {
    // Default options
    var options = this.options({
      lib: '',
      background: false,
      all: false,
      showAllErrors: false,
      timeout: -1,
      stripRoot: false,
      // profile: false,
      retries: -1,
      module: ''
    });

    // This task is asynchronous
    var callback = this.async();

    // Default args and process options
    var args = [];

    // Figure out what command to run
    var commands = ['start', 'status', 'stop', 'check', 'single'];
    if (commands.indexOf(this.args[0]) > -1) {
      args.push(this.args[0]);
    } else {
      // Default to a basic full check
      args.push('check');
    }

    // Where is `.flowconfig`
    if (grunt.util.kindOf(this.data.src) === 'string') {
      args.push(this.data.src);
    }

    // Add arguments for commands that output json
    args = addJsonArg(args, options);

    // Add arguments for for flow commands
    args = addFlowArgs(args, options);

    /**
     * Run the flow command either in loop or once
     *
     * @param     {Mixed}      filepath    Either a callback or path
     * @param     {Function}   done        Callback
     */
    function runFlow(filepath, done) {
      if (grunt.util.kindOf(filepath) === 'function') {
        done = filepath;
        filepath = void 0;
      }
      var contents;

      // If we have a file path read it and setup flow to ingest it
      if (filepath) {
        contents = grunt.file.read(filepath);
        // `flow check-contents` checks input from the stdin
        args = ['check-contents', '--json'];

        // Only option available
        if (options.showAllErrors === true) {
          args.push('--show-all-errors');
        }
      }

      // Run and pipe
      flow.run(args, {}, contents, function(err, output) {
        if (output === false || grunt.util.kindOf(output) !== 'object') {
          return done(err);
        }

        // Add subheads for any individual files
        if (filepath) {
          grunt.log.subhead('Results for ' + filepath);
        }

        // Format the json from Flow
        var formatted = style(output, filepath);

        // Log error/successes
        if (output.passed === false) {
          grunt.log.error(formatted + '\n');
          return done(false);
        } else if (output.passed === true) {
          grunt.log.ok(formatted + '\n');
          return done();
        }

        // Just complete is nothing else
        done();
      });
    }

    // If a file object is passed then manually check each file
    if (grunt.util.kindOf(this.data.files) === 'object') {
      // Cycle through each file
      async.eachSeries(this.filesSrc, runFlow, callback);
    } else if (grunt.util.kindOf(this.data.src) === 'string') {
      // Skip loop if we're running normally
      runFlow(callback);
    }

    // Stop the server
    if (options.background === true) {
      // When we catch CTRL+C kill the flow server
      process.on('SIGINT', function() {
        args = ['stop'];
        flow.run(args, {}, void 0, function(err, output) {
          process.kill();
        });
      });
    }

  });

};
