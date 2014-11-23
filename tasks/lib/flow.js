/*
 * grunt-flow-type-check
 * https://github.com/isuttell/grunt-flow-type-check
 *
 * Copyright (c) 2014 Isaac Suttell
 * Licensed under the MIT license.
 */

'use strict';

var os = require('os');
var which = require('./which');

exports.init = function(grunt) {

  exports.run = function(args, opts, done) {
    // Is Flow installed?
    var cmd = which('flow');

    // If not, try using the binary in the repo
    if (!cmd && os.platform() === 'linux') {
      cmd = './bin/linux/flow';
    } else if (!cmd && os.platform() === 'darwin') {
      cmd = './bin/osx/flow';
    } else if (!cmd) {
      cmd = 'flow';
    }

    // Inform us what we're running
    grunt.verbose.writeln('Running ' + cmd + ' ' + args.join(' '));

    // Spawn a child to run flow
    grunt.util.spawn({
      cmd: cmd,
      args: args,
      opts: opts
    }, function(err, result, code) {
      // By default we have no stdout, its pulled from stdio
      var output = false;

      // Code 127 means we can't find any version for flow that works
      if (code === 127) {
        grunt.warn(
          'You need to have Flow installed ' +
          'and in your system PATH for this task to work. ' +
          'More info: https://github.com/isuttell/grunt-flow-type-check'
        );
      }

      // options.json === true
      if (args.indexOf('--json') > -1) {
        output = JSON.parse(result.stdout);
      }

      // Fail if we find errors
      if (code === 2) {
        return done(false, output);
      }

      return done(true, output);
    });
  };

  return exports;
};
