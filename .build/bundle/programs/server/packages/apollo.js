(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var Accounts = Package['accounts-base'].Accounts;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"apollo":{"src":{"main-server.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/apollo/src/main-server.js                                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _regenerator = require("babel-runtime/regenerator");                                                              //
                                                                                                                      //
var _regenerator2 = _interopRequireDefault(_regenerator);                                                             //
                                                                                                                      //
var _extends2 = require("babel-runtime/helpers/extends");                                                             //
                                                                                                                      //
var _extends3 = _interopRequireDefault(_extends2);                                                                    //
                                                                                                                      //
var _this = this;                                                                                                     //
                                                                                                                      //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                     //
                                                                                                                      //
module.export({                                                                                                       // 1
  createApolloServer: function () {                                                                                   // 1
    return createApolloServer;                                                                                        // 1
  },                                                                                                                  // 1
  getUserForContext: function () {                                                                                    // 1
    return getUserForContext;                                                                                         // 1
  },                                                                                                                  // 1
  addCurrentUserToContext: function () {                                                                              // 1
    return addCurrentUserToContext;                                                                                   // 1
  }                                                                                                                   // 1
});                                                                                                                   // 1
module.watch(require("./main-client"), {                                                                              // 1
  createMeteorNetworkInterface: function (v) {                                                                        // 1
    exports.createMeteorNetworkInterface = v;                                                                         // 1
  },                                                                                                                  // 1
  meteorClientConfig: function (v) {                                                                                  // 1
    exports.meteorClientConfig = v;                                                                                   // 1
  }                                                                                                                   // 1
}, 7);                                                                                                                // 1
var graphqlExpress = void 0,                                                                                          // 1
    graphiqlExpress = void 0;                                                                                         // 1
module.watch(require("apollo-server-express"), {                                                                      // 1
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
var Accounts = void 0;                                                                                                // 1
module.watch(require("meteor/accounts-base"), {                                                                       // 1
  Accounts: function (v) {                                                                                            // 1
    Accounts = v;                                                                                                     // 1
  }                                                                                                                   // 1
}, 5);                                                                                                                // 1
var check = void 0;                                                                                                   // 1
module.watch(require("meteor/check"), {                                                                               // 1
  check: function (v) {                                                                                               // 1
    check = v;                                                                                                        // 1
  }                                                                                                                   // 1
}, 6);                                                                                                                // 1
// default server configuration object                                                                                // 14
var defaultServerConfig = {                                                                                           // 15
  // graphql endpoint                                                                                                 // 16
  path: '/graphql',                                                                                                   // 17
  // additional Express server configuration (enable CORS there for instance)                                         // 18
  configServer: function (graphQLServer) {},                                                                          // 19
  // enable GraphiQL only in development mode                                                                         // 20
  graphiql: Meteor.isDevelopment,                                                                                     // 21
  // GraphiQL endpoint                                                                                                // 22
  graphiqlPath: '/graphiql',                                                                                          // 23
  // GraphiQL options (default: log the current user in your request)                                                 // 24
  graphiqlOptions: {                                                                                                  // 25
    passHeader: "'meteor-login-token': localStorage['Meteor.loginToken']"                                             // 26
  }                                                                                                                   // 25
}; // default graphql options to enhance the graphQLExpress server                                                    // 15
                                                                                                                      //
var defaultGraphQLOptions = {                                                                                         // 31
  // ensure that a context object is defined for the resolvers                                                        // 32
  context: {},                                                                                                        // 33
  // error formatting                                                                                                 // 34
  formatError: function (e) {                                                                                         // 35
    return {                                                                                                          // 35
      message: e.message,                                                                                             // 36
      locations: e.locations,                                                                                         // 37
      path: e.path                                                                                                    // 38
    };                                                                                                                // 35
  },                                                                                                                  // 35
  // additional debug logging if execution errors occur in dev mode                                                   // 40
  debug: Meteor.isDevelopment                                                                                         // 41
};                                                                                                                    // 31
                                                                                                                      //
var createApolloServer = function () {                                                                                // 44
  var customOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};                         // 44
  var customConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};                          // 44
  // create a new server config object based on the default server config                                             // 45
  // defined above and the custom server config passed to this function                                               // 46
  var config = (0, _extends3.default)({}, defaultServerConfig, customConfig);                                         // 47
                                                                                                                      //
  if (customConfig.graphiqlOptions) {                                                                                 // 52
    config.graphiqlOptions = (0, _extends3.default)({}, defaultServerConfig.graphiqlOptions, customConfig.graphiqlOptions);
  } // the Meteor GraphQL server is an Express server                                                                 // 57
                                                                                                                      //
                                                                                                                      //
  var graphQLServer = express(); // enhance the GraphQL server with possible express middlewares                      // 60
                                                                                                                      //
  config.configServer(graphQLServer); // GraphQL endpoint, enhanced with JSON body parser                             // 63
                                                                                                                      //
  graphQLServer.use(config.path, bodyParser.json(), graphqlExpress(function () {                                      // 66
    function _callee(req) {                                                                                           // 69
      var customOptionsObject, options, loginToken, userContext, context;                                             // 69
      return _regenerator2.default.async(function () {                                                                // 69
        function _callee$(_context) {                                                                                 // 69
          while (1) {                                                                                                 // 69
            switch (_context.prev = _context.next) {                                                                  // 69
              case 0:                                                                                                 // 69
                _context.prev = 0;                                                                                    // 69
                // graphqlExpress can accept a function returning the option object                                   // 71
                customOptionsObject = typeof customOptions === 'function' ? customOptions(req) : customOptions; // create a new apollo options object based on the default apollo options
                // defined above and the custom apollo options passed to this function                                // 76
                                                                                                                      //
                options = (0, _extends3.default)({}, defaultGraphQLOptions, customOptionsObject); // get the login token from the headers request, given by the Meteor's
                // network interface middleware if enabled                                                            // 83
                                                                                                                      //
                loginToken = req.headers['meteor-login-token']; // get the current user & the user id for the context
                                                                                                                      //
                _context.next = 6;                                                                                    // 69
                return _regenerator2.default.awrap(getUserForContext(loginToken));                                    // 69
                                                                                                                      //
              case 6:                                                                                                 // 69
                userContext = _context.sent;                                                                          // 87
                                                                                                                      //
                if (!(typeof options.context === 'function')) {                                                       // 69
                  _context.next = 13;                                                                                 // 69
                  break;                                                                                              // 69
                }                                                                                                     // 69
                                                                                                                      //
                _context.next = 10;                                                                                   // 69
                return _regenerator2.default.awrap(options.context(userContext));                                     // 69
                                                                                                                      //
              case 10:                                                                                                // 69
                _context.t0 = _context.sent;                                                                          // 69
                _context.next = 14;                                                                                   // 69
                break;                                                                                                // 69
                                                                                                                      //
              case 13:                                                                                                // 69
                _context.t0 = (0, _extends3.default)({}, options.context, userContext);                               // 69
                                                                                                                      //
              case 14:                                                                                                // 69
                context = _context.t0;                                                                                // 90
                return _context.abrupt("return", (0, _extends3.default)({}, options, {                                // 69
                  context: context                                                                                    // 98
                }));                                                                                                  // 69
                                                                                                                      //
              case 18:                                                                                                // 69
                _context.prev = 18;                                                                                   // 69
                _context.t1 = _context["catch"](0);                                                                   // 69
                // something went bad when configuring the graphql server, we do not                                  // 101
                // swallow the error and display it in the server-side logs                                           // 102
                console.error('[Meteor Apollo Integration] Something bad happened when handling a request on the GraphQL server. Your GraphQL server is not working as expected:', _context.t1); // return the default graphql options anyway
                                                                                                                      //
                return _context.abrupt("return", defaultGraphQLOptions);                                              // 69
                                                                                                                      //
              case 22:                                                                                                // 69
              case "end":                                                                                             // 69
                return _context.stop();                                                                               // 69
            }                                                                                                         // 69
          }                                                                                                           // 69
        }                                                                                                             // 69
                                                                                                                      //
        return _callee$;                                                                                              // 69
      }(), null, _this, [[0, 18]]);                                                                                   // 69
    }                                                                                                                 // 69
                                                                                                                      //
    return _callee;                                                                                                   // 69
  }())); // Start GraphiQL if enabled                                                                                 // 69
                                                                                                                      //
  if (config.graphiql) {                                                                                              // 115
    // GraphiQL endpoint                                                                                              // 116
    graphQLServer.use(config.graphiqlPath, graphiqlExpress((0, _extends3.default)({}, config.graphiqlOptions, {       // 117
      // endpoint of the graphql server where to send requests                                                        // 122
      endpointURL: config.path                                                                                        // 123
    })));                                                                                                             // 119
  } // this binds the specified paths to the Express server running Apollo + GraphiQL                                 // 126
                                                                                                                      //
                                                                                                                      //
  WebApp.connectHandlers.use(graphQLServer);                                                                          // 128
};                                                                                                                    // 129
                                                                                                                      //
var getUserForContext = function () {                                                                                 // 131
  function _callee2(loginToken) {                                                                                     // 131
    var hashedToken, currentUser, tokenInformation, expiresAt, isExpired;                                             // 131
    return _regenerator2.default.async(function () {                                                                  // 131
      function _callee2$(_context2) {                                                                                 // 131
        while (1) {                                                                                                   // 131
          switch (_context2.prev = _context2.next) {                                                                  // 131
            case 0:                                                                                                   // 131
              if (!loginToken) {                                                                                      // 131
                _context2.next = 12;                                                                                  // 131
                break;                                                                                                // 131
              }                                                                                                       // 131
                                                                                                                      //
              // throw an error if the token is not a string                                                          // 134
              check(loginToken, String); // the hashed token is the key to find the possible current user in the db   // 135
                                                                                                                      //
              hashedToken = Accounts._hashLoginToken(loginToken); // get the possible current user from the database  // 138
              // note: no need of a fiber aware findOne + a fiber aware call break tests                              // 141
              // runned with practicalmeteor:mocha if eslint is enabled                                               // 142
                                                                                                                      //
              _context2.next = 5;                                                                                     // 131
              return _regenerator2.default.awrap(Meteor.users.rawCollection().findOne({                               // 131
                'services.resume.loginTokens.hashedToken': hashedToken                                                // 144
              }));                                                                                                    // 143
                                                                                                                      //
            case 5:                                                                                                   // 131
              currentUser = _context2.sent;                                                                           // 143
                                                                                                                      //
              if (!currentUser) {                                                                                     // 131
                _context2.next = 12;                                                                                  // 131
                break;                                                                                                // 131
              }                                                                                                       // 131
                                                                                                                      //
              // find the right login token corresponding, the current user may have                                  // 149
              // several sessions logged on different browsers / computers                                            // 150
              tokenInformation = currentUser.services.resume.loginTokens.find(function (tokenInfo) {                  // 151
                return tokenInfo.hashedToken === hashedToken;                                                         // 152
              }); // get an exploitable token expiration date                                                         // 152
                                                                                                                      //
              expiresAt = Accounts._tokenExpiration(tokenInformation.when); // true if the token is expired           // 156
                                                                                                                      //
              isExpired = expiresAt < new Date(); // if the token is still valid, give access to the current user     // 159
              // information in the resolvers context                                                                 // 162
                                                                                                                      //
              if (isExpired) {                                                                                        // 131
                _context2.next = 12;                                                                                  // 131
                break;                                                                                                // 131
              }                                                                                                       // 131
                                                                                                                      //
              return _context2.abrupt("return", {                                                                     // 131
                user: currentUser,                                                                                    // 166
                userId: currentUser._id                                                                               // 167
              });                                                                                                     // 165
                                                                                                                      //
            case 12:                                                                                                  // 131
              return _context2.abrupt("return", {});                                                                  // 131
                                                                                                                      //
            case 13:                                                                                                  // 131
            case "end":                                                                                               // 131
              return _context2.stop();                                                                                // 131
          }                                                                                                           // 131
        }                                                                                                             // 131
      }                                                                                                               // 131
                                                                                                                      //
      return _callee2$;                                                                                               // 131
    }(), null, _this);                                                                                                // 131
  }                                                                                                                   // 131
                                                                                                                      //
  return _callee2;                                                                                                    // 131
}();                                                                                                                  // 131
                                                                                                                      //
var addCurrentUserToContext = function () {                                                                           // 178
  function _callee3(context, loginToken) {                                                                            // 178
    var userContext;                                                                                                  // 178
    return _regenerator2.default.async(function () {                                                                  // 178
      function _callee3$(_context3) {                                                                                 // 178
        while (1) {                                                                                                   // 178
          switch (_context3.prev = _context3.next) {                                                                  // 178
            case 0:                                                                                                   // 178
              _context3.next = 2;                                                                                     // 178
              return _regenerator2.default.awrap(getUserForContext(loginToken));                                      // 178
                                                                                                                      //
            case 2:                                                                                                   // 178
              userContext = _context3.sent;                                                                           // 179
              return _context3.abrupt("return", (0, _extends3.default)({}, context, userContext));                    // 178
                                                                                                                      //
            case 4:                                                                                                   // 178
            case "end":                                                                                               // 178
              return _context3.stop();                                                                                // 178
          }                                                                                                           // 178
        }                                                                                                             // 178
      }                                                                                                               // 178
                                                                                                                      //
      return _callee3$;                                                                                               // 178
    }(), null, _this);                                                                                                // 178
  }                                                                                                                   // 178
                                                                                                                      //
  return _callee3;                                                                                                    // 178
}();                                                                                                                  // 178
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"main-client.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/apollo/src/main-client.js                                                                                 //
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
  createMeteorNetworkInterface: function () {                                                                         // 1
    return createMeteorNetworkInterface;                                                                              // 1
  },                                                                                                                  // 1
  meteorClientConfig: function () {                                                                                   // 1
    return meteorClientConfig;                                                                                        // 1
  },                                                                                                                  // 1
  getMeteorLoginToken: function () {                                                                                  // 1
    return getMeteorLoginToken;                                                                                       // 1
  }                                                                                                                   // 1
});                                                                                                                   // 1
var createNetworkInterface = void 0,                                                                                  // 1
    createBatchingNetworkInterface = void 0;                                                                          // 1
module.watch(require("apollo-client"), {                                                                              // 1
  createNetworkInterface: function (v) {                                                                              // 1
    createNetworkInterface = v;                                                                                       // 1
  },                                                                                                                  // 1
  createBatchingNetworkInterface: function (v) {                                                                      // 1
    createBatchingNetworkInterface = v;                                                                               // 1
  }                                                                                                                   // 1
}, 0);                                                                                                                // 1
var Meteor = void 0;                                                                                                  // 1
module.watch(require("meteor/meteor"), {                                                                              // 1
  Meteor: function (v) {                                                                                              // 1
    Meteor = v;                                                                                                       // 1
  }                                                                                                                   // 1
}, 1);                                                                                                                // 1
var Accounts = void 0;                                                                                                // 1
module.watch(require("meteor/accounts-base"), {                                                                       // 1
  Accounts: function (v) {                                                                                            // 1
    Accounts = v;                                                                                                     // 1
  }                                                                                                                   // 1
}, 2);                                                                                                                // 1
// default network interface configuration object                                                                     // 6
var defaultNetworkInterfaceConfig = {                                                                                 // 7
  // default graphql server endpoint: ROOT_URL/graphql                                                                // 8
  // ex: http://locahost:3000/graphql, or https://www.my-app.com/graphql                                              // 9
  uri: Meteor.absoluteUrl('graphql'),                                                                                 // 10
  // additional fetch options like `credentials` or `headers`                                                         // 11
  opts: {},                                                                                                           // 12
  // enable the Meteor User Accounts middleware to identify the user with                                             // 13
  // every request thanks to their login token                                                                        // 14
  useMeteorAccounts: true,                                                                                            // 15
  // use a BatchingNetworkInterface by default instead of a NetworkInterface                                          // 16
  batchingInterface: true,                                                                                            // 17
  // default batch interval                                                                                           // 18
  batchInterval: 10                                                                                                   // 19
}; // create a pre-configured network interface                                                                       // 7
                                                                                                                      //
var createMeteorNetworkInterface = function () {                                                                      // 23
  var customNetworkInterfaceConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};          // 23
  // create a new config object based on the default network interface config                                         // 24
  // defined above and the custom network interface config passed to this function                                    // 25
  var config = (0, _extends3.default)({}, defaultNetworkInterfaceConfig, customNetworkInterfaceConfig); // this will be true true if a BatchingNetworkInterface is meant to be used
  // with a correct poll interval                                                                                     // 32
                                                                                                                      //
  var useBatchingInterface = config.batchingInterface && typeof config.batchInterval === 'number'; // allow the use of a batching network interface
                                                                                                                      //
  var interfaceToUse = useBatchingInterface ? createBatchingNetworkInterface : createNetworkInterface; // http://dev.apollodata.com/core/apollo-client-api.html#NetworkInterfaceOptions
                                                                                                                      //
  var interfaceArgument = {                                                                                           // 41
    uri: config.uri,                                                                                                  // 42
    opts: config.opts                                                                                                 // 43
  }; // http://dev.apollodata.com/core/network.html#BatchingExample                                                   // 41
                                                                                                                      //
  if (useBatchingInterface) {                                                                                         // 47
    interfaceArgument.batchInterval = config.batchInterval;                                                           // 48
  } // configure the (batching?) network interface with the config defined above                                      // 49
                                                                                                                      //
                                                                                                                      //
  var networkInterface = interfaceToUse(interfaceArgument); // handle the creation of a Meteor User Accounts middleware
                                                                                                                      //
  if (config.useMeteorAccounts) {                                                                                     // 55
    try {                                                                                                             // 56
      var _ref;                                                                                                       // 56
                                                                                                                      //
      // throw an error if someone tries to specify the login token                                                   // 57
      // manually from the client                                                                                     // 58
      if (Meteor.isClient && config.loginToken) {                                                                     // 59
        throw Error('[Meteor Apollo Integration] The current user is not handled with your GraphQL operations: you are trying to pass a login token to an Apollo Client instance defined client-side. This is only allowed during server-side rendering, please check your implementation.');
      } // dynamic middleware function name depending on the interface used                                           // 63
                                                                                                                      //
                                                                                                                      //
      var applyMiddlewareFn = useBatchingInterface ? 'applyBatchMiddleware' : 'applyMiddleware'; // add a middleware handling the current user to the network interface
                                                                                                                      //
      networkInterface.use([(_ref = {}, _ref[applyMiddlewareFn] = function (request, next) {                          // 69
        // get the login token on a per-request basis                                                                 // 72
        var meteorLoginToken = getMeteorLoginToken(config); // no token, meaning no user connected, just go to next possible middleware
                                                                                                                      //
        if (!meteorLoginToken) {                                                                                      // 76
          next();                                                                                                     // 77
        } // create the header object if needed.                                                                      // 78
                                                                                                                      //
                                                                                                                      //
        if (!request.options.headers) {                                                                               // 81
          request.options.headers = {};                                                                               // 82
        } // add the login token to the request headers                                                               // 83
                                                                                                                      //
                                                                                                                      //
        request.options.headers['meteor-login-token'] = meteorLoginToken; // go to next middleware                    // 86
                                                                                                                      //
        next();                                                                                                       // 89
      }, _ref)]);                                                                                                     // 90
    } catch (error) {                                                                                                 // 93
      // catch the potential error sent by if a login token is manually set client-side                               // 94
      console.error(error);                                                                                           // 95
    }                                                                                                                 // 96
  }                                                                                                                   // 97
                                                                                                                      //
  return networkInterface;                                                                                            // 99
};                                                                                                                    // 100
                                                                                                                      //
