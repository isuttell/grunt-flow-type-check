'use strict';

// Setup
var grunt = require('grunt');
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
    var args = FlowArgs.make('check', options, data);
    // Assert
    test.equal(args.indexOf('check'), 0, 'The first argument should be check');
    test.equal(args.indexOf(data.src), args.length - 1, 'The location of the config should be next');
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
    var args = FlowArgs.make('status', options, data);

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
    var args = FlowArgs.make('status', options, data);

    // Assert
    test.equal(args.indexOf('check-contents'), 0, 'The first argument should be check-contents');
    test.notEqual(args.indexOf('--json'), -1, '--json arg should exist');
    test.equal(args.indexOf('--strip-root'), -1, '--strip-root arg should exist');
    test.equal(args.indexOf('--lib'), -1, '--lib arg should exist');
    test.done();
  },
  startCommand: function(test) {
    test.expect(4);

    var options = {
      lib: 'lib/',
    };
    var data = {
      src: '.'
    };

    // Generate
    var args = FlowArgs.make('start', options, data);

    // Assert
    test.equal(args.indexOf('start'), 0, 'The first argument should be start');
    test.equal(args.indexOf('--json'), -1, '--json arg should not exist');
    test.notEqual(args.indexOf('--lib'), -1, '--lib arg should exist');
    test.notEqual(args.indexOf(options.lib), -1, '--lib property should exist');
    test.done();
  },
  unknownCommand: function(test) {
    test.expect(1);

    var options = {
      lib: 'lib/',
      module: 'haste'
    };
    var data = {
      src: '.'
    };

    // Generate
    var args = FlowArgs.make('fake', options, data);

    // Assert
    test.equal(args.indexOf('check'), 0, 'It should default to check if we do not known the command');
    test.done();
  }

};
