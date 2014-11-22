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

    // If not, and we're on mac use a version in the repo
    if(!cmd && os.platform() === 'darwin') {
      cmd = './bin/flow';
    } else if(!cmd) {
      cmd = 'flow';
    }

    var child = grunt.util.spawn({
      cmd: cmd,
      args: args,
      opts: opts
    }, function(err, result, code) {
      var output = false;

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
  }

  return exports;
};
