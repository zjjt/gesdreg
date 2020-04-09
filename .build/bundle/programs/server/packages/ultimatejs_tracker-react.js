(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var _ = Package.underscore._;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

/* Package-scope variables */
var TrackerReact;

var require = meteorInstall({"node_modules":{"meteor":{"ultimatejs:tracker-react":{"main.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/ultimatejs_tracker-react/main.js                                                                        //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                             //
                                                                                                                    //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                    //
                                                                                                                    //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                       //
                                                                                                                    //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                              //
                                                                                                                    //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                         //
                                                                                                                    //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                //
                                                                                                                    //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                   //
                                                                                                                    //
module.export({                                                                                                     // 1
  TrackerReactMixin: function () {                                                                                  // 1
    return TrackerReactMixin;                                                                                       // 1
  }                                                                                                                 // 1
});                                                                                                                 // 1
var Tracker = void 0;                                                                                               // 1
module.watch(require("./Tracker"), {                                                                                // 1
  "default": function (v) {                                                                                         // 1
    Tracker = v;                                                                                                    // 1
  }                                                                                                                 // 1
}, 0);                                                                                                              // 1
module.exportDefault(TrackerReact = function (Component, opt) {                                                     // 1
  // No reactive computations needed for Server Side Rendering                                                      // 26
  if (Meteor.isServer) return Component;                                                                            // 27
                                                                                                                    //
  var TrackerReactComponent = function (_Component) {                                                               // 25
    (0, _inherits3.default)(TrackerReactComponent, _Component);                                                     // 25
                                                                                                                    //
    function TrackerReactComponent() {                                                                              // 31
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {                        // 31
        args[_key] = arguments[_key];                                                                               // 31
      }                                                                                                             // 31
                                                                                                                    //
      (0, _classCallCheck3.default)(this, TrackerReactComponent);                                                   // 31
                                                                                                                    //
      /*                                                                                                            // 34
       Overloading the constructors `componentWillUnmount` method to ensure that computations are stopped and a     //
       forceUpdate prevented, without overwriting the prototype. This is a potential bug, as of React 14.7 the      //
       componentWillUnmount() method does not fire, if the top level component has one. It gets overwritten. This   //
       implementation is however similar to what a transpiler would do anyway.                                      //
        GitHub Issue: https://github.com/facebook/react/issues/6162                                                 //
       */var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args)));
                                                                                                                    //
      if (!_this.constructor.prototype._isExtended) {                                                               // 42
        _this.constructor.prototype._isExtended = true;                                                             // 43
        var superComponentWillUnmount = _this.constructor.prototype.componentWillUnmount;                           // 44
                                                                                                                    //
        _this.constructor.prototype.componentWillUnmount = function () {                                            // 46
          if (superComponentWillUnmount) {                                                                          // 47
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {            // 47
              args[_key2] = arguments[_key2];                                                                       // 46
            }                                                                                                       // 47
                                                                                                                    //
            superComponentWillUnmount.call.apply(superComponentWillUnmount, [this].concat(args));                   // 48
          }                                                                                                         // 49
                                                                                                                    //
          this._renderComputation.stop();                                                                           // 51
                                                                                                                    //
          this._renderComputation = null;                                                                           // 52
        };                                                                                                          // 53
      }                                                                                                             // 54
                                                                                                                    //
      _this.autorunRender();                                                                                        // 56
                                                                                                                    //
      return _this;                                                                                                 // 31
    }                                                                                                               // 57
                                                                                                                    //
    TrackerReactComponent.prototype.autorunRender = function () {                                                   // 25
      function autorunRender() {                                                                                    // 25
        var _this2 = this;                                                                                          // 59
                                                                                                                    //
        var oldRender = this.render;                                                                                // 60
                                                                                                                    //
        this.render = function () {                                                                                 // 62
          // Simple method we can offer in the `Meteor.Component` API                                               // 63
          return _this2.autorunOnce('_renderComputation', oldRender);                                               // 64
        };                                                                                                          // 65
      }                                                                                                             // 66
                                                                                                                    //
      return autorunRender;                                                                                         // 25
    }();                                                                                                            // 25
                                                                                                                    //
    TrackerReactComponent.prototype.autorunOnce = function () {                                                     // 25
      function autorunOnce(name, dataFunc) {                                                                        // 25
        return Tracker.once(name, this, dataFunc, this.forceUpdate);                                                // 69
      }                                                                                                             // 70
                                                                                                                    //
      return autorunOnce;                                                                                           // 25
    }();                                                                                                            // 25
                                                                                                                    //
    return TrackerReactComponent;                                                                                   // 25
  }(Component);                                                                                                     // 25
                                                                                                                    //
  return TrackerReactComponent;                                                                                     // 73
});                                                                                                                 // 74
var TrackerReactMixin = {                                                                                           // 85
  componentWillMount: function () {                                                                                 // 86
    // No reactive computations needed for Server Side Rendering                                                    // 87
    if (Meteor.isServer) return;                                                                                    // 88
    this.autorunRender();                                                                                           // 90
  },                                                                                                                // 91
  componentWillUnmount: function () {                                                                               // 92
    // No reactive computations needed for Server Side Rendering                                                    // 93
    if (Meteor.isServer) return;                                                                                    // 94
                                                                                                                    //
    this._renderComputation.stop();                                                                                 // 96
                                                                                                                    //
    this._renderComputation = null;                                                                                 // 97
  },                                                                                                                // 98
  autorunRender: function () {                                                                                      // 99
    var _this3 = this;                                                                                              // 99
                                                                                                                    //
    var oldRender = this.render;                                                                                    // 100
                                                                                                                    //
    this.render = function () {                                                                                     // 102
      // Simple method we can offer in the `Meteor.Component` API                                                   // 103
      return _this3.autorunOnce('_renderComputation', oldRender);                                                   // 104
    };                                                                                                              // 105
  },                                                                                                                // 106
  autorunOnce: function (name, dataFunc) {                                                                          // 107
    return Tracker.once(name, this, dataFunc, this.forceUpdate);                                                    // 108
  }                                                                                                                 // 109
};                                                                                                                  // 85
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Tracker.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/ultimatejs_tracker-react/Tracker.js                                                                     //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var Tracker = void 0;                                                                                               // 1
module.watch(require("meteor/tracker"), {                                                                           // 1
  Tracker: function (v) {                                                                                           // 1
    Tracker = v;                                                                                                    // 1
  }                                                                                                                 // 1
}, 0);                                                                                                              // 1
                                                                                                                    //
/**                                                                                                                 // 4
 * Create "one-time" reactive computations with Tracker                                                             //
 * @param name {string} Component Reactive Data Property for Computation                                            //
 * @param context {*} Target Component Instance                                                                     //
 * @param dataFunc {*} Data Context                                                                                 //
 * @param updateFunc {*} Component ForceUpdate Method - To re-trigger render function                               //
 * @returns {*} Symbol(react.element) - Result data-element composition                                             //
 */Tracker.once = function (name, context, dataFunc, updateFunc) {                                                  //
  var data = void 0; // Stop it just in case the autorun never re-ran                                               // 13
                                                                                                                    //
  if (context[name] && !context[name].stopped) context[name].stop(); // NOTE: we may want to run this code in `setTimeout(func, 0)` so it doesn't impact the rendering phase at all
                                                                                                                    //
  context[name] = Tracker.nonreactive(function () {                                                                 // 19
    return Tracker.autorun(function (c) {                                                                           // 20
      if (c.firstRun) {                                                                                             // 21
        data = dataFunc.call(context);                                                                              // 23
      } else {                                                                                                      // 25
        // Stop autorun here so rendering "phase" doesn't have extra work of also stopping autoruns; likely not too
        // important though.                                                                                        // 28
        if (context[name]) context[name].stop(); // where `forceUpdate` will be called in above implementation      // 29
                                                                                                                    //
        updateFunc.call(context);                                                                                   // 32
      }                                                                                                             // 33
    });                                                                                                             // 34
  });                                                                                                               // 35
  return data;                                                                                                      // 37
};                                                                                                                  // 38
                                                                                                                    //
module.exportDefault(Tracker);                                                                                      // 1
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
var exports = require("./node_modules/meteor/ultimatejs:tracker-react/main.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['ultimatejs:tracker-react'] = exports;

})();

//# sourceMappingURL=ultimatejs_tracker-react.js.map
