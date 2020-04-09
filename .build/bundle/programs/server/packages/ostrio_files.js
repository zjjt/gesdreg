(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var _ = Package.underscore._;
var check = Package.check.check;
var Match = Package.check.Match;
var Random = Package.random.Random;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

/* Package-scope variables */
var FilesCollection;

var require = meteorInstall({"node_modules":{"meteor":{"ostrio:files":{"server.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ostrio_files/server.js                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                          //
                                                                                                                       //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                                 //
                                                                                                                       //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                            //
                                                                                                                       //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                   //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
module.export({                                                                                                        // 1
  FilesCollection: function () {                                                                                       // 1
    return FilesCollection;                                                                                            // 1
  }                                                                                                                    // 1
});                                                                                                                    // 1
                                                                                                                       //
var _ = void 0;                                                                                                        // 1
                                                                                                                       //
module.watch(require("meteor/underscore"), {                                                                           // 1
  _: function (v) {                                                                                                    // 1
    _ = v;                                                                                                             // 1
  }                                                                                                                    // 1
}, 0);                                                                                                                 // 1
var Mongo = void 0;                                                                                                    // 1
module.watch(require("meteor/mongo"), {                                                                                // 1
  Mongo: function (v) {                                                                                                // 1
    Mongo = v;                                                                                                         // 1
  }                                                                                                                    // 1
}, 1);                                                                                                                 // 1
var WebApp = void 0;                                                                                                   // 1
module.watch(require("meteor/webapp"), {                                                                               // 1
  WebApp: function (v) {                                                                                               // 1
    WebApp = v;                                                                                                        // 1
  }                                                                                                                    // 1
}, 2);                                                                                                                 // 1
var Meteor = void 0;                                                                                                   // 1
module.watch(require("meteor/meteor"), {                                                                               // 1
  Meteor: function (v) {                                                                                               // 1
    Meteor = v;                                                                                                        // 1
  }                                                                                                                    // 1
}, 3);                                                                                                                 // 1
var Random = void 0;                                                                                                   // 1
module.watch(require("meteor/random"), {                                                                               // 1
  Random: function (v) {                                                                                               // 1
    Random = v;                                                                                                        // 1
  }                                                                                                                    // 1
}, 4);                                                                                                                 // 1
var Cookies = void 0;                                                                                                  // 1
module.watch(require("meteor/ostrio:cookies"), {                                                                       // 1
  Cookies: function (v) {                                                                                              // 1
    Cookies = v;                                                                                                       // 1
  }                                                                                                                    // 1
}, 5);                                                                                                                 // 1
var WriteStream = void 0;                                                                                              // 1
module.watch(require("./write-stream.js"), {                                                                           // 1
  "default": function (v) {                                                                                            // 1
    WriteStream = v;                                                                                                   // 1
  }                                                                                                                    // 1
}, 6);                                                                                                                 // 1
var check = void 0,                                                                                                    // 1
    Match = void 0;                                                                                                    // 1
module.watch(require("meteor/check"), {                                                                                // 1
  check: function (v) {                                                                                                // 1
    check = v;                                                                                                         // 1
  },                                                                                                                   // 1
  Match: function (v) {                                                                                                // 1
    Match = v;                                                                                                         // 1
  }                                                                                                                    // 1
}, 7);                                                                                                                 // 1
var FilesCollectionCore = void 0;                                                                                      // 1
module.watch(require("./core.js"), {                                                                                   // 1
  "default": function (v) {                                                                                            // 1
    FilesCollectionCore = v;                                                                                           // 1
  }                                                                                                                    // 1
}, 8);                                                                                                                 // 1
var fixJSONParse = void 0,                                                                                             // 1
    fixJSONStringify = void 0;                                                                                         // 1
module.watch(require("./lib.js"), {                                                                                    // 1
  fixJSONParse: function (v) {                                                                                         // 1
    fixJSONParse = v;                                                                                                  // 1
  },                                                                                                                   // 1
  fixJSONStringify: function (v) {                                                                                     // 1
    fixJSONStringify = v;                                                                                              // 1
  }                                                                                                                    // 1
}, 9);                                                                                                                 // 1
var fs = void 0;                                                                                                       // 1
module.watch(require("fs-extra"), {                                                                                    // 1
  "default": function (v) {                                                                                            // 1
    fs = v;                                                                                                            // 1
  }                                                                                                                    // 1
}, 10);                                                                                                                // 1
var nodeQs = void 0;                                                                                                   // 1
module.watch(require("querystring"), {                                                                                 // 1
  "default": function (v) {                                                                                            // 1
    nodeQs = v;                                                                                                        // 1
  }                                                                                                                    // 1
}, 11);                                                                                                                // 1
var request = void 0;                                                                                                  // 1
module.watch(require("request"), {                                                                                     // 1
  "default": function (v) {                                                                                            // 1
    request = v;                                                                                                       // 1
  }                                                                                                                    // 1
}, 12);                                                                                                                // 1
var fileType = void 0;                                                                                                 // 1
module.watch(require("file-type"), {                                                                                   // 1
  "default": function (v) {                                                                                            // 1
    fileType = v;                                                                                                      // 1
  }                                                                                                                    // 1
}, 13);                                                                                                                // 1
var nodePath = void 0;                                                                                                 // 1
module.watch(require("path"), {                                                                                        // 1
  "default": function (v) {                                                                                            // 1
    nodePath = v;                                                                                                      // 1
  }                                                                                                                    // 1
}, 14);                                                                                                                // 1
/*                                                                                                                     // 18
 * @const {Object} bound  - Meteor.bindEnvironment (Fiber wrapper)                                                     //
 * @const {Function} NOOP - No Operation function, placeholder for required callbacks                                  //
 */var bound = Meteor.bindEnvironment(function (callback) {                                                            //
  return callback();                                                                                                   // 22
});                                                                                                                    // 22
                                                                                                                       //
var NOOP = function () {}; /*                                                                                          // 23
                            * @locus Anywhere                                                                          //
                            * @class FilesCollection                                                                   //
                            * @param config           {Object}   - [Both]   Configuration object with next properties:
                            * @param config.debug     {Boolean}  - [Both]   Turn on/of debugging and extra logging     //
                            * @param config.schema    {Object}   - [Both]   Collection Schema                          //
                            * @param config.public    {Boolean}  - [Both]   Store files in folder accessible for proxy servers, for limits, and more - read docs
                            * @param config.strict    {Boolean}  - [Server] Strict mode for partial content, if is `true` server will return `416` response code, when `range` is not specified, otherwise server return `206`
                            * @param config.protected {Function} - [Server] If `true` - files will be served only to authorized users, if `function()` - you're able to check visitor's permissions in your own way function's context has:
                            *  - `request`                                                                             //
                            *  - `response`                                                                            //
                            *  - `user()`                                                                              //
                            *  - `userId`                                                                              //
                            * @param config.chunkSize      {Number}  - [Both] Upload chunk size, default: 524288 bytes (0,5 Mb)
                            * @param config.permissions    {Number}  - [Server] Permissions which will be set to uploaded files (octal), like: `511` or `0o755`. Default: 0644
                            * @param config.parentDirPermissions {Number}  - [Server] Permissions which will be set to parent directory of uploaded files (octal), like: `611` or `0o777`. Default: 0755
                            * @param config.storagePath    {String|Function}  - [Server] Storage path on file system   //
                            * @param config.cacheControl   {String}  - [Server] Default `Cache-Control` header         //
                            * @param config.responseHeaders {Object|Function} - [Server] Custom response headers, if function is passed, must return Object
                            * @param config.throttle       {Number}  - [Server] DEPRECATED bps throttle threshold      //
                            * @param config.downloadRoute  {String}  - [Both]   Server Route used to retrieve files    //
                            * @param config.collection     {Mongo.Collection} - [Both] Mongo Collection Instance       //
                            * @param config.collectionName {String}  - [Both]   Collection name                        //
                            * @param config.namingFunction {Function}- [Both]   Function which returns `String`        //
                            * @param config.integrityCheck {Boolean} - [Server] Check file's integrity before serving to users
                            * @param config.onAfterUpload  {Function}- [Server] Called right after file is ready on FS. Use to transfer file somewhere else, or do other thing with file directly
                            * @param config.onAfterRemove  {Function} - [Server] Called right after file is removed. Removed objects is passed to callback
                            * @param config.continueUploadTTL {Number} - [Server] Time in seconds, during upload may be continued, default 3 hours (10800 seconds)
                            * @param config.onBeforeUpload {Function}- [Both]   Function which executes on server after receiving each chunk and on client right before beginning upload. Function context is `File` - so you are able to check for extension, mime-type, size and etc.:
                            *  - return `true` to continue                                                             //
                            *  - return `false` or `String` to abort upload                                            //
                            * @param config.onInitiateUpload {Function} - [Server] Function which executes on server right before upload is begin and right after `onBeforeUpload` hook. This hook is fully asynchronous.
                            * @param config.onBeforeRemove {Function} - [Server] Executes before removing file on server, so you can check permissions. Return `true` to allow action and `false` to deny.
                            * @param config.allowClientCode  {Boolean}  - [Both]   Allow to run `remove` from client   //
                            * @param config.downloadCallback {Function} - [Server] Callback triggered each time file is requested, return truthy value to continue download, or falsy to abort
                            * @param config.interceptDownload {Function} - [Server] Intercept download request, so you can serve file from third-party resource, arguments {http: {request: {...}, response: {...}}, fileRef: {...}}
                            * @param config.disableUpload {Boolean} - Disable file upload, useful for server only solutions
                            * @param config.disableDownload {Boolean} - Disable file download (serving), useful for file management only solutions
                            * @summary Create new instance of FilesCollection                                          //
                            */                                                                                         //
                                                                                                                       //
var FilesCollection = function (_FilesCollectionCore) {                                                                //
  (0, _inherits3.default)(FilesCollection, _FilesCollectionCore);                                                      //
                                                                                                                       //
  function FilesCollection(config) {                                                                                   // 66
    (0, _classCallCheck3.default)(this, FilesCollection);                                                              // 66
                                                                                                                       //
    var _this = (0, _possibleConstructorReturn3.default)(this, _FilesCollectionCore.call(this));                       // 66
                                                                                                                       //
    var storagePath = void 0;                                                                                          // 68
                                                                                                                       //
    if (config) {                                                                                                      // 69
      storagePath = config.storagePath;                                                                                // 71
      _this.debug = config.debug;                                                                                      // 72
      _this.schema = config.schema;                                                                                    // 73
      _this.public = config.public;                                                                                    // 74
      _this.strict = config.strict;                                                                                    // 75
      _this.chunkSize = config.chunkSize;                                                                              // 76
      _this.protected = config.protected;                                                                              // 77
      _this.collection = config.collection;                                                                            // 78
      _this.permissions = config.permissions;                                                                          // 79
      _this.cacheControl = config.cacheControl;                                                                        // 80
      _this.downloadRoute = config.downloadRoute;                                                                      // 81
      _this.onAfterUpload = config.onAfterUpload;                                                                      // 82
      _this.onAfterRemove = config.onAfterRemove;                                                                      // 83
      _this.disableUpload = config.disableUpload;                                                                      // 84
      _this.onBeforeRemove = config.onBeforeRemove;                                                                    // 85
      _this.integrityCheck = config.integrityCheck;                                                                    // 86
      _this.collectionName = config.collectionName;                                                                    // 87
      _this.onBeforeUpload = config.onBeforeUpload;                                                                    // 88
      _this.namingFunction = config.namingFunction;                                                                    // 89
      _this.responseHeaders = config.responseHeaders;                                                                  // 90
      _this.disableDownload = config.disableDownload;                                                                  // 91
      _this.allowClientCode = config.allowClientCode;                                                                  // 92
      _this.downloadCallback = config.downloadCallback;                                                                // 93
      _this.onInitiateUpload = config.onInitiateUpload;                                                                // 94
      _this.interceptDownload = config.interceptDownload;                                                              // 95
      _this.continueUploadTTL = config.continueUploadTTL;                                                              // 96
      _this.parentDirPermissions = config.parentDirPermissions;                                                        // 97
    }                                                                                                                  // 99
                                                                                                                       //
    var self = _this;                                                                                                  // 101
    var cookie = new Cookies();                                                                                        // 102
                                                                                                                       //
    if (!_.isBoolean(_this.debug)) {                                                                                   // 104
      _this.debug = false;                                                                                             // 105
    }                                                                                                                  // 106
                                                                                                                       //
    if (!_.isBoolean(_this.public)) {                                                                                  // 108
      _this.public = false;                                                                                            // 109
    }                                                                                                                  // 110
                                                                                                                       //
    if (!_this.protected) {                                                                                            // 112
      _this.protected = false;                                                                                         // 113
    }                                                                                                                  // 114
                                                                                                                       //
    if (!_this.chunkSize) {                                                                                            // 116
      _this.chunkSize = 1024 * 512;                                                                                    // 117
    }                                                                                                                  // 118
                                                                                                                       //
    _this.chunkSize = Math.floor(_this.chunkSize / 8) * 8;                                                             // 120
                                                                                                                       //
    if (!_.isString(_this.collectionName) && !_this.collection) {                                                      // 122
      _this.collectionName = 'MeteorUploadFiles';                                                                      // 123
    }                                                                                                                  // 124
                                                                                                                       //
    if (!_this.collection) {                                                                                           // 126
      _this.collection = new Mongo.Collection(_this.collectionName);                                                   // 127
    } else {                                                                                                           // 128
      _this.collectionName = _this.collection._name;                                                                   // 129
    }                                                                                                                  // 130
                                                                                                                       //
    _this.collection.filesCollection = _this;                                                                          // 132
    check(_this.collectionName, String);                                                                               // 133
                                                                                                                       //
    if (_this.public && !_this.downloadRoute) {                                                                        // 135
      throw new Meteor.Error(500, "[FilesCollection." + _this.collectionName + "]: \"downloadRoute\" must be precisely provided on \"public\" collections! Note: \"downloadRoute\" must be equal or be inside of your web/proxy-server (relative) root.");
    }                                                                                                                  // 137
                                                                                                                       //
    if (!_.isString(_this.downloadRoute)) {                                                                            // 139
      _this.downloadRoute = '/cdn/storage';                                                                            // 140
    }                                                                                                                  // 141
                                                                                                                       //
    _this.downloadRoute = _this.downloadRoute.replace(/\/$/, '');                                                      // 143
                                                                                                                       //
    if (!_.isFunction(_this.namingFunction)) {                                                                         // 145
      _this.namingFunction = false;                                                                                    // 146
    }                                                                                                                  // 147
                                                                                                                       //
    if (!_.isFunction(_this.onBeforeUpload)) {                                                                         // 149
      _this.onBeforeUpload = false;                                                                                    // 150
    }                                                                                                                  // 151
                                                                                                                       //
    if (!_.isBoolean(_this.allowClientCode)) {                                                                         // 153
      _this.allowClientCode = true;                                                                                    // 154
    }                                                                                                                  // 155
                                                                                                                       //
    if (!_.isFunction(_this.onInitiateUpload)) {                                                                       // 157
      _this.onInitiateUpload = false;                                                                                  // 158
    }                                                                                                                  // 159
                                                                                                                       //
    if (!_.isFunction(_this.interceptDownload)) {                                                                      // 161
      _this.interceptDownload = false;                                                                                 // 162
    }                                                                                                                  // 163
                                                                                                                       //
    if (!_.isBoolean(_this.strict)) {                                                                                  // 165
      _this.strict = true;                                                                                             // 166
    }                                                                                                                  // 167
                                                                                                                       //
    if (!_.isNumber(_this.permissions)) {                                                                              // 169
      _this.permissions = parseInt('644', 8);                                                                          // 170
    }                                                                                                                  // 171
                                                                                                                       //
    if (!_.isNumber(_this.parentDirPermissions)) {                                                                     // 173
      _this.parentDirPermissions = parseInt('755', 8);                                                                 // 174
    }                                                                                                                  // 175
                                                                                                                       //
    if (!_.isString(_this.cacheControl)) {                                                                             // 177
      _this.cacheControl = 'public, max-age=31536000, s-maxage=31536000';                                              // 178
    }                                                                                                                  // 179
                                                                                                                       //
    if (!_.isFunction(_this.onAfterUpload)) {                                                                          // 181
      _this.onAfterUpload = false;                                                                                     // 182
    }                                                                                                                  // 183
                                                                                                                       //
    if (!_.isBoolean(_this.disableUpload)) {                                                                           // 185
      _this.disableUpload = false;                                                                                     // 186
    }                                                                                                                  // 187
                                                                                                                       //
    if (!_.isFunction(_this.onAfterRemove)) {                                                                          // 189
      _this.onAfterRemove = false;                                                                                     // 190
    }                                                                                                                  // 191
                                                                                                                       //
    if (!_.isFunction(_this.onBeforeRemove)) {                                                                         // 193
      _this.onBeforeRemove = false;                                                                                    // 194
    }                                                                                                                  // 195
                                                                                                                       //
    if (!_.isBoolean(_this.integrityCheck)) {                                                                          // 197
      _this.integrityCheck = true;                                                                                     // 198
    }                                                                                                                  // 199
                                                                                                                       //
    if (!_.isBoolean(_this.disableDownload)) {                                                                         // 201
      _this.disableDownload = false;                                                                                   // 202
    }                                                                                                                  // 203
                                                                                                                       //
    if (!_.isObject(_this._currentUploads)) {                                                                          // 205
      _this._currentUploads = {};                                                                                      // 206
    }                                                                                                                  // 207
                                                                                                                       //
    if (!_.isFunction(_this.downloadCallback)) {                                                                       // 209
      _this.downloadCallback = false;                                                                                  // 210
    }                                                                                                                  // 211
                                                                                                                       //
    if (!_.isNumber(_this.continueUploadTTL)) {                                                                        // 213
      _this.continueUploadTTL = 10800;                                                                                 // 214
    }                                                                                                                  // 215
                                                                                                                       //
    if (!_.isFunction(_this.responseHeaders)) {                                                                        // 217
      _this.responseHeaders = function (responseCode, fileRef, versionRef) {                                           // 218
        var headers = {};                                                                                              // 219
                                                                                                                       //
        switch (responseCode) {                                                                                        // 221
          case '206':                                                                                                  // 222
            headers.Pragma = 'private';                                                                                // 223
            headers.Trailer = 'expires';                                                                               // 224
            headers['Transfer-Encoding'] = 'chunked';                                                                  // 225
            break;                                                                                                     // 226
                                                                                                                       //
          case '400':                                                                                                  // 227
            headers['Cache-Control'] = 'no-cache';                                                                     // 228
            break;                                                                                                     // 229
                                                                                                                       //
          case '416':                                                                                                  // 230
            headers['Content-Range'] = "bytes */" + versionRef.size;                                                   // 231
            break;                                                                                                     // 232
                                                                                                                       //
          default:                                                                                                     // 233
            break;                                                                                                     // 234
        }                                                                                                              // 221
                                                                                                                       //
        headers.Connection = 'keep-alive';                                                                             // 237
        headers['Content-Type'] = versionRef.type || 'application/octet-stream';                                       // 238
        headers['Accept-Ranges'] = 'bytes';                                                                            // 239
        return headers;                                                                                                // 240
      };                                                                                                               // 241
    }                                                                                                                  // 242
                                                                                                                       //
    if (_this.public && !storagePath) {                                                                                // 244
      throw new Meteor.Error(500, "[FilesCollection." + _this.collectionName + "] \"storagePath\" must be set on \"public\" collections! Note: \"storagePath\" must be equal on be inside of your web/proxy-server (absolute) root.");
    }                                                                                                                  // 246
                                                                                                                       //
    if (!storagePath) {                                                                                                // 248
      storagePath = function () {                                                                                      // 249
        return "assets" + nodePath.sep + "app" + nodePath.sep + "uploads" + nodePath.sep + self.collectionName;        // 250
      };                                                                                                               // 251
    }                                                                                                                  // 252
                                                                                                                       //
    if (_.isString(storagePath)) {                                                                                     // 254
      _this.storagePath = function () {                                                                                // 255
        return storagePath;                                                                                            // 255
      };                                                                                                               // 255
    } else {                                                                                                           // 256
      _this.storagePath = function () {                                                                                // 257
        var sp = storagePath.apply(self, arguments);                                                                   // 258
                                                                                                                       //
        if (!_.isString(sp)) {                                                                                         // 259
          throw new Meteor.Error(400, "[FilesCollection." + self.collectionName + "] \"storagePath\" function must return a String!");
        }                                                                                                              // 261
                                                                                                                       //
        sp = sp.replace(/\/$/, '');                                                                                    // 262
        return nodePath.normalize(sp);                                                                                 // 263
      };                                                                                                               // 264
    }                                                                                                                  // 265
                                                                                                                       //
    _this._debug('[FilesCollection.storagePath] Set to:', _this.storagePath({}));                                      // 267
                                                                                                                       //
    fs.mkdirs(_this.storagePath({}), {                                                                                 // 269
      mode: _this.parentDirPermissions                                                                                 // 269
    }, function (error) {                                                                                              // 269
      if (error) {                                                                                                     // 270
        throw new Meteor.Error(401, "[FilesCollection." + self.collectionName + "] Path \"" + _this.storagePath({}) + "\" is not writable! " + error);
      }                                                                                                                // 272
    });                                                                                                                // 273
    check(_this.strict, Boolean);                                                                                      // 275
    check(_this.permissions, Number);                                                                                  // 276
    check(_this.storagePath, Function);                                                                                // 277
    check(_this.cacheControl, String);                                                                                 // 278
    check(_this.onAfterRemove, Match.OneOf(false, Function));                                                          // 279
    check(_this.onAfterUpload, Match.OneOf(false, Function));                                                          // 280
    check(_this.disableUpload, Boolean);                                                                               // 281
    check(_this.integrityCheck, Boolean);                                                                              // 282
    check(_this.onBeforeRemove, Match.OneOf(false, Function));                                                         // 283
    check(_this.disableDownload, Boolean);                                                                             // 284
    check(_this.downloadCallback, Match.OneOf(false, Function));                                                       // 285
    check(_this.interceptDownload, Match.OneOf(false, Function));                                                      // 286
    check(_this.continueUploadTTL, Number);                                                                            // 287
    check(_this.responseHeaders, Match.OneOf(Object, Function));                                                       // 288
                                                                                                                       //
    if (!_this.disableUpload) {                                                                                        // 290
      _this._preCollection = new Mongo.Collection("__pre_" + _this.collectionName);                                    // 291
                                                                                                                       //
      _this._preCollection._ensureIndex({                                                                              // 292
        createdAt: 1                                                                                                   // 292
      }, {                                                                                                             // 292
        expireAfterSeconds: _this.continueUploadTTL,                                                                   // 292
        background: true                                                                                               // 292
      });                                                                                                              // 292
                                                                                                                       //
      var _preCollectionCursor = _this._preCollection.find({}, {                                                       // 293
        fields: {                                                                                                      // 294
          _id: 1,                                                                                                      // 295
          isFinished: 1                                                                                                // 296
        }                                                                                                              // 294
      });                                                                                                              // 293
                                                                                                                       //
      _preCollectionCursor.observe({                                                                                   // 300
        changed: function (doc) {                                                                                      // 301
          if (doc.isFinished) {                                                                                        // 302
            self._debug("[FilesCollection] [_preCollectionCursor.observe] [changed]: " + doc._id);                     // 303
                                                                                                                       //
            self._preCollection.remove({                                                                               // 304
              _id: doc._id                                                                                             // 304
            }, NOOP);                                                                                                  // 304
          }                                                                                                            // 305
        },                                                                                                             // 306
        removed: function (doc) {                                                                                      // 307
          // Free memory after upload is done                                                                          // 308
          // Or if upload is unfinished                                                                                // 309
          self._debug("[FilesCollection] [_preCollectionCursor.observe] [removed]: " + doc._id);                       // 310
                                                                                                                       //
          if (_.isObject(self._currentUploads[doc._id])) {                                                             // 311
            self._currentUploads[doc._id].stop();                                                                      // 312
                                                                                                                       //
            self._currentUploads[doc._id].end();                                                                       // 313
                                                                                                                       //
            if (!doc.isFinished) {                                                                                     // 315
              self._debug("[FilesCollection] [_preCollectionCursor.observe] [removeUnfinishedUpload]: " + doc._id);    // 316
                                                                                                                       //
              self._currentUploads[doc._id].abort();                                                                   // 317
            }                                                                                                          // 318
                                                                                                                       //
            delete self._currentUploads[doc._id];                                                                      // 320
          }                                                                                                            // 321
        }                                                                                                              // 322
      });                                                                                                              // 300
                                                                                                                       //
      _this._createStream = function (_id, path, opts) {                                                               // 325
        _this._currentUploads[_id] = new WriteStream(path, opts.fileLength, opts, _this.permissions);                  // 326
      }; // This little function allows to continue upload                                                             // 327
      // even after server is restarted (*not on dev-stage*)                                                           // 330
                                                                                                                       //
                                                                                                                       //
      _this._continueUpload = function (_id) {                                                                         // 331
        if (_this._currentUploads[_id] && _this._currentUploads[_id].file) {                                           // 332
          if (!_this._currentUploads[_id].aborted && !_this._currentUploads[_id].ended) {                              // 333
            return _this._currentUploads[_id].file;                                                                    // 334
          }                                                                                                            // 335
                                                                                                                       //
          _this._createStream(_id, _this._currentUploads[_id].file.file.path, _this._currentUploads[_id].file);        // 336
                                                                                                                       //
          return _this._currentUploads[_id].file;                                                                      // 337
        }                                                                                                              // 338
                                                                                                                       //
        var contUpld = _this._preCollection.findOne({                                                                  // 339
          _id: _id                                                                                                     // 339
        });                                                                                                            // 339
                                                                                                                       //
        if (contUpld) {                                                                                                // 340
          _this._createStream(_id, contUpld.file.path, contUpld);                                                      // 341
                                                                                                                       //
          return _this._currentUploads[_id].file;                                                                      // 342
        }                                                                                                              // 343
                                                                                                                       //
        return false;                                                                                                  // 344
      };                                                                                                               // 345
    }                                                                                                                  // 346
                                                                                                                       //
    if (!_this.schema) {                                                                                               // 348
      _this.schema = FilesCollectionCore.schema;                                                                       // 349
    }                                                                                                                  // 350
                                                                                                                       //
    check(_this.debug, Boolean);                                                                                       // 352
    check(_this.schema, Object);                                                                                       // 353
    check(_this.public, Boolean);                                                                                      // 354
    check(_this.protected, Match.OneOf(Boolean, Function));                                                            // 355
    check(_this.chunkSize, Number);                                                                                    // 356
    check(_this.downloadRoute, String);                                                                                // 357
    check(_this.namingFunction, Match.OneOf(false, Function));                                                         // 358
    check(_this.onBeforeUpload, Match.OneOf(false, Function));                                                         // 359
    check(_this.onInitiateUpload, Match.OneOf(false, Function));                                                       // 360
    check(_this.allowClientCode, Boolean);                                                                             // 361
                                                                                                                       //
    if (_this.public && _this.protected) {                                                                             // 363
      throw new Meteor.Error(500, "[FilesCollection." + _this.collectionName + "]: Files can not be public and protected at the same time!");
    }                                                                                                                  // 365
                                                                                                                       //
    _this._checkAccess = function (http) {                                                                             // 367
      if (_this.protected) {                                                                                           // 368
        var result = void 0;                                                                                           // 369
                                                                                                                       //
        var _this$_getUser = _this._getUser(http),                                                                     // 368
            user = _this$_getUser.user,                                                                                // 368
            userId = _this$_getUser.userId;                                                                            // 368
                                                                                                                       //
        if (_.isFunction(_this.protected)) {                                                                           // 372
          var fileRef = void 0;                                                                                        // 373
                                                                                                                       //
          if (_.isObject(http.params) && http.params._id) {                                                            // 374
            fileRef = _this.collection.findOne(http.params._id);                                                       // 375
          }                                                                                                            // 376
                                                                                                                       //
          result = http ? _this.protected.call(_.extend(http, {                                                        // 378
            user: user,                                                                                                // 378
            userId: userId                                                                                             // 378
          }), fileRef || null) : _this.protected.call({                                                                // 378
            user: user,                                                                                                // 378
            userId: userId                                                                                             // 378
          }, fileRef || null);                                                                                         // 378
        } else {                                                                                                       // 379
          result = !!userId;                                                                                           // 380
        }                                                                                                              // 381
                                                                                                                       //
        if (http && result === true || !http) {                                                                        // 383
          return true;                                                                                                 // 384
        }                                                                                                              // 385
                                                                                                                       //
        var rc = _.isNumber(result) ? result : 401;                                                                    // 387
                                                                                                                       //
        _this._debug('[FilesCollection._checkAccess] WARN: Access denied!');                                           // 388
                                                                                                                       //
        if (http) {                                                                                                    // 389
          var text = 'Access denied!';                                                                                 // 390
                                                                                                                       //
          if (!http.response.headersSent) {                                                                            // 391
            http.response.writeHead(rc, {                                                                              // 392
              'Content-Type': 'text/plain',                                                                            // 393
              'Content-Length': text.length                                                                            // 394
            });                                                                                                        // 392
          }                                                                                                            // 396
                                                                                                                       //
          if (!http.response.finished) {                                                                               // 398
            http.response.end(text);                                                                                   // 399
          }                                                                                                            // 400
        }                                                                                                              // 401
                                                                                                                       //
        return false;                                                                                                  // 403
      }                                                                                                                // 404
                                                                                                                       //
      return true;                                                                                                     // 405
    };                                                                                                                 // 406
                                                                                                                       //
    _this._methodNames = {                                                                                             // 408
      _Abort: "_FilesCollectionAbort_" + _this.collectionName,                                                         // 409
      _Write: "_FilesCollectionWrite_" + _this.collectionName,                                                         // 410
      _Start: "_FilesCollectionStart_" + _this.collectionName,                                                         // 411
      _Remove: "_FilesCollectionRemove_" + _this.collectionName                                                        // 412
    };                                                                                                                 // 408
                                                                                                                       //
    _this.on('_handleUpload', _this._handleUpload);                                                                    // 415
                                                                                                                       //
    _this.on('_finishUpload', _this._finishUpload);                                                                    // 416
                                                                                                                       //
    if (!_this.disableUpload && !_this.disableDownload) {                                                              // 418
      WebApp.connectHandlers.use(function (httpReq, httpResp, next) {                                                  // 419
        if (!_this.disableUpload && !!~httpReq._parsedUrl.path.indexOf(_this.downloadRoute + "/" + _this.collectionName + "/__upload")) {
          if (httpReq.method === 'POST') {                                                                             // 421
            var handleError = function (_error) {                                                                      // 422
              var error = _error;                                                                                      // 423
              console.warn('[FilesCollection] [Upload] [HTTP] Exception:', error);                                     // 424
              console.trace();                                                                                         // 425
                                                                                                                       //
              if (!httpResp.headersSent) {                                                                             // 427
                httpResp.writeHead(500);                                                                               // 428
              }                                                                                                        // 429
                                                                                                                       //
              if (!httpResp.finished) {                                                                                // 431
                if (_.isObject(error) && _.isFunction(error.toString)) {                                               // 432
                  error = error.toString();                                                                            // 433
                }                                                                                                      // 434
                                                                                                                       //
                if (!_.isString(error)) {                                                                              // 436
                  error = 'Unexpected error!';                                                                         // 437
                }                                                                                                      // 438
                                                                                                                       //
                httpResp.end(JSON.stringify({                                                                          // 440
                  error: error                                                                                         // 440
                }));                                                                                                   // 440
              }                                                                                                        // 441
            };                                                                                                         // 442
                                                                                                                       //
            var body = '';                                                                                             // 444
            httpReq.on('data', function (data) {                                                                       // 445
              return bound(function () {                                                                               // 445
                body += data;                                                                                          // 446
              });                                                                                                      // 447
            });                                                                                                        // 445
            httpReq.on('end', function () {                                                                            // 449
              return bound(function () {                                                                               // 449
                try {                                                                                                  // 450
                  var opts = void 0;                                                                                   // 451
                  var result = void 0;                                                                                 // 452
                  var user = void 0;                                                                                   // 453
                                                                                                                       //
                  if (httpReq.headers['x-mtok'] && _.isObject(Meteor.server.sessions) && _.has(Meteor.server.sessions[httpReq.headers['x-mtok']], 'userId')) {
                    user = {                                                                                           // 456
                      userId: Meteor.server.sessions[httpReq.headers['x-mtok']].userId                                 // 457
                    };                                                                                                 // 456
                  } else {                                                                                             // 459
                    user = _this._getUser({                                                                            // 460
                      request: httpReq,                                                                                // 460
                      response: httpResp                                                                               // 460
                    });                                                                                                // 460
                  }                                                                                                    // 461
                                                                                                                       //
                  if (httpReq.headers['x-start'] !== '1') {                                                            // 463
                    opts = {                                                                                           // 464
                      fileId: httpReq.headers['x-fileid']                                                              // 465
                    };                                                                                                 // 464
                                                                                                                       //
                    if (httpReq.headers['x-eof'] === '1') {                                                            // 468
                      opts.eof = true;                                                                                 // 469
                    } else {                                                                                           // 470
                      if (typeof Buffer.from === 'function') {                                                         // 471
                        try {                                                                                          // 472
                          opts.binData = Buffer.from(body, 'base64');                                                  // 473
                        } catch (buffErr) {                                                                            // 474
                          opts.binData = new Buffer(body, 'base64');                                                   // 475
                        }                                                                                              // 476
                      } else {                                                                                         // 477
                        opts.binData = new Buffer(body, 'base64');                                                     // 478
                      }                                                                                                // 479
                                                                                                                       //
                      opts.chunkId = parseInt(httpReq.headers['x-chunkid']);                                           // 480
                    }                                                                                                  // 481
                                                                                                                       //
                    var _continueUpload = _this._continueUpload(opts.fileId);                                          // 483
                                                                                                                       //
                    if (!_continueUpload) {                                                                            // 484
                      throw new Meteor.Error(408, 'Can\'t continue upload, session expired. Start upload again.');     // 485
                    }                                                                                                  // 486
                                                                                                                       //
                    var _this$_prepareUpload = _this._prepareUpload(_.extend(opts, _continueUpload), user.userId, 'HTTP');
                                                                                                                       //
                    result = _this$_prepareUpload.result;                                                              // 488
                    opts = _this$_prepareUpload.opts;                                                                  // 488
                                                                                                                       //
                    if (opts.eof) {                                                                                    // 490
                      _this._handleUpload(result, opts, function () {                                                  // 491
                        if (!httpResp.headersSent) {                                                                   // 492
                          httpResp.writeHead(200);                                                                     // 493
                        }                                                                                              // 494
                                                                                                                       //
                        if (_.isObject(result.file) && result.file.meta) {                                             // 496
                          result.file.meta = fixJSONStringify(result.file.meta);                                       // 497
                        }                                                                                              // 498
                                                                                                                       //
                        if (!httpResp.finished) {                                                                      // 500
                          httpResp.end(JSON.stringify(result));                                                        // 501
                        }                                                                                              // 502
                      });                                                                                              // 503
                                                                                                                       //
                      return;                                                                                          // 504
                    }                                                                                                  // 505
                                                                                                                       //
                    _this.emit('_handleUpload', result, opts, NOOP);                                                   // 507
                                                                                                                       //
                    if (!httpResp.headersSent) {                                                                       // 509
                      httpResp.writeHead(204);                                                                         // 510
                    }                                                                                                  // 511
                                                                                                                       //
                    if (!httpResp.finished) {                                                                          // 512
                      httpResp.end();                                                                                  // 513
                    }                                                                                                  // 514
                  } else {                                                                                             // 515
                    try {                                                                                              // 516
                      opts = JSON.parse(body);                                                                         // 517
                    } catch (jsonErr) {                                                                                // 518
                      console.error('Can\'t parse incoming JSON from Client on [.insert() | upload], something went wrong!', jsonErr);
                      opts = {                                                                                         // 520
                        file: {}                                                                                       // 520
                      };                                                                                               // 520
                    }                                                                                                  // 521
                                                                                                                       //
                    if (!_.isObject(opts.file)) {                                                                      // 523
                      opts.file = {};                                                                                  // 524
                    }                                                                                                  // 525
                                                                                                                       //
                    opts.___s = true;                                                                                  // 527
                                                                                                                       //
                    _this._debug("[FilesCollection] [File Start HTTP] " + (opts.file.name || '[no-name]') + " - " + opts.fileId);
                                                                                                                       //
                    if (_.isObject(opts.file) && opts.file.meta) {                                                     // 529
                      opts.file.meta = fixJSONParse(opts.file.meta);                                                   // 530
                    }                                                                                                  // 531
                                                                                                                       //
                    var _this$_prepareUpload2 = _this._prepareUpload(_.clone(opts), user.userId, 'HTTP Start Method');
                                                                                                                       //
                    result = _this$_prepareUpload2.result;                                                             // 533
                                                                                                                       //
                    if (_this.collection.findOne(result._id)) {                                                        // 535
                      throw new Meteor.Error(400, 'Can\'t start upload, data substitution detected!');                 // 536
                    }                                                                                                  // 537
                                                                                                                       //
                    opts._id = opts.fileId;                                                                            // 539
                    opts.createdAt = new Date();                                                                       // 540
                    opts.maxLength = opts.fileLength;                                                                  // 541
                                                                                                                       //
                    _this._preCollection.insert(_.omit(opts, '___s'));                                                 // 542
                                                                                                                       //
                    _this._createStream(result._id, result.path, _.omit(opts, '___s'));                                // 543
                                                                                                                       //
                    if (opts.returnMeta) {                                                                             // 545
                      if (!httpResp.headersSent) {                                                                     // 546
                        httpResp.writeHead(200);                                                                       // 547
                      }                                                                                                // 548
                                                                                                                       //
                      if (!httpResp.finished) {                                                                        // 550
                        httpResp.end(JSON.stringify({                                                                  // 551
                          uploadRoute: _this.downloadRoute + "/" + _this.collectionName + "/__upload",                 // 552
                          file: result                                                                                 // 553
                        }));                                                                                           // 551
                      }                                                                                                // 555
                    } else {                                                                                           // 556
                      if (!httpResp.headersSent) {                                                                     // 557
                        httpResp.writeHead(204);                                                                       // 558
                      }                                                                                                // 559
                                                                                                                       //
                      if (!httpResp.finished) {                                                                        // 561
                        httpResp.end();                                                                                // 562
                      }                                                                                                // 563
                    }                                                                                                  // 564
                  }                                                                                                    // 565
                } catch (httpRespErr) {                                                                                // 566
                  handleError(httpRespErr);                                                                            // 567
                }                                                                                                      // 568
              });                                                                                                      // 569
            });                                                                                                        // 449
          } else {                                                                                                     // 570
            next();                                                                                                    // 571
          }                                                                                                            // 572
                                                                                                                       //
          return;                                                                                                      // 573
        }                                                                                                              // 574
                                                                                                                       //
        if (!_this.disableDownload) {                                                                                  // 576
          var http = void 0;                                                                                           // 577
          var params = void 0;                                                                                         // 578
          var uri = void 0;                                                                                            // 579
          var uris = void 0;                                                                                           // 580
                                                                                                                       //
          if (!_this.public) {                                                                                         // 582
            if (!!~httpReq._parsedUrl.path.indexOf(_this.downloadRoute + "/" + _this.collectionName)) {                // 583
              uri = httpReq._parsedUrl.path.replace(_this.downloadRoute + "/" + _this.collectionName, '');             // 584
                                                                                                                       //
              if (uri.indexOf('/') === 0) {                                                                            // 585
                uri = uri.substring(1);                                                                                // 586
              }                                                                                                        // 587
                                                                                                                       //
              uris = uri.split('/');                                                                                   // 589
                                                                                                                       //
              if (uris.length === 3) {                                                                                 // 590
                params = {                                                                                             // 591
                  _id: uris[0],                                                                                        // 592
                  query: httpReq._parsedUrl.query ? nodeQs.parse(httpReq._parsedUrl.query) : {},                       // 593
                  name: uris[2].split('?')[0],                                                                         // 594
                  version: uris[1]                                                                                     // 595
                };                                                                                                     // 591
                http = {                                                                                               // 598
                  request: httpReq,                                                                                    // 598
                  response: httpResp,                                                                                  // 598
                  params: params                                                                                       // 598
                };                                                                                                     // 598
                                                                                                                       //
                if (_this._checkAccess(http)) {                                                                        // 599
                  _this.download(http, uris[1], _this.collection.findOne(uris[0]));                                    // 600
                }                                                                                                      // 601
              } else {                                                                                                 // 602
                next();                                                                                                // 603
              }                                                                                                        // 604
            } else {                                                                                                   // 605
              next();                                                                                                  // 606
            }                                                                                                          // 607
          } else {                                                                                                     // 608
            if (!!~httpReq._parsedUrl.path.indexOf("" + _this.downloadRoute)) {                                        // 609
              uri = httpReq._parsedUrl.path.replace("" + _this.downloadRoute, '');                                     // 610
                                                                                                                       //
              if (uri.indexOf('/') === 0) {                                                                            // 611
                uri = uri.substring(1);                                                                                // 612
              }                                                                                                        // 613
                                                                                                                       //
              uris = uri.split('/');                                                                                   // 615
              var _file = uris[uris.length - 1];                                                                       // 616
                                                                                                                       //
              if (_file) {                                                                                             // 617
                var version = void 0;                                                                                  // 618
                                                                                                                       //
                if (!!~_file.indexOf('-')) {                                                                           // 619
                  version = _file.split('-')[0];                                                                       // 620
                  _file = _file.split('-')[1].split('?')[0];                                                           // 621
                } else {                                                                                               // 622
                  version = 'original';                                                                                // 623
                  _file = _file.split('?')[0];                                                                         // 624
                }                                                                                                      // 625
                                                                                                                       //
                params = {                                                                                             // 627
                  query: httpReq._parsedUrl.query ? nodeQs.parse(httpReq._parsedUrl.query) : {},                       // 628
                  file: _file,                                                                                         // 629
                  _id: _file.split('.')[0],                                                                            // 630
                  version: version,                                                                                    // 631
                  name: _file                                                                                          // 632
                };                                                                                                     // 627
                http = {                                                                                               // 634
                  request: httpReq,                                                                                    // 634
                  response: httpResp,                                                                                  // 634
                  params: params                                                                                       // 634
                };                                                                                                     // 634
                                                                                                                       //
                _this.download(http, version, _this.collection.findOne(params._id));                                   // 635
              } else {                                                                                                 // 636
                next();                                                                                                // 637
              }                                                                                                        // 638
            } else {                                                                                                   // 639
              next();                                                                                                  // 640
            }                                                                                                          // 641
          }                                                                                                            // 642
                                                                                                                       //
          return;                                                                                                      // 643
        }                                                                                                              // 644
                                                                                                                       //
        next();                                                                                                        // 645
      });                                                                                                              // 646
    }                                                                                                                  // 647
                                                                                                                       //
    if (!_this.disableUpload) {                                                                                        // 649
      var _methods = {}; // Method used to remove file                                                                 // 650
      // from Client side                                                                                              // 653
                                                                                                                       //
      _methods[_this._methodNames._Remove] = function (selector) {                                                     // 654
        check(selector, Match.OneOf(String, Object));                                                                  // 655
                                                                                                                       //
        self._debug("[FilesCollection] [Unlink Method] [.remove(" + selector + ")]");                                  // 656
                                                                                                                       //
        if (self.allowClientCode) {                                                                                    // 658
          if (self.onBeforeRemove && _.isFunction(self.onBeforeRemove)) {                                              // 659
            var userId = this.userId;                                                                                  // 660
            var userFuncs = {                                                                                          // 661
              userId: this.userId,                                                                                     // 662
              user: function () {                                                                                      // 663
                if (Meteor.users) {                                                                                    // 664
                  return Meteor.users.findOne(userId);                                                                 // 665
                }                                                                                                      // 666
                                                                                                                       //
                return null;                                                                                           // 667
              }                                                                                                        // 668
            };                                                                                                         // 661
                                                                                                                       //
            if (!self.onBeforeRemove.call(userFuncs, self.find(selector) || null)) {                                   // 671
              throw new Meteor.Error(403, '[FilesCollection] [remove] Not permitted!');                                // 672
            }                                                                                                          // 673
          }                                                                                                            // 674
                                                                                                                       //
          var cursor = self.find(selector);                                                                            // 676
                                                                                                                       //
          if (cursor.count() > 0) {                                                                                    // 677
            self.remove(selector);                                                                                     // 678
            return true;                                                                                               // 679
          }                                                                                                            // 680
                                                                                                                       //
          throw new Meteor.Error(404, 'Cursor is empty, no files is removed');                                         // 681
        } else {                                                                                                       // 682
          throw new Meteor.Error(401, '[FilesCollection] [remove] Run code from client is not allowed!');              // 683
        }                                                                                                              // 684
      }; // Method used to receive "first byte" of upload                                                              // 685
      // and all file's meta-data, so                                                                                  // 689
      // it won't be transferred with every chunk                                                                      // 690
      // Basically it prepares everything                                                                              // 691
      // So user can pause/disconnect and                                                                              // 692
      // continue upload later, during `continueUploadTTL`                                                             // 693
                                                                                                                       //
                                                                                                                       //
      _methods[_this._methodNames._Start] = function (opts, returnMeta) {                                              // 694
        check(opts, {                                                                                                  // 695
          file: Object,                                                                                                // 696
          fileId: String,                                                                                              // 697
          FSName: Match.Optional(String),                                                                              // 698
          chunkSize: Number,                                                                                           // 699
          fileLength: Number                                                                                           // 700
        });                                                                                                            // 695
        check(returnMeta, Match.Optional(Boolean));                                                                    // 703
                                                                                                                       //
        self._debug("[FilesCollection] [File Start Method] " + opts.file.name + " - " + opts.fileId);                  // 705
                                                                                                                       //
        opts.___s = true;                                                                                              // 706
                                                                                                                       //
        var _self$_prepareUpload = self._prepareUpload(_.clone(opts), this.userId, 'DDP Start Method'),                // 694
            result = _self$_prepareUpload.result;                                                                      // 694
                                                                                                                       //
        if (self.collection.findOne(result._id)) {                                                                     // 709
          throw new Meteor.Error(400, 'Can\'t start upload, data substitution detected!');                             // 710
        }                                                                                                              // 711
                                                                                                                       //
        opts._id = opts.fileId;                                                                                        // 713
        opts.createdAt = new Date();                                                                                   // 714
        opts.maxLength = opts.fileLength;                                                                              // 715
                                                                                                                       //
        self._preCollection.insert(_.omit(opts, '___s'));                                                              // 716
                                                                                                                       //
        self._createStream(result._id, result.path, _.omit(opts, '___s'));                                             // 717
                                                                                                                       //
        if (returnMeta) {                                                                                              // 719
          return {                                                                                                     // 720
            uploadRoute: self.downloadRoute + "/" + self.collectionName + "/__upload",                                 // 721
            file: result                                                                                               // 722
          };                                                                                                           // 720
        }                                                                                                              // 724
                                                                                                                       //
        return true;                                                                                                   // 725
      }; // Method used to write file chunks                                                                           // 726
      // it receives very limited amount of meta-data                                                                  // 730
      // This method also responsible for EOF                                                                          // 731
                                                                                                                       //
                                                                                                                       //
      _methods[_this._methodNames._Write] = function (opts) {                                                          // 732
        var result = void 0;                                                                                           // 733
        check(opts, {                                                                                                  // 734
          eof: Match.Optional(Boolean),                                                                                // 735
          fileId: String,                                                                                              // 736
          binData: Match.Optional(String),                                                                             // 737
          chunkId: Match.Optional(Number)                                                                              // 738
        });                                                                                                            // 734
                                                                                                                       //
        if (opts.binData) {                                                                                            // 741
          if (typeof Buffer.from === 'function') {                                                                     // 742
            try {                                                                                                      // 743
              opts.binData = Buffer.from(opts.binData, 'base64');                                                      // 744
            } catch (buffErr) {                                                                                        // 745
              opts.binData = new Buffer(opts.binData, 'base64');                                                       // 746
            }                                                                                                          // 747
          } else {                                                                                                     // 748
            opts.binData = new Buffer(opts.binData, 'base64');                                                         // 749
          }                                                                                                            // 750
        }                                                                                                              // 751
                                                                                                                       //
        var _continueUpload = self._continueUpload(opts.fileId);                                                       // 753
                                                                                                                       //
        if (!_continueUpload) {                                                                                        // 754
          throw new Meteor.Error(408, 'Can\'t continue upload, session expired. Start upload again.');                 // 755
        }                                                                                                              // 756
                                                                                                                       //
        this.unblock();                                                                                                // 758
                                                                                                                       //
        var _self$_prepareUpload2 = self._prepareUpload(_.extend(opts, _continueUpload), this.userId, 'DDP');          // 732
                                                                                                                       //
        result = _self$_prepareUpload2.result;                                                                         // 759
        opts = _self$_prepareUpload2.opts;                                                                             // 759
                                                                                                                       //
        if (opts.eof) {                                                                                                // 761
          try {                                                                                                        // 762
            return Meteor.wrapAsync(self._handleUpload.bind(self, result, opts))();                                    // 763
          } catch (handleUploadErr) {                                                                                  // 764
            self._debug('[FilesCollection] [Write Method] [DDP] Exception:', handleUploadErr);                         // 765
                                                                                                                       //
            throw handleUploadErr;                                                                                     // 766
          }                                                                                                            // 767
        } else {                                                                                                       // 768
          self.emit('_handleUpload', result, opts, NOOP);                                                              // 769
        }                                                                                                              // 770
                                                                                                                       //
        return true;                                                                                                   // 771
      }; // Method used to Abort upload                                                                                // 772
      // - Feeing memory by .end()ing writableStreams                                                                  // 775
      // - Removing temporary record from @_preCollection                                                              // 776
      // - Removing record from @collection                                                                            // 777
      // - .unlink()ing chunks from FS                                                                                 // 778
                                                                                                                       //
                                                                                                                       //
      _methods[_this._methodNames._Abort] = function (_id) {                                                           // 779
        check(_id, String);                                                                                            // 780
                                                                                                                       //
        var _continueUpload = self._continueUpload(_id);                                                               // 782
                                                                                                                       //
        self._debug("[FilesCollection] [Abort Method]: " + _id + " - " + (_.isObject(_continueUpload.file) ? _continueUpload.file.path : ''));
                                                                                                                       //
        if (self._currentUploads && self._currentUploads[_id]) {                                                       // 785
          self._currentUploads[_id].stop();                                                                            // 786
                                                                                                                       //
          self._currentUploads[_id].abort();                                                                           // 787
        }                                                                                                              // 788
                                                                                                                       //
        if (_continueUpload) {                                                                                         // 790
          self._preCollection.remove({                                                                                 // 791
            _id: _id                                                                                                   // 791
          });                                                                                                          // 791
                                                                                                                       //
          self.remove({                                                                                                // 792
            _id: _id                                                                                                   // 792
          });                                                                                                          // 792
                                                                                                                       //
          if (_.isObject(_continueUpload.file) && _continueUpload.file.path) {                                         // 793
            self.unlink({                                                                                              // 794
              _id: _id,                                                                                                // 794
              path: _continueUpload.file.path                                                                          // 794
            });                                                                                                        // 794
          }                                                                                                            // 795
        }                                                                                                              // 796
                                                                                                                       //
        return true;                                                                                                   // 797
      };                                                                                                               // 798
                                                                                                                       //
      Meteor.methods(_methods);                                                                                        // 800
    }                                                                                                                  // 801
                                                                                                                       //
    return _this;                                                                                                      // 66
  } /*                                                                                                                 // 802
     * @locus Server                                                                                                   //
     * @memberOf FilesCollection                                                                                       //
     * @name _prepareUpload                                                                                            //
     * @summary Internal method. Used to optimize received data and check upload permission                            //
     * @returns {Object}                                                                                               //
     */                                                                                                                //
                                                                                                                       //
  FilesCollection.prototype._prepareUpload = function () {                                                             //
    function _prepareUpload() {                                                                                        //
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};                               // 811
      var userId = arguments[1];                                                                                       // 811
      var transport = arguments[2];                                                                                    // 811
      var ctx = void 0;                                                                                                // 812
                                                                                                                       //
      if (!_.isBoolean(opts.eof)) {                                                                                    // 813
        opts.eof = false;                                                                                              // 814
      }                                                                                                                // 815
                                                                                                                       //
      if (!opts.binData) {                                                                                             // 817
        opts.binData = 'EOF';                                                                                          // 818
      }                                                                                                                // 819
                                                                                                                       //
      if (!_.isNumber(opts.chunkId)) {                                                                                 // 821
        opts.chunkId = -1;                                                                                             // 822
      }                                                                                                                // 823
                                                                                                                       //
      if (!_.isString(opts.FSName)) {                                                                                  // 825
        opts.FSName = opts.fileId;                                                                                     // 826
      }                                                                                                                // 827
                                                                                                                       //
      this._debug("[FilesCollection] [Upload] [" + transport + "] Got #" + opts.chunkId + "/" + opts.fileLength + " chunks, dst: " + (opts.file.name || opts.file.fileName));
                                                                                                                       //
      var fileName = this._getFileName(opts.file);                                                                     // 831
                                                                                                                       //
      var _getExt = this._getExt(fileName),                                                                            // 811
          extension = _getExt.extension,                                                                               // 811
          extensionWithDot = _getExt.extensionWithDot;                                                                 // 811
                                                                                                                       //
      if (!_.isObject(opts.file.meta)) {                                                                               // 834
        opts.file.meta = {};                                                                                           // 835
      }                                                                                                                // 836
                                                                                                                       //
      var result = opts.file;                                                                                          // 838
      result.name = fileName;                                                                                          // 839
      result.meta = opts.file.meta;                                                                                    // 840
      result.extension = extension;                                                                                    // 841
      result.ext = extension;                                                                                          // 842
      result._id = opts.fileId;                                                                                        // 843
      result.userId = userId || null;                                                                                  // 844
      opts.FSName = opts.FSName.replace(/([^a-z0-9\-\_]+)/gi, '-');                                                    // 845
      result.path = "" + this.storagePath(result) + nodePath.sep + opts.FSName + extensionWithDot;                     // 846
      result = _.extend(result, this._dataToSchema(result));                                                           // 847
                                                                                                                       //
      if (this.onBeforeUpload && _.isFunction(this.onBeforeUpload)) {                                                  // 849
        ctx = _.extend({                                                                                               // 850
          file: opts.file                                                                                              // 851
        }, {                                                                                                           // 850
          chunkId: opts.chunkId,                                                                                       // 853
          userId: result.userId,                                                                                       // 854
          user: function () {                                                                                          // 855
            if (Meteor.users && result.userId) {                                                                       // 856
              return Meteor.users.findOne(result.userId);                                                              // 857
            }                                                                                                          // 858
                                                                                                                       //
            return null;                                                                                               // 859
          },                                                                                                           // 860
          eof: opts.eof                                                                                                // 861
        });                                                                                                            // 852
        var isUploadAllowed = this.onBeforeUpload.call(ctx, result);                                                   // 863
                                                                                                                       //
        if (isUploadAllowed !== true) {                                                                                // 865
          throw new Meteor.Error(403, _.isString(isUploadAllowed) ? isUploadAllowed : '@onBeforeUpload() returned false');
        } else {                                                                                                       // 867
          if (opts.___s === true && this.onInitiateUpload && _.isFunction(this.onInitiateUpload)) {                    // 868
            this.onInitiateUpload.call(ctx, result);                                                                   // 869
          }                                                                                                            // 870
        }                                                                                                              // 871
      } else if (opts.___s === true && this.onInitiateUpload && _.isFunction(this.onInitiateUpload)) {                 // 872
        ctx = _.extend({                                                                                               // 873
          file: opts.file                                                                                              // 874
        }, {                                                                                                           // 873
          chunkId: opts.chunkId,                                                                                       // 876
          userId: result.userId,                                                                                       // 877
          user: function () {                                                                                          // 878
            if (Meteor.users && result.userId) {                                                                       // 879
              return Meteor.users.findOne(result.userId);                                                              // 880
            }                                                                                                          // 881
                                                                                                                       //
            return null;                                                                                               // 882
          },                                                                                                           // 883
          eof: opts.eof                                                                                                // 884
        });                                                                                                            // 875
        this.onInitiateUpload.call(ctx, result);                                                                       // 886
      }                                                                                                                // 887
                                                                                                                       //
      return {                                                                                                         // 889
        result: result,                                                                                                // 889
        opts: opts                                                                                                     // 889
      };                                                                                                               // 889
    }                                                                                                                  // 890
                                                                                                                       //
    return _prepareUpload;                                                                                             //
  }(); /*                                                                                                              //
        * @locus Server                                                                                                //
        * @memberOf FilesCollection                                                                                    //
        * @name _finishUpload                                                                                          //
        * @summary Internal method. Finish upload, close Writable stream, add record to MongoDB and flush used memory  //
        * @returns {undefined}                                                                                         //
        */                                                                                                             //
                                                                                                                       //
  FilesCollection.prototype._finishUpload = function () {                                                              //
    function _finishUpload(result, opts, cb) {                                                                         //
      var _this2 = this;                                                                                               // 899
                                                                                                                       //
      this._debug("[FilesCollection] [Upload] [finish(ing)Upload] -> " + result.path);                                 // 900
                                                                                                                       //
      fs.chmod(result.path, this.permissions, NOOP);                                                                   // 901
      result.type = this._getMimeType(opts.file);                                                                      // 902
      result.public = this.public;                                                                                     // 903
                                                                                                                       //
      this._updateFileTypes(result);                                                                                   // 904
                                                                                                                       //
      this.collection.insert(_.clone(result), function (error, _id) {                                                  // 906
        if (error) {                                                                                                   // 907
          cb && cb(error);                                                                                             // 908
                                                                                                                       //
          _this2._debug('[FilesCollection] [Upload] [_finishUpload] Error:', error);                                   // 909
        } else {                                                                                                       // 910
          _this2._preCollection.update({                                                                               // 911
            _id: opts.fileId                                                                                           // 911
          }, {                                                                                                         // 911
            $set: {                                                                                                    // 911
              isFinished: true                                                                                         // 911
            }                                                                                                          // 911
          });                                                                                                          // 911
                                                                                                                       //
          result._id = _id;                                                                                            // 912
                                                                                                                       //
          _this2._debug("[FilesCollection] [Upload] [finish(ed)Upload] -> " + result.path);                            // 913
                                                                                                                       //
          _this2.onAfterUpload && _this2.onAfterUpload.call(_this2, result);                                           // 914
                                                                                                                       //
          _this2.emit('afterUpload', result);                                                                          // 915
                                                                                                                       //
          cb && cb(null, result);                                                                                      // 916
        }                                                                                                              // 917
      });                                                                                                              // 918
    }                                                                                                                  // 919
                                                                                                                       //
    return _finishUpload;                                                                                              //
  }(); /*                                                                                                              //
        * @locus Server                                                                                                //
        * @memberOf FilesCollection                                                                                    //
        * @name _handleUpload                                                                                          //
        * @summary Internal method to handle upload process, pipe incoming data to Writable stream                     //
        * @returns {undefined}                                                                                         //
        */                                                                                                             //
                                                                                                                       //
  FilesCollection.prototype._handleUpload = function () {                                                              //
    function _handleUpload(result, opts, cb) {                                                                         //
      var _this3 = this;                                                                                               // 928
                                                                                                                       //
      try {                                                                                                            // 929
        if (opts.eof) {                                                                                                // 930
          this._currentUploads[result._id].end(function () {                                                           // 931
            _this3.emit('_finishUpload', result, opts, cb);                                                            // 932
          });                                                                                                          // 933
        } else {                                                                                                       // 934
          this._currentUploads[result._id].write(opts.chunkId, opts.binData, cb);                                      // 935
        }                                                                                                              // 936
      } catch (e) {                                                                                                    // 937
        this._debug('[_handleUpload] [EXCEPTION:]', e);                                                                // 938
                                                                                                                       //
        cb && cb(e);                                                                                                   // 939
      }                                                                                                                // 940
    }                                                                                                                  // 941
                                                                                                                       //
    return _handleUpload;                                                                                              //
  }(); /*                                                                                                              //
        * @locus Anywhere                                                                                              //
        * @memberOf FilesCollection                                                                                    //
        * @name _getMimeType                                                                                           //
        * @param {Object} fileData - File Object                                                                       //
        * @summary Returns file's mime-type                                                                            //
        * @returns {String}                                                                                            //
        */                                                                                                             //
                                                                                                                       //
  FilesCollection.prototype._getMimeType = function () {                                                               //
    function _getMimeType(fileData) {                                                                                  //
      var mime = void 0;                                                                                               // 952
      check(fileData, Object);                                                                                         // 953
                                                                                                                       //
      if (_.isObject(fileData) && fileData.type) {                                                                     // 954
        mime = fileData.type;                                                                                          // 955
      }                                                                                                                // 956
                                                                                                                       //
      if (fileData.path && (!mime || !_.isString(mime))) {                                                             // 958
        try {                                                                                                          // 959
          var buf = new Buffer(262);                                                                                   // 960
          var fd = fs.openSync(fileData.path, 'r');                                                                    // 961
          var br = fs.readSync(fd, buf, 0, 262, 0);                                                                    // 962
          fs.close(fd, NOOP);                                                                                          // 963
                                                                                                                       //
          if (br < 262) {                                                                                              // 964
            buf = buf.slice(0, br);                                                                                    // 965
          }                                                                                                            // 966
                                                                                                                       //
          var _fileType = fileType(buf);                                                                               // 959
                                                                                                                       //
          mime = _fileType.mime;                                                                                       // 967
        } catch (e) {// We're good                                                                                     // 968
        }                                                                                                              // 970
      }                                                                                                                // 971
                                                                                                                       //
      if (!mime || !_.isString(mime)) {                                                                                // 973
        mime = 'application/octet-stream';                                                                             // 974
      }                                                                                                                // 975
                                                                                                                       //
      return mime;                                                                                                     // 976
    }                                                                                                                  // 977
                                                                                                                       //
    return _getMimeType;                                                                                               //
  }(); /*                                                                                                              //
        * @locus Anywhere                                                                                              //
        * @memberOf FilesCollection                                                                                    //
        * @name _getUser                                                                                               //
        * @summary Returns object with `userId` and `user()` method which return user's object                         //
        * @returns {Object}                                                                                            //
        */                                                                                                             //
                                                                                                                       //
  FilesCollection.prototype._getUser = function () {                                                                   //
    function _getUser(http) {                                                                                          //
      var result = {                                                                                                   // 987
        user: function () {                                                                                            // 988
          return null;                                                                                                 // 988
        },                                                                                                             // 988
        userId: null                                                                                                   // 989
      };                                                                                                               // 987
                                                                                                                       //
      if (http) {                                                                                                      // 992
        var mtok = null;                                                                                               // 993
                                                                                                                       //
        if (http.request.headers['x-mtok']) {                                                                          // 994
          mtok = http.request.headers['x-mtok'];                                                                       // 995
        } else {                                                                                                       // 996
          var cookie = http.request.Cookies;                                                                           // 997
                                                                                                                       //
          if (cookie.has('x_mtok')) {                                                                                  // 998
            mtok = cookie.get('x_mtok');                                                                               // 999
          }                                                                                                            // 1000
        }                                                                                                              // 1001
                                                                                                                       //
        if (mtok) {                                                                                                    // 1003
          var userId = _.isObject(Meteor.server.sessions) && _.isObject(Meteor.server.sessions[mtok]) ? Meteor.server.sessions[mtok].userId : void 0;
                                                                                                                       //
          if (userId) {                                                                                                // 1006
            result.user = function () {                                                                                // 1007
              return Meteor.users.findOne(userId);                                                                     // 1007
            };                                                                                                         // 1007
                                                                                                                       //
            result.userId = userId;                                                                                    // 1008
          }                                                                                                            // 1009
        }                                                                                                              // 1010
      }                                                                                                                // 1011
                                                                                                                       //
      return result;                                                                                                   // 1013
    }                                                                                                                  // 1014
                                                                                                                       //
    return _getUser;                                                                                                   //
  }(); /*                                                                                                              //
        * @locus Server                                                                                                //
        * @memberOf FilesCollection                                                                                    //
        * @name write                                                                                                  //
        * @param {Buffer} buffer - Binary File's Buffer                                                                //
        * @param {Object} opts - Object with file-data                                                                 //
        * @param {String} opts.name - File name, alias: `fileName`                                                     //
        * @param {String} opts.type - File mime-type                                                                   //
        * @param {Object} opts.meta - File additional meta-data                                                        //
        * @param {String} opts.userId - UserId, default *null*                                                         //
        * @param {String} opts.fileId - _id, default *null*                                                            //
        * @param {Function} callback - function(error, fileObj){...}                                                   //
        * @param {Boolean} proceedAfterUpload - Proceed onAfterUpload hook                                             //
        * @summary Write buffer to FS and add to FilesCollection Collection                                            //
        * @returns {FilesCollection} Instance                                                                          //
        */                                                                                                             //
                                                                                                                       //
  FilesCollection.prototype.write = function () {                                                                      //
    function write(buffer) {                                                                                           //
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};                               // 1032
                                                                                                                       //
      var _this4 = this;                                                                                               // 1032
                                                                                                                       //
      var callback = arguments[2];                                                                                     // 1032
      var proceedAfterUpload = arguments[3];                                                                           // 1032
                                                                                                                       //
      this._debug('[FilesCollection] [write()]');                                                                      // 1033
                                                                                                                       //
      if (_.isFunction(opts)) {                                                                                        // 1035
        proceedAfterUpload = callback;                                                                                 // 1036
        callback = opts;                                                                                               // 1037
        opts = {};                                                                                                     // 1038
      } else if (_.isBoolean(callback)) {                                                                              // 1039
        proceedAfterUpload = callback;                                                                                 // 1040
      } else if (_.isBoolean(opts)) {                                                                                  // 1041
        proceedAfterUpload = opts;                                                                                     // 1042
      }                                                                                                                // 1043
                                                                                                                       //
      check(opts, Match.Optional(Object));                                                                             // 1045
      check(callback, Match.Optional(Function));                                                                       // 1046
      check(proceedAfterUpload, Match.Optional(Boolean));                                                              // 1047
      var fileId = opts.fileId || Random.id();                                                                         // 1049
      var FSName = this.namingFunction ? this.namingFunction(opts) : fileId;                                           // 1050
      var fileName = opts.name || opts.fileName ? opts.name || opts.fileName : FSName;                                 // 1051
                                                                                                                       //
      var _getExt2 = this._getExt(fileName),                                                                           // 1032
          extension = _getExt2.extension,                                                                              // 1032
          extensionWithDot = _getExt2.extensionWithDot;                                                                // 1032
                                                                                                                       //
      opts.path = "" + this.storagePath(opts) + nodePath.sep + FSName + extensionWithDot;                              // 1055
      opts.type = this._getMimeType(opts);                                                                             // 1056
                                                                                                                       //
      if (!_.isObject(opts.meta)) {                                                                                    // 1057
        opts.meta = {};                                                                                                // 1058
      }                                                                                                                // 1059
                                                                                                                       //
      if (!_.isNumber(opts.size)) {                                                                                    // 1061
        opts.size = buffer.length;                                                                                     // 1062
      }                                                                                                                // 1063
                                                                                                                       //
      var result = this._dataToSchema({                                                                                // 1065
        name: fileName,                                                                                                // 1066
        path: opts.path,                                                                                               // 1067
        meta: opts.meta,                                                                                               // 1068
        type: opts.type,                                                                                               // 1069
        size: opts.size,                                                                                               // 1070
        userId: opts.userId,                                                                                           // 1071
        extension: extension                                                                                           // 1072
      });                                                                                                              // 1065
                                                                                                                       //
      result._id = fileId;                                                                                             // 1075
      var stream = fs.createWriteStream(opts.path, {                                                                   // 1077
        flags: 'w',                                                                                                    // 1077
        mode: this.permissions                                                                                         // 1077
      });                                                                                                              // 1077
      stream.end(buffer, function (streamErr) {                                                                        // 1078
        return bound(function () {                                                                                     // 1078
          if (streamErr) {                                                                                             // 1079
            callback && callback(streamErr);                                                                           // 1080
          } else {                                                                                                     // 1081
            _this4.collection.insert(result, function (insertErr, _id) {                                               // 1082
              if (insertErr) {                                                                                         // 1083
                callback && callback(insertErr);                                                                       // 1084
                                                                                                                       //
                _this4._debug("[FilesCollection] [write] [insert] Error: " + fileName + " -> " + _this4.collectionName, insertErr);
              } else {                                                                                                 // 1086
                var fileRef = _this4.collection.findOne(_id);                                                          // 1087
                                                                                                                       //
                callback && callback(null, fileRef);                                                                   // 1088
                                                                                                                       //
                if (proceedAfterUpload === true) {                                                                     // 1089
                  _this4.onAfterUpload && _this4.onAfterUpload.call(_this4, fileRef);                                  // 1090
                                                                                                                       //
                  _this4.emit('afterUpload', fileRef);                                                                 // 1091
                }                                                                                                      // 1092
                                                                                                                       //
                _this4._debug("[FilesCollection] [write]: " + fileName + " -> " + _this4.collectionName);              // 1093
              }                                                                                                        // 1094
            });                                                                                                        // 1095
          }                                                                                                            // 1096
        });                                                                                                            // 1097
      });                                                                                                              // 1078
      return this;                                                                                                     // 1098
    }                                                                                                                  // 1099
                                                                                                                       //
    return write;                                                                                                      //
  }(); /*                                                                                                              //
        * @locus Server                                                                                                //
        * @memberOf FilesCollection                                                                                    //
        * @name load                                                                                                   //
        * @param {String} url - URL to file                                                                            //
        * @param {Object} opts - Object with file-data                                                                 //
        * @param {Object} opts.headers - HTTP headers to use when requesting the file                                  //
        * @param {String} opts.name - File name, alias: `fileName`                                                     //
        * @param {String} opts.type - File mime-type                                                                   //
        * @param {Object} opts.meta - File additional meta-data                                                        //
        * @param {String} opts.userId - UserId, default *null*                                                         //
        * @param {String} opts.fileId - _id, default *null*                                                            //
        * @param {Function} callback - function(error, fileObj){...}                                                   //
        * @param {Boolean} proceedAfterUpload - Proceed onAfterUpload hook                                             //
        * @summary Download file, write stream to FS and add to FilesCollection Collection                             //
        * @returns {FilesCollection} Instance                                                                          //
        */                                                                                                             //
                                                                                                                       //
  FilesCollection.prototype.load = function () {                                                                       //
    function load(url) {                                                                                               //
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};                               // 1118
                                                                                                                       //
      var _this5 = this;                                                                                               // 1118
                                                                                                                       //
      var callback = arguments[2];                                                                                     // 1118
      var proceedAfterUpload = arguments[3];                                                                           // 1118
                                                                                                                       //
      this._debug("[FilesCollection] [load(" + url + ", " + JSON.stringify(opts) + ", callback)]");                    // 1119
                                                                                                                       //
      if (_.isFunction(opts)) {                                                                                        // 1121
        proceedAfterUpload = callback;                                                                                 // 1122
        callback = opts;                                                                                               // 1123
        opts = {};                                                                                                     // 1124
      } else if (_.isBoolean(callback)) {                                                                              // 1125
        proceedAfterUpload = callback;                                                                                 // 1126
      } else if (_.isBoolean(opts)) {                                                                                  // 1127
        proceedAfterUpload = opts;                                                                                     // 1128
      }                                                                                                                // 1129
                                                                                                                       //
      check(url, String);                                                                                              // 1131
      check(opts, Match.Optional(Object));                                                                             // 1132
      check(callback, Match.Optional(Function));                                                                       // 1133
      check(proceedAfterUpload, Match.Optional(Boolean));                                                              // 1134
                                                                                                                       //
      if (!_.isObject(opts)) {                                                                                         // 1136
        opts = {};                                                                                                     // 1137
      }                                                                                                                // 1138
                                                                                                                       //
      var fileId = opts.fileId || Random.id();                                                                         // 1140
      var FSName = this.namingFunction ? this.namingFunction(opts) : fileId;                                           // 1141
      var pathParts = url.split('/');                                                                                  // 1142
      var fileName = opts.name || opts.fileName ? opts.name || opts.fileName : pathParts[pathParts.length - 1] || FSName;
                                                                                                                       //
      var _getExt3 = this._getExt(fileName),                                                                           // 1118
          extension = _getExt3.extension,                                                                              // 1118
          extensionWithDot = _getExt3.extensionWithDot;                                                                // 1118
                                                                                                                       //
      opts.path = "" + this.storagePath(opts) + nodePath.sep + FSName + extensionWithDot;                              // 1146
                                                                                                                       //
      var storeResult = function (result, cb) {                                                                        // 1148
        result._id = fileId;                                                                                           // 1149
                                                                                                                       //
        _this5.collection.insert(result, function (error, _id) {                                                       // 1151
          if (error) {                                                                                                 // 1152
            cb && cb(error);                                                                                           // 1153
                                                                                                                       //
            _this5._debug("[FilesCollection] [load] [insert] Error: " + fileName + " -> " + _this5.collectionName, error);
          } else {                                                                                                     // 1155
            var fileRef = _this5.collection.findOne(_id);                                                              // 1156
                                                                                                                       //
            cb && cb(null, fileRef);                                                                                   // 1157
                                                                                                                       //
            if (proceedAfterUpload === true) {                                                                         // 1158
              _this5.onAfterUpload && _this5.onAfterUpload.call(_this5, fileRef);                                      // 1159
                                                                                                                       //
              _this5.emit('afterUpload', fileRef);                                                                     // 1160
            }                                                                                                          // 1161
                                                                                                                       //
            _this5._debug("[FilesCollection] [load] [insert] " + fileName + " -> " + _this5.collectionName);           // 1162
          }                                                                                                            // 1163
        });                                                                                                            // 1164
      };                                                                                                               // 1165
                                                                                                                       //
      request.get({                                                                                                    // 1167
        url: url,                                                                                                      // 1168
        headers: opts.headers || {}                                                                                    // 1169
      }).on('error', function (error) {                                                                                // 1167
        return bound(function () {                                                                                     // 1170
          callback && callback(error);                                                                                 // 1171
                                                                                                                       //
          _this5._debug("[FilesCollection] [load] [request.get(" + url + ")] Error:", error);                          // 1172
        });                                                                                                            // 1173
      }).on('response', function (response) {                                                                          // 1170
        return bound(function () {                                                                                     // 1173
          response.on('end', function () {                                                                             // 1174
            return bound(function () {                                                                                 // 1174
              _this5._debug("[FilesCollection] [load] Received: " + url);                                              // 1175
                                                                                                                       //
              var result = _this5._dataToSchema({                                                                      // 1176
                name: fileName,                                                                                        // 1177
                path: opts.path,                                                                                       // 1178
                meta: opts.meta,                                                                                       // 1179
                type: opts.type || response.headers['content-type'] || _this5._getMimeType({                           // 1180
                  path: opts.path                                                                                      // 1180
                }),                                                                                                    // 1180
                size: opts.size || parseInt(response.headers['content-length'] || 0),                                  // 1181
                userId: opts.userId,                                                                                   // 1182
                extension: extension                                                                                   // 1183
              });                                                                                                      // 1176
                                                                                                                       //
              if (!result.size) {                                                                                      // 1186
                fs.stat(opts.path, function (error, stats) {                                                           // 1187
                  return bound(function () {                                                                           // 1187
                    if (error) {                                                                                       // 1188
                      callback && callback(error);                                                                     // 1189
                    } else {                                                                                           // 1190
                      result.versions.original.size = result.size = stats.size;                                        // 1191
                      storeResult(result, callback);                                                                   // 1192
                    }                                                                                                  // 1193
                  });                                                                                                  // 1194
                });                                                                                                    // 1187
              } else {                                                                                                 // 1195
                storeResult(result, callback);                                                                         // 1196
              }                                                                                                        // 1197
            });                                                                                                        // 1198
          });                                                                                                          // 1174
        });                                                                                                            // 1199
      }).pipe(fs.createWriteStream(opts.path, {                                                                        // 1173
        flags: 'w',                                                                                                    // 1199
        mode: this.permissions                                                                                         // 1199
      }));                                                                                                             // 1199
      return this;                                                                                                     // 1201
    }                                                                                                                  // 1202
                                                                                                                       //
    return load;                                                                                                       //
  }(); /*                                                                                                              //
        * @locus Server                                                                                                //
        * @memberOf FilesCollection                                                                                    //
        * @name addFile                                                                                                //
        * @param {String} path          - Path to file                                                                 //
        * @param {String} opts          - [Optional] Object with file-data                                             //
        * @param {String} opts.type     - [Optional] File mime-type                                                    //
        * @param {Object} opts.meta     - [Optional] File additional meta-data                                         //
        * @param {String} opts.fileId   - _id, default *null*                                                          //
        * @param {Object} opts.fileName - [Optional] File name, if not specified file name and extension will be taken from path
        * @param {String} opts.userId   - [Optional] UserId, default *null*                                            //
        * @param {Function} callback    - [Optional] function(error, fileObj){...}                                     //
        * @param {Boolean} proceedAfterUpload - Proceed onAfterUpload hook                                             //
        * @summary Add file from FS to FilesCollection                                                                 //
        * @returns {FilesCollection} Instance                                                                          //
        */                                                                                                             //
                                                                                                                       //
  FilesCollection.prototype.addFile = function () {                                                                    //
    function addFile(path) {                                                                                           //
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};                               // 1220
                                                                                                                       //
      var _this6 = this;                                                                                               // 1220
                                                                                                                       //
      var callback = arguments[2];                                                                                     // 1220
      var proceedAfterUpload = arguments[3];                                                                           // 1220
                                                                                                                       //
      this._debug("[FilesCollection] [addFile(" + path + ")]");                                                        // 1221
                                                                                                                       //
      if (_.isFunction(opts)) {                                                                                        // 1223
        proceedAfterUpload = callback;                                                                                 // 1224
        callback = opts;                                                                                               // 1225
        opts = {};                                                                                                     // 1226
      } else if (_.isBoolean(callback)) {                                                                              // 1227
        proceedAfterUpload = callback;                                                                                 // 1228
      } else if (_.isBoolean(opts)) {                                                                                  // 1229
        proceedAfterUpload = opts;                                                                                     // 1230
      }                                                                                                                // 1231
                                                                                                                       //
      if (this.public) {                                                                                               // 1233
        throw new Meteor.Error(403, 'Can not run [addFile] on public collection! Just Move file to root of your server, then add record to Collection');
      }                                                                                                                // 1235
                                                                                                                       //
      check(path, String);                                                                                             // 1237
      check(opts, Match.Optional(Object));                                                                             // 1238
      check(callback, Match.Optional(Function));                                                                       // 1239
      check(proceedAfterUpload, Match.Optional(Boolean));                                                              // 1240
      fs.stat(path, function (statErr, stats) {                                                                        // 1242
        return bound(function () {                                                                                     // 1242
          if (statErr) {                                                                                               // 1243
            callback && callback(statErr);                                                                             // 1244
          } else if (stats.isFile()) {                                                                                 // 1245
            if (!_.isObject(opts)) {                                                                                   // 1246
              opts = {};                                                                                               // 1247
            }                                                                                                          // 1248
                                                                                                                       //
            opts.path = path;                                                                                          // 1249
                                                                                                                       //
            if (!opts.fileName) {                                                                                      // 1251
              var pathParts = path.split(nodePath.sep);                                                                // 1252
              opts.fileName = path.split(nodePath.sep)[pathParts.length - 1];                                          // 1253
            }                                                                                                          // 1254
                                                                                                                       //
            var _getExt4 = _this6._getExt(opts.fileName),                                                              // 1245
                extension = _getExt4.extension;                                                                        // 1245
                                                                                                                       //
            if (!_.isString(opts.type)) {                                                                              // 1258
              opts.type = _this6._getMimeType(opts);                                                                   // 1259
            }                                                                                                          // 1260
                                                                                                                       //
            if (!_.isObject(opts.meta)) {                                                                              // 1262
              opts.meta = {};                                                                                          // 1263
            }                                                                                                          // 1264
                                                                                                                       //
            if (!_.isNumber(opts.size)) {                                                                              // 1266
              opts.size = stats.size;                                                                                  // 1267
            }                                                                                                          // 1268
                                                                                                                       //
            var result = _this6._dataToSchema({                                                                        // 1270
              name: opts.fileName,                                                                                     // 1271
              path: path,                                                                                              // 1272
              meta: opts.meta,                                                                                         // 1273
              type: opts.type,                                                                                         // 1274
              size: opts.size,                                                                                         // 1275
              userId: opts.userId,                                                                                     // 1276
              extension: extension,                                                                                    // 1277
              _storagePath: path.replace("" + nodePath.sep + opts.fileName, ''),                                       // 1278
              fileId: opts.fileId || null                                                                              // 1279
            });                                                                                                        // 1270
                                                                                                                       //
            _this6.collection.insert(result, function (insertErr, _id) {                                               // 1283
              if (insertErr) {                                                                                         // 1284
                callback && callback(insertErr);                                                                       // 1285
                                                                                                                       //
                _this6._debug("[FilesCollection] [addFile] [insert] Error: " + result.name + " -> " + _this6.collectionName, insertErr);
              } else {                                                                                                 // 1287
                var fileRef = _this6.collection.findOne(_id);                                                          // 1288
                                                                                                                       //
                callback && callback(null, fileRef);                                                                   // 1289
                                                                                                                       //
                if (proceedAfterUpload === true) {                                                                     // 1290
                  _this6.onAfterUpload && _this6.onAfterUpload.call(_this6, fileRef);                                  // 1291
                                                                                                                       //
                  _this6.emit('afterUpload', fileRef);                                                                 // 1292
                }                                                                                                      // 1293
                                                                                                                       //
                _this6._debug("[FilesCollection] [addFile]: " + result.name + " -> " + _this6.collectionName);         // 1294
              }                                                                                                        // 1295
            });                                                                                                        // 1296
          } else {                                                                                                     // 1297
            callback && callback(new Meteor.Error(400, "[FilesCollection] [addFile(" + path + ")]: File does not exist"));
          }                                                                                                            // 1299
        });                                                                                                            // 1300
      });                                                                                                              // 1242
      return this;                                                                                                     // 1301
    }                                                                                                                  // 1302
                                                                                                                       //
    return addFile;                                                                                                    //
  }(); /*                                                                                                              //
        * @locus Anywhere                                                                                              //
        * @memberOf FilesCollection                                                                                    //
        * @name remove                                                                                                 //
        * @param {String|Object} selector - Mongo-Style selector (http://docs.meteor.com/api/collections.html#selectors)
        * @param {Function} callback - Callback with one `error` argument                                              //
        * @summary Remove documents from the collection                                                                //
        * @returns {FilesCollection} Instance                                                                          //
        */                                                                                                             //
                                                                                                                       //
  FilesCollection.prototype.remove = function () {                                                                     //
    function remove(selector, callback) {                                                                              //
      var _this7 = this;                                                                                               // 1313
                                                                                                                       //
      this._debug("[FilesCollection] [remove(" + JSON.stringify(selector) + ")]");                                     // 1314
                                                                                                                       //
      if (selector === undefined) {                                                                                    // 1315
        return 0;                                                                                                      // 1316
      }                                                                                                                // 1317
                                                                                                                       //
      check(callback, Match.Optional(Function));                                                                       // 1318
      var files = this.collection.find(selector);                                                                      // 1320
                                                                                                                       //
      if (files.count() > 0) {                                                                                         // 1321
        files.forEach(function (file) {                                                                                // 1322
          _this7.unlink(file);                                                                                         // 1323
        });                                                                                                            // 1324
      } else {                                                                                                         // 1325
        callback && callback(new Meteor.Error(404, 'Cursor is empty, no files is removed'));                           // 1326
        return this;                                                                                                   // 1327
      }                                                                                                                // 1328
                                                                                                                       //
      if (this.onAfterRemove) {                                                                                        // 1330
        var docs = files.fetch();                                                                                      // 1331
        var self = this;                                                                                               // 1332
        this.collection.remove(selector, function () {                                                                 // 1333
          callback && callback.apply(this, arguments);                                                                 // 1334
          self.onAfterRemove(docs);                                                                                    // 1335
        });                                                                                                            // 1336
      } else {                                                                                                         // 1337
        this.collection.remove(selector, callback || NOOP);                                                            // 1338
      }                                                                                                                // 1339
                                                                                                                       //
      return this;                                                                                                     // 1340
    }                                                                                                                  // 1341
                                                                                                                       //
    return remove;                                                                                                     //
  }(); /*                                                                                                              //
        * @locus Server                                                                                                //
        * @memberOf FilesCollection                                                                                    //
        * @name deny                                                                                                   //
        * @param {Object} rules                                                                                        //
        * @see  https://docs.meteor.com/api/collections.html#Mongo-Collection-deny                                     //
        * @summary link Mongo.Collection deny methods                                                                  //
        * @returns {Mongo.Collection} Instance                                                                         //
        */                                                                                                             //
                                                                                                                       //
  FilesCollection.prototype.deny = function () {                                                                       //
    function deny(rules) {                                                                                             //
      this.collection.deny(rules);                                                                                     // 1353
      return this.collection;                                                                                          // 1354
    }                                                                                                                  // 1355
                                                                                                                       //
    return deny;                                                                                                       //
  }(); /*                                                                                                              //
        * @locus Server                                                                                                //
        * @memberOf FilesCollection                                                                                    //
        * @name allow                                                                                                  //
        * @param {Object} rules                                                                                        //
        * @see https://docs.meteor.com/api/collections.html#Mongo-Collection-allow                                     //
        * @summary link Mongo.Collection allow methods                                                                 //
        * @returns {Mongo.Collection} Instance                                                                         //
        */                                                                                                             //
                                                                                                                       //
  FilesCollection.prototype.allow = function () {                                                                      //
    function allow(rules) {                                                                                            //
      this.collection.allow(rules);                                                                                    // 1367
      return this.collection;                                                                                          // 1368
    }                                                                                                                  // 1369
                                                                                                                       //
    return allow;                                                                                                      //
  }(); /*                                                                                                              //
        * @locus Server                                                                                                //
        * @memberOf FilesCollection                                                                                    //
        * @name denyClient                                                                                             //
        * @see https://docs.meteor.com/api/collections.html#Mongo-Collection-deny                                      //
        * @summary Shorthands for Mongo.Collection deny method                                                         //
        * @returns {Mongo.Collection} Instance                                                                         //
        */                                                                                                             //
                                                                                                                       //
  FilesCollection.prototype.denyClient = function () {                                                                 //
    function denyClient() {                                                                                            //
      this.collection.deny({                                                                                           // 1380
        insert: function () {                                                                                          // 1381
          return true;                                                                                                 // 1381
        },                                                                                                             // 1381
        update: function () {                                                                                          // 1382
          return true;                                                                                                 // 1382
        },                                                                                                             // 1382
        remove: function () {                                                                                          // 1383
          return true;                                                                                                 // 1383
        }                                                                                                              // 1383
      });                                                                                                              // 1380
      return this.collection;                                                                                          // 1385
    }                                                                                                                  // 1386
                                                                                                                       //
    return denyClient;                                                                                                 //
  }(); /*                                                                                                              //
        * @locus Server                                                                                                //
        * @memberOf FilesCollection                                                                                    //
        * @name allowClient                                                                                            //
        * @see https://docs.meteor.com/api/collections.html#Mongo-Collection-allow                                     //
        * @summary Shorthands for Mongo.Collection allow method                                                        //
        * @returns {Mongo.Collection} Instance                                                                         //
        */                                                                                                             //
                                                                                                                       //
  FilesCollection.prototype.allowClient = function () {                                                                //
    function allowClient() {                                                                                           //
      this.collection.allow({                                                                                          // 1397
        insert: function () {                                                                                          // 1398
          return true;                                                                                                 // 1398
        },                                                                                                             // 1398
        update: function () {                                                                                          // 1399
          return true;                                                                                                 // 1399
        },                                                                                                             // 1399
        remove: function () {                                                                                          // 1400
          return true;                                                                                                 // 1400
        }                                                                                                              // 1400
      });                                                                                                              // 1397
      return this.collection;                                                                                          // 1402
    }                                                                                                                  // 1403
                                                                                                                       //
    return allowClient;                                                                                                //
  }(); /*                                                                                                              //
        * @locus Server                                                                                                //
        * @memberOf FilesCollection                                                                                    //
        * @name unlink                                                                                                 //
        * @param {Object} fileRef - fileObj                                                                            //
        * @param {String} version - [Optional] file's version                                                          //
        * @param {Function} callback - [Optional] callback function                                                    //
        * @summary Unlink files and it's versions from FS                                                              //
        * @returns {FilesCollection} Instance                                                                          //
        */                                                                                                             //
                                                                                                                       //
  FilesCollection.prototype.unlink = function () {                                                                     //
    function unlink(fileRef, version, callback) {                                                                      //
      this._debug("[FilesCollection] [unlink(" + fileRef._id + ", " + version + ")]");                                 // 1417
                                                                                                                       //
      if (version) {                                                                                                   // 1418
        if (_.isObject(fileRef.versions) && _.isObject(fileRef.versions[version]) && fileRef.versions[version].path) {
          fs.unlink(fileRef.versions[version].path, callback || NOOP);                                                 // 1420
        }                                                                                                              // 1421
      } else {                                                                                                         // 1422
        if (_.isObject(fileRef.versions)) {                                                                            // 1423
          _.each(fileRef.versions, function (vRef) {                                                                   // 1424
            return bound(function () {                                                                                 // 1424
              fs.unlink(vRef.path, callback || NOOP);                                                                  // 1425
            });                                                                                                        // 1426
          });                                                                                                          // 1424
        } else {                                                                                                       // 1427
          fs.unlink(fileRef.path, callback || NOOP);                                                                   // 1428
        }                                                                                                              // 1429
      }                                                                                                                // 1430
                                                                                                                       //
      return this;                                                                                                     // 1431
    }                                                                                                                  // 1432
                                                                                                                       //
    return unlink;                                                                                                     //
  }(); /*                                                                                                              //
        * @locus Server                                                                                                //
        * @memberOf FilesCollection                                                                                    //
        * @name _404                                                                                                   //
        * @summary Internal method, used to return 404 error                                                           //
        * @returns {undefined}                                                                                         //
        */                                                                                                             //
                                                                                                                       //
  FilesCollection.prototype._404 = function () {                                                                       //
    function _404(http) {                                                                                              //
      this._debug("[FilesCollection] [download(" + http.request.originalUrl + ")] [_404] File not found");             // 1442
                                                                                                                       //
      var text = 'File Not Found :(';                                                                                  // 1443
                                                                                                                       //
      if (!http.response.headersSent) {                                                                                // 1445
        http.response.writeHead(404, {                                                                                 // 1446
          'Content-Type': 'text/plain',                                                                                // 1447
          'Content-Length': text.length                                                                                // 1448
        });                                                                                                            // 1446
      }                                                                                                                // 1451
                                                                                                                       //
      if (!http.response.finished) {                                                                                   // 1452
        http.response.end(text);                                                                                       // 1453
      }                                                                                                                // 1454
    }                                                                                                                  // 1455
                                                                                                                       //
    return _404;                                                                                                       //
  }(); /*                                                                                                              //
        * @locus Server                                                                                                //
        * @memberOf FilesCollection                                                                                    //
        * @name download                                                                                               //
        * @param {Object} http    - Server HTTP object                                                                 //
        * @param {String} version - Requested file version                                                             //
        * @param {Object} fileRef - Requested file Object                                                              //
        * @summary Initiates the HTTP response                                                                         //
        * @returns {undefined}                                                                                         //
        */                                                                                                             //
                                                                                                                       //
  FilesCollection.prototype.download = function () {                                                                   //
    function download(http) {                                                                                          //
      var _this8 = this;                                                                                               // 1467
                                                                                                                       //
      var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'original';                    // 1467
      var fileRef = arguments[2];                                                                                      // 1467
      var vRef = void 0;                                                                                               // 1468
                                                                                                                       //
      this._debug("[FilesCollection] [download(" + http.request.originalUrl + ", " + version + ")]");                  // 1469
                                                                                                                       //
      if (fileRef) {                                                                                                   // 1471
        if (_.has(fileRef, 'versions') && _.has(fileRef.versions, version)) {                                          // 1472
          vRef = fileRef.versions[version];                                                                            // 1473
          vRef._id = fileRef._id;                                                                                      // 1474
        } else {                                                                                                       // 1475
          vRef = fileRef;                                                                                              // 1476
        }                                                                                                              // 1477
      } else {                                                                                                         // 1478
        vRef = false;                                                                                                  // 1479
      }                                                                                                                // 1480
                                                                                                                       //
      if (!vRef || !_.isObject(vRef)) {                                                                                // 1482
        return this._404(http);                                                                                        // 1483
      } else if (fileRef) {                                                                                            // 1484
        if (this.downloadCallback) {                                                                                   // 1485
          if (!this.downloadCallback.call(_.extend(http, this._getUser(http)), fileRef)) {                             // 1486
            return this._404(http);                                                                                    // 1487
          }                                                                                                            // 1488
        }                                                                                                              // 1489
                                                                                                                       //
        if (this.interceptDownload && _.isFunction(this.interceptDownload)) {                                          // 1491
          if (this.interceptDownload(http, fileRef, version) === true) {                                               // 1492
            return void 0;                                                                                             // 1493
          }                                                                                                            // 1494
        }                                                                                                              // 1495
                                                                                                                       //
        fs.stat(vRef.path, function (statErr, stats) {                                                                 // 1497
          return bound(function () {                                                                                   // 1497
            var responseType = void 0;                                                                                 // 1498
                                                                                                                       //
            if (statErr || !stats.isFile()) {                                                                          // 1499
              return _this8._404(http);                                                                                // 1500
            }                                                                                                          // 1501
                                                                                                                       //
            if (stats.size !== vRef.size && !_this8.integrityCheck) {                                                  // 1503
              vRef.size = stats.size;                                                                                  // 1504
            }                                                                                                          // 1505
                                                                                                                       //
            if (stats.size !== vRef.size && _this8.integrityCheck) {                                                   // 1507
              responseType = '400';                                                                                    // 1508
            }                                                                                                          // 1509
                                                                                                                       //
            return _this8.serve(http, fileRef, vRef, version, null, responseType || '200');                            // 1511
          });                                                                                                          // 1512
        });                                                                                                            // 1497
        return void 0;                                                                                                 // 1513
      }                                                                                                                // 1514
                                                                                                                       //
      return this._404(http);                                                                                          // 1515
    }                                                                                                                  // 1516
                                                                                                                       //
    return download;                                                                                                   //
  }(); /*                                                                                                              //
        * @locus Server                                                                                                //
        * @memberOf FilesCollection                                                                                    //
        * @name serve                                                                                                  //
        * @param {Object} http    - Server HTTP object                                                                 //
        * @param {Object} fileRef - Requested file Object                                                              //
        * @param {Object} vRef    - Requested file version Object                                                      //
        * @param {String} version - Requested file version                                                             //
        * @param {stream.Readable|null} readableStream - Readable stream, which serves binary file data                //
        * @param {String} responseType - Response code                                                                 //
        * @param {Boolean} force200 - Force 200 response code over 206                                                 //
        * @summary Handle and reply to incoming request                                                                //
        * @returns {undefined}                                                                                         //
        */                                                                                                             //
                                                                                                                       //
  FilesCollection.prototype.serve = function () {                                                                      //
    function serve(http, fileRef, vRef) {                                                                              //
      var version = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'original';                    // 1532
      var readableStream = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;                   // 1532
                                                                                                                       //
      var _this9 = this;                                                                                               // 1532
                                                                                                                       //
      var responseType = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '200';                    // 1532
      var force200 = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;                        // 1532
      var partiral = false;                                                                                            // 1533
      var reqRange = false;                                                                                            // 1534
      var dispositionType = '';                                                                                        // 1535
      var start = void 0;                                                                                              // 1536
      var end = void 0;                                                                                                // 1537
      var take = void 0;                                                                                               // 1538
                                                                                                                       //
      if (http.params.query.download && http.params.query.download === 'true') {                                       // 1540
        dispositionType = 'attachment; ';                                                                              // 1541
      } else {                                                                                                         // 1542
        dispositionType = 'inline; ';                                                                                  // 1543
      }                                                                                                                // 1544
                                                                                                                       //
      var dispositionName = "filename=\"" + encodeURI(vRef.name || fileRef.name).replace(/\,/g, '%2C') + "\"; filename*=UTF-8''" + encodeURIComponent(vRef.name || fileRef.name) + "; ";
      var dispositionEncoding = 'charset=UTF-8';                                                                       // 1547
                                                                                                                       //
      if (!http.response.headersSent) {                                                                                // 1549
        http.response.setHeader('Content-Disposition', dispositionType + dispositionName + dispositionEncoding);       // 1550
      }                                                                                                                // 1551
                                                                                                                       //
      if (http.request.headers.range && !force200) {                                                                   // 1553
        partiral = true;                                                                                               // 1554
        var array = http.request.headers.range.split(/bytes=([0-9]*)-([0-9]*)/);                                       // 1555
        start = parseInt(array[1]);                                                                                    // 1556
        end = parseInt(array[2]);                                                                                      // 1557
                                                                                                                       //
        if (isNaN(end)) {                                                                                              // 1558
          end = vRef.size - 1;                                                                                         // 1559
        }                                                                                                              // 1560
                                                                                                                       //
        take = end - start;                                                                                            // 1561
      } else {                                                                                                         // 1562
        start = 0;                                                                                                     // 1563
        end = vRef.size - 1;                                                                                           // 1564
        take = vRef.size;                                                                                              // 1565
      }                                                                                                                // 1566
                                                                                                                       //
      if (partiral || http.params.query.play && http.params.query.play === 'true') {                                   // 1568
        reqRange = {                                                                                                   // 1569
          start: start,                                                                                                // 1569
          end: end                                                                                                     // 1569
        };                                                                                                             // 1569
                                                                                                                       //
        if (isNaN(start) && !isNaN(end)) {                                                                             // 1570
          reqRange.start = end - take;                                                                                 // 1571
          reqRange.end = end;                                                                                          // 1572
        }                                                                                                              // 1573
                                                                                                                       //
        if (!isNaN(start) && isNaN(end)) {                                                                             // 1574
          reqRange.start = start;                                                                                      // 1575
          reqRange.end = start + take;                                                                                 // 1576
        }                                                                                                              // 1577
                                                                                                                       //
        if (start + take >= vRef.size) {                                                                               // 1579
          reqRange.end = vRef.size - 1;                                                                                // 1579
        }                                                                                                              // 1579
                                                                                                                       //
        if (this.strict && (reqRange.start >= vRef.size - 1 || reqRange.end > vRef.size - 1)) {                        // 1581
          responseType = '416';                                                                                        // 1582
        } else {                                                                                                       // 1583
          responseType = '206';                                                                                        // 1584
        }                                                                                                              // 1585
      } else {                                                                                                         // 1586
        responseType = '200';                                                                                          // 1587
      }                                                                                                                // 1588
                                                                                                                       //
      var streamErrorHandler = function (error) {                                                                      // 1590
        _this9._debug("[FilesCollection] [serve(" + vRef.path + ", " + version + ")] [500]", error);                   // 1591
                                                                                                                       //
        if (!http.response.finished) {                                                                                 // 1592
          http.response.end(error.toString());                                                                         // 1593
        }                                                                                                              // 1594
      };                                                                                                               // 1595
                                                                                                                       //
      var headers = _.isFunction(this.responseHeaders) ? this.responseHeaders(responseType, fileRef, vRef, version) : this.responseHeaders;
                                                                                                                       //
      if (!headers['Cache-Control']) {                                                                                 // 1599
        if (!http.response.headersSent) {                                                                              // 1600
          http.response.setHeader('Cache-Control', this.cacheControl);                                                 // 1601
        }                                                                                                              // 1602
      }                                                                                                                // 1603
                                                                                                                       //
      for (var key in meteorBabelHelpers.sanitizeForInObject(headers)) {                                               // 1605
        if (!http.response.headersSent) {                                                                              // 1606
          http.response.setHeader(key, headers[key]);                                                                  // 1607
        }                                                                                                              // 1608
      }                                                                                                                // 1609
                                                                                                                       //
      var respond = function (stream, code) {                                                                          // 1611
        if (!http.response.headersSent && readableStream) {                                                            // 1612
          http.response.writeHead(code);                                                                               // 1613
        }                                                                                                              // 1614
                                                                                                                       //
        http.response.on('close', function () {                                                                        // 1616
          if (typeof stream.abort === 'function') {                                                                    // 1617
            stream.abort();                                                                                            // 1618
          }                                                                                                            // 1619
                                                                                                                       //
          if (typeof stream.end === 'function') {                                                                      // 1620
            stream.end();                                                                                              // 1621
          }                                                                                                            // 1622
        });                                                                                                            // 1623
        http.request.on('aborted', function () {                                                                       // 1625
          http.request.aborted = true;                                                                                 // 1626
                                                                                                                       //
          if (typeof stream.abort === 'function') {                                                                    // 1627
            stream.abort();                                                                                            // 1628
          }                                                                                                            // 1629
                                                                                                                       //
          if (typeof stream.end === 'function') {                                                                      // 1630
            stream.end();                                                                                              // 1631
          }                                                                                                            // 1632
        });                                                                                                            // 1633
        stream.on('open', function () {                                                                                // 1635
          if (!http.response.headersSent) {                                                                            // 1636
            http.response.writeHead(code);                                                                             // 1637
          }                                                                                                            // 1638
        }).on('abort', function () {                                                                                   // 1639
          if (!http.response.finished) {                                                                               // 1640
            http.response.end();                                                                                       // 1641
          }                                                                                                            // 1642
                                                                                                                       //
          if (!http.request.aborted) {                                                                                 // 1643
            http.request.destroy();                                                                                    // 1644
          }                                                                                                            // 1645
        }).on('error', streamErrorHandler).on('end', function () {                                                     // 1646
          if (!http.response.finished) {                                                                               // 1648
            http.response.end();                                                                                       // 1649
          }                                                                                                            // 1650
        }).pipe(http.response);                                                                                        // 1651
      };                                                                                                               // 1652
                                                                                                                       //
      switch (responseType) {                                                                                          // 1654
        case '400':                                                                                                    // 1655
          this._debug("[FilesCollection] [serve(" + vRef.path + ", " + version + ")] [400] Content-Length mismatch!");
                                                                                                                       //
          var text = 'Content-Length mismatch!';                                                                       // 1657
                                                                                                                       //
          if (!http.response.headersSent) {                                                                            // 1659
            http.response.writeHead(400, {                                                                             // 1660
              'Content-Type': 'text/plain',                                                                            // 1661
              'Content-Length': text.length                                                                            // 1662
            });                                                                                                        // 1660
          }                                                                                                            // 1664
                                                                                                                       //
          if (!http.response.finished) {                                                                               // 1666
            http.response.end(text);                                                                                   // 1667
          }                                                                                                            // 1668
                                                                                                                       //
          break;                                                                                                       // 1669
                                                                                                                       //
        case '404':                                                                                                    // 1670
          this._404(http);                                                                                             // 1671
                                                                                                                       //
          break;                                                                                                       // 1672
                                                                                                                       //
        case '416':                                                                                                    // 1673
          this._debug("[FilesCollection] [serve(" + vRef.path + ", " + version + ")] [416] Content-Range is not specified!");
                                                                                                                       //
          if (!http.response.headersSent) {                                                                            // 1675
            http.response.writeHead(416);                                                                              // 1676
          }                                                                                                            // 1677
                                                                                                                       //
          if (!http.response.finished) {                                                                               // 1678
            http.response.end();                                                                                       // 1679
          }                                                                                                            // 1680
                                                                                                                       //
          break;                                                                                                       // 1681
                                                                                                                       //
        case '206':                                                                                                    // 1682
          this._debug("[FilesCollection] [serve(" + vRef.path + ", " + version + ")] [206]");                          // 1683
                                                                                                                       //
          if (!http.response.headersSent) {                                                                            // 1684
            http.response.setHeader('Content-Range', "bytes " + reqRange.start + "-" + reqRange.end + "/" + vRef.size);
          }                                                                                                            // 1686
                                                                                                                       //
          respond(readableStream || fs.createReadStream(vRef.path, {                                                   // 1687
            start: reqRange.start,                                                                                     // 1687
            end: reqRange.end                                                                                          // 1687
          }), 206);                                                                                                    // 1687
          break;                                                                                                       // 1688
                                                                                                                       //
        default:                                                                                                       // 1689
          this._debug("[FilesCollection] [serve(" + vRef.path + ", " + version + ")] [200]");                          // 1690
                                                                                                                       //
          respond(readableStream || fs.createReadStream(vRef.path), 200);                                              // 1691
          break;                                                                                                       // 1692
      }                                                                                                                // 1654
    }                                                                                                                  // 1694
                                                                                                                       //
    return serve;                                                                                                      //
  }();                                                                                                                 //
                                                                                                                       //
  return FilesCollection;                                                                                              //
}(FilesCollectionCore);                                                                                                //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"core.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ostrio_files/core.js                                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                          //
                                                                                                                       //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                                 //
                                                                                                                       //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                            //
                                                                                                                       //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                   //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
module.export({                                                                                                        // 1
  "default": function () {                                                                                             // 1
    return FilesCollectionCore;                                                                                        // 1
  }                                                                                                                    // 1
});                                                                                                                    // 1
                                                                                                                       //
var _ = void 0;                                                                                                        // 1
                                                                                                                       //
module.watch(require("meteor/underscore"), {                                                                           // 1
  _: function (v) {                                                                                                    // 1
    _ = v;                                                                                                             // 1
  }                                                                                                                    // 1
}, 0);                                                                                                                 // 1
var EventEmitter = void 0;                                                                                             // 1
module.watch(require("eventemitter3"), {                                                                               // 1
  EventEmitter: function (v) {                                                                                         // 1
    EventEmitter = v;                                                                                                  // 1
  }                                                                                                                    // 1
}, 1);                                                                                                                 // 1
var formatFleURL = void 0;                                                                                             // 1
module.watch(require("./lib.js"), {                                                                                    // 1
  formatFleURL: function (v) {                                                                                         // 1
    formatFleURL = v;                                                                                                  // 1
  }                                                                                                                    // 1
}, 2);                                                                                                                 // 1
var check = void 0,                                                                                                    // 1
    Match = void 0;                                                                                                    // 1
module.watch(require("meteor/check"), {                                                                                // 1
  check: function (v) {                                                                                                // 1
    check = v;                                                                                                         // 1
  },                                                                                                                   // 1
  Match: function (v) {                                                                                                // 1
    Match = v;                                                                                                         // 1
  }                                                                                                                    // 1
}, 3);                                                                                                                 // 1
var FilesCursor = void 0,                                                                                              // 1
    FileCursor = void 0;                                                                                               // 1
module.watch(require("./cursor.js"), {                                                                                 // 1
  FilesCursor: function (v) {                                                                                          // 1
    FilesCursor = v;                                                                                                   // 1
  },                                                                                                                   // 1
  FileCursor: function (v) {                                                                                           // 1
    FileCursor = v;                                                                                                    // 1
  }                                                                                                                    // 1
}, 4);                                                                                                                 // 1
                                                                                                                       //
var FilesCollectionCore = function (_EventEmitter) {                                                                   //
  (0, _inherits3.default)(FilesCollectionCore, _EventEmitter);                                                         //
                                                                                                                       //
  function FilesCollectionCore() {                                                                                     // 8
    (0, _classCallCheck3.default)(this, FilesCollectionCore);                                                          // 8
    return (0, _possibleConstructorReturn3.default)(this, _EventEmitter.call(this));                                   // 8
  }                                                                                                                    // 10
                                                                                                                       //
  /*                                                                                                                   // 96
   * @locus Anywhere                                                                                                   //
   * @memberOf FilesCollectionCore                                                                                     //
   * @name _debug                                                                                                      //
   * @summary Print logs in debug mode                                                                                 //
   * @returns {void}                                                                                                   //
   */FilesCollectionCore.prototype._debug = function () {                                                              //
    function _debug() {                                                                                                //
      if (this.debug) {                                                                                                // 104
        (console.info || console.log || function () {}).apply(undefined, arguments);                                   // 105
      }                                                                                                                // 106
    }                                                                                                                  // 107
                                                                                                                       //
    return _debug;                                                                                                     //
  }(); /*                                                                                                              //
        * @locus Anywhere                                                                                              //
        * @memberOf FilesCollectionCore                                                                                //
        * @name _getFileName                                                                                           //
        * @param {Object} fileData - File Object                                                                       //
        * @summary Returns file's name                                                                                 //
        * @returns {String}                                                                                            //
        */                                                                                                             //
                                                                                                                       //
  FilesCollectionCore.prototype._getFileName = function () {                                                           //
    function _getFileName(fileData) {                                                                                  //
      var fileName = fileData.name || fileData.fileName;                                                               // 118
                                                                                                                       //
      if (_.isString(fileName) && fileName.length > 0) {                                                               // 119
        return (fileData.name || fileData.fileName).replace(/\.\./g, '').replace(/\//g, '');                           // 120
      }                                                                                                                // 121
                                                                                                                       //
      return '';                                                                                                       // 122
    }                                                                                                                  // 123
                                                                                                                       //
    return _getFileName;                                                                                               //
  }(); /*                                                                                                              //
        * @locus Anywhere                                                                                              //
        * @memberOf FilesCollectionCore                                                                                //
        * @name _getExt                                                                                                //
        * @param {String} FileName - File name                                                                         //
        * @summary Get extension from FileName                                                                         //
        * @returns {Object}                                                                                            //
        */                                                                                                             //
                                                                                                                       //
  FilesCollectionCore.prototype._getExt = function () {                                                                //
    function _getExt(fileName) {                                                                                       //
      if (!!~fileName.indexOf('.')) {                                                                                  // 134
        var extension = (fileName.split('.').pop().split('?')[0] || '').toLowerCase();                                 // 135
        return {                                                                                                       // 136
          ext: extension,                                                                                              // 136
          extension: extension,                                                                                        // 136
          extensionWithDot: "." + extension                                                                            // 136
        };                                                                                                             // 136
      }                                                                                                                // 137
                                                                                                                       //
      return {                                                                                                         // 138
        ext: '',                                                                                                       // 138
        extension: '',                                                                                                 // 138
        extensionWithDot: ''                                                                                           // 138
      };                                                                                                               // 138
    }                                                                                                                  // 139
                                                                                                                       //
    return _getExt;                                                                                                    //
  }(); /*                                                                                                              //
        * @locus Anywhere                                                                                              //
        * @memberOf FilesCollectionCore                                                                                //
        * @name _updateFileTypes                                                                                       //
        * @param {Object} data - File data                                                                             //
        * @summary Internal method. Classify file based on 'type' field                                                //
        */                                                                                                             //
                                                                                                                       //
  FilesCollectionCore.prototype._updateFileTypes = function () {                                                       //
    function _updateFileTypes(data) {                                                                                  //
      data.isVideo = /^video\//i.test(data.type);                                                                      // 149
      data.isAudio = /^audio\//i.test(data.type);                                                                      // 150
      data.isImage = /^image\//i.test(data.type);                                                                      // 151
      data.isText = /^text\//i.test(data.type);                                                                        // 152
      data.isJSON = /^application\/json$/i.test(data.type);                                                            // 153
      data.isPDF = /^application\/(x-)?pdf$/i.test(data.type);                                                         // 154
    }                                                                                                                  // 155
                                                                                                                       //
    return _updateFileTypes;                                                                                           //
  }(); /*                                                                                                              //
        * @locus Anywhere                                                                                              //
        * @memberOf FilesCollectionCore                                                                                //
        * @name _dataToSchema                                                                                          //
        * @param {Object} data - File data                                                                             //
        * @summary Internal method. Build object in accordance with default schema from File data                      //
        * @returns {Object}                                                                                            //
        */                                                                                                             //
                                                                                                                       //
  FilesCollectionCore.prototype._dataToSchema = function () {                                                          //
    function _dataToSchema(data) {                                                                                     //
      var ds = {                                                                                                       // 166
        name: data.name,                                                                                               // 167
        extension: data.extension,                                                                                     // 168
        path: data.path,                                                                                               // 169
        meta: data.meta,                                                                                               // 170
        type: data.type,                                                                                               // 171
        size: data.size,                                                                                               // 172
        userId: data.userId || null,                                                                                   // 173
        versions: {                                                                                                    // 174
          original: {                                                                                                  // 175
            path: data.path,                                                                                           // 176
            size: data.size,                                                                                           // 177
            type: data.type,                                                                                           // 178
            extension: data.extension                                                                                  // 179
          }                                                                                                            // 175
        },                                                                                                             // 174
        _downloadRoute: data._downloadRoute || this.downloadRoute,                                                     // 182
        _collectionName: data._collectionName || this.collectionName                                                   // 183
      }; //Optional fileId                                                                                             // 166
                                                                                                                       //
      if (data.fileId) {                                                                                               // 187
        ds._id = data.fileId;                                                                                          // 188
      }                                                                                                                // 189
                                                                                                                       //
      this._updateFileTypes(ds);                                                                                       // 191
                                                                                                                       //
      ds._storagePath = data._storagePath || this.storagePath(_.extend(data, ds));                                     // 192
      return ds;                                                                                                       // 193
    }                                                                                                                  // 194
                                                                                                                       //
    return _dataToSchema;                                                                                              //
  }(); /*                                                                                                              //
        * @locus Anywhere                                                                                              //
        * @memberOf FilesCollectionCore                                                                                //
        * @name findOne                                                                                                //
        * @param {String|Object} selector - Mongo-Style selector (http://docs.meteor.com/api/collections.html#selectors)
        * @param {Object} options - Mongo-Style selector Options (http://docs.meteor.com/api/collections.html#sortspecifiers)
        * @summary Find and return Cursor for matching document Object                                                 //
        * @returns {FileCursor} Instance                                                                               //
        */                                                                                                             //
                                                                                                                       //
  FilesCollectionCore.prototype.findOne = function () {                                                                //
    function findOne() {                                                                                               //
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};                           // 205
      var options = arguments[1];                                                                                      // 205
                                                                                                                       //
      this._debug("[FilesCollection] [findOne(" + JSON.stringify(selector) + ", " + JSON.stringify(options) + ")]");   // 206
                                                                                                                       //
      check(selector, Match.Optional(Match.OneOf(Object, String, Boolean, Number, null)));                             // 207
      check(options, Match.Optional(Object));                                                                          // 208
      var doc = this.collection.findOne(selector, options);                                                            // 210
                                                                                                                       //
      if (doc) {                                                                                                       // 211
        return new FileCursor(doc, this);                                                                              // 212
      }                                                                                                                // 213
                                                                                                                       //
      return doc;                                                                                                      // 214
    }                                                                                                                  // 215
                                                                                                                       //
    return findOne;                                                                                                    //
  }(); /*                                                                                                              //
        * @locus Anywhere                                                                                              //
        * @memberOf FilesCollectionCore                                                                                //
        * @name find                                                                                                   //
        * @param {String|Object} selector - Mongo-Style selector (http://docs.meteor.com/api/collections.html#selectors)
        * @param {Object}        options  - Mongo-Style selector Options (http://docs.meteor.com/api/collections.html#sortspecifiers)
        * @summary Find and return Cursor for matching documents                                                       //
        * @returns {FilesCursor} Instance                                                                              //
        */                                                                                                             //
                                                                                                                       //
  FilesCollectionCore.prototype.find = function () {                                                                   //
    function find() {                                                                                                  //
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};                           // 226
      var options = arguments[1];                                                                                      // 226
                                                                                                                       //
      this._debug("[FilesCollection] [find(" + JSON.stringify(selector) + ", " + JSON.stringify(options) + ")]");      // 227
                                                                                                                       //
      check(selector, Match.Optional(Match.OneOf(Object, String, Boolean, Number, null)));                             // 228
      check(options, Match.Optional(Object));                                                                          // 229
      return new FilesCursor(selector, options, this);                                                                 // 231
    }                                                                                                                  // 232
                                                                                                                       //
    return find;                                                                                                       //
  }(); /*                                                                                                              //
        * @locus Anywhere                                                                                              //
        * @memberOf FilesCollectionCore                                                                                //
        * @name update                                                                                                 //
        * @see http://docs.meteor.com/#/full/update                                                                    //
        * @summary link Mongo.Collection update method                                                                 //
        * @returns {Mongo.Collection} Instance                                                                         //
        */                                                                                                             //
                                                                                                                       //
  FilesCollectionCore.prototype.update = function () {                                                                 //
    function update() {                                                                                                //
      this.collection.update.apply(this.collection, arguments);                                                        // 243
      return this.collection;                                                                                          // 244
    }                                                                                                                  // 245
                                                                                                                       //
    return update;                                                                                                     //
  }(); /*                                                                                                              //
        * @locus Anywhere                                                                                              //
        * @memberOf FilesCollectionCore                                                                                //
        * @name link                                                                                                   //
        * @param {Object} fileRef - File reference object                                                              //
        * @param {String} version - Version of file you would like to request                                          //
        * @summary Returns downloadable URL                                                                            //
        * @returns {String} Empty string returned in case if file not found in DB                                      //
        */                                                                                                             //
                                                                                                                       //
  FilesCollectionCore.prototype.link = function () {                                                                   //
    function link(fileRef) {                                                                                           //
      var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'original';                    // 256
                                                                                                                       //
      this._debug("[FilesCollection] [link(" + (_.isObject(fileRef) ? fileRef._id : undefined) + ", " + version + ")]");
                                                                                                                       //
      check(fileRef, Object);                                                                                          // 258
      check(version, String);                                                                                          // 259
                                                                                                                       //
      if (!fileRef) {                                                                                                  // 261
        return '';                                                                                                     // 262
      }                                                                                                                // 263
                                                                                                                       //
      return formatFleURL(fileRef, version);                                                                           // 264
    }                                                                                                                  // 265
                                                                                                                       //
    return link;                                                                                                       //
  }();                                                                                                                 //
                                                                                                                       //
  return FilesCollectionCore;                                                                                          //
}(EventEmitter);                                                                                                       //
                                                                                                                       //
FilesCollectionCore.schema = {                                                                                         // 7
  _id: {                                                                                                               // 13
    type: String                                                                                                       // 14
  },                                                                                                                   // 13
  size: {                                                                                                              // 16
    type: Number                                                                                                       // 17
  },                                                                                                                   // 16
  name: {                                                                                                              // 19
    type: String                                                                                                       // 20
  },                                                                                                                   // 19
  type: {                                                                                                              // 22
    type: String                                                                                                       // 23
  },                                                                                                                   // 22
  path: {                                                                                                              // 25
    type: String                                                                                                       // 26
  },                                                                                                                   // 25
  isVideo: {                                                                                                           // 28
    type: Boolean                                                                                                      // 29
  },                                                                                                                   // 28
  isAudio: {                                                                                                           // 31
    type: Boolean                                                                                                      // 32
  },                                                                                                                   // 31
  isImage: {                                                                                                           // 34
    type: Boolean                                                                                                      // 35
  },                                                                                                                   // 34
  isText: {                                                                                                            // 37
    type: Boolean                                                                                                      // 38
  },                                                                                                                   // 37
  isJSON: {                                                                                                            // 40
    type: Boolean                                                                                                      // 41
  },                                                                                                                   // 40
  isPDF: {                                                                                                             // 43
    type: Boolean                                                                                                      // 44
  },                                                                                                                   // 43
  extension: {                                                                                                         // 46
    type: String,                                                                                                      // 47
    optional: true                                                                                                     // 48
  },                                                                                                                   // 46
  ext: {                                                                                                               // 50
    type: String,                                                                                                      // 51
    optional: true                                                                                                     // 52
  },                                                                                                                   // 50
  extensionWithDot: {                                                                                                  // 54
    type: String,                                                                                                      // 55
    optional: true                                                                                                     // 56
  },                                                                                                                   // 54
  mime: {                                                                                                              // 58
    type: String                                                                                                       // 59
  },                                                                                                                   // 58
  'mime-type': {                                                                                                       // 61
    type: String                                                                                                       // 62
  },                                                                                                                   // 61
  _storagePath: {                                                                                                      // 64
    type: String                                                                                                       // 65
  },                                                                                                                   // 64
  _downloadRoute: {                                                                                                    // 67
    type: String                                                                                                       // 68
  },                                                                                                                   // 67
  _collectionName: {                                                                                                   // 70
    type: String                                                                                                       // 71
  },                                                                                                                   // 70
  "public": {                                                                                                          // 73
    type: Boolean,                                                                                                     // 74
    optional: true                                                                                                     // 75
  },                                                                                                                   // 73
  meta: {                                                                                                              // 77
    type: Object,                                                                                                      // 78
    blackbox: true,                                                                                                    // 79
    optional: true                                                                                                     // 80
  },                                                                                                                   // 77
  userId: {                                                                                                            // 82
    type: String,                                                                                                      // 83
    optional: true                                                                                                     // 84
  },                                                                                                                   // 82
  updatedAt: {                                                                                                         // 86
    type: Date,                                                                                                        // 87
    optional: true                                                                                                     // 88
  },                                                                                                                   // 86
  versions: {                                                                                                          // 90
    type: Object,                                                                                                      // 91
    blackbox: true                                                                                                     // 92
  }                                                                                                                    // 90
};                                                                                                                     // 12
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"cursor.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ostrio_files/cursor.js                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
module.export({                                                                                                        // 1
  FileCursor: function () {                                                                                            // 1
    return FileCursor;                                                                                                 // 1
  },                                                                                                                   // 1
  FilesCursor: function () {                                                                                           // 1
    return FilesCursor;                                                                                                // 1
  }                                                                                                                    // 1
});                                                                                                                    // 1
                                                                                                                       //
var _ = void 0;                                                                                                        // 1
                                                                                                                       //
module.watch(require("meteor/underscore"), {                                                                           // 1
  _: function (v) {                                                                                                    // 1
    _ = v;                                                                                                             // 1
  }                                                                                                                    // 1
}, 0);                                                                                                                 // 1
var Meteor = void 0;                                                                                                   // 1
module.watch(require("meteor/meteor"), {                                                                               // 1
  Meteor: function (v) {                                                                                               // 1
    Meteor = v;                                                                                                        // 1
  }                                                                                                                    // 1
}, 1);                                                                                                                 // 1
                                                                                                                       //
var FileCursor = function () {                                                                                         //
  function FileCursor(_fileRef, _collection) {                                                                         // 13
    (0, _classCallCheck3.default)(this, FileCursor);                                                                   // 13
    this._fileRef = _fileRef;                                                                                          // 14
    this._collection = _collection;                                                                                    // 15
                                                                                                                       //
    _.extend(this, _fileRef);                                                                                          // 16
  } /*                                                                                                                 // 17
     * @locus Anywhere                                                                                                 //
     * @memberOf FileCursor                                                                                            //
     * @name remove                                                                                                    //
     * @param callback {Function} - Triggered asynchronously after item is removed or failed to be removed             //
     * @summary Remove document                                                                                        //
     * @returns {FileCursor}                                                                                           //
     */                                                                                                                //
                                                                                                                       //
  FileCursor.prototype.remove = function () {                                                                          //
    function remove(callback) {                                                                                        //
      this._collection._debug('[FilesCollection] [FileCursor] [remove()]');                                            // 28
                                                                                                                       //
      if (this._fileRef) {                                                                                             // 29
        this._collection.remove(this._fileRef._id, callback);                                                          // 30
      } else {                                                                                                         // 31
        callback && callback(new Meteor.Error(404, 'No such file'));                                                   // 32
      }                                                                                                                // 33
                                                                                                                       //
      return this;                                                                                                     // 34
    }                                                                                                                  // 35
                                                                                                                       //
    return remove;                                                                                                     //
  }(); /*                                                                                                              //
        * @locus Anywhere                                                                                              //
        * @memberOf FileCursor                                                                                         //
        * @name link                                                                                                   //
        * @param version {String} - Name of file's subversion                                                          //
        * @summary Returns downloadable URL to File                                                                    //
        * @returns {String}                                                                                            //
        */                                                                                                             //
                                                                                                                       //
  FileCursor.prototype.link = function () {                                                                            //
    function link() {                                                                                                  //
      var version = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'original';                    // 45
                                                                                                                       //
      this._collection._debug("[FilesCollection] [FileCursor] [link(" + version + ")]");                               // 46
                                                                                                                       //
      if (this._fileRef) {                                                                                             // 47
        return this._collection.link(this._fileRef, version);                                                          // 48
      }                                                                                                                // 49
                                                                                                                       //
      return '';                                                                                                       // 50
    }                                                                                                                  // 51
                                                                                                                       //
    return link;                                                                                                       //
  }(); /*                                                                                                              //
        * @locus Anywhere                                                                                              //
        * @memberOf FileCursor                                                                                         //
        * @name get                                                                                                    //
        * @param property {String} - Name of sub-object property                                                       //
        * @summary Returns current document as a plain Object, if `property` is specified - returns value of sub-object property
        * @returns {Object|mix}                                                                                        //
        */                                                                                                             //
                                                                                                                       //
  FileCursor.prototype.get = function () {                                                                             //
    function get(property) {                                                                                           //
      this._collection._debug("[FilesCollection] [FileCursor] [get(" + property + ")]");                               // 62
                                                                                                                       //
      if (property) {                                                                                                  // 63
        return this._fileRef[property];                                                                                // 64
      }                                                                                                                // 65
                                                                                                                       //
      return this._fileRef;                                                                                            // 66
    }                                                                                                                  // 67
                                                                                                                       //
    return get;                                                                                                        //
  }(); /*                                                                                                              //
        * @locus Anywhere                                                                                              //
        * @memberOf FileCursor                                                                                         //
        * @name fetch                                                                                                  //
        * @summary Returns document as plain Object in Array                                                           //
        * @returns {[Object]}                                                                                          //
        */                                                                                                             //
                                                                                                                       //
  FileCursor.prototype.fetch = function () {                                                                           //
    function fetch() {                                                                                                 //
      this._collection._debug('[FilesCollection] [FileCursor] [fetch()]');                                             // 77
                                                                                                                       //
      return [this._fileRef];                                                                                          // 78
    }                                                                                                                  // 79
                                                                                                                       //
    return fetch;                                                                                                      //
  }(); /*                                                                                                              //
        * @locus Anywhere                                                                                              //
        * @memberOf FileCursor                                                                                         //
        * @name with                                                                                                   //
        * @summary Returns reactive version of current FileCursor, useful to use with `{{#with}}...{{/with}}` block template helper
        * @returns {[Object]}                                                                                          //
        */                                                                                                             //
                                                                                                                       //
  FileCursor.prototype.with = function () {                                                                            //
    function _with() {                                                                                                 //
      this._collection._debug('[FilesCollection] [FileCursor] [with()]');                                              // 89
                                                                                                                       //
      return _.extend(this, this._collection.collection.findOne(this._fileRef._id));                                   // 90
    }                                                                                                                  // 91
                                                                                                                       //
    return _with;                                                                                                      //
  }();                                                                                                                 //
                                                                                                                       //
  return FileCursor;                                                                                                   //
}();                                                                                                                   //
                                                                                                                       //
var FilesCursor = function () {                                                                                        //
  function FilesCursor() {                                                                                             // 104
    var _selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};                            // 104
                                                                                                                       //
    var options = arguments[1];                                                                                        // 104
    var _collection = arguments[2];                                                                                    // 104
    (0, _classCallCheck3.default)(this, FilesCursor);                                                                  // 104
    this._collection = _collection;                                                                                    // 105
    this._selector = _selector;                                                                                        // 106
    this._current = -1;                                                                                                // 107
    this.cursor = this._collection.collection.find(this._selector, options);                                           // 108
  } /*                                                                                                                 // 109
     * @locus Anywhere                                                                                                 //
     * @memberOf FilesCursor                                                                                           //
     * @name get                                                                                                       //
     * @summary Returns all matching document(s) as an Array. Alias of `.fetch()`                                      //
     * @returns {[Object]}                                                                                             //
     */                                                                                                                //
                                                                                                                       //
  FilesCursor.prototype.get = function () {                                                                            //
    function get() {                                                                                                   //
      this._collection._debug('[FilesCollection] [FilesCursor] [get()]');                                              // 119
                                                                                                                       //
      return this.cursor.fetch();                                                                                      // 120
    }                                                                                                                  // 121
                                                                                                                       //
    return get;                                                                                                        //
  }(); /*                                                                                                              //
        * @locus Anywhere                                                                                              //
        * @memberOf FilesCursor                                                                                        //
        * @name hasNext                                                                                                //
        * @summary Returns `true` if there is next item available on Cursor                                            //
        * @returns {Boolean}                                                                                           //
        */                                                                                                             //
                                                                                                                       //
  FilesCursor.prototype.hasNext = function () {                                                                        //
    function hasNext() {                                                                                               //
      this._collection._debug('[FilesCollection] [FilesCursor] [hasNext()]');                                          // 131
                                                                                                                       //
      return this._current < this.cursor.count() - 1;                                                                  // 132
    }                                                                                                                  // 133
                                                                                                                       //
    return hasNext;                                                                                                    //
  }(); /*                                                                                                              //
        * @locus Anywhere                                                                                              //
        * @memberOf FilesCursor                                                                                        //
        * @name next                                                                                                   //
        * @summary Returns next item on Cursor, if available                                                           //
        * @returns {Object|undefined}                                                                                  //
        */                                                                                                             //
                                                                                                                       //
  FilesCursor.prototype.next = function () {                                                                           //
    function next() {                                                                                                  //
      this._collection._debug('[FilesCollection] [FilesCursor] [next()]');                                             // 143
                                                                                                                       //
      this.cursor.fetch()[++this._current];                                                                            // 144
    }                                                                                                                  // 145
                                                                                                                       //
    return next;                                                                                                       //
  }(); /*                                                                                                              //
        * @locus Anywhere                                                                                              //
        * @memberOf FilesCursor                                                                                        //
        * @name hasPrevious                                                                                            //
        * @summary Returns `true` if there is previous item available on Cursor                                        //
        * @returns {Boolean}                                                                                           //
        */                                                                                                             //
                                                                                                                       //
  FilesCursor.prototype.hasPrevious = function () {                                                                    //
    function hasPrevious() {                                                                                           //
      this._collection._debug('[FilesCollection] [FilesCursor] [hasPrevious()]');                                      // 155
                                                                                                                       //
      return this._current !== -1;                                                                                     // 156
    }                                                                                                                  // 157
                                                                                                                       //
    return hasPrevious;                                                                                                //
  }(); /*                                                                                                              //
        * @locus Anywhere                                                                                              //
        * @memberOf FilesCursor                                                                                        //
        * @name previous                                                                                               //
        * @summary Returns previous item on Cursor, if available                                                       //
        * @returns {Object|undefined}                                                                                  //
        */                                                                                                             //
                                                                                                                       //
  FilesCursor.prototype.previous = function () {                                                                       //
    function previous() {                                                                                              //
      this._collection._debug('[FilesCollection] [FilesCursor] [previous()]');                                         // 167
                                                                                                                       //
      this.cursor.fetch()[--this._current];                                                                            // 168
    }                                                                                                                  // 169
                                                                                                                       //
    return previous;                                                                                                   //
  }(); /*                                                                                                              //
        * @locus Anywhere                                                                                              //
        * @memberOf FilesCursor                                                                                        //
        * @name fetch                                                                                                  //
        * @summary Returns all matching document(s) as an Array.                                                       //
        * @returns {[Object]}                                                                                          //
        */                                                                                                             //
                                                                                                                       //
  FilesCursor.prototype.fetch = function () {                                                                          //
    function fetch() {                                                                                                 //
      this._collection._debug('[FilesCollection] [FilesCursor] [fetch()]');                                            // 179
                                                                                                                       //
      return this.cursor.fetch() || [];                                                                                // 180
    }                                                                                                                  // 181
                                                                                                                       //
    return fetch;                                                                                                      //
  }(); /*                                                                                                              //
        * @locus Anywhere                                                                                              //
        * @memberOf FilesCursor                                                                                        //
        * @name first                                                                                                  //
        * @summary Returns first item on Cursor, if available                                                          //
        * @returns {Object|undefined}                                                                                  //
        */                                                                                                             //
                                                                                                                       //
  FilesCursor.prototype.first = function () {                                                                          //
    function first() {                                                                                                 //
      this._collection._debug('[FilesCollection] [FilesCursor] [first()]');                                            // 191
                                                                                                                       //
      this._current = 0;                                                                                               // 192
      return this.fetch()[this._current];                                                                              // 193
    }                                                                                                                  // 194
                                                                                                                       //
    return first;                                                                                                      //
  }(); /*                                                                                                              //
        * @locus Anywhere                                                                                              //
        * @memberOf FilesCursor                                                                                        //
        * @name last                                                                                                   //
        * @summary Returns last item on Cursor, if available                                                           //
        * @returns {Object|undefined}                                                                                  //
        */                                                                                                             //
                                                                                                                       //
  FilesCursor.prototype.last = function () {                                                                           //
    function last() {                                                                                                  //
      this._collection._debug('[FilesCollection] [FilesCursor] [last()]');                                             // 204
                                                                                                                       //
      this._current = this.count() - 1;                                                                                // 205
      return this.fetch()[this._current];                                                                              // 206
    }                                                                                                                  // 207
                                                                                                                       //
    return last;                                                                                                       //
  }(); /*                                                                                                              //
        * @locus Anywhere                                                                                              //
        * @memberOf FilesCursor                                                                                        //
        * @name count                                                                                                  //
        * @summary Returns the number of documents that match a query                                                  //
        * @returns {Number}                                                                                            //
        */                                                                                                             //
                                                                                                                       //
  FilesCursor.prototype.count = function () {                                                                          //
    function count() {                                                                                                 //
      this._collection._debug('[FilesCollection] [FilesCursor] [count()]');                                            // 217
                                                                                                                       //
      return this.cursor.count();                                                                                      // 218
    }                                                                                                                  // 219
                                                                                                                       //
    return count;                                                                                                      //
  }(); /*                                                                                                              //
        * @locus Anywhere                                                                                              //
        * @memberOf FilesCursor                                                                                        //
        * @name remove                                                                                                 //
        * @param callback {Function} - Triggered asynchronously after item is removed or failed to be removed          //
        * @summary Removes all documents that match a query                                                            //
        * @returns {FilesCursor}                                                                                       //
        */                                                                                                             //
                                                                                                                       //
  FilesCursor.prototype.remove = function () {                                                                         //
    function remove(callback) {                                                                                        //
      this._collection._debug('[FilesCollection] [FilesCursor] [remove()]');                                           // 230
                                                                                                                       //
      this._collection.remove(this._selector, callback);                                                               // 231
                                                                                                                       //
      return this;                                                                                                     // 232
    }                                                                                                                  // 233
                                                                                                                       //
    return remove;                                                                                                     //
  }(); /*                                                                                                              //
        * @locus Anywhere                                                                                              //
        * @memberOf FilesCursor                                                                                        //
        * @name forEach                                                                                                //
        * @param callback {Function} - Function to call. It will be called with three arguments: the `file`, a 0-based index, and cursor itself
        * @param context {Object} - An object which will be the value of `this` inside `callback`                      //
        * @summary Call `callback` once for each matching document, sequentially and synchronously.                    //
        * @returns {undefined}                                                                                         //
        */                                                                                                             //
                                                                                                                       //
  FilesCursor.prototype.forEach = function () {                                                                        //
    function forEach(callback) {                                                                                       //
      var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};                            // 244
                                                                                                                       //
      this._collection._debug('[FilesCollection] [FilesCursor] [forEach()]');                                          // 245
                                                                                                                       //
      this.cursor.forEach(callback, context);                                                                          // 246
    }                                                                                                                  // 247
                                                                                                                       //
    return forEach;                                                                                                    //
  }(); /*                                                                                                              //
        * @locus Anywhere                                                                                              //
        * @memberOf FilesCursor                                                                                        //
        * @name each                                                                                                   //
        * @summary Returns an Array of FileCursor made for each document on current cursor                             //
        *          Useful when using in {{#each FilesCursor#each}}...{{/each}} block template helper                   //
        * @returns {[FileCursor]}                                                                                      //
        */                                                                                                             //
                                                                                                                       //
  FilesCursor.prototype.each = function () {                                                                           //
    function each() {                                                                                                  //
      var _this = this;                                                                                                // 257
                                                                                                                       //
      return this.map(function (file) {                                                                                // 258
        return new FileCursor(file, _this._collection);                                                                // 259
      });                                                                                                              // 260
    }                                                                                                                  // 261
                                                                                                                       //
    return each;                                                                                                       //
  }(); /*                                                                                                              //
        * @locus Anywhere                                                                                              //
        * @memberOf FilesCursor                                                                                        //
        * @name map                                                                                                    //
        * @param callback {Function} - Function to call. It will be called with three arguments: the `file`, a 0-based index, and cursor itself
        * @param context {Object} - An object which will be the value of `this` inside `callback`                      //
        * @summary Map `callback` over all matching documents. Returns an Array.                                       //
        * @returns {Array}                                                                                             //
        */                                                                                                             //
                                                                                                                       //
  FilesCursor.prototype.map = function () {                                                                            //
    function map(callback) {                                                                                           //
      var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};                            // 272
                                                                                                                       //
      this._collection._debug('[FilesCollection] [FilesCursor] [map()]');                                              // 273
                                                                                                                       //
      return this.cursor.map(callback, context);                                                                       // 274
    }                                                                                                                  // 275
                                                                                                                       //
    return map;                                                                                                        //
  }(); /*                                                                                                              //
        * @locus Anywhere                                                                                              //
        * @memberOf FilesCursor                                                                                        //
        * @name current                                                                                                //
        * @summary Returns current item on Cursor, if available                                                        //
        * @returns {Object|undefined}                                                                                  //
        */                                                                                                             //
                                                                                                                       //
  FilesCursor.prototype.current = function () {                                                                        //
    function current() {                                                                                               //
      this._collection._debug('[FilesCollection] [FilesCursor] [current()]');                                          // 285
                                                                                                                       //
      if (this._current < 0) {                                                                                         // 286
        this._current = 0;                                                                                             // 287
      }                                                                                                                // 288
                                                                                                                       //
      return this.fetch()[this._current];                                                                              // 289
    }                                                                                                                  // 290
                                                                                                                       //
    return current;                                                                                                    //
  }(); /*                                                                                                              //
        * @locus Anywhere                                                                                              //
        * @memberOf FilesCursor                                                                                        //
        * @name observe                                                                                                //
        * @param callbacks {Object} - Functions to call to deliver the result set as it changes                        //
        * @summary Watch a query. Receive callbacks as the result set changes.                                         //
        * @url http://docs.meteor.com/api/collections.html#Mongo-Cursor-observe                                        //
        * @returns {Object} - live query handle                                                                        //
        */                                                                                                             //
                                                                                                                       //
  FilesCursor.prototype.observe = function () {                                                                        //
    function observe(callbacks) {                                                                                      //
      this._collection._debug('[FilesCollection] [FilesCursor] [observe()]');                                          // 302
                                                                                                                       //
      return this.cursor.observe(callbacks);                                                                           // 303
    }                                                                                                                  // 304
                                                                                                                       //
    return observe;                                                                                                    //
  }(); /*                                                                                                              //
        * @locus Anywhere                                                                                              //
        * @memberOf FilesCursor                                                                                        //
        * @name observeChanges                                                                                         //
        * @param callbacks {Object} - Functions to call to deliver the result set as it changes                        //
        * @summary Watch a query. Receive callbacks as the result set changes. Only the differences between the old and new documents are passed to the callbacks.
        * @url http://docs.meteor.com/api/collections.html#Mongo-Cursor-observeChanges                                 //
        * @returns {Object} - live query handle                                                                        //
        */                                                                                                             //
                                                                                                                       //
  FilesCursor.prototype.observeChanges = function () {                                                                 //
    function observeChanges(callbacks) {                                                                               //
      this._collection._debug('[FilesCollection] [FilesCursor] [observeChanges()]');                                   // 316
                                                                                                                       //
      return this.cursor.observeChanges(callbacks);                                                                    // 317
    }                                                                                                                  // 318
                                                                                                                       //
    return observeChanges;                                                                                             //
  }();                                                                                                                 //
                                                                                                                       //
  return FilesCursor;                                                                                                  //
}();                                                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ostrio_files/lib.js                                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({                                                                                                        // 1
  fixJSONParse: function () {                                                                                          // 1
    return fixJSONParse;                                                                                               // 1
  },                                                                                                                   // 1
  fixJSONStringify: function () {                                                                                      // 1
    return fixJSONStringify;                                                                                           // 1
  },                                                                                                                   // 1
  formatFleURL: function () {                                                                                          // 1
    return formatFleURL;                                                                                               // 1
  }                                                                                                                    // 1
});                                                                                                                    // 1
                                                                                                                       //
