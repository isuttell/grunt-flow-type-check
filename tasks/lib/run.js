/*
 * grunt-flow-type-check
 * https://github.com/isuttell/grunt-flow-type-check
 *
 * Copyright (c) 2014 Isaac Suttell
 * Licensed under the MIT license.
 */

'use strict';

var NO_FLOW = 'You need to have Flow installed ' +
              'and in your system PATH for this task to work. ' +
              'More info: https://github.com/isuttell/grunt-flow-type-check';

var flow = require('flow-bin');

/**
 * Setups up grunt access
 *
 * @param     {Object}    grunt
 */
exports.init = function(grunt) {

  /**
   * Run the flow command
   *
   * @param     {Array}       args    Arguments to pass directly to Flow
   * @param     {Object}      opts    spawn process options
   * @param     {Object}      input   (optional) input to pass to child
   * @param     {Function}    done    Callback when done
   */
  exports.run = function(args, opts, input, done) {

    /**
     * Some errors we just need to alert the user, and some we need to fail
     *
     * @param     {String}    error    Error message
     * @param     {Number}    code     Exit Code
     */
    function reportErrors(error, code) {
      /* @covignore */
      if (code === 127) {
        // Code 127 means we can't find any version for flow that works
        grunt.warn(NO_FLOW);
      } else if (error && code === 0) {
        grunt.log.ok(error);
      } else if (error) {
        grunt.warn(error);
      }
    }

    // Spawn a child to run flow
    var child = grunt.util.spawn({
      cmd: flow,
      args: args,
      opts: opts
    }, function(err, result, code) {
      // If there are errors we need to report them
      reportErrors(result.stderr, code);

      // Grab and try to convert the result to an object
      var output = result.stdout || result.stderr;
      try {
        output = JSON.parse(output);
      } catch (e) {
        output = result.toString();
      }

      // Return the result
      if (code === 0) { // Code 0 means success
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

  return exports;
};
