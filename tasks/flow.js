/*
 * grunt-flow
 * https://github.com/isuttell/grunt-flow
 *
 * Copyright (c) 2014 Isaac Suttell
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  function run(args, done) {
    var child = grunt.util.spawn({
      cmd: args.shift(),
      args: args,
      opts: { stdio :'inherit' }
    }, function (err, result, code) {
      if (code === 127) {
        grunt.warn(
          'You need to have Flow installed ' +
          'and in your system PATH for this task to work. ' +
          'More info: https://github.com/isuttell/grunt-flow'
        );
      }

      // Fail if we find errors
      if(code === 2) {
        return done(false);
      }

      done();
    });
  }

  grunt.registerMultiTask('flow', 'Flow type checking', function() {
    var options = this.options({
      configFile: '.'
    });
    var callback = this.async();

    run(['flow', 'check', options.configFile], function(err){
      callback(err);
    });
  });

};
