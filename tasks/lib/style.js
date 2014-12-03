/*
 * grunt-flow-type-check
 * https://github.com/isuttell/grunt-flow-type-check
 *
 * Copyright (c) 2014 Isaac Suttell
 * Licensed under the MIT license.
 */

var colors = require('colors/safe');

module.exports = function(input, path) {
  if (input.passed === true) {
    return '0 Errors Found';
  }
  if (path === '.') {
    path = void 0;
  }

  var errors = '';

  input.errors.forEach(function(error) {
    var descr;

    errors += colors.magenta(path || error.message[0].path) + ':';

    errors += colors.yellow(error.message[0].line.toString()) + ',';
    errors += colors.cyan(error.message[0].start.toString()) + ',';
    errors += colors.cyan(error.message[0].end.toString()) + ': ';

    // Split so we can color multiple lines
    descr = error.message[0].descr.split('\n');
    descr.forEach(function(item) {
      errors += colors.red(item) + '\n';
    });

    // Some messages have a second line notifying where the error is
    if (error.message.length === 2) {
      errors += '  ' + colors.green(path || error.message[1].path) + ':';

      errors += colors.yellow(error.message[1].line.toString()) + ',';
      errors += colors.cyan(error.message[1].start.toString()) + ',';
      errors += colors.cyan(error.message[1].end.toString()) + ': ';

      errors += colors.green(error.message[1].descr) + '\n';
    }

    errors += '\n';
  });

  errors += 'Found ' + input.errors.length + ' error';
  if (input.errors.length > 1) {
    errors += 's';
  }

  return errors;
};