// default Apollo Client configuration object                                                                         // 102
var defaultClientConfig = {                                                                                           // 103
  // setup ssr mode if the client is configured server-side (ex: for SSR)                                             // 104
  ssrMode: Meteor.isServer                                                                                            // 105
}; // create a new client config object based on the default Apollo Client config                                     // 103
// defined above and the client config passed to this function                                                        // 109
                                                                                                                      //
var meteorClientConfig = function () {                                                                                // 110
  var customClientConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};                    // 110
  return (0, _extends3.default)({                                                                                     // 110
    // default network interface preconfigured, the network interface key is set                                      // 111
    // there to so that `createMeteorNetworkInterface` is executed only when                                          // 112
    // `meteorClientConfig` is called.                                                                                // 113
    networkInterface: createMeteorNetworkInterface()                                                                  // 114
  }, defaultClientConfig, customClientConfig);                                                                        // 110
};                                                                                                                    // 110
                                                                                                                      //
var getMeteorLoginToken = function () {                                                                               // 120
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};                                // 120
  // possible cookie login token created by meteorhacks:fast-render                                                   // 121
  // and passed to the Apollo Client during server-side rendering                                                     // 122
  var _config$loginToken = config.loginToken,                                                                         // 120
      loginToken = _config$loginToken === undefined ? null : _config$loginToken; // Meteor accounts-base login token stored in local storage,
  // only exists client-side as of Meteor 1.4, will exist with Meteor 1.5                                             // 126
                                                                                                                      //
  var localStorageLoginToken = Meteor.isClient && Accounts._storedLoginToken(); // return a meteor login token if existing
  // ex: grabbed from local storage or passed during server-side rendering                                            // 130
                                                                                                                      //
                                                                                                                      //
  return localStorageLoginToken || loginToken;                                                                        // 131
};                                                                                                                    // 132
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
var exports = require("./node_modules/meteor/apollo/src/main-server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.apollo = exports;

})();

//# sourceMappingURL=apollo.js.map
