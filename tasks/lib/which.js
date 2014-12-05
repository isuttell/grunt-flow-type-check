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
var COLON = ':';

function isExe(mod, uid, gid) {
  /* jshint ignore:start */
  /* @covignore */ // How to do we test for this?
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
      /* @covignore */ // How do we test for this?
      if (stat &&
          stat.isFile() &&
          isExe(stat.mode, stat.uid, stat.gid)) { return cur; }
    }
  }
  return false;
}

module.exports = which;
