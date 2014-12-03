/*
 * grunt-flow-type-check
 * https://github.com/isuttell/grunt-flow-type-check
 *
 * Copyright (c) 2014 Isaac Suttell
 * Licensed under the MIT license.
 */

'use strict';

exports.init = function(grunt) {

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
    if (typeof input === 'function' && typeof done === 'undefined') {
      done = input;
    } else {
      opts = {}; // Disable stdio inherit
    }

    // Is Flow installed on this system?
    for (var i = 0; i < args.length; i++) {
      if (args[i] === 'flow') {
        args[i] = which('flow');
        break;
      }
    }
    // Strip cmd from args array
    var cmd = args[0];
    args.splice(0, 1);

    // Inform us what we're running
    grunt.verbose.writeln('Running ' + cmd + ' ' + args.join(' '));

    // Spawn a child to run flow
    var child = grunt.util.spawn({
      cmd: cmd,
      args: args,
      opts: opts
    }, function(err, result, code) {
      // By default we have no stdout, its pulled from stdio
      var output = false;

      // Conver to json (options.json === true)
      if ((code === 0 || code === 2) && args.indexOf('--json') > -1) {
        output = JSON.parse(result.stdout);
      } else if ((code === 0 || code === 2) && typeof input === 'string') {
        output = result.stdout;
      }

      // Code 127 means we can't find any version for flow that works
      if (code === 127) {
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

  return exports;
};
