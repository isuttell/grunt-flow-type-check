/*
 * grunt-flow-type-check
 * https://github.com/isuttell/grunt-flow-type-check
 *
 * Copyright (c) 2014 Isaac Suttell
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Flow control library
  var flow = require('./lib/flow').init(grunt);

  grunt.registerMultiTask('flow', 'Facebook\'s Flow static type checking', function() {
    // Default options
    var options = this.options({
      configFile: '.',
      json: false,
      background: false
    });

    // This task is asynchronous
    var callback = this.async();

    // Default args and process options
    var args = [];
    var opts = {
      stdio: 'inherit'
    };

    // Figure out what command to run
    var commands = ['start', 'status', 'stop', 'check'];
    if (commands.indexOf(this.args[0]) > -1) {
      args.push(this.args);
    } else {
      // Default to a basic full check
      args.push('check');
    }

    // Where is `.flowconfig`
    args.push(options.configFile);

    // Enable json output - mostly for testing
    if (options.json) {
      args.push('--json');
      delete opts.stdio;
    }

    // Run it
    flow.run(args, opts, function(err, output) {
      if (output) {
        grunt.log.writeln(JSON.stringify(output));
      }
      callback(err);
    });

    // Stop the server
    if (options.background === true) {
      // When we catch CTRL+C kill the flow server
      process.on('SIGINT', function() {
        args.push('stop');
        flow.run(args, opts, function(err, output) {
          process.kill();
        });
      });
    }

  });

};
