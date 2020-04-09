(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"ostrio:cookies":{"cookies.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/ostrio_cookies/cookies.js                                                                               //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                       //
                                                                                                                    //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                              //
                                                                                                                    //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                         //
                                                                                                                    //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                //
                                                                                                                    //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                             //
                                                                                                                    //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                    //
                                                                                                                    //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                   //
                                                                                                                    //
module.export({                                                                                                     // 1
  Cookies: function () {                                                                                            // 1
    return Cookies;                                                                                                 // 1
  }                                                                                                                 // 1
});                                                                                                                 // 1
var Meteor = void 0;                                                                                                // 1
module.watch(require("meteor/meteor"), {                                                                            // 1
  Meteor: function (v) {                                                                                            // 1
    Meteor = v;                                                                                                     // 1
  }                                                                                                                 // 1
}, 0);                                                                                                              // 1
var HTTP = void 0;                                                                                                  // 3
var WebApp = void 0;                                                                                                // 4
                                                                                                                    //
if (Meteor.isServer) {                                                                                              // 6
  WebApp = require('meteor/webapp').WebApp;                                                                         // 7
} else {                                                                                                            // 8
  HTTP = require('meteor/http').HTTP;                                                                               // 9
}                                                                                                                   // 10
                                                                                                                    //
var NoOp = function () {};                                                                                          // 12
                                                                                                                    //
var urlRE = /\/___cookie___\/set/;                                                                                  // 13
var helpers = {                                                                                                     // 14
  isUndefined: function (obj) {                                                                                     // 15
    return obj === void 0;                                                                                          // 16
  },                                                                                                                // 17
  isObject: function (obj) {                                                                                        // 18
    return obj === Object(obj);                                                                                     // 19
  }                                                                                                                 // 20
};                                                                                                                  // 14
var _helpers = ['String', 'Number'];                                                                                // 22
                                                                                                                    //
var _loop = function (i) {                                                                                          //
  helpers['is' + _helpers[i]] = function (obj) {                                                                    // 24
    return Object.prototype.toString.call(obj) === '[object ' + _helpers[i] + ']';                                  // 25
  };                                                                                                                // 26
};                                                                                                                  //
                                                                                                                    //
for (var i = 0; i < _helpers.length; i++) {                                                                         // 23
  _loop(i);                                                                                                         // 23
} /*                                                                                                                // 27
   * @url https://github.com/jshttp/cookie/blob/master/index.js                                                     //
   * @name cookie                                                                                                   //
   * @author jshttp                                                                                                 //
   * @license                                                                                                       //
   * (The MIT License)                                                                                              //
   *                                                                                                                //
   * Copyright (c) 2012-2014 Roman Shtylman <shtylman@gmail.com>                                                    //
   * Copyright (c) 2015 Douglas Christopher Wilson <doug@somethingdoug.com>                                         //
   *                                                                                                                //
   * Permission is hereby granted, free of charge, to any person obtaining                                          //
   * a copy of this software and associated documentation files (the                                                //
   * 'Software'), to deal in the Software without restriction, including                                            //
   * without limitation the rights to use, copy, modify, merge, publish,                                            //
   * distribute, sublicense, and/or sell copies of the Software, and to                                             //
   * permit persons to whom the Software is furnished to do so, subject to                                          //
   * the following conditions:                                                                                      //
   *                                                                                                                //
   * The above copyright notice and this permission notice shall be                                                 //
   * included in all copies or substantial portions of the Software.                                                //
   *                                                                                                                //
   * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,                                                //
   * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF                                             //
   * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.                                         //
   * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY                                           //
   * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,                                           //
   * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE                                              //
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.                                                         //
   */                                                                                                               //
                                                                                                                    //
var decode = decodeURIComponent;                                                                                    // 58
var encode = encodeURIComponent;                                                                                    // 59
var pairSplitRegExp = /; */; /*                                                                                     // 60
                              * RegExp to match field-content in RFC 7230 sec 3.2                                   //
                              *                                                                                     //
                              * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]                         //
                              * field-vchar   = VCHAR / obs-text                                                    //
                              * obs-text      = %x80-FF                                                             //
                              */                                                                                    //
var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/; /*                                                // 69
                                                                   * @function                                      //
                                                                   * @name tryDecode                                //
                                                                   * @param {String} str                            //
                                                                   * @param {Function} d                            //
                                                                   * @summary Try decoding a string using a decoding function.
                                                                   * @private                                       //
                                                                   */                                               //
                                                                                                                    //
var tryDecode = function (str, d) {                                                                                 // 79
  try {                                                                                                             // 80
    return d(str);                                                                                                  // 81
  } catch (e) {                                                                                                     // 82
    return str;                                                                                                     // 83
  }                                                                                                                 // 84
}; /*                                                                                                               // 85
    * @function                                                                                                     //
    * @name parse                                                                                                   //
    * @param {String} str                                                                                           //
    * @param {Object} [options]                                                                                     //
    * @return {Object}                                                                                              //
    * @summary                                                                                                      //
    * Parse a cookie header.                                                                                        //
    * Parse the given cookie header string into an object                                                           //
    * The object has the various cookies as keys(names) => values                                                   //
    * @private                                                                                                      //
    */                                                                                                              //
                                                                                                                    //
var parse = function (str, options) {                                                                               // 99
  if (typeof str !== 'string') {                                                                                    // 100
    throw new Meteor.Error(404, 'argument str must be a string');                                                   // 101
  }                                                                                                                 // 102
                                                                                                                    //
  var obj = {};                                                                                                     // 103
  var opt = options || {};                                                                                          // 104
  var val = void 0;                                                                                                 // 105
  var key = void 0;                                                                                                 // 106
  var eqIndx = void 0;                                                                                              // 107
  str.split(pairSplitRegExp).forEach(function (pair) {                                                              // 109
    eqIndx = pair.indexOf('=');                                                                                     // 110
                                                                                                                    //
    if (eqIndx < 0) {                                                                                               // 111
      return;                                                                                                       // 112
    }                                                                                                               // 113
                                                                                                                    //
    key = pair.substr(0, eqIndx).trim();                                                                            // 114
    val = pair.substr(++eqIndx, pair.length).trim();                                                                // 115
                                                                                                                    //
    if (val[0] === '"') {                                                                                           // 116
      val = val.slice(1, -1);                                                                                       // 117
    }                                                                                                               // 118
                                                                                                                    //
    if (void 0 === obj[key]) {                                                                                      // 119
      obj[key] = tryDecode(val, opt.decode || decode);                                                              // 120
    }                                                                                                               // 121
  });                                                                                                               // 122
  return obj;                                                                                                       // 123
}; /*                                                                                                               // 124
    * @function                                                                                                     //
    * @name serialize                                                                                               //
    * @param {String} name                                                                                          //
    * @param {String} val                                                                                           //
    * @param {Object} [options]                                                                                     //
    * @return {String}                                                                                              //
    * @summary                                                                                                      //
    * Serialize data into a cookie header.                                                                          //
    * Serialize the a name value pair into a cookie string suitable for                                             //
    * http headers. An optional options object specified cookie parameters.                                         //
    * serialize('foo', 'bar', { httpOnly: true }) => "foo=bar; httpOnly"                                            //
    * @private                                                                                                      //
    */                                                                                                              //
                                                                                                                    //
var serialize = function (key, val) {                                                                               // 140
  var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};                                 // 140
  var name = void 0;                                                                                                // 141
                                                                                                                    //
  if (!fieldContentRegExp.test(key)) {                                                                              // 143
    name = escape(key);                                                                                             // 144
  } else {                                                                                                          // 145
    name = key;                                                                                                     // 146
  }                                                                                                                 // 147
                                                                                                                    //
  var value = void 0;                                                                                               // 149
                                                                                                                    //
  if (!helpers.isUndefined(val)) {                                                                                  // 150
    value = encode(val);                                                                                            // 151
                                                                                                                    //
    if (value && !fieldContentRegExp.test(value)) {                                                                 // 152
      value = escape(value);                                                                                        // 153
    }                                                                                                               // 154
  } else {                                                                                                          // 155
    value = '';                                                                                                     // 156
  }                                                                                                                 // 157
                                                                                                                    //
  var pairs = [name + "=" + value];                                                                                 // 159
                                                                                                                    //
  if (helpers.isNumber(opt.maxAge)) {                                                                               // 161
    pairs.push("Max-Age=" + opt.maxAge);                                                                            // 162
  }                                                                                                                 // 163
                                                                                                                    //
  if (opt.domain && helpers.isString(opt.domain)) {                                                                 // 165
    if (!fieldContentRegExp.test(opt.domain)) {                                                                     // 166
      throw new Meteor.Error(404, 'option domain is invalid');                                                      // 167
    }                                                                                                               // 168
                                                                                                                    //
    pairs.push("Domain=" + opt.domain);                                                                             // 169
  }                                                                                                                 // 170
                                                                                                                    //
  if (opt.path && helpers.isString(opt.path)) {                                                                     // 172
    if (!fieldContentRegExp.test(opt.path)) {                                                                       // 173
      throw new Meteor.Error(404, 'option path is invalid');                                                        // 174
    }                                                                                                               // 175
                                                                                                                    //
    pairs.push("Path=" + opt.path);                                                                                 // 176
  }                                                                                                                 // 177
                                                                                                                    //
  opt.expires = opt.expires || opt.expire || false;                                                                 // 179
                                                                                                                    //
  if (opt.expires === Infinity) {                                                                                   // 180
    pairs.push('Expires=Fri, 31 Dec 9999 23:59:59 GMT');                                                            // 181
  } else if (opt.expires instanceof Date) {                                                                         // 182
    pairs.push("Expires=" + opt.expires.toUTCString());                                                             // 183
  } else if (opt.expires === 0) {                                                                                   // 184
    pairs.push('Expires=0');                                                                                        // 185
  } else if (helpers.isNumber(opt.expires)) {                                                                       // 186
    pairs.push("Expires=" + new Date(opt.expires).toUTCString());                                                   // 187
  }                                                                                                                 // 188
                                                                                                                    //
  if (opt.httpOnly) {                                                                                               // 190
    pairs.push('HttpOnly');                                                                                         // 191
  }                                                                                                                 // 192
                                                                                                                    //
  if (opt.secure) {                                                                                                 // 194
    pairs.push('Secure');                                                                                           // 195
  }                                                                                                                 // 196
                                                                                                                    //
  if (opt.firstPartyOnly) {                                                                                         // 198
    pairs.push('First-Party-Only');                                                                                 // 199
  }                                                                                                                 // 200
                                                                                                                    //
  if (opt.sameSite) {                                                                                               // 202
    pairs.push('SameSite');                                                                                         // 203
  }                                                                                                                 // 204
                                                                                                                    //
  return pairs.join('; ');                                                                                          // 206
}; /*                                                                                                               // 207
    * @locus Anywhere                                                                                               //
    * @class __cookies                                                                                              //
    * @param _cookies {Object|String} - Current cookies as String or Object                                         //
    * @param TTL {Number} - Default cookies expiration time (max-age) in milliseconds, by default - session (false)
    * @param runOnServer {Boolean} - Expose Cookies class to Server                                                 //
    * @param response {http.ServerResponse|Object} - This object is created internally by a HTTP server             //
    * @summary Internal Class                                                                                       //
    */                                                                                                              //
                                                                                                                    //
var __cookies = function () {                                                                                       //
  function __cookies(_cookies, TTL, runOnServer, response) {                                                        // 219
    (0, _classCallCheck3.default)(this, __cookies);                                                                 // 219
    this.TTL = TTL;                                                                                                 // 220
    this.response = response;                                                                                       // 221
    this.runOnServer = runOnServer;                                                                                 // 222
                                                                                                                    //
    if (helpers.isObject(_cookies)) {                                                                               // 224
      this.cookies = _cookies;                                                                                      // 225
    } else {                                                                                                        // 226
      this.cookies = parse(_cookies);                                                                               // 227
    }                                                                                                               // 228
  } /*                                                                                                              // 229
     * @locus Anywhere                                                                                              //
     * @memberOf __cookies                                                                                          //
     * @name get                                                                                                    //
     * @param {String} key  - The name of the cookie to read                                                        //
     * @param {String} _tmp - Unparsed string instead of user's cookies                                             //
     * @summary Read a cookie. If the cookie doesn't exist a null value will be returned.                           //
     * @returns {String|void}                                                                                       //
     */                                                                                                             //
                                                                                                                    //
  __cookies.prototype.get = function () {                                                                           //
    function get(key, _tmp) {                                                                                       //
      var _cs = _tmp ? parse(_tmp) : this.cookies;                                                                  // 241
                                                                                                                    //
      if (!key || !_cs) {                                                                                           // 242
        return void 0;                                                                                              // 243
      }                                                                                                             // 244
                                                                                                                    //
      if (_cs.hasOwnProperty(key)) {                                                                                // 246
        return _cs[key];                                                                                            // 247
      }                                                                                                             // 248
                                                                                                                    //
      return void 0;                                                                                                // 250
    }                                                                                                               // 251
                                                                                                                    //
    return get;                                                                                                     //
  }(); /*                                                                                                           //
        * @locus Anywhere                                                                                           //
        * @memberOf __cookies                                                                                       //
        * @name set                                                                                                 //
        * @param {String}  key   - The name of the cookie to create/overwrite                                       //
        * @param {String}  value - The value of the cookie                                                          //
        * @param {Object}  opts  - [Optional] Cookie options (see readme docs)                                      //
        * @summary Create/overwrite a cookie.                                                                       //
        * @returns {Boolean}                                                                                        //
        */                                                                                                          //
                                                                                                                    //
  __cookies.prototype.set = function () {                                                                           //
    function set(key, value) {                                                                                      //
      var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};                            // 263
                                                                                                                    //
      if (key && !helpers.isUndefined(value)) {                                                                     // 264
        if (helpers.isNumber(this.TTL) && opts.expires === undefined) {                                             // 265
          opts.expires = new Date(+new Date() + this.TTL);                                                          // 266
        }                                                                                                           // 267
                                                                                                                    //
        var newCookie = serialize(key, value, opts);                                                                // 268
        this.cookies[key] = value;                                                                                  // 269
                                                                                                                    //
        if (Meteor.isClient) {                                                                                      // 270
          document.cookie = newCookie;                                                                              // 271
        } else {                                                                                                    // 272
          this.response.setHeader('Set-Cookie', newCookie);                                                         // 273
        }                                                                                                           // 274
                                                                                                                    //
        return true;                                                                                                // 275
      }                                                                                                             // 276
                                                                                                                    //
      return false;                                                                                                 // 277
    }                                                                                                               // 278
                                                                                                                    //
    return set;                                                                                                     //
  }(); /*                                                                                                           //
        * @locus Anywhere                                                                                           //
        * @memberOf __cookies                                                                                       //
        * @name remove                                                                                              //
        * @param {String} key    - The name of the cookie to create/overwrite                                       //
        * @param {String} path   - [Optional] The path from where the cookie will be                                //
        * readable. E.g., "/", "/mydir"; if not specified, defaults to the current                                  //
        * path of the current document location (string or null). The path must be                                  //
        * absolute (see RFC 2965). For more information on how to use relative paths                                //
        * in this argument, see: https://developer.mozilla.org/en-US/docs/Web/API/document.cookie#Using_relative_URLs_in_the_path_parameter
        * @param {String} domain - [Optional] The domain from where the cookie will                                 //
        * be readable. E.g., "example.com", ".example.com" (includes all subdomains)                                //
        * or "subdomain.example.com"; if not specified, defaults to the host portion                                //
        * of the current document location (string or null).                                                        //
        * @summary Remove a cookie(s).                                                                              //
        * @returns {Boolean}                                                                                        //
        */                                                                                                          //
                                                                                                                    //
  __cookies.prototype.remove = function () {                                                                        //
    function remove(key) {                                                                                          //
      var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/';                           // 297
      var domain = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';                          // 297
                                                                                                                    //
      if (key && this.cookies.hasOwnProperty(key)) {                                                                // 298
        var newCookie = serialize(key, '', {                                                                        // 299
          domain: domain,                                                                                           // 300
          path: path,                                                                                               // 301
          expires: new Date(0)                                                                                      // 302
        });                                                                                                         // 299
        delete this.cookies[key];                                                                                   // 305
                                                                                                                    //
        if (Meteor.isClient) {                                                                                      // 306
          document.cookie = newCookie;                                                                              // 307
        } else {                                                                                                    // 308
          this.response.setHeader('Set-Cookie', newCookie);                                                         // 309
        }                                                                                                           // 310
                                                                                                                    //
        return true;                                                                                                // 311
      } else if (!key && this.keys().length > 0 && this.keys()[0] !== '') {                                         // 312
        var keys = Object.keys(this.cookies);                                                                       // 313
                                                                                                                    //
        for (var i = 0; i < keys.length; i++) {                                                                     // 314
          this.remove(keys[i]);                                                                                     // 315
        }                                                                                                           // 316
                                                                                                                    //
        return true;                                                                                                // 317
      }                                                                                                             // 318
                                                                                                                    //
      return false;                                                                                                 // 319
    }                                                                                                               // 320
                                                                                                                    //
    return remove;                                                                                                  //
  }(); /*                                                                                                           //
        * @locus Anywhere                                                                                           //
        * @memberOf __cookies                                                                                       //
        * @name has                                                                                                 //
        * @param {String} key  - The name of the cookie to create/overwrite                                         //
        * @param {String} _tmp - Unparsed string instead of user's cookies                                          //
        * @summary Check whether a cookie exists in the current position.                                           //
        * @returns {Boolean}                                                                                        //
        */                                                                                                          //
                                                                                                                    //
  __cookies.prototype.has = function () {                                                                           //
    function has(key, _tmp) {                                                                                       //
      var _cs = _tmp ? parse(_tmp) : this.cookies;                                                                  // 332
                                                                                                                    //
      if (!key || !_cs) {                                                                                           // 333
        return false;                                                                                               // 334
      }                                                                                                             // 335
                                                                                                                    //
      return _cs.hasOwnProperty(key);                                                                               // 337
    }                                                                                                               // 338
                                                                                                                    //
    return has;                                                                                                     //
  }(); /*                                                                                                           //
        * @locus Anywhere                                                                                           //
        * @memberOf __cookies                                                                                       //
        * @name keys                                                                                                //
        * @summary Returns an array of all readable cookies from this location.                                     //
        * @returns {[String]}                                                                                       //
        */                                                                                                          //
                                                                                                                    //
  __cookies.prototype.keys = function () {                                                                          //
    function keys() {                                                                                               //
      if (this.cookies) {                                                                                           // 348
        return Object.keys(this.cookies);                                                                           // 349
      }                                                                                                             // 350
                                                                                                                    //
      return [];                                                                                                    // 351
    }                                                                                                               // 352
                                                                                                                    //
    return keys;                                                                                                    //
  }(); /*                                                                                                           //
        * @locus Client                                                                                             //
        * @memberOf __cookies                                                                                       //
        * @name send                                                                                                //
        * @param cb {Function} - Callback                                                                           //
        * @summary Send all cookies over XHR to server.                                                             //
        * @returns {void}                                                                                           //
        */                                                                                                          //
                                                                                                                    //
  __cookies.prototype.send = function () {                                                                          //
    function send() {                                                                                               //
      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : NoOp;                            // 362
                                                                                                                    //
      if (Meteor.isServer) {                                                                                        // 363
        cb(new Meteor.Error(400, 'Can\'t run `.send()` on server, it\'s Client only method!'));                     // 364
      }                                                                                                             // 365
                                                                                                                    //
      if (this.runOnServer) {                                                                                       // 367
        HTTP.get((window.__meteor_runtime_config__.ROOT_URL_PATH_PREFIX || '') + "/___cookie___/set", cb);          // 368
      } else {                                                                                                      // 369
        cb(new Meteor.Error(400, 'Can\'t send cookies on server when `runOnServer` is false.'));                    // 370
      }                                                                                                             // 371
                                                                                                                    //
      return void 0;                                                                                                // 372
    }                                                                                                               // 373
                                                                                                                    //
    return send;                                                                                                    //
  }();                                                                                                              //
                                                                                                                    //
  return __cookies;                                                                                                 //
}(); /*                                                                                                             //
      * @function                                                                                                   //
      * @locus Server                                                                                               //
      * @summary Middleware handler                                                                                 //
      * @private                                                                                                    //
      */                                                                                                            //
                                                                                                                    //