var _ = void 0;                                                                                                        // 1
                                                                                                                       //
module.watch(require("meteor/underscore"), {                                                                           // 1
  _: function (v) {                                                                                                    // 1
    _ = v;                                                                                                             // 1
  }                                                                                                                    // 1
}, 0);                                                                                                                 // 1
var check = void 0;                                                                                                    // 1
module.watch(require("meteor/check"), {                                                                                // 1
  check: function (v) {                                                                                                // 1
    check = v;                                                                                                         // 1
  }                                                                                                                    // 1
}, 1);                                                                                                                 // 1
                                                                                                                       //
/*                                                                                                                     // 4
 * @const {Function} fixJSONParse - Fix issue with Date parse                                                          //
 */var fixJSONParse = function (obj) {                                                                                 //
  for (var key in meteorBabelHelpers.sanitizeForInObject(obj)) {                                                       // 8
    if (_.isString(obj[key]) && !!~obj[key].indexOf('=--JSON-DATE--=')) {                                              // 9
      obj[key] = obj[key].replace('=--JSON-DATE--=', '');                                                              // 10
      obj[key] = new Date(parseInt(obj[key]));                                                                         // 11
    } else if (_.isObject(obj[key])) {                                                                                 // 12
      obj[key] = fixJSONParse(obj[key]);                                                                               // 13
    } else if (_.isArray(obj[key])) {                                                                                  // 14
      var v = void 0;                                                                                                  // 15
                                                                                                                       //
      for (var i = 0; i < obj[key].length; i++) {                                                                      // 16
        v = obj[key][i];                                                                                               // 17
                                                                                                                       //
        if (_.isObject(v)) {                                                                                           // 18
          obj[key][i] = fixJSONParse(v);                                                                               // 19
        } else if (_.isString(v) && !!~v.indexOf('=--JSON-DATE--=')) {                                                 // 20
          v = v.replace('=--JSON-DATE--=', '');                                                                        // 21
          obj[key][i] = new Date(parseInt(v));                                                                         // 22
        }                                                                                                              // 23
      }                                                                                                                // 24
    }                                                                                                                  // 25
  }                                                                                                                    // 26
                                                                                                                       //
  return obj;                                                                                                          // 27
}; /*                                                                                                                  // 28
    * @const {Function} fixJSONStringify - Fix issue with Date stringify                                               //
    */                                                                                                                 //
                                                                                                                       //
