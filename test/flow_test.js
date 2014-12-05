'use strict';

var grunt = require('grunt');
var flow = require(process.env.NODE_ENV === 'test' ? '../tasks-cov/lib/run' : '../tasks/lib/run').init(grunt);
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
  flowRun: function(test) {
    test.expect(3);

    var options = {};

    var data = {
      src: 'test/fixtures'
    };

    // Generate
    var args = flow.args('check', options, data);

    // Actually run Flow on two files
    flow.run(args, {}, void 0, function(err, result) {
      test.equal(result.passed, false, 'There will be failures');
      test.equal(result.errors.length, 1, 'There should be one failure');
      test.equal(typeof result, 'object', 'It should return an object');
      test.done();
    });
  },
  checkCommand: function(test) {
    test.expect(6);

    var options = {
      stripRoot: true,
      lib: 'lib/'
    };
    var data = {
      src: '.'
    };

    // Generate
    var args = flow.args('check', options, data);

    // Assert
    test.equal(args.indexOf('check'), 0, 'The first argument should be check');
    test.equal(args.indexOf(data.src), 1, 'The location of the config should be next');
    test.notEqual(args.indexOf('--json'), -1, '--json arg should exist');
    test.notEqual(args.indexOf('--strip-root'), -1, '--strip-root arg should exist');
    test.notEqual(args.indexOf('--lib'), -1, '--lib arg should exist');
    test.notEqual(args.indexOf(options.lib), -1, '--lib property should exist');
    test.done();
  },
  statusCommand: function(test) {
    test.expect(5);

    var options = {
      stripRoot: true,
      lib: 'lib/'
    };
    var data = {
      src: ''
    };

    // Generate
    var args = flow.args('status', options, data);

    // Assert
    test.equal(args.indexOf('status'), 0, 'The first argument should be status');
    test.notEqual(args.indexOf('--json'), -1, '--json arg should exist');
    test.equal(args.indexOf('--strip-root'), -1, '--strip-root arg should exist');
    test.equal(args.indexOf('--lib'), -1, '--lib arg should exist');
    test.equal(args.indexOf(options.lib), -1, '--lib property should exist');
    test.done();
  },
  checkContentsCommand: function(test) {
    test.expect(4);

    var options = {
      stripRoot: true,
      lib: 'lib/'
    };
    var data = {
      files: {
        src: ['']
      }
    };

    // Generate
    var args = flow.args('status', options, data);

    // Assert
    test.equal(args.indexOf('check-contents'), 0, 'The first argument should be check-contents');
    test.notEqual(args.indexOf('--json'), -1, '--json arg should exist');
    test.equal(args.indexOf('--strip-root'), -1, '--strip-root arg should exist');
    test.equal(args.indexOf('--lib'), -1, '--lib arg should exist');
    test.done();
  },
  startCommand: function(test) {
    test.expect(6);

    var options = {
      lib: 'lib/',
      module: 'haste'
    };
    var data = {
      src: '.'
    };

    // Generate
    var args = flow.args('start', options, data);

    // Assert
    test.equal(args.indexOf('start'), 0, 'The first argument should be start');
    test.equal(args.indexOf('--json'), -1, '--json arg should not exist');
    test.notEqual(args.indexOf('--lib'), -1, '--lib arg should exist');
    test.notEqual(args.indexOf(options.lib), -1, '--lib property should exist');
    test.notEqual(args.indexOf('--module'), -1, '--module arg should exist');
    test.notEqual(args.indexOf(options.module), -1, '--module property should exist');
    test.done();
  },
  styleCheck: function(test) {
    test.expect(2);

    var options = {};

    var data = {
      src: 'test/fixtures'
    };

    // Generate
    var args = flow.args('check', options, data);

    // Actually run Flow on two files
    flow.run(args, {}, void 0, function(err, result) {
      var formatted = style(result);
      test.equal(typeof result, 'object', 'The result should be an object');
      test.equal(typeof formatted, 'string', 'It should return a string');
      test.done();
    });
  },
  styleWithErrors: function(test) {
    test.expect(1);

    var result = {
      passed: false,
      errors: [{
        message: [{
          path: '-',
          line: 1,
          start: 2,
          end: 3,
          descr: 'Error Messages'
        }, {
          path: '-',
          line: 1,
          start: 2,
          end: 3,
          descr: 'Error Messages'
        }]
      }],
      version: ' Nov 27 2014 01:32:54'
    };

    var formatted = style(result);

    test.equal(typeof formatted, 'string', 'It should return a string');
    test.done();
  }

};
