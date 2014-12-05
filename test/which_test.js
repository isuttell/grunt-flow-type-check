'use strict';

var grunt = require('grunt');
var which = require(process.env.NODE_ENV === 'test' ? '../tasks-cov/lib/which' : '../tasks/lib/which');
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
  whichAbs: function(test) {
    test.expect(1);
    var path = '/usr/local/bin/flow';
    test.equal(which(path), path, 'If the path is absolute then return it');
    test.done();
  },
  canNotFind: function(test) {
    test.expect(1);
    var path = 'this-is-a-fake-file';
    test.equal(which(path), false, 'It should return false for a cmd that does not exist');
    test.done();
  },
  canFind: function(test) {
    test.expect(1);
    var path = 'pwd';
    test.equal(which(path), '/bin/pwd', 'It should return the absolute path of a file');
    test.done();
  }

};
