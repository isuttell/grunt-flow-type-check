'use strict';

var grunt = require('grunt');
var flowLib = require('../tasks/lib/flow').init(grunt);
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
  json: function(test) {
    test.expect(2);

    var args = ['flow', 'check', 'test/fixtures', '--json'];
    var opts = {};

    flowLib.run(args, opts, void 0, function(err, result) {
      test.equal(result.passed, false, 'There will be failures');
      test.equal(result.errors.length, 1, 'There should be one failure');
      test.done();
    });
  }
};