var __middlewareHandler = function (req, res, self) {                                                               // 382
  var _cookies = {};                                                                                                // 383
                                                                                                                    //
  if (self.runOnServer) {                                                                                           // 384
    if (req.headers && req.headers.cookie) {                                                                        // 385
      _cookies = parse(req.headers.cookie);                                                                         // 386
    }                                                                                                               // 387
                                                                                                                    //
    return new __cookies(_cookies, self.TTL, self.runOnServer, res);                                                // 388
  }                                                                                                                 // 389
                                                                                                                    //
  throw new Meteor.Error(400, 'Can\'t use middleware when `runOnServer` is false.');                                // 391
}; /*                                                                                                               // 392
    * @locus Anywhere                                                                                               //
    * @class Cookies                                                                                                //
    * @param opts {Object}                                                                                          //
    * @param opts.TTL {Number} - Default cookies expiration time (max-age) in milliseconds, by default - session (false)
    * @param opts.auto {Boolean} - [Server] Auto-bind in middleware as `req.Cookies`, by default `true`             //
    * @param opts.handler {Function} - [Server] Middleware handler                                                  //
    * @param opts.runOnServer {Boolean} - Expose Cookies class to Server                                            //
    * @summary Main Cookie class                                                                                    //
    */                                                                                                              //
                                                                                                                    //
