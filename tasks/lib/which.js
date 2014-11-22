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

module.exports = which

var path = require("path");
var fs = require('fs');
var COLON = process.platform === "win32" ? ";" : ":";
var isExe;

if (process.platform == "win32") {
  // On windows, there is no good way to check that a file is executable
  isExe = function isExe() {
    return true
  }
} else {
  isExe = function isExe(mod, uid, gid) {
    //console.error(mod, uid, gid);
    //console.error("isExe?", (mod & 0111).toString(8))
    var ret = (mod & 0001) || (mod & 0010) && process.getgid && gid === process.getgid() || (mod & 0100) && process.getuid && uid === process.getuid()
      //console.error("isExe?", ret)
    return ret
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
  if (isAbsolute(cmd)) return cmd
  var pathEnv = (process.env.PATH || "").split(COLON),
    pathExt = [""]
  if (process.platform === "win32") {
    pathEnv.push(process.cwd())
    pathExt = (process.env.PATHEXT || ".EXE").split(COLON)
    if (cmd.indexOf(".") !== -1) pathExt.unshift("")
  }
  for (var i = 0, l = pathEnv.length; i < l; i++) {
    var p = path.join(pathEnv[i], cmd)
    for (var j = 0, ll = pathExt.length; j < ll; j++) {
      var cur = p + pathExt[j]
      var stat
      try {
        stat = fs.statSync(cur)
      } catch (ex) {}
      if (stat &&
        stat.isFile() &&
        isExe(stat.mode, stat.uid, stat.gid)) return cur
    }
  }
  return false;
}

var isAbsolute = process.platform === "win32" ? absWin : absUnix

function absWin(p) {
  if (absUnix(p)) return true
    // pull off the device/UNC bit from a windows path.
    // from node's lib/path.js
  var splitDeviceRe =
    /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?([\\\/])?/,
    result = splitDeviceRe.exec(p),
    device = result[1] || '',
    isUnc = device && device.charAt(1) !== ':',
    isAbsolute = !!result[2] || isUnc // UNC paths are always absolute

  return isAbsolute
}

function absUnix(p) {
  return p.charAt(0) === "/" || p === ""
}
