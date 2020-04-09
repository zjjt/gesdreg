(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var Accounts = Package['accounts-base'].Accounts;
var colors = Package['nooitaf:colors'].colors;
var check = Package.check.check;
var Match = Package.check.Match;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"orionsoft:apollo":{"apollo.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/orionsoft_apollo/apollo.js                                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _extends2 = require("babel-runtime/helpers/extends");                                                             //
                                                                                                                      //
var _extends3 = _interopRequireDefault(_extends2);                                                                    //
                                                                                                                      //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                     //
                                                                                                                      //
module.export({                                                                                                       // 1
  formatError: function () {                                                                                          // 1
    return formatError;                                                                                               // 1
  },                                                                                                                  // 1
  createApolloServer: function () {                                                                                   // 1
    return createApolloServer;                                                                                        // 1
  }                                                                                                                   // 1
});                                                                                                                   // 1
var graphqlExpress = void 0,                                                                                          // 1
    graphiqlExpress = void 0;                                                                                         // 1
module.watch(require("graphql-server-express"), {                                                                     // 1
  graphqlExpress: function (v) {                                                                                      // 1
    graphqlExpress = v;                                                                                               // 1
  },                                                                                                                  // 1
  graphiqlExpress: function (v) {                                                                                     // 1
    graphiqlExpress = v;                                                                                              // 1
  }                                                                                                                   // 1
}, 0);                                                                                                                // 1
var bodyParser = void 0;                                                                                              // 1
module.watch(require("body-parser"), {                                                                                // 1
  "default": function (v) {                                                                                           // 1
    bodyParser = v;                                                                                                   // 1
  }                                                                                                                   // 1
}, 1);                                                                                                                // 1
var express = void 0;                                                                                                 // 1
module.watch(require("express"), {                                                                                    // 1
  "default": function (v) {                                                                                           // 1
    express = v;                                                                                                      // 1
  }                                                                                                                   // 1
}, 2);                                                                                                                // 1
var Meteor = void 0;                                                                                                  // 1
module.watch(require("meteor/meteor"), {                                                                              // 1
  Meteor: function (v) {                                                                                              // 1
    Meteor = v;                                                                                                       // 1
  }                                                                                                                   // 1
}, 3);                                                                                                                // 1
var WebApp = void 0;                                                                                                  // 1
module.watch(require("meteor/webapp"), {                                                                              // 1
  WebApp: function (v) {                                                                                              // 1
    WebApp = v;                                                                                                       // 1
  }                                                                                                                   // 1
}, 4);                                                                                                                // 1
                                                                                                                      //
var _ = void 0;                                                                                                       // 1
                                                                                                                      //
module.watch(require("meteor/underscore"), {                                                                          // 1
  _: function (v) {                                                                                                   // 1
    _ = v;                                                                                                            // 1
  }                                                                                                                   // 1
}, 5);                                                                                                                // 1
var log = void 0;                                                                                                     // 1
module.watch(require("./log"), {                                                                                      // 1
  "default": function (v) {                                                                                           // 1
    log = v;                                                                                                          // 1
  }                                                                                                                   // 1
}, 6);                                                                                                                // 1
var defaultGetContext = void 0;                                                                                       // 1
module.watch(require("./getContext"), {                                                                               // 1
  "default": function (v) {                                                                                           // 1
    defaultGetContext = v;                                                                                            // 1
  }                                                                                                                   // 1
}, 7);                                                                                                                // 1
module.watch(require("./overrideDDP"));                                                                               // 1
var formatError = void 0;                                                                                             // 1
module.watch(require("./formatError"), {                                                                              // 1
  "default": function (v) {                                                                                           // 1
    formatError = v;                                                                                                  // 1
  }                                                                                                                   // 1
}, 8);                                                                                                                // 1
                                                                                                                      //
var Fiber = Npm.require('fibers');                                                                                    // 12
                                                                                                                      //
var defaultOptions = {                                                                                                // 16
  debug: false,                                                                                                       // 17
  formatError: formatError                                                                                            // 18
};                                                                                                                    // 16
var defaultConfig = {                                                                                                 // 21
  path: '/graphql',                                                                                                   // 22
  maxAccountsCacheSizeInMB: 1,                                                                                        // 23
  graphiql: true,                                                                                                     // 24
  graphiqlPath: '/graphiql',                                                                                          // 25
  logCalls: true,                                                                                                     // 26
  graphiqlOptions: {                                                                                                  // 27
    passHeader: "'Authorization': localStorage['Meteor.loginToken']"                                                  // 28
  },                                                                                                                  // 27
  configServer: function (graphQLServer) {},                                                                          // 30
  getContext: defaultGetContext                                                                                       // 31
};                                                                                                                    // 21
                                                                                                                      //
var createApolloServer = function (givenOptions, givenConfig) {                                                       // 34
  var graphiqlOptions = (0, _extends3.default)({}, defaultConfig.graphiqlOptions, givenConfig.graphiqlOptions);       // 35
  var config = (0, _extends3.default)({}, defaultConfig, givenConfig);                                                // 36
  config.graphiqlOptions = graphiqlOptions;                                                                           // 37
  var graphQLServer = express();                                                                                      // 39
  config.configServer(graphQLServer);                                                                                 // 41
  var expressServer = graphqlExpress(function (req) {                                                                 // 43
    var options = _.isFunction(givenOptions) ? givenOptions(req) : givenOptions; // Merge in the defaults             // 44
                                                                                                                      //
    options = (0, _extends3.default)({}, defaultOptions, options);                                                    // 47
    options.context = (0, _extends3.default)({                                                                        // 48
      ip: req.connection.remoteAddress                                                                                // 49
    }, config.getContext(req));                                                                                       // 48
    Fiber.current.graphQLContext = options.context;                                                                   // 52
                                                                                                                      //
    if (config.logCalls) {                                                                                            // 54
      log({                                                                                                           // 55
        req: req,                                                                                                     // 55
        context: options.context                                                                                      // 55
      });                                                                                                             // 55
    }                                                                                                                 // 56
                                                                                                                      //
    return options;                                                                                                   // 58
  }); // GraphQL endpoint                                                                                             // 59
                                                                                                                      //
  graphQLServer.use(config.path, bodyParser.json(), Meteor.bindEnvironment(expressServer)); // Start GraphiQL if enabled
                                                                                                                      //
  if (config.graphiql) {                                                                                              // 65
    var graphiql = graphiqlExpress((0, _extends3.default)({}, config.graphiqlOptions, {                               // 66
      endpointURL: config.path                                                                                        // 66
    }));                                                                                                              // 66
    graphQLServer.use(config.graphiqlPath, graphiql);                                                                 // 67
  } // This binds the specified paths to the Express server running Apollo + GraphiQL                                 // 68
                                                                                                                      //
                                                                                                                      //
  WebApp.connectHandlers.use(Meteor.bindEnvironment(graphQLServer));                                                  // 71
};                                                                                                                    // 72
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"formatError.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/orionsoft_apollo/formatError.js                                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exportDefault(function (error) {                                                                               // 1
  if (!error.path) {                                                                                                  // 2
    console.warn("GraphQL Error: " + error.message);                                                                  // 3
    return {                                                                                                          // 4
      message: error.message,                                                                                         // 5
      reason: error.reason,                                                                                           // 6
      path: error.path                                                                                                // 7
    };                                                                                                                // 4
  }                                                                                                                   // 9
                                                                                                                      //
  console.warn("GraphQL error on \"" + error.path.reverse().join('.') + "\"");                                        // 10
  console.warn(error.stack.split('\n').slice(0, 4).join('\n'));                                                       // 11
  var details = {};                                                                                                   // 17
                                                                                                                      //
  try {                                                                                                               // 18
    if (error.originalError && error.originalError.invalidKeys || error.originalError.error === 'validation-error') {
      details.invalidKeys = {};                                                                                       // 23
      var keys = error.originalError.invalidKeys || error.originalError.details;                                      // 24
      keys.forEach(function (key) {                                                                                   // 25
        var context = error.originalError.validationContext;                                                          // 26
        var message = key.message;                                                                                    // 27
                                                                                                                      //
        if (context) {                                                                                                // 28
          message = context.keyErrorMessage(key.name);                                                                // 29
        }                                                                                                             // 30
                                                                                                                      //
        details.invalidKeys[key.name] = message;                                                                      // 31
      });                                                                                                             // 32
    }                                                                                                                 // 33
  } catch (error) {                                                                                                   // 34
    console.log('Error in formatError:');                                                                             // 35
    console.log(error);                                                                                               // 36
    console.log(error.stack);                                                                                         // 37
  }                                                                                                                   // 38
                                                                                                                      //
  return {                                                                                                            // 39
    message: error.message,                                                                                           // 40
    reason: error.reason,                                                                                             // 41
    path: error.path,                                                                                                 // 42
    details: details                                                                                                  // 43
  };                                                                                                                  // 39
});                                                                                                                   // 45
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getContext.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/orionsoft_apollo/getContext.js                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var check = void 0;                                                                                                   // 1
module.watch(require("meteor/check"), {                                                                               // 1
  check: function (v) {                                                                                               // 1
    check = v;                                                                                                        // 1
  }                                                                                                                   // 1
}, 0);                                                                                                                // 1
var Accounts = void 0;                                                                                                // 1
module.watch(require("meteor/accounts-base"), {                                                                       // 1
  Accounts: function (v) {                                                                                            // 1
    Accounts = v;                                                                                                     // 1
  }                                                                                                                   // 1
}, 1);                                                                                                                // 1
var Meteor = void 0;                                                                                                  // 1
module.watch(require("meteor/meteor"), {                                                                              // 1
  Meteor: function (v) {                                                                                              // 1
    Meteor = v;                                                                                                       // 1
  }                                                                                                                   // 1
}, 2);                                                                                                                // 1
module.exportDefault(function (req) {                                                                                 // 1
  // Get the token from the header                                                                                    // 6
  if (!req.headers.authorization) return {};                                                                          // 7
  var token = req.headers.authorization;                                                                              // 9
  check(token, String);                                                                                               // 10
                                                                                                                      //
  var hashedToken = Accounts._hashLoginToken(token); // Get the user from the database                                // 11
                                                                                                                      //
                                                                                                                      //
  var user = Meteor.users.findOne({                                                                                   // 14
    'services.resume.loginTokens.hashedToken': hashedToken                                                            // 14
  }, {                                                                                                                // 14
    fields: {                                                                                                         // 14
      _id: 1,                                                                                                         // 14
      'services.resume.loginTokens.$': 1                                                                              // 14
    }                                                                                                                 // 14
  });                                                                                                                 // 14
  if (!user) return {};                                                                                               // 16
                                                                                                                      //
  var expiresAt = Accounts._tokenExpiration(user.services.resume.loginTokens[0].when);                                // 17
                                                                                                                      //
  var isExpired = expiresAt < new Date();                                                                             // 18
  if (isExpired) return {};                                                                                           // 19
  return {                                                                                                            // 21
    userId: user._id,                                                                                                 // 22
    loginToken: token                                                                                                 // 23
  };                                                                                                                  // 21
});                                                                                                                   // 25
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"log.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/orionsoft_apollo/log.js                                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _ = void 0;                                                                                                       // 1
                                                                                                                      //
