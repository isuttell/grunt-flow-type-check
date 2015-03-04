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

module.exports = function(grunt) {

  // Flow control library
  var Flow = require('./lib/run').init(grunt);
  var FlowArgs = require('./lib/args').init(grunt);

  grunt.registerMultiTask('flow', 'Facebook\'s Flow static type checking', function() {
    // Default options
    var options = this.options({
      lib: '',
      background: false,
      all: false,
      showAllErrors: false,
      timeout: -1,
      stripRoot: false,
      retries: -1,
      module: ''
    });

    // This task is asynchronous
    var callback = this.async();

    // Default args and process options
    var args = FlowArgs.make.call(this, this.args[0], options, this.data);

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
      }

      // Run and pipe
      Flow.run(args, {}, contents, function(err, output) {
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
        args = ['stop', this.data.src];
        Flow.run(args, {}, void 0, function(err, output) {
          process.kill(0);
        });
      }.bind(this));
    }

  });

};
