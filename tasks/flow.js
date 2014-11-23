/*
 * grunt-flow-type-check
 * https://github.com/isuttell/grunt-flow-type-check
 *
 * Copyright (c) 2014 Isaac Suttell
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var flow = require('./lib/flow').init(grunt);

  grunt.registerMultiTask('flow', 'Facebook\'s Flow static type checking', function() {
    var options = this.options({
      configFile: '.',
      json: false,
      background: false
    });

    // This task is asynchronous
    var callback = this.async();

    // Default args and process options
    var args = [options.configFile];
    var opts = {
      stdio: 'inherit'
    };

    if (options.json) {
      // Enable json output - mostly for testing
      args.push('--json');
      delete opts.stdio;
    }

    // Watch tasks
    if (options.background === true) {
      var availableArgs = ['start', 'status', 'stop'];
      if (availableArgs.indexOf(this.args[0]) > -1) {
        args.push(this.args);
        args = [this.args, options.configFile];
        flow.run(args, opts, function(err, output) {
          if (err) {
            callback(err);
          }
        });
      }

      // When we catch CTRL+C kill the flow server
      process.on('SIGINT', function() {
        args.push('stop');
        flow.run(args, opts, function(err, output) {
          process.kill();
        });
      });

    } else {

      // By default we run a full check
      args = ['check', options.configFile];
      flow.run(args, opts, function(err, output) {
        if (output) {
          grunt.log.writeln(JSON.stringify(output));
        }
        callback(err);
      });
    }
  });

};
