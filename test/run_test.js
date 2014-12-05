'use strict';

// Setup
var grunt = require('grunt');
var Flow = require(process.env.NODE_ENV === 'test' ? '../tasks-cov/lib/run' : '../tasks/lib/run').init(grunt);
var FlowArgs = require(process.env.NODE_ENV === 'test' ? '../tasks-cov/lib/args' : '../tasks/lib/args').init(grunt);

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
  runWithErrors: function(test) {
    test.expect(3);

    var options = {};

    var data = {
      src: 'test/fixtures'
    };

    // Generate
    var args = FlowArgs.make('check', options, data);

    // Actually run Flow on two files
    Flow.run(args, {}, void 0, function(err, result) {
      test.equal(result.passed, false, 'There will be failures');
      test.equal(result.errors.length, 1, 'There should be one failure');
      test.equal(typeof result, 'object', 'It should return an object');
      test.done();
    });
  },
  runCheckContentsCommandError: function(test) {
    test.expect(3);

    var options = {};

    var data = {
      files: {
        src: [require('path').resolve('./test/fixtures/typerror.jsx')]
      }
    };

    // Generate
    var args = FlowArgs.make('check-contents', options, data);
    args.push('test/fixtures');
    var content = grunt.file.read(data.files.src[0]);

    // Assert
    Flow.run(args, {}, content, function(err, result) {
      test.equal(result.passed, false, 'There will be failures');
      test.equal(result.errors.length, 1, 'There should be one failure');
      test.equal(typeof result, 'object', 'It should return an object');
      test.done();
    });
  },
  runCheckContentsCommandSuccess: function(test) {
    test.expect(2);

    var options = {};

    var data = {
      files: {
        src: [require('path').resolve('./test/fixtures/helloworld.jsx')]
      }
    };

    // Generate
    var args = FlowArgs.make('check-contents', options, data);
    args.push('test/fixtures');
    var content = grunt.file.read(data.files.src[0]);

    // Assert
    Flow.run(args, {}, content, function(err, result) {
      test.equal(result.passed, true, 'It should succeed');
      test.equal(typeof result, 'object', 'It should return an object');
      test.done();
    });
  }

};
