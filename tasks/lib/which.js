/*
 * grunt-flow-type-check
 * https://github.com/isuttell/grunt-flow-type-check
 *
 * which
 * Based on https://github.com/isaacs/node-which
 *
 * Copyright (c) 2014 Isaac Suttell
 * Licensed under the MIT license.
 */

var path = require('path');
var fs = require('fs');
var path = require('path');
var os = require('os');
var COLON = ':';

function isExe(mod, uid, gid) {
  /* jshint ignore:start */
  /* @covignore */
  var ret = (mod & 0001) ||
            (mod & 0010) && process.getgid && gid === process.getgid() ||
            (mod & 0100) && process.getuid && uid === process.getuid();
  return ret;
  /* jshint ignore:end */
}

function absUnix(p) {
  return p.charAt(0) === '/' || p === '';
}

/**
 * Callback to a file in the repo
 *
 * @param     {String}    name    Command to look for
 *
 * @return    {Mixed}     String || false
 */
function fallack(name) {
  // We only store the flow binaries in the repo
  if (name !== 'flow') { return false; }

  // If not, try using the binary in the repo
  if (os.platform() === 'linux' || os.platform() === 'darwin') {
    // Choose the binary for the platform
    var cmd = 'bin/' + os.platform() + '/' + name;

    // Get the absolute path relative to the current folder
    return path.resolve(__dirname + '/../../' + cmd);
  } else {
    return false;
  }
}

/**
 * Sync Check if exe exsists in a users PATH
 *
 * @param  {String} cmd
 *
 * @return {String}     Absolute path
 */
function which(cmd) {
  if (absUnix(cmd)) { return cmd; }

  var pathEnv = (process.env.PATH || '').split(COLON);
  var pathExt = [''];

  for (var i = 0, l = pathEnv.length; i < l; i++) {
    var p = path.join(pathEnv[i], cmd);
    for (var j = 0, ll = pathExt.length; j < ll; j++) {
      var cur = p + pathExt[j];
      var stat;
      try {
        stat = fs.statSync(cur);
      } catch (ex) {}
      /* @covignore */
      if (stat &&
          stat.isFile() &&
          isExe(stat.mode, stat.uid, stat.gid)) { return cur; }
    }
  }

  return fallack(cmd);
}

module.exports = which;
