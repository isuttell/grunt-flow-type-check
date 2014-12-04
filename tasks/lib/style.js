/*
 * grunt-flow-type-check
 * https://github.com/isuttell/grunt-flow-type-check
 *
 * Copyright (c) 2014 Isaac Suttell
 * Licensed under the MIT license.
 */

var colors = require('colors/safe');

module.exports = function(input, path) {
  if (!input || (input && typeof input.passed === 'undefined')) {
    return input;
  }

  // Success!
  if (input.passed === true) { return '0 Errors Found'; }

  // '.' indicates we're not running on a specific file
  if (path === '.') { path = void 0; }

  // Formatted string;
  var errors = [];

  // Loop through each error
  input.errors.forEach(function(error) {
    var descr;

    // File Path
    errors.push(colors.magenta(path || error.message[0].path) + ':');

    // Error Line/Position
    errors.push(colors.yellow(error.message[0].line.toString()) + ',');
    errors.push(colors.cyan(error.message[0].start.toString()) + ',');
    errors.push(colors.cyan(error.message[0].end.toString()) + ': ');

    // Error Message - Split so we can color multiple lines
    descr = error.message[0].descr.split('\n');
    descr.forEach(function(item) {
      errors.push(colors.red(item) + '\n');
    });

    // Some messages have a second line notifying where the error is
    if (error.message.length === 2) {
      errors.push('  ' + colors.green(path || error.message[1].path) + ':');

      errors.push(colors.yellow(error.message[1].line.toString()) + ',');
      errors.push(colors.cyan(error.message[1].start.toString()) + ',');
      errors.push(colors.cyan(error.message[1].end.toString()) + ': ');

      errors.push(colors.green(error.message[1].descr) + '\n');
    }

    errors.push('\n');
  });

  // Report How Many Errors
  errors.push('Found ' + input.errors.length + ' error');

  // Pluralize
  if (input.errors.length > 1) {
    errors.push('s');
  }

  return errors.join('');
};