var Cookies = function (_cookies2) {                                                                                //
  (0, _inherits3.default)(Cookies, _cookies2);                                                                      //
                                                                                                                    //
  function Cookies() {                                                                                              // 406
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};                              // 406
    (0, _classCallCheck3.default)(this, Cookies);                                                                   // 406
    opts.TTL = helpers.isNumber(opts.TTL) ? opts.TTL : false;                                                       // 407
    opts.runOnServer = opts.runOnServer !== false ? true : false;                                                   // 408
                                                                                                                    //
    if (Meteor.isClient) {                                                                                          // 410
      var _this = (0, _possibleConstructorReturn3.default)(this, _cookies2.call(this, document.cookie, opts.TTL, opts.runOnServer));
    } else {                                                                                                        // 412
      var _this = (0, _possibleConstructorReturn3.default)(this, _cookies2.call(this, {}, opts.TTL, opts.runOnServer));
                                                                                                                    //
      opts.auto = opts.auto !== false ? true : false;                                                               // 414
                                                                                                                    //
      _this.handler = opts.handler || function () {};                                                               // 415
                                                                                                                    //
      _this.runOnServer = opts.runOnServer;                                                                         // 416
                                                                                                                    //
      if (_this.runOnServer) {                                                                                      // 418
        if (!Cookies.isLoadedOnServer) {                                                                            // 419
          if (opts.auto) {                                                                                          // 420
            WebApp.connectHandlers.use(function (req, res, next) {                                                  // 421
              if (urlRE.test(req._parsedUrl.path)) {                                                                // 422
                if (req.headers && req.headers.cookie) {                                                            // 423
                  var _cObj = parse(req.headers.cookie);                                                            // 424
                                                                                                                    //
                  var _cKeys = Object.keys(_cObj);                                                                  // 425
                                                                                                                    //
                  var _cArr = [];                                                                                   // 426
                                                                                                                    //
                  var _cStr = void 0;                                                                               // 427
                                                                                                                    //
                  for (var i = 0; i < _cKeys.length; i++) {                                                         // 429
                    _cStr = serialize(_cKeys[i], _cObj[_cKeys[i]]);                                                 // 430
                                                                                                                    //
                    if (!~_cArr.indexOf(_cStr)) {                                                                   // 431
                      _cArr.push(_cStr);                                                                            // 432
                    }                                                                                               // 433
                  }                                                                                                 // 434
                                                                                                                    //
                  res.setHeader('Set-Cookie', _cArr);                                                               // 436
                }                                                                                                   // 437
                                                                                                                    //
                res.writeHead(200);                                                                                 // 439
                res.end('');                                                                                        // 440
              } else {                                                                                              // 441
                req.Cookies = __middlewareHandler(req, res, _this);                                                 // 442
                next();                                                                                             // 443
              }                                                                                                     // 444
            });                                                                                                     // 445
          }                                                                                                         // 446
                                                                                                                    //
          Cookies.isLoadedOnServer = true;                                                                          // 447
        }                                                                                                           // 448
      }                                                                                                             // 449
    }                                                                                                               // 450
                                                                                                                    //
    return (0, _possibleConstructorReturn3.default)(_this);                                                         // 406
  } /*                                                                                                              // 451
     * @locus Server                                                                                                //
     * @memberOf Cookies                                                                                            //
     * @name middleware                                                                                             //
     * @summary Get Cookies instance into callback                                                                  //
     * @returns {void}                                                                                              //
     */                                                                                                             //
                                                                                                                    //
  Cookies.prototype.middleware = function () {                                                                      //
    function middleware() {                                                                                         //
      var _this2 = this;                                                                                            // 461
                                                                                                                    //
      if (!Meteor.isServer) {                                                                                       // 462
        throw new Meteor.Error(500, '[ostrio:cookies] Can\'t use `.middleware()` on Client, it\'s Server only!');   // 463
      }                                                                                                             // 464
                                                                                                                    //
      return function (req, res, next) {                                                                            // 466
        _this2.handler && _this2.handler(__middlewareHandler(req, res, _this2));                                    // 467
        next();                                                                                                     // 468
      };                                                                                                            // 469
    }                                                                                                               // 470
                                                                                                                    //
    return middleware;                                                                                              //
  }();                                                                                                              //
                                                                                                                    //
  return Cookies;                                                                                                   //
}(__cookies);                                                                                                       //
                                                                                                                    //
if (Meteor.isServer) {                                                                                              // 473
  Cookies.isLoadedOnServer = false;                                                                                 // 474
} /* Export the Cookies class */                                                                                    // 475
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
var exports = require("./node_modules/meteor/ostrio:cookies/cookies.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['ostrio:cookies'] = exports;

})();

//# sourceMappingURL=ostrio_cookies.js.map