module.watch(require("meteor/underscore"), {                                                                          // 1
  _: function (v) {                                                                                                   // 1
    _ = v;                                                                                                            // 1
  }                                                                                                                   // 1
}, 0);                                                                                                                // 1
module.exportDefault(function (_ref) {                                                                                // 1
  var req = _ref.req,                                                                                                 // 3
      context = _ref.context;                                                                                         // 3
  var options = req.body[0];                                                                                          // 4
  if (!options) return;                                                                                               // 5
  if (!options.query) return;                                                                                         // 6
  console.info(("New GraphQL query " + options.operationName + ":").underline.bold);                                  // 7
  console.info(("Token: " + context.loginToken + "\n").grey);                                                         // 8
  console.info(options.query);                                                                                        // 9
                                                                                                                      //
  if (options.variables) {                                                                                            // 10
    try {                                                                                                             // 11
      if (_.isObject(options.variables)) {                                                                            // 12
        console.info('\n');                                                                                           // 13
        console.info('Variables:'.underline);                                                                         // 14
        console.info(options.variables);                                                                              // 15
      } else {                                                                                                        // 16
        var obj = JSON.parse(options.variables);                                                                      // 17
                                                                                                                      //
        if (!_.isEmpty(obj)) {                                                                                        // 18
          console.info('\n');                                                                                         // 19
          console.info('Variables:'.underline);                                                                       // 20
          console.info('\n');                                                                                         // 21
          console.info(obj);                                                                                          // 22
        }                                                                                                             // 23
      }                                                                                                               // 24
    } catch (e) {}                                                                                                    // 25
  }                                                                                                                   // 26
                                                                                                                      //
  console.info('\n');                                                                                                 // 27
});                                                                                                                   // 28
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"overrideDDP.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/orionsoft_apollo/overrideDDP.js                                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var DDP = void 0;                                                                                                     // 1
module.watch(require("meteor/ddp"), {                                                                                 // 1
  DDP: function (v) {                                                                                                 // 1
    DDP = v;                                                                                                          // 1
  }                                                                                                                   // 1
}, 0);                                                                                                                // 1
var Meteor = void 0;                                                                                                  // 1
module.watch(require("meteor/meteor"), {                                                                              // 1
  Meteor: function (v) {                                                                                              // 1
    Meteor = v;                                                                                                       // 1
  }                                                                                                                   // 1
}, 1);                                                                                                                // 1
                                                                                                                      //
var Fiber = Npm.require('fibers');                                                                                    // 4
                                                                                                                      //
DDP._CurrentInvocation.get = function () {                                                                            // 6
  Meteor._nodeCodeMustBeInFiber();                                                                                    // 7
                                                                                                                      //
  if (Fiber.current._meteor_dynamics && Fiber.current._meteor_dynamics[this.slot]) {                                  // 9
    return Fiber.current._meteor_dynamics[this.slot];                                                                 // 10
  }                                                                                                                   // 11
                                                                                                                      //
  if (!Fiber.current.graphQLContext) return;                                                                          // 13
  return {                                                                                                            // 15
    userId: Fiber.current.graphQLContext.userId                                                                       // 16
  };                                                                                                                  // 15
};                                                                                                                    // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"node_modules":{"babel-runtime":{"helpers":{"extends.js":function(require,exports){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/orionsoft_apollo/node_modules/babel-runtime/helpers/extends.js                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
"use strict";

exports.__esModule = true;

var _assign = require("../core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
var exports = require("./node_modules/meteor/orionsoft:apollo/apollo.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['orionsoft:apollo'] = exports;

})();

//# sourceMappingURL=orionsoft_apollo.js.map