var fixJSONStringify = function (obj) {                                                                                // 33
  for (var key in meteorBabelHelpers.sanitizeForInObject(obj)) {                                                       // 34
    if (_.isDate(obj[key])) {                                                                                          // 35
      obj[key] = "=--JSON-DATE--=" + +obj[key];                                                                        // 36
    } else if (_.isObject(obj[key])) {                                                                                 // 37
      obj[key] = fixJSONStringify(obj[key]);                                                                           // 38
    } else if (_.isArray(obj[key])) {                                                                                  // 39
      var v = void 0;                                                                                                  // 40
                                                                                                                       //
      for (var i = 0; i < obj[key].length; i++) {                                                                      // 41
        v = obj[key][i];                                                                                               // 42
                                                                                                                       //
        if (_.isObject(v)) {                                                                                           // 43
          obj[key][i] = fixJSONStringify(v);                                                                           // 44
        } else if (_.isDate(v)) {                                                                                      // 45
          obj[key][i] = "=--JSON-DATE--=" + +v;                                                                        // 46
        }                                                                                                              // 47
      }                                                                                                                // 48
    }                                                                                                                  // 49
  }                                                                                                                    // 50
                                                                                                                       //
  return obj;                                                                                                          // 51
}; /*                                                                                                                  // 52
    * @locus Anywhere                                                                                                  //
    * @private                                                                                                         //
    * @name formatFleURL                                                                                               //
    * @param {Object} fileRef - File reference object                                                                  //
    * @param {String} version - [Optional] Version of file you would like build URL for                                //
    * @summary Returns formatted URL for file                                                                          //
    * @returns {String} Downloadable link                                                                              //
    */                                                                                                                 //
                                                                                                                       //
