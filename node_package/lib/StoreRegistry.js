'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _context = require('./context');

var _context2 = _interopRequireDefault(_context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _storeGenerators = new _map2.default(); // key = name used by react_on_rails to identify the store
// value = redux store creator, which is a function that takes props and returns a store

var _stores = new _map2.default();

exports.default = {
  /**
   * Register a store generator, a function that takes props and returns a store.
   * @param storeGenerators { name1: storeGenerator1, name2: storeGenerator2 }
   */

  register: function register(storeGenerators) {
    (0, _keys2.default)(storeGenerators).forEach(function (name) {
      if (_storeGenerators.has(name)) {
        console.warn('Called registerStore for store that is already registered', name);
      }

      var store = storeGenerators[name];
      if (!store) {
        throw new Error('Called ReactOnRails.registerStores with a null or undefined as a value ' + ('for the store generator with key ' + name + '.'));
      }

      _storeGenerators.set(name, store);
    });
  },


  /**
   * Used by components to get the hydrated store which contains props.
   * @param name
   * @param throwIfMissing Defaults to true. Set to false to have this call return undefined if
   *        there is no store with the given name.
   * @returns Redux Store, possibly hydrated
   */
  getStore: function getStore(name) {
    var throwIfMissing = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    if (_stores.has(name)) {
      return _stores.get(name);
    }

    var storeKeys = (0, _from2.default)(_stores.keys()).join(', ');

    if (storeKeys.length === 0) {
      var msg = 'There are no stores hydrated and you are requesting the store ' + (name + '. This can happen if you are server rendering and you do not call ') + 'redux_store near the top of your controller action\'s view (not the layout) ' + 'and before any call to react_component.';
      throw new Error(msg);
    }

    if (throwIfMissing) {
      console.log('storeKeys', storeKeys);
      throw new Error('Could not find hydrated store with name \'' + name + '\'. ' + ('Hydrated store names include [' + storeKeys + '].'));
    }
  },


  /**
   * Internally used function to get the store creator that was passed to `register`.
   * @param name
   * @returns storeCreator with given name
   */
  getStoreGenerator: function getStoreGenerator(name) {
    if (_storeGenerators.has(name)) {
      return _storeGenerators.get(name);
    } else {
      var storeKeys = (0, _from2.default)(_storeGenerators.keys()).join(', ');
      throw new Error('Could not find store registered with name \'' + name + '\'. Registered store ' + ('names include [ ' + storeKeys + ' ]. Maybe you forgot to register the store?'));
    }
  },


  /**
   * Internally used function to set the hydrated store after a Rails page is loaded.
   * @param name
   * @param store (not the storeGenerator, but the hydrated store)
   */
  setStore: function setStore(name, store) {
    _stores.set(name, store);
  },


  /**
   * Get a Map containing all registered store generators. Useful for debugging.
   * @returns Map where key is the component name and values are the store generators.
   */
  storeGenerators: function storeGenerators() {
    return _storeGenerators;
  },


  /**
   * Get a Map containing all hydrated stores. Useful for debugging.
   * @returns Map where key is the component name and values are the hydrated stores.
   */
  stores: function stores() {
    return _stores;
  }
};