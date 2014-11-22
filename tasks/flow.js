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

  grunt.registerMultiTask('flow', 'Flow type checking', function() {
    var options = this.options({
      configFile: '.',
      json: false
    });

    var callback = this.async();

    var args = ['flow', 'check', options.configFile];
    var opts = {};

    if (options.json) {
      args.push('--json');
    } else {
      opts.stdio = 'inherit';
    }

    flow.run(args, opts, function(err, output) {
      if (output) {
        grunt.log.writeln(JSON.stringify(output));
      }
      callback(err);
    });
  });

};