var formatFleURL = function (fileRef) {                                                                                // 63
  var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'original';                        // 63
  var ext = void 0;                                                                                                    // 64
  check(fileRef, Object);                                                                                              // 65
  check(version, String);                                                                                              // 66
                                                                                                                       //
  var _root = __meteor_runtime_config__.ROOT_URL.replace(/\/+$/, '');                                                  // 68
                                                                                                                       //
  var vRef = fileRef.versions && fileRef.versions[version] || fileRef || {};                                           // 69
                                                                                                                       //
  if (_.isString(vRef.extension)) {                                                                                    // 71
    ext = "." + vRef.extension.replace(/^\./, '');                                                                     // 72
  } else {                                                                                                             // 73
    ext = '';                                                                                                          // 74
  }                                                                                                                    // 75
                                                                                                                       //
  if (fileRef.public === true) {                                                                                       // 77
    return _root + (version === 'original' ? fileRef._downloadRoute + "/" + fileRef._id + ext : fileRef._downloadRoute + "/" + version + "-" + fileRef._id + ext);
  }                                                                                                                    // 79
                                                                                                                       //
  return _root + (fileRef._downloadRoute + "/" + fileRef._collectionName + "/" + fileRef._id + "/" + version + "/" + fileRef._id + ext);
};                                                                                                                     // 81
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"write-stream.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ostrio_files/write-stream.js                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
module.export({                                                                                                        // 1
  "default": function () {                                                                                             // 1
    return WriteStream;                                                                                                // 1
  }                                                                                                                    // 1
});                                                                                                                    // 1
var fs = void 0;                                                                                                       // 1
module.watch(require("fs-extra"), {                                                                                    // 1
  "default": function (v) {                                                                                            // 1
    fs = v;                                                                                                            // 1
  }                                                                                                                    // 1
}, 0);                                                                                                                 // 1
                                                                                                                       //
