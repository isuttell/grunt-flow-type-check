'use strict';

// Setup
var grunt = require('grunt');
var Flow = require(process.env.NODE_ENV === 'test' ? '../tasks-cov/lib/run' : '../tasks/lib/run').init(grunt);
var FlowArgs = require(process.env.NODE_ENV === 'test' ? '../tasks-cov/lib/args' : '../tasks/lib/args').init(grunt);
var style = require(process.env.NODE_ENV === 'test' ? '../tasks-cov/lib/style' : '../tasks/lib/style');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.flow = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  cmdCheck: function(test) {
    test.expect(2);

    var options = {};

    var data = {
      src: 'test/fixtures'
    };

    // Generate
    var args = FlowArgs.make('check', options, data);

    // Actually run Flow on two files
    Flow.run(args, {}, void 0, function(err, result) {
      var formatted = style(result);
      test.equal(typeof result, 'object', 'The result should be an object');
      test.equal(typeof formatted, 'string', 'It should return a string');
      test.done();
    });
  },
  badInput: function(test) {
    test.expect(1);

    var result = false;

    var formatted = style(result);

    test.equal(formatted, result, 'It should  return itself if it is not an object with a passed property');
    test.done();
  },
  success: function(test) {
    test.expect(2);

    var result = {
      passed: true,
      version: ' Nov 27 2014 01:32:54'
    };

    var formatted = style(result);

    test.equal(typeof formatted, 'string', 'It should return a string');
    test.equal(formatted, '0 Errors Found', 'It should a message with zero erros found');
    test.done();
  },
  withErrors: function(test) {
    test.expect(1);

    var result = {
      passed: false,
      errors: [{
        message: [{
          path: '-',
          line: 1,
          start: 2,
          end: 3,
          descr: 'Error Messages\nUndefined'
        }, {
          path: '-',
          line: 1,
          start: 2,
          end: 3,
          descr: 'Error Messages'
        }]
      }, {
        message: [{
          path: '-',
          line: 1,
          start: 2,
          end: 3,
          descr: 'Error Messages\nUndefined'
        }]
      }],
      version: ' Nov 27 2014 01:32:54'
    };

    var formatted = style(result, '.');

    test.equal(typeof formatted, 'string', 'It should return a string');
    test.done();
  }

};
