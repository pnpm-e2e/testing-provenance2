import { createRequire as _cr } from 'module';const require = _cr(import.meta.url); const __filename = import.meta.filename; const __dirname = import.meta.dirname
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target2) => (target2 = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target2, "default", { value: mod, enumerable: true }) : target2,
  mod
));

// ../../../.local/share/pnpm/store/v10/links/@/graceful-fs/4.2.11/8db7cc369562e535b7a2778a8c38da8f404d03f7114c8b3ba35122797f5c8722/node_modules/graceful-fs/polyfills.js
var require_polyfills = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/graceful-fs/4.2.11/8db7cc369562e535b7a2778a8c38da8f404d03f7114c8b3ba35122797f5c8722/node_modules/graceful-fs/polyfills.js"(exports, module) {
    var constants2 = __require("constants");
    var origCwd = process.cwd;
    var cwd = null;
    var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform;
    process.cwd = function() {
      if (!cwd)
        cwd = origCwd.call(process);
      return cwd;
    };
    try {
      process.cwd();
    } catch (er) {
    }
    if (typeof process.chdir === "function") {
      chdir = process.chdir;
      process.chdir = function(d) {
        cwd = null;
        chdir.call(process, d);
      };
      if (Object.setPrototypeOf) Object.setPrototypeOf(process.chdir, chdir);
    }
    var chdir;
    module.exports = patch;
    function patch(fs8) {
      if (constants2.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
        patchLchmod(fs8);
      }
      if (!fs8.lutimes) {
        patchLutimes(fs8);
      }
      fs8.chown = chownFix(fs8.chown);
      fs8.fchown = chownFix(fs8.fchown);
      fs8.lchown = chownFix(fs8.lchown);
      fs8.chmod = chmodFix(fs8.chmod);
      fs8.fchmod = chmodFix(fs8.fchmod);
      fs8.lchmod = chmodFix(fs8.lchmod);
      fs8.chownSync = chownFixSync(fs8.chownSync);
      fs8.fchownSync = chownFixSync(fs8.fchownSync);
      fs8.lchownSync = chownFixSync(fs8.lchownSync);
      fs8.chmodSync = chmodFixSync(fs8.chmodSync);
      fs8.fchmodSync = chmodFixSync(fs8.fchmodSync);
      fs8.lchmodSync = chmodFixSync(fs8.lchmodSync);
      fs8.stat = statFix(fs8.stat);
      fs8.fstat = statFix(fs8.fstat);
      fs8.lstat = statFix(fs8.lstat);
      fs8.statSync = statFixSync(fs8.statSync);
      fs8.fstatSync = statFixSync(fs8.fstatSync);
      fs8.lstatSync = statFixSync(fs8.lstatSync);
      if (fs8.chmod && !fs8.lchmod) {
        fs8.lchmod = function(path12, mode, cb) {
          if (cb) process.nextTick(cb);
        };
        fs8.lchmodSync = function() {
        };
      }
      if (fs8.chown && !fs8.lchown) {
        fs8.lchown = function(path12, uid, gid, cb) {
          if (cb) process.nextTick(cb);
        };
        fs8.lchownSync = function() {
        };
      }
      if (platform === "win32") {
        fs8.rename = typeof fs8.rename !== "function" ? fs8.rename : (function(fs$rename) {
          function rename(from, to, cb) {
            var start = Date.now();
            var backoff = 0;
            fs$rename(from, to, function CB(er) {
              if (er && (er.code === "EACCES" || er.code === "EPERM" || er.code === "EBUSY") && Date.now() - start < 6e4) {
                setTimeout(function() {
                  fs8.stat(to, function(stater, st) {
                    if (stater && stater.code === "ENOENT")
                      fs$rename(from, to, CB);
                    else
                      cb(er);
                  });
                }, backoff);
                if (backoff < 100)
                  backoff += 10;
                return;
              }
              if (cb) cb(er);
            });
          }
          if (Object.setPrototypeOf) Object.setPrototypeOf(rename, fs$rename);
          return rename;
        })(fs8.rename);
      }
      fs8.read = typeof fs8.read !== "function" ? fs8.read : (function(fs$read) {
        function read2(fd, buffer, offset, length, position3, callback_) {
          var callback;
          if (callback_ && typeof callback_ === "function") {
            var eagCounter = 0;
            callback = function(er, _, __) {
              if (er && er.code === "EAGAIN" && eagCounter < 10) {
                eagCounter++;
                return fs$read.call(fs8, fd, buffer, offset, length, position3, callback);
              }
              callback_.apply(this, arguments);
            };
          }
          return fs$read.call(fs8, fd, buffer, offset, length, position3, callback);
        }
        if (Object.setPrototypeOf) Object.setPrototypeOf(read2, fs$read);
        return read2;
      })(fs8.read);
      fs8.readSync = typeof fs8.readSync !== "function" ? fs8.readSync : /* @__PURE__ */ (function(fs$readSync) {
        return function(fd, buffer, offset, length, position3) {
          var eagCounter = 0;
          while (true) {
            try {
              return fs$readSync.call(fs8, fd, buffer, offset, length, position3);
            } catch (er) {
              if (er.code === "EAGAIN" && eagCounter < 10) {
                eagCounter++;
                continue;
              }
              throw er;
            }
          }
        };
      })(fs8.readSync);
      function patchLchmod(fs9) {
        fs9.lchmod = function(path12, mode, callback) {
          fs9.open(
            path12,
            constants2.O_WRONLY | constants2.O_SYMLINK,
            mode,
            function(err, fd) {
              if (err) {
                if (callback) callback(err);
                return;
              }
              fs9.fchmod(fd, mode, function(err2) {
                fs9.close(fd, function(err22) {
                  if (callback) callback(err2 || err22);
                });
              });
            }
          );
        };
        fs9.lchmodSync = function(path12, mode) {
          var fd = fs9.openSync(path12, constants2.O_WRONLY | constants2.O_SYMLINK, mode);
          var threw = true;
          var ret;
          try {
            ret = fs9.fchmodSync(fd, mode);
            threw = false;
          } finally {
            if (threw) {
              try {
                fs9.closeSync(fd);
              } catch (er) {
              }
            } else {
              fs9.closeSync(fd);
            }
          }
          return ret;
        };
      }
      function patchLutimes(fs9) {
        if (constants2.hasOwnProperty("O_SYMLINK") && fs9.futimes) {
          fs9.lutimes = function(path12, at, mt, cb) {
            fs9.open(path12, constants2.O_SYMLINK, function(er, fd) {
              if (er) {
                if (cb) cb(er);
                return;
              }
              fs9.futimes(fd, at, mt, function(er2) {
                fs9.close(fd, function(er22) {
                  if (cb) cb(er2 || er22);
                });
              });
            });
          };
          fs9.lutimesSync = function(path12, at, mt) {
            var fd = fs9.openSync(path12, constants2.O_SYMLINK);
            var ret;
            var threw = true;
            try {
              ret = fs9.futimesSync(fd, at, mt);
              threw = false;
            } finally {
              if (threw) {
                try {
                  fs9.closeSync(fd);
                } catch (er) {
                }
              } else {
                fs9.closeSync(fd);
              }
            }
            return ret;
          };
        } else if (fs9.futimes) {
          fs9.lutimes = function(_a, _b, _c, cb) {
            if (cb) process.nextTick(cb);
          };
          fs9.lutimesSync = function() {
          };
        }
      }
      function chmodFix(orig) {
        if (!orig) return orig;
        return function(target2, mode, cb) {
          return orig.call(fs8, target2, mode, function(er) {
            if (chownErOk(er)) er = null;
            if (cb) cb.apply(this, arguments);
          });
        };
      }
      function chmodFixSync(orig) {
        if (!orig) return orig;
        return function(target2, mode) {
          try {
            return orig.call(fs8, target2, mode);
          } catch (er) {
            if (!chownErOk(er)) throw er;
          }
        };
      }
      function chownFix(orig) {
        if (!orig) return orig;
        return function(target2, uid, gid, cb) {
          return orig.call(fs8, target2, uid, gid, function(er) {
            if (chownErOk(er)) er = null;
            if (cb) cb.apply(this, arguments);
          });
        };
      }
      function chownFixSync(orig) {
        if (!orig) return orig;
        return function(target2, uid, gid) {
          try {
            return orig.call(fs8, target2, uid, gid);
          } catch (er) {
            if (!chownErOk(er)) throw er;
          }
        };
      }
      function statFix(orig) {
        if (!orig) return orig;
        return function(target2, options, cb) {
          if (typeof options === "function") {
            cb = options;
            options = null;
          }
          function callback(er, stats) {
            if (stats) {
              if (stats.uid < 0) stats.uid += 4294967296;
              if (stats.gid < 0) stats.gid += 4294967296;
            }
            if (cb) cb.apply(this, arguments);
          }
          return options ? orig.call(fs8, target2, options, callback) : orig.call(fs8, target2, callback);
        };
      }
      function statFixSync(orig) {
        if (!orig) return orig;
        return function(target2, options) {
          var stats = options ? orig.call(fs8, target2, options) : orig.call(fs8, target2);
          if (stats) {
            if (stats.uid < 0) stats.uid += 4294967296;
            if (stats.gid < 0) stats.gid += 4294967296;
          }
          return stats;
        };
      }
      function chownErOk(er) {
        if (!er)
          return true;
        if (er.code === "ENOSYS")
          return true;
        var nonroot = !process.getuid || process.getuid() !== 0;
        if (nonroot) {
          if (er.code === "EINVAL" || er.code === "EPERM")
            return true;
        }
        return false;
      }
    }
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/graceful-fs/4.2.11/8db7cc369562e535b7a2778a8c38da8f404d03f7114c8b3ba35122797f5c8722/node_modules/graceful-fs/legacy-streams.js
var require_legacy_streams = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/graceful-fs/4.2.11/8db7cc369562e535b7a2778a8c38da8f404d03f7114c8b3ba35122797f5c8722/node_modules/graceful-fs/legacy-streams.js"(exports, module) {
    var Stream = __require("stream").Stream;
    module.exports = legacy;
    function legacy(fs8) {
      return {
        ReadStream,
        WriteStream
      };
      function ReadStream(path12, options) {
        if (!(this instanceof ReadStream)) return new ReadStream(path12, options);
        Stream.call(this);
        var self2 = this;
        this.path = path12;
        this.fd = null;
        this.readable = true;
        this.paused = false;
        this.flags = "r";
        this.mode = 438;
        this.bufferSize = 64 * 1024;
        options = options || {};
        var keys = Object.keys(options);
        for (var index = 0, length = keys.length; index < length; index++) {
          var key = keys[index];
          this[key] = options[key];
        }
        if (this.encoding) this.setEncoding(this.encoding);
        if (this.start !== void 0) {
          if ("number" !== typeof this.start) {
            throw TypeError("start must be a Number");
          }
          if (this.end === void 0) {
            this.end = Infinity;
          } else if ("number" !== typeof this.end) {
            throw TypeError("end must be a Number");
          }
          if (this.start > this.end) {
            throw new Error("start must be <= end");
          }
          this.pos = this.start;
        }
        if (this.fd !== null) {
          process.nextTick(function() {
            self2._read();
          });
          return;
        }
        fs8.open(this.path, this.flags, this.mode, function(err, fd) {
          if (err) {
            self2.emit("error", err);
            self2.readable = false;
            return;
          }
          self2.fd = fd;
          self2.emit("open", fd);
          self2._read();
        });
      }
      function WriteStream(path12, options) {
        if (!(this instanceof WriteStream)) return new WriteStream(path12, options);
        Stream.call(this);
        this.path = path12;
        this.fd = null;
        this.writable = true;
        this.flags = "w";
        this.encoding = "binary";
        this.mode = 438;
        this.bytesWritten = 0;
        options = options || {};
        var keys = Object.keys(options);
        for (var index = 0, length = keys.length; index < length; index++) {
          var key = keys[index];
          this[key] = options[key];
        }
        if (this.start !== void 0) {
          if ("number" !== typeof this.start) {
            throw TypeError("start must be a Number");
          }
          if (this.start < 0) {
            throw new Error("start must be >= zero");
          }
          this.pos = this.start;
        }
        this.busy = false;
        this._queue = [];
        if (this.fd === null) {
          this._open = fs8.open;
          this._queue.push([this._open, this.path, this.flags, this.mode, void 0]);
          this.flush();
        }
      }
    }
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/graceful-fs/4.2.11/8db7cc369562e535b7a2778a8c38da8f404d03f7114c8b3ba35122797f5c8722/node_modules/graceful-fs/clone.js
var require_clone = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/graceful-fs/4.2.11/8db7cc369562e535b7a2778a8c38da8f404d03f7114c8b3ba35122797f5c8722/node_modules/graceful-fs/clone.js"(exports, module) {
    "use strict";
    module.exports = clone;
    var getPrototypeOf = Object.getPrototypeOf || function(obj) {
      return obj.__proto__;
    };
    function clone(obj) {
      if (obj === null || typeof obj !== "object")
        return obj;
      if (obj instanceof Object)
        var copy = { __proto__: getPrototypeOf(obj) };
      else
        var copy = /* @__PURE__ */ Object.create(null);
      Object.getOwnPropertyNames(obj).forEach(function(key) {
        Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key));
      });
      return copy;
    }
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/graceful-fs/4.2.11/8db7cc369562e535b7a2778a8c38da8f404d03f7114c8b3ba35122797f5c8722/node_modules/graceful-fs/graceful-fs.js
var require_graceful_fs = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/graceful-fs/4.2.11/8db7cc369562e535b7a2778a8c38da8f404d03f7114c8b3ba35122797f5c8722/node_modules/graceful-fs/graceful-fs.js"(exports, module) {
    var fs8 = __require("fs");
    var polyfills = require_polyfills();
    var legacy = require_legacy_streams();
    var clone = require_clone();
    var util8 = __require("util");
    var gracefulQueue;
    var previousSymbol;
    if (typeof Symbol === "function" && typeof Symbol.for === "function") {
      gracefulQueue = Symbol.for("graceful-fs.queue");
      previousSymbol = Symbol.for("graceful-fs.previous");
    } else {
      gracefulQueue = "___graceful-fs.queue";
      previousSymbol = "___graceful-fs.previous";
    }
    function noop() {
    }
    function publishQueue(context, queue2) {
      Object.defineProperty(context, gracefulQueue, {
        get: function() {
          return queue2;
        }
      });
    }
    var debug = noop;
    if (util8.debuglog)
      debug = util8.debuglog("gfs4");
    else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ""))
      debug = function() {
        var m = util8.format.apply(util8, arguments);
        m = "GFS4: " + m.split(/\n/).join("\nGFS4: ");
        console.error(m);
      };
    if (!fs8[gracefulQueue]) {
      queue = global[gracefulQueue] || [];
      publishQueue(fs8, queue);
      fs8.close = (function(fs$close) {
        function close(fd, cb) {
          return fs$close.call(fs8, fd, function(err) {
            if (!err) {
              resetQueue();
            }
            if (typeof cb === "function")
              cb.apply(this, arguments);
          });
        }
        Object.defineProperty(close, previousSymbol, {
          value: fs$close
        });
        return close;
      })(fs8.close);
      fs8.closeSync = (function(fs$closeSync) {
        function closeSync(fd) {
          fs$closeSync.apply(fs8, arguments);
          resetQueue();
        }
        Object.defineProperty(closeSync, previousSymbol, {
          value: fs$closeSync
        });
        return closeSync;
      })(fs8.closeSync);
      if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) {
        process.on("exit", function() {
          debug(fs8[gracefulQueue]);
          __require("assert").equal(fs8[gracefulQueue].length, 0);
        });
      }
    }
    var queue;
    if (!global[gracefulQueue]) {
      publishQueue(global, fs8[gracefulQueue]);
    }
    module.exports = patch(clone(fs8));
    if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs8.__patched) {
      module.exports = patch(fs8);
      fs8.__patched = true;
    }
    function patch(fs9) {
      polyfills(fs9);
      fs9.gracefulify = patch;
      fs9.createReadStream = createReadStream;
      fs9.createWriteStream = createWriteStream;
      var fs$readFile = fs9.readFile;
      fs9.readFile = readFile;
      function readFile(path12, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$readFile(path12, options, cb);
        function go$readFile(path13, options2, cb2, startTime) {
          return fs$readFile(path13, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$readFile, [path13, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$writeFile = fs9.writeFile;
      fs9.writeFile = writeFile2;
      function writeFile2(path12, data, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$writeFile(path12, data, options, cb);
        function go$writeFile(path13, data2, options2, cb2, startTime) {
          return fs$writeFile(path13, data2, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$writeFile, [path13, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$appendFile = fs9.appendFile;
      if (fs$appendFile)
        fs9.appendFile = appendFile;
      function appendFile(path12, data, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$appendFile(path12, data, options, cb);
        function go$appendFile(path13, data2, options2, cb2, startTime) {
          return fs$appendFile(path13, data2, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$appendFile, [path13, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$copyFile = fs9.copyFile;
      if (fs$copyFile)
        fs9.copyFile = copyFile;
      function copyFile(src2, dest, flags, cb) {
        if (typeof flags === "function") {
          cb = flags;
          flags = 0;
        }
        return go$copyFile(src2, dest, flags, cb);
        function go$copyFile(src3, dest2, flags2, cb2, startTime) {
          return fs$copyFile(src3, dest2, flags2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE" || err.code === "EBUSY"))
              enqueue([go$copyFile, [src3, dest2, flags2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$readdir = fs9.readdir;
      fs9.readdir = readdir;
      var noReaddirOptionVersions = /^v[0-5]\./;
      function readdir(path12, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        var go$readdir = noReaddirOptionVersions.test(process.version) ? function go$readdir2(path13, options2, cb2, startTime) {
          return fs$readdir(path13, fs$readdirCallback(
            path13,
            options2,
            cb2,
            startTime
          ));
        } : function go$readdir2(path13, options2, cb2, startTime) {
          return fs$readdir(path13, options2, fs$readdirCallback(
            path13,
            options2,
            cb2,
            startTime
          ));
        };
        return go$readdir(path12, options, cb);
        function fs$readdirCallback(path13, options2, cb2, startTime) {
          return function(err, files) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([
                go$readdir,
                [path13, options2, cb2],
                err,
                startTime || Date.now(),
                Date.now()
              ]);
            else {
              if (files && files.sort)
                files.sort();
              if (typeof cb2 === "function")
                cb2.call(this, err, files);
            }
          };
        }
      }
      if (process.version.substr(0, 4) === "v0.8") {
        var legStreams = legacy(fs9);
        ReadStream = legStreams.ReadStream;
        WriteStream = legStreams.WriteStream;
      }
      var fs$ReadStream = fs9.ReadStream;
      if (fs$ReadStream) {
        ReadStream.prototype = Object.create(fs$ReadStream.prototype);
        ReadStream.prototype.open = ReadStream$open;
      }
      var fs$WriteStream = fs9.WriteStream;
      if (fs$WriteStream) {
        WriteStream.prototype = Object.create(fs$WriteStream.prototype);
        WriteStream.prototype.open = WriteStream$open;
      }
      Object.defineProperty(fs9, "ReadStream", {
        get: function() {
          return ReadStream;
        },
        set: function(val) {
          ReadStream = val;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(fs9, "WriteStream", {
        get: function() {
          return WriteStream;
        },
        set: function(val) {
          WriteStream = val;
        },
        enumerable: true,
        configurable: true
      });
      var FileReadStream = ReadStream;
      Object.defineProperty(fs9, "FileReadStream", {
        get: function() {
          return FileReadStream;
        },
        set: function(val) {
          FileReadStream = val;
        },
        enumerable: true,
        configurable: true
      });
      var FileWriteStream = WriteStream;
      Object.defineProperty(fs9, "FileWriteStream", {
        get: function() {
          return FileWriteStream;
        },
        set: function(val) {
          FileWriteStream = val;
        },
        enumerable: true,
        configurable: true
      });
      function ReadStream(path12, options) {
        if (this instanceof ReadStream)
          return fs$ReadStream.apply(this, arguments), this;
        else
          return ReadStream.apply(Object.create(ReadStream.prototype), arguments);
      }
      function ReadStream$open() {
        var that = this;
        open(that.path, that.flags, that.mode, function(err, fd) {
          if (err) {
            if (that.autoClose)
              that.destroy();
            that.emit("error", err);
          } else {
            that.fd = fd;
            that.emit("open", fd);
            that.read();
          }
        });
      }
      function WriteStream(path12, options) {
        if (this instanceof WriteStream)
          return fs$WriteStream.apply(this, arguments), this;
        else
          return WriteStream.apply(Object.create(WriteStream.prototype), arguments);
      }
      function WriteStream$open() {
        var that = this;
        open(that.path, that.flags, that.mode, function(err, fd) {
          if (err) {
            that.destroy();
            that.emit("error", err);
          } else {
            that.fd = fd;
            that.emit("open", fd);
          }
        });
      }
      function createReadStream(path12, options) {
        return new fs9.ReadStream(path12, options);
      }
      function createWriteStream(path12, options) {
        return new fs9.WriteStream(path12, options);
      }
      var fs$open = fs9.open;
      fs9.open = open;
      function open(path12, flags, mode, cb) {
        if (typeof mode === "function")
          cb = mode, mode = null;
        return go$open(path12, flags, mode, cb);
        function go$open(path13, flags2, mode2, cb2, startTime) {
          return fs$open(path13, flags2, mode2, function(err, fd) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$open, [path13, flags2, mode2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      return fs9;
    }
    function enqueue(elem) {
      debug("ENQUEUE", elem[0].name, elem[1]);
      fs8[gracefulQueue].push(elem);
      retry();
    }
    var retryTimer;
    function resetQueue() {
      var now = Date.now();
      for (var i = 0; i < fs8[gracefulQueue].length; ++i) {
        if (fs8[gracefulQueue][i].length > 2) {
          fs8[gracefulQueue][i][3] = now;
          fs8[gracefulQueue][i][4] = now;
        }
      }
      retry();
    }
    function retry() {
      clearTimeout(retryTimer);
      retryTimer = void 0;
      if (fs8[gracefulQueue].length === 0)
        return;
      var elem = fs8[gracefulQueue].shift();
      var fn = elem[0];
      var args = elem[1];
      var err = elem[2];
      var startTime = elem[3];
      var lastTime = elem[4];
      if (startTime === void 0) {
        debug("RETRY", fn.name, args);
        fn.apply(null, args);
      } else if (Date.now() - startTime >= 6e4) {
        debug("TIMEOUT", fn.name, args);
        var cb = args.pop();
        if (typeof cb === "function")
          cb.call(null, err);
      } else {
        var sinceAttempt = Date.now() - lastTime;
        var sinceStart = Math.max(lastTime - startTime, 1);
        var desiredDelay = Math.min(sinceStart * 1.2, 100);
        if (sinceAttempt >= desiredDelay) {
          debug("RETRY", fn.name, args);
          fn.apply(null, args.concat([startTime]));
        } else {
          fs8[gracefulQueue].push(elem);
        }
      }
      if (retryTimer === void 0) {
        retryTimer = setTimeout(retry, 0);
      }
    }
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/is-windows/1.0.2/d5223a19eb5dac5278fa78751b551fd5fbeb0f8260190d32413b619d962dde6a/node_modules/is-windows/index.js
var require_is_windows = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/is-windows/1.0.2/d5223a19eb5dac5278fa78751b551fd5fbeb0f8260190d32413b619d962dde6a/node_modules/is-windows/index.js"(exports, module) {
    (function(factory) {
      if (exports && typeof exports === "object" && typeof module !== "undefined") {
        module.exports = factory();
      } else if (typeof define === "function" && define.amd) {
        define([], factory);
      } else if (typeof window !== "undefined") {
        window.isWindows = factory();
      } else if (typeof global !== "undefined") {
        global.isWindows = factory();
      } else if (typeof self !== "undefined") {
        self.isWindows = factory();
      } else {
        this.isWindows = factory();
      }
    })(function() {
      "use strict";
      return function isWindows() {
        return process && (process.platform === "win32" || /^(msys|cygwin)$/.test(process.env.OSTYPE));
      };
    });
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/better-path-resolve/1.0.0/96b08496fdad88b2e4539b7f505c3c5155375197a32c1c94848b6531613fb411/node_modules/better-path-resolve/index.js
var require_better_path_resolve = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/better-path-resolve/1.0.0/96b08496fdad88b2e4539b7f505c3c5155375197a32c1c94848b6531613fb411/node_modules/better-path-resolve/index.js"(exports, module) {
    "use strict";
    var path12 = __require("path");
    var isWindows = require_is_windows();
    module.exports = isWindows() ? winResolve : path12.resolve;
    function winResolve(p) {
      if (arguments.length === 0) return path12.resolve();
      if (typeof p !== "string") {
        return path12.resolve(p);
      }
      if (p[1] === ":") {
        const cc = p[0].charCodeAt();
        if (cc < 65 || cc > 90) {
          p = `${p[0].toUpperCase()}${p.substr(1)}`;
        }
      }
      if (p.endsWith(":")) {
        return p;
      }
      return path12.resolve(p);
    }
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/is-subdir/1.2.0/c6cd34b26921febb158c1350e976adfca4f9ccbbdd80cc53b57f3b4b7973eb2a/node_modules/is-subdir/index.js
var require_is_subdir = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/is-subdir/1.2.0/c6cd34b26921febb158c1350e976adfca4f9ccbbdd80cc53b57f3b4b7973eb2a/node_modules/is-subdir/index.js"(exports, module) {
    "use strict";
    var betterPathResolve = require_better_path_resolve();
    var path12 = __require("path");
    function isSubdir2(parentDir, subdir) {
      const rParent = `${betterPathResolve(parentDir)}${path12.sep}`;
      const rDir = `${betterPathResolve(subdir)}${path12.sep}`;
      return rDir.startsWith(rParent);
    }
    isSubdir2.strict = function isSubdirStrict(parentDir, subdir) {
      const rParent = `${betterPathResolve(parentDir)}${path12.sep}`;
      const rDir = `${betterPathResolve(subdir)}${path12.sep}`;
      return rDir !== rParent && rDir.startsWith(rParent);
    };
    module.exports = isSubdir2;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/is-gzip/2.0.0/111e088164d6a6f662f7852ba097a6c8afd6ed11cf68c0e30fa542364bc3893b/node_modules/is-gzip/index.js
var require_is_gzip = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/is-gzip/2.0.0/111e088164d6a6f662f7852ba097a6c8afd6ed11cf68c0e30fa542364bc3893b/node_modules/is-gzip/index.js"(exports, module) {
    "use strict";
    module.exports = (buf) => {
      if (!buf || buf.length < 3) {
        return false;
      }
      return buf[0] === 31 && buf[1] === 139 && buf[2] === 8;
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@zkochan/rimraf/3.0.2/398b2b41d6f9114e89e70fa2db899a09968663b2af46dce191d228dbef5dfcda/node_modules/@zkochan/rimraf/index.js
var require_rimraf = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@zkochan/rimraf/3.0.2/398b2b41d6f9114e89e70fa2db899a09968663b2af46dce191d228dbef5dfcda/node_modules/@zkochan/rimraf/index.js"(exports, module) {
    var fs8 = __require("fs");
    module.exports = async (p) => {
      try {
        await fs8.promises.rm(p, { recursive: true, force: true, maxRetries: 3 });
      } catch (err) {
        if (err.code === "ENOENT") return;
        throw err;
      }
    };
    module.exports.sync = (p) => {
      try {
        fs8.rmSync(p, { recursive: true, force: true, maxRetries: 3 });
      } catch (err) {
        if (err.code === "ENOENT") return;
        throw err;
      }
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/universalify/2.0.1/c48ae9e17bc5bbd3fc1b38e794691240eb344463ac9f569f25561f0caa9617d5/node_modules/universalify/index.js
var require_universalify = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/universalify/2.0.1/c48ae9e17bc5bbd3fc1b38e794691240eb344463ac9f569f25561f0caa9617d5/node_modules/universalify/index.js"(exports) {
    "use strict";
    exports.fromCallback = function(fn) {
      return Object.defineProperty(function(...args) {
        if (typeof args[args.length - 1] === "function") fn.apply(this, args);
        else {
          return new Promise((resolve, reject) => {
            args.push((err, res) => err != null ? reject(err) : resolve(res));
            fn.apply(this, args);
          });
        }
      }, "name", { value: fn.name });
    };
    exports.fromPromise = function(fn) {
      return Object.defineProperty(function(...args) {
        const cb = args[args.length - 1];
        if (typeof cb !== "function") return fn.apply(this, args);
        else {
          args.pop();
          fn.apply(this, args).then((r) => cb(null, r), cb);
        }
      }, "name", { value: fn.name });
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/fs/index.js
var require_fs = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/fs/index.js"(exports) {
    "use strict";
    var u = require_universalify().fromCallback;
    var fs8 = require_graceful_fs();
    var api = [
      "access",
      "appendFile",
      "chmod",
      "chown",
      "close",
      "copyFile",
      "cp",
      "fchmod",
      "fchown",
      "fdatasync",
      "fstat",
      "fsync",
      "ftruncate",
      "futimes",
      "glob",
      "lchmod",
      "lchown",
      "lutimes",
      "link",
      "lstat",
      "mkdir",
      "mkdtemp",
      "open",
      "opendir",
      "readdir",
      "readFile",
      "readlink",
      "realpath",
      "rename",
      "rm",
      "rmdir",
      "stat",
      "statfs",
      "symlink",
      "truncate",
      "unlink",
      "utimes",
      "writeFile"
    ].filter((key) => {
      return typeof fs8[key] === "function";
    });
    Object.assign(exports, fs8);
    api.forEach((method) => {
      exports[method] = u(fs8[method]);
    });
    exports.exists = function(filename, callback) {
      if (typeof callback === "function") {
        return fs8.exists(filename, callback);
      }
      return new Promise((resolve) => {
        return fs8.exists(filename, resolve);
      });
    };
    exports.read = function(fd, buffer, offset, length, position3, callback) {
      if (typeof callback === "function") {
        return fs8.read(fd, buffer, offset, length, position3, callback);
      }
      return new Promise((resolve, reject) => {
        fs8.read(fd, buffer, offset, length, position3, (err, bytesRead, buffer2) => {
          if (err) return reject(err);
          resolve({ bytesRead, buffer: buffer2 });
        });
      });
    };
    exports.write = function(fd, buffer, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs8.write(fd, buffer, ...args);
      }
      return new Promise((resolve, reject) => {
        fs8.write(fd, buffer, ...args, (err, bytesWritten, buffer2) => {
          if (err) return reject(err);
          resolve({ bytesWritten, buffer: buffer2 });
        });
      });
    };
    exports.readv = function(fd, buffers, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs8.readv(fd, buffers, ...args);
      }
      return new Promise((resolve, reject) => {
        fs8.readv(fd, buffers, ...args, (err, bytesRead, buffers2) => {
          if (err) return reject(err);
          resolve({ bytesRead, buffers: buffers2 });
        });
      });
    };
    exports.writev = function(fd, buffers, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs8.writev(fd, buffers, ...args);
      }
      return new Promise((resolve, reject) => {
        fs8.writev(fd, buffers, ...args, (err, bytesWritten, buffers2) => {
          if (err) return reject(err);
          resolve({ bytesWritten, buffers: buffers2 });
        });
      });
    };
    if (typeof fs8.realpath.native === "function") {
      exports.realpath.native = u(fs8.realpath.native);
    } else {
      process.emitWarning(
        "fs.realpath.native is not a function. Is fs being monkey-patched?",
        "Warning",
        "fs-extra-WARN0003"
      );
    }
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/mkdirs/utils.js
var require_utils = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/mkdirs/utils.js"(exports, module) {
    "use strict";
    var path12 = __require("path");
    module.exports.checkPath = function checkPath(pth) {
      if (process.platform === "win32") {
        const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(pth.replace(path12.parse(pth).root, ""));
        if (pathHasInvalidWinCharacters) {
          const error = new Error(`Path contains invalid characters: ${pth}`);
          error.code = "EINVAL";
          throw error;
        }
      }
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/mkdirs/make-dir.js
var require_make_dir = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/mkdirs/make-dir.js"(exports, module) {
    "use strict";
    var fs8 = require_fs();
    var { checkPath } = require_utils();
    var getMode = (options) => {
      const defaults = { mode: 511 };
      if (typeof options === "number") return options;
      return { ...defaults, ...options }.mode;
    };
    module.exports.makeDir = async (dir, options) => {
      checkPath(dir);
      return fs8.mkdir(dir, {
        mode: getMode(options),
        recursive: true
      });
    };
    module.exports.makeDirSync = (dir, options) => {
      checkPath(dir);
      return fs8.mkdirSync(dir, {
        mode: getMode(options),
        recursive: true
      });
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/mkdirs/index.js
var require_mkdirs = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/mkdirs/index.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    var { makeDir: _makeDir, makeDirSync } = require_make_dir();
    var makeDir = u(_makeDir);
    module.exports = {
      mkdirs: makeDir,
      mkdirsSync: makeDirSync,
      // alias
      mkdirp: makeDir,
      mkdirpSync: makeDirSync,
      ensureDir: makeDir,
      ensureDirSync: makeDirSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/path-exists/index.js
var require_path_exists = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/path-exists/index.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs8 = require_fs();
    function pathExists(path12) {
      return fs8.access(path12).then(() => true).catch(() => false);
    }
    module.exports = {
      pathExists: u(pathExists),
      pathExistsSync: fs8.existsSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/util/utimes.js
var require_utimes = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/util/utimes.js"(exports, module) {
    "use strict";
    var fs8 = require_fs();
    var u = require_universalify().fromPromise;
    async function utimesMillis(path12, atime, mtime) {
      const fd = await fs8.open(path12, "r+");
      let closeErr = null;
      try {
        await fs8.futimes(fd, atime, mtime);
      } finally {
        try {
          await fs8.close(fd);
        } catch (e) {
          closeErr = e;
        }
      }
      if (closeErr) {
        throw closeErr;
      }
    }
    function utimesMillisSync(path12, atime, mtime) {
      const fd = fs8.openSync(path12, "r+");
      fs8.futimesSync(fd, atime, mtime);
      return fs8.closeSync(fd);
    }
    module.exports = {
      utimesMillis: u(utimesMillis),
      utimesMillisSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/util/stat.js
var require_stat = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/util/stat.js"(exports, module) {
    "use strict";
    var fs8 = require_fs();
    var path12 = __require("path");
    var u = require_universalify().fromPromise;
    function getStats(src2, dest, opts2) {
      const statFunc = opts2.dereference ? (file) => fs8.stat(file, { bigint: true }) : (file) => fs8.lstat(file, { bigint: true });
      return Promise.all([
        statFunc(src2),
        statFunc(dest).catch((err) => {
          if (err.code === "ENOENT") return null;
          throw err;
        })
      ]).then(([srcStat, destStat]) => ({ srcStat, destStat }));
    }
    function getStatsSync(src2, dest, opts2) {
      let destStat;
      const statFunc = opts2.dereference ? (file) => fs8.statSync(file, { bigint: true }) : (file) => fs8.lstatSync(file, { bigint: true });
      const srcStat = statFunc(src2);
      try {
        destStat = statFunc(dest);
      } catch (err) {
        if (err.code === "ENOENT") return { srcStat, destStat: null };
        throw err;
      }
      return { srcStat, destStat };
    }
    async function checkPaths(src2, dest, funcName, opts2) {
      const { srcStat, destStat } = await getStats(src2, dest, opts2);
      if (destStat) {
        if (areIdentical(srcStat, destStat)) {
          const srcBaseName = path12.basename(src2);
          const destBaseName = path12.basename(dest);
          if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
            return { srcStat, destStat, isChangingCase: true };
          }
          throw new Error("Source and destination must not be the same.");
        }
        if (srcStat.isDirectory() && !destStat.isDirectory()) {
          throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src2}'.`);
        }
        if (!srcStat.isDirectory() && destStat.isDirectory()) {
          throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src2}'.`);
        }
      }
      if (srcStat.isDirectory() && isSrcSubdir(src2, dest)) {
        throw new Error(errMsg(src2, dest, funcName));
      }
      return { srcStat, destStat };
    }
    function checkPathsSync(src2, dest, funcName, opts2) {
      const { srcStat, destStat } = getStatsSync(src2, dest, opts2);
      if (destStat) {
        if (areIdentical(srcStat, destStat)) {
          const srcBaseName = path12.basename(src2);
          const destBaseName = path12.basename(dest);
          if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
            return { srcStat, destStat, isChangingCase: true };
          }
          throw new Error("Source and destination must not be the same.");
        }
        if (srcStat.isDirectory() && !destStat.isDirectory()) {
          throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src2}'.`);
        }
        if (!srcStat.isDirectory() && destStat.isDirectory()) {
          throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src2}'.`);
        }
      }
      if (srcStat.isDirectory() && isSrcSubdir(src2, dest)) {
        throw new Error(errMsg(src2, dest, funcName));
      }
      return { srcStat, destStat };
    }
    async function checkParentPaths(src2, srcStat, dest, funcName) {
      const srcParent = path12.resolve(path12.dirname(src2));
      const destParent = path12.resolve(path12.dirname(dest));
      if (destParent === srcParent || destParent === path12.parse(destParent).root) return;
      let destStat;
      try {
        destStat = await fs8.stat(destParent, { bigint: true });
      } catch (err) {
        if (err.code === "ENOENT") return;
        throw err;
      }
      if (areIdentical(srcStat, destStat)) {
        throw new Error(errMsg(src2, dest, funcName));
      }
      return checkParentPaths(src2, srcStat, destParent, funcName);
    }
    function checkParentPathsSync(src2, srcStat, dest, funcName) {
      const srcParent = path12.resolve(path12.dirname(src2));
      const destParent = path12.resolve(path12.dirname(dest));
      if (destParent === srcParent || destParent === path12.parse(destParent).root) return;
      let destStat;
      try {
        destStat = fs8.statSync(destParent, { bigint: true });
      } catch (err) {
        if (err.code === "ENOENT") return;
        throw err;
      }
      if (areIdentical(srcStat, destStat)) {
        throw new Error(errMsg(src2, dest, funcName));
      }
      return checkParentPathsSync(src2, srcStat, destParent, funcName);
    }
    function areIdentical(srcStat, destStat) {
      return destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev;
    }
    function isSrcSubdir(src2, dest) {
      const srcArr = path12.resolve(src2).split(path12.sep).filter((i) => i);
      const destArr = path12.resolve(dest).split(path12.sep).filter((i) => i);
      return srcArr.every((cur, i) => destArr[i] === cur);
    }
    function errMsg(src2, dest, funcName) {
      return `Cannot ${funcName} '${src2}' to a subdirectory of itself, '${dest}'.`;
    }
    module.exports = {
      // checkPaths
      checkPaths: u(checkPaths),
      checkPathsSync,
      // checkParent
      checkParentPaths: u(checkParentPaths),
      checkParentPathsSync,
      // Misc
      isSrcSubdir,
      areIdentical
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/copy/copy.js
var require_copy = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/copy/copy.js"(exports, module) {
    "use strict";
    var fs8 = require_fs();
    var path12 = __require("path");
    var { mkdirs } = require_mkdirs();
    var { pathExists } = require_path_exists();
    var { utimesMillis } = require_utimes();
    var stat = require_stat();
    async function copy(src2, dest, opts2 = {}) {
      if (typeof opts2 === "function") {
        opts2 = { filter: opts2 };
      }
      opts2.clobber = "clobber" in opts2 ? !!opts2.clobber : true;
      opts2.overwrite = "overwrite" in opts2 ? !!opts2.overwrite : opts2.clobber;
      if (opts2.preserveTimestamps && process.arch === "ia32") {
        process.emitWarning(
          "Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269",
          "Warning",
          "fs-extra-WARN0001"
        );
      }
      const { srcStat, destStat } = await stat.checkPaths(src2, dest, "copy", opts2);
      await stat.checkParentPaths(src2, srcStat, dest, "copy");
      const include = await runFilter(src2, dest, opts2);
      if (!include) return;
      const destParent = path12.dirname(dest);
      const dirExists = await pathExists(destParent);
      if (!dirExists) {
        await mkdirs(destParent);
      }
      await getStatsAndPerformCopy(destStat, src2, dest, opts2);
    }
    async function runFilter(src2, dest, opts2) {
      if (!opts2.filter) return true;
      return opts2.filter(src2, dest);
    }
    async function getStatsAndPerformCopy(destStat, src2, dest, opts2) {
      const statFn = opts2.dereference ? fs8.stat : fs8.lstat;
      const srcStat = await statFn(src2);
      if (srcStat.isDirectory()) return onDir(srcStat, destStat, src2, dest, opts2);
      if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile(srcStat, destStat, src2, dest, opts2);
      if (srcStat.isSymbolicLink()) return onLink(destStat, src2, dest, opts2);
      if (srcStat.isSocket()) throw new Error(`Cannot copy a socket file: ${src2}`);
      if (srcStat.isFIFO()) throw new Error(`Cannot copy a FIFO pipe: ${src2}`);
      throw new Error(`Unknown file: ${src2}`);
    }
    async function onFile(srcStat, destStat, src2, dest, opts2) {
      if (!destStat) return copyFile(srcStat, src2, dest, opts2);
      if (opts2.overwrite) {
        await fs8.unlink(dest);
        return copyFile(srcStat, src2, dest, opts2);
      }
      if (opts2.errorOnExist) {
        throw new Error(`'${dest}' already exists`);
      }
    }
    async function copyFile(srcStat, src2, dest, opts2) {
      await fs8.copyFile(src2, dest);
      if (opts2.preserveTimestamps) {
        if (fileIsNotWritable(srcStat.mode)) {
          await makeFileWritable(dest, srcStat.mode);
        }
        const updatedSrcStat = await fs8.stat(src2);
        await utimesMillis(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
      }
      return fs8.chmod(dest, srcStat.mode);
    }
    function fileIsNotWritable(srcMode) {
      return (srcMode & 128) === 0;
    }
    function makeFileWritable(dest, srcMode) {
      return fs8.chmod(dest, srcMode | 128);
    }
    async function onDir(srcStat, destStat, src2, dest, opts2) {
      if (!destStat) {
        await fs8.mkdir(dest);
      }
      const promises = [];
      for await (const item of await fs8.opendir(src2)) {
        const srcItem = path12.join(src2, item.name);
        const destItem = path12.join(dest, item.name);
        promises.push(
          runFilter(srcItem, destItem, opts2).then((include) => {
            if (include) {
              return stat.checkPaths(srcItem, destItem, "copy", opts2).then(({ destStat: destStat2 }) => {
                return getStatsAndPerformCopy(destStat2, srcItem, destItem, opts2);
              });
            }
          })
        );
      }
      await Promise.all(promises);
      if (!destStat) {
        await fs8.chmod(dest, srcStat.mode);
      }
    }
    async function onLink(destStat, src2, dest, opts2) {
      let resolvedSrc = await fs8.readlink(src2);
      if (opts2.dereference) {
        resolvedSrc = path12.resolve(process.cwd(), resolvedSrc);
      }
      if (!destStat) {
        return fs8.symlink(resolvedSrc, dest);
      }
      let resolvedDest = null;
      try {
        resolvedDest = await fs8.readlink(dest);
      } catch (e) {
        if (e.code === "EINVAL" || e.code === "UNKNOWN") return fs8.symlink(resolvedSrc, dest);
        throw e;
      }
      if (opts2.dereference) {
        resolvedDest = path12.resolve(process.cwd(), resolvedDest);
      }
      if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) {
        throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
      }
      if (stat.isSrcSubdir(resolvedDest, resolvedSrc)) {
        throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
      }
      await fs8.unlink(dest);
      return fs8.symlink(resolvedSrc, dest);
    }
    module.exports = copy;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/copy/copy-sync.js
var require_copy_sync = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/copy/copy-sync.js"(exports, module) {
    "use strict";
    var fs8 = require_graceful_fs();
    var path12 = __require("path");
    var mkdirsSync = require_mkdirs().mkdirsSync;
    var utimesMillisSync = require_utimes().utimesMillisSync;
    var stat = require_stat();
    function copySync(src2, dest, opts2) {
      if (typeof opts2 === "function") {
        opts2 = { filter: opts2 };
      }
      opts2 = opts2 || {};
      opts2.clobber = "clobber" in opts2 ? !!opts2.clobber : true;
      opts2.overwrite = "overwrite" in opts2 ? !!opts2.overwrite : opts2.clobber;
      if (opts2.preserveTimestamps && process.arch === "ia32") {
        process.emitWarning(
          "Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269",
          "Warning",
          "fs-extra-WARN0002"
        );
      }
      const { srcStat, destStat } = stat.checkPathsSync(src2, dest, "copy", opts2);
      stat.checkParentPathsSync(src2, srcStat, dest, "copy");
      if (opts2.filter && !opts2.filter(src2, dest)) return;
      const destParent = path12.dirname(dest);
      if (!fs8.existsSync(destParent)) mkdirsSync(destParent);
      return getStats(destStat, src2, dest, opts2);
    }
    function getStats(destStat, src2, dest, opts2) {
      const statSync = opts2.dereference ? fs8.statSync : fs8.lstatSync;
      const srcStat = statSync(src2);
      if (srcStat.isDirectory()) return onDir(srcStat, destStat, src2, dest, opts2);
      else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile(srcStat, destStat, src2, dest, opts2);
      else if (srcStat.isSymbolicLink()) return onLink(destStat, src2, dest, opts2);
      else if (srcStat.isSocket()) throw new Error(`Cannot copy a socket file: ${src2}`);
      else if (srcStat.isFIFO()) throw new Error(`Cannot copy a FIFO pipe: ${src2}`);
      throw new Error(`Unknown file: ${src2}`);
    }
    function onFile(srcStat, destStat, src2, dest, opts2) {
      if (!destStat) return copyFile(srcStat, src2, dest, opts2);
      return mayCopyFile(srcStat, src2, dest, opts2);
    }
    function mayCopyFile(srcStat, src2, dest, opts2) {
      if (opts2.overwrite) {
        fs8.unlinkSync(dest);
        return copyFile(srcStat, src2, dest, opts2);
      } else if (opts2.errorOnExist) {
        throw new Error(`'${dest}' already exists`);
      }
    }
    function copyFile(srcStat, src2, dest, opts2) {
      fs8.copyFileSync(src2, dest);
      if (opts2.preserveTimestamps) handleTimestamps(srcStat.mode, src2, dest);
      return setDestMode(dest, srcStat.mode);
    }
    function handleTimestamps(srcMode, src2, dest) {
      if (fileIsNotWritable(srcMode)) makeFileWritable(dest, srcMode);
      return setDestTimestamps(src2, dest);
    }
    function fileIsNotWritable(srcMode) {
      return (srcMode & 128) === 0;
    }
    function makeFileWritable(dest, srcMode) {
      return setDestMode(dest, srcMode | 128);
    }
    function setDestMode(dest, srcMode) {
      return fs8.chmodSync(dest, srcMode);
    }
    function setDestTimestamps(src2, dest) {
      const updatedSrcStat = fs8.statSync(src2);
      return utimesMillisSync(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
    }
    function onDir(srcStat, destStat, src2, dest, opts2) {
      if (!destStat) return mkDirAndCopy(srcStat.mode, src2, dest, opts2);
      return copyDir(src2, dest, opts2);
    }
    function mkDirAndCopy(srcMode, src2, dest, opts2) {
      fs8.mkdirSync(dest);
      copyDir(src2, dest, opts2);
      return setDestMode(dest, srcMode);
    }
    function copyDir(src2, dest, opts2) {
      const dir = fs8.opendirSync(src2);
      try {
        let dirent;
        while ((dirent = dir.readSync()) !== null) {
          copyDirItem(dirent.name, src2, dest, opts2);
        }
      } finally {
        dir.closeSync();
      }
    }
    function copyDirItem(item, src2, dest, opts2) {
      const srcItem = path12.join(src2, item);
      const destItem = path12.join(dest, item);
      if (opts2.filter && !opts2.filter(srcItem, destItem)) return;
      const { destStat } = stat.checkPathsSync(srcItem, destItem, "copy", opts2);
      return getStats(destStat, srcItem, destItem, opts2);
    }
    function onLink(destStat, src2, dest, opts2) {
      let resolvedSrc = fs8.readlinkSync(src2);
      if (opts2.dereference) {
        resolvedSrc = path12.resolve(process.cwd(), resolvedSrc);
      }
      if (!destStat) {
        return fs8.symlinkSync(resolvedSrc, dest);
      } else {
        let resolvedDest;
        try {
          resolvedDest = fs8.readlinkSync(dest);
        } catch (err) {
          if (err.code === "EINVAL" || err.code === "UNKNOWN") return fs8.symlinkSync(resolvedSrc, dest);
          throw err;
        }
        if (opts2.dereference) {
          resolvedDest = path12.resolve(process.cwd(), resolvedDest);
        }
        if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) {
          throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
        }
        if (stat.isSrcSubdir(resolvedDest, resolvedSrc)) {
          throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
        }
        return copyLink(resolvedSrc, dest);
      }
    }
    function copyLink(resolvedSrc, dest) {
      fs8.unlinkSync(dest);
      return fs8.symlinkSync(resolvedSrc, dest);
    }
    module.exports = copySync;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/copy/index.js
var require_copy2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/copy/index.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    module.exports = {
      copy: u(require_copy()),
      copySync: require_copy_sync()
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/remove/index.js
var require_remove = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/remove/index.js"(exports, module) {
    "use strict";
    var fs8 = require_graceful_fs();
    var u = require_universalify().fromCallback;
    function remove(path12, callback) {
      fs8.rm(path12, { recursive: true, force: true }, callback);
    }
    function removeSync(path12) {
      fs8.rmSync(path12, { recursive: true, force: true });
    }
    module.exports = {
      remove: u(remove),
      removeSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/empty/index.js
var require_empty = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/empty/index.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs8 = require_fs();
    var path12 = __require("path");
    var mkdir = require_mkdirs();
    var remove = require_remove();
    var emptyDir = u(async function emptyDir2(dir) {
      let items;
      try {
        items = await fs8.readdir(dir);
      } catch {
        return mkdir.mkdirs(dir);
      }
      return Promise.all(items.map((item) => remove.remove(path12.join(dir, item))));
    });
    function emptyDirSync(dir) {
      let items;
      try {
        items = fs8.readdirSync(dir);
      } catch {
        return mkdir.mkdirsSync(dir);
      }
      items.forEach((item) => {
        item = path12.join(dir, item);
        remove.removeSync(item);
      });
    }
    module.exports = {
      emptyDirSync,
      emptydirSync: emptyDirSync,
      emptyDir,
      emptydir: emptyDir
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/ensure/file.js
var require_file = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/ensure/file.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    var path12 = __require("path");
    var fs8 = require_fs();
    var mkdir = require_mkdirs();
    async function createFile(file) {
      let stats;
      try {
        stats = await fs8.stat(file);
      } catch {
      }
      if (stats && stats.isFile()) return;
      const dir = path12.dirname(file);
      let dirStats = null;
      try {
        dirStats = await fs8.stat(dir);
      } catch (err) {
        if (err.code === "ENOENT") {
          await mkdir.mkdirs(dir);
          await fs8.writeFile(file, "");
          return;
        } else {
          throw err;
        }
      }
      if (dirStats.isDirectory()) {
        await fs8.writeFile(file, "");
      } else {
        await fs8.readdir(dir);
      }
    }
    function createFileSync(file) {
      let stats;
      try {
        stats = fs8.statSync(file);
      } catch {
      }
      if (stats && stats.isFile()) return;
      const dir = path12.dirname(file);
      try {
        if (!fs8.statSync(dir).isDirectory()) {
          fs8.readdirSync(dir);
        }
      } catch (err) {
        if (err && err.code === "ENOENT") mkdir.mkdirsSync(dir);
        else throw err;
      }
      fs8.writeFileSync(file, "");
    }
    module.exports = {
      createFile: u(createFile),
      createFileSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/ensure/link.js
var require_link = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/ensure/link.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    var path12 = __require("path");
    var fs8 = require_fs();
    var mkdir = require_mkdirs();
    var { pathExists } = require_path_exists();
    var { areIdentical } = require_stat();
    async function createLink(srcpath, dstpath) {
      let dstStat;
      try {
        dstStat = await fs8.lstat(dstpath);
      } catch {
      }
      let srcStat;
      try {
        srcStat = await fs8.lstat(srcpath);
      } catch (err) {
        err.message = err.message.replace("lstat", "ensureLink");
        throw err;
      }
      if (dstStat && areIdentical(srcStat, dstStat)) return;
      const dir = path12.dirname(dstpath);
      const dirExists = await pathExists(dir);
      if (!dirExists) {
        await mkdir.mkdirs(dir);
      }
      await fs8.link(srcpath, dstpath);
    }
    function createLinkSync(srcpath, dstpath) {
      let dstStat;
      try {
        dstStat = fs8.lstatSync(dstpath);
      } catch {
      }
      try {
        const srcStat = fs8.lstatSync(srcpath);
        if (dstStat && areIdentical(srcStat, dstStat)) return;
      } catch (err) {
        err.message = err.message.replace("lstat", "ensureLink");
        throw err;
      }
      const dir = path12.dirname(dstpath);
      const dirExists = fs8.existsSync(dir);
      if (dirExists) return fs8.linkSync(srcpath, dstpath);
      mkdir.mkdirsSync(dir);
      return fs8.linkSync(srcpath, dstpath);
    }
    module.exports = {
      createLink: u(createLink),
      createLinkSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/ensure/symlink-paths.js
var require_symlink_paths = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/ensure/symlink-paths.js"(exports, module) {
    "use strict";
    var path12 = __require("path");
    var fs8 = require_fs();
    var { pathExists } = require_path_exists();
    var u = require_universalify().fromPromise;
    async function symlinkPaths(srcpath, dstpath) {
      if (path12.isAbsolute(srcpath)) {
        try {
          await fs8.lstat(srcpath);
        } catch (err) {
          err.message = err.message.replace("lstat", "ensureSymlink");
          throw err;
        }
        return {
          toCwd: srcpath,
          toDst: srcpath
        };
      }
      const dstdir = path12.dirname(dstpath);
      const relativeToDst = path12.join(dstdir, srcpath);
      const exists = await pathExists(relativeToDst);
      if (exists) {
        return {
          toCwd: relativeToDst,
          toDst: srcpath
        };
      }
      try {
        await fs8.lstat(srcpath);
      } catch (err) {
        err.message = err.message.replace("lstat", "ensureSymlink");
        throw err;
      }
      return {
        toCwd: srcpath,
        toDst: path12.relative(dstdir, srcpath)
      };
    }
    function symlinkPathsSync(srcpath, dstpath) {
      if (path12.isAbsolute(srcpath)) {
        const exists2 = fs8.existsSync(srcpath);
        if (!exists2) throw new Error("absolute srcpath does not exist");
        return {
          toCwd: srcpath,
          toDst: srcpath
        };
      }
      const dstdir = path12.dirname(dstpath);
      const relativeToDst = path12.join(dstdir, srcpath);
      const exists = fs8.existsSync(relativeToDst);
      if (exists) {
        return {
          toCwd: relativeToDst,
          toDst: srcpath
        };
      }
      const srcExists = fs8.existsSync(srcpath);
      if (!srcExists) throw new Error("relative srcpath does not exist");
      return {
        toCwd: srcpath,
        toDst: path12.relative(dstdir, srcpath)
      };
    }
    module.exports = {
      symlinkPaths: u(symlinkPaths),
      symlinkPathsSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/ensure/symlink-type.js
var require_symlink_type = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/ensure/symlink-type.js"(exports, module) {
    "use strict";
    var fs8 = require_fs();
    var u = require_universalify().fromPromise;
    async function symlinkType(srcpath, type) {
      if (type) return type;
      let stats;
      try {
        stats = await fs8.lstat(srcpath);
      } catch {
        return "file";
      }
      return stats && stats.isDirectory() ? "dir" : "file";
    }
    function symlinkTypeSync(srcpath, type) {
      if (type) return type;
      let stats;
      try {
        stats = fs8.lstatSync(srcpath);
      } catch {
        return "file";
      }
      return stats && stats.isDirectory() ? "dir" : "file";
    }
    module.exports = {
      symlinkType: u(symlinkType),
      symlinkTypeSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/ensure/symlink.js
var require_symlink = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/ensure/symlink.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    var path12 = __require("path");
    var fs8 = require_fs();
    var { mkdirs, mkdirsSync } = require_mkdirs();
    var { symlinkPaths, symlinkPathsSync } = require_symlink_paths();
    var { symlinkType, symlinkTypeSync } = require_symlink_type();
    var { pathExists } = require_path_exists();
    var { areIdentical } = require_stat();
    async function createSymlink(srcpath, dstpath, type) {
      let stats;
      try {
        stats = await fs8.lstat(dstpath);
      } catch {
      }
      if (stats && stats.isSymbolicLink()) {
        const [srcStat, dstStat] = await Promise.all([
          fs8.stat(srcpath),
          fs8.stat(dstpath)
        ]);
        if (areIdentical(srcStat, dstStat)) return;
      }
      const relative = await symlinkPaths(srcpath, dstpath);
      srcpath = relative.toDst;
      const toType = await symlinkType(relative.toCwd, type);
      const dir = path12.dirname(dstpath);
      if (!await pathExists(dir)) {
        await mkdirs(dir);
      }
      return fs8.symlink(srcpath, dstpath, toType);
    }
    function createSymlinkSync(srcpath, dstpath, type) {
      let stats;
      try {
        stats = fs8.lstatSync(dstpath);
      } catch {
      }
      if (stats && stats.isSymbolicLink()) {
        const srcStat = fs8.statSync(srcpath);
        const dstStat = fs8.statSync(dstpath);
        if (areIdentical(srcStat, dstStat)) return;
      }
      const relative = symlinkPathsSync(srcpath, dstpath);
      srcpath = relative.toDst;
      type = symlinkTypeSync(relative.toCwd, type);
      const dir = path12.dirname(dstpath);
      const exists = fs8.existsSync(dir);
      if (exists) return fs8.symlinkSync(srcpath, dstpath, type);
      mkdirsSync(dir);
      return fs8.symlinkSync(srcpath, dstpath, type);
    }
    module.exports = {
      createSymlink: u(createSymlink),
      createSymlinkSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/ensure/index.js
var require_ensure = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/ensure/index.js"(exports, module) {
    "use strict";
    var { createFile, createFileSync } = require_file();
    var { createLink, createLinkSync } = require_link();
    var { createSymlink, createSymlinkSync } = require_symlink();
    module.exports = {
      // file
      createFile,
      createFileSync,
      ensureFile: createFile,
      ensureFileSync: createFileSync,
      // link
      createLink,
      createLinkSync,
      ensureLink: createLink,
      ensureLinkSync: createLinkSync,
      // symlink
      createSymlink,
      createSymlinkSync,
      ensureSymlink: createSymlink,
      ensureSymlinkSync: createSymlinkSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/jsonfile/6.2.0/e6b8ccd5b437f8893b1bfc876c1423b2c0763c4a691eeaafc7d88b09b03f6869/node_modules/jsonfile/utils.js
var require_utils2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/jsonfile/6.2.0/e6b8ccd5b437f8893b1bfc876c1423b2c0763c4a691eeaafc7d88b09b03f6869/node_modules/jsonfile/utils.js"(exports, module) {
    function stringify(obj, { EOL = "\n", finalEOL = true, replacer = null, spaces } = {}) {
      const EOF = finalEOL ? EOL : "";
      const str = JSON.stringify(obj, replacer, spaces);
      return str.replace(/\n/g, EOL) + EOF;
    }
    function stripBom2(content) {
      if (Buffer.isBuffer(content)) content = content.toString("utf8");
      return content.replace(/^\uFEFF/, "");
    }
    module.exports = { stringify, stripBom: stripBom2 };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/jsonfile/6.2.0/e6b8ccd5b437f8893b1bfc876c1423b2c0763c4a691eeaafc7d88b09b03f6869/node_modules/jsonfile/index.js
var require_jsonfile = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/jsonfile/6.2.0/e6b8ccd5b437f8893b1bfc876c1423b2c0763c4a691eeaafc7d88b09b03f6869/node_modules/jsonfile/index.js"(exports, module) {
    var _fs;
    try {
      _fs = require_graceful_fs();
    } catch (_) {
      _fs = __require("fs");
    }
    var universalify = require_universalify();
    var { stringify, stripBom: stripBom2 } = require_utils2();
    async function _readFile(file, options = {}) {
      if (typeof options === "string") {
        options = { encoding: options };
      }
      const fs8 = options.fs || _fs;
      const shouldThrow = "throws" in options ? options.throws : true;
      let data = await universalify.fromCallback(fs8.readFile)(file, options);
      data = stripBom2(data);
      let obj;
      try {
        obj = JSON.parse(data, options ? options.reviver : null);
      } catch (err) {
        if (shouldThrow) {
          err.message = `${file}: ${err.message}`;
          throw err;
        } else {
          return null;
        }
      }
      return obj;
    }
    var readFile = universalify.fromPromise(_readFile);
    function readFileSync(file, options = {}) {
      if (typeof options === "string") {
        options = { encoding: options };
      }
      const fs8 = options.fs || _fs;
      const shouldThrow = "throws" in options ? options.throws : true;
      try {
        let content = fs8.readFileSync(file, options);
        content = stripBom2(content);
        return JSON.parse(content, options.reviver);
      } catch (err) {
        if (shouldThrow) {
          err.message = `${file}: ${err.message}`;
          throw err;
        } else {
          return null;
        }
      }
    }
    async function _writeFile(file, obj, options = {}) {
      const fs8 = options.fs || _fs;
      const str = stringify(obj, options);
      await universalify.fromCallback(fs8.writeFile)(file, str, options);
    }
    var writeFile2 = universalify.fromPromise(_writeFile);
    function writeFileSync(file, obj, options = {}) {
      const fs8 = options.fs || _fs;
      const str = stringify(obj, options);
      return fs8.writeFileSync(file, str, options);
    }
    module.exports = {
      readFile,
      readFileSync,
      writeFile: writeFile2,
      writeFileSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/json/jsonfile.js
var require_jsonfile2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/json/jsonfile.js"(exports, module) {
    "use strict";
    var jsonFile = require_jsonfile();
    module.exports = {
      // jsonfile exports
      readJson: jsonFile.readFile,
      readJsonSync: jsonFile.readFileSync,
      writeJson: jsonFile.writeFile,
      writeJsonSync: jsonFile.writeFileSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/output-file/index.js
var require_output_file = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/output-file/index.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs8 = require_fs();
    var path12 = __require("path");
    var mkdir = require_mkdirs();
    var pathExists = require_path_exists().pathExists;
    async function outputFile(file, data, encoding = "utf-8") {
      const dir = path12.dirname(file);
      if (!await pathExists(dir)) {
        await mkdir.mkdirs(dir);
      }
      return fs8.writeFile(file, data, encoding);
    }
    function outputFileSync(file, ...args) {
      const dir = path12.dirname(file);
      if (!fs8.existsSync(dir)) {
        mkdir.mkdirsSync(dir);
      }
      fs8.writeFileSync(file, ...args);
    }
    module.exports = {
      outputFile: u(outputFile),
      outputFileSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/json/output-json.js
var require_output_json = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/json/output-json.js"(exports, module) {
    "use strict";
    var { stringify } = require_utils2();
    var { outputFile } = require_output_file();
    async function outputJson(file, data, options = {}) {
      const str = stringify(data, options);
      await outputFile(file, str, options);
    }
    module.exports = outputJson;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/json/output-json-sync.js
var require_output_json_sync = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/json/output-json-sync.js"(exports, module) {
    "use strict";
    var { stringify } = require_utils2();
    var { outputFileSync } = require_output_file();
    function outputJsonSync(file, data, options) {
      const str = stringify(data, options);
      outputFileSync(file, str, options);
    }
    module.exports = outputJsonSync;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/json/index.js
var require_json = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/json/index.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    var jsonFile = require_jsonfile2();
    jsonFile.outputJson = u(require_output_json());
    jsonFile.outputJsonSync = require_output_json_sync();
    jsonFile.outputJSON = jsonFile.outputJson;
    jsonFile.outputJSONSync = jsonFile.outputJsonSync;
    jsonFile.writeJSON = jsonFile.writeJson;
    jsonFile.writeJSONSync = jsonFile.writeJsonSync;
    jsonFile.readJSON = jsonFile.readJson;
    jsonFile.readJSONSync = jsonFile.readJsonSync;
    module.exports = jsonFile;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/move/move.js
var require_move = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/move/move.js"(exports, module) {
    "use strict";
    var fs8 = require_fs();
    var path12 = __require("path");
    var { copy } = require_copy2();
    var { remove } = require_remove();
    var { mkdirp } = require_mkdirs();
    var { pathExists } = require_path_exists();
    var stat = require_stat();
    async function move(src2, dest, opts2 = {}) {
      const overwrite = opts2.overwrite || opts2.clobber || false;
      const { srcStat, isChangingCase = false } = await stat.checkPaths(src2, dest, "move", opts2);
      await stat.checkParentPaths(src2, srcStat, dest, "move");
      const destParent = path12.dirname(dest);
      const parsedParentPath = path12.parse(destParent);
      if (parsedParentPath.root !== destParent) {
        await mkdirp(destParent);
      }
      return doRename(src2, dest, overwrite, isChangingCase);
    }
    async function doRename(src2, dest, overwrite, isChangingCase) {
      if (!isChangingCase) {
        if (overwrite) {
          await remove(dest);
        } else if (await pathExists(dest)) {
          throw new Error("dest already exists.");
        }
      }
      try {
        await fs8.rename(src2, dest);
      } catch (err) {
        if (err.code !== "EXDEV") {
          throw err;
        }
        await moveAcrossDevice(src2, dest, overwrite);
      }
    }
    async function moveAcrossDevice(src2, dest, overwrite) {
      const opts2 = {
        overwrite,
        errorOnExist: true,
        preserveTimestamps: true
      };
      await copy(src2, dest, opts2);
      return remove(src2);
    }
    module.exports = move;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/move/move-sync.js
var require_move_sync = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/move/move-sync.js"(exports, module) {
    "use strict";
    var fs8 = require_graceful_fs();
    var path12 = __require("path");
    var copySync = require_copy2().copySync;
    var removeSync = require_remove().removeSync;
    var mkdirpSync = require_mkdirs().mkdirpSync;
    var stat = require_stat();
    function moveSync(src2, dest, opts2) {
      opts2 = opts2 || {};
      const overwrite = opts2.overwrite || opts2.clobber || false;
      const { srcStat, isChangingCase = false } = stat.checkPathsSync(src2, dest, "move", opts2);
      stat.checkParentPathsSync(src2, srcStat, dest, "move");
      if (!isParentRoot(dest)) mkdirpSync(path12.dirname(dest));
      return doRename(src2, dest, overwrite, isChangingCase);
    }
    function isParentRoot(dest) {
      const parent = path12.dirname(dest);
      const parsedPath = path12.parse(parent);
      return parsedPath.root === parent;
    }
    function doRename(src2, dest, overwrite, isChangingCase) {
      if (isChangingCase) return rename(src2, dest, overwrite);
      if (overwrite) {
        removeSync(dest);
        return rename(src2, dest, overwrite);
      }
      if (fs8.existsSync(dest)) throw new Error("dest already exists.");
      return rename(src2, dest, overwrite);
    }
    function rename(src2, dest, overwrite) {
      try {
        fs8.renameSync(src2, dest);
      } catch (err) {
        if (err.code !== "EXDEV") throw err;
        return moveAcrossDevice(src2, dest, overwrite);
      }
    }
    function moveAcrossDevice(src2, dest, overwrite) {
      const opts2 = {
        overwrite,
        errorOnExist: true,
        preserveTimestamps: true
      };
      copySync(src2, dest, opts2);
      return removeSync(src2);
    }
    module.exports = moveSync;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/move/index.js
var require_move2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/move/index.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    module.exports = {
      move: u(require_move()),
      moveSync: require_move_sync()
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/index.js
var require_lib = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/index.js"(exports, module) {
    "use strict";
    module.exports = {
      // Export promiseified graceful-fs:
      ...require_fs(),
      // Export extra methods:
      ...require_copy2(),
      ...require_empty(),
      ...require_ensure(),
      ...require_json(),
      ...require_mkdirs(),
      ...require_move2(),
      ...require_output_file(),
      ...require_path_exists(),
      ...require_remove()
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/rename-overwrite/6.0.2/5f3ac1c6c9da1d876f3bd14170eff997aecd496016e0b976f6a3d409c0c0f8d2/node_modules/rename-overwrite/index.js
var require_rename_overwrite = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/rename-overwrite/6.0.2/5f3ac1c6c9da1d876f3bd14170eff997aecd496016e0b976f6a3d409c0c0f8d2/node_modules/rename-overwrite/index.js"(exports, module) {
    "use strict";
    var fs8 = __require("fs");
    var { copySync, copy } = require_lib();
    var path12 = __require("path");
    var rimraf3 = require_rimraf();
    module.exports = async function renameOverwrite4(oldPath, newPath, retry = 0) {
      try {
        await fs8.promises.rename(oldPath, newPath);
      } catch (err) {
        retry++;
        if (retry > 3) throw err;
        switch (err.code) {
          case "ENOTEMPTY":
          case "EEXIST":
          case "ENOTDIR":
            await rimraf3(newPath);
            await renameOverwrite4(oldPath, newPath, retry);
            break;
          // Windows Antivirus issues
          case "EPERM":
          case "EACCESS": {
            await rimraf3(newPath);
            const start = Date.now();
            let backoff = 0;
            let lastError = err;
            while (Date.now() - start < 6e4 && (lastError.code === "EPERM" || lastError.code === "EACCESS")) {
              await new Promise((resolve) => setTimeout(resolve, backoff));
              try {
                await fs8.promises.rename(oldPath, newPath);
                return;
              } catch (err2) {
                lastError = err2;
              }
              if (backoff < 100) {
                backoff += 10;
              }
            }
            throw lastError;
          }
          case "ENOENT":
            try {
              await fs8.promises.stat(oldPath);
            } catch (statErr) {
              if (statErr.code === "ENOENT") {
                throw statErr;
              }
            }
            await fs8.promises.mkdir(path12.dirname(newPath), { recursive: true });
            await renameOverwrite4(oldPath, newPath, retry);
            break;
          // Crossing filesystem boundaries so rename is not available
          case "EXDEV":
            try {
              await rimraf3(newPath);
            } catch (rimrafErr) {
              if (rimrafErr.code !== "ENOENT") {
                throw rimrafErr;
              }
            }
            await copy(oldPath, newPath);
            await rimraf3(oldPath);
            break;
          default:
            throw err;
        }
      }
    };
    module.exports.sync = function renameOverwriteSync(oldPath, newPath, retry = 0) {
      try {
        fs8.renameSync(oldPath, newPath);
      } catch (err) {
        retry++;
        if (retry > 3) throw err;
        switch (err.code) {
          // Windows Antivirus issues
          case "EPERM":
          case "EACCESS": {
            rimraf3.sync(newPath);
            const start = Date.now();
            let backoff = 0;
            let lastError = err;
            while (Date.now() - start < 6e4 && (lastError.code === "EPERM" || lastError.code === "EACCESS")) {
              const waitUntil = Date.now() + backoff;
              while (waitUntil > Date.now()) {
              }
              try {
                fs8.renameSync(oldPath, newPath);
                return;
              } catch (err2) {
                lastError = err2;
              }
              if (backoff < 100) {
                backoff += 10;
              }
            }
            throw lastError;
          }
          case "ENOTEMPTY":
          case "EEXIST":
          case "ENOTDIR":
            rimraf3.sync(newPath);
            fs8.renameSync(oldPath, newPath);
            return;
          case "ENOENT":
            fs8.mkdirSync(path12.dirname(newPath), { recursive: true });
            renameOverwriteSync(oldPath, newPath, retry);
            return;
          // Crossing filesystem boundaries so rename is not available
          case "EXDEV":
            try {
              rimraf3.sync(newPath);
            } catch (rimrafErr) {
              if (rimrafErr.code !== "ENOENT") {
                throw rimrafErr;
              }
            }
            copySync(oldPath, newPath);
            rimraf3.sync(oldPath);
            break;
          default:
            throw err;
        }
      }
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fast-safe-stringify/2.1.1/60f5418df769ea68bc8d688541488d5a98daf703d72e57b1e7ca262a1e289ed0/node_modules/fast-safe-stringify/index.js
var require_fast_safe_stringify = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fast-safe-stringify/2.1.1/60f5418df769ea68bc8d688541488d5a98daf703d72e57b1e7ca262a1e289ed0/node_modules/fast-safe-stringify/index.js"(exports, module) {
    module.exports = stringify;
    stringify.default = stringify;
    stringify.stable = deterministicStringify;
    stringify.stableStringify = deterministicStringify;
    var LIMIT_REPLACE_NODE = "[...]";
    var CIRCULAR_REPLACE_NODE = "[Circular]";
    var arr = [];
    var replacerStack = [];
    function defaultOptions2() {
      return {
        depthLimit: Number.MAX_SAFE_INTEGER,
        edgesLimit: Number.MAX_SAFE_INTEGER
      };
    }
    function stringify(obj, replacer, spacer, options) {
      if (typeof options === "undefined") {
        options = defaultOptions2();
      }
      decirc(obj, "", 0, [], void 0, 0, options);
      var res;
      try {
        if (replacerStack.length === 0) {
          res = JSON.stringify(obj, replacer, spacer);
        } else {
          res = JSON.stringify(obj, replaceGetterValues(replacer), spacer);
        }
      } catch (_) {
        return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]");
      } finally {
        while (arr.length !== 0) {
          var part = arr.pop();
          if (part.length === 4) {
            Object.defineProperty(part[0], part[1], part[3]);
          } else {
            part[0][part[1]] = part[2];
          }
        }
      }
      return res;
    }
    function setReplace(replace, val, k, parent) {
      var propertyDescriptor = Object.getOwnPropertyDescriptor(parent, k);
      if (propertyDescriptor.get !== void 0) {
        if (propertyDescriptor.configurable) {
          Object.defineProperty(parent, k, { value: replace });
          arr.push([parent, k, val, propertyDescriptor]);
        } else {
          replacerStack.push([val, k, replace]);
        }
      } else {
        parent[k] = replace;
        arr.push([parent, k, val]);
      }
    }
    function decirc(val, k, edgeIndex, stack, parent, depth, options) {
      depth += 1;
      var i;
      if (typeof val === "object" && val !== null) {
        for (i = 0; i < stack.length; i++) {
          if (stack[i] === val) {
            setReplace(CIRCULAR_REPLACE_NODE, val, k, parent);
            return;
          }
        }
        if (typeof options.depthLimit !== "undefined" && depth > options.depthLimit) {
          setReplace(LIMIT_REPLACE_NODE, val, k, parent);
          return;
        }
        if (typeof options.edgesLimit !== "undefined" && edgeIndex + 1 > options.edgesLimit) {
          setReplace(LIMIT_REPLACE_NODE, val, k, parent);
          return;
        }
        stack.push(val);
        if (Array.isArray(val)) {
          for (i = 0; i < val.length; i++) {
            decirc(val[i], i, i, stack, val, depth, options);
          }
        } else {
          var keys = Object.keys(val);
          for (i = 0; i < keys.length; i++) {
            var key = keys[i];
            decirc(val[key], key, i, stack, val, depth, options);
          }
        }
        stack.pop();
      }
    }
    function compareFunction(a, b) {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    }
    function deterministicStringify(obj, replacer, spacer, options) {
      if (typeof options === "undefined") {
        options = defaultOptions2();
      }
      var tmp = deterministicDecirc(obj, "", 0, [], void 0, 0, options) || obj;
      var res;
      try {
        if (replacerStack.length === 0) {
          res = JSON.stringify(tmp, replacer, spacer);
        } else {
          res = JSON.stringify(tmp, replaceGetterValues(replacer), spacer);
        }
      } catch (_) {
        return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]");
      } finally {
        while (arr.length !== 0) {
          var part = arr.pop();
          if (part.length === 4) {
            Object.defineProperty(part[0], part[1], part[3]);
          } else {
            part[0][part[1]] = part[2];
          }
        }
      }
      return res;
    }
    function deterministicDecirc(val, k, edgeIndex, stack, parent, depth, options) {
      depth += 1;
      var i;
      if (typeof val === "object" && val !== null) {
        for (i = 0; i < stack.length; i++) {
          if (stack[i] === val) {
            setReplace(CIRCULAR_REPLACE_NODE, val, k, parent);
            return;
          }
        }
        try {
          if (typeof val.toJSON === "function") {
            return;
          }
        } catch (_) {
          return;
        }
        if (typeof options.depthLimit !== "undefined" && depth > options.depthLimit) {
          setReplace(LIMIT_REPLACE_NODE, val, k, parent);
          return;
        }
        if (typeof options.edgesLimit !== "undefined" && edgeIndex + 1 > options.edgesLimit) {
          setReplace(LIMIT_REPLACE_NODE, val, k, parent);
          return;
        }
        stack.push(val);
        if (Array.isArray(val)) {
          for (i = 0; i < val.length; i++) {
            deterministicDecirc(val[i], i, i, stack, val, depth, options);
          }
        } else {
          var tmp = {};
          var keys = Object.keys(val).sort(compareFunction);
          for (i = 0; i < keys.length; i++) {
            var key = keys[i];
            deterministicDecirc(val[key], key, i, stack, val, depth, options);
            tmp[key] = val[key];
          }
          if (typeof parent !== "undefined") {
            arr.push([parent, k, val]);
            parent[k] = tmp;
          } else {
            return tmp;
          }
        }
        stack.pop();
      }
    }
    function replaceGetterValues(replacer) {
      replacer = typeof replacer !== "undefined" ? replacer : function(k, v) {
        return v;
      };
      return function(key, val) {
        if (replacerStack.length > 0) {
          for (var i = 0; i < replacerStack.length; i++) {
            var part = replacerStack[i];
            if (part[1] === key && part[0] === val) {
              val = part[2];
              replacerStack.splice(i, 1);
              break;
            }
          }
        }
        return replacer.call(this, key, val);
      };
    }
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/individual/3.0.0/16916313ebaab38455d9c75a54fff660edcc28f062c8d71b95dc79244fe1d86a/node_modules/individual/index.js
var require_individual = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/individual/3.0.0/16916313ebaab38455d9c75a54fff660edcc28f062c8d71b95dc79244fe1d86a/node_modules/individual/index.js"(exports, module) {
    "use strict";
    var root = typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};
    module.exports = Individual;
    function Individual(key, value) {
      if (key in root) {
        return root[key];
      }
      root[key] = value;
      return value;
    }
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/bole/5.0.17/0b558d8c78119d472b4f6e94a8cb5454b84e0e0c4a582355e66568f378b77396/node_modules/bole/format.js
var require_format = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/bole/5.0.17/0b558d8c78119d472b4f6e94a8cb5454b84e0e0c4a582355e66568f378b77396/node_modules/bole/format.js"(exports, module) {
    var utilformat = __require("util").format;
    function format(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16) {
      if (a16 !== void 0) {
        return utilformat(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16);
      }
      if (a15 !== void 0) {
        return utilformat(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15);
      }
      if (a14 !== void 0) {
        return utilformat(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14);
      }
      if (a13 !== void 0) {
        return utilformat(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13);
      }
      if (a12 !== void 0) {
        return utilformat(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12);
      }
      if (a11 !== void 0) {
        return utilformat(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11);
      }
      if (a10 !== void 0) {
        return utilformat(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10);
      }
      if (a9 !== void 0) {
        return utilformat(a1, a2, a3, a4, a5, a6, a7, a8, a9);
      }
      if (a8 !== void 0) {
        return utilformat(a1, a2, a3, a4, a5, a6, a7, a8);
      }
      if (a7 !== void 0) {
        return utilformat(a1, a2, a3, a4, a5, a6, a7);
      }
      if (a6 !== void 0) {
        return utilformat(a1, a2, a3, a4, a5, a6);
      }
      if (a5 !== void 0) {
        return utilformat(a1, a2, a3, a4, a5);
      }
      if (a4 !== void 0) {
        return utilformat(a1, a2, a3, a4);
      }
      if (a3 !== void 0) {
        return utilformat(a1, a2, a3);
      }
      if (a2 !== void 0) {
        return utilformat(a1, a2);
      }
      return a1;
    }
    module.exports = format;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/bole/5.0.17/0b558d8c78119d472b4f6e94a8cb5454b84e0e0c4a582355e66568f378b77396/node_modules/bole/bole.js
var require_bole = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/bole/5.0.17/0b558d8c78119d472b4f6e94a8cb5454b84e0e0c4a582355e66568f378b77396/node_modules/bole/bole.js"(exports, module) {
    "use strict";
    var _stringify = require_fast_safe_stringify();
    var individual = require_individual()("$$bole", { fastTime: false });
    var format = require_format();
    var levels = "debug info warn error".split(" ");
    var os = __require("os");
    var pid = process.pid;
    var hasObjMode = false;
    var scache = [];
    var hostname;
    try {
      hostname = os.hostname();
    } catch (e) {
      hostname = os.version().indexOf("Windows 7 ") === 0 ? "windows7" : "hostname-unknown";
    }
    var hostnameSt = _stringify(hostname);
    for (const level of levels) {
      scache[level] = ',"hostname":' + hostnameSt + ',"pid":' + pid + ',"level":"' + level;
      Number(scache[level]);
      if (!Array.isArray(individual[level])) {
        individual[level] = [];
      }
    }
    function stackToString(e) {
      let s = e.stack;
      let ce;
      if (typeof e.cause === "function" && (ce = e.cause())) {
        s += "\nCaused by: " + stackToString(ce);
      }
      return s;
    }
    function errorToOut(err, out) {
      out.err = {
        name: err.name,
        message: err.message,
        code: err.code,
        // perhaps
        stack: stackToString(err)
      };
    }
    function requestToOut(req, out) {
      out.req = {
        method: req.method,
        url: req.url,
        headers: req.headers,
        remoteAddress: req.connection.remoteAddress,
        remotePort: req.connection.remotePort
      };
    }
    function objectToOut(obj, out) {
      for (const k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k) && obj[k] !== void 0) {
          out[k] = obj[k];
        }
      }
    }
    function objectMode(stream) {
      return stream._writableState && stream._writableState.objectMode === true;
    }
    function stringify(level, name, message, obj) {
      let s = '{"time":' + (individual.fastTime ? Date.now() : '"' + (/* @__PURE__ */ new Date()).toISOString() + '"') + scache[level] + '","name":' + name + (message !== void 0 ? ',"message":' + _stringify(message) : "");
      for (const k in obj) {
        s += "," + _stringify(k) + ":" + _stringify(obj[k]);
      }
      s += "}";
      Number(s);
      return s;
    }
    function extend(level, name, message, obj) {
      const newObj = {
        time: individual.fastTime ? Date.now() : (/* @__PURE__ */ new Date()).toISOString(),
        hostname,
        pid,
        level,
        name
      };
      if (message !== void 0) {
        obj.message = message;
      }
      for (const k in obj) {
        newObj[k] = obj[k];
      }
      return newObj;
    }
    function levelLogger(level, name) {
      const outputs = individual[level];
      const nameSt = _stringify(name);
      return function namedLevelLogger(inp, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16) {
        if (outputs.length === 0) {
          return;
        }
        const out = {};
        let objectOut;
        let i = 0;
        const l = outputs.length;
        let stringified;
        let message;
        if (typeof inp === "string" || inp == null) {
          if (!(message = format(inp, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16))) {
            message = void 0;
          }
        } else {
          if (inp instanceof Error) {
            if (typeof a2 === "object") {
              objectToOut(a2, out);
              errorToOut(inp, out);
              if (!(message = format(a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16))) {
                message = void 0;
              }
            } else {
              errorToOut(inp, out);
              if (!(message = format(a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16))) {
                message = void 0;
              }
            }
          } else {
            if (!(message = format(a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16))) {
              message = void 0;
            }
          }
          if (typeof inp === "boolean") {
            message = String(inp);
          } else if (typeof inp === "object" && !(inp instanceof Error)) {
            if (inp.method && inp.url && inp.headers && inp.socket) {
              requestToOut(inp, out);
            } else {
              objectToOut(inp, out);
            }
          }
        }
        if (l === 1 && !hasObjMode) {
          outputs[0].write(Buffer.from(stringify(level, nameSt, message, out) + "\n"));
          return;
        }
        for (; i < l; i++) {
          if (objectMode(outputs[i])) {
            if (objectOut === void 0) {
              objectOut = extend(level, name, message, out);
            }
            outputs[i].write(objectOut);
          } else {
            if (stringified === void 0) {
              stringified = Buffer.from(stringify(level, nameSt, message, out) + "\n");
            }
            outputs[i].write(stringified);
          }
        }
      };
    }
    function bole4(name) {
      function boleLogger(subname) {
        return bole4(name + ":" + subname);
      }
      function makeLogger(p, level) {
        p[level] = levelLogger(level, name);
        return p;
      }
      return levels.reduce(makeLogger, boleLogger);
    }
    bole4.output = function output(opt) {
      let b = false;
      if (Array.isArray(opt)) {
        opt.forEach(bole4.output);
        return bole4;
      }
      if (typeof opt.level !== "string") {
        throw new TypeError('Must provide a "level" option');
      }
      for (const level of levels) {
        if (!b && level === opt.level) {
          b = true;
        }
        if (b) {
          if (opt.stream && objectMode(opt.stream)) {
            hasObjMode = true;
          }
          individual[level].push(opt.stream);
        }
      }
      return bole4;
    };
    bole4.reset = function reset() {
      for (const level of levels) {
        individual[level].splice(0, individual[level].length);
      }
      individual.fastTime = false;
      return bole4;
    };
    bole4.setFastTime = function setFastTime(b) {
      if (!arguments.length) {
        individual.fastTime = true;
      } else {
        individual.fastTime = b;
      }
      return bole4;
    };
    module.exports = bole4;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/split2/4.2.0/5aa5692fab682fdeae843001e92a0f3971c2e71a60115f1a18744a5b619d4d62/node_modules/split2/index.js
var require_split2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/split2/4.2.0/5aa5692fab682fdeae843001e92a0f3971c2e71a60115f1a18744a5b619d4d62/node_modules/split2/index.js"(exports, module) {
    "use strict";
    var { Transform } = __require("stream");
    var { StringDecoder } = __require("string_decoder");
    var kLast = Symbol("last");
    var kDecoder = Symbol("decoder");
    function transform(chunk, enc, cb) {
      let list;
      if (this.overflow) {
        const buf = this[kDecoder].write(chunk);
        list = buf.split(this.matcher);
        if (list.length === 1) return cb();
        list.shift();
        this.overflow = false;
      } else {
        this[kLast] += this[kDecoder].write(chunk);
        list = this[kLast].split(this.matcher);
      }
      this[kLast] = list.pop();
      for (let i = 0; i < list.length; i++) {
        try {
          push(this, this.mapper(list[i]));
        } catch (error) {
          return cb(error);
        }
      }
      this.overflow = this[kLast].length > this.maxLength;
      if (this.overflow && !this.skipOverflow) {
        cb(new Error("maximum buffer reached"));
        return;
      }
      cb();
    }
    function flush(cb) {
      this[kLast] += this[kDecoder].end();
      if (this[kLast]) {
        try {
          push(this, this.mapper(this[kLast]));
        } catch (error) {
          return cb(error);
        }
      }
      cb();
    }
    function push(self2, val) {
      if (val !== void 0) {
        self2.push(val);
      }
    }
    function noop(incoming) {
      return incoming;
    }
    function split2(matcher, mapper, options) {
      matcher = matcher || /\r?\n/;
      mapper = mapper || noop;
      options = options || {};
      switch (arguments.length) {
        case 1:
          if (typeof matcher === "function") {
            mapper = matcher;
            matcher = /\r?\n/;
          } else if (typeof matcher === "object" && !(matcher instanceof RegExp) && !matcher[Symbol.split]) {
            options = matcher;
            matcher = /\r?\n/;
          }
          break;
        case 2:
          if (typeof matcher === "function") {
            options = mapper;
            mapper = matcher;
            matcher = /\r?\n/;
          } else if (typeof mapper === "object") {
            options = mapper;
            mapper = noop;
          }
      }
      options = Object.assign({}, options);
      options.autoDestroy = true;
      options.transform = transform;
      options.flush = flush;
      options.readableObjectMode = true;
      const stream = new Transform(options);
      stream[kLast] = "";
      stream[kDecoder] = new StringDecoder("utf8");
      stream.matcher = matcher;
      stream.mapper = mapper;
      stream.maxLength = options.maxLength;
      stream.skipOverflow = options.skipOverflow || false;
      stream.overflow = false;
      stream._destroy = function(err, cb) {
        this._writableState.errorEmitted = false;
        cb(err);
      };
      return stream;
    }
    module.exports = split2;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/fs/index.js
var require_fs2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/fs/index.js"(exports) {
    "use strict";
    var u = require_universalify().fromCallback;
    var fs8 = require_graceful_fs();
    var api = [
      "access",
      "appendFile",
      "chmod",
      "chown",
      "close",
      "copyFile",
      "cp",
      "fchmod",
      "fchown",
      "fdatasync",
      "fstat",
      "fsync",
      "ftruncate",
      "futimes",
      "glob",
      "lchmod",
      "lchown",
      "lutimes",
      "link",
      "lstat",
      "mkdir",
      "mkdtemp",
      "open",
      "opendir",
      "readdir",
      "readFile",
      "readlink",
      "realpath",
      "rename",
      "rm",
      "rmdir",
      "stat",
      "statfs",
      "symlink",
      "truncate",
      "unlink",
      "utimes",
      "writeFile"
    ].filter((key) => {
      return typeof fs8[key] === "function";
    });
    Object.assign(exports, fs8);
    api.forEach((method) => {
      exports[method] = u(fs8[method]);
    });
    exports.exists = function(filename, callback) {
      if (typeof callback === "function") {
        return fs8.exists(filename, callback);
      }
      return new Promise((resolve) => {
        return fs8.exists(filename, resolve);
      });
    };
    exports.read = function(fd, buffer, offset, length, position3, callback) {
      if (typeof callback === "function") {
        return fs8.read(fd, buffer, offset, length, position3, callback);
      }
      return new Promise((resolve, reject) => {
        fs8.read(fd, buffer, offset, length, position3, (err, bytesRead, buffer2) => {
          if (err) return reject(err);
          resolve({ bytesRead, buffer: buffer2 });
        });
      });
    };
    exports.write = function(fd, buffer, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs8.write(fd, buffer, ...args);
      }
      return new Promise((resolve, reject) => {
        fs8.write(fd, buffer, ...args, (err, bytesWritten, buffer2) => {
          if (err) return reject(err);
          resolve({ bytesWritten, buffer: buffer2 });
        });
      });
    };
    exports.readv = function(fd, buffers, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs8.readv(fd, buffers, ...args);
      }
      return new Promise((resolve, reject) => {
        fs8.readv(fd, buffers, ...args, (err, bytesRead, buffers2) => {
          if (err) return reject(err);
          resolve({ bytesRead, buffers: buffers2 });
        });
      });
    };
    exports.writev = function(fd, buffers, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs8.writev(fd, buffers, ...args);
      }
      return new Promise((resolve, reject) => {
        fs8.writev(fd, buffers, ...args, (err, bytesWritten, buffers2) => {
          if (err) return reject(err);
          resolve({ bytesWritten, buffers: buffers2 });
        });
      });
    };
    if (typeof fs8.realpath.native === "function") {
      exports.realpath.native = u(fs8.realpath.native);
    } else {
      process.emitWarning(
        "fs.realpath.native is not a function. Is fs being monkey-patched?",
        "Warning",
        "fs-extra-WARN0003"
      );
    }
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/mkdirs/utils.js
var require_utils3 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/mkdirs/utils.js"(exports, module) {
    "use strict";
    var path12 = __require("path");
    module.exports.checkPath = function checkPath(pth) {
      if (process.platform === "win32") {
        const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(pth.replace(path12.parse(pth).root, ""));
        if (pathHasInvalidWinCharacters) {
          const error = new Error(`Path contains invalid characters: ${pth}`);
          error.code = "EINVAL";
          throw error;
        }
      }
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/mkdirs/make-dir.js
var require_make_dir2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/mkdirs/make-dir.js"(exports, module) {
    "use strict";
    var fs8 = require_fs2();
    var { checkPath } = require_utils3();
    var getMode = (options) => {
      const defaults = { mode: 511 };
      if (typeof options === "number") return options;
      return { ...defaults, ...options }.mode;
    };
    module.exports.makeDir = async (dir, options) => {
      checkPath(dir);
      return fs8.mkdir(dir, {
        mode: getMode(options),
        recursive: true
      });
    };
    module.exports.makeDirSync = (dir, options) => {
      checkPath(dir);
      return fs8.mkdirSync(dir, {
        mode: getMode(options),
        recursive: true
      });
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/mkdirs/index.js
var require_mkdirs2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/mkdirs/index.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    var { makeDir: _makeDir, makeDirSync } = require_make_dir2();
    var makeDir = u(_makeDir);
    module.exports = {
      mkdirs: makeDir,
      mkdirsSync: makeDirSync,
      // alias
      mkdirp: makeDir,
      mkdirpSync: makeDirSync,
      ensureDir: makeDir,
      ensureDirSync: makeDirSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/path-exists/index.js
var require_path_exists2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/path-exists/index.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs8 = require_fs2();
    function pathExists(path12) {
      return fs8.access(path12).then(() => true).catch(() => false);
    }
    module.exports = {
      pathExists: u(pathExists),
      pathExistsSync: fs8.existsSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/util/utimes.js
var require_utimes2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/util/utimes.js"(exports, module) {
    "use strict";
    var fs8 = require_fs2();
    var u = require_universalify().fromPromise;
    async function utimesMillis(path12, atime, mtime) {
      const fd = await fs8.open(path12, "r+");
      let closeErr = null;
      try {
        await fs8.futimes(fd, atime, mtime);
      } finally {
        try {
          await fs8.close(fd);
        } catch (e) {
          closeErr = e;
        }
      }
      if (closeErr) {
        throw closeErr;
      }
    }
    function utimesMillisSync(path12, atime, mtime) {
      const fd = fs8.openSync(path12, "r+");
      fs8.futimesSync(fd, atime, mtime);
      return fs8.closeSync(fd);
    }
    module.exports = {
      utimesMillis: u(utimesMillis),
      utimesMillisSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/util/stat.js
var require_stat2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/util/stat.js"(exports, module) {
    "use strict";
    var fs8 = require_fs2();
    var path12 = __require("path");
    var u = require_universalify().fromPromise;
    function getStats(src2, dest, opts2) {
      const statFunc = opts2.dereference ? (file) => fs8.stat(file, { bigint: true }) : (file) => fs8.lstat(file, { bigint: true });
      return Promise.all([
        statFunc(src2),
        statFunc(dest).catch((err) => {
          if (err.code === "ENOENT") return null;
          throw err;
        })
      ]).then(([srcStat, destStat]) => ({ srcStat, destStat }));
    }
    function getStatsSync(src2, dest, opts2) {
      let destStat;
      const statFunc = opts2.dereference ? (file) => fs8.statSync(file, { bigint: true }) : (file) => fs8.lstatSync(file, { bigint: true });
      const srcStat = statFunc(src2);
      try {
        destStat = statFunc(dest);
      } catch (err) {
        if (err.code === "ENOENT") return { srcStat, destStat: null };
        throw err;
      }
      return { srcStat, destStat };
    }
    async function checkPaths(src2, dest, funcName, opts2) {
      const { srcStat, destStat } = await getStats(src2, dest, opts2);
      if (destStat) {
        if (areIdentical(srcStat, destStat)) {
          const srcBaseName = path12.basename(src2);
          const destBaseName = path12.basename(dest);
          if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
            return { srcStat, destStat, isChangingCase: true };
          }
          throw new Error("Source and destination must not be the same.");
        }
        if (srcStat.isDirectory() && !destStat.isDirectory()) {
          throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src2}'.`);
        }
        if (!srcStat.isDirectory() && destStat.isDirectory()) {
          throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src2}'.`);
        }
      }
      if (srcStat.isDirectory() && isSrcSubdir(src2, dest)) {
        throw new Error(errMsg(src2, dest, funcName));
      }
      return { srcStat, destStat };
    }
    function checkPathsSync(src2, dest, funcName, opts2) {
      const { srcStat, destStat } = getStatsSync(src2, dest, opts2);
      if (destStat) {
        if (areIdentical(srcStat, destStat)) {
          const srcBaseName = path12.basename(src2);
          const destBaseName = path12.basename(dest);
          if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
            return { srcStat, destStat, isChangingCase: true };
          }
          throw new Error("Source and destination must not be the same.");
        }
        if (srcStat.isDirectory() && !destStat.isDirectory()) {
          throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src2}'.`);
        }
        if (!srcStat.isDirectory() && destStat.isDirectory()) {
          throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src2}'.`);
        }
      }
      if (srcStat.isDirectory() && isSrcSubdir(src2, dest)) {
        throw new Error(errMsg(src2, dest, funcName));
      }
      return { srcStat, destStat };
    }
    async function checkParentPaths(src2, srcStat, dest, funcName) {
      const srcParent = path12.resolve(path12.dirname(src2));
      const destParent = path12.resolve(path12.dirname(dest));
      if (destParent === srcParent || destParent === path12.parse(destParent).root) return;
      let destStat;
      try {
        destStat = await fs8.stat(destParent, { bigint: true });
      } catch (err) {
        if (err.code === "ENOENT") return;
        throw err;
      }
      if (areIdentical(srcStat, destStat)) {
        throw new Error(errMsg(src2, dest, funcName));
      }
      return checkParentPaths(src2, srcStat, destParent, funcName);
    }
    function checkParentPathsSync(src2, srcStat, dest, funcName) {
      const srcParent = path12.resolve(path12.dirname(src2));
      const destParent = path12.resolve(path12.dirname(dest));
      if (destParent === srcParent || destParent === path12.parse(destParent).root) return;
      let destStat;
      try {
        destStat = fs8.statSync(destParent, { bigint: true });
      } catch (err) {
        if (err.code === "ENOENT") return;
        throw err;
      }
      if (areIdentical(srcStat, destStat)) {
        throw new Error(errMsg(src2, dest, funcName));
      }
      return checkParentPathsSync(src2, srcStat, destParent, funcName);
    }
    function areIdentical(srcStat, destStat) {
      return destStat.ino !== void 0 && destStat.dev !== void 0 && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev;
    }
    function isSrcSubdir(src2, dest) {
      const srcArr = path12.resolve(src2).split(path12.sep).filter((i) => i);
      const destArr = path12.resolve(dest).split(path12.sep).filter((i) => i);
      return srcArr.every((cur, i) => destArr[i] === cur);
    }
    function errMsg(src2, dest, funcName) {
      return `Cannot ${funcName} '${src2}' to a subdirectory of itself, '${dest}'.`;
    }
    module.exports = {
      // checkPaths
      checkPaths: u(checkPaths),
      checkPathsSync,
      // checkParent
      checkParentPaths: u(checkParentPaths),
      checkParentPathsSync,
      // Misc
      isSrcSubdir,
      areIdentical
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/copy/copy.js
var require_copy3 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/copy/copy.js"(exports, module) {
    "use strict";
    var fs8 = require_fs2();
    var path12 = __require("path");
    var { mkdirs } = require_mkdirs2();
    var { pathExists } = require_path_exists2();
    var { utimesMillis } = require_utimes2();
    var stat = require_stat2();
    async function copy(src2, dest, opts2 = {}) {
      if (typeof opts2 === "function") {
        opts2 = { filter: opts2 };
      }
      opts2.clobber = "clobber" in opts2 ? !!opts2.clobber : true;
      opts2.overwrite = "overwrite" in opts2 ? !!opts2.overwrite : opts2.clobber;
      if (opts2.preserveTimestamps && process.arch === "ia32") {
        process.emitWarning(
          "Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269",
          "Warning",
          "fs-extra-WARN0001"
        );
      }
      const { srcStat, destStat } = await stat.checkPaths(src2, dest, "copy", opts2);
      await stat.checkParentPaths(src2, srcStat, dest, "copy");
      const include = await runFilter(src2, dest, opts2);
      if (!include) return;
      const destParent = path12.dirname(dest);
      const dirExists = await pathExists(destParent);
      if (!dirExists) {
        await mkdirs(destParent);
      }
      await getStatsAndPerformCopy(destStat, src2, dest, opts2);
    }
    async function runFilter(src2, dest, opts2) {
      if (!opts2.filter) return true;
      return opts2.filter(src2, dest);
    }
    async function getStatsAndPerformCopy(destStat, src2, dest, opts2) {
      const statFn = opts2.dereference ? fs8.stat : fs8.lstat;
      const srcStat = await statFn(src2);
      if (srcStat.isDirectory()) return onDir(srcStat, destStat, src2, dest, opts2);
      if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile(srcStat, destStat, src2, dest, opts2);
      if (srcStat.isSymbolicLink()) return onLink(destStat, src2, dest, opts2);
      if (srcStat.isSocket()) throw new Error(`Cannot copy a socket file: ${src2}`);
      if (srcStat.isFIFO()) throw new Error(`Cannot copy a FIFO pipe: ${src2}`);
      throw new Error(`Unknown file: ${src2}`);
    }
    async function onFile(srcStat, destStat, src2, dest, opts2) {
      if (!destStat) return copyFile(srcStat, src2, dest, opts2);
      if (opts2.overwrite) {
        await fs8.unlink(dest);
        return copyFile(srcStat, src2, dest, opts2);
      }
      if (opts2.errorOnExist) {
        throw new Error(`'${dest}' already exists`);
      }
    }
    async function copyFile(srcStat, src2, dest, opts2) {
      await fs8.copyFile(src2, dest);
      if (opts2.preserveTimestamps) {
        if (fileIsNotWritable(srcStat.mode)) {
          await makeFileWritable(dest, srcStat.mode);
        }
        const updatedSrcStat = await fs8.stat(src2);
        await utimesMillis(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
      }
      return fs8.chmod(dest, srcStat.mode);
    }
    function fileIsNotWritable(srcMode) {
      return (srcMode & 128) === 0;
    }
    function makeFileWritable(dest, srcMode) {
      return fs8.chmod(dest, srcMode | 128);
    }
    async function onDir(srcStat, destStat, src2, dest, opts2) {
      if (!destStat) {
        await fs8.mkdir(dest);
      }
      const promises = [];
      for await (const item of await fs8.opendir(src2)) {
        const srcItem = path12.join(src2, item.name);
        const destItem = path12.join(dest, item.name);
        promises.push(
          runFilter(srcItem, destItem, opts2).then((include) => {
            if (include) {
              return stat.checkPaths(srcItem, destItem, "copy", opts2).then(({ destStat: destStat2 }) => {
                return getStatsAndPerformCopy(destStat2, srcItem, destItem, opts2);
              });
            }
          })
        );
      }
      await Promise.all(promises);
      if (!destStat) {
        await fs8.chmod(dest, srcStat.mode);
      }
    }
    async function onLink(destStat, src2, dest, opts2) {
      let resolvedSrc = await fs8.readlink(src2);
      if (opts2.dereference) {
        resolvedSrc = path12.resolve(process.cwd(), resolvedSrc);
      }
      if (!destStat) {
        return fs8.symlink(resolvedSrc, dest);
      }
      let resolvedDest = null;
      try {
        resolvedDest = await fs8.readlink(dest);
      } catch (e) {
        if (e.code === "EINVAL" || e.code === "UNKNOWN") return fs8.symlink(resolvedSrc, dest);
        throw e;
      }
      if (opts2.dereference) {
        resolvedDest = path12.resolve(process.cwd(), resolvedDest);
      }
      if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) {
        throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
      }
      if (stat.isSrcSubdir(resolvedDest, resolvedSrc)) {
        throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
      }
      await fs8.unlink(dest);
      return fs8.symlink(resolvedSrc, dest);
    }
    module.exports = copy;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/copy/copy-sync.js
var require_copy_sync2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/copy/copy-sync.js"(exports, module) {
    "use strict";
    var fs8 = require_graceful_fs();
    var path12 = __require("path");
    var mkdirsSync = require_mkdirs2().mkdirsSync;
    var utimesMillisSync = require_utimes2().utimesMillisSync;
    var stat = require_stat2();
    function copySync(src2, dest, opts2) {
      if (typeof opts2 === "function") {
        opts2 = { filter: opts2 };
      }
      opts2 = opts2 || {};
      opts2.clobber = "clobber" in opts2 ? !!opts2.clobber : true;
      opts2.overwrite = "overwrite" in opts2 ? !!opts2.overwrite : opts2.clobber;
      if (opts2.preserveTimestamps && process.arch === "ia32") {
        process.emitWarning(
          "Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269",
          "Warning",
          "fs-extra-WARN0002"
        );
      }
      const { srcStat, destStat } = stat.checkPathsSync(src2, dest, "copy", opts2);
      stat.checkParentPathsSync(src2, srcStat, dest, "copy");
      if (opts2.filter && !opts2.filter(src2, dest)) return;
      const destParent = path12.dirname(dest);
      if (!fs8.existsSync(destParent)) mkdirsSync(destParent);
      return getStats(destStat, src2, dest, opts2);
    }
    function getStats(destStat, src2, dest, opts2) {
      const statSync = opts2.dereference ? fs8.statSync : fs8.lstatSync;
      const srcStat = statSync(src2);
      if (srcStat.isDirectory()) return onDir(srcStat, destStat, src2, dest, opts2);
      else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile(srcStat, destStat, src2, dest, opts2);
      else if (srcStat.isSymbolicLink()) return onLink(destStat, src2, dest, opts2);
      else if (srcStat.isSocket()) throw new Error(`Cannot copy a socket file: ${src2}`);
      else if (srcStat.isFIFO()) throw new Error(`Cannot copy a FIFO pipe: ${src2}`);
      throw new Error(`Unknown file: ${src2}`);
    }
    function onFile(srcStat, destStat, src2, dest, opts2) {
      if (!destStat) return copyFile(srcStat, src2, dest, opts2);
      return mayCopyFile(srcStat, src2, dest, opts2);
    }
    function mayCopyFile(srcStat, src2, dest, opts2) {
      if (opts2.overwrite) {
        fs8.unlinkSync(dest);
        return copyFile(srcStat, src2, dest, opts2);
      } else if (opts2.errorOnExist) {
        throw new Error(`'${dest}' already exists`);
      }
    }
    function copyFile(srcStat, src2, dest, opts2) {
      fs8.copyFileSync(src2, dest);
      if (opts2.preserveTimestamps) handleTimestamps(srcStat.mode, src2, dest);
      return setDestMode(dest, srcStat.mode);
    }
    function handleTimestamps(srcMode, src2, dest) {
      if (fileIsNotWritable(srcMode)) makeFileWritable(dest, srcMode);
      return setDestTimestamps(src2, dest);
    }
    function fileIsNotWritable(srcMode) {
      return (srcMode & 128) === 0;
    }
    function makeFileWritable(dest, srcMode) {
      return setDestMode(dest, srcMode | 128);
    }
    function setDestMode(dest, srcMode) {
      return fs8.chmodSync(dest, srcMode);
    }
    function setDestTimestamps(src2, dest) {
      const updatedSrcStat = fs8.statSync(src2);
      return utimesMillisSync(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
    }
    function onDir(srcStat, destStat, src2, dest, opts2) {
      if (!destStat) return mkDirAndCopy(srcStat.mode, src2, dest, opts2);
      return copyDir(src2, dest, opts2);
    }
    function mkDirAndCopy(srcMode, src2, dest, opts2) {
      fs8.mkdirSync(dest);
      copyDir(src2, dest, opts2);
      return setDestMode(dest, srcMode);
    }
    function copyDir(src2, dest, opts2) {
      const dir = fs8.opendirSync(src2);
      try {
        let dirent;
        while ((dirent = dir.readSync()) !== null) {
          copyDirItem(dirent.name, src2, dest, opts2);
        }
      } finally {
        dir.closeSync();
      }
    }
    function copyDirItem(item, src2, dest, opts2) {
      const srcItem = path12.join(src2, item);
      const destItem = path12.join(dest, item);
      if (opts2.filter && !opts2.filter(srcItem, destItem)) return;
      const { destStat } = stat.checkPathsSync(srcItem, destItem, "copy", opts2);
      return getStats(destStat, srcItem, destItem, opts2);
    }
    function onLink(destStat, src2, dest, opts2) {
      let resolvedSrc = fs8.readlinkSync(src2);
      if (opts2.dereference) {
        resolvedSrc = path12.resolve(process.cwd(), resolvedSrc);
      }
      if (!destStat) {
        return fs8.symlinkSync(resolvedSrc, dest);
      } else {
        let resolvedDest;
        try {
          resolvedDest = fs8.readlinkSync(dest);
        } catch (err) {
          if (err.code === "EINVAL" || err.code === "UNKNOWN") return fs8.symlinkSync(resolvedSrc, dest);
          throw err;
        }
        if (opts2.dereference) {
          resolvedDest = path12.resolve(process.cwd(), resolvedDest);
        }
        if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) {
          throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
        }
        if (stat.isSrcSubdir(resolvedDest, resolvedSrc)) {
          throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
        }
        return copyLink(resolvedSrc, dest);
      }
    }
    function copyLink(resolvedSrc, dest) {
      fs8.unlinkSync(dest);
      return fs8.symlinkSync(resolvedSrc, dest);
    }
    module.exports = copySync;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/copy/index.js
var require_copy4 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/copy/index.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    module.exports = {
      copy: u(require_copy3()),
      copySync: require_copy_sync2()
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/remove/index.js
var require_remove2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/remove/index.js"(exports, module) {
    "use strict";
    var fs8 = require_graceful_fs();
    var u = require_universalify().fromCallback;
    function remove(path12, callback) {
      fs8.rm(path12, { recursive: true, force: true }, callback);
    }
    function removeSync(path12) {
      fs8.rmSync(path12, { recursive: true, force: true });
    }
    module.exports = {
      remove: u(remove),
      removeSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/empty/index.js
var require_empty2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/empty/index.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs8 = require_fs2();
    var path12 = __require("path");
    var mkdir = require_mkdirs2();
    var remove = require_remove2();
    var emptyDir = u(async function emptyDir2(dir) {
      let items;
      try {
        items = await fs8.readdir(dir);
      } catch {
        return mkdir.mkdirs(dir);
      }
      return Promise.all(items.map((item) => remove.remove(path12.join(dir, item))));
    });
    function emptyDirSync(dir) {
      let items;
      try {
        items = fs8.readdirSync(dir);
      } catch {
        return mkdir.mkdirsSync(dir);
      }
      items.forEach((item) => {
        item = path12.join(dir, item);
        remove.removeSync(item);
      });
    }
    module.exports = {
      emptyDirSync,
      emptydirSync: emptyDirSync,
      emptyDir,
      emptydir: emptyDir
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/ensure/file.js
var require_file2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/ensure/file.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    var path12 = __require("path");
    var fs8 = require_fs2();
    var mkdir = require_mkdirs2();
    async function createFile(file) {
      let stats;
      try {
        stats = await fs8.stat(file);
      } catch {
      }
      if (stats && stats.isFile()) return;
      const dir = path12.dirname(file);
      let dirStats = null;
      try {
        dirStats = await fs8.stat(dir);
      } catch (err) {
        if (err.code === "ENOENT") {
          await mkdir.mkdirs(dir);
          await fs8.writeFile(file, "");
          return;
        } else {
          throw err;
        }
      }
      if (dirStats.isDirectory()) {
        await fs8.writeFile(file, "");
      } else {
        await fs8.readdir(dir);
      }
    }
    function createFileSync(file) {
      let stats;
      try {
        stats = fs8.statSync(file);
      } catch {
      }
      if (stats && stats.isFile()) return;
      const dir = path12.dirname(file);
      try {
        if (!fs8.statSync(dir).isDirectory()) {
          fs8.readdirSync(dir);
        }
      } catch (err) {
        if (err && err.code === "ENOENT") mkdir.mkdirsSync(dir);
        else throw err;
      }
      fs8.writeFileSync(file, "");
    }
    module.exports = {
      createFile: u(createFile),
      createFileSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/ensure/link.js
var require_link2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/ensure/link.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    var path12 = __require("path");
    var fs8 = require_fs2();
    var mkdir = require_mkdirs2();
    var { pathExists } = require_path_exists2();
    var { areIdentical } = require_stat2();
    async function createLink(srcpath, dstpath) {
      let dstStat;
      try {
        dstStat = await fs8.lstat(dstpath);
      } catch {
      }
      let srcStat;
      try {
        srcStat = await fs8.lstat(srcpath);
      } catch (err) {
        err.message = err.message.replace("lstat", "ensureLink");
        throw err;
      }
      if (dstStat && areIdentical(srcStat, dstStat)) return;
      const dir = path12.dirname(dstpath);
      const dirExists = await pathExists(dir);
      if (!dirExists) {
        await mkdir.mkdirs(dir);
      }
      await fs8.link(srcpath, dstpath);
    }
    function createLinkSync(srcpath, dstpath) {
      let dstStat;
      try {
        dstStat = fs8.lstatSync(dstpath);
      } catch {
      }
      try {
        const srcStat = fs8.lstatSync(srcpath);
        if (dstStat && areIdentical(srcStat, dstStat)) return;
      } catch (err) {
        err.message = err.message.replace("lstat", "ensureLink");
        throw err;
      }
      const dir = path12.dirname(dstpath);
      const dirExists = fs8.existsSync(dir);
      if (dirExists) return fs8.linkSync(srcpath, dstpath);
      mkdir.mkdirsSync(dir);
      return fs8.linkSync(srcpath, dstpath);
    }
    module.exports = {
      createLink: u(createLink),
      createLinkSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/ensure/symlink-paths.js
var require_symlink_paths2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/ensure/symlink-paths.js"(exports, module) {
    "use strict";
    var path12 = __require("path");
    var fs8 = require_fs2();
    var { pathExists } = require_path_exists2();
    var u = require_universalify().fromPromise;
    async function symlinkPaths(srcpath, dstpath) {
      if (path12.isAbsolute(srcpath)) {
        try {
          await fs8.lstat(srcpath);
        } catch (err) {
          err.message = err.message.replace("lstat", "ensureSymlink");
          throw err;
        }
        return {
          toCwd: srcpath,
          toDst: srcpath
        };
      }
      const dstdir = path12.dirname(dstpath);
      const relativeToDst = path12.join(dstdir, srcpath);
      const exists = await pathExists(relativeToDst);
      if (exists) {
        return {
          toCwd: relativeToDst,
          toDst: srcpath
        };
      }
      try {
        await fs8.lstat(srcpath);
      } catch (err) {
        err.message = err.message.replace("lstat", "ensureSymlink");
        throw err;
      }
      return {
        toCwd: srcpath,
        toDst: path12.relative(dstdir, srcpath)
      };
    }
    function symlinkPathsSync(srcpath, dstpath) {
      if (path12.isAbsolute(srcpath)) {
        const exists2 = fs8.existsSync(srcpath);
        if (!exists2) throw new Error("absolute srcpath does not exist");
        return {
          toCwd: srcpath,
          toDst: srcpath
        };
      }
      const dstdir = path12.dirname(dstpath);
      const relativeToDst = path12.join(dstdir, srcpath);
      const exists = fs8.existsSync(relativeToDst);
      if (exists) {
        return {
          toCwd: relativeToDst,
          toDst: srcpath
        };
      }
      const srcExists = fs8.existsSync(srcpath);
      if (!srcExists) throw new Error("relative srcpath does not exist");
      return {
        toCwd: srcpath,
        toDst: path12.relative(dstdir, srcpath)
      };
    }
    module.exports = {
      symlinkPaths: u(symlinkPaths),
      symlinkPathsSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/ensure/symlink-type.js
var require_symlink_type2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/ensure/symlink-type.js"(exports, module) {
    "use strict";
    var fs8 = require_fs2();
    var u = require_universalify().fromPromise;
    async function symlinkType(srcpath, type) {
      if (type) return type;
      let stats;
      try {
        stats = await fs8.lstat(srcpath);
      } catch {
        return "file";
      }
      return stats && stats.isDirectory() ? "dir" : "file";
    }
    function symlinkTypeSync(srcpath, type) {
      if (type) return type;
      let stats;
      try {
        stats = fs8.lstatSync(srcpath);
      } catch {
        return "file";
      }
      return stats && stats.isDirectory() ? "dir" : "file";
    }
    module.exports = {
      symlinkType: u(symlinkType),
      symlinkTypeSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/ensure/symlink.js
var require_symlink2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/ensure/symlink.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    var path12 = __require("path");
    var fs8 = require_fs2();
    var { mkdirs, mkdirsSync } = require_mkdirs2();
    var { symlinkPaths, symlinkPathsSync } = require_symlink_paths2();
    var { symlinkType, symlinkTypeSync } = require_symlink_type2();
    var { pathExists } = require_path_exists2();
    var { areIdentical } = require_stat2();
    async function createSymlink(srcpath, dstpath, type) {
      let stats;
      try {
        stats = await fs8.lstat(dstpath);
      } catch {
      }
      if (stats && stats.isSymbolicLink()) {
        const [srcStat, dstStat] = await Promise.all([
          fs8.stat(srcpath),
          fs8.stat(dstpath)
        ]);
        if (areIdentical(srcStat, dstStat)) return;
      }
      const relative = await symlinkPaths(srcpath, dstpath);
      srcpath = relative.toDst;
      const toType = await symlinkType(relative.toCwd, type);
      const dir = path12.dirname(dstpath);
      if (!await pathExists(dir)) {
        await mkdirs(dir);
      }
      return fs8.symlink(srcpath, dstpath, toType);
    }
    function createSymlinkSync(srcpath, dstpath, type) {
      let stats;
      try {
        stats = fs8.lstatSync(dstpath);
      } catch {
      }
      if (stats && stats.isSymbolicLink()) {
        const srcStat = fs8.statSync(srcpath);
        const dstStat = fs8.statSync(dstpath);
        if (areIdentical(srcStat, dstStat)) return;
      }
      const relative = symlinkPathsSync(srcpath, dstpath);
      srcpath = relative.toDst;
      type = symlinkTypeSync(relative.toCwd, type);
      const dir = path12.dirname(dstpath);
      const exists = fs8.existsSync(dir);
      if (exists) return fs8.symlinkSync(srcpath, dstpath, type);
      mkdirsSync(dir);
      return fs8.symlinkSync(srcpath, dstpath, type);
    }
    module.exports = {
      createSymlink: u(createSymlink),
      createSymlinkSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/ensure/index.js
var require_ensure2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/ensure/index.js"(exports, module) {
    "use strict";
    var { createFile, createFileSync } = require_file2();
    var { createLink, createLinkSync } = require_link2();
    var { createSymlink, createSymlinkSync } = require_symlink2();
    module.exports = {
      // file
      createFile,
      createFileSync,
      ensureFile: createFile,
      ensureFileSync: createFileSync,
      // link
      createLink,
      createLinkSync,
      ensureLink: createLink,
      ensureLinkSync: createLinkSync,
      // symlink
      createSymlink,
      createSymlinkSync,
      ensureSymlink: createSymlink,
      ensureSymlinkSync: createSymlinkSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/json/jsonfile.js
var require_jsonfile3 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/json/jsonfile.js"(exports, module) {
    "use strict";
    var jsonFile = require_jsonfile();
    module.exports = {
      // jsonfile exports
      readJson: jsonFile.readFile,
      readJsonSync: jsonFile.readFileSync,
      writeJson: jsonFile.writeFile,
      writeJsonSync: jsonFile.writeFileSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/output-file/index.js
var require_output_file2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/output-file/index.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs8 = require_fs2();
    var path12 = __require("path");
    var mkdir = require_mkdirs2();
    var pathExists = require_path_exists2().pathExists;
    async function outputFile(file, data, encoding = "utf-8") {
      const dir = path12.dirname(file);
      if (!await pathExists(dir)) {
        await mkdir.mkdirs(dir);
      }
      return fs8.writeFile(file, data, encoding);
    }
    function outputFileSync(file, ...args) {
      const dir = path12.dirname(file);
      if (!fs8.existsSync(dir)) {
        mkdir.mkdirsSync(dir);
      }
      fs8.writeFileSync(file, ...args);
    }
    module.exports = {
      outputFile: u(outputFile),
      outputFileSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/json/output-json.js
var require_output_json2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/json/output-json.js"(exports, module) {
    "use strict";
    var { stringify } = require_utils2();
    var { outputFile } = require_output_file2();
    async function outputJson(file, data, options = {}) {
      const str = stringify(data, options);
      await outputFile(file, str, options);
    }
    module.exports = outputJson;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/json/output-json-sync.js
var require_output_json_sync2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/json/output-json-sync.js"(exports, module) {
    "use strict";
    var { stringify } = require_utils2();
    var { outputFileSync } = require_output_file2();
    function outputJsonSync(file, data, options) {
      const str = stringify(data, options);
      outputFileSync(file, str, options);
    }
    module.exports = outputJsonSync;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/json/index.js
var require_json2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/json/index.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    var jsonFile = require_jsonfile3();
    jsonFile.outputJson = u(require_output_json2());
    jsonFile.outputJsonSync = require_output_json_sync2();
    jsonFile.outputJSON = jsonFile.outputJson;
    jsonFile.outputJSONSync = jsonFile.outputJsonSync;
    jsonFile.writeJSON = jsonFile.writeJson;
    jsonFile.writeJSONSync = jsonFile.writeJsonSync;
    jsonFile.readJSON = jsonFile.readJson;
    jsonFile.readJSONSync = jsonFile.readJsonSync;
    module.exports = jsonFile;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/move/move.js
var require_move3 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/move/move.js"(exports, module) {
    "use strict";
    var fs8 = require_fs2();
    var path12 = __require("path");
    var { copy } = require_copy4();
    var { remove } = require_remove2();
    var { mkdirp } = require_mkdirs2();
    var { pathExists } = require_path_exists2();
    var stat = require_stat2();
    async function move(src2, dest, opts2 = {}) {
      const overwrite = opts2.overwrite || opts2.clobber || false;
      const { srcStat, isChangingCase = false } = await stat.checkPaths(src2, dest, "move", opts2);
      await stat.checkParentPaths(src2, srcStat, dest, "move");
      const destParent = path12.dirname(dest);
      const parsedParentPath = path12.parse(destParent);
      if (parsedParentPath.root !== destParent) {
        await mkdirp(destParent);
      }
      return doRename(src2, dest, overwrite, isChangingCase);
    }
    async function doRename(src2, dest, overwrite, isChangingCase) {
      if (!isChangingCase) {
        if (overwrite) {
          await remove(dest);
        } else if (await pathExists(dest)) {
          throw new Error("dest already exists.");
        }
      }
      try {
        await fs8.rename(src2, dest);
      } catch (err) {
        if (err.code !== "EXDEV") {
          throw err;
        }
        await moveAcrossDevice(src2, dest, overwrite);
      }
    }
    async function moveAcrossDevice(src2, dest, overwrite) {
      const opts2 = {
        overwrite,
        errorOnExist: true,
        preserveTimestamps: true
      };
      await copy(src2, dest, opts2);
      return remove(src2);
    }
    module.exports = move;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/move/move-sync.js
var require_move_sync2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/move/move-sync.js"(exports, module) {
    "use strict";
    var fs8 = require_graceful_fs();
    var path12 = __require("path");
    var copySync = require_copy4().copySync;
    var removeSync = require_remove2().removeSync;
    var mkdirpSync = require_mkdirs2().mkdirpSync;
    var stat = require_stat2();
    function moveSync(src2, dest, opts2) {
      opts2 = opts2 || {};
      const overwrite = opts2.overwrite || opts2.clobber || false;
      const { srcStat, isChangingCase = false } = stat.checkPathsSync(src2, dest, "move", opts2);
      stat.checkParentPathsSync(src2, srcStat, dest, "move");
      if (!isParentRoot(dest)) mkdirpSync(path12.dirname(dest));
      return doRename(src2, dest, overwrite, isChangingCase);
    }
    function isParentRoot(dest) {
      const parent = path12.dirname(dest);
      const parsedPath = path12.parse(parent);
      return parsedPath.root === parent;
    }
    function doRename(src2, dest, overwrite, isChangingCase) {
      if (isChangingCase) return rename(src2, dest, overwrite);
      if (overwrite) {
        removeSync(dest);
        return rename(src2, dest, overwrite);
      }
      if (fs8.existsSync(dest)) throw new Error("dest already exists.");
      return rename(src2, dest, overwrite);
    }
    function rename(src2, dest, overwrite) {
      try {
        fs8.renameSync(src2, dest);
      } catch (err) {
        if (err.code !== "EXDEV") throw err;
        return moveAcrossDevice(src2, dest, overwrite);
      }
    }
    function moveAcrossDevice(src2, dest, overwrite) {
      const opts2 = {
        overwrite,
        errorOnExist: true,
        preserveTimestamps: true
      };
      copySync(src2, dest, opts2);
      return removeSync(src2);
    }
    module.exports = moveSync;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/move/index.js
var require_move4 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/move/index.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    module.exports = {
      move: u(require_move3()),
      moveSync: require_move_sync2()
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/index.js
var require_lib2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/index.js"(exports, module) {
    "use strict";
    module.exports = {
      // Export promiseified graceful-fs:
      ...require_fs2(),
      // Export extra methods:
      ...require_copy4(),
      ...require_empty2(),
      ...require_ensure2(),
      ...require_json2(),
      ...require_mkdirs2(),
      ...require_move4(),
      ...require_output_file2(),
      ...require_path_exists2(),
      ...require_remove2()
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/make-empty-dir/3.0.2/a7a4cf98e6272554434a37f2ec0a891cf0089041cf92ad60db6dbd21652af3a9/node_modules/make-empty-dir/index.js
var require_make_empty_dir = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/make-empty-dir/3.0.2/a7a4cf98e6272554434a37f2ec0a891cf0089041cf92ad60db6dbd21652af3a9/node_modules/make-empty-dir/index.js"(exports, module) {
    "use strict";
    var fs8 = __require("fs");
    var path12 = __require("path");
    var rimraf3 = require_rimraf();
    module.exports = async function makeEmptyDir2(dir, opts2) {
      if (opts2 && opts2.recursive) {
        await fs8.promises.mkdir(path12.dirname(dir), { recursive: true });
      }
      try {
        await fs8.promises.mkdir(dir);
        return "created";
      } catch (err) {
        if (err.code === "EEXIST") {
          await removeContentsOfDir(dir);
          return "emptied";
        }
        throw err;
      }
    };
    async function removeContentsOfDir(dir) {
      const items = await fs8.promises.readdir(dir);
      for (const item of items) {
        await rimraf3(path12.join(dir, item));
      }
    }
    module.exports.sync = function makeEmptyDirSync(dir, opts2) {
      if (opts2 && opts2.recursive) {
        fs8.mkdirSync(path12.dirname(dir), { recursive: true });
      }
      try {
        fs8.mkdirSync(dir);
        return "created";
      } catch (err) {
        if (err.code === "EEXIST") {
          removeContentsOfDirSync(dir);
          return "emptied";
        }
        throw err;
      }
    };
    function removeContentsOfDirSync(dir) {
      const items = fs8.readdirSync(dir);
      for (const item of items) {
        rimraf3.sync(path12.join(dir, item));
      }
    }
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/truncate-utf8-bytes/1.0.2/7c78b0bbe6d5f84254c7db363048f82104855b0c1f0f4e9e899c59a14af989cc/node_modules/truncate-utf8-bytes/lib/truncate.js
var require_truncate = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/truncate-utf8-bytes/1.0.2/7c78b0bbe6d5f84254c7db363048f82104855b0c1f0f4e9e899c59a14af989cc/node_modules/truncate-utf8-bytes/lib/truncate.js"(exports, module) {
    "use strict";
    function isHighSurrogate(codePoint) {
      return codePoint >= 55296 && codePoint <= 56319;
    }
    function isLowSurrogate(codePoint) {
      return codePoint >= 56320 && codePoint <= 57343;
    }
    module.exports = function truncate(getLength, string, byteLength) {
      if (typeof string !== "string") {
        throw new Error("Input must be string");
      }
      var charLength = string.length;
      var curByteLength = 0;
      var codePoint;
      var segment;
      for (var i = 0; i < charLength; i += 1) {
        codePoint = string.charCodeAt(i);
        segment = string[i];
        if (isHighSurrogate(codePoint) && isLowSurrogate(string.charCodeAt(i + 1))) {
          i += 1;
          segment += string[i];
        }
        curByteLength += getLength(segment);
        if (curByteLength === byteLength) {
          return string.slice(0, i + 1);
        } else if (curByteLength > byteLength) {
          return string.slice(0, i - segment.length + 1);
        }
      }
      return string;
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/truncate-utf8-bytes/1.0.2/7c78b0bbe6d5f84254c7db363048f82104855b0c1f0f4e9e899c59a14af989cc/node_modules/truncate-utf8-bytes/index.js
var require_truncate_utf8_bytes = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/truncate-utf8-bytes/1.0.2/7c78b0bbe6d5f84254c7db363048f82104855b0c1f0f4e9e899c59a14af989cc/node_modules/truncate-utf8-bytes/index.js"(exports, module) {
    "use strict";
    var truncate = require_truncate();
    var getLength = Buffer.byteLength.bind(Buffer);
    module.exports = truncate.bind(null, getLength);
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/sanitize-filename/1.6.3/d2e7b1b6cae60055812f79cb4c27e7d778f88323eb2cdd9d7ae9e18bc75a6f44/node_modules/sanitize-filename/index.js
var require_sanitize_filename = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/sanitize-filename/1.6.3/d2e7b1b6cae60055812f79cb4c27e7d778f88323eb2cdd9d7ae9e18bc75a6f44/node_modules/sanitize-filename/index.js"(exports, module) {
    "use strict";
    var truncate = require_truncate_utf8_bytes();
    var illegalRe = /[\/\?<>\\:\*\|"]/g;
    var controlRe = /[\x00-\x1f\x80-\x9f]/g;
    var reservedRe = /^\.+$/;
    var windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
    var windowsTrailingRe = /[\. ]+$/;
    function sanitize(input, replacement) {
      if (typeof input !== "string") {
        throw new Error("Input must be string");
      }
      var sanitized = input.replace(illegalRe, replacement).replace(controlRe, replacement).replace(reservedRe, replacement).replace(windowsReservedRe, replacement).replace(windowsTrailingRe, replacement);
      return truncate(sanitized, 255);
    }
    module.exports = function(input, options) {
      var replacement = options && options.replacement || "";
      var output = sanitize(input, replacement);
      if (replacement === "") {
        return output;
      }
      return sanitize(output, "");
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/crypto-random-string/2.0.0/39da4e0501c366f796372d74a308fbe61e7b4c954c8025e4c99c574e5bb761d9/node_modules/crypto-random-string/index.js
var require_crypto_random_string = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/crypto-random-string/2.0.0/39da4e0501c366f796372d74a308fbe61e7b4c954c8025e4c99c574e5bb761d9/node_modules/crypto-random-string/index.js"(exports, module) {
    "use strict";
    var crypto4 = __require("crypto");
    module.exports = (length) => {
      if (!Number.isFinite(length)) {
        throw new TypeError("Expected a finite number");
      }
      return crypto4.randomBytes(Math.ceil(length / 2)).toString("hex").slice(0, length);
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/unique-string/2.0.0/b2f9c7033829ac007c9affda02415b91dee75b1068fe7914c7cab5e6bbd61ff7/node_modules/unique-string/index.js
var require_unique_string = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/unique-string/2.0.0/b2f9c7033829ac007c9affda02415b91dee75b1068fe7914c7cab5e6bbd61ff7/node_modules/unique-string/index.js"(exports, module) {
    "use strict";
    var cryptoRandomString = require_crypto_random_string();
    module.exports = () => cryptoRandomString(32);
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/path-temp/2.1.0/d7824a086fb07b11420b3b0113b79cda53a7d8f47c2f7ff4185cf13bacac3194/node_modules/path-temp/index.js
var require_path_temp = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/path-temp/2.1.0/d7824a086fb07b11420b3b0113b79cda53a7d8f47c2f7ff4185cf13bacac3194/node_modules/path-temp/index.js"(exports, module) {
    "use strict";
    var path12 = __require("path");
    var uniqueString = require_unique_string();
    module.exports = function pathTemp5(folder) {
      return path12.join(folder, `_tmp_${process.pid}_${uniqueString()}`);
    };
    module.exports.fastPathTemp = function pathTempFast(file) {
      return path12.join(path12.dirname(file), `${path12.basename(file)}_tmp_${process.pid}`);
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@reflink/reflink/0.1.19/69ec5bc39db08fabe77ff1fba04a06a78d01ed31edb937aaee474969e0d4470d/node_modules/@reflink/reflink/binding.js
var require_binding = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@reflink/reflink/0.1.19/69ec5bc39db08fabe77ff1fba04a06a78d01ed31edb937aaee474969e0d4470d/node_modules/@reflink/reflink/binding.js"(exports, module) {
    var { existsSync: existsSync2, readFileSync } = __require("fs");
    var { join } = __require("path");
    var { platform, arch } = process;
    var nativeBinding = null;
    var localFileExisted = false;
    var loadError = null;
    function isMusl() {
      if (!process.report || typeof process.report.getReport !== "function") {
        try {
          const lddPath = __require("child_process").execSync("which ldd").toString().trim();
          return readFileSync(lddPath, "utf8").includes("musl");
        } catch (e) {
          return true;
        }
      } else {
        const { glibcVersionRuntime } = process.report.getReport().header;
        return !glibcVersionRuntime;
      }
    }
    switch (platform) {
      case "android":
        switch (arch) {
          case "arm64":
            localFileExisted = existsSync2(join(__dirname, "reflink.android-arm64.node"));
            try {
              if (localFileExisted) {
                nativeBinding = __require("./reflink.android-arm64.node");
              } else {
                nativeBinding = __require("@reflink/reflink-android-arm64");
              }
            } catch (e) {
              loadError = e;
            }
            break;
          case "arm":
            localFileExisted = existsSync2(join(__dirname, "reflink.android-arm-eabi.node"));
            try {
              if (localFileExisted) {
                nativeBinding = __require("./reflink.android-arm-eabi.node");
              } else {
                nativeBinding = __require("@reflink/reflink-android-arm-eabi");
              }
            } catch (e) {
              loadError = e;
            }
            break;
          default:
            throw new Error(`Unsupported architecture on Android ${arch}`);
        }
        break;
      case "win32":
        switch (arch) {
          case "x64":
            localFileExisted = existsSync2(
              join(__dirname, "reflink.win32-x64-msvc.node")
            );
            try {
              if (localFileExisted) {
                nativeBinding = __require("./reflink.win32-x64-msvc.node");
              } else {
                nativeBinding = __require("@reflink/reflink-win32-x64-msvc");
              }
            } catch (e) {
              loadError = e;
            }
            break;
          case "ia32":
            localFileExisted = existsSync2(
              join(__dirname, "reflink.win32-ia32-msvc.node")
            );
            try {
              if (localFileExisted) {
                nativeBinding = __require("./reflink.win32-ia32-msvc.node");
              } else {
                nativeBinding = __require("@reflink/reflink-win32-ia32-msvc");
              }
            } catch (e) {
              loadError = e;
            }
            break;
          case "arm64":
            localFileExisted = existsSync2(
              join(__dirname, "reflink.win32-arm64-msvc.node")
            );
            try {
              if (localFileExisted) {
                nativeBinding = __require("./reflink.win32-arm64-msvc.node");
              } else {
                nativeBinding = __require("@reflink/reflink-win32-arm64-msvc");
              }
            } catch (e) {
              loadError = e;
            }
            break;
          default:
            throw new Error(`Unsupported architecture on Windows: ${arch}`);
        }
        break;
      case "darwin":
        localFileExisted = existsSync2(join(__dirname, "reflink.darwin-universal.node"));
        try {
          if (localFileExisted) {
            nativeBinding = __require("./reflink.darwin-universal.node");
          } else {
            nativeBinding = __require("@reflink/reflink-darwin-universal");
          }
          break;
        } catch {
        }
        switch (arch) {
          case "x64":
            localFileExisted = existsSync2(join(__dirname, "reflink.darwin-x64.node"));
            try {
              if (localFileExisted) {
                nativeBinding = __require("./reflink.darwin-x64.node");
              } else {
                nativeBinding = __require("@reflink/reflink-darwin-x64");
              }
            } catch (e) {
              loadError = e;
            }
            break;
          case "arm64":
            localFileExisted = existsSync2(
              join(__dirname, "reflink.darwin-arm64.node")
            );
            try {
              if (localFileExisted) {
                nativeBinding = __require("./reflink.darwin-arm64.node");
              } else {
                nativeBinding = __require("@reflink/reflink-darwin-arm64");
              }
            } catch (e) {
              loadError = e;
            }
            break;
          default:
            throw new Error(`Unsupported architecture on macOS: ${arch}`);
        }
        break;
      case "freebsd":
        if (arch !== "x64") {
          throw new Error(`Unsupported architecture on FreeBSD: ${arch}`);
        }
        localFileExisted = existsSync2(join(__dirname, "reflink.freebsd-x64.node"));
        try {
          if (localFileExisted) {
            nativeBinding = __require("./reflink.freebsd-x64.node");
          } else {
            nativeBinding = __require("@reflink/reflink-freebsd-x64");
          }
        } catch (e) {
          loadError = e;
        }
        break;
      case "linux":
        switch (arch) {
          case "x64":
            if (isMusl()) {
              localFileExisted = existsSync2(
                join(__dirname, "reflink.linux-x64-musl.node")
              );
              try {
                if (localFileExisted) {
                  nativeBinding = __require("./reflink.linux-x64-musl.node");
                } else {
                  nativeBinding = __require("@reflink/reflink-linux-x64-musl");
                }
              } catch (e) {
                loadError = e;
              }
            } else {
              localFileExisted = existsSync2(
                join(__dirname, "reflink.linux-x64-gnu.node")
              );
              try {
                if (localFileExisted) {
                  nativeBinding = __require("./reflink.linux-x64-gnu.node");
                } else {
                  nativeBinding = __require("@reflink/reflink-linux-x64-gnu");
                }
              } catch (e) {
                loadError = e;
              }
            }
            break;
          case "arm64":
            if (isMusl()) {
              localFileExisted = existsSync2(
                join(__dirname, "reflink.linux-arm64-musl.node")
              );
              try {
                if (localFileExisted) {
                  nativeBinding = __require("./reflink.linux-arm64-musl.node");
                } else {
                  nativeBinding = __require("@reflink/reflink-linux-arm64-musl");
                }
              } catch (e) {
                loadError = e;
              }
            } else {
              localFileExisted = existsSync2(
                join(__dirname, "reflink.linux-arm64-gnu.node")
              );
              try {
                if (localFileExisted) {
                  nativeBinding = __require("./reflink.linux-arm64-gnu.node");
                } else {
                  nativeBinding = __require("@reflink/reflink-linux-arm64-gnu");
                }
              } catch (e) {
                loadError = e;
              }
            }
            break;
          case "arm":
            localFileExisted = existsSync2(
              join(__dirname, "reflink.linux-arm-gnueabihf.node")
            );
            try {
              if (localFileExisted) {
                nativeBinding = __require("./reflink.linux-arm-gnueabihf.node");
              } else {
                nativeBinding = __require("@reflink/reflink-linux-arm-gnueabihf");
              }
            } catch (e) {
              loadError = e;
            }
            break;
          default:
            throw new Error(`Unsupported architecture on Linux: ${arch}`);
        }
        break;
      default:
        throw new Error(`Unsupported OS: ${platform}, architecture: ${arch}`);
    }
    if (!nativeBinding) {
      if (loadError) {
        throw loadError;
      }
      throw new Error(`Failed to load native binding`);
    }
    var { ReflinkError, reflinkFile, reflinkFileSync } = nativeBinding;
    module.exports.ReflinkError = ReflinkError;
    module.exports.reflinkFile = reflinkFile;
    module.exports.reflinkFileSync = reflinkFileSync;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@reflink/reflink/0.1.19/69ec5bc39db08fabe77ff1fba04a06a78d01ed31edb937aaee474969e0d4470d/node_modules/@reflink/reflink/index.js
var require_reflink = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@reflink/reflink/0.1.19/69ec5bc39db08fabe77ff1fba04a06a78d01ed31edb937aaee474969e0d4470d/node_modules/@reflink/reflink/index.js"(exports, module) {
    var binding = require_binding();
    function createReflinkError(reflinkError) {
      const error = new Error(reflinkError.message);
      return Object.assign(error, {
        path: reflinkError.path,
        dest: reflinkError.dest,
        code: reflinkError.code,
        errno: reflinkError.errno
      });
    }
    function handleReflinkResult(result) {
      if (typeof result === "number") {
        return result;
      } else {
        throw createReflinkError(result);
      }
    }
    var reflinkFile = (src2, dst) => binding.reflinkFile(src2, dst).then(handleReflinkResult);
    var reflinkFileSync = (src2, dst) => handleReflinkResult(binding.reflinkFileSync(src2, dst));
    module.exports = {
      reflinkFile,
      reflinkFileSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/detect-libc/2.0.4/1f119f8f86dde21608f96a8c76437965be7db38047714482319e9daddc37e2b7/node_modules/detect-libc/lib/process.js
var require_process = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/detect-libc/2.0.4/1f119f8f86dde21608f96a8c76437965be7db38047714482319e9daddc37e2b7/node_modules/detect-libc/lib/process.js"(exports, module) {
    "use strict";
    var isLinux = () => process.platform === "linux";
    var report = null;
    var getReport = () => {
      if (!report) {
        if (isLinux() && process.report) {
          const orig = process.report.excludeNetwork;
          process.report.excludeNetwork = true;
          report = process.report.getReport();
          process.report.excludeNetwork = orig;
        } else {
          report = {};
        }
      }
      return report;
    };
    module.exports = { isLinux, getReport };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/detect-libc/2.0.4/1f119f8f86dde21608f96a8c76437965be7db38047714482319e9daddc37e2b7/node_modules/detect-libc/lib/filesystem.js
var require_filesystem = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/detect-libc/2.0.4/1f119f8f86dde21608f96a8c76437965be7db38047714482319e9daddc37e2b7/node_modules/detect-libc/lib/filesystem.js"(exports, module) {
    "use strict";
    var fs8 = __require("fs");
    var LDD_PATH = "/usr/bin/ldd";
    var readFileSync = (path12) => fs8.readFileSync(path12, "utf-8");
    var readFile = (path12) => new Promise((resolve, reject) => {
      fs8.readFile(path12, "utf-8", (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
    module.exports = {
      LDD_PATH,
      readFileSync,
      readFile
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/detect-libc/2.0.4/1f119f8f86dde21608f96a8c76437965be7db38047714482319e9daddc37e2b7/node_modules/detect-libc/lib/detect-libc.js
var require_detect_libc = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/detect-libc/2.0.4/1f119f8f86dde21608f96a8c76437965be7db38047714482319e9daddc37e2b7/node_modules/detect-libc/lib/detect-libc.js"(exports, module) {
    "use strict";
    var childProcess = __require("child_process");
    var { isLinux, getReport } = require_process();
    var { LDD_PATH, readFile, readFileSync } = require_filesystem();
    var cachedFamilyFilesystem;
    var cachedVersionFilesystem;
    var command = "getconf GNU_LIBC_VERSION 2>&1 || true; ldd --version 2>&1 || true";
    var commandOut = "";
    var safeCommand = () => {
      if (!commandOut) {
        return new Promise((resolve) => {
          childProcess.exec(command, (err, out) => {
            commandOut = err ? " " : out;
            resolve(commandOut);
          });
        });
      }
      return commandOut;
    };
    var safeCommandSync = () => {
      if (!commandOut) {
        try {
          commandOut = childProcess.execSync(command, { encoding: "utf8" });
        } catch (_err) {
          commandOut = " ";
        }
      }
      return commandOut;
    };
    var GLIBC = "glibc";
    var RE_GLIBC_VERSION = /LIBC[a-z0-9 \-).]*?(\d+\.\d+)/i;
    var MUSL = "musl";
    var isFileMusl = (f) => f.includes("libc.musl-") || f.includes("ld-musl-");
    var familyFromReport = () => {
      const report = getReport();
      if (report.header && report.header.glibcVersionRuntime) {
        return GLIBC;
      }
      if (Array.isArray(report.sharedObjects)) {
        if (report.sharedObjects.some(isFileMusl)) {
          return MUSL;
        }
      }
      return null;
    };
    var familyFromCommand = (out) => {
      const [getconf, ldd1] = out.split(/[\r\n]+/);
      if (getconf && getconf.includes(GLIBC)) {
        return GLIBC;
      }
      if (ldd1 && ldd1.includes(MUSL)) {
        return MUSL;
      }
      return null;
    };
    var getFamilyFromLddContent = (content) => {
      if (content.includes("musl")) {
        return MUSL;
      }
      if (content.includes("GNU C Library")) {
        return GLIBC;
      }
      return null;
    };
    var familyFromFilesystem = async () => {
      if (cachedFamilyFilesystem !== void 0) {
        return cachedFamilyFilesystem;
      }
      cachedFamilyFilesystem = null;
      try {
        const lddContent = await readFile(LDD_PATH);
        cachedFamilyFilesystem = getFamilyFromLddContent(lddContent);
      } catch (e) {
      }
      return cachedFamilyFilesystem;
    };
    var familyFromFilesystemSync = () => {
      if (cachedFamilyFilesystem !== void 0) {
        return cachedFamilyFilesystem;
      }
      cachedFamilyFilesystem = null;
      try {
        const lddContent = readFileSync(LDD_PATH);
        cachedFamilyFilesystem = getFamilyFromLddContent(lddContent);
      } catch (e) {
      }
      return cachedFamilyFilesystem;
    };
    var family = async () => {
      let family2 = null;
      if (isLinux()) {
        family2 = await familyFromFilesystem();
        if (!family2) {
          family2 = familyFromReport();
        }
        if (!family2) {
          const out = await safeCommand();
          family2 = familyFromCommand(out);
        }
      }
      return family2;
    };
    var familySync = () => {
      let family2 = null;
      if (isLinux()) {
        family2 = familyFromFilesystemSync();
        if (!family2) {
          family2 = familyFromReport();
        }
        if (!family2) {
          const out = safeCommandSync();
          family2 = familyFromCommand(out);
        }
      }
      return family2;
    };
    var isNonGlibcLinux = async () => isLinux() && await family() !== GLIBC;
    var isNonGlibcLinuxSync = () => isLinux() && familySync() !== GLIBC;
    var versionFromFilesystem = async () => {
      if (cachedVersionFilesystem !== void 0) {
        return cachedVersionFilesystem;
      }
      cachedVersionFilesystem = null;
      try {
        const lddContent = await readFile(LDD_PATH);
        const versionMatch = lddContent.match(RE_GLIBC_VERSION);
        if (versionMatch) {
          cachedVersionFilesystem = versionMatch[1];
        }
      } catch (e) {
      }
      return cachedVersionFilesystem;
    };
    var versionFromFilesystemSync = () => {
      if (cachedVersionFilesystem !== void 0) {
        return cachedVersionFilesystem;
      }
      cachedVersionFilesystem = null;
      try {
        const lddContent = readFileSync(LDD_PATH);
        const versionMatch = lddContent.match(RE_GLIBC_VERSION);
        if (versionMatch) {
          cachedVersionFilesystem = versionMatch[1];
        }
      } catch (e) {
      }
      return cachedVersionFilesystem;
    };
    var versionFromReport = () => {
      const report = getReport();
      if (report.header && report.header.glibcVersionRuntime) {
        return report.header.glibcVersionRuntime;
      }
      return null;
    };
    var versionSuffix = (s) => s.trim().split(/\s+/)[1];
    var versionFromCommand = (out) => {
      const [getconf, ldd1, ldd2] = out.split(/[\r\n]+/);
      if (getconf && getconf.includes(GLIBC)) {
        return versionSuffix(getconf);
      }
      if (ldd1 && ldd2 && ldd1.includes(MUSL)) {
        return versionSuffix(ldd2);
      }
      return null;
    };
    var version = async () => {
      let version2 = null;
      if (isLinux()) {
        version2 = await versionFromFilesystem();
        if (!version2) {
          version2 = versionFromReport();
        }
        if (!version2) {
          const out = await safeCommand();
          version2 = versionFromCommand(out);
        }
      }
      return version2;
    };
    var versionSync = () => {
      let version2 = null;
      if (isLinux()) {
        version2 = versionFromFilesystemSync();
        if (!version2) {
          version2 = versionFromReport();
        }
        if (!version2) {
          const out = safeCommandSync();
          version2 = versionFromCommand(out);
        }
      }
      return version2;
    };
    module.exports = {
      GLIBC,
      MUSL,
      family,
      familySync,
      isNonGlibcLinux,
      isNonGlibcLinuxSync,
      version,
      versionSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/node-gyp-build-optional-packages/5.2.2/28884430bf0480cf9e225275634516b3d1409cf567d5f3e5533b4865019c36a5/node_modules/node-gyp-build-optional-packages/node-gyp-build.js
var require_node_gyp_build = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/node-gyp-build-optional-packages/5.2.2/28884430bf0480cf9e225275634516b3d1409cf567d5f3e5533b4865019c36a5/node_modules/node-gyp-build-optional-packages/node-gyp-build.js"(exports, module) {
    var fs8 = __require("fs");
    var path12 = __require("path");
    var url = __require("url");
    var os = __require("os");
    var runtimeRequire = typeof __webpack_require__ === "function" ? __non_webpack_require__ : __require;
    var vars = process.config && process.config.variables || {};
    var prebuildsOnly = !!process.env.PREBUILDS_ONLY;
    var versions = process.versions;
    var abi = versions.modules;
    if (versions.deno || process.isBun) {
      abi = "unsupported";
    }
    var runtime = isElectron() ? "electron" : isNwjs() ? "node-webkit" : "node";
    var arch = process.env.npm_config_arch || os.arch();
    var platform = process.env.npm_config_platform || os.platform();
    var libc = process.env.LIBC || (isMusl(platform) ? "musl" : "glibc");
    var armv = process.env.ARM_VERSION || (arch === "arm64" ? "8" : vars.arm_version) || "";
    var uv = (versions.uv || "").split(".")[0];
    module.exports = load;
    function load(dir) {
      return runtimeRequire(load.resolve(dir));
    }
    load.resolve = load.path = function(dir) {
      dir = path12.resolve(dir || ".");
      var packageName = "";
      var packageNameError;
      try {
        packageName = runtimeRequire(path12.join(dir, "package.json")).name;
        var varName = packageName.toUpperCase().replace(/-/g, "_");
        if (process.env[varName + "_PREBUILD"]) dir = process.env[varName + "_PREBUILD"];
      } catch (err) {
        packageNameError = err;
      }
      if (!prebuildsOnly) {
        var release = getFirst(path12.join(dir, "build/Release"), matchBuild);
        if (release) return release;
        var debug = getFirst(path12.join(dir, "build/Debug"), matchBuild);
        if (debug) return debug;
      }
      var prebuild = resolve(dir);
      if (prebuild) return prebuild;
      var nearby = resolve(path12.dirname(process.execPath));
      if (nearby) return nearby;
      var platformPackage = (packageName[0] == "@" ? "" : "@" + packageName + "/") + packageName + "-" + platform + "-" + arch;
      var packageResolutionError;
      try {
        var prebuildPackage = path12.dirname(__require("module").createRequire(url.pathToFileURL(path12.join(dir, "package.json"))).resolve(platformPackage));
        return resolveFile(prebuildPackage);
      } catch (error) {
        packageResolutionError = error;
      }
      var target2 = [
        "platform=" + platform,
        "arch=" + arch,
        "runtime=" + runtime,
        "abi=" + abi,
        "uv=" + uv,
        armv ? "armv=" + armv : "",
        "libc=" + libc,
        "node=" + process.versions.node,
        process.versions.electron ? "electron=" + process.versions.electron : "",
        typeof __webpack_require__ === "function" ? "webpack=true" : ""
        // eslint-disable-line
      ].filter(Boolean).join(" ");
      let errMessage = "No native build was found for " + target2 + "\n    attempted loading from: " + dir + " and package: " + platformPackage + "\n";
      if (packageNameError) {
        errMessage += "Error finding package.json: " + packageNameError.message + "\n";
      }
      if (packageResolutionError) {
        errMessage += "Error resolving package: " + packageResolutionError.message + "\n";
      }
      throw new Error(errMessage);
      function resolve(dir2) {
        var tuples = readdirSync(path12.join(dir2, "prebuilds")).map(parseTuple);
        var tuple = tuples.filter(matchTuple(platform, arch)).sort(compareTuples)[0];
        if (!tuple) return;
        return resolveFile(path12.join(dir2, "prebuilds", tuple.name));
      }
      function resolveFile(prebuilds) {
        var parsed = readdirSync(prebuilds).map(parseTags);
        var candidates = parsed.filter(matchTags(runtime, abi));
        var winner = candidates.sort(compareTags(runtime))[0];
        if (winner) return path12.join(prebuilds, winner.file);
      }
    };
    function readdirSync(dir) {
      try {
        return fs8.readdirSync(dir);
      } catch (err) {
        return [];
      }
    }
    function getFirst(dir, filter) {
      var files = readdirSync(dir).filter(filter);
      return files[0] && path12.join(dir, files[0]);
    }
    function matchBuild(name) {
      return /\.node$/.test(name);
    }
    function parseTuple(name) {
      var arr = name.split("-");
      if (arr.length !== 2) return;
      var platform2 = arr[0];
      var architectures = arr[1].split("+");
      if (!platform2) return;
      if (!architectures.length) return;
      if (!architectures.every(Boolean)) return;
      return { name, platform: platform2, architectures };
    }
    function matchTuple(platform2, arch2) {
      return function(tuple) {
        if (tuple == null) return false;
        if (tuple.platform !== platform2) return false;
        return tuple.architectures.includes(arch2);
      };
    }
    function compareTuples(a, b) {
      return a.architectures.length - b.architectures.length;
    }
    function parseTags(file) {
      var arr = file.split(".");
      var extension = arr.pop();
      var tags = { file, specificity: 0 };
      if (extension !== "node") return;
      for (var i = 0; i < arr.length; i++) {
        var tag = arr[i];
        if (tag === "node" || tag === "electron" || tag === "node-webkit") {
          tags.runtime = tag;
        } else if (tag === "napi") {
          tags.napi = true;
        } else if (tag.slice(0, 3) === "abi") {
          tags.abi = tag.slice(3);
        } else if (tag.slice(0, 2) === "uv") {
          tags.uv = tag.slice(2);
        } else if (tag.slice(0, 4) === "armv") {
          tags.armv = tag.slice(4);
        } else if (tag === "glibc" || tag === "musl") {
          tags.libc = tag;
        } else {
          continue;
        }
        tags.specificity++;
      }
      return tags;
    }
    function matchTags(runtime2, abi2) {
      return function(tags) {
        if (tags == null) return false;
        if (tags.runtime !== runtime2 && !runtimeAgnostic(tags)) return false;
        if (tags.abi !== abi2 && !tags.napi) return false;
        if (tags.uv && tags.uv !== uv) return false;
        if (tags.armv && tags.armv !== armv) return false;
        if (tags.libc && tags.libc !== libc) return false;
        return true;
      };
    }
    function runtimeAgnostic(tags) {
      return tags.runtime === "node" && tags.napi;
    }
    function compareTags(runtime2) {
      return function(a, b) {
        if (a.runtime !== b.runtime) {
          return a.runtime === runtime2 ? -1 : 1;
        } else if (a.abi !== b.abi) {
          return a.abi ? -1 : 1;
        } else if (a.specificity !== b.specificity) {
          return a.specificity > b.specificity ? -1 : 1;
        } else {
          return 0;
        }
      };
    }
    function isNwjs() {
      return !!(process.versions && process.versions.nw);
    }
    function isElectron() {
      if (process.versions && process.versions.electron) return true;
      if (process.env.ELECTRON_RUN_AS_NODE) return true;
      return typeof window !== "undefined" && window.process && window.process.type === "renderer";
    }
    function isMusl(platform2) {
      if (platform2 !== "linux") return false;
      const { familySync, MUSL } = require_detect_libc();
      return familySync() === MUSL;
    }
    load.parseTags = parseTags;
    load.matchTags = matchTags;
    load.compareTags = compareTags;
    load.parseTuple = parseTuple;
    load.matchTuple = matchTuple;
    load.compareTuples = compareTuples;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/node-gyp-build-optional-packages/5.2.2/28884430bf0480cf9e225275634516b3d1409cf567d5f3e5533b4865019c36a5/node_modules/node-gyp-build-optional-packages/index.js
var require_node_gyp_build_optional_packages = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/node-gyp-build-optional-packages/5.2.2/28884430bf0480cf9e225275634516b3d1409cf567d5f3e5533b4865019c36a5/node_modules/node-gyp-build-optional-packages/index.js"(exports, module) {
    var runtimeRequire = typeof __webpack_require__ === "function" ? __non_webpack_require__ : __require;
    if (typeof runtimeRequire.addon === "function") {
      module.exports = runtimeRequire.addon.bind(runtimeRequire);
    } else {
      module.exports = require_node_gyp_build();
    }
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/msgpackr-extract/3.0.3/86b464d19b7b80ef2cd42dafda478bf87e334f757a77ab3a4812eaba7ecc0406/node_modules/msgpackr-extract/index.js
var require_msgpackr_extract = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/msgpackr-extract/3.0.3/86b464d19b7b80ef2cd42dafda478bf87e334f757a77ab3a4812eaba7ecc0406/node_modules/msgpackr-extract/index.js"(exports, module) {
    module.exports = require_node_gyp_build_optional_packages()(__dirname);
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/rename-overwrite/6.0.3/b4ff636ccc6bf2c9e9f7e8aca35c8c8f2162cbf7880a216c3e1986052b7c8879/node_modules/rename-overwrite/index.js
var require_rename_overwrite2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/rename-overwrite/6.0.3/b4ff636ccc6bf2c9e9f7e8aca35c8c8f2162cbf7880a216c3e1986052b7c8879/node_modules/rename-overwrite/index.js"(exports, module) {
    "use strict";
    var fs8 = __require("fs");
    var { copySync, copy } = require_lib();
    var path12 = __require("path");
    var rimraf3 = require_rimraf();
    module.exports = async function renameOverwrite4(oldPath, newPath, retry = 0) {
      try {
        await fs8.promises.rename(oldPath, newPath);
      } catch (err) {
        retry++;
        if (retry > 3) throw err;
        switch (err.code) {
          case "ENOTEMPTY":
          case "EEXIST":
          case "ENOTDIR":
            await rimraf3(newPath);
            await renameOverwrite4(oldPath, newPath, retry);
            break;
          // Windows Antivirus issues
          case "EPERM":
          case "EACCESS":
          case "EBUSY": {
            await rimraf3(newPath);
            const start = Date.now();
            let backoff = 0;
            let lastError = err;
            while (Date.now() - start < 6e4 && (lastError.code === "EPERM" || lastError.code === "EACCESS" || lastError.code === "EBUSY")) {
              await new Promise((resolve) => setTimeout(resolve, backoff));
              try {
                await fs8.promises.rename(oldPath, newPath);
                return;
              } catch (err2) {
                lastError = err2;
              }
              if (backoff < 100) {
                backoff += 10;
              }
            }
            throw lastError;
          }
          case "ENOENT":
            try {
              await fs8.promises.stat(oldPath);
            } catch (statErr) {
              if (statErr.code === "ENOENT") {
                throw statErr;
              }
            }
            await fs8.promises.mkdir(path12.dirname(newPath), { recursive: true });
            await renameOverwrite4(oldPath, newPath, retry);
            break;
          // Crossing filesystem boundaries so rename is not available
          case "EXDEV":
            try {
              await rimraf3(newPath);
            } catch (rimrafErr) {
              if (rimrafErr.code !== "ENOENT") {
                throw rimrafErr;
              }
            }
            await copy(oldPath, newPath);
            await rimraf3(oldPath);
            break;
          default:
            throw err;
        }
      }
    };
    module.exports.sync = function renameOverwriteSync(oldPath, newPath, retry = 0) {
      try {
        fs8.renameSync(oldPath, newPath);
      } catch (err) {
        retry++;
        if (retry > 3) throw err;
        switch (err.code) {
          // Windows Antivirus issues
          case "EPERM":
          case "EACCESS":
          case "EBUSY": {
            rimraf3.sync(newPath);
            const start = Date.now();
            let backoff = 0;
            let lastError = err;
            while (Date.now() - start < 6e4 && (lastError.code === "EPERM" || lastError.code === "EACCESS" || lastError.code === "EBUSY")) {
              const waitUntil = Date.now() + backoff;
              while (waitUntil > Date.now()) {
              }
              try {
                fs8.renameSync(oldPath, newPath);
                return;
              } catch (err2) {
                lastError = err2;
              }
              if (backoff < 100) {
                backoff += 10;
              }
            }
            throw lastError;
          }
          case "ENOTEMPTY":
          case "EEXIST":
          case "ENOTDIR":
            rimraf3.sync(newPath);
            fs8.renameSync(oldPath, newPath);
            return;
          case "ENOENT":
            fs8.mkdirSync(path12.dirname(newPath), { recursive: true });
            renameOverwriteSync(oldPath, newPath, retry);
            return;
          // Crossing filesystem boundaries so rename is not available
          case "EXDEV":
            try {
              rimraf3.sync(newPath);
            } catch (rimrafErr) {
              if (rimrafErr.code !== "ENOENT") {
                throw rimrafErr;
              }
            }
            copySync(oldPath, newPath);
            rimraf3.sync(oldPath);
            break;
          default:
            throw err;
        }
      }
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/symlink-dir/7.0.0/c1641d5c0846d1f7579a38fa41dc0945856e770bfd3fd940fb19354db93ebb82/node_modules/symlink-dir/dist/index.js
var require_dist = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/symlink-dir/7.0.0/c1641d5c0846d1f7579a38fa41dc0945856e770bfd3fd940fb19354db93ebb82/node_modules/symlink-dir/dist/index.js"(exports, module) {
    "use strict";
    var betterPathResolve = require_better_path_resolve();
    var fs_1 = __require("fs");
    var util8 = __require("util");
    var pathLib = __require("path");
    var renameOverwrite4 = require_rename_overwrite2();
    var IS_WINDOWS = process.platform === "win32" || /^(msys|cygwin)$/.test(process.env.OSTYPE);
    function resolveSrcOnWinJunction(src2) {
      return `${src2}\\`;
    }
    function resolveSrcOnTrueSymlink(src2, dest) {
      return pathLib.relative(pathLib.dirname(dest), src2);
    }
    function symlinkDir3(target2, path12, opts2) {
      path12 = betterPathResolve(path12);
      target2 = betterPathResolve(target2);
      if (target2 === path12)
        throw new Error(`Symlink path is the same as the target path (${target2})`);
      return forceSymlink(target2, path12, opts2);
    }
    function isExistingSymlinkUpToDate(wantedTarget, path12, linkString) {
      const existingTarget = pathLib.isAbsolute(linkString) ? linkString : pathLib.join(pathLib.dirname(path12), linkString);
      return pathLib.relative(wantedTarget, existingTarget) === "";
    }
    var createSymlinkAsync;
    var createSymlinkSync;
    if (IS_WINDOWS) {
      createSymlinkAsync = async (target2, path12) => {
        try {
          await createTrueSymlinkAsync(target2, path12);
          createSymlinkSync = createTrueSymlinkSync;
          createSymlinkAsync = createTrueSymlinkAsync;
        } catch (err) {
          if (err.code === "EPERM") {
            await createJunctionAsync(target2, path12);
            createSymlinkSync = createJunctionSync;
            createSymlinkAsync = createJunctionAsync;
          } else {
            throw err;
          }
        }
      };
      createSymlinkSync = (target2, path12) => {
        try {
          createTrueSymlinkSync(target2, path12);
          createSymlinkSync = createTrueSymlinkSync;
          createSymlinkAsync = createTrueSymlinkAsync;
        } catch (err) {
          if (err.code === "EPERM") {
            createJunctionSync(target2, path12);
            createSymlinkSync = createJunctionSync;
            createSymlinkAsync = createJunctionAsync;
          } else {
            throw err;
          }
        }
      };
    } else {
      createSymlinkAsync = createTrueSymlinkAsync;
      createSymlinkSync = createTrueSymlinkSync;
    }
    function createTrueSymlinkAsync(target2, path12) {
      return fs_1.promises.symlink(resolveSrcOnTrueSymlink(target2, path12), path12, "dir");
    }
    function createTrueSymlinkSync(target2, path12) {
      (0, fs_1.symlinkSync)(resolveSrcOnTrueSymlink(target2, path12), path12, "dir");
    }
    function createJunctionAsync(target2, path12) {
      return fs_1.promises.symlink(resolveSrcOnWinJunction(target2), path12, "junction");
    }
    function createJunctionSync(target2, path12) {
      (0, fs_1.symlinkSync)(resolveSrcOnWinJunction(target2), path12, "junction");
    }
    async function forceSymlink(target2, path12, opts2) {
      let initialErr;
      try {
        await createSymlinkAsync(target2, path12);
        return { reused: false };
      } catch (err) {
        switch (err.code) {
          case "ENOENT":
            try {
              await fs_1.promises.mkdir(pathLib.dirname(path12), { recursive: true });
            } catch (mkdirError) {
              mkdirError.message = `Error while trying to symlink "${target2}" to "${path12}". The error happened while trying to create the parent directory for the symlink target. Details: ${mkdirError}`;
              throw mkdirError;
            }
            await forceSymlink(target2, path12, opts2);
            return { reused: false };
          case "EEXIST":
          case "EISDIR":
            initialErr = err;
            break;
          default:
            throw err;
        }
      }
      let linkString;
      try {
        linkString = await fs_1.promises.readlink(path12);
      } catch (err) {
        if ((opts2 === null || opts2 === void 0 ? void 0 : opts2.overwrite) === false) {
          throw initialErr;
        }
        const parentDir = pathLib.dirname(path12);
        let warn;
        if (opts2 === null || opts2 === void 0 ? void 0 : opts2.renameTried) {
          await fs_1.promises.unlink(path12);
          warn = `Symlink wanted name was occupied by directory or file. Old entity removed: "${parentDir}${pathLib.sep}{${pathLib.basename(path12)}".`;
        } else {
          const ignore = `.ignored_${pathLib.basename(path12)}`;
          try {
            await renameOverwrite4(path12, pathLib.join(parentDir, ignore));
          } catch (error) {
            if (util8.types.isNativeError(error) && "code" in error && error.code === "ENOENT") {
              throw initialErr;
            }
            throw error;
          }
          warn = `Symlink wanted name was occupied by directory or file. Old entity moved: "${parentDir}${pathLib.sep}{${pathLib.basename(path12)} => ${ignore}".`;
        }
        return {
          ...await forceSymlink(target2, path12, { ...opts2, renameTried: true }),
          warn
        };
      }
      if (isExistingSymlinkUpToDate(target2, path12, linkString)) {
        return { reused: true };
      }
      if ((opts2 === null || opts2 === void 0 ? void 0 : opts2.overwrite) === false) {
        throw initialErr;
      }
      try {
        await fs_1.promises.unlink(path12);
      } catch (error) {
        if (!util8.types.isNativeError(error) || !("code" in error) || error.code !== "ENOENT") {
          throw error;
        }
      }
      return await forceSymlink(target2, path12, opts2);
    }
    symlinkDir3["default"] = symlinkDir3;
    (function(symlinkDir4) {
      function sync(target2, path12, opts2) {
        path12 = betterPathResolve(path12);
        target2 = betterPathResolve(target2);
        if (target2 === path12)
          throw new Error(`Symlink path is the same as the target path (${target2})`);
        return forceSymlinkSync(target2, path12, opts2);
      }
      symlinkDir4.sync = sync;
    })(symlinkDir3 || (symlinkDir3 = {}));
    function forceSymlinkSync(target2, path12, opts2) {
      let initialErr;
      try {
        createSymlinkSync(target2, path12);
        return { reused: false };
      } catch (err) {
        initialErr = err;
        switch (err.code) {
          case "ENOENT":
            try {
              (0, fs_1.mkdirSync)(pathLib.dirname(path12), { recursive: true });
            } catch (mkdirError) {
              mkdirError.message = `Error while trying to symlink "${target2}" to "${path12}". The error happened while trying to create the parent directory for the symlink target. Details: ${mkdirError}`;
              throw mkdirError;
            }
            forceSymlinkSync(target2, path12, opts2);
            return { reused: false };
          case "EEXIST":
          case "EISDIR":
            break;
          default:
            throw err;
        }
      }
      let linkString;
      try {
        linkString = (0, fs_1.readlinkSync)(path12);
      } catch (err) {
        if ((opts2 === null || opts2 === void 0 ? void 0 : opts2.overwrite) === false) {
          throw initialErr;
        }
        const parentDir = pathLib.dirname(path12);
        let warn;
        if (opts2 === null || opts2 === void 0 ? void 0 : opts2.renameTried) {
          (0, fs_1.unlinkSync)(path12);
          warn = `Symlink wanted name was occupied by directory or file. Old entity removed: "${parentDir}${pathLib.sep}{${pathLib.basename(path12)}".`;
        } else {
          const ignore = `.ignored_${pathLib.basename(path12)}`;
          try {
            renameOverwrite4.sync(path12, pathLib.join(parentDir, ignore));
          } catch (error) {
            if (util8.types.isNativeError(error) && "code" in error && error.code === "ENOENT") {
              throw initialErr;
            }
            throw error;
          }
          warn = `Symlink wanted name was occupied by directory or file. Old entity moved: "${parentDir}${pathLib.sep}{${pathLib.basename(path12)} => ${ignore}".`;
        }
        return {
          ...forceSymlinkSync(target2, path12, { ...opts2, renameTried: true }),
          warn
        };
      }
      if (isExistingSymlinkUpToDate(target2, path12, linkString)) {
        return { reused: true };
      }
      if ((opts2 === null || opts2 === void 0 ? void 0 : opts2.overwrite) === false) {
        throw initialErr;
      }
      try {
        (0, fs_1.unlinkSync)(path12);
      } catch (error) {
        if (!util8.types.isNativeError(error) || !("code" in error) || error.code !== "ENOENT") {
          throw error;
        }
      }
      return forceSymlinkSync(target2, path12, opts2);
    }
    module.exports = symlinkDir3;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/internal/constants.js
var require_constants = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/internal/constants.js"(exports, module) {
    "use strict";
    var SEMVER_SPEC_VERSION = "2.0.0";
    var MAX_LENGTH = 256;
    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
    9007199254740991;
    var MAX_SAFE_COMPONENT_LENGTH = 16;
    var MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
    var RELEASE_TYPES = [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ];
    module.exports = {
      MAX_LENGTH,
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_SAFE_INTEGER,
      RELEASE_TYPES,
      SEMVER_SPEC_VERSION,
      FLAG_INCLUDE_PRERELEASE: 1,
      FLAG_LOOSE: 2
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/internal/debug.js
var require_debug = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/internal/debug.js"(exports, module) {
    "use strict";
    var debug = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
    };
    module.exports = debug;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/internal/re.js
var require_re = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/internal/re.js"(exports, module) {
    "use strict";
    var {
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_LENGTH
    } = require_constants();
    var debug = require_debug();
    exports = module.exports = {};
    var re = exports.re = [];
    var safeRe = exports.safeRe = [];
    var src2 = exports.src = [];
    var safeSrc = exports.safeSrc = [];
    var t = exports.t = {};
    var R = 0;
    var LETTERDASHNUMBER = "[a-zA-Z0-9-]";
    var safeRegexReplacements = [
      ["\\s", 1],
      ["\\d", MAX_LENGTH],
      [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
    ];
    var makeSafeRegex = (value) => {
      for (const [token, max] of safeRegexReplacements) {
        value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
      }
      return value;
    };
    var createToken = (name, value, isGlobal) => {
      const safe = makeSafeRegex(value);
      const index = R++;
      debug(name, index, value);
      t[name] = index;
      src2[index] = value;
      safeSrc[index] = safe;
      re[index] = new RegExp(value, isGlobal ? "g" : void 0);
      safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
    };
    createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
    createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
    createToken("MAINVERSION", `(${src2[t.NUMERICIDENTIFIER]})\\.(${src2[t.NUMERICIDENTIFIER]})\\.(${src2[t.NUMERICIDENTIFIER]})`);
    createToken("MAINVERSIONLOOSE", `(${src2[t.NUMERICIDENTIFIERLOOSE]})\\.(${src2[t.NUMERICIDENTIFIERLOOSE]})\\.(${src2[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASEIDENTIFIER", `(?:${src2[t.NONNUMERICIDENTIFIER]}|${src2[t.NUMERICIDENTIFIER]})`);
    createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src2[t.NONNUMERICIDENTIFIER]}|${src2[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASE", `(?:-(${src2[t.PRERELEASEIDENTIFIER]}(?:\\.${src2[t.PRERELEASEIDENTIFIER]})*))`);
    createToken("PRERELEASELOOSE", `(?:-?(${src2[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src2[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
    createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
    createToken("BUILD", `(?:\\+(${src2[t.BUILDIDENTIFIER]}(?:\\.${src2[t.BUILDIDENTIFIER]})*))`);
    createToken("FULLPLAIN", `v?${src2[t.MAINVERSION]}${src2[t.PRERELEASE]}?${src2[t.BUILD]}?`);
    createToken("FULL", `^${src2[t.FULLPLAIN]}$`);
    createToken("LOOSEPLAIN", `[v=\\s]*${src2[t.MAINVERSIONLOOSE]}${src2[t.PRERELEASELOOSE]}?${src2[t.BUILD]}?`);
    createToken("LOOSE", `^${src2[t.LOOSEPLAIN]}$`);
    createToken("GTLT", "((?:<|>)?=?)");
    createToken("XRANGEIDENTIFIERLOOSE", `${src2[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    createToken("XRANGEIDENTIFIER", `${src2[t.NUMERICIDENTIFIER]}|x|X|\\*`);
    createToken("XRANGEPLAIN", `[v=\\s]*(${src2[t.XRANGEIDENTIFIER]})(?:\\.(${src2[t.XRANGEIDENTIFIER]})(?:\\.(${src2[t.XRANGEIDENTIFIER]})(?:${src2[t.PRERELEASE]})?${src2[t.BUILD]}?)?)?`);
    createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src2[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src2[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src2[t.XRANGEIDENTIFIERLOOSE]})(?:${src2[t.PRERELEASELOOSE]})?${src2[t.BUILD]}?)?)?`);
    createToken("XRANGE", `^${src2[t.GTLT]}\\s*${src2[t.XRANGEPLAIN]}$`);
    createToken("XRANGELOOSE", `^${src2[t.GTLT]}\\s*${src2[t.XRANGEPLAINLOOSE]}$`);
    createToken("COERCEPLAIN", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
    createToken("COERCE", `${src2[t.COERCEPLAIN]}(?:$|[^\\d])`);
    createToken("COERCEFULL", src2[t.COERCEPLAIN] + `(?:${src2[t.PRERELEASE]})?(?:${src2[t.BUILD]})?(?:$|[^\\d])`);
    createToken("COERCERTL", src2[t.COERCE], true);
    createToken("COERCERTLFULL", src2[t.COERCEFULL], true);
    createToken("LONETILDE", "(?:~>?)");
    createToken("TILDETRIM", `(\\s*)${src2[t.LONETILDE]}\\s+`, true);
    exports.tildeTrimReplace = "$1~";
    createToken("TILDE", `^${src2[t.LONETILDE]}${src2[t.XRANGEPLAIN]}$`);
    createToken("TILDELOOSE", `^${src2[t.LONETILDE]}${src2[t.XRANGEPLAINLOOSE]}$`);
    createToken("LONECARET", "(?:\\^)");
    createToken("CARETTRIM", `(\\s*)${src2[t.LONECARET]}\\s+`, true);
    exports.caretTrimReplace = "$1^";
    createToken("CARET", `^${src2[t.LONECARET]}${src2[t.XRANGEPLAIN]}$`);
    createToken("CARETLOOSE", `^${src2[t.LONECARET]}${src2[t.XRANGEPLAINLOOSE]}$`);
    createToken("COMPARATORLOOSE", `^${src2[t.GTLT]}\\s*(${src2[t.LOOSEPLAIN]})$|^$`);
    createToken("COMPARATOR", `^${src2[t.GTLT]}\\s*(${src2[t.FULLPLAIN]})$|^$`);
    createToken("COMPARATORTRIM", `(\\s*)${src2[t.GTLT]}\\s*(${src2[t.LOOSEPLAIN]}|${src2[t.XRANGEPLAIN]})`, true);
    exports.comparatorTrimReplace = "$1$2$3";
    createToken("HYPHENRANGE", `^\\s*(${src2[t.XRANGEPLAIN]})\\s+-\\s+(${src2[t.XRANGEPLAIN]})\\s*$`);
    createToken("HYPHENRANGELOOSE", `^\\s*(${src2[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src2[t.XRANGEPLAINLOOSE]})\\s*$`);
    createToken("STAR", "(<|>)?=?\\s*\\*");
    createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/internal/parse-options.js
var require_parse_options = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/internal/parse-options.js"(exports, module) {
    "use strict";
    var looseOption = Object.freeze({ loose: true });
    var emptyOpts = Object.freeze({});
    var parseOptions = (options) => {
      if (!options) {
        return emptyOpts;
      }
      if (typeof options !== "object") {
        return looseOption;
      }
      return options;
    };
    module.exports = parseOptions;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/internal/identifiers.js
var require_identifiers = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/internal/identifiers.js"(exports, module) {
    "use strict";
    var numeric = /^[0-9]+$/;
    var compareIdentifiers = (a, b) => {
      const anum = numeric.test(a);
      const bnum = numeric.test(b);
      if (anum && bnum) {
        a = +a;
        b = +b;
      }
      return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
    };
    var rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
    module.exports = {
      compareIdentifiers,
      rcompareIdentifiers
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/classes/semver.js
var require_semver = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/classes/semver.js"(exports, module) {
    "use strict";
    var debug = require_debug();
    var { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
    var { safeRe: re, t } = require_re();
    var parseOptions = require_parse_options();
    var { compareIdentifiers } = require_identifiers();
    var SemVer = class _SemVer {
      constructor(version, options) {
        options = parseOptions(options);
        if (version instanceof _SemVer) {
          if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
            return version;
          } else {
            version = version.version;
          }
        } else if (typeof version !== "string") {
          throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
        }
        if (version.length > MAX_LENGTH) {
          throw new TypeError(
            `version is longer than ${MAX_LENGTH} characters`
          );
        }
        debug("SemVer", version, options);
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
        if (!m) {
          throw new TypeError(`Invalid Version: ${version}`);
        }
        this.raw = version;
        this.major = +m[1];
        this.minor = +m[2];
        this.patch = +m[3];
        if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
          throw new TypeError("Invalid major version");
        }
        if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
          throw new TypeError("Invalid minor version");
        }
        if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
          throw new TypeError("Invalid patch version");
        }
        if (!m[4]) {
          this.prerelease = [];
        } else {
          this.prerelease = m[4].split(".").map((id) => {
            if (/^[0-9]+$/.test(id)) {
              const num = +id;
              if (num >= 0 && num < MAX_SAFE_INTEGER) {
                return num;
              }
            }
            return id;
          });
        }
        this.build = m[5] ? m[5].split(".") : [];
        this.format();
      }
      format() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) {
          this.version += `-${this.prerelease.join(".")}`;
        }
        return this.version;
      }
      toString() {
        return this.version;
      }
      compare(other) {
        debug("SemVer.compare", this.version, this.options, other);
        if (!(other instanceof _SemVer)) {
          if (typeof other === "string" && other === this.version) {
            return 0;
          }
          other = new _SemVer(other, this.options);
        }
        if (other.version === this.version) {
          return 0;
        }
        return this.compareMain(other) || this.comparePre(other);
      }
      compareMain(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        return compareIdentifiers(this.major, other.major) || compareIdentifiers(this.minor, other.minor) || compareIdentifiers(this.patch, other.patch);
      }
      comparePre(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        if (this.prerelease.length && !other.prerelease.length) {
          return -1;
        } else if (!this.prerelease.length && other.prerelease.length) {
          return 1;
        } else if (!this.prerelease.length && !other.prerelease.length) {
          return 0;
        }
        let i = 0;
        do {
          const a = this.prerelease[i];
          const b = other.prerelease[i];
          debug("prerelease compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      compareBuild(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        let i = 0;
        do {
          const a = this.build[i];
          const b = other.build[i];
          debug("build compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      // preminor will bump the version up to the next minor release, and immediately
      // down to pre-release. premajor and prepatch work the same way.
      inc(release, identifier, identifierBase) {
        if (release.startsWith("pre")) {
          if (!identifier && identifierBase === false) {
            throw new Error("invalid increment argument: identifier is empty");
          }
          if (identifier) {
            const match = `-${identifier}`.match(this.options.loose ? re[t.PRERELEASELOOSE] : re[t.PRERELEASE]);
            if (!match || match[1] !== identifier) {
              throw new Error(`invalid identifier: ${identifier}`);
            }
          }
        }
        switch (release) {
          case "premajor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor = 0;
            this.major++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "preminor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "prepatch":
            this.prerelease.length = 0;
            this.inc("patch", identifier, identifierBase);
            this.inc("pre", identifier, identifierBase);
            break;
          // If the input is a non-prerelease version, this acts the same as
          // prepatch.
          case "prerelease":
            if (this.prerelease.length === 0) {
              this.inc("patch", identifier, identifierBase);
            }
            this.inc("pre", identifier, identifierBase);
            break;
          case "release":
            if (this.prerelease.length === 0) {
              throw new Error(`version ${this.raw} is not a prerelease`);
            }
            this.prerelease.length = 0;
            break;
          case "major":
            if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
              this.major++;
            }
            this.minor = 0;
            this.patch = 0;
            this.prerelease = [];
            break;
          case "minor":
            if (this.patch !== 0 || this.prerelease.length === 0) {
              this.minor++;
            }
            this.patch = 0;
            this.prerelease = [];
            break;
          case "patch":
            if (this.prerelease.length === 0) {
              this.patch++;
            }
            this.prerelease = [];
            break;
          // This probably shouldn't be used publicly.
          // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
          case "pre": {
            const base = Number(identifierBase) ? 1 : 0;
            if (this.prerelease.length === 0) {
              this.prerelease = [base];
            } else {
              let i = this.prerelease.length;
              while (--i >= 0) {
                if (typeof this.prerelease[i] === "number") {
                  this.prerelease[i]++;
                  i = -2;
                }
              }
              if (i === -1) {
                if (identifier === this.prerelease.join(".") && identifierBase === false) {
                  throw new Error("invalid increment argument: identifier already exists");
                }
                this.prerelease.push(base);
              }
            }
            if (identifier) {
              let prerelease = [identifier, base];
              if (identifierBase === false) {
                prerelease = [identifier];
              }
              if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
                if (isNaN(this.prerelease[1])) {
                  this.prerelease = prerelease;
                }
              } else {
                this.prerelease = prerelease;
              }
            }
            break;
          }
          default:
            throw new Error(`invalid increment argument: ${release}`);
        }
        this.raw = this.format();
        if (this.build.length) {
          this.raw += `+${this.build.join(".")}`;
        }
        return this;
      }
    };
    module.exports = SemVer;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/parse.js
var require_parse = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/parse.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var parse2 = (version, options, throwErrors = false) => {
      if (version instanceof SemVer) {
        return version;
      }
      try {
        return new SemVer(version, options);
      } catch (er) {
        if (!throwErrors) {
          return null;
        }
        throw er;
      }
    };
    module.exports = parse2;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/valid.js
var require_valid = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/valid.js"(exports, module) {
    "use strict";
    var parse2 = require_parse();
    var valid = (version, options) => {
      const v = parse2(version, options);
      return v ? v.version : null;
    };
    module.exports = valid;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/clean.js
var require_clean = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/clean.js"(exports, module) {
    "use strict";
    var parse2 = require_parse();
    var clean = (version, options) => {
      const s = parse2(version.trim().replace(/^[=v]+/, ""), options);
      return s ? s.version : null;
    };
    module.exports = clean;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/inc.js
var require_inc = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/inc.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var inc = (version, release, options, identifier, identifierBase) => {
      if (typeof options === "string") {
        identifierBase = identifier;
        identifier = options;
        options = void 0;
      }
      try {
        return new SemVer(
          version instanceof SemVer ? version.version : version,
          options
        ).inc(release, identifier, identifierBase).version;
      } catch (er) {
        return null;
      }
    };
    module.exports = inc;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/diff.js
var require_diff = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/diff.js"(exports, module) {
    "use strict";
    var parse2 = require_parse();
    var diff = (version1, version2) => {
      const v1 = parse2(version1, null, true);
      const v2 = parse2(version2, null, true);
      const comparison = v1.compare(v2);
      if (comparison === 0) {
        return null;
      }
      const v1Higher = comparison > 0;
      const highVersion = v1Higher ? v1 : v2;
      const lowVersion = v1Higher ? v2 : v1;
      const highHasPre = !!highVersion.prerelease.length;
      const lowHasPre = !!lowVersion.prerelease.length;
      if (lowHasPre && !highHasPre) {
        if (!lowVersion.patch && !lowVersion.minor) {
          return "major";
        }
        if (lowVersion.compareMain(highVersion) === 0) {
          if (lowVersion.minor && !lowVersion.patch) {
            return "minor";
          }
          return "patch";
        }
      }
      const prefix = highHasPre ? "pre" : "";
      if (v1.major !== v2.major) {
        return prefix + "major";
      }
      if (v1.minor !== v2.minor) {
        return prefix + "minor";
      }
      if (v1.patch !== v2.patch) {
        return prefix + "patch";
      }
      return "prerelease";
    };
    module.exports = diff;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/major.js
var require_major = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/major.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var major = (a, loose) => new SemVer(a, loose).major;
    module.exports = major;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/minor.js
var require_minor = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/minor.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var minor = (a, loose) => new SemVer(a, loose).minor;
    module.exports = minor;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/patch.js
var require_patch = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/patch.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var patch = (a, loose) => new SemVer(a, loose).patch;
    module.exports = patch;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/prerelease.js
var require_prerelease = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/prerelease.js"(exports, module) {
    "use strict";
    var parse2 = require_parse();
    var prerelease = (version, options) => {
      const parsed = parse2(version, options);
      return parsed && parsed.prerelease.length ? parsed.prerelease : null;
    };
    module.exports = prerelease;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/compare.js
var require_compare = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/compare.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var compare = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
    module.exports = compare;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/rcompare.js
var require_rcompare = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/rcompare.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var rcompare = (a, b, loose) => compare(b, a, loose);
    module.exports = rcompare;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/compare-loose.js
var require_compare_loose = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/compare-loose.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var compareLoose = (a, b) => compare(a, b, true);
    module.exports = compareLoose;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/compare-build.js
var require_compare_build = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/compare-build.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var compareBuild = (a, b, loose) => {
      const versionA = new SemVer(a, loose);
      const versionB = new SemVer(b, loose);
      return versionA.compare(versionB) || versionA.compareBuild(versionB);
    };
    module.exports = compareBuild;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/sort.js
var require_sort = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/sort.js"(exports, module) {
    "use strict";
    var compareBuild = require_compare_build();
    var sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose));
    module.exports = sort;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/rsort.js
var require_rsort = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/rsort.js"(exports, module) {
    "use strict";
    var compareBuild = require_compare_build();
    var rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose));
    module.exports = rsort;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/gt.js
var require_gt = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/gt.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var gt = (a, b, loose) => compare(a, b, loose) > 0;
    module.exports = gt;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/lt.js
var require_lt = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/lt.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var lt = (a, b, loose) => compare(a, b, loose) < 0;
    module.exports = lt;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/eq.js
var require_eq = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/eq.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var eq = (a, b, loose) => compare(a, b, loose) === 0;
    module.exports = eq;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/neq.js
var require_neq = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/neq.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var neq = (a, b, loose) => compare(a, b, loose) !== 0;
    module.exports = neq;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/gte.js
var require_gte = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/gte.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var gte = (a, b, loose) => compare(a, b, loose) >= 0;
    module.exports = gte;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/lte.js
var require_lte = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/lte.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var lte = (a, b, loose) => compare(a, b, loose) <= 0;
    module.exports = lte;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/cmp.js
var require_cmp = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/cmp.js"(exports, module) {
    "use strict";
    var eq = require_eq();
    var neq = require_neq();
    var gt = require_gt();
    var gte = require_gte();
    var lt = require_lt();
    var lte = require_lte();
    var cmp = (a, op, b, loose) => {
      switch (op) {
        case "===":
          if (typeof a === "object") {
            a = a.version;
          }
          if (typeof b === "object") {
            b = b.version;
          }
          return a === b;
        case "!==":
          if (typeof a === "object") {
            a = a.version;
          }
          if (typeof b === "object") {
            b = b.version;
          }
          return a !== b;
        case "":
        case "=":
        case "==":
          return eq(a, b, loose);
        case "!=":
          return neq(a, b, loose);
        case ">":
          return gt(a, b, loose);
        case ">=":
          return gte(a, b, loose);
        case "<":
          return lt(a, b, loose);
        case "<=":
          return lte(a, b, loose);
        default:
          throw new TypeError(`Invalid operator: ${op}`);
      }
    };
    module.exports = cmp;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/coerce.js
var require_coerce = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/coerce.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var parse2 = require_parse();
    var { safeRe: re, t } = require_re();
    var coerce = (version, options) => {
      if (version instanceof SemVer) {
        return version;
      }
      if (typeof version === "number") {
        version = String(version);
      }
      if (typeof version !== "string") {
        return null;
      }
      options = options || {};
      let match = null;
      if (!options.rtl) {
        match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
      } else {
        const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
        let next;
        while ((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)) {
          if (!match || next.index + next[0].length !== match.index + match[0].length) {
            match = next;
          }
          coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
        }
        coerceRtlRegex.lastIndex = -1;
      }
      if (match === null) {
        return null;
      }
      const major = match[2];
      const minor = match[3] || "0";
      const patch = match[4] || "0";
      const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : "";
      const build = options.includePrerelease && match[6] ? `+${match[6]}` : "";
      return parse2(`${major}.${minor}.${patch}${prerelease}${build}`, options);
    };
    module.exports = coerce;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/internal/lrucache.js
var require_lrucache = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/internal/lrucache.js"(exports, module) {
    "use strict";
    var LRUCache = class {
      constructor() {
        this.max = 1e3;
        this.map = /* @__PURE__ */ new Map();
      }
      get(key) {
        const value = this.map.get(key);
        if (value === void 0) {
          return void 0;
        } else {
          this.map.delete(key);
          this.map.set(key, value);
          return value;
        }
      }
      delete(key) {
        return this.map.delete(key);
      }
      set(key, value) {
        const deleted = this.delete(key);
        if (!deleted && value !== void 0) {
          if (this.map.size >= this.max) {
            const firstKey = this.map.keys().next().value;
            this.delete(firstKey);
          }
          this.map.set(key, value);
        }
        return this;
      }
    };
    module.exports = LRUCache;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/classes/range.js
var require_range = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/classes/range.js"(exports, module) {
    "use strict";
    var SPACE_CHARACTERS = /\s+/g;
    var Range = class _Range {
      constructor(range, options) {
        options = parseOptions(options);
        if (range instanceof _Range) {
          if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
            return range;
          } else {
            return new _Range(range.raw, options);
          }
        }
        if (range instanceof Comparator) {
          this.raw = range.value;
          this.set = [[range]];
          this.formatted = void 0;
          return this;
        }
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        this.raw = range.trim().replace(SPACE_CHARACTERS, " ");
        this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
        if (!this.set.length) {
          throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
        }
        if (this.set.length > 1) {
          const first = this.set[0];
          this.set = this.set.filter((c) => !isNullSet(c[0]));
          if (this.set.length === 0) {
            this.set = [first];
          } else if (this.set.length > 1) {
            for (const c of this.set) {
              if (c.length === 1 && isAny(c[0])) {
                this.set = [c];
                break;
              }
            }
          }
        }
        this.formatted = void 0;
      }
      get range() {
        if (this.formatted === void 0) {
          this.formatted = "";
          for (let i = 0; i < this.set.length; i++) {
            if (i > 0) {
              this.formatted += "||";
            }
            const comps = this.set[i];
            for (let k = 0; k < comps.length; k++) {
              if (k > 0) {
                this.formatted += " ";
              }
              this.formatted += comps[k].toString().trim();
            }
          }
        }
        return this.formatted;
      }
      format() {
        return this.range;
      }
      toString() {
        return this.range;
      }
      parseRange(range) {
        const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
        const memoKey = memoOpts + ":" + range;
        const cached = cache.get(memoKey);
        if (cached) {
          return cached;
        }
        const loose = this.options.loose;
        const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
        range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
        debug("hyphen replace", range);
        range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
        debug("comparator trim", range);
        range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
        debug("tilde trim", range);
        range = range.replace(re[t.CARETTRIM], caretTrimReplace);
        debug("caret trim", range);
        let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
        if (loose) {
          rangeList = rangeList.filter((comp) => {
            debug("loose invalid filter", comp, this.options);
            return !!comp.match(re[t.COMPARATORLOOSE]);
          });
        }
        debug("range list", rangeList);
        const rangeMap = /* @__PURE__ */ new Map();
        const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
        for (const comp of comparators) {
          if (isNullSet(comp)) {
            return [comp];
          }
          rangeMap.set(comp.value, comp);
        }
        if (rangeMap.size > 1 && rangeMap.has("")) {
          rangeMap.delete("");
        }
        const result = [...rangeMap.values()];
        cache.set(memoKey, result);
        return result;
      }
      intersects(range, options) {
        if (!(range instanceof _Range)) {
          throw new TypeError("a Range is required");
        }
        return this.set.some((thisComparators) => {
          return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators) => {
            return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options);
              });
            });
          });
        });
      }
      // if ANY of the sets match ALL of its comparators, then pass
      test(version) {
        if (!version) {
          return false;
        }
        if (typeof version === "string") {
          try {
            version = new SemVer(version, this.options);
          } catch (er) {
            return false;
          }
        }
        for (let i = 0; i < this.set.length; i++) {
          if (testSet(this.set[i], version, this.options)) {
            return true;
          }
        }
        return false;
      }
    };
    module.exports = Range;
    var LRU = require_lrucache();
    var cache = new LRU();
    var parseOptions = require_parse_options();
    var Comparator = require_comparator();
    var debug = require_debug();
    var SemVer = require_semver();
    var {
      safeRe: re,
      t,
      comparatorTrimReplace,
      tildeTrimReplace,
      caretTrimReplace
    } = require_re();
    var { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require_constants();
    var isNullSet = (c) => c.value === "<0.0.0-0";
    var isAny = (c) => c.value === "";
    var isSatisfiable = (comparators, options) => {
      let result = true;
      const remainingComparators = comparators.slice();
      let testComparator = remainingComparators.pop();
      while (result && remainingComparators.length) {
        result = remainingComparators.every((otherComparator) => {
          return testComparator.intersects(otherComparator, options);
        });
        testComparator = remainingComparators.pop();
      }
      return result;
    };
    var parseComparator = (comp, options) => {
      debug("comp", comp, options);
      comp = replaceCarets(comp, options);
      debug("caret", comp);
      comp = replaceTildes(comp, options);
      debug("tildes", comp);
      comp = replaceXRanges(comp, options);
      debug("xrange", comp);
      comp = replaceStars(comp, options);
      debug("stars", comp);
      return comp;
    };
    var isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
    var replaceTildes = (comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
    };
    var replaceTilde = (comp, options) => {
      const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
      return comp.replace(r, (_, M, m, p, pr) => {
        debug("tilde", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
        } else if (pr) {
          debug("replaceTilde pr", pr);
          ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
        } else {
          ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
        }
        debug("tilde return", ret);
        return ret;
      });
    };
    var replaceCarets = (comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
    };
    var replaceCaret = (comp, options) => {
      debug("caret", comp, options);
      const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
      const z = options.includePrerelease ? "-0" : "";
      return comp.replace(r, (_, M, m, p, pr) => {
        debug("caret", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          if (M === "0") {
            ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
          } else {
            ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
          }
        } else if (pr) {
          debug("replaceCaret pr", pr);
          if (M === "0") {
            if (m === "0") {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
          }
        } else {
          debug("no pr");
          if (M === "0") {
            if (m === "0") {
              ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
          }
        }
        debug("caret return", ret);
        return ret;
      });
    };
    var replaceXRanges = (comp, options) => {
      debug("replaceXRanges", comp, options);
      return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
    };
    var replaceXRange = (comp, options) => {
      comp = comp.trim();
      const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
      return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
        debug("xRange", comp, ret, gtlt, M, m, p, pr);
        const xM = isX(M);
        const xm = xM || isX(m);
        const xp = xm || isX(p);
        const anyX = xp;
        if (gtlt === "=" && anyX) {
          gtlt = "";
        }
        pr = options.includePrerelease ? "-0" : "";
        if (xM) {
          if (gtlt === ">" || gtlt === "<") {
            ret = "<0.0.0-0";
          } else {
            ret = "*";
          }
        } else if (gtlt && anyX) {
          if (xm) {
            m = 0;
          }
          p = 0;
          if (gtlt === ">") {
            gtlt = ">=";
            if (xm) {
              M = +M + 1;
              m = 0;
              p = 0;
            } else {
              m = +m + 1;
              p = 0;
            }
          } else if (gtlt === "<=") {
            gtlt = "<";
            if (xm) {
              M = +M + 1;
            } else {
              m = +m + 1;
            }
          }
          if (gtlt === "<") {
            pr = "-0";
          }
          ret = `${gtlt + M}.${m}.${p}${pr}`;
        } else if (xm) {
          ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
        } else if (xp) {
          ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
        }
        debug("xRange return", ret);
        return ret;
      });
    };
    var replaceStars = (comp, options) => {
      debug("replaceStars", comp, options);
      return comp.trim().replace(re[t.STAR], "");
    };
    var replaceGTE0 = (comp, options) => {
      debug("replaceGTE0", comp, options);
      return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
    };
    var hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
      if (isX(fM)) {
        from = "";
      } else if (isX(fm)) {
        from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
      } else if (isX(fp)) {
        from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
      } else if (fpr) {
        from = `>=${from}`;
      } else {
        from = `>=${from}${incPr ? "-0" : ""}`;
      }
      if (isX(tM)) {
        to = "";
      } else if (isX(tm)) {
        to = `<${+tM + 1}.0.0-0`;
      } else if (isX(tp)) {
        to = `<${tM}.${+tm + 1}.0-0`;
      } else if (tpr) {
        to = `<=${tM}.${tm}.${tp}-${tpr}`;
      } else if (incPr) {
        to = `<${tM}.${tm}.${+tp + 1}-0`;
      } else {
        to = `<=${to}`;
      }
      return `${from} ${to}`.trim();
    };
    var testSet = (set, version, options) => {
      for (let i = 0; i < set.length; i++) {
        if (!set[i].test(version)) {
          return false;
        }
      }
      if (version.prerelease.length && !options.includePrerelease) {
        for (let i = 0; i < set.length; i++) {
          debug(set[i].semver);
          if (set[i].semver === Comparator.ANY) {
            continue;
          }
          if (set[i].semver.prerelease.length > 0) {
            const allowed = set[i].semver;
            if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
              return true;
            }
          }
        }
        return false;
      }
      return true;
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/classes/comparator.js
var require_comparator = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/classes/comparator.js"(exports, module) {
    "use strict";
    var ANY = Symbol("SemVer ANY");
    var Comparator = class _Comparator {
      static get ANY() {
        return ANY;
      }
      constructor(comp, options) {
        options = parseOptions(options);
        if (comp instanceof _Comparator) {
          if (comp.loose === !!options.loose) {
            return comp;
          } else {
            comp = comp.value;
          }
        }
        comp = comp.trim().split(/\s+/).join(" ");
        debug("comparator", comp, options);
        this.options = options;
        this.loose = !!options.loose;
        this.parse(comp);
        if (this.semver === ANY) {
          this.value = "";
        } else {
          this.value = this.operator + this.semver.version;
        }
        debug("comp", this);
      }
      parse(comp) {
        const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
        const m = comp.match(r);
        if (!m) {
          throw new TypeError(`Invalid comparator: ${comp}`);
        }
        this.operator = m[1] !== void 0 ? m[1] : "";
        if (this.operator === "=") {
          this.operator = "";
        }
        if (!m[2]) {
          this.semver = ANY;
        } else {
          this.semver = new SemVer(m[2], this.options.loose);
        }
      }
      toString() {
        return this.value;
      }
      test(version) {
        debug("Comparator.test", version, this.options.loose);
        if (this.semver === ANY || version === ANY) {
          return true;
        }
        if (typeof version === "string") {
          try {
            version = new SemVer(version, this.options);
          } catch (er) {
            return false;
          }
        }
        return cmp(version, this.operator, this.semver, this.options);
      }
      intersects(comp, options) {
        if (!(comp instanceof _Comparator)) {
          throw new TypeError("a Comparator is required");
        }
        if (this.operator === "") {
          if (this.value === "") {
            return true;
          }
          return new Range(comp.value, options).test(this.value);
        } else if (comp.operator === "") {
          if (comp.value === "") {
            return true;
          }
          return new Range(this.value, options).test(comp.semver);
        }
        options = parseOptions(options);
        if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) {
          return false;
        }
        if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) {
          return false;
        }
        if (this.operator.startsWith(">") && comp.operator.startsWith(">")) {
          return true;
        }
        if (this.operator.startsWith("<") && comp.operator.startsWith("<")) {
          return true;
        }
        if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) {
          return true;
        }
        if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) {
          return true;
        }
        if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) {
          return true;
        }
        return false;
      }
    };
    module.exports = Comparator;
    var parseOptions = require_parse_options();
    var { safeRe: re, t } = require_re();
    var cmp = require_cmp();
    var debug = require_debug();
    var SemVer = require_semver();
    var Range = require_range();
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/satisfies.js
var require_satisfies = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/functions/satisfies.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var satisfies = (version, range, options) => {
      try {
        range = new Range(range, options);
      } catch (er) {
        return false;
      }
      return range.test(version);
    };
    module.exports = satisfies;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/ranges/to-comparators.js
var require_to_comparators = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/ranges/to-comparators.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var toComparators = (range, options) => new Range(range, options).set.map((comp) => comp.map((c) => c.value).join(" ").trim().split(" "));
    module.exports = toComparators;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/ranges/max-satisfying.js
var require_max_satisfying = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/ranges/max-satisfying.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var Range = require_range();
    var maxSatisfying = (versions, range, options) => {
      let max = null;
      let maxSV = null;
      let rangeObj = null;
      try {
        rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach((v) => {
        if (rangeObj.test(v)) {
          if (!max || maxSV.compare(v) === -1) {
            max = v;
            maxSV = new SemVer(max, options);
          }
        }
      });
      return max;
    };
    module.exports = maxSatisfying;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/ranges/min-satisfying.js
var require_min_satisfying = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/ranges/min-satisfying.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var Range = require_range();
    var minSatisfying = (versions, range, options) => {
      let min = null;
      let minSV = null;
      let rangeObj = null;
      try {
        rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach((v) => {
        if (rangeObj.test(v)) {
          if (!min || minSV.compare(v) === 1) {
            min = v;
            minSV = new SemVer(min, options);
          }
        }
      });
      return min;
    };
    module.exports = minSatisfying;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/ranges/min-version.js
var require_min_version = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/ranges/min-version.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var Range = require_range();
    var gt = require_gt();
    var minVersion = (range, loose) => {
      range = new Range(range, loose);
      let minver = new SemVer("0.0.0");
      if (range.test(minver)) {
        return minver;
      }
      minver = new SemVer("0.0.0-0");
      if (range.test(minver)) {
        return minver;
      }
      minver = null;
      for (let i = 0; i < range.set.length; ++i) {
        const comparators = range.set[i];
        let setMin = null;
        comparators.forEach((comparator) => {
          const compver = new SemVer(comparator.semver.version);
          switch (comparator.operator) {
            case ">":
              if (compver.prerelease.length === 0) {
                compver.patch++;
              } else {
                compver.prerelease.push(0);
              }
              compver.raw = compver.format();
            /* fallthrough */
            case "":
            case ">=":
              if (!setMin || gt(compver, setMin)) {
                setMin = compver;
              }
              break;
            case "<":
            case "<=":
              break;
            /* istanbul ignore next */
            default:
              throw new Error(`Unexpected operation: ${comparator.operator}`);
          }
        });
        if (setMin && (!minver || gt(minver, setMin))) {
          minver = setMin;
        }
      }
      if (minver && range.test(minver)) {
        return minver;
      }
      return null;
    };
    module.exports = minVersion;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/ranges/valid.js
var require_valid2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/ranges/valid.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var validRange = (range, options) => {
      try {
        return new Range(range, options).range || "*";
      } catch (er) {
        return null;
      }
    };
    module.exports = validRange;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/ranges/outside.js
var require_outside = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/ranges/outside.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var Comparator = require_comparator();
    var { ANY } = Comparator;
    var Range = require_range();
    var satisfies = require_satisfies();
    var gt = require_gt();
    var lt = require_lt();
    var lte = require_lte();
    var gte = require_gte();
    var outside = (version, range, hilo, options) => {
      version = new SemVer(version, options);
      range = new Range(range, options);
      let gtfn, ltefn, ltfn, comp, ecomp;
      switch (hilo) {
        case ">":
          gtfn = gt;
          ltefn = lte;
          ltfn = lt;
          comp = ">";
          ecomp = ">=";
          break;
        case "<":
          gtfn = lt;
          ltefn = gte;
          ltfn = gt;
          comp = "<";
          ecomp = "<=";
          break;
        default:
          throw new TypeError('Must provide a hilo val of "<" or ">"');
      }
      if (satisfies(version, range, options)) {
        return false;
      }
      for (let i = 0; i < range.set.length; ++i) {
        const comparators = range.set[i];
        let high = null;
        let low = null;
        comparators.forEach((comparator) => {
          if (comparator.semver === ANY) {
            comparator = new Comparator(">=0.0.0");
          }
          high = high || comparator;
          low = low || comparator;
          if (gtfn(comparator.semver, high.semver, options)) {
            high = comparator;
          } else if (ltfn(comparator.semver, low.semver, options)) {
            low = comparator;
          }
        });
        if (high.operator === comp || high.operator === ecomp) {
          return false;
        }
        if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
          return false;
        } else if (low.operator === ecomp && ltfn(version, low.semver)) {
          return false;
        }
      }
      return true;
    };
    module.exports = outside;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/ranges/gtr.js
var require_gtr = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/ranges/gtr.js"(exports, module) {
    "use strict";
    var outside = require_outside();
    var gtr = (version, range, options) => outside(version, range, ">", options);
    module.exports = gtr;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/ranges/ltr.js
var require_ltr = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/ranges/ltr.js"(exports, module) {
    "use strict";
    var outside = require_outside();
    var ltr = (version, range, options) => outside(version, range, "<", options);
    module.exports = ltr;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/ranges/intersects.js
var require_intersects = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/ranges/intersects.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var intersects = (r1, r2, options) => {
      r1 = new Range(r1, options);
      r2 = new Range(r2, options);
      return r1.intersects(r2, options);
    };
    module.exports = intersects;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/ranges/simplify.js
var require_simplify = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/ranges/simplify.js"(exports, module) {
    "use strict";
    var satisfies = require_satisfies();
    var compare = require_compare();
    module.exports = (versions, range, options) => {
      const set = [];
      let first = null;
      let prev = null;
      const v = versions.sort((a, b) => compare(a, b, options));
      for (const version of v) {
        const included = satisfies(version, range, options);
        if (included) {
          prev = version;
          if (!first) {
            first = version;
          }
        } else {
          if (prev) {
            set.push([first, prev]);
          }
          prev = null;
          first = null;
        }
      }
      if (first) {
        set.push([first, null]);
      }
      const ranges = [];
      for (const [min, max] of set) {
        if (min === max) {
          ranges.push(min);
        } else if (!max && min === v[0]) {
          ranges.push("*");
        } else if (!max) {
          ranges.push(`>=${min}`);
        } else if (min === v[0]) {
          ranges.push(`<=${max}`);
        } else {
          ranges.push(`${min} - ${max}`);
        }
      }
      const simplified = ranges.join(" || ");
      const original = typeof range.raw === "string" ? range.raw : String(range);
      return simplified.length < original.length ? simplified : range;
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/ranges/subset.js
var require_subset = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/ranges/subset.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var Comparator = require_comparator();
    var { ANY } = Comparator;
    var satisfies = require_satisfies();
    var compare = require_compare();
    var subset = (sub, dom, options = {}) => {
      if (sub === dom) {
        return true;
      }
      sub = new Range(sub, options);
      dom = new Range(dom, options);
      let sawNonNull = false;
      OUTER: for (const simpleSub of sub.set) {
        for (const simpleDom of dom.set) {
          const isSub = simpleSubset(simpleSub, simpleDom, options);
          sawNonNull = sawNonNull || isSub !== null;
          if (isSub) {
            continue OUTER;
          }
        }
        if (sawNonNull) {
          return false;
        }
      }
      return true;
    };
    var minimumVersionWithPreRelease = [new Comparator(">=0.0.0-0")];
    var minimumVersion = [new Comparator(">=0.0.0")];
    var simpleSubset = (sub, dom, options) => {
      if (sub === dom) {
        return true;
      }
      if (sub.length === 1 && sub[0].semver === ANY) {
        if (dom.length === 1 && dom[0].semver === ANY) {
          return true;
        } else if (options.includePrerelease) {
          sub = minimumVersionWithPreRelease;
        } else {
          sub = minimumVersion;
        }
      }
      if (dom.length === 1 && dom[0].semver === ANY) {
        if (options.includePrerelease) {
          return true;
        } else {
          dom = minimumVersion;
        }
      }
      const eqSet = /* @__PURE__ */ new Set();
      let gt, lt;
      for (const c of sub) {
        if (c.operator === ">" || c.operator === ">=") {
          gt = higherGT(gt, c, options);
        } else if (c.operator === "<" || c.operator === "<=") {
          lt = lowerLT(lt, c, options);
        } else {
          eqSet.add(c.semver);
        }
      }
      if (eqSet.size > 1) {
        return null;
      }
      let gtltComp;
      if (gt && lt) {
        gtltComp = compare(gt.semver, lt.semver, options);
        if (gtltComp > 0) {
          return null;
        } else if (gtltComp === 0 && (gt.operator !== ">=" || lt.operator !== "<=")) {
          return null;
        }
      }
      for (const eq of eqSet) {
        if (gt && !satisfies(eq, String(gt), options)) {
          return null;
        }
        if (lt && !satisfies(eq, String(lt), options)) {
          return null;
        }
        for (const c of dom) {
          if (!satisfies(eq, String(c), options)) {
            return false;
          }
        }
        return true;
      }
      let higher, lower;
      let hasDomLT, hasDomGT;
      let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
      let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
      if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === "<" && needDomLTPre.prerelease[0] === 0) {
        needDomLTPre = false;
      }
      for (const c of dom) {
        hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
        hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
        if (gt) {
          if (needDomGTPre) {
            if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) {
              needDomGTPre = false;
            }
          }
          if (c.operator === ">" || c.operator === ">=") {
            higher = higherGT(gt, c, options);
            if (higher === c && higher !== gt) {
              return false;
            }
          } else if (gt.operator === ">=" && !satisfies(gt.semver, String(c), options)) {
            return false;
          }
        }
        if (lt) {
          if (needDomLTPre) {
            if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) {
              needDomLTPre = false;
            }
          }
          if (c.operator === "<" || c.operator === "<=") {
            lower = lowerLT(lt, c, options);
            if (lower === c && lower !== lt) {
              return false;
            }
          } else if (lt.operator === "<=" && !satisfies(lt.semver, String(c), options)) {
            return false;
          }
        }
        if (!c.operator && (lt || gt) && gtltComp !== 0) {
          return false;
        }
      }
      if (gt && hasDomLT && !lt && gtltComp !== 0) {
        return false;
      }
      if (lt && hasDomGT && !gt && gtltComp !== 0) {
        return false;
      }
      if (needDomGTPre || needDomLTPre) {
        return false;
      }
      return true;
    };
    var higherGT = (a, b, options) => {
      if (!a) {
        return b;
      }
      const comp = compare(a.semver, b.semver, options);
      return comp > 0 ? a : comp < 0 ? b : b.operator === ">" && a.operator === ">=" ? b : a;
    };
    var lowerLT = (a, b, options) => {
      if (!a) {
        return b;
      }
      const comp = compare(a.semver, b.semver, options);
      return comp < 0 ? a : comp > 0 ? b : b.operator === "<" && a.operator === "<=" ? b : a;
    };
    module.exports = subset;
  }
});

// ../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/index.js
var require_semver2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/@/semver/7.7.2/86902ed6f66d1d3ed422a79af92d085860c58d72714670888f3639cc75de6f0b/node_modules/semver/index.js"(exports, module) {
    "use strict";
    var internalRe = require_re();
    var constants2 = require_constants();
    var SemVer = require_semver();
    var identifiers = require_identifiers();
    var parse2 = require_parse();
    var valid = require_valid();
    var clean = require_clean();
    var inc = require_inc();
    var diff = require_diff();
    var major = require_major();
    var minor = require_minor();
    var patch = require_patch();
    var prerelease = require_prerelease();
    var compare = require_compare();
    var rcompare = require_rcompare();
    var compareLoose = require_compare_loose();
    var compareBuild = require_compare_build();
    var sort = require_sort();
    var rsort = require_rsort();
    var gt = require_gt();
    var lt = require_lt();
    var eq = require_eq();
    var neq = require_neq();
    var gte = require_gte();
    var lte = require_lte();
    var cmp = require_cmp();
    var coerce = require_coerce();
    var Comparator = require_comparator();
    var Range = require_range();
    var satisfies = require_satisfies();
    var toComparators = require_to_comparators();
    var maxSatisfying = require_max_satisfying();
    var minSatisfying = require_min_satisfying();
    var minVersion = require_min_version();
    var validRange = require_valid2();
    var outside = require_outside();
    var gtr = require_gtr();
    var ltr = require_ltr();
    var intersects = require_intersects();
    var simplifyRange = require_simplify();
    var subset = require_subset();
    module.exports = {
      parse: parse2,
      valid,
      clean,
      inc,
      diff,
      major,
      minor,
      patch,
      prerelease,
      compare,
      rcompare,
      compareLoose,
      compareBuild,
      sort,
      rsort,
      gt,
      lt,
      eq,
      neq,
      gte,
      lte,
      cmp,
      coerce,
      Comparator,
      Range,
      satisfies,
      toComparators,
      maxSatisfying,
      minSatisfying,
      minVersion,
      validRange,
      outside,
      gtr,
      ltr,
      intersects,
      simplifyRange,
      subset,
      SemVer,
      re: internalRe.re,
      src: internalRe.src,
      tokens: internalRe.t,
      SEMVER_SPEC_VERSION: constants2.SEMVER_SPEC_VERSION,
      RELEASE_TYPES: constants2.RELEASE_TYPES,
      compareIdentifiers: identifiers.compareIdentifiers,
      rcompareIdentifiers: identifiers.rcompareIdentifiers
    };
  }
});

// ../worker/lib/start.js
import crypto3 from "crypto";
import path11 from "path";
import fs7 from "fs";

// ../packages/constants/lib/index.js
var LOCKFILE_MAJOR_VERSION = "9";
var LOCKFILE_VERSION = `${LOCKFILE_MAJOR_VERSION}.0`;
var ENGINE_NAME = `${process.platform};${process.arch};node${process.version.split(".")[0].substring(1)}`;

// ../packages/error/lib/index.js
var PnpmError = class extends Error {
  code;
  hint;
  attempts;
  prefix;
  pkgsStack;
  constructor(code, message, opts2) {
    super(message);
    this.code = code.startsWith("ERR_PNPM_") ? code : `ERR_PNPM_${code}`;
    this.hint = opts2?.hint;
    this.attempts = opts2?.attempts;
  }
};

// ../store/create-cafs-store/lib/index.js
import { promises as fs5 } from "fs";
import path8 from "path";

// ../store/cafs/lib/index.js
import crypto2 from "crypto";

// ../store/cafs/lib/addFilesFromDir.js
import util2 from "util";
import fs from "fs";
import path from "path";

// ../fs/graceful-fs/lib/index.js
var import_graceful_fs = __toESM(require_graceful_fs(), 1);
import util, { promisify } from "util";
var lib_default = {
  copyFile: promisify(import_graceful_fs.default.copyFile),
  copyFileSync: withEagainRetry(import_graceful_fs.default.copyFileSync),
  createReadStream: import_graceful_fs.default.createReadStream,
  link: promisify(import_graceful_fs.default.link),
  linkSync: withEagainRetry(import_graceful_fs.default.linkSync),
  mkdir: promisify(import_graceful_fs.default.mkdir),
  mkdirSync: withEagainRetry(import_graceful_fs.default.mkdirSync),
  renameSync: withEagainRetry(import_graceful_fs.default.renameSync),
  readFile: promisify(import_graceful_fs.default.readFile),
  readFileSync: import_graceful_fs.default.readFileSync,
  readdirSync: import_graceful_fs.default.readdirSync,
  stat: promisify(import_graceful_fs.default.stat),
  statSync: import_graceful_fs.default.statSync,
  unlinkSync: import_graceful_fs.default.unlinkSync,
  writeFile: promisify(import_graceful_fs.default.writeFile),
  writeFileSync: withEagainRetry(import_graceful_fs.default.writeFileSync)
};
function withEagainRetry(fn, maxRetries = 15) {
  return (...args) => {
    let attempts = 0;
    while (attempts <= maxRetries) {
      try {
        return fn(...args);
      } catch (err) {
        if (util.types.isNativeError(err) && "code" in err && err.code === "EAGAIN" && attempts < maxRetries) {
          attempts++;
          const delay = Math.min(Math.pow(2, attempts), 300);
          Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delay);
          continue;
        }
        throw err;
      }
    }
    throw new Error("Unreachable");
  };
}

// ../store/cafs/lib/addFilesFromDir.js
var import_is_subdir = __toESM(require_is_subdir(), 1);

// ../../../.local/share/pnpm/store/v10/links/@/strip-bom/5.0.0/bcf389250873c6a9dd841adabcec8d514e957ddf3ab00790d6e05b457d7c4f07/node_modules/strip-bom/index.js
function stripBom(string) {
  if (typeof string !== "string") {
    throw new TypeError(`Expected a string, got ${typeof string}`);
  }
  if (string.charCodeAt(0) === 65279) {
    return string.slice(1);
  }
  return string;
}

// ../store/cafs/lib/parseJson.js
function parseJsonBufferSync(buffer) {
  return JSON.parse(stripBom(buffer.toString()));
}

// ../store/cafs/lib/addFilesFromDir.js
function addFilesFromDir(addBuffer, dirname, opts2 = {}) {
  const filesIndex = /* @__PURE__ */ new Map();
  let manifest;
  let files;
  const resolvedRoot = fs.realpathSync(dirname);
  if (opts2.files) {
    files = [];
    for (const file of opts2.files) {
      const absolutePath = path.join(dirname, file);
      const stat = getStatIfContained(absolutePath, resolvedRoot);
      if (!stat) {
        continue;
      }
      files.push({
        absolutePath,
        relativePath: file,
        stat
      });
    }
  } else {
    files = findFilesInDir(dirname, resolvedRoot);
  }
  for (const { absolutePath, relativePath, stat } of files) {
    const buffer = lib_default.readFileSync(absolutePath);
    if (opts2.readManifest && relativePath === "package.json") {
      manifest = parseJsonBufferSync(buffer);
    }
    const mode = stat.mode & 511;
    filesIndex.set(relativePath, {
      mode,
      size: stat.size,
      ...addBuffer(buffer, mode)
    });
  }
  return { manifest, filesIndex };
}
function getStatIfContained(absolutePath, rootDir) {
  let lstat;
  try {
    lstat = fs.lstatSync(absolutePath);
  } catch (err) {
    if (util2.types.isNativeError(err) && "code" in err && err.code === "ENOENT") {
      return null;
    }
    throw err;
  }
  if (lstat.isSymbolicLink()) {
    return getSymlinkStatIfContained(absolutePath, rootDir)?.stat ?? null;
  }
  return lstat;
}
function getSymlinkStatIfContained(absolutePath, rootDir) {
  let realPath;
  try {
    realPath = fs.realpathSync(absolutePath);
  } catch (err) {
    if (util2.types.isNativeError(err) && "code" in err && err.code === "ENOENT") {
      return null;
    }
    throw err;
  }
  if (!(0, import_is_subdir.default)(rootDir, realPath)) {
    return null;
  }
  return { stat: fs.statSync(realPath), realPath };
}
function findFilesInDir(dir, rootDir) {
  const files = [];
  const ctx = {
    filesList: files,
    rootDir,
    visited: /* @__PURE__ */ new Set([rootDir])
  };
  findFiles(ctx, dir, "", rootDir);
  return files;
}
function findFiles(ctx, dir, relativeDir, currentRealPath) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const relativeSubdir = `${relativeDir}${relativeDir ? "/" : ""}${file.name}`;
    const absolutePath = path.join(dir, file.name);
    let nextRealDir;
    if (file.isSymbolicLink()) {
      const res = getSymlinkStatIfContained(absolutePath, ctx.rootDir);
      if (!res) {
        continue;
      }
      if (res.stat.isDirectory()) {
        nextRealDir = res.realPath;
      } else {
        ctx.filesList.push({
          relativePath: relativeSubdir,
          absolutePath,
          stat: res.stat
        });
        continue;
      }
    } else if (file.isDirectory()) {
      nextRealDir = path.join(currentRealPath, file.name);
    }
    if (nextRealDir) {
      if (ctx.visited.has(nextRealDir))
        continue;
      if (relativeDir !== "" || file.name !== "node_modules") {
        ctx.visited.add(nextRealDir);
        findFiles(ctx, absolutePath, relativeSubdir, nextRealDir);
        ctx.visited.delete(nextRealDir);
      }
      continue;
    }
    let stat;
    try {
      stat = fs.statSync(absolutePath);
    } catch (err) {
      if (util2.types.isNativeError(err) && "code" in err && err.code === "ENOENT") {
        continue;
      }
      throw err;
    }
    ctx.filesList.push({
      relativePath: relativeSubdir,
      absolutePath,
      stat
    });
  }
}

// ../store/cafs/lib/addFilesFromTarball.js
var import_is_gzip = __toESM(require_is_gzip(), 1);
import { gunzipSync } from "zlib";

// ../store/cafs/lib/parseTarball.js
import path2 from "path";
var ZERO = "0".charCodeAt(0);
var FILE_TYPE_HARD_LINK = "1".charCodeAt(0);
var FILE_TYPE_SYMLINK = "2".charCodeAt(0);
var FILE_TYPE_DIRECTORY = "5".charCodeAt(0);
var SPACE = " ".charCodeAt(0);
var SLASH = "/".charCodeAt(0);
var BACKSLASH = "\\".charCodeAt(0);
var FILE_TYPE_PAX_HEADER = "x".charCodeAt(0);
var FILE_TYPE_PAX_GLOBAL_HEADER = "g".charCodeAt(0);
var FILE_TYPE_LONGLINK = "L".charCodeAt(0);
var MODE_OFFSET = 100;
var FILE_SIZE_OFFSET = 124;
var CHECKSUM_OFFSET = 148;
var FILE_TYPE_OFFSET = 156;
var PREFIX_OFFSET = 345;
function parseTarball(buffer) {
  const files = /* @__PURE__ */ new Map();
  let pathTrimmed = false;
  let mode = 0;
  let fileSize = 0;
  let fileType = 0;
  let prefix = "";
  let fileName = "";
  let longLinkPath = "";
  let paxHeaderPath = "";
  let paxHeaderFileSize;
  let blockBytes = 0;
  let blockStart = 0;
  while (buffer[blockStart] !== 0) {
    fileType = buffer[blockStart + FILE_TYPE_OFFSET];
    if (paxHeaderFileSize !== void 0) {
      fileSize = paxHeaderFileSize;
      paxHeaderFileSize = void 0;
    } else {
      fileSize = parseOctal(blockStart + FILE_SIZE_OFFSET, 12);
    }
    blockBytes = (fileSize & ~511) + (fileSize & 511 ? 1024 : 512);
    const expectedCheckSum = parseOctal(blockStart + CHECKSUM_OFFSET, 8);
    const actualCheckSum = checkSum(blockStart);
    if (expectedCheckSum !== actualCheckSum) {
      throw new Error(`Invalid checksum for TAR header at offset ${blockStart}. Expected ${expectedCheckSum}, got ${actualCheckSum}`);
    }
    pathTrimmed = false;
    if (longLinkPath) {
      fileName = longLinkPath;
      longLinkPath = "";
    } else if (paxHeaderPath) {
      fileName = paxHeaderPath;
      paxHeaderPath = "";
    } else {
      prefix = parseString(blockStart + PREFIX_OFFSET, 155);
      if (prefix && !pathTrimmed) {
        pathTrimmed = true;
        prefix = "";
      }
      fileName = parseString(blockStart, MODE_OFFSET);
      if (prefix) {
        fileName = `${prefix}/${fileName}`;
      }
    }
    if (fileName.includes("./") || fileName.includes(".\\")) {
      fileName = path2.posix.join("/", fileName.replaceAll("\\", "/")).slice(1);
    }
    switch (fileType) {
      case 0:
      case ZERO:
      case FILE_TYPE_HARD_LINK:
        mode = parseOctal(blockStart + MODE_OFFSET, 8);
        files.set(fileName.replaceAll("//", "/"), { offset: blockStart + 512, mode, size: fileSize });
        break;
      case FILE_TYPE_DIRECTORY:
      case FILE_TYPE_SYMLINK:
        break;
      case FILE_TYPE_PAX_HEADER:
        parsePaxHeader(blockStart + 512, fileSize, false);
        break;
      case FILE_TYPE_PAX_GLOBAL_HEADER:
        parsePaxHeader(blockStart + 512, fileSize, true);
        break;
      case FILE_TYPE_LONGLINK: {
        longLinkPath = buffer.toString("utf8", blockStart + 512, blockStart + 512 + fileSize).replace(/\0.*/, "");
        const slashIndex = longLinkPath.indexOf("/");
        if (slashIndex >= 0) {
          longLinkPath = longLinkPath.slice(slashIndex + 1);
        }
        break;
      }
      default:
        throw new Error(`Unsupported file type ${fileType} for file ${fileName}.`);
    }
    blockStart += blockBytes;
  }
  return { files, buffer: buffer.buffer };
  function checkSum(offset) {
    let sum = 256;
    let i = offset;
    const checksumStart = offset + 148;
    const checksumEnd = offset + 156;
    const blockEnd = offset + 512;
    for (; i < checksumStart; i++) {
      sum += buffer[i];
    }
    for (i = checksumEnd; i < blockEnd; i++) {
      sum += buffer[i];
    }
    return sum;
  }
  function parsePaxHeader(offset, length, global2) {
    const end = offset + length;
    let i = offset;
    while (i < end) {
      const lineStart = i;
      while (i < end && buffer[i] !== SPACE) {
        i++;
      }
      const strLen = buffer.toString("utf-8", lineStart, i);
      const len = parseInt(strLen, 10);
      if (!len) {
        throw new Error(`Invalid length in PAX record: ${strLen}`);
      }
      i++;
      const lineEnd = lineStart + len;
      const record = buffer.toString("utf-8", i, lineEnd - 1);
      i = lineEnd;
      const equalSign = record.indexOf("=");
      const keyword = record.slice(0, equalSign);
      if (keyword === "path") {
        const slashIndex = record.indexOf("/", equalSign + 1);
        if (global2) {
          throw new Error(`Unexpected global PAX path: ${record}`);
        }
        paxHeaderPath = record.slice(slashIndex >= 0 ? slashIndex + 1 : equalSign + 1);
      } else if (keyword === "size") {
        const size = parseInt(record.slice(equalSign + 1), 10);
        if (isNaN(size) || size < 0) {
          throw new Error(`Invalid size in PAX record: ${record}`);
        }
        if (global2) {
          throw new Error(`Unexpected global PAX file size: ${record}`);
        }
        paxHeaderFileSize = size;
      } else {
        continue;
      }
    }
  }
  function parseString(offset, length) {
    let end = offset;
    const max = length + offset;
    for (let char = buffer[end]; char !== 0 && end !== max; char = buffer[++end]) {
      if (!pathTrimmed && (char === SLASH || char === BACKSLASH)) {
        pathTrimmed = true;
        offset = end + 1;
      }
    }
    return buffer.toString("utf8", offset, end);
  }
  function parseOctal(offset, length) {
    const val = buffer.subarray(offset, offset + length);
    offset = 0;
    while (offset < val.length && val[offset] === SPACE)
      offset++;
    const end = clamp(indexOf(val, SPACE, offset, val.length), val.length, val.length);
    while (offset < end && val[offset] === 0)
      offset++;
    if (end === offset)
      return 0;
    return parseInt(val.subarray(offset, end).toString(), 8);
  }
}
function indexOf(block, num, offset, end) {
  for (; offset < end; offset++) {
    if (block[offset] === num)
      return offset;
  }
  return end;
}
function clamp(index, len, defaultValue) {
  if (typeof index !== "number")
    return defaultValue;
  index = ~~index;
  if (index >= len)
    return len;
  if (index >= 0)
    return index;
  index += len;
  if (index >= 0)
    return index;
  return 0;
}

// ../store/cafs/lib/addFilesFromTarball.js
function addFilesFromTarball(addBufferToCafs2, _ignore, tarballBuffer, readManifest) {
  const ignore = _ignore ?? (() => false);
  const tarContent = (0, import_is_gzip.default)(tarballBuffer) ? gunzipSync(tarballBuffer) : Buffer.isBuffer(tarballBuffer) ? tarballBuffer : Buffer.from(tarballBuffer);
  const { files } = parseTarball(tarContent);
  const filesIndex = /* @__PURE__ */ new Map();
  let manifestBuffer;
  for (const [relativePath, { mode, offset, size }] of files) {
    if (ignore(relativePath))
      continue;
    const fileBuffer = tarContent.subarray(offset, offset + size);
    if (readManifest && relativePath === "package.json") {
      manifestBuffer = fileBuffer;
    }
    filesIndex.set(relativePath, {
      mode,
      size,
      ...addBufferToCafs2(fileBuffer, mode)
    });
  }
  return {
    filesIndex,
    manifest: manifestBuffer ? parseJsonBufferSync(manifestBuffer) : void 0
  };
}

// ../store/cafs/lib/checkPkgFilesIntegrity.js
import crypto from "crypto";
import fs2 from "fs";
import util3 from "util";
var import_rimraf = __toESM(require_rimraf(), 1);

// ../store/cafs/lib/getFilePathInCafs.js
import path3 from "path";

// ../crypto/integrity/lib/index.js
var INTEGRITY_REGEX = /^([^-]+)-([a-z0-9+/=]+)$/i;
function parseIntegrity(integrity) {
  const match = integrity.match(INTEGRITY_REGEX);
  if (!match) {
    throw new PnpmError("INVALID_INTEGRITY", `Invalid integrity format: expected "algo-base64hash", got "${integrity}"`);
  }
  const hexDigest = Buffer.from(match[2], "base64").toString("hex");
  if (hexDigest.length === 0) {
    throw new PnpmError("INVALID_INTEGRITY", "Invalid integrity: base64 hash decoded to empty digest");
  }
  return { algorithm: match[1], hexDigest };
}
function formatIntegrity(algorithm, hexDigest) {
  return `${algorithm}-${Buffer.from(hexDigest, "hex").toString("base64")}`;
}

// ../store/cafs/lib/getFilePathInCafs.js
var modeIsExecutable = (mode) => (mode & 73) !== 0;
function getFilePathByModeInCafs(storeDir, hexDigest, mode) {
  const fileType = modeIsExecutable(mode) ? "exec" : "nonexec";
  return path3.join(storeDir, contentPathFromHex(fileType, hexDigest));
}
function getIndexFilePathInCafs(storeDir, integrity, pkgId) {
  const { hexDigest } = parseIntegrity(integrity);
  const hex = hexDigest.substring(0, 64);
  return path3.join(storeDir, `index/${path3.join(hex.slice(0, 2), hex.slice(2))}-${pkgId.replace(/[\\/:*?"<>|]/g, "+")}.mpk`);
}
function contentPathFromHex(fileType, hex) {
  const p = path3.join("files", hex.slice(0, 2), hex.slice(2));
  switch (fileType) {
    case "exec":
      return `${p}-exec`;
    case "nonexec":
      return p;
  }
}

// ../store/cafs/lib/readManifestFromStore.js
function readManifestFromStore(storeDir, pkgIndex) {
  const pkg = pkgIndex.files.get("package.json");
  if (pkg) {
    const fileName = getFilePathByModeInCafs(storeDir, pkg.digest, pkg.mode);
    return parseJsonBufferSync(lib_default.readFileSync(fileName));
  }
  return void 0;
}

// ../store/cafs/lib/checkPkgFilesIntegrity.js
global["verifiedFileIntegrity"] = 0;
function checkPkgFilesIntegrity(storeDir, pkgIndex, readManifest) {
  const verifiedFilesCache = /* @__PURE__ */ new Set();
  const _checkFilesIntegrity = checkFilesIntegrity.bind(null, verifiedFilesCache, storeDir, pkgIndex.algo);
  const verified = _checkFilesIntegrity(pkgIndex.files, readManifest);
  if (!verified.passed)
    return verified;
  const sideEffectsMaps = /* @__PURE__ */ new Map();
  if (pkgIndex.sideEffects) {
    for (const [sideEffectName, { added, deleted }] of pkgIndex.sideEffects) {
      if (added) {
        const result = _checkFilesIntegrity(added);
        if (!result.passed) {
          continue;
        } else {
          sideEffectsMaps.set(sideEffectName, { added: result.filesMap, deleted });
        }
      } else if (deleted) {
        sideEffectsMaps.set(sideEffectName, { deleted });
      }
    }
  }
  return {
    ...verified,
    sideEffectsMaps: sideEffectsMaps.size > 0 ? sideEffectsMaps : void 0
  };
}
function buildFileMapsFromIndex(storeDir, pkgIndex, readManifest) {
  const filesMap = /* @__PURE__ */ new Map();
  for (const [f, fstat] of pkgIndex.files) {
    const filename = getFilePathByModeInCafs(storeDir, fstat.digest, fstat.mode);
    filesMap.set(f, filename);
  }
  const sideEffectsMaps = /* @__PURE__ */ new Map();
  if (pkgIndex.sideEffects) {
    for (const [sideEffectName, { added, deleted }] of pkgIndex.sideEffects) {
      const sideEffectEntry = {};
      if (added) {
        const addedFilesMap = /* @__PURE__ */ new Map();
        for (const [f, fstat] of added) {
          const filename = getFilePathByModeInCafs(storeDir, fstat.digest, fstat.mode);
          addedFilesMap.set(f, filename);
        }
        sideEffectEntry.added = addedFilesMap;
      }
      if (deleted) {
        sideEffectEntry.deleted = deleted;
      }
      sideEffectsMaps.set(sideEffectName, sideEffectEntry);
    }
  }
  return {
    passed: true,
    manifest: readManifest ? readManifestFromStore(storeDir, pkgIndex) : void 0,
    filesMap,
    sideEffectsMaps: sideEffectsMaps.size > 0 ? sideEffectsMaps : void 0
  };
}
function checkFilesIntegrity(verifiedFilesCache, storeDir, algo, files, readManifest) {
  let allVerified = true;
  let manifest;
  const filesMap = /* @__PURE__ */ new Map();
  for (const [f, fstat] of files) {
    if (!fstat.digest) {
      throw new PnpmError("MISSING_CONTENT_DIGEST", `Content digest is missing for ${f}`);
    }
    const filename = getFilePathByModeInCafs(storeDir, fstat.digest, fstat.mode);
    filesMap.set(f, filename);
    const readFile = readManifest && f === "package.json";
    if (!readFile && verifiedFilesCache.has(filename))
      continue;
    const verifyResult = verifyFile(filename, fstat, algo, readFile);
    if (readFile) {
      manifest = verifyResult.manifest;
    }
    if (verifyResult.passed) {
      verifiedFilesCache.add(filename);
    } else {
      allVerified = false;
    }
  }
  return {
    passed: allVerified,
    manifest,
    filesMap
  };
}
function verifyFile(filename, fstat, algorithm, readManifest) {
  const currentFile = checkFile(filename, fstat.checkedAt);
  if (currentFile == null)
    return { passed: false };
  if (currentFile.isModified) {
    if (currentFile.size !== fstat.size) {
      import_rimraf.default.sync(filename);
      return { passed: false };
    }
    return verifyFileIntegrity(filename, { digest: fstat.digest, algorithm }, readManifest);
  }
  if (readManifest) {
    return {
      passed: true,
      manifest: parseJsonBufferSync(lib_default.readFileSync(filename))
    };
  }
  return { passed: true };
}
function verifyFileIntegrity(filename, integrity, readManifest) {
  global["verifiedFileIntegrity"]++;
  let data;
  try {
    data = lib_default.readFileSync(filename);
  } catch (err) {
    if (util3.types.isNativeError(err) && "code" in err && err.code === "ENOENT") {
      return { passed: false };
    }
    throw err;
  }
  let computedDigest;
  try {
    computedDigest = crypto.hash(integrity.algorithm, data, "hex");
  } catch {
    return { passed: false };
  }
  const passed = computedDigest === integrity.digest;
  if (!passed) {
    lib_default.unlinkSync(filename);
    return { passed };
  }
  if (readManifest) {
    return {
      passed,
      manifest: parseJsonBufferSync(data)
    };
  }
  return { passed };
}
function checkFile(filename, checkedAt) {
  try {
    const { mtimeMs, size } = fs2.statSync(filename);
    return {
      isModified: mtimeMs - (checkedAt ?? 0) > 100,
      size
    };
  } catch (err) {
    if (util3.types.isNativeError(err) && "code" in err && err.code === "ENOENT")
      return null;
    throw err;
  }
}

// ../store/cafs/lib/writeBufferToCafs.js
var import_rename_overwrite = __toESM(require_rename_overwrite(), 1);
import fs3 from "fs";
import path5 from "path";
import workerThreads from "worker_threads";
import util4 from "util";

// ../store/cafs/lib/writeFile.js
import path4 from "path";
var dirs = /* @__PURE__ */ new Set();
function writeFile(fileDest, buffer, mode) {
  makeDirForFile(fileDest);
  lib_default.writeFileSync(fileDest, buffer, { mode });
}
function makeDirForFile(fileDest) {
  const dir = path4.dirname(fileDest);
  if (!dirs.has(dir)) {
    lib_default.mkdirSync(dir, { recursive: true });
    dirs.add(dir);
  }
}

// ../store/cafs/lib/writeBufferToCafs.js
function writeBufferToCafs(locker, storeDir, buffer, fileDest, mode, integrity) {
  fileDest = path5.join(storeDir, fileDest);
  if (locker.has(fileDest)) {
    return {
      checkedAt: locker.get(fileDest),
      filePath: fileDest
    };
  }
  if (existsSame(fileDest, integrity)) {
    return {
      checkedAt: Date.now(),
      filePath: fileDest
    };
  }
  const temp = pathTemp(fileDest);
  writeFile(temp, buffer, mode);
  const birthtimeMs = Date.now();
  optimisticRenameOverwrite(temp, fileDest);
  locker.set(fileDest, birthtimeMs);
  return {
    checkedAt: birthtimeMs,
    filePath: fileDest
  };
}
function optimisticRenameOverwrite(temp, fileDest) {
  try {
    import_rename_overwrite.default.sync(temp, fileDest);
  } catch (err) {
    if (!(util4.types.isNativeError(err) && "code" in err && err.code === "ENOENT") || !fs3.existsSync(fileDest))
      throw err;
  }
}
function pathTemp(file) {
  const basename = removeSuffix(path5.basename(file));
  return path5.join(path5.dirname(file), `${basename}${process.pid}${workerThreads.threadId}`);
}
function removeSuffix(filePath) {
  const dashPosition = filePath.indexOf("-");
  if (dashPosition === -1)
    return filePath;
  const withoutSuffix = filePath.substring(0, dashPosition);
  if (filePath.substring(dashPosition) === "-exec") {
    return `${withoutSuffix}x`;
  }
  return withoutSuffix;
}
function existsSame(filename, integrity) {
  const existingFile = fs3.statSync(filename, { throwIfNoEntry: false });
  if (!existingFile)
    return false;
  return verifyFileIntegrity(filename, integrity).passed;
}

// ../store/cafs/lib/index.js
var HASH_ALGORITHM = "sha512";
function createCafs(storeDir, { ignoreFile, cafsLocker: cafsLocker2 } = {}) {
  const _writeBufferToCafs = writeBufferToCafs.bind(null, cafsLocker2 ?? /* @__PURE__ */ new Map(), storeDir);
  const addBuffer = addBufferToCafs.bind(null, _writeBufferToCafs);
  return {
    addFilesFromDir: addFilesFromDir.bind(null, addBuffer),
    addFilesFromTarball: addFilesFromTarball.bind(null, addBuffer, ignoreFile ?? null),
    addFile: addBuffer,
    getIndexFilePathInCafs: getIndexFilePathInCafs.bind(null, storeDir),
    getFilePathByModeInCafs: getFilePathByModeInCafs.bind(null, storeDir)
  };
}
function addBufferToCafs(writeBufferToCafs2, buffer, mode) {
  const digest = crypto2.hash(HASH_ALGORITHM, buffer, "hex");
  const isExecutable = modeIsExecutable(mode);
  const fileDest = contentPathFromHex(isExecutable ? "exec" : "nonexec", digest);
  const { checkedAt, filePath } = writeBufferToCafs2(buffer, fileDest, isExecutable ? 493 : void 0, { digest, algorithm: HASH_ALGORITHM });
  return { checkedAt, filePath, digest };
}

// ../fs/indexed-pkg-importer/lib/index.js
import assert from "assert";
import { constants, existsSync } from "fs";
import util6 from "util";
import path7 from "path";

// ../packages/logger/lib/logger.js
var import_bole = __toESM(require_bole(), 1);
import_bole.default.setFastTime();
var logger = (0, import_bole.default)("pnpm");
var globalLogger = (0, import_bole.default)("pnpm:global");
function globalWarn(message) {
  globalLogger.warn(message);
}
function globalInfo(message) {
  globalLogger.info(message);
}

// ../packages/logger/lib/streamParser.js
var import_bole2 = __toESM(require_bole(), 1);

// ../packages/logger/lib/ndjsonParse.js
var import_split2 = __toESM(require_split2(), 1);
var opts = { strict: true };
function parse() {
  function parseRow(row) {
    try {
      if (row)
        return JSON.parse(row);
    } catch (_e) {
      if (opts.strict) {
        this.emit("error", new Error(`Could not parse row "${row.length > 50 ? `${row.slice(0, 50)}...` : row}"`));
      }
    }
  }
  return (0, import_split2.default)(parseRow, opts);
}

// ../packages/logger/lib/streamParser.js
var streamParser = createStreamParser();
function createStreamParser() {
  const sp = parse();
  import_bole2.default.output([
    {
      level: "debug",
      stream: sp
    }
  ]);
  return sp;
}

// ../packages/logger/lib/writeToConsole.js
var import_bole3 = __toESM(require_bole(), 1);

// ../packages/core-loggers/lib/contextLogger.js
var contextLogger = logger("context");

// ../packages/core-loggers/lib/deprecationLogger.js
var deprecationLogger = logger("deprecation");

// ../packages/core-loggers/lib/fetchingProgressLogger.js
var fetchingProgressLogger = logger("fetching-progress");

// ../packages/core-loggers/lib/hookLogger.js
var hookLogger = logger("hook");

// ../packages/core-loggers/lib/installCheckLogger.js
var installCheckLogger = logger("install-check");

// ../packages/core-loggers/lib/installingConfigDeps.js
var installingConfigDepsLogger = logger("installing-config-deps");

// ../packages/core-loggers/lib/ignoredScriptsLogger.js
var ignoredScriptsLogger = logger("ignored-scripts");

// ../packages/core-loggers/lib/lifecycleLogger.js
var lifecycleLogger = logger("lifecycle");

// ../packages/core-loggers/lib/linkLogger.js
var linkLogger = logger("link");

// ../packages/core-loggers/lib/packageImportMethodLogger.js
var packageImportMethodLogger = logger("package-import-method");

// ../packages/core-loggers/lib/packageManifestLogger.js
var packageManifestLogger = logger("package-manifest");

// ../packages/core-loggers/lib/peerDependencyIssues.js
var peerDependencyIssuesLogger = logger("peer-dependency-issues");

// ../packages/core-loggers/lib/progressLogger.js
var progressLogger = logger("progress");

// ../packages/core-loggers/lib/removalLogger.js
var removalLogger = logger("removal");

// ../packages/core-loggers/lib/requestRetryLogger.js
var requestRetryLogger = logger("request-retry");

// ../packages/core-loggers/lib/rootLogger.js
var rootLogger = logger("root");

// ../packages/core-loggers/lib/scopeLogger.js
var scopeLogger = logger("scope");

// ../packages/core-loggers/lib/skippedOptionalDependencyLogger.js
var skippedOptionalDependencyLogger = logger("skipped-optional-dependency");

// ../packages/core-loggers/lib/stageLogger.js
var stageLogger = logger("stage");

// ../packages/core-loggers/lib/statsLogger.js
var statsLogger = logger("stats");

// ../packages/core-loggers/lib/summaryLogger.js
var summaryLogger = logger("summary");

// ../packages/core-loggers/lib/updateCheckLogger.js
var updateCheckLogger = logger("update-check");

// ../packages/core-loggers/lib/executionTimeLogger.js
var executionTimeLogger = logger("execution-time");

// ../fs/indexed-pkg-importer/lib/importIndexedDir.js
var import_fs_extra = __toESM(require_lib2(), 1);
import fs4 from "fs";
import util5 from "util";
import path6 from "path";
var import_rimraf2 = __toESM(require_rimraf(), 1);
var import_make_empty_dir = __toESM(require_make_empty_dir(), 1);
var import_sanitize_filename = __toESM(require_sanitize_filename(), 1);
var import_path_temp = __toESM(require_path_temp(), 1);
var import_rename_overwrite2 = __toESM(require_rename_overwrite(), 1);
var filenameConflictsLogger = logger("_filename-conflicts");
function importIndexedDir(importFile, newDir, filenames, opts2) {
  const stage = (0, import_path_temp.fastPathTemp)(newDir);
  try {
    tryImportIndexedDir(importFile, stage, filenames);
    if (opts2.keepModulesDir) {
      moveOrMergeModulesDirs(path6.join(newDir, "node_modules"), path6.join(stage, "node_modules"));
    }
    import_rename_overwrite2.default.sync(stage, newDir);
  } catch (err) {
    try {
      (0, import_rimraf2.sync)(stage);
    } catch {
    }
    if (util5.types.isNativeError(err) && "code" in err && err.code === "EEXIST") {
      const { uniqueFileMap, conflictingFileNames } = getUniqueFileMap(filenames);
      if (conflictingFileNames.size === 0)
        throw err;
      filenameConflictsLogger.debug({
        conflicts: Object.fromEntries(conflictingFileNames),
        writingTo: newDir
      });
      globalWarn(`Not all files were linked to "${path6.relative(process.cwd(), newDir)}". Some of the files have equal names in different case, which is an issue on case-insensitive filesystems. The conflicting file names are: ${JSON.stringify(Object.fromEntries(conflictingFileNames))}`);
      importIndexedDir(importFile, newDir, uniqueFileMap, opts2);
      return;
    }
    if (util5.types.isNativeError(err) && "code" in err && err.code === "ENOENT") {
      const { sanitizedFilenames, invalidFilenames } = sanitizeFilenames(filenames);
      if (invalidFilenames.length === 0)
        throw err;
      globalWarn(`The package linked to "${path6.relative(process.cwd(), newDir)}" had files with invalid names: ${invalidFilenames.join(", ")}. They were renamed.`);
      importIndexedDir(importFile, newDir, sanitizedFilenames, opts2);
      return;
    }
    throw err;
  }
}
function sanitizeFilenames(filenames) {
  const sanitizedFilenames = /* @__PURE__ */ new Map();
  const invalidFilenames = [];
  for (const [filename, src2] of filenames) {
    const sanitizedFilename = filename.split("/").map((f) => (0, import_sanitize_filename.default)(f)).join("/");
    if (sanitizedFilename !== filename) {
      invalidFilenames.push(filename);
    }
    sanitizedFilenames.set(sanitizedFilename, src2);
  }
  return { sanitizedFilenames, invalidFilenames };
}
function tryImportIndexedDir(importFile, newDir, filenames) {
  (0, import_make_empty_dir.sync)(newDir, { recursive: true });
  const allDirs = /* @__PURE__ */ new Set();
  for (const f of filenames.keys()) {
    const dir = path6.dirname(f);
    if (dir === ".")
      continue;
    allDirs.add(dir);
  }
  Array.from(allDirs).sort((d1, d2) => d1.length - d2.length).forEach((dir) => fs4.mkdirSync(path6.join(newDir, dir), { recursive: true }));
  for (const [f, src2] of filenames) {
    const dest = path6.join(newDir, f);
    importFile(src2, dest);
  }
}
function getUniqueFileMap(fileMap) {
  const lowercaseFiles = /* @__PURE__ */ new Map();
  const conflictingFileNames = /* @__PURE__ */ new Map();
  const uniqueFileMap = /* @__PURE__ */ new Map();
  for (const filename of Array.from(fileMap.keys()).sort()) {
    const lowercaseFilename = filename.toLowerCase();
    if (lowercaseFiles.has(lowercaseFilename)) {
      conflictingFileNames.set(filename, lowercaseFiles.get(lowercaseFilename));
      continue;
    }
    lowercaseFiles.set(lowercaseFilename, filename);
    uniqueFileMap.set(filename, fileMap.get(filename));
  }
  return {
    conflictingFileNames,
    uniqueFileMap
  };
}
function moveOrMergeModulesDirs(src2, dest) {
  try {
    renameEvenAcrossDevices(src2, dest);
  } catch (err) {
    switch (util5.types.isNativeError(err) && "code" in err && err.code) {
      case "ENOENT":
        return;
      case "ENOTEMPTY":
      case "EPERM":
        mergeModulesDirs(src2, dest);
        return;
      default:
        throw err;
    }
  }
}
function renameEvenAcrossDevices(src2, dest) {
  try {
    lib_default.renameSync(src2, dest);
  } catch (err) {
    if (!(util5.types.isNativeError(err) && "code" in err && err.code === "EXDEV"))
      throw err;
    import_fs_extra.default.copySync(src2, dest);
  }
}
function mergeModulesDirs(src2, dest) {
  const srcFiles = fs4.readdirSync(src2);
  const destFiles = new Set(fs4.readdirSync(dest));
  const filesToMove = srcFiles.filter((file) => !destFiles.has(file));
  for (const file of filesToMove) {
    renameEvenAcrossDevices(path6.join(src2, file), path6.join(dest, file));
  }
}

// ../fs/indexed-pkg-importer/lib/index.js
function createIndexedPkgImporter(packageImportMethod) {
  const importPackage2 = createImportPackage(packageImportMethod);
  return importPackage2;
}
function createImportPackage(packageImportMethod) {
  switch (packageImportMethod ?? "auto") {
    case "clone":
      packageImportMethodLogger.debug({ method: "clone" });
      return clonePkg.bind(null, createCloneFunction());
    case "hardlink":
      packageImportMethodLogger.debug({ method: "hardlink" });
      return hardlinkPkg.bind(null, linkOrCopy);
    case "auto": {
      return createAutoImporter();
    }
    case "clone-or-copy":
      return createCloneOrCopyImporter();
    case "copy":
      packageImportMethodLogger.debug({ method: "copy" });
      return copyPkg;
    default:
      throw new Error(`Unknown package import method ${packageImportMethod}`);
  }
}
function createAutoImporter() {
  let auto = initialAuto;
  return (to, opts2) => auto(to, opts2);
  function initialAuto(to, opts2) {
    if (process.platform !== "win32") {
      try {
        const _clonePkg = clonePkg.bind(null, createCloneFunction());
        if (!_clonePkg(to, opts2))
          return void 0;
        packageImportMethodLogger.debug({ method: "clone" });
        auto = _clonePkg;
        return "clone";
      } catch {
      }
    }
    try {
      if (!hardlinkPkg(lib_default.linkSync, to, opts2))
        return void 0;
      packageImportMethodLogger.debug({ method: "hardlink" });
      auto = hardlinkPkg.bind(null, linkOrCopy);
      return "hardlink";
    } catch (err) {
      assert(util6.types.isNativeError(err));
      if (err.message.startsWith("EXDEV: cross-device link not permitted")) {
        globalWarn(err.message);
        globalInfo("Falling back to copying packages from store");
        packageImportMethodLogger.debug({ method: "copy" });
        auto = copyPkg;
        return auto(to, opts2);
      }
      packageImportMethodLogger.debug({ method: "hardlink" });
      auto = hardlinkPkg.bind(null, linkOrCopy);
      return auto(to, opts2);
    }
  }
}
function createCloneOrCopyImporter() {
  let auto = initialAuto;
  return (to, opts2) => auto(to, opts2);
  function initialAuto(to, opts2) {
    try {
      const _clonePkg = clonePkg.bind(null, createCloneFunction());
      if (!_clonePkg(to, opts2))
        return void 0;
      packageImportMethodLogger.debug({ method: "clone" });
      auto = _clonePkg;
      return "clone";
    } catch {
    }
    packageImportMethodLogger.debug({ method: "copy" });
    auto = copyPkg;
    return auto(to, opts2);
  }
}
function clonePkg(clone, to, opts2) {
  if (opts2.resolvedFrom !== "store" || opts2.force || !pkgExistsAtTargetDir(to, opts2.filesMap)) {
    importIndexedDir(clone, to, opts2.filesMap, opts2);
    return "clone";
  }
  return void 0;
}
function pkgExistsAtTargetDir(targetDir, filesMap) {
  return existsSync(path7.join(targetDir, pickFileFromFilesMap(filesMap)));
}
function pickFileFromFilesMap(filesMap) {
  if (filesMap.has("package.json")) {
    return "package.json";
  }
  if (filesMap.size === 0) {
    throw new Error("pickFileFromFilesMap cannot pick a file from an empty FilesMap");
  }
  return filesMap.keys().next().value;
}
function createCloneFunction() {
  if (process.platform === "darwin" || process.platform === "win32") {
    const { reflinkFileSync } = require_reflink();
    return (fr, to) => {
      try {
        reflinkFileSync(fr, to);
      } catch (err) {
        if (!util6.types.isNativeError(err) || !("code" in err) || err.code !== "EEXIST")
          throw err;
      }
    };
  }
  return (src2, dest) => {
    try {
      lib_default.copyFileSync(src2, dest, constants.COPYFILE_FICLONE_FORCE);
    } catch (err) {
      if (!(util6.types.isNativeError(err) && "code" in err && err.code === "EEXIST"))
        throw err;
    }
  };
}
function hardlinkPkg(importFile, to, opts2) {
  if (opts2.force || shouldRelinkPkg(to, opts2)) {
    importIndexedDir(importFile, to, opts2.filesMap, opts2);
    return "hardlink";
  }
  return void 0;
}
function shouldRelinkPkg(to, opts2) {
  if (opts2.disableRelinkLocalDirDeps && opts2.resolvedFrom === "local-dir") {
    try {
      const files = lib_default.readdirSync(to);
      return files.length === 0 || files.length === 1 && files[0] === "node_modules";
    } catch {
      return true;
    }
  }
  return opts2.resolvedFrom !== "store" || !pkgLinkedToStore(opts2.filesMap, to);
}
function linkOrCopy(existingPath, newPath) {
  try {
    lib_default.linkSync(existingPath, newPath);
  } catch (err) {
    if (util6.types.isNativeError(err) && "code" in err && err.code === "EEXIST")
      return;
    lib_default.copyFileSync(existingPath, newPath);
  }
}
function pkgLinkedToStore(filesMap, linkedPkgDir) {
  const filename = pickFileFromFilesMap(filesMap);
  const linkedFile = path7.join(linkedPkgDir, filename);
  let stats0;
  try {
    stats0 = lib_default.statSync(linkedFile);
  } catch (err) {
    if (util6.types.isNativeError(err) && "code" in err && err.code === "ENOENT")
      return false;
  }
  const stats1 = lib_default.statSync(filesMap.get(filename));
  if (stats0.ino === stats1.ino)
    return true;
  globalInfo(`Relinking ${linkedPkgDir} from the store`);
  return false;
}
function copyPkg(to, opts2) {
  if (opts2.resolvedFrom !== "store" || opts2.force || !pkgExistsAtTargetDir(to, opts2.filesMap)) {
    importIndexedDir(lib_default.copyFileSync, to, opts2.filesMap, opts2);
    return "copy";
  }
  return void 0;
}

// ../../../.local/share/pnpm/store/v10/links/@/mimic-function/5.0.1/a0a3d68a83883043b47a3c9aac58c3570e777a4fa469a6af68c2aa6a72df0b04/node_modules/mimic-function/index.js
var copyProperty = (to, from, property, ignoreNonConfigurable) => {
  if (property === "length" || property === "prototype") {
    return;
  }
  if (property === "arguments" || property === "caller") {
    return;
  }
  const toDescriptor = Object.getOwnPropertyDescriptor(to, property);
  const fromDescriptor = Object.getOwnPropertyDescriptor(from, property);
  if (!canCopyProperty(toDescriptor, fromDescriptor) && ignoreNonConfigurable) {
    return;
  }
  Object.defineProperty(to, property, fromDescriptor);
};
var canCopyProperty = function(toDescriptor, fromDescriptor) {
  return toDescriptor === void 0 || toDescriptor.configurable || toDescriptor.writable === fromDescriptor.writable && toDescriptor.enumerable === fromDescriptor.enumerable && toDescriptor.configurable === fromDescriptor.configurable && (toDescriptor.writable || toDescriptor.value === fromDescriptor.value);
};
var changePrototype = (to, from) => {
  const fromPrototype = Object.getPrototypeOf(from);
  if (fromPrototype === Object.getPrototypeOf(to)) {
    return;
  }
  Object.setPrototypeOf(to, fromPrototype);
};
var wrappedToString = (withName, fromBody) => `/* Wrapped ${withName}*/
${fromBody}`;
var toStringDescriptor = Object.getOwnPropertyDescriptor(Function.prototype, "toString");
var toStringName = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name");
var changeToString = (to, from, name) => {
  const withName = name === "" ? "" : `with ${name.trim()}() `;
  const newToString = wrappedToString.bind(null, withName, from.toString());
  Object.defineProperty(newToString, "name", toStringName);
  const { writable, enumerable, configurable } = toStringDescriptor;
  Object.defineProperty(to, "toString", { value: newToString, writable, enumerable, configurable });
};
function mimicFunction(to, from, { ignoreNonConfigurable = false } = {}) {
  const { name } = to;
  for (const property of Reflect.ownKeys(from)) {
    copyProperty(to, from, property, ignoreNonConfigurable);
  }
  changePrototype(to, from);
  changeToString(to, from, name);
  return to;
}

// ../../../.local/share/pnpm/store/v10/links/@/memoize/10.2.0/d21689fadc7625bc10c7b3b0f7e41e2aea3227bccbd7d2474a41caa6a90dd228/node_modules/memoize/distribution/index.js
var maxTimeoutValue = 2147483647;
var cacheStore = /* @__PURE__ */ new WeakMap();
var cacheTimerStore = /* @__PURE__ */ new WeakMap();
var cacheKeyStore = /* @__PURE__ */ new WeakMap();
function getValidCacheItem(cache, key) {
  const item = cache.get(key);
  if (!item) {
    return void 0;
  }
  if (item.maxAge <= Date.now()) {
    cache.delete(key);
    return void 0;
  }
  return item;
}
function memoize(function_, { cacheKey, cache = /* @__PURE__ */ new Map(), maxAge } = {}) {
  if (maxAge === 0) {
    return function_;
  }
  if (typeof maxAge === "number" && Number.isFinite(maxAge)) {
    if (maxAge > maxTimeoutValue) {
      throw new TypeError(`The \`maxAge\` option cannot exceed ${maxTimeoutValue}.`);
    }
    if (maxAge < 0) {
      throw new TypeError("The `maxAge` option should not be a negative number.");
    }
  }
  const memoized = function(...arguments_) {
    const key = cacheKey ? cacheKey(arguments_) : arguments_[0];
    const cacheItem = getValidCacheItem(cache, key);
    if (cacheItem) {
      return cacheItem.data;
    }
    const result = function_.apply(this, arguments_);
    const computedMaxAge = typeof maxAge === "function" ? maxAge(...arguments_) : maxAge;
    if (computedMaxAge !== void 0 && computedMaxAge !== Number.POSITIVE_INFINITY) {
      if (!Number.isFinite(computedMaxAge)) {
        throw new TypeError("The `maxAge` function must return a finite number, `0`, or `Infinity`.");
      }
      if (computedMaxAge <= 0) {
        return result;
      }
      if (computedMaxAge > maxTimeoutValue) {
        throw new TypeError(`The \`maxAge\` function result cannot exceed ${maxTimeoutValue}.`);
      }
    }
    cache.set(key, {
      data: result,
      maxAge: computedMaxAge === void 0 || computedMaxAge === Number.POSITIVE_INFINITY ? Number.POSITIVE_INFINITY : Date.now() + computedMaxAge
    });
    if (computedMaxAge !== void 0 && computedMaxAge !== Number.POSITIVE_INFINITY) {
      const timer = setTimeout(() => {
        cache.delete(key);
        cacheTimerStore.get(memoized)?.delete(timer);
      }, computedMaxAge);
      timer.unref?.();
      const timers = cacheTimerStore.get(memoized) ?? /* @__PURE__ */ new Set();
      timers.add(timer);
      cacheTimerStore.set(memoized, timers);
    }
    return result;
  };
  mimicFunction(memoized, function_, {
    ignoreNonConfigurable: true
  });
  cacheStore.set(memoized, cache);
  cacheKeyStore.set(memoized, cacheKey ?? ((arguments_) => arguments_[0]));
  return memoized;
}

// ../store/create-cafs-store/lib/index.js
var import_path_temp2 = __toESM(require_path_temp(), 1);
function createPackageImporter(opts2) {
  const cachedImporterCreator = opts2.importIndexedPackage ? () => opts2.importIndexedPackage : memoize(createIndexedPkgImporter);
  const packageImportMethod = opts2.packageImportMethod;
  const gfm = getFlatMap.bind(null, opts2.storeDir);
  return (to, opts3) => {
    const { filesMap, isBuilt } = gfm(opts3.filesResponse, opts3.sideEffectsCacheKey);
    const willBeBuilt = !isBuilt && opts3.requiresBuild;
    const pkgImportMethod = willBeBuilt ? "clone-or-copy" : opts3.filesResponse.packageImportMethod ?? packageImportMethod;
    const impPkg = cachedImporterCreator(pkgImportMethod);
    const importMethod = impPkg(to, {
      disableRelinkLocalDirDeps: opts3.disableRelinkLocalDirDeps,
      filesMap,
      resolvedFrom: opts3.filesResponse.resolvedFrom,
      force: opts3.force,
      keepModulesDir: Boolean(opts3.keepModulesDir)
    });
    return { importMethod, isBuilt };
  };
}
function getFlatMap(storeDir, filesResponse, targetEngine) {
  if (targetEngine && filesResponse.sideEffectsMaps?.has(targetEngine)) {
    const sideEffectMap = filesResponse.sideEffectsMaps.get(targetEngine);
    const filesMap = applySideEffectsDiffWithMaps(filesResponse.filesMap, sideEffectMap);
    return {
      filesMap,
      isBuilt: true
    };
  }
  return {
    filesMap: filesResponse.filesMap,
    isBuilt: false
  };
}
function applySideEffectsDiffWithMaps(baseFiles, { added, deleted }) {
  const filesWithSideEffects = /* @__PURE__ */ new Map();
  if (added) {
    for (const [name, filePath] of added.entries()) {
      filesWithSideEffects.set(name, filePath);
    }
  }
  for (const [fileName, filePath] of baseFiles) {
    if (!deleted?.includes(fileName) && !filesWithSideEffects.has(fileName)) {
      filesWithSideEffects.set(fileName, filePath);
    }
  }
  return filesWithSideEffects;
}
function createCafsStore(storeDir, opts2) {
  const baseTempDir = path8.join(storeDir, "tmp");
  const importPackage2 = createPackageImporter({
    importIndexedPackage: opts2?.importPackage,
    packageImportMethod: opts2?.packageImportMethod,
    storeDir
  });
  return {
    ...createCafs(storeDir, opts2),
    storeDir,
    importPackage: importPackage2,
    tempDir: async () => {
      const tmpDir = (0, import_path_temp2.default)(baseTempDir);
      await fs5.mkdir(tmpDir, { recursive: true });
      return tmpDir;
    }
  };
}

// ../exec/pkg-requires-build/lib/index.js
function pkgRequiresBuild(manifest, filesIndex) {
  return Boolean(manifest?.scripts != null && (Boolean(manifest.scripts.preinstall) || Boolean(manifest.scripts.install) || Boolean(manifest.scripts.postinstall)) || filesIncludeInstallScripts(filesIndex));
}
function filesIncludeInstallScripts(filesIndex) {
  const keys = filesIndex instanceof Map ? filesIndex.keys() : Object.keys(filesIndex);
  for (const filename of keys) {
    if (filename === "binding.gyp") {
      return true;
    }
    if (filename.match(/^\.hooks[\\/]/) != null) {
      return true;
    }
  }
  return false;
}

// ../fs/hard-link-dir/lib/index.js
import assert2 from "assert";
import path9 from "path";
import util7 from "util";
import fs6 from "fs";
var import_rename_overwrite3 = __toESM(require_rename_overwrite(), 1);
var import_path_temp3 = __toESM(require_path_temp(), 1);
function hardLinkDir(src2, destDirs) {
  if (destDirs.length === 0)
    return;
  const filteredDestDirs = [];
  const tempDestDirs = [];
  for (const destDir of destDirs) {
    if (path9.relative(destDir, src2) === "") {
      continue;
    }
    filteredDestDirs.push(destDir);
    tempDestDirs.push((0, import_path_temp3.default)(path9.dirname(destDir)));
  }
  _hardLinkDir(src2, tempDestDirs, true);
  for (let i = 0; i < filteredDestDirs.length; i++) {
    (0, import_rename_overwrite3.sync)(tempDestDirs[i], filteredDestDirs[i]);
  }
}
function _hardLinkDir(src2, destDirs, isRoot) {
  let files = [];
  try {
    files = fs6.readdirSync(src2);
  } catch (err) {
    if (!isRoot || !(util7.types.isNativeError(err) && "code" in err && err.code === "ENOENT"))
      throw err;
    globalWarn(`Source directory not found when creating hardLinks for: ${src2}. Creating destinations as empty: ${destDirs.join(", ")}`);
    for (const dir of destDirs) {
      lib_default.mkdirSync(dir, { recursive: true });
    }
    return;
  }
  for (const file of files) {
    if (file === "node_modules")
      continue;
    const srcFile = path9.join(src2, file);
    if (fs6.lstatSync(srcFile).isDirectory()) {
      const destSubdirs = destDirs.map((destDir) => {
        const destSubdir = path9.join(destDir, file);
        try {
          lib_default.mkdirSync(destSubdir, { recursive: true });
        } catch (err) {
          if (!(util7.types.isNativeError(err) && "code" in err && err.code === "EEXIST"))
            throw err;
        }
        return destSubdir;
      });
      _hardLinkDir(srcFile, destSubdirs);
      continue;
    }
    for (const destDir of destDirs) {
      const destFile = path9.join(destDir, file);
      try {
        linkOrCopyFile(srcFile, destFile);
      } catch (err) {
        if (util7.types.isNativeError(err) && "code" in err && err.code === "ENOENT") {
          continue;
        }
        throw err;
      }
    }
  }
}
function linkOrCopyFile(srcFile, destFile) {
  try {
    linkOrCopy2(srcFile, destFile);
  } catch (err) {
    assert2(util7.types.isNativeError(err));
    if ("code" in err && err.code === "ENOENT") {
      lib_default.mkdirSync(path9.dirname(destFile), { recursive: true });
      linkOrCopy2(srcFile, destFile);
      return;
    }
    if (!("code" in err && err.code === "EEXIST")) {
      throw err;
    }
  }
}
function linkOrCopy2(srcFile, destFile) {
  try {
    lib_default.linkSync(srcFile, destFile);
  } catch (err) {
    if (util7.types.isNativeError(err) && "code" in err && (err.code === "EXDEV" || err.code === "ENOENT")) {
      lib_default.copyFileSync(srcFile, destFile);
    } else {
      throw err;
    }
  }
}

// ../../../.local/share/pnpm/store/v10/links/@/msgpackr/1.11.8/fa1e0559f197fee8478659a989f441927184ac384813f709c00ba8e06a1533c9/node_modules/msgpackr/unpack.js
var decoder;
try {
  decoder = new TextDecoder();
} catch (error) {
}
var src;
var srcEnd;
var position = 0;
var EMPTY_ARRAY = [];
var strings = EMPTY_ARRAY;
var stringPosition = 0;
var currentUnpackr = {};
var currentStructures;
var srcString;
var srcStringStart = 0;
var srcStringEnd = 0;
var bundledStrings;
var referenceMap;
var currentExtensions = [];
var dataView;
var defaultOptions = {
  useRecords: false,
  mapsAsObjects: true
};
var C1Type = class {
};
var C1 = new C1Type();
C1.name = "MessagePack 0xC1";
var sequentialMode = false;
var inlineObjectReadThreshold = 2;
var readStruct;
var onLoadedStructures;
var onSaveState;
try {
  new Function("");
} catch (error) {
  inlineObjectReadThreshold = Infinity;
}
var Unpackr = class _Unpackr {
  constructor(options) {
    if (options) {
      if (options.useRecords === false && options.mapsAsObjects === void 0)
        options.mapsAsObjects = true;
      if (options.sequential && options.trusted !== false) {
        options.trusted = true;
        if (!options.structures && options.useRecords != false) {
          options.structures = [];
          if (!options.maxSharedStructures)
            options.maxSharedStructures = 0;
        }
      }
      if (options.structures)
        options.structures.sharedLength = options.structures.length;
      else if (options.getStructures) {
        (options.structures = []).uninitialized = true;
        options.structures.sharedLength = 0;
      }
      if (options.int64AsNumber) {
        options.int64AsType = "number";
      }
    }
    Object.assign(this, options);
  }
  unpack(source, options) {
    if (src) {
      return saveState(() => {
        clearSource();
        return this ? this.unpack(source, options) : _Unpackr.prototype.unpack.call(defaultOptions, source, options);
      });
    }
    if (!source.buffer && source.constructor === ArrayBuffer)
      source = typeof Buffer !== "undefined" ? Buffer.from(source) : new Uint8Array(source);
    if (typeof options === "object") {
      srcEnd = options.end || source.length;
      position = options.start || 0;
    } else {
      position = 0;
      srcEnd = options > -1 ? options : source.length;
    }
    stringPosition = 0;
    srcStringEnd = 0;
    srcString = null;
    strings = EMPTY_ARRAY;
    bundledStrings = null;
    src = source;
    try {
      dataView = source.dataView || (source.dataView = new DataView(source.buffer, source.byteOffset, source.byteLength));
    } catch (error) {
      src = null;
      if (source instanceof Uint8Array)
        throw error;
      throw new Error("Source must be a Uint8Array or Buffer but was a " + (source && typeof source == "object" ? source.constructor.name : typeof source));
    }
    if (this instanceof _Unpackr) {
      currentUnpackr = this;
      if (this.structures) {
        currentStructures = this.structures;
        return checkedRead(options);
      } else if (!currentStructures || currentStructures.length > 0) {
        currentStructures = [];
      }
    } else {
      currentUnpackr = defaultOptions;
      if (!currentStructures || currentStructures.length > 0)
        currentStructures = [];
    }
    return checkedRead(options);
  }
  unpackMultiple(source, forEach) {
    let values, lastPosition = 0;
    try {
      sequentialMode = true;
      let size = source.length;
      let value = this ? this.unpack(source, size) : defaultUnpackr.unpack(source, size);
      if (forEach) {
        if (forEach(value, lastPosition, position) === false) return;
        while (position < size) {
          lastPosition = position;
          if (forEach(checkedRead(), lastPosition, position) === false) {
            return;
          }
        }
      } else {
        values = [value];
        while (position < size) {
          lastPosition = position;
          values.push(checkedRead());
        }
        return values;
      }
    } catch (error) {
      error.lastPosition = lastPosition;
      error.values = values;
      throw error;
    } finally {
      sequentialMode = false;
      clearSource();
    }
  }
  _mergeStructures(loadedStructures, existingStructures) {
    if (onLoadedStructures)
      loadedStructures = onLoadedStructures.call(this, loadedStructures);
    loadedStructures = loadedStructures || [];
    if (Object.isFrozen(loadedStructures))
      loadedStructures = loadedStructures.map((structure) => structure.slice(0));
    for (let i = 0, l = loadedStructures.length; i < l; i++) {
      let structure = loadedStructures[i];
      if (structure) {
        structure.isShared = true;
        if (i >= 32)
          structure.highByte = i - 32 >> 5;
      }
    }
    loadedStructures.sharedLength = loadedStructures.length;
    for (let id in existingStructures || []) {
      if (id >= 0) {
        let structure = loadedStructures[id];
        let existing = existingStructures[id];
        if (existing) {
          if (structure)
            (loadedStructures.restoreStructures || (loadedStructures.restoreStructures = []))[id] = structure;
          loadedStructures[id] = existing;
        }
      }
    }
    return this.structures = loadedStructures;
  }
  decode(source, options) {
    return this.unpack(source, options);
  }
};
function checkedRead(options) {
  try {
    if (!currentUnpackr.trusted && !sequentialMode) {
      let sharedLength = currentStructures.sharedLength || 0;
      if (sharedLength < currentStructures.length)
        currentStructures.length = sharedLength;
    }
    let result;
    if (currentUnpackr.randomAccessStructure && src[position] < 64 && src[position] >= 32 && readStruct) {
      result = readStruct(src, position, srcEnd, currentUnpackr);
      src = null;
      if (!(options && options.lazy) && result)
        result = result.toJSON();
      position = srcEnd;
    } else
      result = read();
    if (bundledStrings) {
      position = bundledStrings.postBundlePosition;
      bundledStrings = null;
    }
    if (sequentialMode)
      currentStructures.restoreStructures = null;
    if (position == srcEnd) {
      if (currentStructures && currentStructures.restoreStructures)
        restoreStructures();
      currentStructures = null;
      src = null;
      if (referenceMap)
        referenceMap = null;
    } else if (position > srcEnd) {
      throw new Error("Unexpected end of MessagePack data");
    } else if (!sequentialMode) {
      let jsonView;
      try {
        jsonView = JSON.stringify(result, (_, value) => typeof value === "bigint" ? `${value}n` : value).slice(0, 100);
      } catch (error) {
        jsonView = "(JSON view not available " + error + ")";
      }
      throw new Error("Data read, but end of buffer not reached " + jsonView);
    }
    return result;
  } catch (error) {
    if (currentStructures && currentStructures.restoreStructures)
      restoreStructures();
    clearSource();
    if (error instanceof RangeError || error.message.startsWith("Unexpected end of buffer") || position > srcEnd) {
      error.incomplete = true;
    }
    throw error;
  }
}
function restoreStructures() {
  for (let id in currentStructures.restoreStructures) {
    currentStructures[id] = currentStructures.restoreStructures[id];
  }
  currentStructures.restoreStructures = null;
}
function read() {
  let token = src[position++];
  if (token < 160) {
    if (token < 128) {
      if (token < 64)
        return token;
      else {
        let structure = currentStructures[token & 63] || currentUnpackr.getStructures && loadStructures()[token & 63];
        if (structure) {
          if (!structure.read) {
            structure.read = createStructureReader(structure, token & 63);
          }
          return structure.read();
        } else
          return token;
      }
    } else if (token < 144) {
      token -= 128;
      if (currentUnpackr.mapsAsObjects) {
        let object = {};
        for (let i = 0; i < token; i++) {
          let key = readKey();
          if (key === "__proto__")
            key = "__proto_";
          object[key] = read();
        }
        return object;
      } else {
        let map = /* @__PURE__ */ new Map();
        for (let i = 0; i < token; i++) {
          map.set(read(), read());
        }
        return map;
      }
    } else {
      token -= 144;
      let array = new Array(token);
      for (let i = 0; i < token; i++) {
        array[i] = read();
      }
      if (currentUnpackr.freezeData)
        return Object.freeze(array);
      return array;
    }
  } else if (token < 192) {
    let length = token - 160;
    if (srcStringEnd >= position) {
      return srcString.slice(position - srcStringStart, (position += length) - srcStringStart);
    }
    if (srcStringEnd == 0 && srcEnd < 140) {
      let string = length < 16 ? shortStringInJS(length) : longStringInJS(length);
      if (string != null)
        return string;
    }
    return readFixedString(length);
  } else {
    let value;
    switch (token) {
      case 192:
        return null;
      case 193:
        if (bundledStrings) {
          value = read();
          if (value > 0)
            return bundledStrings[1].slice(bundledStrings.position1, bundledStrings.position1 += value);
          else
            return bundledStrings[0].slice(bundledStrings.position0, bundledStrings.position0 -= value);
        }
        return C1;
      // "never-used", return special object to denote that
      case 194:
        return false;
      case 195:
        return true;
      case 196:
        value = src[position++];
        if (value === void 0)
          throw new Error("Unexpected end of buffer");
        return readBin(value);
      case 197:
        value = dataView.getUint16(position);
        position += 2;
        return readBin(value);
      case 198:
        value = dataView.getUint32(position);
        position += 4;
        return readBin(value);
      case 199:
        return readExt(src[position++]);
      case 200:
        value = dataView.getUint16(position);
        position += 2;
        return readExt(value);
      case 201:
        value = dataView.getUint32(position);
        position += 4;
        return readExt(value);
      case 202:
        value = dataView.getFloat32(position);
        if (currentUnpackr.useFloat32 > 2) {
          let multiplier = mult10[(src[position] & 127) << 1 | src[position + 1] >> 7];
          position += 4;
          return (multiplier * value + (value > 0 ? 0.5 : -0.5) >> 0) / multiplier;
        }
        position += 4;
        return value;
      case 203:
        value = dataView.getFloat64(position);
        position += 8;
        return value;
      // uint handlers
      case 204:
        return src[position++];
      case 205:
        value = dataView.getUint16(position);
        position += 2;
        return value;
      case 206:
        value = dataView.getUint32(position);
        position += 4;
        return value;
      case 207:
        if (currentUnpackr.int64AsType === "number") {
          value = dataView.getUint32(position) * 4294967296;
          value += dataView.getUint32(position + 4);
        } else if (currentUnpackr.int64AsType === "string") {
          value = dataView.getBigUint64(position).toString();
        } else if (currentUnpackr.int64AsType === "auto") {
          value = dataView.getBigUint64(position);
          if (value <= BigInt(2) << BigInt(52)) value = Number(value);
        } else
          value = dataView.getBigUint64(position);
        position += 8;
        return value;
      // int handlers
      case 208:
        return dataView.getInt8(position++);
      case 209:
        value = dataView.getInt16(position);
        position += 2;
        return value;
      case 210:
        value = dataView.getInt32(position);
        position += 4;
        return value;
      case 211:
        if (currentUnpackr.int64AsType === "number") {
          value = dataView.getInt32(position) * 4294967296;
          value += dataView.getUint32(position + 4);
        } else if (currentUnpackr.int64AsType === "string") {
          value = dataView.getBigInt64(position).toString();
        } else if (currentUnpackr.int64AsType === "auto") {
          value = dataView.getBigInt64(position);
          if (value >= BigInt(-2) << BigInt(52) && value <= BigInt(2) << BigInt(52)) value = Number(value);
        } else
          value = dataView.getBigInt64(position);
        position += 8;
        return value;
      case 212:
        value = src[position++];
        if (value == 114) {
          return recordDefinition(src[position++] & 63);
        } else {
          let extension = currentExtensions[value];
          if (extension) {
            if (extension.read) {
              position++;
              return extension.read(read());
            } else if (extension.noBuffer) {
              position++;
              return extension();
            } else
              return extension(src.subarray(position, ++position));
          } else
            throw new Error("Unknown extension " + value);
        }
      case 213:
        value = src[position];
        if (value == 114) {
          position++;
          return recordDefinition(src[position++] & 63, src[position++]);
        } else
          return readExt(2);
      case 214:
        return readExt(4);
      case 215:
        return readExt(8);
      case 216:
        return readExt(16);
      case 217:
        value = src[position++];
        if (srcStringEnd >= position) {
          return srcString.slice(position - srcStringStart, (position += value) - srcStringStart);
        }
        return readString8(value);
      case 218:
        value = dataView.getUint16(position);
        position += 2;
        if (srcStringEnd >= position) {
          return srcString.slice(position - srcStringStart, (position += value) - srcStringStart);
        }
        return readString16(value);
      case 219:
        value = dataView.getUint32(position);
        position += 4;
        if (srcStringEnd >= position) {
          return srcString.slice(position - srcStringStart, (position += value) - srcStringStart);
        }
        return readString32(value);
      case 220:
        value = dataView.getUint16(position);
        position += 2;
        return readArray(value);
      case 221:
        value = dataView.getUint32(position);
        position += 4;
        return readArray(value);
      case 222:
        value = dataView.getUint16(position);
        position += 2;
        return readMap(value);
      case 223:
        value = dataView.getUint32(position);
        position += 4;
        return readMap(value);
      default:
        if (token >= 224)
          return token - 256;
        if (token === void 0) {
          let error = new Error("Unexpected end of MessagePack data");
          error.incomplete = true;
          throw error;
        }
        throw new Error("Unknown MessagePack token " + token);
    }
  }
}
var validName = /^[a-zA-Z_$][a-zA-Z\d_$]*$/;
function createStructureReader(structure, firstId) {
  function readObject() {
    if (readObject.count++ > inlineObjectReadThreshold) {
      let readObject2 = structure.read = new Function("r", "return function(){return " + (currentUnpackr.freezeData ? "Object.freeze" : "") + "({" + structure.map((key) => key === "__proto__" ? "__proto_:r()" : validName.test(key) ? key + ":r()" : "[" + JSON.stringify(key) + "]:r()").join(",") + "})}")(read);
      if (structure.highByte === 0)
        structure.read = createSecondByteReader(firstId, structure.read);
      return readObject2();
    }
    let object = {};
    for (let i = 0, l = structure.length; i < l; i++) {
      let key = structure[i];
      if (key === "__proto__")
        key = "__proto_";
      object[key] = read();
    }
    if (currentUnpackr.freezeData)
      return Object.freeze(object);
    return object;
  }
  readObject.count = 0;
  if (structure.highByte === 0) {
    return createSecondByteReader(firstId, readObject);
  }
  return readObject;
}
var createSecondByteReader = (firstId, read0) => {
  return function() {
    let highByte = src[position++];
    if (highByte === 0)
      return read0();
    let id = firstId < 32 ? -(firstId + (highByte << 5)) : firstId + (highByte << 5);
    let structure = currentStructures[id] || loadStructures()[id];
    if (!structure) {
      throw new Error("Record id is not defined for " + id);
    }
    if (!structure.read)
      structure.read = createStructureReader(structure, firstId);
    return structure.read();
  };
};
function loadStructures() {
  let loadedStructures = saveState(() => {
    src = null;
    return currentUnpackr.getStructures();
  });
  return currentStructures = currentUnpackr._mergeStructures(loadedStructures, currentStructures);
}
var readFixedString = readStringJS;
var readString8 = readStringJS;
var readString16 = readStringJS;
var readString32 = readStringJS;
var isNativeAccelerationEnabled = false;
function setExtractor(extractStrings) {
  isNativeAccelerationEnabled = true;
  readFixedString = readString2(1);
  readString8 = readString2(2);
  readString16 = readString2(3);
  readString32 = readString2(5);
  function readString2(headerLength) {
    return function readString3(length) {
      let string = strings[stringPosition++];
      if (string == null) {
        if (bundledStrings)
          return readStringJS(length);
        let byteOffset = src.byteOffset;
        let extraction = extractStrings(position - headerLength + byteOffset, srcEnd + byteOffset, src.buffer);
        if (typeof extraction == "string") {
          string = extraction;
          strings = EMPTY_ARRAY;
        } else {
          strings = extraction;
          stringPosition = 1;
          srcStringEnd = 1;
          string = strings[0];
          if (string === void 0)
            throw new Error("Unexpected end of buffer");
        }
      }
      let srcStringLength = string.length;
      if (srcStringLength <= length) {
        position += length;
        return string;
      }
      srcString = string;
      srcStringStart = position;
      srcStringEnd = position + srcStringLength;
      position += length;
      return string.slice(0, length);
    };
  }
}
function readStringJS(length) {
  let result;
  if (length < 16) {
    if (result = shortStringInJS(length))
      return result;
  }
  if (length > 64 && decoder)
    return decoder.decode(src.subarray(position, position += length));
  const end = position + length;
  const units = [];
  result = "";
  while (position < end) {
    const byte1 = src[position++];
    if ((byte1 & 128) === 0) {
      units.push(byte1);
    } else if ((byte1 & 224) === 192) {
      const byte2 = src[position++] & 63;
      units.push((byte1 & 31) << 6 | byte2);
    } else if ((byte1 & 240) === 224) {
      const byte2 = src[position++] & 63;
      const byte3 = src[position++] & 63;
      units.push((byte1 & 31) << 12 | byte2 << 6 | byte3);
    } else if ((byte1 & 248) === 240) {
      const byte2 = src[position++] & 63;
      const byte3 = src[position++] & 63;
      const byte4 = src[position++] & 63;
      let unit = (byte1 & 7) << 18 | byte2 << 12 | byte3 << 6 | byte4;
      if (unit > 65535) {
        unit -= 65536;
        units.push(unit >>> 10 & 1023 | 55296);
        unit = 56320 | unit & 1023;
      }
      units.push(unit);
    } else {
      units.push(byte1);
    }
    if (units.length >= 4096) {
      result += fromCharCode.apply(String, units);
      units.length = 0;
    }
  }
  if (units.length > 0) {
    result += fromCharCode.apply(String, units);
  }
  return result;
}
function readString(source, start, length) {
  let existingSrc = src;
  src = source;
  position = start;
  try {
    return readStringJS(length);
  } finally {
    src = existingSrc;
  }
}
function readArray(length) {
  let array = new Array(length);
  for (let i = 0; i < length; i++) {
    array[i] = read();
  }
  if (currentUnpackr.freezeData)
    return Object.freeze(array);
  return array;
}
function readMap(length) {
  if (currentUnpackr.mapsAsObjects) {
    let object = {};
    for (let i = 0; i < length; i++) {
      let key = readKey();
      if (key === "__proto__")
        key = "__proto_";
      object[key] = read();
    }
    return object;
  } else {
    let map = /* @__PURE__ */ new Map();
    for (let i = 0; i < length; i++) {
      map.set(read(), read());
    }
    return map;
  }
}
var fromCharCode = String.fromCharCode;
function longStringInJS(length) {
  let start = position;
  let bytes = new Array(length);
  for (let i = 0; i < length; i++) {
    const byte = src[position++];
    if ((byte & 128) > 0) {
      position = start;
      return;
    }
    bytes[i] = byte;
  }
  return fromCharCode.apply(String, bytes);
}
function shortStringInJS(length) {
  if (length < 4) {
    if (length < 2) {
      if (length === 0)
        return "";
      else {
        let a = src[position++];
        if ((a & 128) > 1) {
          position -= 1;
          return;
        }
        return fromCharCode(a);
      }
    } else {
      let a = src[position++];
      let b = src[position++];
      if ((a & 128) > 0 || (b & 128) > 0) {
        position -= 2;
        return;
      }
      if (length < 3)
        return fromCharCode(a, b);
      let c = src[position++];
      if ((c & 128) > 0) {
        position -= 3;
        return;
      }
      return fromCharCode(a, b, c);
    }
  } else {
    let a = src[position++];
    let b = src[position++];
    let c = src[position++];
    let d = src[position++];
    if ((a & 128) > 0 || (b & 128) > 0 || (c & 128) > 0 || (d & 128) > 0) {
      position -= 4;
      return;
    }
    if (length < 6) {
      if (length === 4)
        return fromCharCode(a, b, c, d);
      else {
        let e = src[position++];
        if ((e & 128) > 0) {
          position -= 5;
          return;
        }
        return fromCharCode(a, b, c, d, e);
      }
    } else if (length < 8) {
      let e = src[position++];
      let f = src[position++];
      if ((e & 128) > 0 || (f & 128) > 0) {
        position -= 6;
        return;
      }
      if (length < 7)
        return fromCharCode(a, b, c, d, e, f);
      let g = src[position++];
      if ((g & 128) > 0) {
        position -= 7;
        return;
      }
      return fromCharCode(a, b, c, d, e, f, g);
    } else {
      let e = src[position++];
      let f = src[position++];
      let g = src[position++];
      let h = src[position++];
      if ((e & 128) > 0 || (f & 128) > 0 || (g & 128) > 0 || (h & 128) > 0) {
        position -= 8;
        return;
      }
      if (length < 10) {
        if (length === 8)
          return fromCharCode(a, b, c, d, e, f, g, h);
        else {
          let i = src[position++];
          if ((i & 128) > 0) {
            position -= 9;
            return;
          }
          return fromCharCode(a, b, c, d, e, f, g, h, i);
        }
      } else if (length < 12) {
        let i = src[position++];
        let j = src[position++];
        if ((i & 128) > 0 || (j & 128) > 0) {
          position -= 10;
          return;
        }
        if (length < 11)
          return fromCharCode(a, b, c, d, e, f, g, h, i, j);
        let k = src[position++];
        if ((k & 128) > 0) {
          position -= 11;
          return;
        }
        return fromCharCode(a, b, c, d, e, f, g, h, i, j, k);
      } else {
        let i = src[position++];
        let j = src[position++];
        let k = src[position++];
        let l = src[position++];
        if ((i & 128) > 0 || (j & 128) > 0 || (k & 128) > 0 || (l & 128) > 0) {
          position -= 12;
          return;
        }
        if (length < 14) {
          if (length === 12)
            return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l);
          else {
            let m = src[position++];
            if ((m & 128) > 0) {
              position -= 13;
              return;
            }
            return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m);
          }
        } else {
          let m = src[position++];
          let n = src[position++];
          if ((m & 128) > 0 || (n & 128) > 0) {
            position -= 14;
            return;
          }
          if (length < 15)
            return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m, n);
          let o = src[position++];
          if ((o & 128) > 0) {
            position -= 15;
            return;
          }
          return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o);
        }
      }
    }
  }
}
function readOnlyJSString() {
  let token = src[position++];
  let length;
  if (token < 192) {
    length = token - 160;
  } else {
    switch (token) {
      case 217:
        length = src[position++];
        break;
      case 218:
        length = dataView.getUint16(position);
        position += 2;
        break;
      case 219:
        length = dataView.getUint32(position);
        position += 4;
        break;
      default:
        throw new Error("Expected string");
    }
  }
  return readStringJS(length);
}
function readBin(length) {
  return currentUnpackr.copyBuffers ? (
    // specifically use the copying slice (not the node one)
    Uint8Array.prototype.slice.call(src, position, position += length)
  ) : src.subarray(position, position += length);
}
function readExt(length) {
  let type = src[position++];
  if (currentExtensions[type]) {
    let end;
    return currentExtensions[type](src.subarray(position, end = position += length), (readPosition) => {
      position = readPosition;
      try {
        return read();
      } finally {
        position = end;
      }
    });
  } else
    throw new Error("Unknown extension type " + type);
}
var keyCache = new Array(4096);
function readKey() {
  let length = src[position++];
  if (length >= 160 && length < 192) {
    length = length - 160;
    if (srcStringEnd >= position)
      return srcString.slice(position - srcStringStart, (position += length) - srcStringStart);
    else if (!(srcStringEnd == 0 && srcEnd < 180))
      return readFixedString(length);
  } else {
    position--;
    return asSafeString(read());
  }
  let key = (length << 5 ^ (length > 1 ? dataView.getUint16(position) : length > 0 ? src[position] : 0)) & 4095;
  let entry = keyCache[key];
  let checkPosition = position;
  let end = position + length - 3;
  let chunk;
  let i = 0;
  if (entry && entry.bytes == length) {
    while (checkPosition < end) {
      chunk = dataView.getUint32(checkPosition);
      if (chunk != entry[i++]) {
        checkPosition = 1879048192;
        break;
      }
      checkPosition += 4;
    }
    end += 3;
    while (checkPosition < end) {
      chunk = src[checkPosition++];
      if (chunk != entry[i++]) {
        checkPosition = 1879048192;
        break;
      }
    }
    if (checkPosition === end) {
      position = checkPosition;
      return entry.string;
    }
    end -= 3;
    checkPosition = position;
  }
  entry = [];
  keyCache[key] = entry;
  entry.bytes = length;
  while (checkPosition < end) {
    chunk = dataView.getUint32(checkPosition);
    entry.push(chunk);
    checkPosition += 4;
  }
  end += 3;
  while (checkPosition < end) {
    chunk = src[checkPosition++];
    entry.push(chunk);
  }
  let string = length < 16 ? shortStringInJS(length) : longStringInJS(length);
  if (string != null)
    return entry.string = string;
  return entry.string = readFixedString(length);
}
function asSafeString(property) {
  if (typeof property === "string") return property;
  if (typeof property === "number" || typeof property === "boolean" || typeof property === "bigint") return property.toString();
  if (property == null) return property + "";
  if (currentUnpackr.allowArraysInMapKeys && Array.isArray(property) && property.flat().every((item) => ["string", "number", "boolean", "bigint"].includes(typeof item))) {
    return property.flat().toString();
  }
  throw new Error(`Invalid property type for record: ${typeof property}`);
}
var recordDefinition = (id, highByte) => {
  let structure = read().map(asSafeString);
  let firstByte = id;
  if (highByte !== void 0) {
    id = id < 32 ? -((highByte << 5) + id) : (highByte << 5) + id;
    structure.highByte = highByte;
  }
  let existingStructure = currentStructures[id];
  if (existingStructure && (existingStructure.isShared || sequentialMode)) {
    (currentStructures.restoreStructures || (currentStructures.restoreStructures = []))[id] = existingStructure;
  }
  currentStructures[id] = structure;
  structure.read = createStructureReader(structure, firstByte);
  return structure.read();
};
currentExtensions[0] = () => {
};
currentExtensions[0].noBuffer = true;
currentExtensions[66] = (data) => {
  let headLength = data.byteLength % 8 || 8;
  let head = BigInt(data[0] & 128 ? data[0] - 256 : data[0]);
  for (let i = 1; i < headLength; i++) {
    head <<= BigInt(8);
    head += BigInt(data[i]);
  }
  if (data.byteLength !== headLength) {
    let view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    let decode2 = (start, end) => {
      let length = end - start;
      if (length <= 40) {
        let out = view.getBigUint64(start);
        for (let i = start + 8; i < end; i += 8) {
          out <<= BigInt(64n);
          out |= view.getBigUint64(i);
        }
        return out;
      }
      let middle = start + (length >> 4 << 3);
      let left = decode2(start, middle);
      let right = decode2(middle, end);
      return left << BigInt((end - middle) * 8) | right;
    };
    head = head << BigInt((view.byteLength - headLength) * 8) | decode2(headLength, view.byteLength);
  }
  return head;
};
var errors = {
  Error,
  EvalError,
  RangeError,
  ReferenceError,
  SyntaxError,
  TypeError,
  URIError,
  AggregateError: typeof AggregateError === "function" ? AggregateError : null
};
currentExtensions[101] = () => {
  let data = read();
  if (!errors[data[0]]) {
    let error = Error(data[1], { cause: data[2] });
    error.name = data[0];
    return error;
  }
  return errors[data[0]](data[1], { cause: data[2] });
};
currentExtensions[105] = (data) => {
  if (currentUnpackr.structuredClone === false) throw new Error("Structured clone extension is disabled");
  let id = dataView.getUint32(position - 4);
  if (!referenceMap)
    referenceMap = /* @__PURE__ */ new Map();
  let token = src[position];
  let target2;
  if (token >= 144 && token < 160 || token == 220 || token == 221)
    target2 = [];
  else if (token >= 128 && token < 144 || token == 222 || token == 223)
    target2 = /* @__PURE__ */ new Map();
  else if ((token >= 199 && token <= 201 || token >= 212 && token <= 216) && src[position + 1] === 115)
    target2 = /* @__PURE__ */ new Set();
  else
    target2 = {};
  let refEntry = { target: target2 };
  referenceMap.set(id, refEntry);
  let targetProperties = read();
  if (!refEntry.used) {
    return refEntry.target = targetProperties;
  } else {
    Object.assign(target2, targetProperties);
  }
  if (target2 instanceof Map)
    for (let [k, v] of targetProperties.entries()) target2.set(k, v);
  if (target2 instanceof Set)
    for (let i of Array.from(targetProperties)) target2.add(i);
  return target2;
};
currentExtensions[112] = (data) => {
  if (currentUnpackr.structuredClone === false) throw new Error("Structured clone extension is disabled");
  let id = dataView.getUint32(position - 4);
  let refEntry = referenceMap.get(id);
  refEntry.used = true;
  return refEntry.target;
};
currentExtensions[115] = () => new Set(read());
var typedArrays = ["Int8", "Uint8", "Uint8Clamped", "Int16", "Uint16", "Int32", "Uint32", "Float32", "Float64", "BigInt64", "BigUint64"].map((type) => type + "Array");
var glbl = typeof globalThis === "object" ? globalThis : window;
currentExtensions[116] = (data) => {
  let typeCode = data[0];
  let buffer = Uint8Array.prototype.slice.call(data, 1).buffer;
  let typedArrayName = typedArrays[typeCode];
  if (!typedArrayName) {
    if (typeCode === 16) return buffer;
    if (typeCode === 17) return new DataView(buffer);
    throw new Error("Could not find typed array for code " + typeCode);
  }
  return new glbl[typedArrayName](buffer);
};
currentExtensions[120] = () => {
  let data = read();
  return new RegExp(data[0], data[1]);
};
var TEMP_BUNDLE = [];
currentExtensions[98] = (data) => {
  let dataSize = (data[0] << 24) + (data[1] << 16) + (data[2] << 8) + data[3];
  let dataPosition = position;
  position += dataSize - data.length;
  bundledStrings = TEMP_BUNDLE;
  bundledStrings = [readOnlyJSString(), readOnlyJSString()];
  bundledStrings.position0 = 0;
  bundledStrings.position1 = 0;
  bundledStrings.postBundlePosition = position;
  position = dataPosition;
  return read();
};
currentExtensions[255] = (data) => {
  if (data.length == 4)
    return new Date((data[0] * 16777216 + (data[1] << 16) + (data[2] << 8) + data[3]) * 1e3);
  else if (data.length == 8)
    return new Date(
      ((data[0] << 22) + (data[1] << 14) + (data[2] << 6) + (data[3] >> 2)) / 1e6 + ((data[3] & 3) * 4294967296 + data[4] * 16777216 + (data[5] << 16) + (data[6] << 8) + data[7]) * 1e3
    );
  else if (data.length == 12)
    return new Date(
      ((data[0] << 24) + (data[1] << 16) + (data[2] << 8) + data[3]) / 1e6 + ((data[4] & 128 ? -281474976710656 : 0) + data[6] * 1099511627776 + data[7] * 4294967296 + data[8] * 16777216 + (data[9] << 16) + (data[10] << 8) + data[11]) * 1e3
    );
  else
    return /* @__PURE__ */ new Date("invalid");
};
function saveState(callback) {
  if (onSaveState)
    onSaveState();
  let savedSrcEnd = srcEnd;
  let savedPosition = position;
  let savedStringPosition = stringPosition;
  let savedSrcStringStart = srcStringStart;
  let savedSrcStringEnd = srcStringEnd;
  let savedSrcString = srcString;
  let savedStrings = strings;
  let savedReferenceMap = referenceMap;
  let savedBundledStrings = bundledStrings;
  let savedSrc = new Uint8Array(src.slice(0, srcEnd));
  let savedStructures = currentStructures;
  let savedStructuresContents = currentStructures.slice(0, currentStructures.length);
  let savedPackr = currentUnpackr;
  let savedSequentialMode = sequentialMode;
  let value = callback();
  srcEnd = savedSrcEnd;
  position = savedPosition;
  stringPosition = savedStringPosition;
  srcStringStart = savedSrcStringStart;
  srcStringEnd = savedSrcStringEnd;
  srcString = savedSrcString;
  strings = savedStrings;
  referenceMap = savedReferenceMap;
  bundledStrings = savedBundledStrings;
  src = savedSrc;
  sequentialMode = savedSequentialMode;
  currentStructures = savedStructures;
  currentStructures.splice(0, currentStructures.length, ...savedStructuresContents);
  currentUnpackr = savedPackr;
  dataView = new DataView(src.buffer, src.byteOffset, src.byteLength);
  return value;
}
function clearSource() {
  src = null;
  referenceMap = null;
  currentStructures = null;
}
var mult10 = new Array(147);
for (let i = 0; i < 256; i++) {
  mult10[i] = +("1e" + Math.floor(45.15 - i * 0.30103));
}
var defaultUnpackr = new Unpackr({ useRecords: false });
var unpack = defaultUnpackr.unpack;
var unpackMultiple = defaultUnpackr.unpackMultiple;
var decode = defaultUnpackr.unpack;
var FLOAT32_OPTIONS = {
  NEVER: 0,
  ALWAYS: 1,
  DECIMAL_ROUND: 3,
  DECIMAL_FIT: 4
};
var f32Array = new Float32Array(1);
var u8Array = new Uint8Array(f32Array.buffer, 0, 4);
function setReadStruct(updatedReadStruct, loadedStructs, saveState3) {
  readStruct = updatedReadStruct;
  onLoadedStructures = loadedStructs;
  onSaveState = saveState3;
}

// ../../../.local/share/pnpm/store/v10/links/@/msgpackr/1.11.8/fa1e0559f197fee8478659a989f441927184ac384813f709c00ba8e06a1533c9/node_modules/msgpackr/pack.js
var textEncoder;
try {
  textEncoder = new TextEncoder();
} catch (error) {
}
var extensions;
var extensionClasses;
var hasNodeBuffer = typeof Buffer !== "undefined";
var ByteArrayAllocate = hasNodeBuffer ? function(length) {
  return Buffer.allocUnsafeSlow(length);
} : Uint8Array;
var ByteArray = hasNodeBuffer ? Buffer : Uint8Array;
var MAX_BUFFER_SIZE = hasNodeBuffer ? 4294967296 : 2144337920;
var target;
var keysTarget;
var targetView;
var position2 = 0;
var safeEnd;
var bundledStrings2 = null;
var writeStructSlots;
var MAX_BUNDLE_SIZE = 21760;
var hasNonLatin = /[\u0080-\uFFFF]/;
var RECORD_SYMBOL = Symbol("record-id");
var Packr = class extends Unpackr {
  constructor(options) {
    super(options);
    this.offset = 0;
    let typeBuffer;
    let start;
    let hasSharedUpdate;
    let structures;
    let referenceMap2;
    let encodeUtf82 = ByteArray.prototype.utf8Write ? function(string, position3) {
      return target.utf8Write(string, position3, target.byteLength - position3);
    } : textEncoder && textEncoder.encodeInto ? function(string, position3) {
      return textEncoder.encodeInto(string, target.subarray(position3)).written;
    } : false;
    let packr2 = this;
    if (!options)
      options = {};
    let isSequential = options && options.sequential;
    let hasSharedStructures = options.structures || options.saveStructures;
    let maxSharedStructures = options.maxSharedStructures;
    if (maxSharedStructures == null)
      maxSharedStructures = hasSharedStructures ? 32 : 0;
    if (maxSharedStructures > 8160)
      throw new Error("Maximum maxSharedStructure is 8160");
    if (options.structuredClone && options.moreTypes == void 0) {
      this.moreTypes = true;
    }
    let maxOwnStructures = options.maxOwnStructures;
    if (maxOwnStructures == null)
      maxOwnStructures = hasSharedStructures ? 32 : 64;
    if (!this.structures && options.useRecords != false)
      this.structures = [];
    let useTwoByteRecords = maxSharedStructures > 32 || maxOwnStructures + maxSharedStructures > 64;
    let sharedLimitId = maxSharedStructures + 64;
    let maxStructureId = maxSharedStructures + maxOwnStructures + 64;
    if (maxStructureId > 8256) {
      throw new Error("Maximum maxSharedStructure + maxOwnStructure is 8192");
    }
    let recordIdsToRemove = [];
    let transitionsCount = 0;
    let serializationsSinceTransitionRebuild = 0;
    this.pack = this.encode = function(value, encodeOptions) {
      if (!target) {
        target = new ByteArrayAllocate(8192);
        targetView = target.dataView || (target.dataView = new DataView(target.buffer, 0, 8192));
        position2 = 0;
      }
      safeEnd = target.length - 10;
      if (safeEnd - position2 < 2048) {
        target = new ByteArrayAllocate(target.length);
        targetView = target.dataView || (target.dataView = new DataView(target.buffer, 0, target.length));
        safeEnd = target.length - 10;
        position2 = 0;
      } else
        position2 = position2 + 7 & 2147483640;
      start = position2;
      if (encodeOptions & RESERVE_START_SPACE) position2 += encodeOptions & 255;
      referenceMap2 = packr2.structuredClone ? /* @__PURE__ */ new Map() : null;
      if (packr2.bundleStrings && typeof value !== "string") {
        bundledStrings2 = [];
        bundledStrings2.size = Infinity;
      } else
        bundledStrings2 = null;
      structures = packr2.structures;
      if (structures) {
        if (structures.uninitialized)
          structures = packr2._mergeStructures(packr2.getStructures());
        let sharedLength = structures.sharedLength || 0;
        if (sharedLength > maxSharedStructures) {
          throw new Error("Shared structures is larger than maximum shared structures, try increasing maxSharedStructures to " + structures.sharedLength);
        }
        if (!structures.transitions) {
          structures.transitions = /* @__PURE__ */ Object.create(null);
          for (let i = 0; i < sharedLength; i++) {
            let keys = structures[i];
            if (!keys)
              continue;
            let nextTransition, transition = structures.transitions;
            for (let j = 0, l = keys.length; j < l; j++) {
              let key = keys[j];
              nextTransition = transition[key];
              if (!nextTransition) {
                nextTransition = transition[key] = /* @__PURE__ */ Object.create(null);
              }
              transition = nextTransition;
            }
            transition[RECORD_SYMBOL] = i + 64;
          }
          this.lastNamedStructuresLength = sharedLength;
        }
        if (!isSequential) {
          structures.nextId = sharedLength + 64;
        }
      }
      if (hasSharedUpdate)
        hasSharedUpdate = false;
      let encodingError;
      try {
        if (packr2.randomAccessStructure && value && typeof value === "object") {
          if (value.constructor === Object) writeStruct2(value);
          else if (value.constructor !== Map && !Array.isArray(value) && !extensionClasses.some((extClass) => value instanceof extClass)) {
            writeStruct2(value.toJSON ? value.toJSON() : value);
          } else pack2(value);
        } else
          pack2(value);
        let lastBundle = bundledStrings2;
        if (bundledStrings2)
          writeBundles(start, pack2, 0);
        if (referenceMap2 && referenceMap2.idsToInsert) {
          let idsToInsert = referenceMap2.idsToInsert.sort((a, b) => a.offset > b.offset ? 1 : -1);
          let i = idsToInsert.length;
          let incrementPosition = -1;
          while (lastBundle && i > 0) {
            let insertionPoint = idsToInsert[--i].offset + start;
            if (insertionPoint < lastBundle.stringsPosition + start && incrementPosition === -1)
              incrementPosition = 0;
            if (insertionPoint > lastBundle.position + start) {
              if (incrementPosition >= 0)
                incrementPosition += 6;
            } else {
              if (incrementPosition >= 0) {
                targetView.setUint32(
                  lastBundle.position + start,
                  targetView.getUint32(lastBundle.position + start) + incrementPosition
                );
                incrementPosition = -1;
              }
              lastBundle = lastBundle.previous;
              i++;
            }
          }
          if (incrementPosition >= 0 && lastBundle) {
            targetView.setUint32(
              lastBundle.position + start,
              targetView.getUint32(lastBundle.position + start) + incrementPosition
            );
          }
          position2 += idsToInsert.length * 6;
          if (position2 > safeEnd)
            makeRoom(position2);
          packr2.offset = position2;
          let serialized = insertIds(target.subarray(start, position2), idsToInsert);
          referenceMap2 = null;
          return serialized;
        }
        packr2.offset = position2;
        if (encodeOptions & REUSE_BUFFER_MODE) {
          target.start = start;
          target.end = position2;
          return target;
        }
        return target.subarray(start, position2);
      } catch (error) {
        encodingError = error;
        throw error;
      } finally {
        if (structures) {
          resetStructures();
          if (hasSharedUpdate && packr2.saveStructures) {
            let sharedLength = structures.sharedLength || 0;
            let returnBuffer = target.subarray(start, position2);
            let newSharedData = prepareStructures(structures, packr2);
            if (!encodingError) {
              if (packr2.saveStructures(newSharedData, newSharedData.isCompatible) === false) {
                return packr2.pack(value, encodeOptions);
              }
              packr2.lastNamedStructuresLength = sharedLength;
              if (target.length > 1073741824) target = null;
              return returnBuffer;
            }
          }
        }
        if (target.length > 1073741824) target = null;
        if (encodeOptions & RESET_BUFFER_MODE)
          position2 = start;
      }
    };
    const resetStructures = () => {
      if (serializationsSinceTransitionRebuild < 10)
        serializationsSinceTransitionRebuild++;
      let sharedLength = structures.sharedLength || 0;
      if (structures.length > sharedLength && !isSequential)
        structures.length = sharedLength;
      if (transitionsCount > 1e4) {
        structures.transitions = null;
        serializationsSinceTransitionRebuild = 0;
        transitionsCount = 0;
        if (recordIdsToRemove.length > 0)
          recordIdsToRemove = [];
      } else if (recordIdsToRemove.length > 0 && !isSequential) {
        for (let i = 0, l = recordIdsToRemove.length; i < l; i++) {
          recordIdsToRemove[i][RECORD_SYMBOL] = 0;
        }
        recordIdsToRemove = [];
      }
    };
    const packArray = (value) => {
      var length = value.length;
      if (length < 16) {
        target[position2++] = 144 | length;
      } else if (length < 65536) {
        target[position2++] = 220;
        target[position2++] = length >> 8;
        target[position2++] = length & 255;
      } else {
        target[position2++] = 221;
        targetView.setUint32(position2, length);
        position2 += 4;
      }
      for (let i = 0; i < length; i++) {
        pack2(value[i]);
      }
    };
    const pack2 = (value) => {
      if (position2 > safeEnd)
        target = makeRoom(position2);
      var type = typeof value;
      var length;
      if (type === "string") {
        let strLength = value.length;
        if (bundledStrings2 && strLength >= 4 && strLength < 4096) {
          if ((bundledStrings2.size += strLength) > MAX_BUNDLE_SIZE) {
            let extStart;
            let maxBytes2 = (bundledStrings2[0] ? bundledStrings2[0].length * 3 + bundledStrings2[1].length : 0) + 10;
            if (position2 + maxBytes2 > safeEnd)
              target = makeRoom(position2 + maxBytes2);
            let lastBundle;
            if (bundledStrings2.position) {
              lastBundle = bundledStrings2;
              target[position2] = 200;
              position2 += 3;
              target[position2++] = 98;
              extStart = position2 - start;
              position2 += 4;
              writeBundles(start, pack2, 0);
              targetView.setUint16(extStart + start - 3, position2 - start - extStart);
            } else {
              target[position2++] = 214;
              target[position2++] = 98;
              extStart = position2 - start;
              position2 += 4;
            }
            bundledStrings2 = ["", ""];
            bundledStrings2.previous = lastBundle;
            bundledStrings2.size = 0;
            bundledStrings2.position = extStart;
          }
          let twoByte = hasNonLatin.test(value);
          bundledStrings2[twoByte ? 0 : 1] += value;
          target[position2++] = 193;
          pack2(twoByte ? -strLength : strLength);
          return;
        }
        let headerSize;
        if (strLength < 32) {
          headerSize = 1;
        } else if (strLength < 256) {
          headerSize = 2;
        } else if (strLength < 65536) {
          headerSize = 3;
        } else {
          headerSize = 5;
        }
        let maxBytes = strLength * 3;
        if (position2 + maxBytes > safeEnd)
          target = makeRoom(position2 + maxBytes);
        if (strLength < 64 || !encodeUtf82) {
          let i, c1, c2, strPosition = position2 + headerSize;
          for (i = 0; i < strLength; i++) {
            c1 = value.charCodeAt(i);
            if (c1 < 128) {
              target[strPosition++] = c1;
            } else if (c1 < 2048) {
              target[strPosition++] = c1 >> 6 | 192;
              target[strPosition++] = c1 & 63 | 128;
            } else if ((c1 & 64512) === 55296 && ((c2 = value.charCodeAt(i + 1)) & 64512) === 56320) {
              c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
              i++;
              target[strPosition++] = c1 >> 18 | 240;
              target[strPosition++] = c1 >> 12 & 63 | 128;
              target[strPosition++] = c1 >> 6 & 63 | 128;
              target[strPosition++] = c1 & 63 | 128;
            } else {
              target[strPosition++] = c1 >> 12 | 224;
              target[strPosition++] = c1 >> 6 & 63 | 128;
              target[strPosition++] = c1 & 63 | 128;
            }
          }
          length = strPosition - position2 - headerSize;
        } else {
          length = encodeUtf82(value, position2 + headerSize);
        }
        if (length < 32) {
          target[position2++] = 160 | length;
        } else if (length < 256) {
          if (headerSize < 2) {
            target.copyWithin(position2 + 2, position2 + 1, position2 + 1 + length);
          }
          target[position2++] = 217;
          target[position2++] = length;
        } else if (length < 65536) {
          if (headerSize < 3) {
            target.copyWithin(position2 + 3, position2 + 2, position2 + 2 + length);
          }
          target[position2++] = 218;
          target[position2++] = length >> 8;
          target[position2++] = length & 255;
        } else {
          if (headerSize < 5) {
            target.copyWithin(position2 + 5, position2 + 3, position2 + 3 + length);
          }
          target[position2++] = 219;
          targetView.setUint32(position2, length);
          position2 += 4;
        }
        position2 += length;
      } else if (type === "number") {
        if (value >>> 0 === value) {
          if (value < 32 || value < 128 && this.useRecords === false || value < 64 && !this.randomAccessStructure) {
            target[position2++] = value;
          } else if (value < 256) {
            target[position2++] = 204;
            target[position2++] = value;
          } else if (value < 65536) {
            target[position2++] = 205;
            target[position2++] = value >> 8;
            target[position2++] = value & 255;
          } else {
            target[position2++] = 206;
            targetView.setUint32(position2, value);
            position2 += 4;
          }
        } else if (value >> 0 === value) {
          if (value >= -32) {
            target[position2++] = 256 + value;
          } else if (value >= -128) {
            target[position2++] = 208;
            target[position2++] = value + 256;
          } else if (value >= -32768) {
            target[position2++] = 209;
            targetView.setInt16(position2, value);
            position2 += 2;
          } else {
            target[position2++] = 210;
            targetView.setInt32(position2, value);
            position2 += 4;
          }
        } else {
          let useFloat32;
          if ((useFloat32 = this.useFloat32) > 0 && value < 4294967296 && value >= -2147483648) {
            target[position2++] = 202;
            targetView.setFloat32(position2, value);
            let xShifted;
            if (useFloat32 < 4 || // this checks for rounding of numbers that were encoded in 32-bit float to nearest significant decimal digit that could be preserved
            (xShifted = value * mult10[(target[position2] & 127) << 1 | target[position2 + 1] >> 7]) >> 0 === xShifted) {
              position2 += 4;
              return;
            } else
              position2--;
          }
          target[position2++] = 203;
          targetView.setFloat64(position2, value);
          position2 += 8;
        }
      } else if (type === "object" || type === "function") {
        if (!value)
          target[position2++] = 192;
        else {
          if (referenceMap2) {
            let referee = referenceMap2.get(value);
            if (referee) {
              if (!referee.id) {
                let idsToInsert = referenceMap2.idsToInsert || (referenceMap2.idsToInsert = []);
                referee.id = idsToInsert.push(referee);
              }
              target[position2++] = 214;
              target[position2++] = 112;
              targetView.setUint32(position2, referee.id);
              position2 += 4;
              return;
            } else
              referenceMap2.set(value, { offset: position2 - start });
          }
          let constructor = value.constructor;
          if (constructor === Object) {
            writeObject(value);
          } else if (constructor === Array) {
            packArray(value);
          } else if (constructor === Map) {
            if (this.mapAsEmptyObject) target[position2++] = 128;
            else {
              length = value.size;
              if (length < 16) {
                target[position2++] = 128 | length;
              } else if (length < 65536) {
                target[position2++] = 222;
                target[position2++] = length >> 8;
                target[position2++] = length & 255;
              } else {
                target[position2++] = 223;
                targetView.setUint32(position2, length);
                position2 += 4;
              }
              for (let [key, entryValue] of value) {
                pack2(key);
                pack2(entryValue);
              }
            }
          } else {
            for (let i = 0, l = extensions.length; i < l; i++) {
              let extensionClass = extensionClasses[i];
              if (value instanceof extensionClass) {
                let extension = extensions[i];
                if (extension.write) {
                  if (extension.type) {
                    target[position2++] = 212;
                    target[position2++] = extension.type;
                    target[position2++] = 0;
                  }
                  let writeResult = extension.write.call(this, value);
                  if (writeResult === value) {
                    if (Array.isArray(value)) {
                      packArray(value);
                    } else {
                      writeObject(value);
                    }
                  } else {
                    pack2(writeResult);
                  }
                  return;
                }
                let currentTarget = target;
                let currentTargetView = targetView;
                let currentPosition = position2;
                target = null;
                let result;
                try {
                  result = extension.pack.call(this, value, (size) => {
                    target = currentTarget;
                    currentTarget = null;
                    position2 += size;
                    if (position2 > safeEnd)
                      makeRoom(position2);
                    return {
                      target,
                      targetView,
                      position: position2 - size
                    };
                  }, pack2);
                } finally {
                  if (currentTarget) {
                    target = currentTarget;
                    targetView = currentTargetView;
                    position2 = currentPosition;
                    safeEnd = target.length - 10;
                  }
                }
                if (result) {
                  if (result.length + position2 > safeEnd)
                    makeRoom(result.length + position2);
                  position2 = writeExtensionData(result, target, position2, extension.type);
                }
                return;
              }
            }
            if (Array.isArray(value)) {
              packArray(value);
            } else {
              if (value.toJSON) {
                const json = value.toJSON();
                if (json !== value)
                  return pack2(json);
              }
              if (type === "function")
                return pack2(this.writeFunction && this.writeFunction(value));
              writeObject(value);
            }
          }
        }
      } else if (type === "boolean") {
        target[position2++] = value ? 195 : 194;
      } else if (type === "bigint") {
        if (value < 9223372036854776e3 && value >= -9223372036854776e3) {
          target[position2++] = 211;
          targetView.setBigInt64(position2, value);
        } else if (value < 18446744073709552e3 && value > 0) {
          target[position2++] = 207;
          targetView.setBigUint64(position2, value);
        } else {
          if (this.largeBigIntToFloat) {
            target[position2++] = 203;
            targetView.setFloat64(position2, Number(value));
          } else if (this.largeBigIntToString) {
            return pack2(value.toString());
          } else if (this.useBigIntExtension || this.moreTypes) {
            let empty = value < 0 ? BigInt(-1) : BigInt(0);
            let array;
            if (value >> BigInt(65536) === empty) {
              let mask = BigInt(18446744073709552e3) - BigInt(1);
              let chunks = [];
              while (true) {
                chunks.push(value & mask);
                if (value >> BigInt(63) === empty) break;
                value >>= BigInt(64);
              }
              array = new Uint8Array(new BigUint64Array(chunks).buffer);
              array.reverse();
            } else {
              let invert = value < 0;
              let string = (invert ? ~value : value).toString(16);
              if (string.length % 2) {
                string = "0" + string;
              } else if (parseInt(string.charAt(0), 16) >= 8) {
                string = "00" + string;
              }
              if (hasNodeBuffer) {
                array = Buffer.from(string, "hex");
              } else {
                array = new Uint8Array(string.length / 2);
                for (let i = 0; i < array.length; i++) {
                  array[i] = parseInt(string.slice(i * 2, i * 2 + 2), 16);
                }
              }
              if (invert) {
                for (let i = 0; i < array.length; i++) array[i] = ~array[i];
              }
            }
            if (array.length + position2 > safeEnd)
              makeRoom(array.length + position2);
            position2 = writeExtensionData(array, target, position2, 66);
            return;
          } else {
            throw new RangeError(value + " was too large to fit in MessagePack 64-bit integer format, use useBigIntExtension, or set largeBigIntToFloat to convert to float-64, or set largeBigIntToString to convert to string");
          }
        }
        position2 += 8;
      } else if (type === "undefined") {
        if (this.encodeUndefinedAsNil)
          target[position2++] = 192;
        else {
          target[position2++] = 212;
          target[position2++] = 0;
          target[position2++] = 0;
        }
      } else {
        throw new Error("Unknown type: " + type);
      }
    };
    const writePlainObject = this.variableMapSize || this.coercibleKeyAsNumber || this.skipValues ? (object) => {
      let keys;
      if (this.skipValues) {
        keys = [];
        for (let key2 in object) {
          if ((typeof object.hasOwnProperty !== "function" || object.hasOwnProperty(key2)) && !this.skipValues.includes(object[key2]))
            keys.push(key2);
        }
      } else {
        keys = Object.keys(object);
      }
      let length = keys.length;
      if (length < 16) {
        target[position2++] = 128 | length;
      } else if (length < 65536) {
        target[position2++] = 222;
        target[position2++] = length >> 8;
        target[position2++] = length & 255;
      } else {
        target[position2++] = 223;
        targetView.setUint32(position2, length);
        position2 += 4;
      }
      let key;
      if (this.coercibleKeyAsNumber) {
        for (let i = 0; i < length; i++) {
          key = keys[i];
          let num = Number(key);
          pack2(isNaN(num) ? key : num);
          pack2(object[key]);
        }
      } else {
        for (let i = 0; i < length; i++) {
          pack2(key = keys[i]);
          pack2(object[key]);
        }
      }
    } : (object) => {
      target[position2++] = 222;
      let objectOffset = position2 - start;
      position2 += 2;
      let size = 0;
      for (let key in object) {
        if (typeof object.hasOwnProperty !== "function" || object.hasOwnProperty(key)) {
          pack2(key);
          pack2(object[key]);
          size++;
        }
      }
      if (size > 65535) {
        throw new Error('Object is too large to serialize with fast 16-bit map size, use the "variableMapSize" option to serialize this object');
      }
      target[objectOffset++ + start] = size >> 8;
      target[objectOffset + start] = size & 255;
    };
    const writeRecord = this.useRecords === false ? writePlainObject : options.progressiveRecords && !useTwoByteRecords ? (
      // this is about 2% faster for highly stable structures, since it only requires one for-in loop (but much more expensive when new structure needs to be written)
      (object) => {
        let nextTransition, transition = structures.transitions || (structures.transitions = /* @__PURE__ */ Object.create(null));
        let objectOffset = position2++ - start;
        let wroteKeys;
        for (let key in object) {
          if (typeof object.hasOwnProperty !== "function" || object.hasOwnProperty(key)) {
            nextTransition = transition[key];
            if (nextTransition)
              transition = nextTransition;
            else {
              let keys = Object.keys(object);
              let lastTransition = transition;
              transition = structures.transitions;
              let newTransitions = 0;
              for (let i = 0, l = keys.length; i < l; i++) {
                let key2 = keys[i];
                nextTransition = transition[key2];
                if (!nextTransition) {
                  nextTransition = transition[key2] = /* @__PURE__ */ Object.create(null);
                  newTransitions++;
                }
                transition = nextTransition;
              }
              if (objectOffset + start + 1 == position2) {
                position2--;
                newRecord(transition, keys, newTransitions);
              } else
                insertNewRecord(transition, keys, objectOffset, newTransitions);
              wroteKeys = true;
              transition = lastTransition[key];
            }
            pack2(object[key]);
          }
        }
        if (!wroteKeys) {
          let recordId = transition[RECORD_SYMBOL];
          if (recordId)
            target[objectOffset + start] = recordId;
          else
            insertNewRecord(transition, Object.keys(object), objectOffset, 0);
        }
      }
    ) : (object) => {
      let nextTransition, transition = structures.transitions || (structures.transitions = /* @__PURE__ */ Object.create(null));
      let newTransitions = 0;
      for (let key in object) if (typeof object.hasOwnProperty !== "function" || object.hasOwnProperty(key)) {
        nextTransition = transition[key];
        if (!nextTransition) {
          nextTransition = transition[key] = /* @__PURE__ */ Object.create(null);
          newTransitions++;
        }
        transition = nextTransition;
      }
      let recordId = transition[RECORD_SYMBOL];
      if (recordId) {
        if (recordId >= 96 && useTwoByteRecords) {
          target[position2++] = ((recordId -= 96) & 31) + 96;
          target[position2++] = recordId >> 5;
        } else
          target[position2++] = recordId;
      } else {
        newRecord(transition, transition.__keys__ || Object.keys(object), newTransitions);
      }
      for (let key in object)
        if (typeof object.hasOwnProperty !== "function" || object.hasOwnProperty(key)) {
          pack2(object[key]);
        }
    };
    const checkUseRecords = typeof this.useRecords == "function" && this.useRecords;
    const writeObject = checkUseRecords ? (object) => {
      checkUseRecords(object) ? writeRecord(object) : writePlainObject(object);
    } : writeRecord;
    const makeRoom = (end) => {
      let newSize;
      if (end > 16777216) {
        if (end - start > MAX_BUFFER_SIZE)
          throw new Error("Packed buffer would be larger than maximum buffer size");
        newSize = Math.min(
          MAX_BUFFER_SIZE,
          Math.round(Math.max((end - start) * (end > 67108864 ? 1.25 : 2), 4194304) / 4096) * 4096
        );
      } else
        newSize = (Math.max(end - start << 2, target.length - 1) >> 12) + 1 << 12;
      let newBuffer = new ByteArrayAllocate(newSize);
      targetView = newBuffer.dataView || (newBuffer.dataView = new DataView(newBuffer.buffer, 0, newSize));
      end = Math.min(end, target.length);
      if (target.copy)
        target.copy(newBuffer, 0, start, end);
      else
        newBuffer.set(target.slice(start, end));
      position2 -= start;
      start = 0;
      safeEnd = newBuffer.length - 10;
      return target = newBuffer;
    };
    const newRecord = (transition, keys, newTransitions) => {
      let recordId = structures.nextId;
      if (!recordId)
        recordId = 64;
      if (recordId < sharedLimitId && this.shouldShareStructure && !this.shouldShareStructure(keys)) {
        recordId = structures.nextOwnId;
        if (!(recordId < maxStructureId))
          recordId = sharedLimitId;
        structures.nextOwnId = recordId + 1;
      } else {
        if (recordId >= maxStructureId)
          recordId = sharedLimitId;
        structures.nextId = recordId + 1;
      }
      let highByte = keys.highByte = recordId >= 96 && useTwoByteRecords ? recordId - 96 >> 5 : -1;
      transition[RECORD_SYMBOL] = recordId;
      transition.__keys__ = keys;
      structures[recordId - 64] = keys;
      if (recordId < sharedLimitId) {
        keys.isShared = true;
        structures.sharedLength = recordId - 63;
        hasSharedUpdate = true;
        if (highByte >= 0) {
          target[position2++] = (recordId & 31) + 96;
          target[position2++] = highByte;
        } else {
          target[position2++] = recordId;
        }
      } else {
        if (highByte >= 0) {
          target[position2++] = 213;
          target[position2++] = 114;
          target[position2++] = (recordId & 31) + 96;
          target[position2++] = highByte;
        } else {
          target[position2++] = 212;
          target[position2++] = 114;
          target[position2++] = recordId;
        }
        if (newTransitions)
          transitionsCount += serializationsSinceTransitionRebuild * newTransitions;
        if (recordIdsToRemove.length >= maxOwnStructures)
          recordIdsToRemove.shift()[RECORD_SYMBOL] = 0;
        recordIdsToRemove.push(transition);
        pack2(keys);
      }
    };
    const insertNewRecord = (transition, keys, insertionOffset, newTransitions) => {
      let mainTarget = target;
      let mainPosition = position2;
      let mainSafeEnd = safeEnd;
      let mainStart = start;
      target = keysTarget;
      position2 = 0;
      start = 0;
      if (!target)
        keysTarget = target = new ByteArrayAllocate(8192);
      safeEnd = target.length - 10;
      newRecord(transition, keys, newTransitions);
      keysTarget = target;
      let keysPosition = position2;
      target = mainTarget;
      position2 = mainPosition;
      safeEnd = mainSafeEnd;
      start = mainStart;
      if (keysPosition > 1) {
        let newEnd = position2 + keysPosition - 1;
        if (newEnd > safeEnd)
          makeRoom(newEnd);
        let insertionPosition = insertionOffset + start;
        target.copyWithin(insertionPosition + keysPosition, insertionPosition + 1, position2);
        target.set(keysTarget.slice(0, keysPosition), insertionPosition);
        position2 = newEnd;
      } else {
        target[insertionOffset + start] = keysTarget[0];
      }
    };
    const writeStruct2 = (object) => {
      let newPosition = writeStructSlots(object, target, start, position2, structures, makeRoom, (value, newPosition2, notifySharedUpdate) => {
        if (notifySharedUpdate)
          return hasSharedUpdate = true;
        position2 = newPosition2;
        let startTarget = target;
        pack2(value);
        resetStructures();
        if (startTarget !== target) {
          return { position: position2, targetView, target };
        }
        return position2;
      }, this);
      if (newPosition === 0)
        return writeObject(object);
      position2 = newPosition;
    };
  }
  useBuffer(buffer) {
    target = buffer;
    target.dataView || (target.dataView = new DataView(target.buffer, target.byteOffset, target.byteLength));
    targetView = target.dataView;
    position2 = 0;
  }
  set position(value) {
    position2 = value;
  }
  get position() {
    return position2;
  }
  clearSharedData() {
    if (this.structures)
      this.structures = [];
    if (this.typedStructs)
      this.typedStructs = [];
  }
};
extensionClasses = [Date, Set, Error, RegExp, ArrayBuffer, Object.getPrototypeOf(Uint8Array.prototype).constructor, DataView, C1Type];
extensions = [{
  pack(date, allocateForWrite, pack2) {
    let seconds = date.getTime() / 1e3;
    if ((this.useTimestamp32 || date.getMilliseconds() === 0) && seconds >= 0 && seconds < 4294967296) {
      let { target: target2, targetView: targetView2, position: position3 } = allocateForWrite(6);
      target2[position3++] = 214;
      target2[position3++] = 255;
      targetView2.setUint32(position3, seconds);
    } else if (seconds > 0 && seconds < 4294967296) {
      let { target: target2, targetView: targetView2, position: position3 } = allocateForWrite(10);
      target2[position3++] = 215;
      target2[position3++] = 255;
      targetView2.setUint32(position3, date.getMilliseconds() * 4e6 + (seconds / 1e3 / 4294967296 >> 0));
      targetView2.setUint32(position3 + 4, seconds);
    } else if (isNaN(seconds)) {
      if (this.onInvalidDate) {
        allocateForWrite(0);
        return pack2(this.onInvalidDate());
      }
      let { target: target2, targetView: targetView2, position: position3 } = allocateForWrite(3);
      target2[position3++] = 212;
      target2[position3++] = 255;
      target2[position3++] = 255;
    } else {
      let { target: target2, targetView: targetView2, position: position3 } = allocateForWrite(15);
      target2[position3++] = 199;
      target2[position3++] = 12;
      target2[position3++] = 255;
      targetView2.setUint32(position3, date.getMilliseconds() * 1e6);
      targetView2.setBigInt64(position3 + 4, BigInt(Math.floor(seconds)));
    }
  }
}, {
  pack(set, allocateForWrite, pack2) {
    if (this.setAsEmptyObject) {
      allocateForWrite(0);
      return pack2({});
    }
    let array = Array.from(set);
    let { target: target2, position: position3 } = allocateForWrite(this.moreTypes ? 3 : 0);
    if (this.moreTypes) {
      target2[position3++] = 212;
      target2[position3++] = 115;
      target2[position3++] = 0;
    }
    pack2(array);
  }
}, {
  pack(error, allocateForWrite, pack2) {
    let { target: target2, position: position3 } = allocateForWrite(this.moreTypes ? 3 : 0);
    if (this.moreTypes) {
      target2[position3++] = 212;
      target2[position3++] = 101;
      target2[position3++] = 0;
    }
    pack2([error.name, error.message, error.cause]);
  }
}, {
  pack(regex, allocateForWrite, pack2) {
    let { target: target2, position: position3 } = allocateForWrite(this.moreTypes ? 3 : 0);
    if (this.moreTypes) {
      target2[position3++] = 212;
      target2[position3++] = 120;
      target2[position3++] = 0;
    }
    pack2([regex.source, regex.flags]);
  }
}, {
  pack(arrayBuffer, allocateForWrite) {
    if (this.moreTypes)
      writeExtBuffer(arrayBuffer, 16, allocateForWrite);
    else
      writeBuffer(hasNodeBuffer ? Buffer.from(arrayBuffer) : new Uint8Array(arrayBuffer), allocateForWrite);
  }
}, {
  pack(typedArray, allocateForWrite) {
    let constructor = typedArray.constructor;
    if (constructor !== ByteArray && this.moreTypes)
      writeExtBuffer(typedArray, typedArrays.indexOf(constructor.name), allocateForWrite);
    else
      writeBuffer(typedArray, allocateForWrite);
  }
}, {
  pack(arrayBuffer, allocateForWrite) {
    if (this.moreTypes)
      writeExtBuffer(arrayBuffer, 17, allocateForWrite);
    else
      writeBuffer(hasNodeBuffer ? Buffer.from(arrayBuffer) : new Uint8Array(arrayBuffer), allocateForWrite);
  }
}, {
  pack(c1, allocateForWrite) {
    let { target: target2, position: position3 } = allocateForWrite(1);
    target2[position3] = 193;
  }
}];
function writeExtBuffer(typedArray, type, allocateForWrite, encode2) {
  let length = typedArray.byteLength;
  if (length + 1 < 256) {
    var { target: target2, position: position3 } = allocateForWrite(4 + length);
    target2[position3++] = 199;
    target2[position3++] = length + 1;
  } else if (length + 1 < 65536) {
    var { target: target2, position: position3 } = allocateForWrite(5 + length);
    target2[position3++] = 200;
    target2[position3++] = length + 1 >> 8;
    target2[position3++] = length + 1 & 255;
  } else {
    var { target: target2, position: position3, targetView: targetView2 } = allocateForWrite(7 + length);
    target2[position3++] = 201;
    targetView2.setUint32(position3, length + 1);
    position3 += 4;
  }
  target2[position3++] = 116;
  target2[position3++] = type;
  if (!typedArray.buffer) typedArray = new Uint8Array(typedArray);
  target2.set(new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength), position3);
}
function writeBuffer(buffer, allocateForWrite) {
  let length = buffer.byteLength;
  var target2, position3;
  if (length < 256) {
    var { target: target2, position: position3 } = allocateForWrite(length + 2);
    target2[position3++] = 196;
    target2[position3++] = length;
  } else if (length < 65536) {
    var { target: target2, position: position3 } = allocateForWrite(length + 3);
    target2[position3++] = 197;
    target2[position3++] = length >> 8;
    target2[position3++] = length & 255;
  } else {
    var { target: target2, position: position3, targetView: targetView2 } = allocateForWrite(length + 5);
    target2[position3++] = 198;
    targetView2.setUint32(position3, length);
    position3 += 4;
  }
  target2.set(buffer, position3);
}
function writeExtensionData(result, target2, position3, type) {
  let length = result.length;
  switch (length) {
    case 1:
      target2[position3++] = 212;
      break;
    case 2:
      target2[position3++] = 213;
      break;
    case 4:
      target2[position3++] = 214;
      break;
    case 8:
      target2[position3++] = 215;
      break;
    case 16:
      target2[position3++] = 216;
      break;
    default:
      if (length < 256) {
        target2[position3++] = 199;
        target2[position3++] = length;
      } else if (length < 65536) {
        target2[position3++] = 200;
        target2[position3++] = length >> 8;
        target2[position3++] = length & 255;
      } else {
        target2[position3++] = 201;
        target2[position3++] = length >> 24;
        target2[position3++] = length >> 16 & 255;
        target2[position3++] = length >> 8 & 255;
        target2[position3++] = length & 255;
      }
  }
  target2[position3++] = type;
  target2.set(result, position3);
  position3 += length;
  return position3;
}
function insertIds(serialized, idsToInsert) {
  let nextId;
  let distanceToMove = idsToInsert.length * 6;
  let lastEnd = serialized.length - distanceToMove;
  while (nextId = idsToInsert.pop()) {
    let offset = nextId.offset;
    let id = nextId.id;
    serialized.copyWithin(offset + distanceToMove, offset, lastEnd);
    distanceToMove -= 6;
    let position3 = offset + distanceToMove;
    serialized[position3++] = 214;
    serialized[position3++] = 105;
    serialized[position3++] = id >> 24;
    serialized[position3++] = id >> 16 & 255;
    serialized[position3++] = id >> 8 & 255;
    serialized[position3++] = id & 255;
    lastEnd = offset;
  }
  return serialized;
}
function writeBundles(start, pack2, incrementPosition) {
  if (bundledStrings2.length > 0) {
    targetView.setUint32(bundledStrings2.position + start, position2 + incrementPosition - bundledStrings2.position - start);
    bundledStrings2.stringsPosition = position2 - start;
    let writeStrings = bundledStrings2;
    bundledStrings2 = null;
    pack2(writeStrings[0]);
    pack2(writeStrings[1]);
  }
}
function prepareStructures(structures, packr2) {
  structures.isCompatible = (existingStructures) => {
    let compatible = !existingStructures || (packr2.lastNamedStructuresLength || 0) === existingStructures.length;
    if (!compatible)
      packr2._mergeStructures(existingStructures);
    return compatible;
  };
  return structures;
}
function setWriteStructSlots(writeSlots, makeStructures) {
  writeStructSlots = writeSlots;
  prepareStructures = makeStructures;
}
var defaultPackr = new Packr({ useRecords: false });
var pack = defaultPackr.pack;
var encode = defaultPackr.pack;
var { NEVER, ALWAYS, DECIMAL_ROUND, DECIMAL_FIT } = FLOAT32_OPTIONS;
var REUSE_BUFFER_MODE = 512;
var RESET_BUFFER_MODE = 1024;
var RESERVE_START_SPACE = 2048;

// ../../../.local/share/pnpm/store/v10/links/@/msgpackr/1.11.8/fa1e0559f197fee8478659a989f441927184ac384813f709c00ba8e06a1533c9/node_modules/msgpackr/struct.js
var ASCII = 3;
var NUMBER = 0;
var UTF8 = 2;
var OBJECT_DATA = 1;
var DATE = 16;
var TYPE_NAMES = ["num", "object", "string", "ascii"];
TYPE_NAMES[DATE] = "date";
var float32Headers = [false, true, true, false, false, true, true, false];
var evalSupported;
try {
  new Function("");
  evalSupported = true;
} catch (error) {
}
var updatedPosition;
var hasNodeBuffer2 = typeof Buffer !== "undefined";
var textEncoder2;
var currentSource;
try {
  textEncoder2 = new TextEncoder();
} catch (error) {
}
var encodeUtf8 = hasNodeBuffer2 ? function(target2, string, position3) {
  return target2.utf8Write(string, position3, target2.byteLength - position3);
} : textEncoder2 && textEncoder2.encodeInto ? function(target2, string, position3) {
  return textEncoder2.encodeInto(string, target2.subarray(position3)).written;
} : false;
var TYPE = Symbol("type");
var PARENT = Symbol("parent");
setWriteStructSlots(writeStruct, prepareStructures2);
function writeStruct(object, target2, encodingStart, position3, structures, makeRoom, pack2, packr2) {
  let typedStructs = packr2.typedStructs || (packr2.typedStructs = []);
  let targetView2 = target2.dataView;
  let refsStartPosition = (typedStructs.lastStringStart || 100) + position3;
  let safeEnd2 = target2.length - 10;
  let start = position3;
  if (position3 > safeEnd2) {
    target2 = makeRoom(position3);
    targetView2 = target2.dataView;
    position3 -= encodingStart;
    start -= encodingStart;
    refsStartPosition -= encodingStart;
    encodingStart = 0;
    safeEnd2 = target2.length - 10;
  }
  let refOffset, refPosition = refsStartPosition;
  let transition = typedStructs.transitions || (typedStructs.transitions = /* @__PURE__ */ Object.create(null));
  let nextId = typedStructs.nextId || typedStructs.length;
  let headerSize = nextId < 15 ? 1 : nextId < 240 ? 2 : nextId < 61440 ? 3 : nextId < 15728640 ? 4 : 0;
  if (headerSize === 0)
    return 0;
  position3 += headerSize;
  let queuedReferences = [];
  let usedAscii0;
  let keyIndex = 0;
  for (let key in object) {
    let value = object[key];
    let nextTransition = transition[key];
    if (!nextTransition) {
      transition[key] = nextTransition = {
        key,
        parent: transition,
        enumerationOffset: 0,
        ascii0: null,
        ascii8: null,
        num8: null,
        string16: null,
        object16: null,
        num32: null,
        float64: null,
        date64: null
      };
    }
    if (position3 > safeEnd2) {
      target2 = makeRoom(position3);
      targetView2 = target2.dataView;
      position3 -= encodingStart;
      start -= encodingStart;
      refsStartPosition -= encodingStart;
      refPosition -= encodingStart;
      encodingStart = 0;
      safeEnd2 = target2.length - 10;
    }
    switch (typeof value) {
      case "number":
        let number = value;
        if (nextId < 200 || !nextTransition.num64) {
          if (number >> 0 === number && number < 536870912 && number > -520093696) {
            if (number < 246 && number >= 0 && (nextTransition.num8 && !(nextId > 200 && nextTransition.num32) || number < 32 && !nextTransition.num32)) {
              transition = nextTransition.num8 || createTypeTransition(nextTransition, NUMBER, 1);
              target2[position3++] = number;
            } else {
              transition = nextTransition.num32 || createTypeTransition(nextTransition, NUMBER, 4);
              targetView2.setUint32(position3, number, true);
              position3 += 4;
            }
            break;
          } else if (number < 4294967296 && number >= -2147483648) {
            targetView2.setFloat32(position3, number, true);
            if (float32Headers[target2[position3 + 3] >>> 5]) {
              let xShifted;
              if ((xShifted = number * mult10[(target2[position3 + 3] & 127) << 1 | target2[position3 + 2] >> 7]) >> 0 === xShifted) {
                transition = nextTransition.num32 || createTypeTransition(nextTransition, NUMBER, 4);
                position3 += 4;
                break;
              }
            }
          }
        }
        transition = nextTransition.num64 || createTypeTransition(nextTransition, NUMBER, 8);
        targetView2.setFloat64(position3, number, true);
        position3 += 8;
        break;
      case "string":
        let strLength = value.length;
        refOffset = refPosition - refsStartPosition;
        if ((strLength << 2) + refPosition > safeEnd2) {
          target2 = makeRoom((strLength << 2) + refPosition);
          targetView2 = target2.dataView;
          position3 -= encodingStart;
          start -= encodingStart;
          refsStartPosition -= encodingStart;
          refPosition -= encodingStart;
          encodingStart = 0;
          safeEnd2 = target2.length - 10;
        }
        if (strLength > 65280 + refOffset >> 2) {
          queuedReferences.push(key, value, position3 - start);
          break;
        }
        let isNotAscii;
        let strStart = refPosition;
        if (strLength < 64) {
          let i, c1, c2;
          for (i = 0; i < strLength; i++) {
            c1 = value.charCodeAt(i);
            if (c1 < 128) {
              target2[refPosition++] = c1;
            } else if (c1 < 2048) {
              isNotAscii = true;
              target2[refPosition++] = c1 >> 6 | 192;
              target2[refPosition++] = c1 & 63 | 128;
            } else if ((c1 & 64512) === 55296 && ((c2 = value.charCodeAt(i + 1)) & 64512) === 56320) {
              isNotAscii = true;
              c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
              i++;
              target2[refPosition++] = c1 >> 18 | 240;
              target2[refPosition++] = c1 >> 12 & 63 | 128;
              target2[refPosition++] = c1 >> 6 & 63 | 128;
              target2[refPosition++] = c1 & 63 | 128;
            } else {
              isNotAscii = true;
              target2[refPosition++] = c1 >> 12 | 224;
              target2[refPosition++] = c1 >> 6 & 63 | 128;
              target2[refPosition++] = c1 & 63 | 128;
            }
          }
        } else {
          refPosition += encodeUtf8(target2, value, refPosition);
          isNotAscii = refPosition - strStart > strLength;
        }
        if (refOffset < 160 || refOffset < 246 && (nextTransition.ascii8 || nextTransition.string8)) {
          if (isNotAscii) {
            if (!(transition = nextTransition.string8)) {
              if (typedStructs.length > 10 && (transition = nextTransition.ascii8)) {
                transition.__type = UTF8;
                nextTransition.ascii8 = null;
                nextTransition.string8 = transition;
                pack2(null, 0, true);
              } else {
                transition = createTypeTransition(nextTransition, UTF8, 1);
              }
            }
          } else if (refOffset === 0 && !usedAscii0) {
            usedAscii0 = true;
            transition = nextTransition.ascii0 || createTypeTransition(nextTransition, ASCII, 0);
            break;
          } else if (!(transition = nextTransition.ascii8) && !(typedStructs.length > 10 && (transition = nextTransition.string8)))
            transition = createTypeTransition(nextTransition, ASCII, 1);
          target2[position3++] = refOffset;
        } else {
          transition = nextTransition.string16 || createTypeTransition(nextTransition, UTF8, 2);
          targetView2.setUint16(position3, refOffset, true);
          position3 += 2;
        }
        break;
      case "object":
        if (value) {
          if (value.constructor === Date) {
            transition = nextTransition.date64 || createTypeTransition(nextTransition, DATE, 8);
            targetView2.setFloat64(position3, value.getTime(), true);
            position3 += 8;
          } else {
            queuedReferences.push(key, value, keyIndex);
          }
          break;
        } else {
          nextTransition = anyType(nextTransition, position3, targetView2, -10);
          if (nextTransition) {
            transition = nextTransition;
            position3 = updatedPosition;
          } else queuedReferences.push(key, value, keyIndex);
        }
        break;
      case "boolean":
        transition = nextTransition.num8 || nextTransition.ascii8 || createTypeTransition(nextTransition, NUMBER, 1);
        target2[position3++] = value ? 249 : 248;
        break;
      case "undefined":
        nextTransition = anyType(nextTransition, position3, targetView2, -9);
        if (nextTransition) {
          transition = nextTransition;
          position3 = updatedPosition;
        } else queuedReferences.push(key, value, keyIndex);
        break;
      default:
        queuedReferences.push(key, value, keyIndex);
    }
    keyIndex++;
  }
  for (let i = 0, l = queuedReferences.length; i < l; ) {
    let key = queuedReferences[i++];
    let value = queuedReferences[i++];
    let propertyIndex = queuedReferences[i++];
    let nextTransition = transition[key];
    if (!nextTransition) {
      transition[key] = nextTransition = {
        key,
        parent: transition,
        enumerationOffset: propertyIndex - keyIndex,
        ascii0: null,
        ascii8: null,
        num8: null,
        string16: null,
        object16: null,
        num32: null,
        float64: null
      };
    }
    let newPosition;
    if (value) {
      let size;
      refOffset = refPosition - refsStartPosition;
      if (refOffset < 65280) {
        transition = nextTransition.object16;
        if (transition)
          size = 2;
        else if (transition = nextTransition.object32)
          size = 4;
        else {
          transition = createTypeTransition(nextTransition, OBJECT_DATA, 2);
          size = 2;
        }
      } else {
        transition = nextTransition.object32 || createTypeTransition(nextTransition, OBJECT_DATA, 4);
        size = 4;
      }
      newPosition = pack2(value, refPosition);
      if (typeof newPosition === "object") {
        refPosition = newPosition.position;
        targetView2 = newPosition.targetView;
        target2 = newPosition.target;
        refsStartPosition -= encodingStart;
        position3 -= encodingStart;
        start -= encodingStart;
        encodingStart = 0;
      } else
        refPosition = newPosition;
      if (size === 2) {
        targetView2.setUint16(position3, refOffset, true);
        position3 += 2;
      } else {
        targetView2.setUint32(position3, refOffset, true);
        position3 += 4;
      }
    } else {
      transition = nextTransition.object16 || createTypeTransition(nextTransition, OBJECT_DATA, 2);
      targetView2.setInt16(position3, value === null ? -10 : -9, true);
      position3 += 2;
    }
    keyIndex++;
  }
  let recordId = transition[RECORD_SYMBOL];
  if (recordId == null) {
    recordId = packr2.typedStructs.length;
    let structure = [];
    let nextTransition = transition;
    let key, type;
    while ((type = nextTransition.__type) !== void 0) {
      let size = nextTransition.__size;
      nextTransition = nextTransition.__parent;
      key = nextTransition.key;
      let property = [type, size, key];
      if (nextTransition.enumerationOffset)
        property.push(nextTransition.enumerationOffset);
      structure.push(property);
      nextTransition = nextTransition.parent;
    }
    structure.reverse();
    transition[RECORD_SYMBOL] = recordId;
    packr2.typedStructs[recordId] = structure;
    pack2(null, 0, true);
  }
  switch (headerSize) {
    case 1:
      if (recordId >= 16) return 0;
      target2[start] = recordId + 32;
      break;
    case 2:
      if (recordId >= 256) return 0;
      target2[start] = 56;
      target2[start + 1] = recordId;
      break;
    case 3:
      if (recordId >= 65536) return 0;
      target2[start] = 57;
      targetView2.setUint16(start + 1, recordId, true);
      break;
    case 4:
      if (recordId >= 16777216) return 0;
      targetView2.setUint32(start, (recordId << 8) + 58, true);
      break;
  }
  if (position3 < refsStartPosition) {
    if (refsStartPosition === refPosition)
      return position3;
    target2.copyWithin(position3, refsStartPosition, refPosition);
    refPosition += position3 - refsStartPosition;
    typedStructs.lastStringStart = position3 - start;
  } else if (position3 > refsStartPosition) {
    if (refsStartPosition === refPosition)
      return position3;
    typedStructs.lastStringStart = position3 - start;
    return writeStruct(object, target2, encodingStart, start, structures, makeRoom, pack2, packr2);
  }
  return refPosition;
}
function anyType(transition, position3, targetView2, value) {
  let nextTransition;
  if (nextTransition = transition.ascii8 || transition.num8) {
    targetView2.setInt8(position3, value, true);
    updatedPosition = position3 + 1;
    return nextTransition;
  }
  if (nextTransition = transition.string16 || transition.object16) {
    targetView2.setInt16(position3, value, true);
    updatedPosition = position3 + 2;
    return nextTransition;
  }
  if (nextTransition = transition.num32) {
    targetView2.setUint32(position3, 3758096640 + value, true);
    updatedPosition = position3 + 4;
    return nextTransition;
  }
  if (nextTransition = transition.num64) {
    targetView2.setFloat64(position3, NaN, true);
    targetView2.setInt8(position3, value);
    updatedPosition = position3 + 8;
    return nextTransition;
  }
  updatedPosition = position3;
  return;
}
function createTypeTransition(transition, type, size) {
  let typeName = TYPE_NAMES[type] + (size << 3);
  let newTransition = transition[typeName] || (transition[typeName] = /* @__PURE__ */ Object.create(null));
  newTransition.__type = type;
  newTransition.__size = size;
  newTransition.__parent = transition;
  return newTransition;
}
function onLoadedStructures2(sharedData) {
  if (!(sharedData instanceof Map))
    return sharedData;
  let typed = sharedData.get("typed") || [];
  if (Object.isFrozen(typed))
    typed = typed.map((structure) => structure.slice(0));
  let named = sharedData.get("named");
  let transitions = /* @__PURE__ */ Object.create(null);
  for (let i = 0, l = typed.length; i < l; i++) {
    let structure = typed[i];
    let transition = transitions;
    for (let [type, size, key] of structure) {
      let nextTransition = transition[key];
      if (!nextTransition) {
        transition[key] = nextTransition = {
          key,
          parent: transition,
          enumerationOffset: 0,
          ascii0: null,
          ascii8: null,
          num8: null,
          string16: null,
          object16: null,
          num32: null,
          float64: null,
          date64: null
        };
      }
      transition = createTypeTransition(nextTransition, type, size);
    }
    transition[RECORD_SYMBOL] = i;
  }
  typed.transitions = transitions;
  this.typedStructs = typed;
  this.lastTypedStructuresLength = typed.length;
  return named;
}
var sourceSymbol = Symbol.for("source");
function readStruct2(src2, position3, srcEnd2, unpackr) {
  let recordId = src2[position3++] - 32;
  if (recordId >= 24) {
    switch (recordId) {
      case 24:
        recordId = src2[position3++];
        break;
      // little endian:
      case 25:
        recordId = src2[position3++] + (src2[position3++] << 8);
        break;
      case 26:
        recordId = src2[position3++] + (src2[position3++] << 8) + (src2[position3++] << 16);
        break;
      case 27:
        recordId = src2[position3++] + (src2[position3++] << 8) + (src2[position3++] << 16) + (src2[position3++] << 24);
        break;
    }
  }
  let structure = unpackr.typedStructs && unpackr.typedStructs[recordId];
  if (!structure) {
    src2 = Uint8Array.prototype.slice.call(src2, position3, srcEnd2);
    srcEnd2 -= position3;
    position3 = 0;
    if (!unpackr.getStructures)
      throw new Error(`Reference to shared structure ${recordId} without getStructures method`);
    unpackr._mergeStructures(unpackr.getStructures());
    if (!unpackr.typedStructs)
      throw new Error("Could not find any shared typed structures");
    unpackr.lastTypedStructuresLength = unpackr.typedStructs.length;
    structure = unpackr.typedStructs[recordId];
    if (!structure)
      throw new Error("Could not find typed structure " + recordId);
  }
  var construct = structure.construct;
  var fullConstruct = structure.fullConstruct;
  if (!construct) {
    construct = structure.construct = function LazyObject() {
    };
    fullConstruct = structure.fullConstruct = function LoadedObject() {
    };
    fullConstruct.prototype = unpackr.structPrototype || {};
    var prototype = construct.prototype = unpackr.structPrototype ? Object.create(unpackr.structPrototype) : {};
    let properties = [];
    let currentOffset = 0;
    let lastRefProperty;
    for (let i = 0, l = structure.length; i < l; i++) {
      let definition = structure[i];
      let [type, size, key, enumerationOffset] = definition;
      if (key === "__proto__")
        key = "__proto_";
      let property = {
        key,
        offset: currentOffset
      };
      if (enumerationOffset)
        properties.splice(i + enumerationOffset, 0, property);
      else
        properties.push(property);
      let getRef;
      switch (size) {
        // TODO: Move into a separate function
        case 0:
          getRef = () => 0;
          break;
        case 1:
          getRef = (source, position4) => {
            let ref = source.bytes[position4 + property.offset];
            return ref >= 246 ? toConstant(ref) : ref;
          };
          break;
        case 2:
          getRef = (source, position4) => {
            let src3 = source.bytes;
            let dataView2 = src3.dataView || (src3.dataView = new DataView(src3.buffer, src3.byteOffset, src3.byteLength));
            let ref = dataView2.getUint16(position4 + property.offset, true);
            return ref >= 65280 ? toConstant(ref & 255) : ref;
          };
          break;
        case 4:
          getRef = (source, position4) => {
            let src3 = source.bytes;
            let dataView2 = src3.dataView || (src3.dataView = new DataView(src3.buffer, src3.byteOffset, src3.byteLength));
            let ref = dataView2.getUint32(position4 + property.offset, true);
            return ref >= 4294967040 ? toConstant(ref & 255) : ref;
          };
          break;
      }
      property.getRef = getRef;
      currentOffset += size;
      let get;
      switch (type) {
        case ASCII:
          if (lastRefProperty && !lastRefProperty.next)
            lastRefProperty.next = property;
          lastRefProperty = property;
          property.multiGetCount = 0;
          get = function(source) {
            let src3 = source.bytes;
            let position4 = source.position;
            let refStart = currentOffset + position4;
            let ref = getRef(source, position4);
            if (typeof ref !== "number") return ref;
            let end, next = property.next;
            while (next) {
              end = next.getRef(source, position4);
              if (typeof end === "number")
                break;
              else
                end = null;
              next = next.next;
            }
            if (end == null)
              end = source.bytesEnd - refStart;
            if (source.srcString) {
              return source.srcString.slice(ref, end);
            }
            return readString(src3, ref + refStart, end - ref);
          };
          break;
        case UTF8:
        case OBJECT_DATA:
          if (lastRefProperty && !lastRefProperty.next)
            lastRefProperty.next = property;
          lastRefProperty = property;
          get = function(source) {
            let position4 = source.position;
            let refStart = currentOffset + position4;
            let ref = getRef(source, position4);
            if (typeof ref !== "number") return ref;
            let src3 = source.bytes;
            let end, next = property.next;
            while (next) {
              end = next.getRef(source, position4);
              if (typeof end === "number")
                break;
              else
                end = null;
              next = next.next;
            }
            if (end == null)
              end = source.bytesEnd - refStart;
            if (type === UTF8) {
              return src3.toString("utf8", ref + refStart, end + refStart);
            } else {
              currentSource = source;
              try {
                return unpackr.unpack(src3, { start: ref + refStart, end: end + refStart });
              } finally {
                currentSource = null;
              }
            }
          };
          break;
        case NUMBER:
          switch (size) {
            case 4:
              get = function(source) {
                let src3 = source.bytes;
                let dataView2 = src3.dataView || (src3.dataView = new DataView(src3.buffer, src3.byteOffset, src3.byteLength));
                let position4 = source.position + property.offset;
                let value = dataView2.getInt32(position4, true);
                if (value < 536870912) {
                  if (value > -520093696)
                    return value;
                  if (value > -536870912)
                    return toConstant(value & 255);
                }
                let fValue = dataView2.getFloat32(position4, true);
                let multiplier = mult10[(src3[position4 + 3] & 127) << 1 | src3[position4 + 2] >> 7];
                return (multiplier * fValue + (fValue > 0 ? 0.5 : -0.5) >> 0) / multiplier;
              };
              break;
            case 8:
              get = function(source) {
                let src3 = source.bytes;
                let dataView2 = src3.dataView || (src3.dataView = new DataView(src3.buffer, src3.byteOffset, src3.byteLength));
                let value = dataView2.getFloat64(source.position + property.offset, true);
                if (isNaN(value)) {
                  let byte = src3[source.position + property.offset];
                  if (byte >= 246)
                    return toConstant(byte);
                }
                return value;
              };
              break;
            case 1:
              get = function(source) {
                let src3 = source.bytes;
                let value = src3[source.position + property.offset];
                return value < 246 ? value : toConstant(value);
              };
              break;
          }
          break;
        case DATE:
          get = function(source) {
            let src3 = source.bytes;
            let dataView2 = src3.dataView || (src3.dataView = new DataView(src3.buffer, src3.byteOffset, src3.byteLength));
            return new Date(dataView2.getFloat64(source.position + property.offset, true));
          };
          break;
      }
      property.get = get;
    }
    if (evalSupported) {
      let objectLiteralProperties = [];
      let args = [];
      let i = 0;
      let hasInheritedProperties;
      for (let property of properties) {
        if (unpackr.alwaysLazyProperty && unpackr.alwaysLazyProperty(property.key)) {
          hasInheritedProperties = true;
          continue;
        }
        Object.defineProperty(prototype, property.key, { get: withSource(property.get), enumerable: true });
        let valueFunction = "v" + i++;
        args.push(valueFunction);
        objectLiteralProperties.push("o[" + JSON.stringify(property.key) + "]=" + valueFunction + "(s)");
      }
      if (hasInheritedProperties) {
        objectLiteralProperties.push("__proto__:this");
      }
      let toObject = new Function(...args, "var c=this;return function(s){var o=new c();" + objectLiteralProperties.join(";") + ";return o;}").apply(fullConstruct, properties.map((prop) => prop.get));
      Object.defineProperty(prototype, "toJSON", {
        value(omitUnderscoredProperties) {
          return toObject.call(this, this[sourceSymbol]);
        }
      });
    } else {
      Object.defineProperty(prototype, "toJSON", {
        value(omitUnderscoredProperties) {
          let resolved = {};
          for (let i = 0, l = properties.length; i < l; i++) {
            let key = properties[i].key;
            resolved[key] = this[key];
          }
          return resolved;
        }
        // not enumerable or anything
      });
    }
  }
  var instance = new construct();
  instance[sourceSymbol] = {
    bytes: src2,
    position: position3,
    srcString: "",
    bytesEnd: srcEnd2
  };
  return instance;
}
function toConstant(code) {
  switch (code) {
    case 246:
      return null;
    case 247:
      return void 0;
    case 248:
      return false;
    case 249:
      return true;
  }
  throw new Error("Unknown constant");
}
function withSource(get) {
  return function() {
    return get(this[sourceSymbol]);
  };
}
function saveState2() {
  if (currentSource) {
    currentSource.bytes = Uint8Array.prototype.slice.call(currentSource.bytes, currentSource.position, currentSource.bytesEnd);
    currentSource.position = 0;
    currentSource.bytesEnd = currentSource.bytes.length;
  }
}
function prepareStructures2(structures, packr2) {
  if (packr2.typedStructs) {
    let structMap = /* @__PURE__ */ new Map();
    structMap.set("named", structures);
    structMap.set("typed", packr2.typedStructs);
    structures = structMap;
  }
  let lastTypedStructuresLength = packr2.lastTypedStructuresLength || 0;
  structures.isCompatible = (existing) => {
    let compatible = true;
    if (existing instanceof Map) {
      let named = existing.get("named") || [];
      if (named.length !== (packr2.lastNamedStructuresLength || 0))
        compatible = false;
      let typed = existing.get("typed") || [];
      if (typed.length !== lastTypedStructuresLength)
        compatible = false;
    } else if (existing instanceof Array || Array.isArray(existing)) {
      if (existing.length !== (packr2.lastNamedStructuresLength || 0))
        compatible = false;
    }
    if (!compatible)
      packr2._mergeStructures(existing);
    return compatible;
  };
  packr2.lastTypedStructuresLength = packr2.typedStructs && packr2.typedStructs.length;
  return structures;
}
setReadStruct(readStruct2, onLoadedStructures2, saveState2);

// ../../../.local/share/pnpm/store/v10/links/@/msgpackr/1.11.8/fa1e0559f197fee8478659a989f441927184ac384813f709c00ba8e06a1533c9/node_modules/msgpackr/node-index.js
import { createRequire } from "module";
var nativeAccelerationDisabled = process.env.MSGPACKR_NATIVE_ACCELERATION_DISABLED !== void 0 && process.env.MSGPACKR_NATIVE_ACCELERATION_DISABLED.toLowerCase() === "true";
if (!nativeAccelerationDisabled) {
  let extractor;
  try {
    if (typeof __require == "function")
      extractor = require_msgpackr_extract();
    else
      extractor = createRequire(import.meta.url)("msgpackr-extract");
    if (extractor)
      setExtractor(extractor.extractStrings);
  } catch (error) {
  }
}

// ../fs/msgpack-file/lib/index.js
var packr = new Packr({
  useRecords: true,
  // moreTypes: true enables better type preservation for undefined, etc.
  moreTypes: true
});
function writeMsgpackFileSync(filePath, data) {
  const buffer = packr.pack(data);
  lib_default.writeFileSync(filePath, buffer);
}
function readMsgpackFileSync(filePath) {
  const buffer = lib_default.readFileSync(filePath);
  return packr.unpack(buffer);
}

// ../fs/symlink-dependency/lib/index.js
import path10 from "path";
var import_symlink_dir2 = __toESM(require_dist(), 1);

// ../fs/symlink-dependency/lib/symlinkDirectRootDependency.js
var import_symlink_dir = __toESM(require_dist(), 1);

// ../fs/symlink-dependency/lib/index.js
function symlinkDependencySync(dependencyRealLocation, destModulesDir, importAs) {
  const link = path10.join(destModulesDir, importAs);
  linkLogger.debug({ target: dependencyRealLocation, link });
  return import_symlink_dir2.default.sync(dependencyRealLocation, link);
}

// ../worker/lib/start.js
import { parentPort } from "worker_threads";

// ../worker/lib/equalOrSemverEqual.js
var import_semver = __toESM(require_semver2(), 1);
function equalOrSemverEqual(version1, version2) {
  if (version1 === version2)
    return true;
  try {
    return import_semver.default.eq(version1, version2, { loose: true });
  } catch {
    return false;
  }
}

// ../worker/lib/start.js
function startWorker() {
  process.on("uncaughtException", (err) => {
    console.error(err);
  });
  parentPort.on("message", handleMessage);
}
var cafsCache = /* @__PURE__ */ new Map();
var cafsStoreCache = /* @__PURE__ */ new Map();
var cafsLocker = /* @__PURE__ */ new Map();
async function handleMessage(message) {
  if (message === false) {
    parentPort.off("message", handleMessage);
    process.exit(0);
  }
  try {
    switch (message.type) {
      case "extract": {
        parentPort.postMessage(addTarballToStore(message));
        break;
      }
      case "link": {
        parentPort.postMessage(importPackage(message));
        break;
      }
      case "add-dir": {
        parentPort.postMessage(addFilesFromDir2(message));
        break;
      }
      case "init-store": {
        parentPort.postMessage(initStore(message));
        break;
      }
      case "readPkgFromCafs": {
        let { storeDir, filesIndexFile, readManifest, verifyStoreIntegrity, expectedPkg, strictStorePkgContentCheck } = message;
        let pkgFilesIndex;
        try {
          pkgFilesIndex = readMsgpackFileSync(filesIndexFile);
        } catch {
        }
        if (!pkgFilesIndex) {
          parentPort.postMessage({
            status: "success",
            value: {
              verified: false,
              pkgFilesIndex: null
            }
          });
          return;
        }
        const warnings = [];
        if (expectedPkg) {
          if (pkgFilesIndex.name != null && expectedPkg.name != null && pkgFilesIndex.name.toLowerCase() !== expectedPkg.name.toLowerCase() || pkgFilesIndex.version != null && expectedPkg.version != null && !equalOrSemverEqual(pkgFilesIndex.version, expectedPkg.version)) {
            const msg = "Package name or version mismatch found while reading from the store.";
            const hint = `This means that either the lockfile is broken or the package metadata (name and version) inside the package's package.json file doesn't match the metadata in the registry. Expected package: ${expectedPkg.name}@${expectedPkg.version}. Actual package in the store: ${pkgFilesIndex.name}@${pkgFilesIndex.version}.`;
            if (strictStorePkgContentCheck ?? true) {
              throw new PnpmError("UNEXPECTED_PKG_CONTENT_IN_STORE", msg, {
                hint: `${hint}

If you want to ignore this issue, set strictStorePkgContentCheck to false in your configuration`
              });
            } else {
              warnings.push(`${msg} ${hint}`);
            }
          }
        }
        let verifyResult;
        if (pkgFilesIndex.requiresBuild == null) {
          readManifest = true;
        }
        if (verifyStoreIntegrity) {
          verifyResult = checkPkgFilesIntegrity(storeDir, pkgFilesIndex, readManifest);
        } else {
          verifyResult = buildFileMapsFromIndex(storeDir, pkgFilesIndex, readManifest);
        }
        const requiresBuild = pkgFilesIndex.requiresBuild ?? pkgRequiresBuild(verifyResult.manifest, verifyResult.filesMap);
        parentPort.postMessage({
          status: "success",
          warnings,
          value: {
            verified: verifyResult.passed,
            manifest: verifyResult.manifest,
            files: {
              filesMap: verifyResult.filesMap,
              sideEffectsMaps: verifyResult.sideEffectsMaps,
              resolvedFrom: "store",
              requiresBuild
            }
          }
        });
        break;
      }
      case "symlinkAllModules": {
        parentPort.postMessage(symlinkAllModules(message));
        break;
      }
      case "hardLinkDir": {
        hardLinkDir(message.src, message.destDirs);
        parentPort.postMessage({ status: "success" });
        break;
      }
    }
  } catch (e) {
    parentPort.postMessage({
      status: "error",
      error: {
        code: e.code,
        message: e.message ?? e.toString(),
        hint: e.hint
      }
    });
  }
}
function addTarballToStore({ buffer, storeDir, integrity, filesIndexFile, appendManifest }) {
  if (integrity) {
    const { algorithm, hexDigest } = parseIntegrity(integrity);
    const calculatedHash = crypto3.hash(algorithm, buffer, "hex");
    if (calculatedHash !== hexDigest) {
      return {
        status: "error",
        error: {
          type: "integrity_validation_failed",
          algorithm,
          expected: integrity,
          found: formatIntegrity(algorithm, calculatedHash)
        }
      };
    }
  }
  if (!cafsCache.has(storeDir)) {
    cafsCache.set(storeDir, createCafs(storeDir));
  }
  const cafs = cafsCache.get(storeDir);
  let { filesIndex, manifest } = cafs.addFilesFromTarball(buffer, true);
  if (appendManifest && manifest == null) {
    manifest = appendManifest;
    addManifestToCafs(cafs, filesIndex, appendManifest);
  }
  const { filesIntegrity, filesMap } = processFilesIndex(filesIndex);
  const requiresBuild = writeFilesIndexFile(filesIndexFile, { algo: HASH_ALGORITHM, manifest: manifest ?? {}, files: filesIntegrity });
  return {
    status: "success",
    value: {
      filesMap,
      manifest,
      requiresBuild,
      integrity: integrity ?? calcIntegrity(buffer)
    }
  };
}
function calcIntegrity(buffer) {
  const calculatedHash = crypto3.hash("sha512", buffer, "hex");
  return formatIntegrity("sha512", calculatedHash);
}
function initStore({ storeDir }) {
  fs7.mkdirSync(storeDir, { recursive: true });
  const hexChars = "0123456789abcdef".split("");
  for (const subDir of ["files", "index"]) {
    const subDirPath = path11.join(storeDir, subDir);
    try {
      fs7.mkdirSync(subDirPath);
    } catch {
    }
    for (const hex1 of hexChars) {
      for (const hex2 of hexChars) {
        try {
          fs7.mkdirSync(path11.join(subDirPath, `${hex1}${hex2}`));
        } catch {
        }
      }
    }
  }
  return { status: "success" };
}
function addFilesFromDir2({ appendManifest, dir, files, filesIndexFile, sideEffectsCacheKey, storeDir }) {
  if (!cafsCache.has(storeDir)) {
    cafsCache.set(storeDir, createCafs(storeDir));
  }
  const cafs = cafsCache.get(storeDir);
  let { filesIndex, manifest } = cafs.addFilesFromDir(dir, {
    files,
    readManifest: true
  });
  if (appendManifest && manifest == null) {
    manifest = appendManifest;
    addManifestToCafs(cafs, filesIndex, appendManifest);
  }
  const { filesIntegrity, filesMap } = processFilesIndex(filesIndex);
  let requiresBuild;
  if (sideEffectsCacheKey) {
    let existingFilesIndex;
    try {
      existingFilesIndex = readMsgpackFileSync(filesIndexFile);
    } catch {
      return {
        status: "success",
        value: {
          filesMap,
          manifest,
          requiresBuild: pkgRequiresBuild(manifest, filesMap)
        }
      };
    }
    if (!existingFilesIndex.sideEffects) {
      existingFilesIndex.sideEffects = /* @__PURE__ */ new Map();
    }
    if (existingFilesIndex.algo !== HASH_ALGORITHM) {
      throw new PnpmError("ALGO_MISMATCH", `Algorithm mismatch: package index uses "${existingFilesIndex.algo}" but side effects were computed with "${HASH_ALGORITHM}"`);
    }
    existingFilesIndex.sideEffects.set(sideEffectsCacheKey, calculateDiff(existingFilesIndex.files, filesIntegrity));
    if (existingFilesIndex.requiresBuild == null) {
      requiresBuild = pkgRequiresBuild(manifest, filesMap);
    } else {
      requiresBuild = existingFilesIndex.requiresBuild;
    }
    writeIndexFile(filesIndexFile, existingFilesIndex);
  } else {
    requiresBuild = writeFilesIndexFile(filesIndexFile, { algo: HASH_ALGORITHM, manifest: manifest ?? {}, files: filesIntegrity });
  }
  return { status: "success", value: { filesMap, manifest, requiresBuild } };
}
function addManifestToCafs(cafs, filesIndex, manifest) {
  const fileBuffer = Buffer.from(JSON.stringify(manifest, null, 2), "utf8");
  const mode = 420;
  filesIndex.set("package.json", {
    mode,
    size: fileBuffer.length,
    ...cafs.addFile(fileBuffer, mode)
  });
}
function calculateDiff(baseFiles, sideEffectsFiles) {
  const deleted = [];
  const added = /* @__PURE__ */ new Map();
  const allFiles = /* @__PURE__ */ new Set([...baseFiles.keys(), ...sideEffectsFiles.keys()]);
  for (const file of allFiles) {
    if (!sideEffectsFiles.has(file)) {
      deleted.push(file);
    } else if (!baseFiles.has(file) || baseFiles.get(file).digest !== sideEffectsFiles.get(file).digest || baseFiles.get(file).mode !== sideEffectsFiles.get(file).mode) {
      added.set(file, sideEffectsFiles.get(file));
    }
  }
  const diff = {};
  if (deleted.length > 0) {
    diff.deleted = deleted;
  }
  if (added.size > 0) {
    diff.added = added;
  }
  return diff;
}
function processFilesIndex(filesIndex) {
  const filesIntegrity = /* @__PURE__ */ new Map();
  const filesMap = /* @__PURE__ */ new Map();
  for (const [k, { checkedAt, filePath, digest, mode, size }] of filesIndex) {
    filesIntegrity.set(k, {
      checkedAt,
      digest,
      mode,
      size
    });
    filesMap.set(k, filePath);
  }
  return { filesIntegrity, filesMap };
}
function importPackage({ storeDir, packageImportMethod, filesResponse, sideEffectsCacheKey, targetDir, requiresBuild, force, keepModulesDir, disableRelinkLocalDirDeps }) {
  const cacheKey = JSON.stringify({ storeDir, packageImportMethod });
  if (!cafsStoreCache.has(cacheKey)) {
    cafsStoreCache.set(cacheKey, createCafsStore(storeDir, { packageImportMethod, cafsLocker }));
  }
  const cafsStore = cafsStoreCache.get(cacheKey);
  const { importMethod, isBuilt } = cafsStore.importPackage(targetDir, {
    filesResponse,
    force,
    disableRelinkLocalDirDeps,
    requiresBuild,
    sideEffectsCacheKey,
    keepModulesDir
  });
  return { status: "success", value: { isBuilt, importMethod } };
}
function symlinkAllModules(opts2) {
  for (const dep of opts2.deps) {
    for (const [alias, pkgDir] of Object.entries(dep.children)) {
      if (alias !== dep.name) {
        symlinkDependencySync(pkgDir, dep.modules, alias);
      }
    }
  }
  return { status: "success" };
}
function writeFilesIndexFile(filesIndexFile, { algo, manifest, files, sideEffects }) {
  const requiresBuild = pkgRequiresBuild(manifest, files);
  const filesIndex = {
    name: manifest.name,
    version: manifest.version,
    requiresBuild,
    algo,
    files,
    sideEffects
  };
  writeIndexFile(filesIndexFile, filesIndex);
  return requiresBuild;
}
function writeIndexFile(filePath, data) {
  const targetDir = path11.dirname(filePath);
  fs7.mkdirSync(targetDir, { recursive: true });
  const temp = `${filePath.slice(0, -10)}${process.pid}`;
  writeMsgpackFileSync(temp, data);
  optimisticRenameOverwrite(temp, filePath);
}

// ../worker/lib/worker.js
startWorker();
/*! Bundled license information:

is-windows/index.js:
  (*!
   * is-windows <https://github.com/jonschlinkert/is-windows>
   *
   * Copyright © 2015-2018, Jon Schlinkert.
   * Released under the MIT License.
   *)
*/