var _ = void 0;                                                                                                        // 1
                                                                                                                       //
module.watch(require("meteor/underscore"), {                                                                           // 1
  _: function (v) {                                                                                                    // 1
    _ = v;                                                                                                             // 1
  }                                                                                                                    // 1
}, 1);                                                                                                                 // 1
var Meteor = void 0;                                                                                                   // 1
module.watch(require("meteor/meteor"), {                                                                               // 1
  Meteor: function (v) {                                                                                               // 1
    Meteor = v;                                                                                                        // 1
  }                                                                                                                    // 1
}, 2);                                                                                                                 // 1
                                                                                                                       //
var NOOP = function () {}; /*                                                                                          // 4
                            * @const {Object} bound   - Meteor.bindEnvironment (Fiber wrapper)                         //
                            * @const {Object} fdCache - File Descriptors Cache                                         //
                            */                                                                                         //
                                                                                                                       //
var bound = Meteor.bindEnvironment(function (callback) {                                                               // 10
  return callback();                                                                                                   // 10
});                                                                                                                    // 10
var fdCache = {}; /*                                                                                                   // 11
                   * @private                                                                                          //
                   * @locus Server                                                                                     //
                   * @class WriteStream                                                                                //
                   * @param path      {String} - Path to file on FS                                                    //
                   * @param maxLength {Number} - Max amount of chunks in stream                                        //
                   * @param file      {Object} - fileRef Object                                                        //
                   * @summary writableStream wrapper class, makes sure chunks is written in given order. Implementation of queue stream.
                   */                                                                                                  //
                                                                                                                       //
