/*
 * grunt-flow-type-check
 * https://github.com/isuttell/grunt-flow-type-check
 *
 * Copyright (c) 2014 Isaac Suttell
 * Licensed under the MIT license.
 */

'use strict';

var is = require('./lib/isType');

module.exports = function(grunt) {

  // Flow control library
  var flow = require('./lib/flow').init(grunt);

  grunt.registerMultiTask('flow', 'Facebook\'s Flow static type checking', function() {
    // Default options
    var options = this.options({
      lib: '',
      json: false,
      background: false,
      all: false,
      showAllErrors: false,
      timeout: -1,
      stripRoot: false,
      retries: -1,
      module: ''
    });

    var bg = !!options.background;

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
      args.push(this.args[0]);
    } else {
      // Default to a basic full check
      args.push('check');
    }

    // Where is `.flowconfig`
    args.push(this.filesSrc.join(' '));

    // Enable json output - mostly for testing
    if (is.typeBoolean(options.json) && options.json) {
      args.push('--json');
      delete opts.stdio;
    }

    var booleanArgs = {
      all: '--all',
      weak: '--weak',
      profile: '--profile',
      stripRoot: '--strip-root',
      showAllErrors: '--show-all-errors'
    };

    var variableArgs = {
      'lib' : '--lib',
      'module' : '--module',
      'timeout' : '--timeout',
      'retries' : '--retries',
    };

    var i;

    if (args[0] !== 'status') {
      // Check for positive boolean arguments
      for (i in booleanArgs) {
        if (options.hasOwnProperty(i) && is.typeBoolean(options[i]) && options[i]) {
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
        args = ['stop'];
        flow.run(args, opts, function(err, output) {
          process.kill();
        });
      });
    }

  });

};
