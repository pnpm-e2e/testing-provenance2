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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../../.local/share/pnpm/store/v10/links/graceful-fs/4.2.11/8db7cc369562e535b7a2778a8c38da8f404d03f7114c8b3ba35122797f5c8722/node_modules/graceful-fs/polyfills.js
var require_polyfills = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/graceful-fs/4.2.11/8db7cc369562e535b7a2778a8c38da8f404d03f7114c8b3ba35122797f5c8722/node_modules/graceful-fs/polyfills.js"(exports, module) {
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
    function patch(fs9) {
      if (constants2.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
        patchLchmod(fs9);
      }
      if (!fs9.lutimes) {
        patchLutimes(fs9);
      }
      fs9.chown = chownFix(fs9.chown);
      fs9.fchown = chownFix(fs9.fchown);
      fs9.lchown = chownFix(fs9.lchown);
      fs9.chmod = chmodFix(fs9.chmod);
      fs9.fchmod = chmodFix(fs9.fchmod);
      fs9.lchmod = chmodFix(fs9.lchmod);
      fs9.chownSync = chownFixSync(fs9.chownSync);
      fs9.fchownSync = chownFixSync(fs9.fchownSync);
      fs9.lchownSync = chownFixSync(fs9.lchownSync);
      fs9.chmodSync = chmodFixSync(fs9.chmodSync);
      fs9.fchmodSync = chmodFixSync(fs9.fchmodSync);
      fs9.lchmodSync = chmodFixSync(fs9.lchmodSync);
      fs9.stat = statFix(fs9.stat);
      fs9.fstat = statFix(fs9.fstat);
      fs9.lstat = statFix(fs9.lstat);
      fs9.statSync = statFixSync(fs9.statSync);
      fs9.fstatSync = statFixSync(fs9.fstatSync);
      fs9.lstatSync = statFixSync(fs9.lstatSync);
      if (fs9.chmod && !fs9.lchmod) {
        fs9.lchmod = function(path12, mode, cb) {
          if (cb) process.nextTick(cb);
        };
        fs9.lchmodSync = function() {
        };
      }
      if (fs9.chown && !fs9.lchown) {
        fs9.lchown = function(path12, uid, gid, cb) {
          if (cb) process.nextTick(cb);
        };
        fs9.lchownSync = function() {
        };
      }
      if (platform === "win32") {
        fs9.rename = typeof fs9.rename !== "function" ? fs9.rename : (function(fs$rename) {
          function rename(from, to, cb) {
            var start = Date.now();
            var backoff = 0;
            fs$rename(from, to, function CB(er) {
              if (er && (er.code === "EACCES" || er.code === "EPERM" || er.code === "EBUSY") && Date.now() - start < 6e4) {
                setTimeout(function() {
                  fs9.stat(to, function(stater, st) {
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
        })(fs9.rename);
      }
      fs9.read = typeof fs9.read !== "function" ? fs9.read : (function(fs$read) {
        function read(fd, buffer, offset, length, position, callback_) {
          var callback;
          if (callback_ && typeof callback_ === "function") {
            var eagCounter = 0;
            callback = function(er, _, __) {
              if (er && er.code === "EAGAIN" && eagCounter < 10) {
                eagCounter++;
                return fs$read.call(fs9, fd, buffer, offset, length, position, callback);
              }
              callback_.apply(this, arguments);
            };
          }
          return fs$read.call(fs9, fd, buffer, offset, length, position, callback);
        }
        if (Object.setPrototypeOf) Object.setPrototypeOf(read, fs$read);
        return read;
      })(fs9.read);
      fs9.readSync = typeof fs9.readSync !== "function" ? fs9.readSync : /* @__PURE__ */ (function(fs$readSync) {
        return function(fd, buffer, offset, length, position) {
          var eagCounter = 0;
          while (true) {
            try {
              return fs$readSync.call(fs9, fd, buffer, offset, length, position);
            } catch (er) {
              if (er.code === "EAGAIN" && eagCounter < 10) {
                eagCounter++;
                continue;
              }
              throw er;
            }
          }
        };
      })(fs9.readSync);
      function patchLchmod(fs10) {
        fs10.lchmod = function(path12, mode, callback) {
          fs10.open(
            path12,
            constants2.O_WRONLY | constants2.O_SYMLINK,
            mode,
            function(err, fd) {
              if (err) {
                if (callback) callback(err);
                return;
              }
              fs10.fchmod(fd, mode, function(err2) {
                fs10.close(fd, function(err22) {
                  if (callback) callback(err2 || err22);
                });
              });
            }
          );
        };
        fs10.lchmodSync = function(path12, mode) {
          var fd = fs10.openSync(path12, constants2.O_WRONLY | constants2.O_SYMLINK, mode);
          var threw = true;
          var ret;
          try {
            ret = fs10.fchmodSync(fd, mode);
            threw = false;
          } finally {
            if (threw) {
              try {
                fs10.closeSync(fd);
              } catch (er) {
              }
            } else {
              fs10.closeSync(fd);
            }
          }
          return ret;
        };
      }
      function patchLutimes(fs10) {
        if (constants2.hasOwnProperty("O_SYMLINK") && fs10.futimes) {
          fs10.lutimes = function(path12, at, mt, cb) {
            fs10.open(path12, constants2.O_SYMLINK, function(er, fd) {
              if (er) {
                if (cb) cb(er);
                return;
              }
              fs10.futimes(fd, at, mt, function(er2) {
                fs10.close(fd, function(er22) {
                  if (cb) cb(er2 || er22);
                });
              });
            });
          };
          fs10.lutimesSync = function(path12, at, mt) {
            var fd = fs10.openSync(path12, constants2.O_SYMLINK);
            var ret;
            var threw = true;
            try {
              ret = fs10.futimesSync(fd, at, mt);
              threw = false;
            } finally {
              if (threw) {
                try {
                  fs10.closeSync(fd);
                } catch (er) {
                }
              } else {
                fs10.closeSync(fd);
              }
            }
            return ret;
          };
        } else if (fs10.futimes) {
          fs10.lutimes = function(_a, _b, _c, cb) {
            if (cb) process.nextTick(cb);
          };
          fs10.lutimesSync = function() {
          };
        }
      }
      function chmodFix(orig) {
        if (!orig) return orig;
        return function(target, mode, cb) {
          return orig.call(fs9, target, mode, function(er) {
            if (chownErOk(er)) er = null;
            if (cb) cb.apply(this, arguments);
          });
        };
      }
      function chmodFixSync(orig) {
        if (!orig) return orig;
        return function(target, mode) {
          try {
            return orig.call(fs9, target, mode);
          } catch (er) {
            if (!chownErOk(er)) throw er;
          }
        };
      }
      function chownFix(orig) {
        if (!orig) return orig;
        return function(target, uid, gid, cb) {
          return orig.call(fs9, target, uid, gid, function(er) {
            if (chownErOk(er)) er = null;
            if (cb) cb.apply(this, arguments);
          });
        };
      }
      function chownFixSync(orig) {
        if (!orig) return orig;
        return function(target, uid, gid) {
          try {
            return orig.call(fs9, target, uid, gid);
          } catch (er) {
            if (!chownErOk(er)) throw er;
          }
        };
      }
      function statFix(orig) {
        if (!orig) return orig;
        return function(target, options, cb) {
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
          return options ? orig.call(fs9, target, options, callback) : orig.call(fs9, target, callback);
        };
      }
      function statFixSync(orig) {
        if (!orig) return orig;
        return function(target, options) {
          var stats = options ? orig.call(fs9, target, options) : orig.call(fs9, target);
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

// ../../../.local/share/pnpm/store/v10/links/graceful-fs/4.2.11/8db7cc369562e535b7a2778a8c38da8f404d03f7114c8b3ba35122797f5c8722/node_modules/graceful-fs/legacy-streams.js
var require_legacy_streams = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/graceful-fs/4.2.11/8db7cc369562e535b7a2778a8c38da8f404d03f7114c8b3ba35122797f5c8722/node_modules/graceful-fs/legacy-streams.js"(exports, module) {
    var Stream = __require("stream").Stream;
    module.exports = legacy;
    function legacy(fs9) {
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
        fs9.open(this.path, this.flags, this.mode, function(err, fd) {
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
          this._open = fs9.open;
          this._queue.push([this._open, this.path, this.flags, this.mode, void 0]);
          this.flush();
        }
      }
    }
  }
});

// ../../../.local/share/pnpm/store/v10/links/graceful-fs/4.2.11/8db7cc369562e535b7a2778a8c38da8f404d03f7114c8b3ba35122797f5c8722/node_modules/graceful-fs/clone.js
var require_clone = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/graceful-fs/4.2.11/8db7cc369562e535b7a2778a8c38da8f404d03f7114c8b3ba35122797f5c8722/node_modules/graceful-fs/clone.js"(exports, module) {
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

// ../../../.local/share/pnpm/store/v10/links/graceful-fs/4.2.11/8db7cc369562e535b7a2778a8c38da8f404d03f7114c8b3ba35122797f5c8722/node_modules/graceful-fs/graceful-fs.js
var require_graceful_fs = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/graceful-fs/4.2.11/8db7cc369562e535b7a2778a8c38da8f404d03f7114c8b3ba35122797f5c8722/node_modules/graceful-fs/graceful-fs.js"(exports, module) {
    var fs9 = __require("fs");
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
    if (!fs9[gracefulQueue]) {
      queue = global[gracefulQueue] || [];
      publishQueue(fs9, queue);
      fs9.close = (function(fs$close) {
        function close(fd, cb) {
          return fs$close.call(fs9, fd, function(err) {
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
      })(fs9.close);
      fs9.closeSync = (function(fs$closeSync) {
        function closeSync(fd) {
          fs$closeSync.apply(fs9, arguments);
          resetQueue();
        }
        Object.defineProperty(closeSync, previousSymbol, {
          value: fs$closeSync
        });
        return closeSync;
      })(fs9.closeSync);
      if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) {
        process.on("exit", function() {
          debug(fs9[gracefulQueue]);
          __require("assert").equal(fs9[gracefulQueue].length, 0);
        });
      }
    }
    var queue;
    if (!global[gracefulQueue]) {
      publishQueue(global, fs9[gracefulQueue]);
    }
    module.exports = patch(clone(fs9));
    if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs9.__patched) {
      module.exports = patch(fs9);
      fs9.__patched = true;
    }
    function patch(fs10) {
      polyfills(fs10);
      fs10.gracefulify = patch;
      fs10.createReadStream = createReadStream;
      fs10.createWriteStream = createWriteStream;
      var fs$readFile = fs10.readFile;
      fs10.readFile = readFile;
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
      var fs$writeFile = fs10.writeFile;
      fs10.writeFile = writeFile2;
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
      var fs$appendFile = fs10.appendFile;
      if (fs$appendFile)
        fs10.appendFile = appendFile;
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
      var fs$copyFile = fs10.copyFile;
      if (fs$copyFile)
        fs10.copyFile = copyFile;
      function copyFile(src, dest, flags, cb) {
        if (typeof flags === "function") {
          cb = flags;
          flags = 0;
        }
        return go$copyFile(src, dest, flags, cb);
        function go$copyFile(src2, dest2, flags2, cb2, startTime) {
          return fs$copyFile(src2, dest2, flags2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE" || err.code === "EBUSY"))
              enqueue([go$copyFile, [src2, dest2, flags2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$readdir = fs10.readdir;
      fs10.readdir = readdir;
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
        var legStreams = legacy(fs10);
        ReadStream = legStreams.ReadStream;
        WriteStream = legStreams.WriteStream;
      }
      var fs$ReadStream = fs10.ReadStream;
      if (fs$ReadStream) {
        ReadStream.prototype = Object.create(fs$ReadStream.prototype);
        ReadStream.prototype.open = ReadStream$open;
      }
      var fs$WriteStream = fs10.WriteStream;
      if (fs$WriteStream) {
        WriteStream.prototype = Object.create(fs$WriteStream.prototype);
        WriteStream.prototype.open = WriteStream$open;
      }
      Object.defineProperty(fs10, "ReadStream", {
        get: function() {
          return ReadStream;
        },
        set: function(val) {
          ReadStream = val;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(fs10, "WriteStream", {
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
      Object.defineProperty(fs10, "FileReadStream", {
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
      Object.defineProperty(fs10, "FileWriteStream", {
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
        return new fs10.ReadStream(path12, options);
      }
      function createWriteStream(path12, options) {
        return new fs10.WriteStream(path12, options);
      }
      var fs$open = fs10.open;
      fs10.open = open;
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
      return fs10;
    }
    function enqueue(elem) {
      debug("ENQUEUE", elem[0].name, elem[1]);
      fs9[gracefulQueue].push(elem);
      retry();
    }
    var retryTimer;
    function resetQueue() {
      var now = Date.now();
      for (var i = 0; i < fs9[gracefulQueue].length; ++i) {
        if (fs9[gracefulQueue][i].length > 2) {
          fs9[gracefulQueue][i][3] = now;
          fs9[gracefulQueue][i][4] = now;
        }
      }
      retry();
    }
    function retry() {
      clearTimeout(retryTimer);
      retryTimer = void 0;
      if (fs9[gracefulQueue].length === 0)
        return;
      var elem = fs9[gracefulQueue].shift();
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
          fs9[gracefulQueue].push(elem);
        }
      }
      if (retryTimer === void 0) {
        retryTimer = setTimeout(retry, 0);
      }
    }
  }
});

// ../../../.local/share/pnpm/store/v10/links/minipass/7.1.2/090f41a8d2b16d60f1d1d1735fb4804bbf6f0438e6391e486fd77f3252bb6311/node_modules/minipass/dist/commonjs/index.js
var require_commonjs = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/minipass/7.1.2/090f41a8d2b16d60f1d1d1735fb4804bbf6f0438e6391e486fd77f3252bb6311/node_modules/minipass/dist/commonjs/index.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Minipass = exports.isWritable = exports.isReadable = exports.isStream = void 0;
    var proc = typeof process === "object" && process ? process : {
      stdout: null,
      stderr: null
    };
    var node_events_1 = __require("node:events");
    var node_stream_1 = __importDefault(__require("node:stream"));
    var node_string_decoder_1 = __require("node:string_decoder");
    var isStream = (s) => !!s && typeof s === "object" && (s instanceof Minipass || s instanceof node_stream_1.default || (0, exports.isReadable)(s) || (0, exports.isWritable)(s));
    exports.isStream = isStream;
    var isReadable = (s) => !!s && typeof s === "object" && s instanceof node_events_1.EventEmitter && typeof s.pipe === "function" && // node core Writable streams have a pipe() method, but it throws
    s.pipe !== node_stream_1.default.Writable.prototype.pipe;
    exports.isReadable = isReadable;
    var isWritable = (s) => !!s && typeof s === "object" && s instanceof node_events_1.EventEmitter && typeof s.write === "function" && typeof s.end === "function";
    exports.isWritable = isWritable;
    var EOF = Symbol("EOF");
    var MAYBE_EMIT_END = Symbol("maybeEmitEnd");
    var EMITTED_END = Symbol("emittedEnd");
    var EMITTING_END = Symbol("emittingEnd");
    var EMITTED_ERROR = Symbol("emittedError");
    var CLOSED = Symbol("closed");
    var READ = Symbol("read");
    var FLUSH = Symbol("flush");
    var FLUSHCHUNK = Symbol("flushChunk");
    var ENCODING = Symbol("encoding");
    var DECODER = Symbol("decoder");
    var FLOWING = Symbol("flowing");
    var PAUSED = Symbol("paused");
    var RESUME = Symbol("resume");
    var BUFFER = Symbol("buffer");
    var PIPES = Symbol("pipes");
    var BUFFERLENGTH = Symbol("bufferLength");
    var BUFFERPUSH = Symbol("bufferPush");
    var BUFFERSHIFT = Symbol("bufferShift");
    var OBJECTMODE = Symbol("objectMode");
    var DESTROYED = Symbol("destroyed");
    var ERROR = Symbol("error");
    var EMITDATA = Symbol("emitData");
    var EMITEND = Symbol("emitEnd");
    var EMITEND2 = Symbol("emitEnd2");
    var ASYNC = Symbol("async");
    var ABORT = Symbol("abort");
    var ABORTED = Symbol("aborted");
    var SIGNAL = Symbol("signal");
    var DATALISTENERS = Symbol("dataListeners");
    var DISCARDED = Symbol("discarded");
    var defer = (fn) => Promise.resolve().then(fn);
    var nodefer = (fn) => fn();
    var isEndish = (ev) => ev === "end" || ev === "finish" || ev === "prefinish";
    var isArrayBufferLike = (b) => b instanceof ArrayBuffer || !!b && typeof b === "object" && b.constructor && b.constructor.name === "ArrayBuffer" && b.byteLength >= 0;
    var isArrayBufferView = (b) => !Buffer.isBuffer(b) && ArrayBuffer.isView(b);
    var Pipe = class {
      src;
      dest;
      opts;
      ondrain;
      constructor(src, dest, opts2) {
        this.src = src;
        this.dest = dest;
        this.opts = opts2;
        this.ondrain = () => src[RESUME]();
        this.dest.on("drain", this.ondrain);
      }
      unpipe() {
        this.dest.removeListener("drain", this.ondrain);
      }
      // only here for the prototype
      /* c8 ignore start */
      proxyErrors(_er) {
      }
      /* c8 ignore stop */
      end() {
        this.unpipe();
        if (this.opts.end)
          this.dest.end();
      }
    };
    var PipeProxyErrors = class extends Pipe {
      unpipe() {
        this.src.removeListener("error", this.proxyErrors);
        super.unpipe();
      }
      constructor(src, dest, opts2) {
        super(src, dest, opts2);
        this.proxyErrors = (er) => dest.emit("error", er);
        src.on("error", this.proxyErrors);
      }
    };
    var isObjectModeOptions = (o) => !!o.objectMode;
    var isEncodingOptions = (o) => !o.objectMode && !!o.encoding && o.encoding !== "buffer";
    var Minipass = class extends node_events_1.EventEmitter {
      [FLOWING] = false;
      [PAUSED] = false;
      [PIPES] = [];
      [BUFFER] = [];
      [OBJECTMODE];
      [ENCODING];
      [ASYNC];
      [DECODER];
      [EOF] = false;
      [EMITTED_END] = false;
      [EMITTING_END] = false;
      [CLOSED] = false;
      [EMITTED_ERROR] = null;
      [BUFFERLENGTH] = 0;
      [DESTROYED] = false;
      [SIGNAL];
      [ABORTED] = false;
      [DATALISTENERS] = 0;
      [DISCARDED] = false;
      /**
       * true if the stream can be written
       */
      writable = true;
      /**
       * true if the stream can be read
       */
      readable = true;
      /**
       * If `RType` is Buffer, then options do not need to be provided.
       * Otherwise, an options object must be provided to specify either
       * {@link Minipass.SharedOptions.objectMode} or
       * {@link Minipass.SharedOptions.encoding}, as appropriate.
       */
      constructor(...args) {
        const options = args[0] || {};
        super();
        if (options.objectMode && typeof options.encoding === "string") {
          throw new TypeError("Encoding and objectMode may not be used together");
        }
        if (isObjectModeOptions(options)) {
          this[OBJECTMODE] = true;
          this[ENCODING] = null;
        } else if (isEncodingOptions(options)) {
          this[ENCODING] = options.encoding;
          this[OBJECTMODE] = false;
        } else {
          this[OBJECTMODE] = false;
          this[ENCODING] = null;
        }
        this[ASYNC] = !!options.async;
        this[DECODER] = this[ENCODING] ? new node_string_decoder_1.StringDecoder(this[ENCODING]) : null;
        if (options && options.debugExposeBuffer === true) {
          Object.defineProperty(this, "buffer", { get: () => this[BUFFER] });
        }
        if (options && options.debugExposePipes === true) {
          Object.defineProperty(this, "pipes", { get: () => this[PIPES] });
        }
        const { signal } = options;
        if (signal) {
          this[SIGNAL] = signal;
          if (signal.aborted) {
            this[ABORT]();
          } else {
            signal.addEventListener("abort", () => this[ABORT]());
          }
        }
      }
      /**
       * The amount of data stored in the buffer waiting to be read.
       *
       * For Buffer strings, this will be the total byte length.
       * For string encoding streams, this will be the string character length,
       * according to JavaScript's `string.length` logic.
       * For objectMode streams, this is a count of the items waiting to be
       * emitted.
       */
      get bufferLength() {
        return this[BUFFERLENGTH];
      }
      /**
       * The `BufferEncoding` currently in use, or `null`
       */
      get encoding() {
        return this[ENCODING];
      }
      /**
       * @deprecated - This is a read only property
       */
      set encoding(_enc) {
        throw new Error("Encoding must be set at instantiation time");
      }
      /**
       * @deprecated - Encoding may only be set at instantiation time
       */
      setEncoding(_enc) {
        throw new Error("Encoding must be set at instantiation time");
      }
      /**
       * True if this is an objectMode stream
       */
      get objectMode() {
        return this[OBJECTMODE];
      }
      /**
       * @deprecated - This is a read-only property
       */
      set objectMode(_om) {
        throw new Error("objectMode must be set at instantiation time");
      }
      /**
       * true if this is an async stream
       */
      get ["async"]() {
        return this[ASYNC];
      }
      /**
       * Set to true to make this stream async.
       *
       * Once set, it cannot be unset, as this would potentially cause incorrect
       * behavior.  Ie, a sync stream can be made async, but an async stream
       * cannot be safely made sync.
       */
      set ["async"](a) {
        this[ASYNC] = this[ASYNC] || !!a;
      }
      // drop everything and get out of the flow completely
      [ABORT]() {
        this[ABORTED] = true;
        this.emit("abort", this[SIGNAL]?.reason);
        this.destroy(this[SIGNAL]?.reason);
      }
      /**
       * True if the stream has been aborted.
       */
      get aborted() {
        return this[ABORTED];
      }
      /**
       * No-op setter. Stream aborted status is set via the AbortSignal provided
       * in the constructor options.
       */
      set aborted(_) {
      }
      write(chunk, encoding, cb) {
        if (this[ABORTED])
          return false;
        if (this[EOF])
          throw new Error("write after end");
        if (this[DESTROYED]) {
          this.emit("error", Object.assign(new Error("Cannot call write after a stream was destroyed"), { code: "ERR_STREAM_DESTROYED" }));
          return true;
        }
        if (typeof encoding === "function") {
          cb = encoding;
          encoding = "utf8";
        }
        if (!encoding)
          encoding = "utf8";
        const fn = this[ASYNC] ? defer : nodefer;
        if (!this[OBJECTMODE] && !Buffer.isBuffer(chunk)) {
          if (isArrayBufferView(chunk)) {
            chunk = Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
          } else if (isArrayBufferLike(chunk)) {
            chunk = Buffer.from(chunk);
          } else if (typeof chunk !== "string") {
            throw new Error("Non-contiguous data written to non-objectMode stream");
          }
        }
        if (this[OBJECTMODE]) {
          if (this[FLOWING] && this[BUFFERLENGTH] !== 0)
            this[FLUSH](true);
          if (this[FLOWING])
            this.emit("data", chunk);
          else
            this[BUFFERPUSH](chunk);
          if (this[BUFFERLENGTH] !== 0)
            this.emit("readable");
          if (cb)
            fn(cb);
          return this[FLOWING];
        }
        if (!chunk.length) {
          if (this[BUFFERLENGTH] !== 0)
            this.emit("readable");
          if (cb)
            fn(cb);
          return this[FLOWING];
        }
        if (typeof chunk === "string" && // unless it is a string already ready for us to use
        !(encoding === this[ENCODING] && !this[DECODER]?.lastNeed)) {
          chunk = Buffer.from(chunk, encoding);
        }
        if (Buffer.isBuffer(chunk) && this[ENCODING]) {
          chunk = this[DECODER].write(chunk);
        }
        if (this[FLOWING] && this[BUFFERLENGTH] !== 0)
          this[FLUSH](true);
        if (this[FLOWING])
          this.emit("data", chunk);
        else
          this[BUFFERPUSH](chunk);
        if (this[BUFFERLENGTH] !== 0)
          this.emit("readable");
        if (cb)
          fn(cb);
        return this[FLOWING];
      }
      /**
       * Low-level explicit read method.
       *
       * In objectMode, the argument is ignored, and one item is returned if
       * available.
       *
       * `n` is the number of bytes (or in the case of encoding streams,
       * characters) to consume. If `n` is not provided, then the entire buffer
       * is returned, or `null` is returned if no data is available.
       *
       * If `n` is greater that the amount of data in the internal buffer,
       * then `null` is returned.
       */
      read(n) {
        if (this[DESTROYED])
          return null;
        this[DISCARDED] = false;
        if (this[BUFFERLENGTH] === 0 || n === 0 || n && n > this[BUFFERLENGTH]) {
          this[MAYBE_EMIT_END]();
          return null;
        }
        if (this[OBJECTMODE])
          n = null;
        if (this[BUFFER].length > 1 && !this[OBJECTMODE]) {
          this[BUFFER] = [
            this[ENCODING] ? this[BUFFER].join("") : Buffer.concat(this[BUFFER], this[BUFFERLENGTH])
          ];
        }
        const ret = this[READ](n || null, this[BUFFER][0]);
        this[MAYBE_EMIT_END]();
        return ret;
      }
      [READ](n, chunk) {
        if (this[OBJECTMODE])
          this[BUFFERSHIFT]();
        else {
          const c = chunk;
          if (n === c.length || n === null)
            this[BUFFERSHIFT]();
          else if (typeof c === "string") {
            this[BUFFER][0] = c.slice(n);
            chunk = c.slice(0, n);
            this[BUFFERLENGTH] -= n;
          } else {
            this[BUFFER][0] = c.subarray(n);
            chunk = c.subarray(0, n);
            this[BUFFERLENGTH] -= n;
          }
        }
        this.emit("data", chunk);
        if (!this[BUFFER].length && !this[EOF])
          this.emit("drain");
        return chunk;
      }
      end(chunk, encoding, cb) {
        if (typeof chunk === "function") {
          cb = chunk;
          chunk = void 0;
        }
        if (typeof encoding === "function") {
          cb = encoding;
          encoding = "utf8";
        }
        if (chunk !== void 0)
          this.write(chunk, encoding);
        if (cb)
          this.once("end", cb);
        this[EOF] = true;
        this.writable = false;
        if (this[FLOWING] || !this[PAUSED])
          this[MAYBE_EMIT_END]();
        return this;
      }
      // don't let the internal resume be overwritten
      [RESUME]() {
        if (this[DESTROYED])
          return;
        if (!this[DATALISTENERS] && !this[PIPES].length) {
          this[DISCARDED] = true;
        }
        this[PAUSED] = false;
        this[FLOWING] = true;
        this.emit("resume");
        if (this[BUFFER].length)
          this[FLUSH]();
        else if (this[EOF])
          this[MAYBE_EMIT_END]();
        else
          this.emit("drain");
      }
      /**
       * Resume the stream if it is currently in a paused state
       *
       * If called when there are no pipe destinations or `data` event listeners,
       * this will place the stream in a "discarded" state, where all data will
       * be thrown away. The discarded state is removed if a pipe destination or
       * data handler is added, if pause() is called, or if any synchronous or
       * asynchronous iteration is started.
       */
      resume() {
        return this[RESUME]();
      }
      /**
       * Pause the stream
       */
      pause() {
        this[FLOWING] = false;
        this[PAUSED] = true;
        this[DISCARDED] = false;
      }
      /**
       * true if the stream has been forcibly destroyed
       */
      get destroyed() {
        return this[DESTROYED];
      }
      /**
       * true if the stream is currently in a flowing state, meaning that
       * any writes will be immediately emitted.
       */
      get flowing() {
        return this[FLOWING];
      }
      /**
       * true if the stream is currently in a paused state
       */
      get paused() {
        return this[PAUSED];
      }
      [BUFFERPUSH](chunk) {
        if (this[OBJECTMODE])
          this[BUFFERLENGTH] += 1;
        else
          this[BUFFERLENGTH] += chunk.length;
        this[BUFFER].push(chunk);
      }
      [BUFFERSHIFT]() {
        if (this[OBJECTMODE])
          this[BUFFERLENGTH] -= 1;
        else
          this[BUFFERLENGTH] -= this[BUFFER][0].length;
        return this[BUFFER].shift();
      }
      [FLUSH](noDrain = false) {
        do {
        } while (this[FLUSHCHUNK](this[BUFFERSHIFT]()) && this[BUFFER].length);
        if (!noDrain && !this[BUFFER].length && !this[EOF])
          this.emit("drain");
      }
      [FLUSHCHUNK](chunk) {
        this.emit("data", chunk);
        return this[FLOWING];
      }
      /**
       * Pipe all data emitted by this stream into the destination provided.
       *
       * Triggers the flow of data.
       */
      pipe(dest, opts2) {
        if (this[DESTROYED])
          return dest;
        this[DISCARDED] = false;
        const ended = this[EMITTED_END];
        opts2 = opts2 || {};
        if (dest === proc.stdout || dest === proc.stderr)
          opts2.end = false;
        else
          opts2.end = opts2.end !== false;
        opts2.proxyErrors = !!opts2.proxyErrors;
        if (ended) {
          if (opts2.end)
            dest.end();
        } else {
          this[PIPES].push(!opts2.proxyErrors ? new Pipe(this, dest, opts2) : new PipeProxyErrors(this, dest, opts2));
          if (this[ASYNC])
            defer(() => this[RESUME]());
          else
            this[RESUME]();
        }
        return dest;
      }
      /**
       * Fully unhook a piped destination stream.
       *
       * If the destination stream was the only consumer of this stream (ie,
       * there are no other piped destinations or `'data'` event listeners)
       * then the flow of data will stop until there is another consumer or
       * {@link Minipass#resume} is explicitly called.
       */
      unpipe(dest) {
        const p = this[PIPES].find((p2) => p2.dest === dest);
        if (p) {
          if (this[PIPES].length === 1) {
            if (this[FLOWING] && this[DATALISTENERS] === 0) {
              this[FLOWING] = false;
            }
            this[PIPES] = [];
          } else
            this[PIPES].splice(this[PIPES].indexOf(p), 1);
          p.unpipe();
        }
      }
      /**
       * Alias for {@link Minipass#on}
       */
      addListener(ev, handler) {
        return this.on(ev, handler);
      }
      /**
       * Mostly identical to `EventEmitter.on`, with the following
       * behavior differences to prevent data loss and unnecessary hangs:
       *
       * - Adding a 'data' event handler will trigger the flow of data
       *
       * - Adding a 'readable' event handler when there is data waiting to be read
       *   will cause 'readable' to be emitted immediately.
       *
       * - Adding an 'endish' event handler ('end', 'finish', etc.) which has
       *   already passed will cause the event to be emitted immediately and all
       *   handlers removed.
       *
       * - Adding an 'error' event handler after an error has been emitted will
       *   cause the event to be re-emitted immediately with the error previously
       *   raised.
       */
      on(ev, handler) {
        const ret = super.on(ev, handler);
        if (ev === "data") {
          this[DISCARDED] = false;
          this[DATALISTENERS]++;
          if (!this[PIPES].length && !this[FLOWING]) {
            this[RESUME]();
          }
        } else if (ev === "readable" && this[BUFFERLENGTH] !== 0) {
          super.emit("readable");
        } else if (isEndish(ev) && this[EMITTED_END]) {
          super.emit(ev);
          this.removeAllListeners(ev);
        } else if (ev === "error" && this[EMITTED_ERROR]) {
          const h = handler;
          if (this[ASYNC])
            defer(() => h.call(this, this[EMITTED_ERROR]));
          else
            h.call(this, this[EMITTED_ERROR]);
        }
        return ret;
      }
      /**
       * Alias for {@link Minipass#off}
       */
      removeListener(ev, handler) {
        return this.off(ev, handler);
      }
      /**
       * Mostly identical to `EventEmitter.off`
       *
       * If a 'data' event handler is removed, and it was the last consumer
       * (ie, there are no pipe destinations or other 'data' event listeners),
       * then the flow of data will stop until there is another consumer or
       * {@link Minipass#resume} is explicitly called.
       */
      off(ev, handler) {
        const ret = super.off(ev, handler);
        if (ev === "data") {
          this[DATALISTENERS] = this.listeners("data").length;
          if (this[DATALISTENERS] === 0 && !this[DISCARDED] && !this[PIPES].length) {
            this[FLOWING] = false;
          }
        }
        return ret;
      }
      /**
       * Mostly identical to `EventEmitter.removeAllListeners`
       *
       * If all 'data' event handlers are removed, and they were the last consumer
       * (ie, there are no pipe destinations), then the flow of data will stop
       * until there is another consumer or {@link Minipass#resume} is explicitly
       * called.
       */
      removeAllListeners(ev) {
        const ret = super.removeAllListeners(ev);
        if (ev === "data" || ev === void 0) {
          this[DATALISTENERS] = 0;
          if (!this[DISCARDED] && !this[PIPES].length) {
            this[FLOWING] = false;
          }
        }
        return ret;
      }
      /**
       * true if the 'end' event has been emitted
       */
      get emittedEnd() {
        return this[EMITTED_END];
      }
      [MAYBE_EMIT_END]() {
        if (!this[EMITTING_END] && !this[EMITTED_END] && !this[DESTROYED] && this[BUFFER].length === 0 && this[EOF]) {
          this[EMITTING_END] = true;
          this.emit("end");
          this.emit("prefinish");
          this.emit("finish");
          if (this[CLOSED])
            this.emit("close");
          this[EMITTING_END] = false;
        }
      }
      /**
       * Mostly identical to `EventEmitter.emit`, with the following
       * behavior differences to prevent data loss and unnecessary hangs:
       *
       * If the stream has been destroyed, and the event is something other
       * than 'close' or 'error', then `false` is returned and no handlers
       * are called.
       *
       * If the event is 'end', and has already been emitted, then the event
       * is ignored. If the stream is in a paused or non-flowing state, then
       * the event will be deferred until data flow resumes. If the stream is
       * async, then handlers will be called on the next tick rather than
       * immediately.
       *
       * If the event is 'close', and 'end' has not yet been emitted, then
       * the event will be deferred until after 'end' is emitted.
       *
       * If the event is 'error', and an AbortSignal was provided for the stream,
       * and there are no listeners, then the event is ignored, matching the
       * behavior of node core streams in the presense of an AbortSignal.
       *
       * If the event is 'finish' or 'prefinish', then all listeners will be
       * removed after emitting the event, to prevent double-firing.
       */
      emit(ev, ...args) {
        const data = args[0];
        if (ev !== "error" && ev !== "close" && ev !== DESTROYED && this[DESTROYED]) {
          return false;
        } else if (ev === "data") {
          return !this[OBJECTMODE] && !data ? false : this[ASYNC] ? (defer(() => this[EMITDATA](data)), true) : this[EMITDATA](data);
        } else if (ev === "end") {
          return this[EMITEND]();
        } else if (ev === "close") {
          this[CLOSED] = true;
          if (!this[EMITTED_END] && !this[DESTROYED])
            return false;
          const ret2 = super.emit("close");
          this.removeAllListeners("close");
          return ret2;
        } else if (ev === "error") {
          this[EMITTED_ERROR] = data;
          super.emit(ERROR, data);
          const ret2 = !this[SIGNAL] || this.listeners("error").length ? super.emit("error", data) : false;
          this[MAYBE_EMIT_END]();
          return ret2;
        } else if (ev === "resume") {
          const ret2 = super.emit("resume");
          this[MAYBE_EMIT_END]();
          return ret2;
        } else if (ev === "finish" || ev === "prefinish") {
          const ret2 = super.emit(ev);
          this.removeAllListeners(ev);
          return ret2;
        }
        const ret = super.emit(ev, ...args);
        this[MAYBE_EMIT_END]();
        return ret;
      }
      [EMITDATA](data) {
        for (const p of this[PIPES]) {
          if (p.dest.write(data) === false)
            this.pause();
        }
        const ret = this[DISCARDED] ? false : super.emit("data", data);
        this[MAYBE_EMIT_END]();
        return ret;
      }
      [EMITEND]() {
        if (this[EMITTED_END])
          return false;
        this[EMITTED_END] = true;
        this.readable = false;
        return this[ASYNC] ? (defer(() => this[EMITEND2]()), true) : this[EMITEND2]();
      }
      [EMITEND2]() {
        if (this[DECODER]) {
          const data = this[DECODER].end();
          if (data) {
            for (const p of this[PIPES]) {
              p.dest.write(data);
            }
            if (!this[DISCARDED])
              super.emit("data", data);
          }
        }
        for (const p of this[PIPES]) {
          p.end();
        }
        const ret = super.emit("end");
        this.removeAllListeners("end");
        return ret;
      }
      /**
       * Return a Promise that resolves to an array of all emitted data once
       * the stream ends.
       */
      async collect() {
        const buf = Object.assign([], {
          dataLength: 0
        });
        if (!this[OBJECTMODE])
          buf.dataLength = 0;
        const p = this.promise();
        this.on("data", (c) => {
          buf.push(c);
          if (!this[OBJECTMODE])
            buf.dataLength += c.length;
        });
        await p;
        return buf;
      }
      /**
       * Return a Promise that resolves to the concatenation of all emitted data
       * once the stream ends.
       *
       * Not allowed on objectMode streams.
       */
      async concat() {
        if (this[OBJECTMODE]) {
          throw new Error("cannot concat in objectMode");
        }
        const buf = await this.collect();
        return this[ENCODING] ? buf.join("") : Buffer.concat(buf, buf.dataLength);
      }
      /**
       * Return a void Promise that resolves once the stream ends.
       */
      async promise() {
        return new Promise((resolve, reject) => {
          this.on(DESTROYED, () => reject(new Error("stream destroyed")));
          this.on("error", (er) => reject(er));
          this.on("end", () => resolve());
        });
      }
      /**
       * Asynchronous `for await of` iteration.
       *
       * This will continue emitting all chunks until the stream terminates.
       */
      [Symbol.asyncIterator]() {
        this[DISCARDED] = false;
        let stopped = false;
        const stop = async () => {
          this.pause();
          stopped = true;
          return { value: void 0, done: true };
        };
        const next = () => {
          if (stopped)
            return stop();
          const res = this.read();
          if (res !== null)
            return Promise.resolve({ done: false, value: res });
          if (this[EOF])
            return stop();
          let resolve;
          let reject;
          const onerr = (er) => {
            this.off("data", ondata);
            this.off("end", onend);
            this.off(DESTROYED, ondestroy);
            stop();
            reject(er);
          };
          const ondata = (value) => {
            this.off("error", onerr);
            this.off("end", onend);
            this.off(DESTROYED, ondestroy);
            this.pause();
            resolve({ value, done: !!this[EOF] });
          };
          const onend = () => {
            this.off("error", onerr);
            this.off("data", ondata);
            this.off(DESTROYED, ondestroy);
            stop();
            resolve({ done: true, value: void 0 });
          };
          const ondestroy = () => onerr(new Error("stream destroyed"));
          return new Promise((res2, rej) => {
            reject = rej;
            resolve = res2;
            this.once(DESTROYED, ondestroy);
            this.once("error", onerr);
            this.once("end", onend);
            this.once("data", ondata);
          });
        };
        return {
          next,
          throw: stop,
          return: stop,
          [Symbol.asyncIterator]() {
            return this;
          }
        };
      }
      /**
       * Synchronous `for of` iteration.
       *
       * The iteration will terminate when the internal buffer runs out, even
       * if the stream has not yet terminated.
       */
      [Symbol.iterator]() {
        this[DISCARDED] = false;
        let stopped = false;
        const stop = () => {
          this.pause();
          this.off(ERROR, stop);
          this.off(DESTROYED, stop);
          this.off("end", stop);
          stopped = true;
          return { done: true, value: void 0 };
        };
        const next = () => {
          if (stopped)
            return stop();
          const value = this.read();
          return value === null ? stop() : { done: false, value };
        };
        this.once("end", stop);
        this.once(ERROR, stop);
        this.once(DESTROYED, stop);
        return {
          next,
          throw: stop,
          return: stop,
          [Symbol.iterator]() {
            return this;
          }
        };
      }
      /**
       * Destroy a stream, preventing it from being used for any further purpose.
       *
       * If the stream has a `close()` method, then it will be called on
       * destruction.
       *
       * After destruction, any attempt to write data, read data, or emit most
       * events will be ignored.
       *
       * If an error argument is provided, then it will be emitted in an
       * 'error' event.
       */
      destroy(er) {
        if (this[DESTROYED]) {
          if (er)
            this.emit("error", er);
          else
            this.emit(DESTROYED);
          return this;
        }
        this[DESTROYED] = true;
        this[DISCARDED] = true;
        this[BUFFER].length = 0;
        this[BUFFERLENGTH] = 0;
        const wc = this;
        if (typeof wc.close === "function" && !this[CLOSED])
          wc.close();
        if (er)
          this.emit("error", er);
        else
          this.emit(DESTROYED);
        return this;
      }
      /**
       * Alias for {@link isStream}
       *
       * Former export location, maintained for backwards compatibility.
       *
       * @deprecated
       */
      static get isStream() {
        return exports.isStream;
      }
    };
    exports.Minipass = Minipass;
  }
});

// ../../../.local/share/pnpm/store/v10/links/ssri/12.0.0/30e17ca73d51ec754758071d9fb816b953026624d4ad1b6338a35f9adce3e623/node_modules/ssri/lib/index.js
var require_lib = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/ssri/12.0.0/30e17ca73d51ec754758071d9fb816b953026624d4ad1b6338a35f9adce3e623/node_modules/ssri/lib/index.js"(exports, module) {
    "use strict";
    var crypto2 = __require("crypto");
    var { Minipass } = require_commonjs();
    var SPEC_ALGORITHMS = ["sha512", "sha384", "sha256"];
    var DEFAULT_ALGORITHMS = ["sha512"];
    var BASE64_REGEX = /^[a-z0-9+/]+(?:=?=?)$/i;
    var SRI_REGEX = /^([a-z0-9]+)-([^?]+)([?\S*]*)$/;
    var STRICT_SRI_REGEX = /^([a-z0-9]+)-([A-Za-z0-9+/=]{44,88})(\?[\x21-\x7E]*)?$/;
    var VCHAR_REGEX = /^[\x21-\x7E]+$/;
    var getOptString = (options) => options?.length ? `?${options.join("?")}` : "";
    var IntegrityStream = class extends Minipass {
      #emittedIntegrity;
      #emittedSize;
      #emittedVerified;
      constructor(opts2) {
        super();
        this.size = 0;
        this.opts = opts2;
        this.#getOptions();
        if (opts2?.algorithms) {
          this.algorithms = [...opts2.algorithms];
        } else {
          this.algorithms = [...DEFAULT_ALGORITHMS];
        }
        if (this.algorithm !== null && !this.algorithms.includes(this.algorithm)) {
          this.algorithms.push(this.algorithm);
        }
        this.hashes = this.algorithms.map(crypto2.createHash);
      }
      #getOptions() {
        this.sri = this.opts?.integrity ? parse2(this.opts?.integrity, this.opts) : null;
        this.expectedSize = this.opts?.size;
        if (!this.sri) {
          this.algorithm = null;
        } else if (this.sri.isHash) {
          this.goodSri = true;
          this.algorithm = this.sri.algorithm;
        } else {
          this.goodSri = !this.sri.isEmpty();
          this.algorithm = this.sri.pickAlgorithm(this.opts);
        }
        this.digests = this.goodSri ? this.sri[this.algorithm] : null;
        this.optString = getOptString(this.opts?.options);
      }
      on(ev, handler) {
        if (ev === "size" && this.#emittedSize) {
          return handler(this.#emittedSize);
        }
        if (ev === "integrity" && this.#emittedIntegrity) {
          return handler(this.#emittedIntegrity);
        }
        if (ev === "verified" && this.#emittedVerified) {
          return handler(this.#emittedVerified);
        }
        return super.on(ev, handler);
      }
      emit(ev, data) {
        if (ev === "end") {
          this.#onEnd();
        }
        return super.emit(ev, data);
      }
      write(data) {
        this.size += data.length;
        this.hashes.forEach((h) => h.update(data));
        return super.write(data);
      }
      #onEnd() {
        if (!this.goodSri) {
          this.#getOptions();
        }
        const newSri = parse2(this.hashes.map((h, i) => {
          return `${this.algorithms[i]}-${h.digest("base64")}${this.optString}`;
        }).join(" "), this.opts);
        const match = this.goodSri && newSri.match(this.sri, this.opts);
        if (typeof this.expectedSize === "number" && this.size !== this.expectedSize) {
          const err = new Error(`stream size mismatch when checking ${this.sri}.
  Wanted: ${this.expectedSize}
  Found: ${this.size}`);
          err.code = "EBADSIZE";
          err.found = this.size;
          err.expected = this.expectedSize;
          err.sri = this.sri;
          this.emit("error", err);
        } else if (this.sri && !match) {
          const err = new Error(`${this.sri} integrity checksum failed when using ${this.algorithm}: wanted ${this.digests} but got ${newSri}. (${this.size} bytes)`);
          err.code = "EINTEGRITY";
          err.found = newSri;
          err.expected = this.digests;
          err.algorithm = this.algorithm;
          err.sri = this.sri;
          this.emit("error", err);
        } else {
          this.#emittedSize = this.size;
          this.emit("size", this.size);
          this.#emittedIntegrity = newSri;
          this.emit("integrity", newSri);
          if (match) {
            this.#emittedVerified = match;
            this.emit("verified", match);
          }
        }
      }
    };
    var Hash = class {
      get isHash() {
        return true;
      }
      constructor(hash, opts2) {
        const strict = opts2?.strict;
        this.source = hash.trim();
        this.digest = "";
        this.algorithm = "";
        this.options = [];
        const match = this.source.match(
          strict ? STRICT_SRI_REGEX : SRI_REGEX
        );
        if (!match) {
          return;
        }
        if (strict && !SPEC_ALGORITHMS.includes(match[1])) {
          return;
        }
        this.algorithm = match[1];
        this.digest = match[2];
        const rawOpts = match[3];
        if (rawOpts) {
          this.options = rawOpts.slice(1).split("?");
        }
      }
      hexDigest() {
        return this.digest && Buffer.from(this.digest, "base64").toString("hex");
      }
      toJSON() {
        return this.toString();
      }
      match(integrity, opts2) {
        const other = parse2(integrity, opts2);
        if (!other) {
          return false;
        }
        if (other.isIntegrity) {
          const algo = other.pickAlgorithm(opts2, [this.algorithm]);
          if (!algo) {
            return false;
          }
          const foundHash = other[algo].find((hash) => hash.digest === this.digest);
          if (foundHash) {
            return foundHash;
          }
          return false;
        }
        return other.digest === this.digest ? other : false;
      }
      toString(opts2) {
        if (opts2?.strict) {
          if (!// The spec has very restricted productions for algorithms.
          // https://www.w3.org/TR/CSP2/#source-list-syntax
          (SPEC_ALGORITHMS.includes(this.algorithm) && // Usually, if someone insists on using a "different" base64, we
          // leave it as-is, since there's multiple standards, and the
          // specified is not a URL-safe variant.
          // https://www.w3.org/TR/CSP2/#base64_value
          this.digest.match(BASE64_REGEX) && // Option syntax is strictly visual chars.
          // https://w3c.github.io/webappsec-subresource-integrity/#grammardef-option-expression
          // https://tools.ietf.org/html/rfc5234#appendix-B.1
          this.options.every((opt) => opt.match(VCHAR_REGEX)))) {
            return "";
          }
        }
        return `${this.algorithm}-${this.digest}${getOptString(this.options)}`;
      }
    };
    function integrityHashToString(toString, sep, opts2, hashes) {
      const toStringIsNotEmpty = toString !== "";
      let shouldAddFirstSep = false;
      let complement = "";
      const lastIndex = hashes.length - 1;
      for (let i = 0; i < lastIndex; i++) {
        const hashString = Hash.prototype.toString.call(hashes[i], opts2);
        if (hashString) {
          shouldAddFirstSep = true;
          complement += hashString;
          complement += sep;
        }
      }
      const finalHashString = Hash.prototype.toString.call(hashes[lastIndex], opts2);
      if (finalHashString) {
        shouldAddFirstSep = true;
        complement += finalHashString;
      }
      if (toStringIsNotEmpty && shouldAddFirstSep) {
        return toString + sep + complement;
      }
      return toString + complement;
    }
    var Integrity = class {
      get isIntegrity() {
        return true;
      }
      toJSON() {
        return this.toString();
      }
      isEmpty() {
        return Object.keys(this).length === 0;
      }
      toString(opts2) {
        let sep = opts2?.sep || " ";
        let toString = "";
        if (opts2?.strict) {
          sep = sep.replace(/\S+/g, " ");
          for (const hash of SPEC_ALGORITHMS) {
            if (this[hash]) {
              toString = integrityHashToString(toString, sep, opts2, this[hash]);
            }
          }
        } else {
          for (const hash of Object.keys(this)) {
            toString = integrityHashToString(toString, sep, opts2, this[hash]);
          }
        }
        return toString;
      }
      concat(integrity, opts2) {
        const other = typeof integrity === "string" ? integrity : stringify(integrity, opts2);
        return parse2(`${this.toString(opts2)} ${other}`, opts2);
      }
      hexDigest() {
        return parse2(this, { single: true }).hexDigest();
      }
      // add additional hashes to an integrity value, but prevent
      // *changing* an existing integrity hash.
      merge(integrity, opts2) {
        const other = parse2(integrity, opts2);
        for (const algo in other) {
          if (this[algo]) {
            if (!this[algo].find((hash) => other[algo].find((otherhash) => hash.digest === otherhash.digest))) {
              throw new Error("hashes do not match, cannot update integrity");
            }
          } else {
            this[algo] = other[algo];
          }
        }
      }
      match(integrity, opts2) {
        const other = parse2(integrity, opts2);
        if (!other) {
          return false;
        }
        const algo = other.pickAlgorithm(opts2, Object.keys(this));
        return !!algo && this[algo] && other[algo] && this[algo].find(
          (hash) => other[algo].find(
            (otherhash) => hash.digest === otherhash.digest
          )
        ) || false;
      }
      // Pick the highest priority algorithm present, optionally also limited to a
      // set of hashes found in another integrity.  When limiting it may return
      // nothing.
      pickAlgorithm(opts2, hashes) {
        const pickAlgorithm = opts2?.pickAlgorithm || getPrioritizedHash;
        const keys = Object.keys(this).filter((k) => {
          if (hashes?.length) {
            return hashes.includes(k);
          }
          return true;
        });
        if (keys.length) {
          return keys.reduce((acc, algo) => pickAlgorithm(acc, algo) || acc);
        }
        return null;
      }
    };
    module.exports.parse = parse2;
    function parse2(sri, opts2) {
      if (!sri) {
        return null;
      }
      if (typeof sri === "string") {
        return _parse(sri, opts2);
      } else if (sri.algorithm && sri.digest) {
        const fullSri = new Integrity();
        fullSri[sri.algorithm] = [sri];
        return _parse(stringify(fullSri, opts2), opts2);
      } else {
        return _parse(stringify(sri, opts2), opts2);
      }
    }
    function _parse(integrity, opts2) {
      if (opts2?.single) {
        return new Hash(integrity, opts2);
      }
      const hashes = integrity.trim().split(/\s+/).reduce((acc, string) => {
        const hash = new Hash(string, opts2);
        if (hash.algorithm && hash.digest) {
          const algo = hash.algorithm;
          if (!acc[algo]) {
            acc[algo] = [];
          }
          acc[algo].push(hash);
        }
        return acc;
      }, new Integrity());
      return hashes.isEmpty() ? null : hashes;
    }
    module.exports.stringify = stringify;
    function stringify(obj, opts2) {
      if (obj.algorithm && obj.digest) {
        return Hash.prototype.toString.call(obj, opts2);
      } else if (typeof obj === "string") {
        return stringify(parse2(obj, opts2), opts2);
      } else {
        return Integrity.prototype.toString.call(obj, opts2);
      }
    }
    module.exports.fromHex = fromHex;
    function fromHex(hexDigest, algorithm, opts2) {
      const optString = getOptString(opts2?.options);
      return parse2(
        `${algorithm}-${Buffer.from(hexDigest, "hex").toString("base64")}${optString}`,
        opts2
      );
    }
    module.exports.fromData = fromData;
    function fromData(data, opts2) {
      const algorithms = opts2?.algorithms || [...DEFAULT_ALGORITHMS];
      const optString = getOptString(opts2?.options);
      return algorithms.reduce((acc, algo) => {
        const digest = crypto2.createHash(algo).update(data).digest("base64");
        const hash = new Hash(
          `${algo}-${digest}${optString}`,
          opts2
        );
        if (hash.algorithm && hash.digest) {
          const hashAlgo = hash.algorithm;
          if (!acc[hashAlgo]) {
            acc[hashAlgo] = [];
          }
          acc[hashAlgo].push(hash);
        }
        return acc;
      }, new Integrity());
    }
    module.exports.fromStream = fromStream;
    function fromStream(stream, opts2) {
      const istream = integrityStream(opts2);
      return new Promise((resolve, reject) => {
        stream.pipe(istream);
        stream.on("error", reject);
        istream.on("error", reject);
        let sri;
        istream.on("integrity", (s) => {
          sri = s;
        });
        istream.on("end", () => resolve(sri));
        istream.resume();
      });
    }
    module.exports.checkData = checkData;
    function checkData(data, sri, opts2) {
      sri = parse2(sri, opts2);
      if (!sri || !Object.keys(sri).length) {
        if (opts2?.error) {
          throw Object.assign(
            new Error("No valid integrity hashes to check against"),
            {
              code: "EINTEGRITY"
            }
          );
        } else {
          return false;
        }
      }
      const algorithm = sri.pickAlgorithm(opts2);
      const digest = crypto2.createHash(algorithm).update(data).digest("base64");
      const newSri = parse2({ algorithm, digest });
      const match = newSri.match(sri, opts2);
      opts2 = opts2 || {};
      if (match || !opts2.error) {
        return match;
      } else if (typeof opts2.size === "number" && data.length !== opts2.size) {
        const err = new Error(`data size mismatch when checking ${sri}.
  Wanted: ${opts2.size}
  Found: ${data.length}`);
        err.code = "EBADSIZE";
        err.found = data.length;
        err.expected = opts2.size;
        err.sri = sri;
        throw err;
      } else {
        const err = new Error(`Integrity checksum failed when using ${algorithm}: Wanted ${sri}, but got ${newSri}. (${data.length} bytes)`);
        err.code = "EINTEGRITY";
        err.found = newSri;
        err.expected = sri;
        err.algorithm = algorithm;
        err.sri = sri;
        throw err;
      }
    }
    module.exports.checkStream = checkStream;
    function checkStream(stream, sri, opts2) {
      opts2 = opts2 || /* @__PURE__ */ Object.create(null);
      opts2.integrity = sri;
      sri = parse2(sri, opts2);
      if (!sri || !Object.keys(sri).length) {
        return Promise.reject(Object.assign(
          new Error("No valid integrity hashes to check against"),
          {
            code: "EINTEGRITY"
          }
        ));
      }
      const checker = integrityStream(opts2);
      return new Promise((resolve, reject) => {
        stream.pipe(checker);
        stream.on("error", reject);
        checker.on("error", reject);
        let verified;
        checker.on("verified", (s) => {
          verified = s;
        });
        checker.on("end", () => resolve(verified));
        checker.resume();
      });
    }
    module.exports.integrityStream = integrityStream;
    function integrityStream(opts2 = /* @__PURE__ */ Object.create(null)) {
      return new IntegrityStream(opts2);
    }
    module.exports.create = createIntegrity;
    function createIntegrity(opts2) {
      const algorithms = opts2?.algorithms || [...DEFAULT_ALGORITHMS];
      const optString = getOptString(opts2?.options);
      const hashes = algorithms.map(crypto2.createHash);
      return {
        update: function(chunk, enc) {
          hashes.forEach((h) => h.update(chunk, enc));
          return this;
        },
        digest: function() {
          const integrity = algorithms.reduce((acc, algo) => {
            const digest = hashes.shift().digest("base64");
            const hash = new Hash(
              `${algo}-${digest}${optString}`,
              opts2
            );
            if (hash.algorithm && hash.digest) {
              const hashAlgo = hash.algorithm;
              if (!acc[hashAlgo]) {
                acc[hashAlgo] = [];
              }
              acc[hashAlgo].push(hash);
            }
            return acc;
          }, new Integrity());
          return integrity;
        }
      };
    }
    var NODE_HASHES = crypto2.getHashes();
    var DEFAULT_PRIORITY = [
      "md5",
      "whirlpool",
      "sha1",
      "sha224",
      "sha256",
      "sha384",
      "sha512",
      // TODO - it's unclear _which_ of these Node will actually use as its name
      //        for the algorithm, so we guesswork it based on the OpenSSL names.
      "sha3",
      "sha3-256",
      "sha3-384",
      "sha3-512",
      "sha3_256",
      "sha3_384",
      "sha3_512"
    ].filter((algo) => NODE_HASHES.includes(algo));
    function getPrioritizedHash(algo1, algo2) {
      return DEFAULT_PRIORITY.indexOf(algo1.toLowerCase()) >= DEFAULT_PRIORITY.indexOf(algo2.toLowerCase()) ? algo1 : algo2;
    }
  }
});

// ../../../.local/share/pnpm/store/v10/links/is-gzip/2.0.0/111e088164d6a6f662f7852ba097a6c8afd6ed11cf68c0e30fa542364bc3893b/node_modules/is-gzip/index.js
var require_is_gzip = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/is-gzip/2.0.0/111e088164d6a6f662f7852ba097a6c8afd6ed11cf68c0e30fa542364bc3893b/node_modules/is-gzip/index.js"(exports, module) {
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
    var fs9 = __require("fs");
    module.exports = async (p) => {
      try {
        await fs9.promises.rm(p, { recursive: true, force: true, maxRetries: 3 });
      } catch (err) {
        if (err.code === "ENOENT") return;
        throw err;
      }
    };
    module.exports.sync = (p) => {
      try {
        fs9.rmSync(p, { recursive: true, force: true, maxRetries: 3 });
      } catch (err) {
        if (err.code === "ENOENT") return;
        throw err;
      }
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/universalify/2.0.1/c48ae9e17bc5bbd3fc1b38e794691240eb344463ac9f569f25561f0caa9617d5/node_modules/universalify/index.js
var require_universalify = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/universalify/2.0.1/c48ae9e17bc5bbd3fc1b38e794691240eb344463ac9f569f25561f0caa9617d5/node_modules/universalify/index.js"(exports) {
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

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/fs/index.js
var require_fs = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/fs/index.js"(exports) {
    "use strict";
    var u = require_universalify().fromCallback;
    var fs9 = require_graceful_fs();
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
      return typeof fs9[key] === "function";
    });
    Object.assign(exports, fs9);
    api.forEach((method) => {
      exports[method] = u(fs9[method]);
    });
    exports.exists = function(filename, callback) {
      if (typeof callback === "function") {
        return fs9.exists(filename, callback);
      }
      return new Promise((resolve) => {
        return fs9.exists(filename, resolve);
      });
    };
    exports.read = function(fd, buffer, offset, length, position, callback) {
      if (typeof callback === "function") {
        return fs9.read(fd, buffer, offset, length, position, callback);
      }
      return new Promise((resolve, reject) => {
        fs9.read(fd, buffer, offset, length, position, (err, bytesRead, buffer2) => {
          if (err) return reject(err);
          resolve({ bytesRead, buffer: buffer2 });
        });
      });
    };
    exports.write = function(fd, buffer, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs9.write(fd, buffer, ...args);
      }
      return new Promise((resolve, reject) => {
        fs9.write(fd, buffer, ...args, (err, bytesWritten, buffer2) => {
          if (err) return reject(err);
          resolve({ bytesWritten, buffer: buffer2 });
        });
      });
    };
    exports.readv = function(fd, buffers, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs9.readv(fd, buffers, ...args);
      }
      return new Promise((resolve, reject) => {
        fs9.readv(fd, buffers, ...args, (err, bytesRead, buffers2) => {
          if (err) return reject(err);
          resolve({ bytesRead, buffers: buffers2 });
        });
      });
    };
    exports.writev = function(fd, buffers, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs9.writev(fd, buffers, ...args);
      }
      return new Promise((resolve, reject) => {
        fs9.writev(fd, buffers, ...args, (err, bytesWritten, buffers2) => {
          if (err) return reject(err);
          resolve({ bytesWritten, buffers: buffers2 });
        });
      });
    };
    if (typeof fs9.realpath.native === "function") {
      exports.realpath.native = u(fs9.realpath.native);
    } else {
      process.emitWarning(
        "fs.realpath.native is not a function. Is fs being monkey-patched?",
        "Warning",
        "fs-extra-WARN0003"
      );
    }
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/mkdirs/utils.js
var require_utils = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/mkdirs/utils.js"(exports, module) {
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

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/mkdirs/make-dir.js
var require_make_dir = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/mkdirs/make-dir.js"(exports, module) {
    "use strict";
    var fs9 = require_fs();
    var { checkPath } = require_utils();
    var getMode = (options) => {
      const defaults = { mode: 511 };
      if (typeof options === "number") return options;
      return { ...defaults, ...options }.mode;
    };
    module.exports.makeDir = async (dir, options) => {
      checkPath(dir);
      return fs9.mkdir(dir, {
        mode: getMode(options),
        recursive: true
      });
    };
    module.exports.makeDirSync = (dir, options) => {
      checkPath(dir);
      return fs9.mkdirSync(dir, {
        mode: getMode(options),
        recursive: true
      });
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/mkdirs/index.js
var require_mkdirs = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/mkdirs/index.js"(exports, module) {
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

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/path-exists/index.js
var require_path_exists = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/path-exists/index.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs9 = require_fs();
    function pathExists(path12) {
      return fs9.access(path12).then(() => true).catch(() => false);
    }
    module.exports = {
      pathExists: u(pathExists),
      pathExistsSync: fs9.existsSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/util/utimes.js
var require_utimes = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/util/utimes.js"(exports, module) {
    "use strict";
    var fs9 = require_fs();
    var u = require_universalify().fromPromise;
    async function utimesMillis(path12, atime, mtime) {
      const fd = await fs9.open(path12, "r+");
      let closeErr = null;
      try {
        await fs9.futimes(fd, atime, mtime);
      } finally {
        try {
          await fs9.close(fd);
        } catch (e) {
          closeErr = e;
        }
      }
      if (closeErr) {
        throw closeErr;
      }
    }
    function utimesMillisSync(path12, atime, mtime) {
      const fd = fs9.openSync(path12, "r+");
      fs9.futimesSync(fd, atime, mtime);
      return fs9.closeSync(fd);
    }
    module.exports = {
      utimesMillis: u(utimesMillis),
      utimesMillisSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/util/stat.js
var require_stat = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/util/stat.js"(exports, module) {
    "use strict";
    var fs9 = require_fs();
    var path12 = __require("path");
    var u = require_universalify().fromPromise;
    function getStats(src, dest, opts2) {
      const statFunc = opts2.dereference ? (file) => fs9.stat(file, { bigint: true }) : (file) => fs9.lstat(file, { bigint: true });
      return Promise.all([
        statFunc(src),
        statFunc(dest).catch((err) => {
          if (err.code === "ENOENT") return null;
          throw err;
        })
      ]).then(([srcStat, destStat]) => ({ srcStat, destStat }));
    }
    function getStatsSync(src, dest, opts2) {
      let destStat;
      const statFunc = opts2.dereference ? (file) => fs9.statSync(file, { bigint: true }) : (file) => fs9.lstatSync(file, { bigint: true });
      const srcStat = statFunc(src);
      try {
        destStat = statFunc(dest);
      } catch (err) {
        if (err.code === "ENOENT") return { srcStat, destStat: null };
        throw err;
      }
      return { srcStat, destStat };
    }
    async function checkPaths(src, dest, funcName, opts2) {
      const { srcStat, destStat } = await getStats(src, dest, opts2);
      if (destStat) {
        if (areIdentical(srcStat, destStat)) {
          const srcBaseName = path12.basename(src);
          const destBaseName = path12.basename(dest);
          if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
            return { srcStat, destStat, isChangingCase: true };
          }
          throw new Error("Source and destination must not be the same.");
        }
        if (srcStat.isDirectory() && !destStat.isDirectory()) {
          throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
        }
        if (!srcStat.isDirectory() && destStat.isDirectory()) {
          throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`);
        }
      }
      if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return { srcStat, destStat };
    }
    function checkPathsSync(src, dest, funcName, opts2) {
      const { srcStat, destStat } = getStatsSync(src, dest, opts2);
      if (destStat) {
        if (areIdentical(srcStat, destStat)) {
          const srcBaseName = path12.basename(src);
          const destBaseName = path12.basename(dest);
          if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
            return { srcStat, destStat, isChangingCase: true };
          }
          throw new Error("Source and destination must not be the same.");
        }
        if (srcStat.isDirectory() && !destStat.isDirectory()) {
          throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
        }
        if (!srcStat.isDirectory() && destStat.isDirectory()) {
          throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`);
        }
      }
      if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return { srcStat, destStat };
    }
    async function checkParentPaths(src, srcStat, dest, funcName) {
      const srcParent = path12.resolve(path12.dirname(src));
      const destParent = path12.resolve(path12.dirname(dest));
      if (destParent === srcParent || destParent === path12.parse(destParent).root) return;
      let destStat;
      try {
        destStat = await fs9.stat(destParent, { bigint: true });
      } catch (err) {
        if (err.code === "ENOENT") return;
        throw err;
      }
      if (areIdentical(srcStat, destStat)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return checkParentPaths(src, srcStat, destParent, funcName);
    }
    function checkParentPathsSync(src, srcStat, dest, funcName) {
      const srcParent = path12.resolve(path12.dirname(src));
      const destParent = path12.resolve(path12.dirname(dest));
      if (destParent === srcParent || destParent === path12.parse(destParent).root) return;
      let destStat;
      try {
        destStat = fs9.statSync(destParent, { bigint: true });
      } catch (err) {
        if (err.code === "ENOENT") return;
        throw err;
      }
      if (areIdentical(srcStat, destStat)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return checkParentPathsSync(src, srcStat, destParent, funcName);
    }
    function areIdentical(srcStat, destStat) {
      return destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev;
    }
    function isSrcSubdir(src, dest) {
      const srcArr = path12.resolve(src).split(path12.sep).filter((i) => i);
      const destArr = path12.resolve(dest).split(path12.sep).filter((i) => i);
      return srcArr.every((cur, i) => destArr[i] === cur);
    }
    function errMsg(src, dest, funcName) {
      return `Cannot ${funcName} '${src}' to a subdirectory of itself, '${dest}'.`;
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

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/copy/copy.js
var require_copy = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/copy/copy.js"(exports, module) {
    "use strict";
    var fs9 = require_fs();
    var path12 = __require("path");
    var { mkdirs } = require_mkdirs();
    var { pathExists } = require_path_exists();
    var { utimesMillis } = require_utimes();
    var stat = require_stat();
    async function copy(src, dest, opts2 = {}) {
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
      const { srcStat, destStat } = await stat.checkPaths(src, dest, "copy", opts2);
      await stat.checkParentPaths(src, srcStat, dest, "copy");
      const include = await runFilter(src, dest, opts2);
      if (!include) return;
      const destParent = path12.dirname(dest);
      const dirExists = await pathExists(destParent);
      if (!dirExists) {
        await mkdirs(destParent);
      }
      await getStatsAndPerformCopy(destStat, src, dest, opts2);
    }
    async function runFilter(src, dest, opts2) {
      if (!opts2.filter) return true;
      return opts2.filter(src, dest);
    }
    async function getStatsAndPerformCopy(destStat, src, dest, opts2) {
      const statFn = opts2.dereference ? fs9.stat : fs9.lstat;
      const srcStat = await statFn(src);
      if (srcStat.isDirectory()) return onDir(srcStat, destStat, src, dest, opts2);
      if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile(srcStat, destStat, src, dest, opts2);
      if (srcStat.isSymbolicLink()) return onLink(destStat, src, dest, opts2);
      if (srcStat.isSocket()) throw new Error(`Cannot copy a socket file: ${src}`);
      if (srcStat.isFIFO()) throw new Error(`Cannot copy a FIFO pipe: ${src}`);
      throw new Error(`Unknown file: ${src}`);
    }
    async function onFile(srcStat, destStat, src, dest, opts2) {
      if (!destStat) return copyFile(srcStat, src, dest, opts2);
      if (opts2.overwrite) {
        await fs9.unlink(dest);
        return copyFile(srcStat, src, dest, opts2);
      }
      if (opts2.errorOnExist) {
        throw new Error(`'${dest}' already exists`);
      }
    }
    async function copyFile(srcStat, src, dest, opts2) {
      await fs9.copyFile(src, dest);
      if (opts2.preserveTimestamps) {
        if (fileIsNotWritable(srcStat.mode)) {
          await makeFileWritable(dest, srcStat.mode);
        }
        const updatedSrcStat = await fs9.stat(src);
        await utimesMillis(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
      }
      return fs9.chmod(dest, srcStat.mode);
    }
    function fileIsNotWritable(srcMode) {
      return (srcMode & 128) === 0;
    }
    function makeFileWritable(dest, srcMode) {
      return fs9.chmod(dest, srcMode | 128);
    }
    async function onDir(srcStat, destStat, src, dest, opts2) {
      if (!destStat) {
        await fs9.mkdir(dest);
      }
      const promises = [];
      for await (const item of await fs9.opendir(src)) {
        const srcItem = path12.join(src, item.name);
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
        await fs9.chmod(dest, srcStat.mode);
      }
    }
    async function onLink(destStat, src, dest, opts2) {
      let resolvedSrc = await fs9.readlink(src);
      if (opts2.dereference) {
        resolvedSrc = path12.resolve(process.cwd(), resolvedSrc);
      }
      if (!destStat) {
        return fs9.symlink(resolvedSrc, dest);
      }
      let resolvedDest = null;
      try {
        resolvedDest = await fs9.readlink(dest);
      } catch (e) {
        if (e.code === "EINVAL" || e.code === "UNKNOWN") return fs9.symlink(resolvedSrc, dest);
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
      await fs9.unlink(dest);
      return fs9.symlink(resolvedSrc, dest);
    }
    module.exports = copy;
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/copy/copy-sync.js
var require_copy_sync = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/copy/copy-sync.js"(exports, module) {
    "use strict";
    var fs9 = require_graceful_fs();
    var path12 = __require("path");
    var mkdirsSync = require_mkdirs().mkdirsSync;
    var utimesMillisSync = require_utimes().utimesMillisSync;
    var stat = require_stat();
    function copySync(src, dest, opts2) {
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
      const { srcStat, destStat } = stat.checkPathsSync(src, dest, "copy", opts2);
      stat.checkParentPathsSync(src, srcStat, dest, "copy");
      if (opts2.filter && !opts2.filter(src, dest)) return;
      const destParent = path12.dirname(dest);
      if (!fs9.existsSync(destParent)) mkdirsSync(destParent);
      return getStats(destStat, src, dest, opts2);
    }
    function getStats(destStat, src, dest, opts2) {
      const statSync = opts2.dereference ? fs9.statSync : fs9.lstatSync;
      const srcStat = statSync(src);
      if (srcStat.isDirectory()) return onDir(srcStat, destStat, src, dest, opts2);
      else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile(srcStat, destStat, src, dest, opts2);
      else if (srcStat.isSymbolicLink()) return onLink(destStat, src, dest, opts2);
      else if (srcStat.isSocket()) throw new Error(`Cannot copy a socket file: ${src}`);
      else if (srcStat.isFIFO()) throw new Error(`Cannot copy a FIFO pipe: ${src}`);
      throw new Error(`Unknown file: ${src}`);
    }
    function onFile(srcStat, destStat, src, dest, opts2) {
      if (!destStat) return copyFile(srcStat, src, dest, opts2);
      return mayCopyFile(srcStat, src, dest, opts2);
    }
    function mayCopyFile(srcStat, src, dest, opts2) {
      if (opts2.overwrite) {
        fs9.unlinkSync(dest);
        return copyFile(srcStat, src, dest, opts2);
      } else if (opts2.errorOnExist) {
        throw new Error(`'${dest}' already exists`);
      }
    }
    function copyFile(srcStat, src, dest, opts2) {
      fs9.copyFileSync(src, dest);
      if (opts2.preserveTimestamps) handleTimestamps(srcStat.mode, src, dest);
      return setDestMode(dest, srcStat.mode);
    }
    function handleTimestamps(srcMode, src, dest) {
      if (fileIsNotWritable(srcMode)) makeFileWritable(dest, srcMode);
      return setDestTimestamps(src, dest);
    }
    function fileIsNotWritable(srcMode) {
      return (srcMode & 128) === 0;
    }
    function makeFileWritable(dest, srcMode) {
      return setDestMode(dest, srcMode | 128);
    }
    function setDestMode(dest, srcMode) {
      return fs9.chmodSync(dest, srcMode);
    }
    function setDestTimestamps(src, dest) {
      const updatedSrcStat = fs9.statSync(src);
      return utimesMillisSync(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
    }
    function onDir(srcStat, destStat, src, dest, opts2) {
      if (!destStat) return mkDirAndCopy(srcStat.mode, src, dest, opts2);
      return copyDir(src, dest, opts2);
    }
    function mkDirAndCopy(srcMode, src, dest, opts2) {
      fs9.mkdirSync(dest);
      copyDir(src, dest, opts2);
      return setDestMode(dest, srcMode);
    }
    function copyDir(src, dest, opts2) {
      const dir = fs9.opendirSync(src);
      try {
        let dirent;
        while ((dirent = dir.readSync()) !== null) {
          copyDirItem(dirent.name, src, dest, opts2);
        }
      } finally {
        dir.closeSync();
      }
    }
    function copyDirItem(item, src, dest, opts2) {
      const srcItem = path12.join(src, item);
      const destItem = path12.join(dest, item);
      if (opts2.filter && !opts2.filter(srcItem, destItem)) return;
      const { destStat } = stat.checkPathsSync(srcItem, destItem, "copy", opts2);
      return getStats(destStat, srcItem, destItem, opts2);
    }
    function onLink(destStat, src, dest, opts2) {
      let resolvedSrc = fs9.readlinkSync(src);
      if (opts2.dereference) {
        resolvedSrc = path12.resolve(process.cwd(), resolvedSrc);
      }
      if (!destStat) {
        return fs9.symlinkSync(resolvedSrc, dest);
      } else {
        let resolvedDest;
        try {
          resolvedDest = fs9.readlinkSync(dest);
        } catch (err) {
          if (err.code === "EINVAL" || err.code === "UNKNOWN") return fs9.symlinkSync(resolvedSrc, dest);
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
      fs9.unlinkSync(dest);
      return fs9.symlinkSync(resolvedSrc, dest);
    }
    module.exports = copySync;
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/copy/index.js
var require_copy2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/copy/index.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    module.exports = {
      copy: u(require_copy()),
      copySync: require_copy_sync()
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/remove/index.js
var require_remove = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/remove/index.js"(exports, module) {
    "use strict";
    var fs9 = require_graceful_fs();
    var u = require_universalify().fromCallback;
    function remove(path12, callback) {
      fs9.rm(path12, { recursive: true, force: true }, callback);
    }
    function removeSync(path12) {
      fs9.rmSync(path12, { recursive: true, force: true });
    }
    module.exports = {
      remove: u(remove),
      removeSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/empty/index.js
var require_empty = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/empty/index.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs9 = require_fs();
    var path12 = __require("path");
    var mkdir = require_mkdirs();
    var remove = require_remove();
    var emptyDir = u(async function emptyDir2(dir) {
      let items;
      try {
        items = await fs9.readdir(dir);
      } catch {
        return mkdir.mkdirs(dir);
      }
      return Promise.all(items.map((item) => remove.remove(path12.join(dir, item))));
    });
    function emptyDirSync(dir) {
      let items;
      try {
        items = fs9.readdirSync(dir);
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

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/ensure/file.js
var require_file = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/ensure/file.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    var path12 = __require("path");
    var fs9 = require_fs();
    var mkdir = require_mkdirs();
    async function createFile(file) {
      let stats;
      try {
        stats = await fs9.stat(file);
      } catch {
      }
      if (stats && stats.isFile()) return;
      const dir = path12.dirname(file);
      let dirStats = null;
      try {
        dirStats = await fs9.stat(dir);
      } catch (err) {
        if (err.code === "ENOENT") {
          await mkdir.mkdirs(dir);
          await fs9.writeFile(file, "");
          return;
        } else {
          throw err;
        }
      }
      if (dirStats.isDirectory()) {
        await fs9.writeFile(file, "");
      } else {
        await fs9.readdir(dir);
      }
    }
    function createFileSync(file) {
      let stats;
      try {
        stats = fs9.statSync(file);
      } catch {
      }
      if (stats && stats.isFile()) return;
      const dir = path12.dirname(file);
      try {
        if (!fs9.statSync(dir).isDirectory()) {
          fs9.readdirSync(dir);
        }
      } catch (err) {
        if (err && err.code === "ENOENT") mkdir.mkdirsSync(dir);
        else throw err;
      }
      fs9.writeFileSync(file, "");
    }
    module.exports = {
      createFile: u(createFile),
      createFileSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/ensure/link.js
var require_link = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/ensure/link.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    var path12 = __require("path");
    var fs9 = require_fs();
    var mkdir = require_mkdirs();
    var { pathExists } = require_path_exists();
    var { areIdentical } = require_stat();
    async function createLink(srcpath, dstpath) {
      let dstStat;
      try {
        dstStat = await fs9.lstat(dstpath);
      } catch {
      }
      let srcStat;
      try {
        srcStat = await fs9.lstat(srcpath);
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
      await fs9.link(srcpath, dstpath);
    }
    function createLinkSync(srcpath, dstpath) {
      let dstStat;
      try {
        dstStat = fs9.lstatSync(dstpath);
      } catch {
      }
      try {
        const srcStat = fs9.lstatSync(srcpath);
        if (dstStat && areIdentical(srcStat, dstStat)) return;
      } catch (err) {
        err.message = err.message.replace("lstat", "ensureLink");
        throw err;
      }
      const dir = path12.dirname(dstpath);
      const dirExists = fs9.existsSync(dir);
      if (dirExists) return fs9.linkSync(srcpath, dstpath);
      mkdir.mkdirsSync(dir);
      return fs9.linkSync(srcpath, dstpath);
    }
    module.exports = {
      createLink: u(createLink),
      createLinkSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/ensure/symlink-paths.js
var require_symlink_paths = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/ensure/symlink-paths.js"(exports, module) {
    "use strict";
    var path12 = __require("path");
    var fs9 = require_fs();
    var { pathExists } = require_path_exists();
    var u = require_universalify().fromPromise;
    async function symlinkPaths(srcpath, dstpath) {
      if (path12.isAbsolute(srcpath)) {
        try {
          await fs9.lstat(srcpath);
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
        await fs9.lstat(srcpath);
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
        const exists2 = fs9.existsSync(srcpath);
        if (!exists2) throw new Error("absolute srcpath does not exist");
        return {
          toCwd: srcpath,
          toDst: srcpath
        };
      }
      const dstdir = path12.dirname(dstpath);
      const relativeToDst = path12.join(dstdir, srcpath);
      const exists = fs9.existsSync(relativeToDst);
      if (exists) {
        return {
          toCwd: relativeToDst,
          toDst: srcpath
        };
      }
      const srcExists = fs9.existsSync(srcpath);
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

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/ensure/symlink-type.js
var require_symlink_type = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/ensure/symlink-type.js"(exports, module) {
    "use strict";
    var fs9 = require_fs();
    var u = require_universalify().fromPromise;
    async function symlinkType(srcpath, type) {
      if (type) return type;
      let stats;
      try {
        stats = await fs9.lstat(srcpath);
      } catch {
        return "file";
      }
      return stats && stats.isDirectory() ? "dir" : "file";
    }
    function symlinkTypeSync(srcpath, type) {
      if (type) return type;
      let stats;
      try {
        stats = fs9.lstatSync(srcpath);
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

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/ensure/symlink.js
var require_symlink = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/ensure/symlink.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    var path12 = __require("path");
    var fs9 = require_fs();
    var { mkdirs, mkdirsSync } = require_mkdirs();
    var { symlinkPaths, symlinkPathsSync } = require_symlink_paths();
    var { symlinkType, symlinkTypeSync } = require_symlink_type();
    var { pathExists } = require_path_exists();
    var { areIdentical } = require_stat();
    async function createSymlink(srcpath, dstpath, type) {
      let stats;
      try {
        stats = await fs9.lstat(dstpath);
      } catch {
      }
      if (stats && stats.isSymbolicLink()) {
        const [srcStat, dstStat] = await Promise.all([
          fs9.stat(srcpath),
          fs9.stat(dstpath)
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
      return fs9.symlink(srcpath, dstpath, toType);
    }
    function createSymlinkSync(srcpath, dstpath, type) {
      let stats;
      try {
        stats = fs9.lstatSync(dstpath);
      } catch {
      }
      if (stats && stats.isSymbolicLink()) {
        const srcStat = fs9.statSync(srcpath);
        const dstStat = fs9.statSync(dstpath);
        if (areIdentical(srcStat, dstStat)) return;
      }
      const relative = symlinkPathsSync(srcpath, dstpath);
      srcpath = relative.toDst;
      type = symlinkTypeSync(relative.toCwd, type);
      const dir = path12.dirname(dstpath);
      const exists = fs9.existsSync(dir);
      if (exists) return fs9.symlinkSync(srcpath, dstpath, type);
      mkdirsSync(dir);
      return fs9.symlinkSync(srcpath, dstpath, type);
    }
    module.exports = {
      createSymlink: u(createSymlink),
      createSymlinkSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/ensure/index.js
var require_ensure = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/ensure/index.js"(exports, module) {
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

// ../../../.local/share/pnpm/store/v10/links/jsonfile/6.2.0/e6b8ccd5b437f8893b1bfc876c1423b2c0763c4a691eeaafc7d88b09b03f6869/node_modules/jsonfile/utils.js
var require_utils2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/jsonfile/6.2.0/e6b8ccd5b437f8893b1bfc876c1423b2c0763c4a691eeaafc7d88b09b03f6869/node_modules/jsonfile/utils.js"(exports, module) {
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

// ../../../.local/share/pnpm/store/v10/links/jsonfile/6.2.0/e6b8ccd5b437f8893b1bfc876c1423b2c0763c4a691eeaafc7d88b09b03f6869/node_modules/jsonfile/index.js
var require_jsonfile = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/jsonfile/6.2.0/e6b8ccd5b437f8893b1bfc876c1423b2c0763c4a691eeaafc7d88b09b03f6869/node_modules/jsonfile/index.js"(exports, module) {
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
      const fs9 = options.fs || _fs;
      const shouldThrow = "throws" in options ? options.throws : true;
      let data = await universalify.fromCallback(fs9.readFile)(file, options);
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
      const fs9 = options.fs || _fs;
      const shouldThrow = "throws" in options ? options.throws : true;
      try {
        let content = fs9.readFileSync(file, options);
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
      const fs9 = options.fs || _fs;
      const str = stringify(obj, options);
      await universalify.fromCallback(fs9.writeFile)(file, str, options);
    }
    var writeFile2 = universalify.fromPromise(_writeFile);
    function writeFileSync(file, obj, options = {}) {
      const fs9 = options.fs || _fs;
      const str = stringify(obj, options);
      return fs9.writeFileSync(file, str, options);
    }
    module.exports = {
      readFile,
      readFileSync,
      writeFile: writeFile2,
      writeFileSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/json/jsonfile.js
var require_jsonfile2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/json/jsonfile.js"(exports, module) {
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

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/output-file/index.js
var require_output_file = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/output-file/index.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs9 = require_fs();
    var path12 = __require("path");
    var mkdir = require_mkdirs();
    var pathExists = require_path_exists().pathExists;
    async function outputFile(file, data, encoding = "utf-8") {
      const dir = path12.dirname(file);
      if (!await pathExists(dir)) {
        await mkdir.mkdirs(dir);
      }
      return fs9.writeFile(file, data, encoding);
    }
    function outputFileSync(file, ...args) {
      const dir = path12.dirname(file);
      if (!fs9.existsSync(dir)) {
        mkdir.mkdirsSync(dir);
      }
      fs9.writeFileSync(file, ...args);
    }
    module.exports = {
      outputFile: u(outputFile),
      outputFileSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/json/output-json.js
var require_output_json = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/json/output-json.js"(exports, module) {
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

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/json/output-json-sync.js
var require_output_json_sync = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/json/output-json-sync.js"(exports, module) {
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

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/json/index.js
var require_json = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/json/index.js"(exports, module) {
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

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/move/move.js
var require_move = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/move/move.js"(exports, module) {
    "use strict";
    var fs9 = require_fs();
    var path12 = __require("path");
    var { copy } = require_copy2();
    var { remove } = require_remove();
    var { mkdirp } = require_mkdirs();
    var { pathExists } = require_path_exists();
    var stat = require_stat();
    async function move(src, dest, opts2 = {}) {
      const overwrite = opts2.overwrite || opts2.clobber || false;
      const { srcStat, isChangingCase = false } = await stat.checkPaths(src, dest, "move", opts2);
      await stat.checkParentPaths(src, srcStat, dest, "move");
      const destParent = path12.dirname(dest);
      const parsedParentPath = path12.parse(destParent);
      if (parsedParentPath.root !== destParent) {
        await mkdirp(destParent);
      }
      return doRename(src, dest, overwrite, isChangingCase);
    }
    async function doRename(src, dest, overwrite, isChangingCase) {
      if (!isChangingCase) {
        if (overwrite) {
          await remove(dest);
        } else if (await pathExists(dest)) {
          throw new Error("dest already exists.");
        }
      }
      try {
        await fs9.rename(src, dest);
      } catch (err) {
        if (err.code !== "EXDEV") {
          throw err;
        }
        await moveAcrossDevice(src, dest, overwrite);
      }
    }
    async function moveAcrossDevice(src, dest, overwrite) {
      const opts2 = {
        overwrite,
        errorOnExist: true,
        preserveTimestamps: true
      };
      await copy(src, dest, opts2);
      return remove(src);
    }
    module.exports = move;
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/move/move-sync.js
var require_move_sync = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/move/move-sync.js"(exports, module) {
    "use strict";
    var fs9 = require_graceful_fs();
    var path12 = __require("path");
    var copySync = require_copy2().copySync;
    var removeSync = require_remove().removeSync;
    var mkdirpSync = require_mkdirs().mkdirpSync;
    var stat = require_stat();
    function moveSync(src, dest, opts2) {
      opts2 = opts2 || {};
      const overwrite = opts2.overwrite || opts2.clobber || false;
      const { srcStat, isChangingCase = false } = stat.checkPathsSync(src, dest, "move", opts2);
      stat.checkParentPathsSync(src, srcStat, dest, "move");
      if (!isParentRoot(dest)) mkdirpSync(path12.dirname(dest));
      return doRename(src, dest, overwrite, isChangingCase);
    }
    function isParentRoot(dest) {
      const parent = path12.dirname(dest);
      const parsedPath = path12.parse(parent);
      return parsedPath.root === parent;
    }
    function doRename(src, dest, overwrite, isChangingCase) {
      if (isChangingCase) return rename(src, dest, overwrite);
      if (overwrite) {
        removeSync(dest);
        return rename(src, dest, overwrite);
      }
      if (fs9.existsSync(dest)) throw new Error("dest already exists.");
      return rename(src, dest, overwrite);
    }
    function rename(src, dest, overwrite) {
      try {
        fs9.renameSync(src, dest);
      } catch (err) {
        if (err.code !== "EXDEV") throw err;
        return moveAcrossDevice(src, dest, overwrite);
      }
    }
    function moveAcrossDevice(src, dest, overwrite) {
      const opts2 = {
        overwrite,
        errorOnExist: true,
        preserveTimestamps: true
      };
      copySync(src, dest, opts2);
      return removeSync(src);
    }
    module.exports = moveSync;
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/move/index.js
var require_move2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/move/index.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    module.exports = {
      move: u(require_move()),
      moveSync: require_move_sync()
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/index.js
var require_lib2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.0/67e111ea7c55ee40a4c0cf67fbccba39df629dbd99792511f1aa46c3ee393258/node_modules/fs-extra/lib/index.js"(exports, module) {
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

// ../../../.local/share/pnpm/store/v10/links/rename-overwrite/6.0.2/5f3ac1c6c9da1d876f3bd14170eff997aecd496016e0b976f6a3d409c0c0f8d2/node_modules/rename-overwrite/index.js
var require_rename_overwrite = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/rename-overwrite/6.0.2/5f3ac1c6c9da1d876f3bd14170eff997aecd496016e0b976f6a3d409c0c0f8d2/node_modules/rename-overwrite/index.js"(exports, module) {
    "use strict";
    var fs9 = __require("fs");
    var { copySync, copy } = require_lib2();
    var path12 = __require("path");
    var rimraf3 = require_rimraf();
    module.exports = async function renameOverwrite4(oldPath, newPath, retry = 0) {
      try {
        await fs9.promises.rename(oldPath, newPath);
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
                await fs9.promises.rename(oldPath, newPath);
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
              await fs9.promises.stat(oldPath);
            } catch (statErr) {
              if (statErr.code === "ENOENT") {
                throw statErr;
              }
            }
            await fs9.promises.mkdir(path12.dirname(newPath), { recursive: true });
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
        fs9.renameSync(oldPath, newPath);
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
                fs9.renameSync(oldPath, newPath);
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
            fs9.renameSync(oldPath, newPath);
            return;
          case "ENOENT":
            fs9.mkdirSync(path12.dirname(newPath), { recursive: true });
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

// ../../../.local/share/pnpm/store/v10/links/fast-safe-stringify/2.1.1/60f5418df769ea68bc8d688541488d5a98daf703d72e57b1e7ca262a1e289ed0/node_modules/fast-safe-stringify/index.js
var require_fast_safe_stringify = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fast-safe-stringify/2.1.1/60f5418df769ea68bc8d688541488d5a98daf703d72e57b1e7ca262a1e289ed0/node_modules/fast-safe-stringify/index.js"(exports, module) {
    module.exports = stringify;
    stringify.default = stringify;
    stringify.stable = deterministicStringify;
    stringify.stableStringify = deterministicStringify;
    var LIMIT_REPLACE_NODE = "[...]";
    var CIRCULAR_REPLACE_NODE = "[Circular]";
    var arr = [];
    var replacerStack = [];
    function defaultOptions() {
      return {
        depthLimit: Number.MAX_SAFE_INTEGER,
        edgesLimit: Number.MAX_SAFE_INTEGER
      };
    }
    function stringify(obj, replacer, spacer, options) {
      if (typeof options === "undefined") {
        options = defaultOptions();
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
        options = defaultOptions();
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

// ../../../.local/share/pnpm/store/v10/links/individual/3.0.0/16916313ebaab38455d9c75a54fff660edcc28f062c8d71b95dc79244fe1d86a/node_modules/individual/index.js
var require_individual = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/individual/3.0.0/16916313ebaab38455d9c75a54fff660edcc28f062c8d71b95dc79244fe1d86a/node_modules/individual/index.js"(exports, module) {
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

// ../../../.local/share/pnpm/store/v10/links/bole/5.0.17/0b558d8c78119d472b4f6e94a8cb5454b84e0e0c4a582355e66568f378b77396/node_modules/bole/format.js
var require_format = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/bole/5.0.17/0b558d8c78119d472b4f6e94a8cb5454b84e0e0c4a582355e66568f378b77396/node_modules/bole/format.js"(exports, module) {
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

// ../../../.local/share/pnpm/store/v10/links/bole/5.0.17/0b558d8c78119d472b4f6e94a8cb5454b84e0e0c4a582355e66568f378b77396/node_modules/bole/bole.js
var require_bole = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/bole/5.0.17/0b558d8c78119d472b4f6e94a8cb5454b84e0e0c4a582355e66568f378b77396/node_modules/bole/bole.js"(exports, module) {
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

// ../../../.local/share/pnpm/store/v10/links/split2/4.2.0/5aa5692fab682fdeae843001e92a0f3971c2e71a60115f1a18744a5b619d4d62/node_modules/split2/index.js
var require_split2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/split2/4.2.0/5aa5692fab682fdeae843001e92a0f3971c2e71a60115f1a18744a5b619d4d62/node_modules/split2/index.js"(exports, module) {
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

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/fs/index.js
var require_fs2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/fs/index.js"(exports) {
    "use strict";
    var u = require_universalify().fromCallback;
    var fs9 = require_graceful_fs();
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
      return typeof fs9[key] === "function";
    });
    Object.assign(exports, fs9);
    api.forEach((method) => {
      exports[method] = u(fs9[method]);
    });
    exports.exists = function(filename, callback) {
      if (typeof callback === "function") {
        return fs9.exists(filename, callback);
      }
      return new Promise((resolve) => {
        return fs9.exists(filename, resolve);
      });
    };
    exports.read = function(fd, buffer, offset, length, position, callback) {
      if (typeof callback === "function") {
        return fs9.read(fd, buffer, offset, length, position, callback);
      }
      return new Promise((resolve, reject) => {
        fs9.read(fd, buffer, offset, length, position, (err, bytesRead, buffer2) => {
          if (err) return reject(err);
          resolve({ bytesRead, buffer: buffer2 });
        });
      });
    };
    exports.write = function(fd, buffer, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs9.write(fd, buffer, ...args);
      }
      return new Promise((resolve, reject) => {
        fs9.write(fd, buffer, ...args, (err, bytesWritten, buffer2) => {
          if (err) return reject(err);
          resolve({ bytesWritten, buffer: buffer2 });
        });
      });
    };
    exports.readv = function(fd, buffers, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs9.readv(fd, buffers, ...args);
      }
      return new Promise((resolve, reject) => {
        fs9.readv(fd, buffers, ...args, (err, bytesRead, buffers2) => {
          if (err) return reject(err);
          resolve({ bytesRead, buffers: buffers2 });
        });
      });
    };
    exports.writev = function(fd, buffers, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs9.writev(fd, buffers, ...args);
      }
      return new Promise((resolve, reject) => {
        fs9.writev(fd, buffers, ...args, (err, bytesWritten, buffers2) => {
          if (err) return reject(err);
          resolve({ bytesWritten, buffers: buffers2 });
        });
      });
    };
    if (typeof fs9.realpath.native === "function") {
      exports.realpath.native = u(fs9.realpath.native);
    } else {
      process.emitWarning(
        "fs.realpath.native is not a function. Is fs being monkey-patched?",
        "Warning",
        "fs-extra-WARN0003"
      );
    }
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/mkdirs/utils.js
var require_utils3 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/mkdirs/utils.js"(exports, module) {
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

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/mkdirs/make-dir.js
var require_make_dir2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/mkdirs/make-dir.js"(exports, module) {
    "use strict";
    var fs9 = require_fs2();
    var { checkPath } = require_utils3();
    var getMode = (options) => {
      const defaults = { mode: 511 };
      if (typeof options === "number") return options;
      return { ...defaults, ...options }.mode;
    };
    module.exports.makeDir = async (dir, options) => {
      checkPath(dir);
      return fs9.mkdir(dir, {
        mode: getMode(options),
        recursive: true
      });
    };
    module.exports.makeDirSync = (dir, options) => {
      checkPath(dir);
      return fs9.mkdirSync(dir, {
        mode: getMode(options),
        recursive: true
      });
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/mkdirs/index.js
var require_mkdirs2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/mkdirs/index.js"(exports, module) {
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

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/path-exists/index.js
var require_path_exists2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/path-exists/index.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs9 = require_fs2();
    function pathExists(path12) {
      return fs9.access(path12).then(() => true).catch(() => false);
    }
    module.exports = {
      pathExists: u(pathExists),
      pathExistsSync: fs9.existsSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/util/utimes.js
var require_utimes2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/util/utimes.js"(exports, module) {
    "use strict";
    var fs9 = require_fs2();
    var u = require_universalify().fromPromise;
    async function utimesMillis(path12, atime, mtime) {
      const fd = await fs9.open(path12, "r+");
      let closeErr = null;
      try {
        await fs9.futimes(fd, atime, mtime);
      } finally {
        try {
          await fs9.close(fd);
        } catch (e) {
          closeErr = e;
        }
      }
      if (closeErr) {
        throw closeErr;
      }
    }
    function utimesMillisSync(path12, atime, mtime) {
      const fd = fs9.openSync(path12, "r+");
      fs9.futimesSync(fd, atime, mtime);
      return fs9.closeSync(fd);
    }
    module.exports = {
      utimesMillis: u(utimesMillis),
      utimesMillisSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/util/stat.js
var require_stat2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/util/stat.js"(exports, module) {
    "use strict";
    var fs9 = require_fs2();
    var path12 = __require("path");
    var u = require_universalify().fromPromise;
    function getStats(src, dest, opts2) {
      const statFunc = opts2.dereference ? (file) => fs9.stat(file, { bigint: true }) : (file) => fs9.lstat(file, { bigint: true });
      return Promise.all([
        statFunc(src),
        statFunc(dest).catch((err) => {
          if (err.code === "ENOENT") return null;
          throw err;
        })
      ]).then(([srcStat, destStat]) => ({ srcStat, destStat }));
    }
    function getStatsSync(src, dest, opts2) {
      let destStat;
      const statFunc = opts2.dereference ? (file) => fs9.statSync(file, { bigint: true }) : (file) => fs9.lstatSync(file, { bigint: true });
      const srcStat = statFunc(src);
      try {
        destStat = statFunc(dest);
      } catch (err) {
        if (err.code === "ENOENT") return { srcStat, destStat: null };
        throw err;
      }
      return { srcStat, destStat };
    }
    async function checkPaths(src, dest, funcName, opts2) {
      const { srcStat, destStat } = await getStats(src, dest, opts2);
      if (destStat) {
        if (areIdentical(srcStat, destStat)) {
          const srcBaseName = path12.basename(src);
          const destBaseName = path12.basename(dest);
          if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
            return { srcStat, destStat, isChangingCase: true };
          }
          throw new Error("Source and destination must not be the same.");
        }
        if (srcStat.isDirectory() && !destStat.isDirectory()) {
          throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
        }
        if (!srcStat.isDirectory() && destStat.isDirectory()) {
          throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`);
        }
      }
      if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return { srcStat, destStat };
    }
    function checkPathsSync(src, dest, funcName, opts2) {
      const { srcStat, destStat } = getStatsSync(src, dest, opts2);
      if (destStat) {
        if (areIdentical(srcStat, destStat)) {
          const srcBaseName = path12.basename(src);
          const destBaseName = path12.basename(dest);
          if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
            return { srcStat, destStat, isChangingCase: true };
          }
          throw new Error("Source and destination must not be the same.");
        }
        if (srcStat.isDirectory() && !destStat.isDirectory()) {
          throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
        }
        if (!srcStat.isDirectory() && destStat.isDirectory()) {
          throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`);
        }
      }
      if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return { srcStat, destStat };
    }
    async function checkParentPaths(src, srcStat, dest, funcName) {
      const srcParent = path12.resolve(path12.dirname(src));
      const destParent = path12.resolve(path12.dirname(dest));
      if (destParent === srcParent || destParent === path12.parse(destParent).root) return;
      let destStat;
      try {
        destStat = await fs9.stat(destParent, { bigint: true });
      } catch (err) {
        if (err.code === "ENOENT") return;
        throw err;
      }
      if (areIdentical(srcStat, destStat)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return checkParentPaths(src, srcStat, destParent, funcName);
    }
    function checkParentPathsSync(src, srcStat, dest, funcName) {
      const srcParent = path12.resolve(path12.dirname(src));
      const destParent = path12.resolve(path12.dirname(dest));
      if (destParent === srcParent || destParent === path12.parse(destParent).root) return;
      let destStat;
      try {
        destStat = fs9.statSync(destParent, { bigint: true });
      } catch (err) {
        if (err.code === "ENOENT") return;
        throw err;
      }
      if (areIdentical(srcStat, destStat)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return checkParentPathsSync(src, srcStat, destParent, funcName);
    }
    function areIdentical(srcStat, destStat) {
      return destStat.ino !== void 0 && destStat.dev !== void 0 && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev;
    }
    function isSrcSubdir(src, dest) {
      const srcArr = path12.resolve(src).split(path12.sep).filter((i) => i);
      const destArr = path12.resolve(dest).split(path12.sep).filter((i) => i);
      return srcArr.every((cur, i) => destArr[i] === cur);
    }
    function errMsg(src, dest, funcName) {
      return `Cannot ${funcName} '${src}' to a subdirectory of itself, '${dest}'.`;
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

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/copy/copy.js
var require_copy3 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/copy/copy.js"(exports, module) {
    "use strict";
    var fs9 = require_fs2();
    var path12 = __require("path");
    var { mkdirs } = require_mkdirs2();
    var { pathExists } = require_path_exists2();
    var { utimesMillis } = require_utimes2();
    var stat = require_stat2();
    async function copy(src, dest, opts2 = {}) {
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
      const { srcStat, destStat } = await stat.checkPaths(src, dest, "copy", opts2);
      await stat.checkParentPaths(src, srcStat, dest, "copy");
      const include = await runFilter(src, dest, opts2);
      if (!include) return;
      const destParent = path12.dirname(dest);
      const dirExists = await pathExists(destParent);
      if (!dirExists) {
        await mkdirs(destParent);
      }
      await getStatsAndPerformCopy(destStat, src, dest, opts2);
    }
    async function runFilter(src, dest, opts2) {
      if (!opts2.filter) return true;
      return opts2.filter(src, dest);
    }
    async function getStatsAndPerformCopy(destStat, src, dest, opts2) {
      const statFn = opts2.dereference ? fs9.stat : fs9.lstat;
      const srcStat = await statFn(src);
      if (srcStat.isDirectory()) return onDir(srcStat, destStat, src, dest, opts2);
      if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile(srcStat, destStat, src, dest, opts2);
      if (srcStat.isSymbolicLink()) return onLink(destStat, src, dest, opts2);
      if (srcStat.isSocket()) throw new Error(`Cannot copy a socket file: ${src}`);
      if (srcStat.isFIFO()) throw new Error(`Cannot copy a FIFO pipe: ${src}`);
      throw new Error(`Unknown file: ${src}`);
    }
    async function onFile(srcStat, destStat, src, dest, opts2) {
      if (!destStat) return copyFile(srcStat, src, dest, opts2);
      if (opts2.overwrite) {
        await fs9.unlink(dest);
        return copyFile(srcStat, src, dest, opts2);
      }
      if (opts2.errorOnExist) {
        throw new Error(`'${dest}' already exists`);
      }
    }
    async function copyFile(srcStat, src, dest, opts2) {
      await fs9.copyFile(src, dest);
      if (opts2.preserveTimestamps) {
        if (fileIsNotWritable(srcStat.mode)) {
          await makeFileWritable(dest, srcStat.mode);
        }
        const updatedSrcStat = await fs9.stat(src);
        await utimesMillis(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
      }
      return fs9.chmod(dest, srcStat.mode);
    }
    function fileIsNotWritable(srcMode) {
      return (srcMode & 128) === 0;
    }
    function makeFileWritable(dest, srcMode) {
      return fs9.chmod(dest, srcMode | 128);
    }
    async function onDir(srcStat, destStat, src, dest, opts2) {
      if (!destStat) {
        await fs9.mkdir(dest);
      }
      const promises = [];
      for await (const item of await fs9.opendir(src)) {
        const srcItem = path12.join(src, item.name);
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
        await fs9.chmod(dest, srcStat.mode);
      }
    }
    async function onLink(destStat, src, dest, opts2) {
      let resolvedSrc = await fs9.readlink(src);
      if (opts2.dereference) {
        resolvedSrc = path12.resolve(process.cwd(), resolvedSrc);
      }
      if (!destStat) {
        return fs9.symlink(resolvedSrc, dest);
      }
      let resolvedDest = null;
      try {
        resolvedDest = await fs9.readlink(dest);
      } catch (e) {
        if (e.code === "EINVAL" || e.code === "UNKNOWN") return fs9.symlink(resolvedSrc, dest);
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
      await fs9.unlink(dest);
      return fs9.symlink(resolvedSrc, dest);
    }
    module.exports = copy;
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/copy/copy-sync.js
var require_copy_sync2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/copy/copy-sync.js"(exports, module) {
    "use strict";
    var fs9 = require_graceful_fs();
    var path12 = __require("path");
    var mkdirsSync = require_mkdirs2().mkdirsSync;
    var utimesMillisSync = require_utimes2().utimesMillisSync;
    var stat = require_stat2();
    function copySync(src, dest, opts2) {
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
      const { srcStat, destStat } = stat.checkPathsSync(src, dest, "copy", opts2);
      stat.checkParentPathsSync(src, srcStat, dest, "copy");
      if (opts2.filter && !opts2.filter(src, dest)) return;
      const destParent = path12.dirname(dest);
      if (!fs9.existsSync(destParent)) mkdirsSync(destParent);
      return getStats(destStat, src, dest, opts2);
    }
    function getStats(destStat, src, dest, opts2) {
      const statSync = opts2.dereference ? fs9.statSync : fs9.lstatSync;
      const srcStat = statSync(src);
      if (srcStat.isDirectory()) return onDir(srcStat, destStat, src, dest, opts2);
      else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile(srcStat, destStat, src, dest, opts2);
      else if (srcStat.isSymbolicLink()) return onLink(destStat, src, dest, opts2);
      else if (srcStat.isSocket()) throw new Error(`Cannot copy a socket file: ${src}`);
      else if (srcStat.isFIFO()) throw new Error(`Cannot copy a FIFO pipe: ${src}`);
      throw new Error(`Unknown file: ${src}`);
    }
    function onFile(srcStat, destStat, src, dest, opts2) {
      if (!destStat) return copyFile(srcStat, src, dest, opts2);
      return mayCopyFile(srcStat, src, dest, opts2);
    }
    function mayCopyFile(srcStat, src, dest, opts2) {
      if (opts2.overwrite) {
        fs9.unlinkSync(dest);
        return copyFile(srcStat, src, dest, opts2);
      } else if (opts2.errorOnExist) {
        throw new Error(`'${dest}' already exists`);
      }
    }
    function copyFile(srcStat, src, dest, opts2) {
      fs9.copyFileSync(src, dest);
      if (opts2.preserveTimestamps) handleTimestamps(srcStat.mode, src, dest);
      return setDestMode(dest, srcStat.mode);
    }
    function handleTimestamps(srcMode, src, dest) {
      if (fileIsNotWritable(srcMode)) makeFileWritable(dest, srcMode);
      return setDestTimestamps(src, dest);
    }
    function fileIsNotWritable(srcMode) {
      return (srcMode & 128) === 0;
    }
    function makeFileWritable(dest, srcMode) {
      return setDestMode(dest, srcMode | 128);
    }
    function setDestMode(dest, srcMode) {
      return fs9.chmodSync(dest, srcMode);
    }
    function setDestTimestamps(src, dest) {
      const updatedSrcStat = fs9.statSync(src);
      return utimesMillisSync(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
    }
    function onDir(srcStat, destStat, src, dest, opts2) {
      if (!destStat) return mkDirAndCopy(srcStat.mode, src, dest, opts2);
      return copyDir(src, dest, opts2);
    }
    function mkDirAndCopy(srcMode, src, dest, opts2) {
      fs9.mkdirSync(dest);
      copyDir(src, dest, opts2);
      return setDestMode(dest, srcMode);
    }
    function copyDir(src, dest, opts2) {
      const dir = fs9.opendirSync(src);
      try {
        let dirent;
        while ((dirent = dir.readSync()) !== null) {
          copyDirItem(dirent.name, src, dest, opts2);
        }
      } finally {
        dir.closeSync();
      }
    }
    function copyDirItem(item, src, dest, opts2) {
      const srcItem = path12.join(src, item);
      const destItem = path12.join(dest, item);
      if (opts2.filter && !opts2.filter(srcItem, destItem)) return;
      const { destStat } = stat.checkPathsSync(srcItem, destItem, "copy", opts2);
      return getStats(destStat, srcItem, destItem, opts2);
    }
    function onLink(destStat, src, dest, opts2) {
      let resolvedSrc = fs9.readlinkSync(src);
      if (opts2.dereference) {
        resolvedSrc = path12.resolve(process.cwd(), resolvedSrc);
      }
      if (!destStat) {
        return fs9.symlinkSync(resolvedSrc, dest);
      } else {
        let resolvedDest;
        try {
          resolvedDest = fs9.readlinkSync(dest);
        } catch (err) {
          if (err.code === "EINVAL" || err.code === "UNKNOWN") return fs9.symlinkSync(resolvedSrc, dest);
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
      fs9.unlinkSync(dest);
      return fs9.symlinkSync(resolvedSrc, dest);
    }
    module.exports = copySync;
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/copy/index.js
var require_copy4 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/copy/index.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    module.exports = {
      copy: u(require_copy3()),
      copySync: require_copy_sync2()
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/remove/index.js
var require_remove2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/remove/index.js"(exports, module) {
    "use strict";
    var fs9 = require_graceful_fs();
    var u = require_universalify().fromCallback;
    function remove(path12, callback) {
      fs9.rm(path12, { recursive: true, force: true }, callback);
    }
    function removeSync(path12) {
      fs9.rmSync(path12, { recursive: true, force: true });
    }
    module.exports = {
      remove: u(remove),
      removeSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/empty/index.js
var require_empty2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/empty/index.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs9 = require_fs2();
    var path12 = __require("path");
    var mkdir = require_mkdirs2();
    var remove = require_remove2();
    var emptyDir = u(async function emptyDir2(dir) {
      let items;
      try {
        items = await fs9.readdir(dir);
      } catch {
        return mkdir.mkdirs(dir);
      }
      return Promise.all(items.map((item) => remove.remove(path12.join(dir, item))));
    });
    function emptyDirSync(dir) {
      let items;
      try {
        items = fs9.readdirSync(dir);
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

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/ensure/file.js
var require_file2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/ensure/file.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    var path12 = __require("path");
    var fs9 = require_fs2();
    var mkdir = require_mkdirs2();
    async function createFile(file) {
      let stats;
      try {
        stats = await fs9.stat(file);
      } catch {
      }
      if (stats && stats.isFile()) return;
      const dir = path12.dirname(file);
      let dirStats = null;
      try {
        dirStats = await fs9.stat(dir);
      } catch (err) {
        if (err.code === "ENOENT") {
          await mkdir.mkdirs(dir);
          await fs9.writeFile(file, "");
          return;
        } else {
          throw err;
        }
      }
      if (dirStats.isDirectory()) {
        await fs9.writeFile(file, "");
      } else {
        await fs9.readdir(dir);
      }
    }
    function createFileSync(file) {
      let stats;
      try {
        stats = fs9.statSync(file);
      } catch {
      }
      if (stats && stats.isFile()) return;
      const dir = path12.dirname(file);
      try {
        if (!fs9.statSync(dir).isDirectory()) {
          fs9.readdirSync(dir);
        }
      } catch (err) {
        if (err && err.code === "ENOENT") mkdir.mkdirsSync(dir);
        else throw err;
      }
      fs9.writeFileSync(file, "");
    }
    module.exports = {
      createFile: u(createFile),
      createFileSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/ensure/link.js
var require_link2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/ensure/link.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    var path12 = __require("path");
    var fs9 = require_fs2();
    var mkdir = require_mkdirs2();
    var { pathExists } = require_path_exists2();
    var { areIdentical } = require_stat2();
    async function createLink(srcpath, dstpath) {
      let dstStat;
      try {
        dstStat = await fs9.lstat(dstpath);
      } catch {
      }
      let srcStat;
      try {
        srcStat = await fs9.lstat(srcpath);
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
      await fs9.link(srcpath, dstpath);
    }
    function createLinkSync(srcpath, dstpath) {
      let dstStat;
      try {
        dstStat = fs9.lstatSync(dstpath);
      } catch {
      }
      try {
        const srcStat = fs9.lstatSync(srcpath);
        if (dstStat && areIdentical(srcStat, dstStat)) return;
      } catch (err) {
        err.message = err.message.replace("lstat", "ensureLink");
        throw err;
      }
      const dir = path12.dirname(dstpath);
      const dirExists = fs9.existsSync(dir);
      if (dirExists) return fs9.linkSync(srcpath, dstpath);
      mkdir.mkdirsSync(dir);
      return fs9.linkSync(srcpath, dstpath);
    }
    module.exports = {
      createLink: u(createLink),
      createLinkSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/ensure/symlink-paths.js
var require_symlink_paths2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/ensure/symlink-paths.js"(exports, module) {
    "use strict";
    var path12 = __require("path");
    var fs9 = require_fs2();
    var { pathExists } = require_path_exists2();
    var u = require_universalify().fromPromise;
    async function symlinkPaths(srcpath, dstpath) {
      if (path12.isAbsolute(srcpath)) {
        try {
          await fs9.lstat(srcpath);
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
        await fs9.lstat(srcpath);
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
        const exists2 = fs9.existsSync(srcpath);
        if (!exists2) throw new Error("absolute srcpath does not exist");
        return {
          toCwd: srcpath,
          toDst: srcpath
        };
      }
      const dstdir = path12.dirname(dstpath);
      const relativeToDst = path12.join(dstdir, srcpath);
      const exists = fs9.existsSync(relativeToDst);
      if (exists) {
        return {
          toCwd: relativeToDst,
          toDst: srcpath
        };
      }
      const srcExists = fs9.existsSync(srcpath);
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

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/ensure/symlink-type.js
var require_symlink_type2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/ensure/symlink-type.js"(exports, module) {
    "use strict";
    var fs9 = require_fs2();
    var u = require_universalify().fromPromise;
    async function symlinkType(srcpath, type) {
      if (type) return type;
      let stats;
      try {
        stats = await fs9.lstat(srcpath);
      } catch {
        return "file";
      }
      return stats && stats.isDirectory() ? "dir" : "file";
    }
    function symlinkTypeSync(srcpath, type) {
      if (type) return type;
      let stats;
      try {
        stats = fs9.lstatSync(srcpath);
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

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/ensure/symlink.js
var require_symlink2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/ensure/symlink.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    var path12 = __require("path");
    var fs9 = require_fs2();
    var { mkdirs, mkdirsSync } = require_mkdirs2();
    var { symlinkPaths, symlinkPathsSync } = require_symlink_paths2();
    var { symlinkType, symlinkTypeSync } = require_symlink_type2();
    var { pathExists } = require_path_exists2();
    var { areIdentical } = require_stat2();
    async function createSymlink(srcpath, dstpath, type) {
      let stats;
      try {
        stats = await fs9.lstat(dstpath);
      } catch {
      }
      if (stats && stats.isSymbolicLink()) {
        const [srcStat, dstStat] = await Promise.all([
          fs9.stat(srcpath),
          fs9.stat(dstpath)
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
      return fs9.symlink(srcpath, dstpath, toType);
    }
    function createSymlinkSync(srcpath, dstpath, type) {
      let stats;
      try {
        stats = fs9.lstatSync(dstpath);
      } catch {
      }
      if (stats && stats.isSymbolicLink()) {
        const srcStat = fs9.statSync(srcpath);
        const dstStat = fs9.statSync(dstpath);
        if (areIdentical(srcStat, dstStat)) return;
      }
      const relative = symlinkPathsSync(srcpath, dstpath);
      srcpath = relative.toDst;
      type = symlinkTypeSync(relative.toCwd, type);
      const dir = path12.dirname(dstpath);
      const exists = fs9.existsSync(dir);
      if (exists) return fs9.symlinkSync(srcpath, dstpath, type);
      mkdirsSync(dir);
      return fs9.symlinkSync(srcpath, dstpath, type);
    }
    module.exports = {
      createSymlink: u(createSymlink),
      createSymlinkSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/ensure/index.js
var require_ensure2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/ensure/index.js"(exports, module) {
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

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/json/jsonfile.js
var require_jsonfile3 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/json/jsonfile.js"(exports, module) {
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

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/output-file/index.js
var require_output_file2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/output-file/index.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs9 = require_fs2();
    var path12 = __require("path");
    var mkdir = require_mkdirs2();
    var pathExists = require_path_exists2().pathExists;
    async function outputFile(file, data, encoding = "utf-8") {
      const dir = path12.dirname(file);
      if (!await pathExists(dir)) {
        await mkdir.mkdirs(dir);
      }
      return fs9.writeFile(file, data, encoding);
    }
    function outputFileSync(file, ...args) {
      const dir = path12.dirname(file);
      if (!fs9.existsSync(dir)) {
        mkdir.mkdirsSync(dir);
      }
      fs9.writeFileSync(file, ...args);
    }
    module.exports = {
      outputFile: u(outputFile),
      outputFileSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/json/output-json.js
var require_output_json2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/json/output-json.js"(exports, module) {
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

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/json/output-json-sync.js
var require_output_json_sync2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/json/output-json-sync.js"(exports, module) {
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

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/json/index.js
var require_json2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/json/index.js"(exports, module) {
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

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/move/move.js
var require_move3 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/move/move.js"(exports, module) {
    "use strict";
    var fs9 = require_fs2();
    var path12 = __require("path");
    var { copy } = require_copy4();
    var { remove } = require_remove2();
    var { mkdirp } = require_mkdirs2();
    var { pathExists } = require_path_exists2();
    var stat = require_stat2();
    async function move(src, dest, opts2 = {}) {
      const overwrite = opts2.overwrite || opts2.clobber || false;
      const { srcStat, isChangingCase = false } = await stat.checkPaths(src, dest, "move", opts2);
      await stat.checkParentPaths(src, srcStat, dest, "move");
      const destParent = path12.dirname(dest);
      const parsedParentPath = path12.parse(destParent);
      if (parsedParentPath.root !== destParent) {
        await mkdirp(destParent);
      }
      return doRename(src, dest, overwrite, isChangingCase);
    }
    async function doRename(src, dest, overwrite, isChangingCase) {
      if (!isChangingCase) {
        if (overwrite) {
          await remove(dest);
        } else if (await pathExists(dest)) {
          throw new Error("dest already exists.");
        }
      }
      try {
        await fs9.rename(src, dest);
      } catch (err) {
        if (err.code !== "EXDEV") {
          throw err;
        }
        await moveAcrossDevice(src, dest, overwrite);
      }
    }
    async function moveAcrossDevice(src, dest, overwrite) {
      const opts2 = {
        overwrite,
        errorOnExist: true,
        preserveTimestamps: true
      };
      await copy(src, dest, opts2);
      return remove(src);
    }
    module.exports = move;
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/move/move-sync.js
var require_move_sync2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/move/move-sync.js"(exports, module) {
    "use strict";
    var fs9 = require_graceful_fs();
    var path12 = __require("path");
    var copySync = require_copy4().copySync;
    var removeSync = require_remove2().removeSync;
    var mkdirpSync = require_mkdirs2().mkdirpSync;
    var stat = require_stat2();
    function moveSync(src, dest, opts2) {
      opts2 = opts2 || {};
      const overwrite = opts2.overwrite || opts2.clobber || false;
      const { srcStat, isChangingCase = false } = stat.checkPathsSync(src, dest, "move", opts2);
      stat.checkParentPathsSync(src, srcStat, dest, "move");
      if (!isParentRoot(dest)) mkdirpSync(path12.dirname(dest));
      return doRename(src, dest, overwrite, isChangingCase);
    }
    function isParentRoot(dest) {
      const parent = path12.dirname(dest);
      const parsedPath = path12.parse(parent);
      return parsedPath.root === parent;
    }
    function doRename(src, dest, overwrite, isChangingCase) {
      if (isChangingCase) return rename(src, dest, overwrite);
      if (overwrite) {
        removeSync(dest);
        return rename(src, dest, overwrite);
      }
      if (fs9.existsSync(dest)) throw new Error("dest already exists.");
      return rename(src, dest, overwrite);
    }
    function rename(src, dest, overwrite) {
      try {
        fs9.renameSync(src, dest);
      } catch (err) {
        if (err.code !== "EXDEV") throw err;
        return moveAcrossDevice(src, dest, overwrite);
      }
    }
    function moveAcrossDevice(src, dest, overwrite) {
      const opts2 = {
        overwrite,
        errorOnExist: true,
        preserveTimestamps: true
      };
      copySync(src, dest, opts2);
      return removeSync(src);
    }
    module.exports = moveSync;
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/move/index.js
var require_move4 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/move/index.js"(exports, module) {
    "use strict";
    var u = require_universalify().fromPromise;
    module.exports = {
      move: u(require_move3()),
      moveSync: require_move_sync2()
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/index.js
var require_lib3 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/fs-extra/11.3.1/0a6fab336111049ce5953e70729c9a539f12e0c5920996a914c32fba17982793/node_modules/fs-extra/lib/index.js"(exports, module) {
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

// ../../../.local/share/pnpm/store/v10/links/make-empty-dir/3.0.2/a7a4cf98e6272554434a37f2ec0a891cf0089041cf92ad60db6dbd21652af3a9/node_modules/make-empty-dir/index.js
var require_make_empty_dir = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/make-empty-dir/3.0.2/a7a4cf98e6272554434a37f2ec0a891cf0089041cf92ad60db6dbd21652af3a9/node_modules/make-empty-dir/index.js"(exports, module) {
    "use strict";
    var fs9 = __require("fs");
    var path12 = __require("path");
    var rimraf3 = require_rimraf();
    module.exports = async function makeEmptyDir2(dir, opts2) {
      if (opts2 && opts2.recursive) {
        await fs9.promises.mkdir(path12.dirname(dir), { recursive: true });
      }
      try {
        await fs9.promises.mkdir(dir);
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
      const items = await fs9.promises.readdir(dir);
      for (const item of items) {
        await rimraf3(path12.join(dir, item));
      }
    }
    module.exports.sync = function makeEmptyDirSync(dir, opts2) {
      if (opts2 && opts2.recursive) {
        fs9.mkdirSync(path12.dirname(dir), { recursive: true });
      }
      try {
        fs9.mkdirSync(dir);
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
      const items = fs9.readdirSync(dir);
      for (const item of items) {
        rimraf3.sync(path12.join(dir, item));
      }
    }
  }
});

// ../../../.local/share/pnpm/store/v10/links/truncate-utf8-bytes/1.0.2/7c78b0bbe6d5f84254c7db363048f82104855b0c1f0f4e9e899c59a14af989cc/node_modules/truncate-utf8-bytes/lib/truncate.js
var require_truncate = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/truncate-utf8-bytes/1.0.2/7c78b0bbe6d5f84254c7db363048f82104855b0c1f0f4e9e899c59a14af989cc/node_modules/truncate-utf8-bytes/lib/truncate.js"(exports, module) {
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

// ../../../.local/share/pnpm/store/v10/links/truncate-utf8-bytes/1.0.2/7c78b0bbe6d5f84254c7db363048f82104855b0c1f0f4e9e899c59a14af989cc/node_modules/truncate-utf8-bytes/index.js
var require_truncate_utf8_bytes = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/truncate-utf8-bytes/1.0.2/7c78b0bbe6d5f84254c7db363048f82104855b0c1f0f4e9e899c59a14af989cc/node_modules/truncate-utf8-bytes/index.js"(exports, module) {
    "use strict";
    var truncate = require_truncate();
    var getLength = Buffer.byteLength.bind(Buffer);
    module.exports = truncate.bind(null, getLength);
  }
});

// ../../../.local/share/pnpm/store/v10/links/sanitize-filename/1.6.3/d2e7b1b6cae60055812f79cb4c27e7d778f88323eb2cdd9d7ae9e18bc75a6f44/node_modules/sanitize-filename/index.js
var require_sanitize_filename = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/sanitize-filename/1.6.3/d2e7b1b6cae60055812f79cb4c27e7d778f88323eb2cdd9d7ae9e18bc75a6f44/node_modules/sanitize-filename/index.js"(exports, module) {
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

// ../../../.local/share/pnpm/store/v10/links/crypto-random-string/2.0.0/39da4e0501c366f796372d74a308fbe61e7b4c954c8025e4c99c574e5bb761d9/node_modules/crypto-random-string/index.js
var require_crypto_random_string = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/crypto-random-string/2.0.0/39da4e0501c366f796372d74a308fbe61e7b4c954c8025e4c99c574e5bb761d9/node_modules/crypto-random-string/index.js"(exports, module) {
    "use strict";
    var crypto2 = __require("crypto");
    module.exports = (length) => {
      if (!Number.isFinite(length)) {
        throw new TypeError("Expected a finite number");
      }
      return crypto2.randomBytes(Math.ceil(length / 2)).toString("hex").slice(0, length);
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/unique-string/2.0.0/b2f9c7033829ac007c9affda02415b91dee75b1068fe7914c7cab5e6bbd61ff7/node_modules/unique-string/index.js
var require_unique_string = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/unique-string/2.0.0/b2f9c7033829ac007c9affda02415b91dee75b1068fe7914c7cab5e6bbd61ff7/node_modules/unique-string/index.js"(exports, module) {
    "use strict";
    var cryptoRandomString = require_crypto_random_string();
    module.exports = () => cryptoRandomString(32);
  }
});

// ../../../.local/share/pnpm/store/v10/links/path-temp/2.1.0/d7824a086fb07b11420b3b0113b79cda53a7d8f47c2f7ff4185cf13bacac3194/node_modules/path-temp/index.js
var require_path_temp = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/path-temp/2.1.0/d7824a086fb07b11420b3b0113b79cda53a7d8f47c2f7ff4185cf13bacac3194/node_modules/path-temp/index.js"(exports, module) {
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
    var reflinkFile = (src, dst) => binding.reflinkFile(src, dst).then(handleReflinkResult);
    var reflinkFileSync = (src, dst) => handleReflinkResult(binding.reflinkFileSync(src, dst));
    module.exports = {
      reflinkFile,
      reflinkFileSync
    };
  }
});

// ../../../.local/share/pnpm/store/v10/links/is-windows/1.0.2/d5223a19eb5dac5278fa78751b551fd5fbeb0f8260190d32413b619d962dde6a/node_modules/is-windows/index.js
var require_is_windows = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/is-windows/1.0.2/d5223a19eb5dac5278fa78751b551fd5fbeb0f8260190d32413b619d962dde6a/node_modules/is-windows/index.js"(exports, module) {
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

// ../../../.local/share/pnpm/store/v10/links/better-path-resolve/1.0.0/96b08496fdad88b2e4539b7f505c3c5155375197a32c1c94848b6531613fb411/node_modules/better-path-resolve/index.js
var require_better_path_resolve = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/better-path-resolve/1.0.0/96b08496fdad88b2e4539b7f505c3c5155375197a32c1c94848b6531613fb411/node_modules/better-path-resolve/index.js"(exports, module) {
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

// ../../../.local/share/pnpm/store/v10/links/rename-overwrite/6.0.3/b4ff636ccc6bf2c9e9f7e8aca35c8c8f2162cbf7880a216c3e1986052b7c8879/node_modules/rename-overwrite/index.js
var require_rename_overwrite2 = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/rename-overwrite/6.0.3/b4ff636ccc6bf2c9e9f7e8aca35c8c8f2162cbf7880a216c3e1986052b7c8879/node_modules/rename-overwrite/index.js"(exports, module) {
    "use strict";
    var fs9 = __require("fs");
    var { copySync, copy } = require_lib2();
    var path12 = __require("path");
    var rimraf3 = require_rimraf();
    module.exports = async function renameOverwrite4(oldPath, newPath, retry = 0) {
      try {
        await fs9.promises.rename(oldPath, newPath);
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
                await fs9.promises.rename(oldPath, newPath);
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
              await fs9.promises.stat(oldPath);
            } catch (statErr) {
              if (statErr.code === "ENOENT") {
                throw statErr;
              }
            }
            await fs9.promises.mkdir(path12.dirname(newPath), { recursive: true });
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
        fs9.renameSync(oldPath, newPath);
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
                fs9.renameSync(oldPath, newPath);
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
            fs9.renameSync(oldPath, newPath);
            return;
          case "ENOENT":
            fs9.mkdirSync(path12.dirname(newPath), { recursive: true });
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

// ../../../.local/share/pnpm/store/v10/links/symlink-dir/7.0.0/c1641d5c0846d1f7579a38fa41dc0945856e770bfd3fd940fb19354db93ebb82/node_modules/symlink-dir/dist/index.js
var require_dist = __commonJS({
  "../../../.local/share/pnpm/store/v10/links/symlink-dir/7.0.0/c1641d5c0846d1f7579a38fa41dc0945856e770bfd3fd940fb19354db93ebb82/node_modules/symlink-dir/dist/index.js"(exports, module) {
    "use strict";
    var betterPathResolve = require_better_path_resolve();
    var fs_1 = __require("fs");
    var util8 = __require("util");
    var pathLib = __require("path");
    var renameOverwrite4 = require_rename_overwrite2();
    var IS_WINDOWS = process.platform === "win32" || /^(msys|cygwin)$/.test(process.env.OSTYPE);
    function resolveSrcOnWinJunction(src) {
      return `${src}\\`;
    }
    function resolveSrcOnTrueSymlink(src, dest) {
      return pathLib.relative(pathLib.dirname(dest), src);
    }
    function symlinkDir3(target, path12, opts2) {
      path12 = betterPathResolve(path12);
      target = betterPathResolve(target);
      if (target === path12)
        throw new Error(`Symlink path is the same as the target path (${target})`);
      return forceSymlink(target, path12, opts2);
    }
    function isExistingSymlinkUpToDate(wantedTarget, path12, linkString) {
      const existingTarget = pathLib.isAbsolute(linkString) ? linkString : pathLib.join(pathLib.dirname(path12), linkString);
      return pathLib.relative(wantedTarget, existingTarget) === "";
    }
    var createSymlinkAsync;
    var createSymlinkSync;
    if (IS_WINDOWS) {
      createSymlinkAsync = async (target, path12) => {
        try {
          await createTrueSymlinkAsync(target, path12);
          createSymlinkSync = createTrueSymlinkSync;
          createSymlinkAsync = createTrueSymlinkAsync;
        } catch (err) {
          if (err.code === "EPERM") {
            await createJunctionAsync(target, path12);
            createSymlinkSync = createJunctionSync;
            createSymlinkAsync = createJunctionAsync;
          } else {
            throw err;
          }
        }
      };
      createSymlinkSync = (target, path12) => {
        try {
          createTrueSymlinkSync(target, path12);
          createSymlinkSync = createTrueSymlinkSync;
          createSymlinkAsync = createTrueSymlinkAsync;
        } catch (err) {
          if (err.code === "EPERM") {
            createJunctionSync(target, path12);
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
    function createTrueSymlinkAsync(target, path12) {
      return fs_1.promises.symlink(resolveSrcOnTrueSymlink(target, path12), path12, "dir");
    }
    function createTrueSymlinkSync(target, path12) {
      (0, fs_1.symlinkSync)(resolveSrcOnTrueSymlink(target, path12), path12, "dir");
    }
    function createJunctionAsync(target, path12) {
      return fs_1.promises.symlink(resolveSrcOnWinJunction(target), path12, "junction");
    }
    function createJunctionSync(target, path12) {
      (0, fs_1.symlinkSync)(resolveSrcOnWinJunction(target), path12, "junction");
    }
    async function forceSymlink(target, path12, opts2) {
      let initialErr;
      try {
        await createSymlinkAsync(target, path12);
        return { reused: false };
      } catch (err) {
        switch (err.code) {
          case "ENOENT":
            try {
              await fs_1.promises.mkdir(pathLib.dirname(path12), { recursive: true });
            } catch (mkdirError) {
              mkdirError.message = `Error while trying to symlink "${target}" to "${path12}". The error happened while trying to create the parent directory for the symlink target. Details: ${mkdirError}`;
              throw mkdirError;
            }
            await forceSymlink(target, path12, opts2);
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
          ...await forceSymlink(target, path12, { ...opts2, renameTried: true }),
          warn
        };
      }
      if (isExistingSymlinkUpToDate(target, path12, linkString)) {
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
      return await forceSymlink(target, path12, opts2);
    }
    symlinkDir3["default"] = symlinkDir3;
    (function(symlinkDir4) {
      function sync(target, path12, opts2) {
        path12 = betterPathResolve(path12);
        target = betterPathResolve(target);
        if (target === path12)
          throw new Error(`Symlink path is the same as the target path (${target})`);
        return forceSymlinkSync(target, path12, opts2);
      }
      symlinkDir4.sync = sync;
    })(symlinkDir3 || (symlinkDir3 = {}));
    function forceSymlinkSync(target, path12, opts2) {
      let initialErr;
      try {
        createSymlinkSync(target, path12);
        return { reused: false };
      } catch (err) {
        initialErr = err;
        switch (err.code) {
          case "ENOENT":
            try {
              (0, fs_1.mkdirSync)(pathLib.dirname(path12), { recursive: true });
            } catch (mkdirError) {
              mkdirError.message = `Error while trying to symlink "${target}" to "${path12}". The error happened while trying to create the parent directory for the symlink target. Details: ${mkdirError}`;
              throw mkdirError;
            }
            forceSymlinkSync(target, path12, opts2);
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
          ...forceSymlinkSync(target, path12, { ...opts2, renameTried: true }),
          warn
        };
      }
      if (isExistingSymlinkUpToDate(target, path12, linkString)) {
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
      return forceSymlinkSync(target, path12, opts2);
    }
    module.exports = symlinkDir3;
  }
});

// ../worker/lib/start.js
import crypto from "crypto";
import v82 from "v8";
import path11 from "path";
import fs8 from "fs";

// ../fs/v8-file/lib/index.js
import fs from "fs";
import v8 from "v8";
function readV8FileStrictSync(filePath) {
  const buffer = fs.readFileSync(filePath);
  return v8.deserialize(buffer);
}

// ../fs/graceful-fs/lib/index.js
var import_graceful_fs = __toESM(require_graceful_fs(), 1);
import util, { promisify } from "util";
var lib_default = {
  copyFile: promisify(import_graceful_fs.default.copyFile),
  copyFileSync: withEagainRetry(import_graceful_fs.default.copyFileSync),
  createReadStream: import_graceful_fs.default.createReadStream,
  link: promisify(import_graceful_fs.default.link),
  linkSync: withEagainRetry(import_graceful_fs.default.linkSync),
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

// ../store/create-cafs-store/lib/index.js
import { promises as fs6 } from "fs";
import path8 from "path";

// ../store/cafs/lib/index.js
var import_ssri3 = __toESM(require_lib(), 1);

// ../store/cafs/lib/addFilesFromDir.js
import util2 from "util";
import fs2 from "fs";
import path from "path";

// ../../../.local/share/pnpm/store/v10/links/strip-bom/5.0.0/bcf389250873c6a9dd841adabcec8d514e957ddf3ab00790d6e05b457d7c4f07/node_modules/strip-bom/index.js
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
  if (opts2.files) {
    files = [];
    for (const file of opts2.files) {
      const absolutePath = path.join(dirname, file);
      let stat;
      try {
        stat = fs2.statSync(absolutePath);
      } catch (err) {
        if (!(util2.types.isNativeError(err) && "code" in err && err.code === "ENOENT")) {
          throw err;
        }
        continue;
      }
      files.push({
        absolutePath,
        relativePath: file,
        stat
      });
    }
  } else {
    files = findFilesInDir(dirname);
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
function findFilesInDir(dir) {
  const files = [];
  findFiles(files, dir);
  return files;
}
function findFiles(filesList, dir, relativeDir = "") {
  const files = fs2.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const relativeSubdir = `${relativeDir}${relativeDir ? "/" : ""}${file.name}`;
    if (file.isDirectory()) {
      if (relativeDir !== "" || file.name !== "node_modules") {
        findFiles(filesList, path.join(dir, file.name), relativeSubdir);
      }
      continue;
    }
    const absolutePath = path.join(dir, file.name);
    let stat;
    try {
      stat = fs2.statSync(absolutePath);
    } catch (err) {
      if (err.code !== "ENOENT") {
        throw err;
      }
      continue;
    }
    if (stat.isDirectory()) {
      findFiles(filesList, path.join(dir, file.name), relativeSubdir);
      continue;
    }
    filesList.push({
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
    if (fileName.includes("./")) {
      fileName = path2.posix.join("/", fileName).slice(1);
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
import fs3 from "fs";
import util3 from "util";
var import_rimraf = __toESM(require_rimraf(), 1);
var import_ssri2 = __toESM(require_lib(), 1);

// ../store/cafs/lib/getFilePathInCafs.js
var import_ssri = __toESM(require_lib(), 1);
import path3 from "path";
var modeIsExecutable = (mode) => (mode & 73) !== 0;
function getFilePathByModeInCafs(storeDir, integrity, mode) {
  const fileType = modeIsExecutable(mode) ? "exec" : "nonexec";
  return path3.join(storeDir, contentPathFromIntegrity(integrity, fileType));
}
function getIndexFilePathInCafs(storeDir, integrity, pkgId) {
  const hex = import_ssri.default.parse(integrity, { single: true }).hexDigest().substring(0, 64);
  return path3.join(storeDir, `index/${path3.join(hex.slice(0, 2), hex.slice(2))}-${pkgId.replace(/[\\/:*?"<>|]/g, "+")}.v8`);
}
function contentPathFromIntegrity(integrity, fileType) {
  const sri = import_ssri.default.parse(integrity, { single: true });
  return contentPathFromHex(fileType, sri.hexDigest());
}
function contentPathFromHex(fileType, hex) {
  const p = path3.join("files", hex.slice(0, 2), hex.slice(2));
  switch (fileType) {
    case "exec":
      return `${p}-exec`;
    case "nonexec":
      return p;
    case "index":
      return `${p}-index.v8`;
  }
}

// ../store/cafs/lib/checkPkgFilesIntegrity.js
global["verifiedFileIntegrity"] = 0;
function checkPkgFilesIntegrity(storeDir, pkgIndex, readManifest) {
  const verifiedFilesCache = /* @__PURE__ */ new Set();
  const _checkFilesIntegrity = checkFilesIntegrity.bind(null, verifiedFilesCache, storeDir);
  const verified = _checkFilesIntegrity(pkgIndex.files, readManifest);
  if (!verified)
    return { passed: false };
  if (pkgIndex.sideEffects) {
    for (const [sideEffectName, { added }] of pkgIndex.sideEffects) {
      if (added) {
        const { passed } = _checkFilesIntegrity(added);
        if (!passed) {
          pkgIndex.sideEffects.delete(sideEffectName);
        }
      }
    }
  }
  return verified;
}
function checkFilesIntegrity(verifiedFilesCache, storeDir, files, readManifest) {
  let allVerified = true;
  let manifest;
  for (const [f, fstat] of files) {
    if (!fstat.integrity) {
      throw new Error(`Integrity checksum is missing for ${f}`);
    }
    const filename = getFilePathByModeInCafs(storeDir, fstat.integrity, fstat.mode);
    const readFile = readManifest && f === "package.json";
    if (!readFile && verifiedFilesCache.has(filename))
      continue;
    const verifyResult = verifyFile(filename, fstat, readFile);
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
    manifest
  };
}
function verifyFile(filename, fstat, readManifest) {
  const currentFile = checkFile(filename, fstat.checkedAt);
  if (currentFile == null)
    return { passed: false };
  if (currentFile.isModified) {
    if (currentFile.size !== fstat.size) {
      import_rimraf.default.sync(filename);
      return { passed: false };
    }
    return verifyFileIntegrity(filename, fstat, readManifest);
  }
  if (readManifest) {
    return {
      passed: true,
      manifest: parseJsonBufferSync(lib_default.readFileSync(filename))
    };
  }
  return { passed: true };
}
function verifyFileIntegrity(filename, expectedFile, readManifest) {
  global["verifiedFileIntegrity"]++;
  try {
    const data = lib_default.readFileSync(filename);
    const passed = Boolean(import_ssri2.default.checkData(data, expectedFile.integrity));
    if (!passed) {
      lib_default.unlinkSync(filename);
      return { passed };
    } else if (readManifest) {
      return {
        passed,
        manifest: parseJsonBufferSync(data)
      };
    }
    return { passed };
  } catch (err) {
    switch (util3.types.isNativeError(err) && "code" in err && err.code) {
      case "ENOENT":
        return { passed: false };
      case "EINTEGRITY": {
        lib_default.unlinkSync(filename);
        return { passed: false };
      }
    }
    throw err;
  }
}
function checkFile(filename, checkedAt) {
  try {
    const { mtimeMs, size } = fs3.statSync(filename);
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

// ../store/cafs/lib/readManifestFromStore.js
function readManifestFromStore(storeDir, pkgIndex) {
  const pkg = pkgIndex.files.get("package.json");
  if (pkg) {
    const fileName = getFilePathByModeInCafs(storeDir, pkg.integrity, pkg.mode);
    return parseJsonBufferSync(lib_default.readFileSync(fileName));
  }
  return void 0;
}

// ../store/cafs/lib/writeBufferToCafs.js
var import_rename_overwrite = __toESM(require_rename_overwrite(), 1);
import fs4 from "fs";
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
    if (!(util4.types.isNativeError(err) && "code" in err && err.code === "ENOENT") || !fs4.existsSync(fileDest))
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
  const existingFile = fs4.statSync(filename, { throwIfNoEntry: false });
  if (!existingFile)
    return false;
  return verifyFileIntegrity(filename, {
    size: existingFile.size,
    integrity
  }).passed;
}

// ../store/cafs/lib/index.js
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
  const integrity = import_ssri3.default.fromData(buffer);
  const isExecutable = modeIsExecutable(mode);
  const fileDest = contentPathFromHex(isExecutable ? "exec" : "nonexec", integrity.hexDigest());
  const { checkedAt, filePath } = writeBufferToCafs2(buffer, fileDest, isExecutable ? 493 : void 0, integrity);
  return { checkedAt, integrity, filePath };
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
    } catch (e) {
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
var import_fs_extra = __toESM(require_lib3(), 1);
import fs5 from "fs";
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
  for (const [filename, src] of filenames) {
    const sanitizedFilename = filename.split("/").map((f) => (0, import_sanitize_filename.default)(f)).join("/");
    if (sanitizedFilename !== filename) {
      invalidFilenames.push(filename);
    }
    sanitizedFilenames.set(sanitizedFilename, src);
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
  Array.from(allDirs).sort((d1, d2) => d1.length - d2.length).forEach((dir) => fs5.mkdirSync(path6.join(newDir, dir), { recursive: true }));
  for (const [f, src] of filenames) {
    const dest = path6.join(newDir, f);
    importFile(src, dest);
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
function moveOrMergeModulesDirs(src, dest) {
  try {
    renameEvenAcrossDevices(src, dest);
  } catch (err) {
    switch (util5.types.isNativeError(err) && "code" in err && err.code) {
      case "ENOENT":
        return;
      case "ENOTEMPTY":
      case "EPERM":
        mergeModulesDirs(src, dest);
        return;
      default:
        throw err;
    }
  }
}
function renameEvenAcrossDevices(src, dest) {
  try {
    lib_default.renameSync(src, dest);
  } catch (err) {
    if (!(util5.types.isNativeError(err) && "code" in err && err.code === "EXDEV"))
      throw err;
    import_fs_extra.default.copySync(src, dest);
  }
}
function mergeModulesDirs(src, dest) {
  const srcFiles = fs5.readdirSync(src);
  const destFiles = new Set(fs5.readdirSync(dest));
  const filesToMove = srcFiles.filter((file) => !destFiles.has(file));
  for (const file of filesToMove) {
    renameEvenAcrossDevices(path6.join(src, file), path6.join(dest, file));
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
  return (src, dest) => {
    try {
      lib_default.copyFileSync(src, dest, constants.COPYFILE_FICLONE_FORCE);
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

// ../../../.local/share/pnpm/store/v10/links/mimic-function/5.0.1/a0a3d68a83883043b47a3c9aac58c3570e777a4fa469a6af68c2aa6a72df0b04/node_modules/mimic-function/index.js
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

// ../../../.local/share/pnpm/store/v10/links/memoize/10.2.0/d21689fadc7625bc10c7b3b0f7e41e2aea3227bccbd7d2474a41caa6a90dd228/node_modules/memoize/distribution/index.js
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
  let isBuilt;
  let filesIndex;
  if (targetEngine && filesResponse.sideEffects?.has(targetEngine)) {
    filesIndex = applySideEffectsDiff(filesResponse.filesIndex, filesResponse.sideEffects.get(targetEngine));
    isBuilt = true;
  } else if (filesResponse.unprocessed !== true) {
    return {
      filesMap: filesResponse.filesIndex,
      isBuilt: false
    };
  } else {
    filesIndex = filesResponse.filesIndex;
    isBuilt = false;
  }
  const filesMap = /* @__PURE__ */ new Map();
  for (const [fileName, { integrity, mode }] of filesIndex) {
    filesMap.set(fileName, getFilePathByModeInCafs(storeDir, integrity, mode));
  }
  return { filesMap, isBuilt };
}
function applySideEffectsDiff(baseFiles, { added, deleted }) {
  const filesWithSideEffects = new Map(added);
  for (const [fileName, fileInfo] of baseFiles) {
    if (!deleted?.includes(fileName) && !filesWithSideEffects.has(fileName)) {
      filesWithSideEffects.set(fileName, fileInfo);
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
      await fs6.mkdir(tmpDir, { recursive: true });
      return tmpDir;
    }
  };
}

// ../exec/pkg-requires-build/lib/index.js
function pkgRequiresBuild(manifest, filesIndex) {
  return Boolean(manifest?.scripts != null && (Boolean(manifest.scripts.preinstall) || Boolean(manifest.scripts.install) || Boolean(manifest.scripts.postinstall)) || filesIncludeInstallScripts(filesIndex));
}
function filesIncludeInstallScripts(filesIndex) {
  if (filesIndex.has("binding.gyp")) {
    return true;
  }
  for (const filename of filesIndex.keys()) {
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
import fs7 from "fs";
var import_rename_overwrite3 = __toESM(require_rename_overwrite(), 1);
var import_path_temp3 = __toESM(require_path_temp(), 1);
function hardLinkDir(src, destDirs) {
  if (destDirs.length === 0)
    return;
  const filteredDestDirs = [];
  const tempDestDirs = [];
  for (const destDir of destDirs) {
    if (path9.relative(destDir, src) === "") {
      continue;
    }
    filteredDestDirs.push(destDir);
    tempDestDirs.push((0, import_path_temp3.default)(path9.dirname(destDir)));
  }
  _hardLinkDir(src, tempDestDirs, true);
  for (let i = 0; i < filteredDestDirs.length; i++) {
    (0, import_rename_overwrite3.sync)(tempDestDirs[i], filteredDestDirs[i]);
  }
}
function _hardLinkDir(src, destDirs, isRoot) {
  let files = [];
  try {
    files = fs7.readdirSync(src);
  } catch (err) {
    if (!isRoot || !(util7.types.isNativeError(err) && "code" in err && err.code === "ENOENT"))
      throw err;
    globalWarn(`Source directory not found when creating hardLinks for: ${src}. Creating destinations as empty: ${destDirs.join(", ")}`);
    for (const dir of destDirs) {
      lib_default.mkdirSync(dir, { recursive: true });
    }
    return;
  }
  for (const file of files) {
    if (file === "node_modules")
      continue;
    const srcFile = path9.join(src, file);
    if (fs7.lstatSync(srcFile).isDirectory()) {
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
var INTEGRITY_REGEX = /^([^-]+)-([a-z0-9+/=]+)$/i;
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
        let { storeDir, filesIndexFile, readManifest, verifyStoreIntegrity } = message;
        let pkgFilesIndex;
        try {
          pkgFilesIndex = readV8FileStrictSync(filesIndexFile);
          if (pkgFilesIndex?.files && !(pkgFilesIndex.files instanceof Map)) {
            pkgFilesIndex = void 0;
          }
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
        let verifyResult;
        if (pkgFilesIndex.requiresBuild == null) {
          readManifest = true;
        }
        if (verifyStoreIntegrity) {
          verifyResult = checkPkgFilesIntegrity(storeDir, pkgFilesIndex, readManifest);
        } else {
          verifyResult = {
            passed: true,
            manifest: readManifest ? readManifestFromStore(storeDir, pkgFilesIndex) : void 0
          };
        }
        const requiresBuild = pkgFilesIndex.requiresBuild ?? pkgRequiresBuild(verifyResult.manifest, pkgFilesIndex.files);
        parentPort.postMessage({
          status: "success",
          value: {
            verified: verifyResult.passed,
            manifest: verifyResult.manifest,
            pkgFilesIndex,
            requiresBuild
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
        message: e.message ?? e.toString()
      }
    });
  }
}
function addTarballToStore({ buffer, storeDir, integrity, filesIndexFile, appendManifest }) {
  if (integrity) {
    const [, algo, integrityHash] = integrity.match(INTEGRITY_REGEX);
    const normalizedRemoteHash = Buffer.from(integrityHash, "base64").toString("hex");
    const calculatedHash = crypto.hash(algo, buffer, "hex");
    if (calculatedHash !== normalizedRemoteHash) {
      return {
        status: "error",
        error: {
          type: "integrity_validation_failed",
          algorithm: algo,
          expected: integrity,
          found: `${algo}-${Buffer.from(calculatedHash, "hex").toString("base64")}`
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
  const requiresBuild = writeFilesIndexFile(filesIndexFile, { manifest: manifest ?? {}, files: filesIntegrity });
  return {
    status: "success",
    value: {
      filesIndex: filesMap,
      manifest,
      requiresBuild,
      integrity: integrity ?? calcIntegrity(buffer)
    }
  };
}
function calcIntegrity(buffer) {
  const calculatedHash = crypto.hash("sha512", buffer, "hex");
  return `sha512-${Buffer.from(calculatedHash, "hex").toString("base64")}`;
}
function initStore({ storeDir }) {
  fs8.mkdirSync(storeDir, { recursive: true });
  try {
    const hexChars = "0123456789abcdef".split("");
    for (const subDir of ["files", "index"]) {
      const subDirPath = path11.join(storeDir, subDir);
      fs8.mkdirSync(subDirPath);
      for (const hex1 of hexChars) {
        for (const hex2 of hexChars) {
          fs8.mkdirSync(path11.join(subDirPath, `${hex1}${hex2}`));
        }
      }
    }
  } catch {
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
    let filesIndex2;
    try {
      filesIndex2 = readV8FileStrictSync(filesIndexFile);
    } catch {
      return {
        status: "success",
        value: {
          filesIndex: filesMap,
          manifest,
          requiresBuild: pkgRequiresBuild(manifest, filesIntegrity)
        }
      };
    }
    filesIndex2.sideEffects ??= /* @__PURE__ */ new Map();
    filesIndex2.sideEffects.set(sideEffectsCacheKey, calculateDiff(filesIndex2.files, filesIntegrity));
    if (filesIndex2.requiresBuild == null) {
      requiresBuild = pkgRequiresBuild(manifest, filesIntegrity);
    } else {
      requiresBuild = filesIndex2.requiresBuild;
    }
    writeV8File(filesIndexFile, filesIndex2);
  } else {
    requiresBuild = writeFilesIndexFile(filesIndexFile, { manifest: manifest ?? {}, files: filesIntegrity });
  }
  return { status: "success", value: { filesIndex: filesMap, manifest, requiresBuild } };
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
  for (const file of /* @__PURE__ */ new Set([...baseFiles.keys(), ...sideEffectsFiles.keys()])) {
    if (!sideEffectsFiles.has(file)) {
      deleted.push(file);
    } else if (!baseFiles.has(file) || baseFiles.get(file).integrity !== sideEffectsFiles.get(file).integrity || baseFiles.get(file).mode !== sideEffectsFiles.get(file).mode) {
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
  for (const [k, { checkedAt, filePath, integrity, mode, size }] of filesIndex) {
    filesIntegrity.set(k, {
      checkedAt,
      integrity: integrity.toString(),
      // TODO: use the raw Integrity object
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
function writeFilesIndexFile(filesIndexFile, { manifest, files, sideEffects }) {
  const requiresBuild = pkgRequiresBuild(manifest, files);
  const filesIndex = {
    name: manifest.name,
    version: manifest.version,
    requiresBuild,
    files,
    sideEffects
  };
  writeV8File(filesIndexFile, filesIndex);
  return requiresBuild;
}
function writeV8File(filePath, data) {
  const targetDir = path11.dirname(filePath);
  fs8.mkdirSync(targetDir, { recursive: true });
  const temp = `${filePath.slice(0, -9)}${process.pid}`;
  lib_default.writeFileSync(temp, v82.serialize(data));
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