var WriteStream = function () {                                                                                        //
  function WriteStream(path, maxLength, file, permissions) {                                                           // 23
    var _this = this;                                                                                                  // 23
                                                                                                                       //
    (0, _classCallCheck3.default)(this, WriteStream);                                                                  // 23
    this.path = path;                                                                                                  // 24
    this.maxLength = maxLength;                                                                                        // 25
    this.file = file;                                                                                                  // 26
    this.permissions = permissions;                                                                                    // 27
                                                                                                                       //
    if (!this.path || !_.isString(this.path)) {                                                                        // 28
      return;                                                                                                          // 29
    }                                                                                                                  // 30
                                                                                                                       //
    this.fd = null;                                                                                                    // 32
    this.writtenChunks = 0;                                                                                            // 33
    this.ended = false;                                                                                                // 34
    this.aborted = false;                                                                                              // 35
                                                                                                                       //
    if (fdCache[this.path] && !fdCache[this.path].ended && !fdCache[this.path].aborted) {                              // 37
      this.fd = fdCache[this.path].fd;                                                                                 // 38
      this.writtenChunks = fdCache[this.path].writtenChunks;                                                           // 39
    } else {                                                                                                           // 40
      fs.ensureFile(this.path, function (efError) {                                                                    // 41
        bound(function () {                                                                                            // 42
          if (efError) {                                                                                               // 43
            _this.abort();                                                                                             // 44
                                                                                                                       //
            throw new Meteor.Error(500, '[FilesCollection] [writeStream] [ensureFile] [Error:] ' + efError);           // 45
          } else {                                                                                                     // 46
            fs.open(_this.path, 'r+', _this.permissions, function (oError, fd) {                                       // 47
              bound(function () {                                                                                      // 48
                if (oError) {                                                                                          // 49
                  _this.abort();                                                                                       // 50
                                                                                                                       //
                  throw new Meteor.Error(500, '[FilesCollection] [writeStream] [ensureFile] [open] [Error:] ' + oError);
                } else {                                                                                               // 52
                  _this.fd = fd;                                                                                       // 53
                  fdCache[_this.path] = _this;                                                                         // 54
                }                                                                                                      // 55
              });                                                                                                      // 56
            });                                                                                                        // 57
          }                                                                                                            // 58
        });                                                                                                            // 59
      });                                                                                                              // 60
    }                                                                                                                  // 61
  } /*                                                                                                                 // 62
     * @memberOf writeStream                                                                                           //
     * @name write                                                                                                     //
     * @param {Number} num - Chunk position in a stream                                                                //
     * @param {Buffer} chunk - Buffer (chunk binary data)                                                              //
     * @param {Function} callback - Callback                                                                           //
     * @summary Write chunk in given order                                                                             //
     * @returns {Boolean} - True if chunk is sent to stream, false if chunk is set into queue                          //
     */                                                                                                                //
                                                                                                                       //
  WriteStream.prototype.write = function () {                                                                          //
    function write(num, chunk, callback) {                                                                             //
      var _this2 = this;                                                                                               // 73
                                                                                                                       //
      if (!this.aborted && !this.ended) {                                                                              // 74
        if (this.fd) {                                                                                                 // 75
          fs.write(this.fd, chunk, 0, chunk.length, (num - 1) * this.file.chunkSize, function (error, written, buffer) {
            bound(function () {                                                                                        // 77
              callback && callback(error, written, buffer);                                                            // 78
                                                                                                                       //
              if (error) {                                                                                             // 79
                console.warn('[FilesCollection] [writeStream] [write] [Error:]', error);                               // 80
                                                                                                                       //
                _this2.abort();                                                                                        // 81
              } else {                                                                                                 // 82
                ++_this2.writtenChunks;                                                                                // 83
              }                                                                                                        // 84
            });                                                                                                        // 85
          });                                                                                                          // 86
        } else {                                                                                                       // 87
          Meteor.setTimeout(function () {                                                                              // 88
            _this2.write(num, chunk, callback);                                                                        // 89
          }, 25);                                                                                                      // 90
        }                                                                                                              // 91
      }                                                                                                                // 92
                                                                                                                       //
      return false;                                                                                                    // 93
    }                                                                                                                  // 94
                                                                                                                       //
    return write;                                                                                                      //
  }(); /*                                                                                                              //
        * @memberOf writeStream                                                                                        //
        * @name end                                                                                                    //
        * @param {Function} callback - Callback                                                                        //
        * @summary Finishes writing to writableStream, only after all chunks in queue is written                       //
        * @returns {Boolean} - True if stream is fulfilled, false if queue is in progress                              //
        */                                                                                                             //
                                                                                                                       //
  WriteStream.prototype.end = function () {                                                                            //
    function end(callback) {                                                                                           //
      var _this3 = this;                                                                                               // 103
                                                                                                                       //
      if (!this.aborted && !this.ended) {                                                                              // 104
        if (this.writtenChunks === this.maxLength) {                                                                   // 105
          fs.close(this.fd, function () {                                                                              // 106
            bound(function () {                                                                                        // 107
              delete fdCache[_this3.path];                                                                             // 108
              _this3.ended = true;                                                                                     // 109
              callback && callback(void 0, true);                                                                      // 110
            });                                                                                                        // 111
          });                                                                                                          // 112
          return true;                                                                                                 // 113
        }                                                                                                              // 114
                                                                                                                       //
        fs.stat(this.path, function (error, stat) {                                                                    // 116
          bound(function () {                                                                                          // 117
            if (!error && stat) {                                                                                      // 118
              _this3.writtenChunks = Math.ceil(stat.size / _this3.file.chunkSize);                                     // 119
            }                                                                                                          // 120
                                                                                                                       //
            return Meteor.setTimeout(function () {                                                                     // 122
              _this3.end(callback);                                                                                    // 123
            }, 25);                                                                                                    // 124
          });                                                                                                          // 125
        });                                                                                                            // 126
      } else {                                                                                                         // 127
        callback && callback(void 0, this.ended);                                                                      // 128
      }                                                                                                                // 129
                                                                                                                       //
      return false;                                                                                                    // 130
    }                                                                                                                  // 131
                                                                                                                       //
    return end;                                                                                                        //
  }(); /*                                                                                                              //
        * @memberOf writeStream                                                                                        //
        * @name abort                                                                                                  //
        * @param {Function} callback - Callback                                                                        //
        * @summary Aborts writing to writableStream, removes created file                                              //
        * @returns {Boolean} - True                                                                                    //
        */                                                                                                             //
                                                                                                                       //
  WriteStream.prototype.abort = function () {                                                                          //
    function abort(callback) {                                                                                         //
      this.aborted = true;                                                                                             // 141
      delete fdCache[this.path];                                                                                       // 142
      fs.unlink(this.path, callback || NOOP);                                                                          // 143
      return true;                                                                                                     // 144
    }                                                                                                                  // 145
                                                                                                                       //
    return abort;                                                                                                      //
  }(); /*                                                                                                              //
        * @memberOf writeStream                                                                                        //
        * @name stop                                                                                                   //
        * @summary Stop writing to writableStream                                                                      //
        * @returns {Boolean} - True                                                                                    //
        */                                                                                                             //
                                                                                                                       //
  WriteStream.prototype.stop = function () {                                                                           //
    function stop() {                                                                                                  //
      this.aborted = true;                                                                                             // 154
      delete fdCache[this.path];                                                                                       // 155
      return true;                                                                                                     // 156
    }                                                                                                                  // 157
                                                                                                                       //
    return stop;                                                                                                       //
  }();                                                                                                                 //
                                                                                                                       //
  return WriteStream;                                                                                                  //
}();                                                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"node_modules":{"fs-extra":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// ../npm/node_modules/fs-extra/package.json                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
exports.name = "fs-extra";
exports.version = "5.0.0";
exports.main = "./lib/index.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/ostrio_files/node_modules/fs-extra/lib/index.js                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
'use strict'

const assign = require('./util/assign')

const fs = {}

// Export graceful-fs:
assign(fs, require('./fs'))
// Export extra methods:
assign(fs, require('./copy'))
assign(fs, require('./copy-sync'))
assign(fs, require('./mkdirs'))
assign(fs, require('./remove'))
assign(fs, require('./json'))
assign(fs, require('./move'))
assign(fs, require('./move-sync'))
assign(fs, require('./empty'))
assign(fs, require('./ensure'))
assign(fs, require('./output'))
assign(fs, require('./path-exists'))

module.exports = fs

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"eventemitter3":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// ../npm/node_modules/eventemitter3/package.json                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
exports.name = "eventemitter3";
exports.version = "3.0.1";
exports.main = "index.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/ostrio_files/node_modules/eventemitter3/index.js                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
'use strict';

var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
  module.exports = EventEmitter;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"request":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// ../npm/node_modules/request/package.json                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
exports.name = "request";
exports.version = "2.83.0";
exports.main = "index.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/ostrio_files/node_modules/request/index.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// Copyright 2010-2012 Mikeal Rogers
//
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
//
//        http://www.apache.org/licenses/LICENSE-2.0
//
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

'use strict'

var extend = require('extend')
var cookies = require('./lib/cookies')
var helpers = require('./lib/helpers')

var paramsHaveRequestBody = helpers.paramsHaveRequestBody

// organize params for patch, post, put, head, del
function initParams (uri, options, callback) {
  if (typeof options === 'function') {
    callback = options
  }

  var params = {}
  if (typeof options === 'object') {
    extend(params, options, {uri: uri})
  } else if (typeof uri === 'string') {
    extend(params, {uri: uri})
  } else {
    extend(params, uri)
  }

  params.callback = callback || params.callback
  return params
}

function request (uri, options, callback) {
  if (typeof uri === 'undefined') {
    throw new Error('undefined is not a valid uri or options object.')
  }

  var params = initParams(uri, options, callback)

  if (params.method === 'HEAD' && paramsHaveRequestBody(params)) {
    throw new Error('HTTP HEAD requests MUST NOT include a request body.')
  }

  return new request.Request(params)
}

function verbFunc (verb) {
  var method = verb.toUpperCase()
  return function (uri, options, callback) {
    var params = initParams(uri, options, callback)
    params.method = method
    return request(params, params.callback)
  }
}

// define like this to please codeintel/intellisense IDEs
request.get = verbFunc('get')
request.head = verbFunc('head')
request.options = verbFunc('options')
request.post = verbFunc('post')
request.put = verbFunc('put')
request.patch = verbFunc('patch')
request.del = verbFunc('delete')
request['delete'] = verbFunc('delete')

request.jar = function (store) {
  return cookies.jar(store)
}

request.cookie = function (str) {
  return cookies.parse(str)
}

function wrapRequestMethod (method, options, requester, verb) {
  return function (uri, opts, callback) {
    var params = initParams(uri, opts, callback)

    var target = {}
    extend(true, target, options, params)

    target.pool = params.pool || options.pool

    if (verb) {
      target.method = verb.toUpperCase()
    }

    if (typeof requester === 'function') {
      method = requester
    }

    return method(target, target.callback)
  }
}

request.defaults = function (options, requester) {
  var self = this

  options = options || {}

  if (typeof options === 'function') {
    requester = options
    options = {}
  }

  var defaults = wrapRequestMethod(self, options, requester)

  var verbs = ['get', 'head', 'post', 'put', 'patch', 'del', 'delete']
  verbs.forEach(function (verb) {
    defaults[verb] = wrapRequestMethod(self[verb], options, requester, verb)
  })

  defaults.cookie = wrapRequestMethod(self.cookie, options, requester)
  defaults.jar = self.jar
  defaults.defaults = self.defaults
  return defaults
}

request.forever = function (agentOptions, optionsArg) {
  var options = {}
  if (optionsArg) {
    extend(options, optionsArg)
  }
  if (agentOptions) {
    options.agentOptions = agentOptions
  }

  options.forever = true
  return request.defaults(options)
}

// Exports

module.exports = request
request.Request = require('./request')
request.initParams = initParams

// Backwards compatibility for request.debug
Object.defineProperty(request, 'debug', {
  enumerable: true,
  get: function () {
    return request.Request.debug
  },
  set: function (debug) {
    request.Request.debug = debug
  }
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"file-type":{"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/ostrio_files/node_modules/file-type/index.js                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
'use strict';
const toBytes = s => Array.from(s).map(c => c.charCodeAt(0));
const xpiZipFilename = toBytes('META-INF/mozilla.rsa');
const oxmlContentTypes = toBytes('[Content_Types].xml');
const oxmlRels = toBytes('_rels/.rels');

module.exports = input => {
	const buf = (input instanceof Uint8Array) ? input : new Uint8Array(input);

	if (!(buf && buf.length > 1)) {
		return null;
	}

	const check = (header, options) => {
		options = Object.assign({
			offset: 0
		}, options);

		for (let i = 0; i < header.length; i++) {
			// If a bitmask is set
			if (options.mask) {
				// If header doesn't equal `buf` with bits masked off
				if (header[i] !== (options.mask[i] & buf[i + options.offset])) {
					return false;
				}
			} else if (header[i] !== buf[i + options.offset]) {
				return false;
			}
		}

		return true;
	};

	const checkString = (header, options) => check(toBytes(header), options);

	if (check([0xFF, 0xD8, 0xFF])) {
		return {
			ext: 'jpg',
			mime: 'image/jpeg'
		};
	}

	if (check([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])) {
		return {
			ext: 'png',
			mime: 'image/png'
		};
	}

	if (check([0x47, 0x49, 0x46])) {
		return {
			ext: 'gif',
			mime: 'image/gif'
		};
	}

	if (check([0x57, 0x45, 0x42, 0x50], {offset: 8})) {
		return {
			ext: 'webp',
			mime: 'image/webp'
		};
	}

	if (check([0x46, 0x4C, 0x49, 0x46])) {
		return {
			ext: 'flif',
			mime: 'image/flif'
		};
	}

	// Needs to be before `tif` check
	if (
		(check([0x49, 0x49, 0x2A, 0x0]) || check([0x4D, 0x4D, 0x0, 0x2A])) &&
		check([0x43, 0x52], {offset: 8})
	) {
		return {
			ext: 'cr2',
			mime: 'image/x-canon-cr2'
		};
	}

	if (
		check([0x49, 0x49, 0x2A, 0x0]) ||
		check([0x4D, 0x4D, 0x0, 0x2A])
	) {
		return {
			ext: 'tif',
			mime: 'image/tiff'
		};
	}

	if (check([0x42, 0x4D])) {
		return {
			ext: 'bmp',
			mime: 'image/bmp'
		};
	}

	if (check([0x49, 0x49, 0xBC])) {
		return {
			ext: 'jxr',
			mime: 'image/vnd.ms-photo'
		};
	}

	if (check([0x38, 0x42, 0x50, 0x53])) {
		return {
			ext: 'psd',
			mime: 'image/vnd.adobe.photoshop'
		};
	}

	// Zip-based file formats
	// Need to be before the `zip` check
	if (check([0x50, 0x4B, 0x3, 0x4])) {
		if (
			check([0x6D, 0x69, 0x6D, 0x65, 0x74, 0x79, 0x70, 0x65, 0x61, 0x70, 0x70, 0x6C, 0x69, 0x63, 0x61, 0x74, 0x69, 0x6F, 0x6E, 0x2F, 0x65, 0x70, 0x75, 0x62, 0x2B, 0x7A, 0x69, 0x70], {offset: 30})
		) {
			return {
				ext: 'epub',
				mime: 'application/epub+zip'
			};
		}

		// Assumes signed `.xpi` from addons.mozilla.org
		if (check(xpiZipFilename, {offset: 30})) {
			return {
				ext: 'xpi',
				mime: 'application/x-xpinstall'
			};
		}

		if (checkString('mimetypeapplication/vnd.oasis.opendocument.text', {offset: 30})) {
			return {
				ext: 'odt',
				mime: 'application/vnd.oasis.opendocument.text'
			};
		}

		if (checkString('mimetypeapplication/vnd.oasis.opendocument.spreadsheet', {offset: 30})) {
			return {
				ext: 'ods',
				mime: 'application/vnd.oasis.opendocument.spreadsheet'
			};
		}

		if (checkString('mimetypeapplication/vnd.oasis.opendocument.presentation', {offset: 30})) {
			return {
				ext: 'odp',
				mime: 'application/vnd.oasis.opendocument.presentation'
			};
		}

		// https://github.com/file/file/blob/master/magic/Magdir/msooxml
		if (check(oxmlContentTypes, {offset: 30}) || check(oxmlRels, {offset: 30})) {
			const sliced = buf.subarray(4, 4 + 2000);
			const nextZipHeaderIndex = arr => arr.findIndex((el, i, arr) => arr[i] === 0x50 && arr[i + 1] === 0x4B && arr[i + 2] === 0x3 && arr[i + 3] === 0x4);
			const header2Pos = nextZipHeaderIndex(sliced);

			if (header2Pos !== -1) {
				const slicedAgain = buf.subarray(header2Pos + 8, header2Pos + 8 + 1000);
				const header3Pos = nextZipHeaderIndex(slicedAgain);

				if (header3Pos !== -1) {
					const offset = 8 + header2Pos + header3Pos + 30;

					if (checkString('word/', {offset})) {
						return {
							ext: 'docx',
							mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
						};
					}

					if (checkString('ppt/', {offset})) {
						return {
							ext: 'pptx',
							mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
						};
					}

					if (checkString('xl/', {offset})) {
						return {
							ext: 'xlsx',
							mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
						};
					}
				}
			}
		}
	}

	if (
		check([0x50, 0x4B]) &&
		(buf[2] === 0x3 || buf[2] === 0x5 || buf[2] === 0x7) &&
		(buf[3] === 0x4 || buf[3] === 0x6 || buf[3] === 0x8)
	) {
		return {
			ext: 'zip',
			mime: 'application/zip'
		};
	}

	if (check([0x75, 0x73, 0x74, 0x61, 0x72], {offset: 257})) {
		return {
			ext: 'tar',
			mime: 'application/x-tar'
		};
	}

	if (
		check([0x52, 0x61, 0x72, 0x21, 0x1A, 0x7]) &&
		(buf[6] === 0x0 || buf[6] === 0x1)
	) {
		return {
			ext: 'rar',
			mime: 'application/x-rar-compressed'
		};
	}

	if (check([0x1F, 0x8B, 0x8])) {
		return {
			ext: 'gz',
			mime: 'application/gzip'
		};
	}

	if (check([0x42, 0x5A, 0x68])) {
		return {
			ext: 'bz2',
			mime: 'application/x-bzip2'
		};
	}

	if (check([0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C])) {
		return {
			ext: '7z',
			mime: 'application/x-7z-compressed'
		};
	}

	if (check([0x78, 0x01])) {
		return {
			ext: 'dmg',
			mime: 'application/x-apple-diskimage'
		};
	}

	if (check([0x33, 0x67, 0x70, 0x35]) || // 3gp5
		(
			check([0x0, 0x0, 0x0]) && check([0x66, 0x74, 0x79, 0x70], {offset: 4}) &&
				(
					check([0x6D, 0x70, 0x34, 0x31], {offset: 8}) || // MP41
					check([0x6D, 0x70, 0x34, 0x32], {offset: 8}) || // MP42
					check([0x69, 0x73, 0x6F, 0x6D], {offset: 8}) || // ISOM
					check([0x69, 0x73, 0x6F, 0x32], {offset: 8}) || // ISO2
					check([0x6D, 0x6D, 0x70, 0x34], {offset: 8}) || // MMP4
					check([0x4D, 0x34, 0x56], {offset: 8}) || // M4V
					check([0x64, 0x61, 0x73, 0x68], {offset: 8}) // DASH
				)
		)) {
		return {
			ext: 'mp4',
			mime: 'video/mp4'
		};
	}

	if (check([0x4D, 0x54, 0x68, 0x64])) {
		return {
			ext: 'mid',
			mime: 'audio/midi'
		};
	}

	// https://github.com/threatstack/libmagic/blob/master/magic/Magdir/matroska
	if (check([0x1A, 0x45, 0xDF, 0xA3])) {
		const sliced = buf.subarray(4, 4 + 4096);
		const idPos = sliced.findIndex((el, i, arr) => arr[i] === 0x42 && arr[i + 1] === 0x82);

		if (idPos !== -1) {
			const docTypePos = idPos + 3;
			const findDocType = type => Array.from(type).every((c, i) => sliced[docTypePos + i] === c.charCodeAt(0));

			if (findDocType('matroska')) {
				return {
					ext: 'mkv',
					mime: 'video/x-matroska'
				};
			}

			if (findDocType('webm')) {
				return {
					ext: 'webm',
					mime: 'video/webm'
				};
			}
		}
	}

	if (check([0x0, 0x0, 0x0, 0x14, 0x66, 0x74, 0x79, 0x70, 0x71, 0x74, 0x20, 0x20]) ||
		check([0x66, 0x72, 0x65, 0x65], {offset: 4}) ||
		check([0x66, 0x74, 0x79, 0x70, 0x71, 0x74, 0x20, 0x20], {offset: 4}) ||
		check([0x6D, 0x64, 0x61, 0x74], {offset: 4}) || // MJPEG
		check([0x77, 0x69, 0x64, 0x65], {offset: 4})) {
		return {
			ext: 'mov',
			mime: 'video/quicktime'
		};
	}

	if (
		check([0x52, 0x49, 0x46, 0x46]) &&
		check([0x41, 0x56, 0x49], {offset: 8})
	) {
		return {
			ext: 'avi',
			mime: 'video/x-msvideo'
		};
	}

	if (check([0x30, 0x26, 0xB2, 0x75, 0x8E, 0x66, 0xCF, 0x11, 0xA6, 0xD9])) {
		return {
			ext: 'wmv',
			mime: 'video/x-ms-wmv'
		};
	}

	if (
		check([0x0, 0x0, 0x1, 0xBA]) ||
		check([0x0, 0x0, 0x1, 0xB3])
	) {
		return {
			ext: 'mpg',
			mime: 'video/mpeg'
		};
	}

	if (check([0x0, 0x0, 0x0, 0x1C, 0x66, 0x74, 0x79, 0x70, 0x33, 0x67, 0x70, 0x34])) {
		return {
			ext: '3gp',
			mime: 'video/3gpp'
		};
	}

	// Check for MP3 header at different starting offsets
	for (let start = 0; start < 2 && start < (buf.length - 16); start++) {
		if (
			check([0x49, 0x44, 0x33], {offset: start}) || // ID3 header
			check([0xFF, 0xE2], {offset: start, mask: [0xFF, 0xE2]}) // MPEG 1 or 2 Layer 3 header
		) {
			return {
				ext: 'mp3',
				mime: 'audio/mpeg'
			};
		}
	}

	if (
		check([0x66, 0x74, 0x79, 0x70, 0x4D, 0x34, 0x41], {offset: 4}) ||
		check([0x4D, 0x34, 0x41, 0x20])
	) {
		return {
			ext: 'm4a',
			mime: 'audio/m4a'
		};
	}

	// Needs to be before `ogg` check
	if (check([0x4F, 0x70, 0x75, 0x73, 0x48, 0x65, 0x61, 0x64], {offset: 28})) {
		return {
			ext: 'opus',
			mime: 'audio/opus'
		};
	}

	// If 'OggS' in first  bytes, then OGG container
	if (check([0x4F, 0x67, 0x67, 0x53])) {
		// This is a OGG container

		// If ' theora' in header.
		if (check([0x80, 0x74, 0x68, 0x65, 0x6F, 0x72, 0x61], {offset: 28})) {
			return {
				ext: 'ogv',
				mime: 'video/ogg'
			};
		}
		// If '\x01video' in header.
		if (check([0x01, 0x76, 0x69, 0x64, 0x65, 0x6F, 0x00], {offset: 28})) {
			return {
				ext: 'ogm',
				mime: 'video/ogg'
			};
		}
		// If ' FLAC' in header  https://xiph.org/flac/faq.html
		if (check([0x7F, 0x46, 0x4C, 0x41, 0x43], {offset: 28})) {
			return {
				ext: 'oga',
				mime: 'audio/ogg'
			};
		}

		// 'Speex  ' in header https://en.wikipedia.org/wiki/Speex
		if (check([0x53, 0x70, 0x65, 0x65, 0x78, 0x20, 0x20], {offset: 28})) {
			return {
				ext: 'spx',
				mime: 'audio/ogg'
			};
		}

		// If '\x01vorbis' in header
		if (check([0x01, 0x76, 0x6F, 0x72, 0x62, 0x69, 0x73], {offset: 28})) {
			return {
				ext: 'ogg',
				mime: 'audio/ogg'
			};
		}

		// Default OGG container https://www.iana.org/assignments/media-types/application/ogg
		return {
			ext: 'ogx',
			mime: 'application/ogg'
		};
	}

	if (check([0x66, 0x4C, 0x61, 0x43])) {
		return {
			ext: 'flac',
			mime: 'audio/x-flac'
		};
	}

	if (
		check([0x52, 0x49, 0x46, 0x46]) &&
		check([0x57, 0x41, 0x56, 0x45], {offset: 8})
	) {
		return {
			ext: 'wav',
			mime: 'audio/x-wav'
		};
	}

	if (check([0x23, 0x21, 0x41, 0x4D, 0x52, 0x0A])) {
		return {
			ext: 'amr',
			mime: 'audio/amr'
		};
	}

	if (check([0x25, 0x50, 0x44, 0x46])) {
		return {
			ext: 'pdf',
			mime: 'application/pdf'
		};
	}

	if (check([0x4D, 0x5A])) {
		return {
			ext: 'exe',
			mime: 'application/x-msdownload'
		};
	}

	if (
		(buf[0] === 0x43 || buf[0] === 0x46) &&
		check([0x57, 0x53], {offset: 1})
	) {
		return {
			ext: 'swf',
			mime: 'application/x-shockwave-flash'
		};
	}

	if (check([0x7B, 0x5C, 0x72, 0x74, 0x66])) {
		return {
			ext: 'rtf',
			mime: 'application/rtf'
		};
	}

	if (check([0x00, 0x61, 0x73, 0x6D])) {
		return {
			ext: 'wasm',
			mime: 'application/wasm'
		};
	}

	if (
		check([0x77, 0x4F, 0x46, 0x46]) &&
		(
			check([0x00, 0x01, 0x00, 0x00], {offset: 4}) ||
			check([0x4F, 0x54, 0x54, 0x4F], {offset: 4})
		)
	) {
		return {
			ext: 'woff',
			mime: 'font/woff'
		};
	}

	if (
		check([0x77, 0x4F, 0x46, 0x32]) &&
		(
			check([0x00, 0x01, 0x00, 0x00], {offset: 4}) ||
			check([0x4F, 0x54, 0x54, 0x4F], {offset: 4})
		)
	) {
		return {
			ext: 'woff2',
			mime: 'font/woff2'
		};
	}

	if (
		check([0x4C, 0x50], {offset: 34}) &&
		(
			check([0x00, 0x00, 0x01], {offset: 8}) ||
			check([0x01, 0x00, 0x02], {offset: 8}) ||
			check([0x02, 0x00, 0x02], {offset: 8})
		)
	) {
		return {
			ext: 'eot',
			mime: 'application/octet-stream'
		};
	}

	if (check([0x00, 0x01, 0x00, 0x00, 0x00])) {
		return {
			ext: 'ttf',
			mime: 'font/ttf'
		};
	}

	if (check([0x4F, 0x54, 0x54, 0x4F, 0x00])) {
		return {
			ext: 'otf',
			mime: 'font/otf'
		};
	}

	if (check([0x00, 0x00, 0x01, 0x00])) {
		return {
			ext: 'ico',
			mime: 'image/x-icon'
		};
	}

	if (check([0x46, 0x4C, 0x56, 0x01])) {
		return {
			ext: 'flv',
			mime: 'video/x-flv'
		};
	}

	if (check([0x25, 0x21])) {
		return {
			ext: 'ps',
			mime: 'application/postscript'
		};
	}

	if (check([0xFD, 0x37, 0x7A, 0x58, 0x5A, 0x00])) {
		return {
			ext: 'xz',
			mime: 'application/x-xz'
		};
	}

	if (check([0x53, 0x51, 0x4C, 0x69])) {
		return {
			ext: 'sqlite',
			mime: 'application/x-sqlite3'
		};
	}

	if (check([0x4E, 0x45, 0x53, 0x1A])) {
		return {
			ext: 'nes',
			mime: 'application/x-nintendo-nes-rom'
		};
	}

	if (check([0x43, 0x72, 0x32, 0x34])) {
		return {
			ext: 'crx',
			mime: 'application/x-google-chrome-extension'
		};
	}

	if (
		check([0x4D, 0x53, 0x43, 0x46]) ||
		check([0x49, 0x53, 0x63, 0x28])
	) {
		return {
			ext: 'cab',
			mime: 'application/vnd.ms-cab-compressed'
		};
	}

	// Needs to be before `ar` check
	if (check([0x21, 0x3C, 0x61, 0x72, 0x63, 0x68, 0x3E, 0x0A, 0x64, 0x65, 0x62, 0x69, 0x61, 0x6E, 0x2D, 0x62, 0x69, 0x6E, 0x61, 0x72, 0x79])) {
		return {
			ext: 'deb',
			mime: 'application/x-deb'
		};
	}

	if (check([0x21, 0x3C, 0x61, 0x72, 0x63, 0x68, 0x3E])) {
		return {
			ext: 'ar',
			mime: 'application/x-unix-archive'
		};
	}

	if (check([0xED, 0xAB, 0xEE, 0xDB])) {
		return {
			ext: 'rpm',
			mime: 'application/x-rpm'
		};
	}

	if (
		check([0x1F, 0xA0]) ||
		check([0x1F, 0x9D])
	) {
		return {
			ext: 'Z',
			mime: 'application/x-compress'
		};
	}

	if (check([0x4C, 0x5A, 0x49, 0x50])) {
		return {
			ext: 'lz',
			mime: 'application/x-lzip'
		};
	}

	if (check([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1])) {
		return {
			ext: 'msi',
			mime: 'application/x-msi'
		};
	}

	if (check([0x06, 0x0E, 0x2B, 0x34, 0x02, 0x05, 0x01, 0x01, 0x0D, 0x01, 0x02, 0x01, 0x01, 0x02])) {
		return {
			ext: 'mxf',
			mime: 'application/mxf'
		};
	}

	if (check([0x47], {offset: 4}) && (check([0x47], {offset: 192}) || check([0x47], {offset: 196}))) {
		return {
			ext: 'mts',
			mime: 'video/mp2t'
		};
	}

	if (check([0x42, 0x4C, 0x45, 0x4E, 0x44, 0x45, 0x52])) {
		return {
			ext: 'blend',
			mime: 'application/x-blender'
		};
	}

	if (check([0x42, 0x50, 0x47, 0xFB])) {
		return {
			ext: 'bpg',
			mime: 'image/bpg'
		};
	}

	if (check([0x00, 0x00, 0x00, 0x0C, 0x6A, 0x50, 0x20, 0x20, 0x0D, 0x0A, 0x87, 0x0A])) {
		// JPEG-2000 family

		if (check([0x6A, 0x70, 0x32, 0x20], {offset: 20})) {
			return {
				ext: 'jp2',
				mime: 'image/jp2'
			};
		}

		if (check([0x6A, 0x70, 0x78, 0x20], {offset: 20})) {
			return {
				ext: 'jpx',
				mime: 'image/jpx'
			};
		}

		if (check([0x6A, 0x70, 0x6D, 0x20], {offset: 20})) {
			return {
				ext: 'jpm',
				mime: 'image/jpm'
			};
		}

		if (check([0x6D, 0x6A, 0x70, 0x32], {offset: 20})) {
			return {
				ext: 'mj2',
				mime: 'image/mj2'
			};
		}
	}

	if (check([0x46, 0x4F, 0x52, 0x4D, 0x00])) {
		return {
			ext: 'aif',
			mime: 'audio/aiff'
		};
	}

	if (checkString('<?xml ')) {
		return {
			ext: 'xml',
			mime: 'application/xml'
		};
	}

	if (check([0x42, 0x4F, 0x4F, 0x4B, 0x4D, 0x4F, 0x42, 0x49], {offset: 60})) {
		return {
			ext: 'mobi',
			mime: 'application/x-mobipocket-ebook'
		};
	}

	// File Type Box (https://en.wikipedia.org/wiki/ISO_base_media_file_format)
	if (check([0x66, 0x74, 0x79, 0x70], {offset: 4})) {
		if (check([0x6D, 0x69, 0x66, 0x31], {offset: 8})) {
			return {
				ext: 'heic',
				mime: 'image/heif'
			};
		}

		if (check([0x6D, 0x73, 0x66, 0x31], {offset: 8})) {
			return {
				ext: 'heic',
				mime: 'image/heif-sequence'
			};
		}

		if (check([0x68, 0x65, 0x69, 0x63], {offset: 8}) || check([0x68, 0x65, 0x69, 0x78], {offset: 8})) {
			return {
				ext: 'heic',
				mime: 'image/heic'
			};
		}

		if (check([0x68, 0x65, 0x76, 0x63], {offset: 8}) || check([0x68, 0x65, 0x76, 0x78], {offset: 8})) {
			return {
				ext: 'heic',
				mime: 'image/heic-sequence'
			};
		}
	}

	return null;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
var exports = require("./node_modules/meteor/ostrio:files/server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['ostrio:files'] = exports, {
  FilesCollection: FilesCollection
});

})();

//# sourceMappingURL=ostrio_files.js.map
