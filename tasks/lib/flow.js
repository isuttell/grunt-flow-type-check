/*
 * grunt-flow
 * https://github.com/isuttell/grunt-flow
 *
 * Copyright (c) 2014 Isaac Suttell
 * Licensed under the MIT license.
 */

'use strict';

exports.init = function(grunt) {

  exports.run = function(args, opts, done) {
    var child = grunt.util.spawn({
      cmd: args.shift(),
      args: args,
      opts: opts
    }, function (err, result, code) {
      var output = false;

      if (code === 127) {
        grunt.warn(
          'You need to have Flow installed ' +
          'and in your system PATH for this task to work. ' +
          'More info: https://github.com/isuttell/grunt-flow'
        );
      }

      // options.json === true
      if(args.indexOf('--json') > -1) {
        output = JSON.parse(result.stdout);
      }

      // Fail if we find errors
      if(code === 2) {
        return done(false, output);
      }

      return done(true, output);
    });
  }

  return exports;
};
