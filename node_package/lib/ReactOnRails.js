'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _clientStartup = require('./clientStartup');

var ClientStartup = _interopRequireWildcard(_clientStartup);

var _handleError2 = require('./handleError');

var _handleError3 = _interopRequireDefault(_handleError2);

var _ComponentRegistry = require('./ComponentRegistry');

var _ComponentRegistry2 = _interopRequireDefault(_ComponentRegistry);

var _StoreRegistry = require('./StoreRegistry');

var _StoreRegistry2 = _interopRequireDefault(_StoreRegistry);

var _serverRenderReactComponent2 = require('./serverRenderReactComponent');

var _serverRenderReactComponent3 = _interopRequireDefault(_serverRenderReactComponent2);

var _buildConsoleReplay2 = require('./buildConsoleReplay');

var _buildConsoleReplay3 = _interopRequireDefault(_buildConsoleReplay2);

var _createReactElement = require('./createReactElement');

var _createReactElement2 = _interopRequireDefault(_createReactElement);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _context = require('./context');

var _context2 = _interopRequireDefault(_context);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ctx = (0, _context2.default)();

var DEFAULT_OPTIONS = {
  traceTurbolinks: false
};

ctx.ReactOnRails = {
  /**
   * Main entry point to using the react-on-rails npm package. This is how Rails will be able to
   * find you components for rendering.
   * @param components (key is component name, value is component)
   */

  register: function register(components) {
    _ComponentRegistry2.default.register(components);
  },


  /**
   * Allows registration of store generators to be used by multiple react components on one Rails
   * view. store generators are functions that take one arg, props, and return a store. Note that
   * the setStore API is different in tha it's the actual store hydrated with props.
   * @param stores (keys are store names, values are the store generators)
   */
  registerStore: function registerStore(stores) {
    if (!stores) {
      throw new Error('Called ReactOnRails.registerStores with a null or undefined, rather than ' + 'an Object with keys being the store names and the values are the store generators.');
    }

    _StoreRegistry2.default.register(stores);
  },


  /**
   * Allows retrieval of the store by name. This store will be hydrated by any Rails form props.
   * Pass optional param throwIfMissing = false if you want to use this call to get back null if the
   * store with name is not registered.
   * @param name
   * @param throwIfMissing Defaults to true. Set to false to have this call return undefined if
   *        there is no store with the given name.
   * @returns Redux Store, possibly hydrated
   */
  getStore: function getStore(name) {
    var throwIfMissing = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    return _StoreRegistry2.default.getStore(name, throwIfMissing);
  },


  /**
   * Set options for ReactOnRails, typically before you call ReactOnRails.register
   * Available Options:
   * `traceTurbolinks: true|false Gives you debugging messages on Turbolinks events
   */
  setOptions: function setOptions(options) {
    if (options.hasOwnProperty('traceTurbolinks')) {
      this._options.traceTurbolinks = options.traceTurbolinks;
      delete options.traceTurbolinks;
    }

    if ((0, _keys2.default)(options).length > 0) {
      throw new Error('Invalid options passed to ReactOnRails.options: ', (0, _stringify2.default)(options));
    }
  },
  reactOnRailsPageLoaded: function reactOnRailsPageLoaded() {
    ClientStartup.reactOnRailsPageLoaded();
  },
  reactOnRailsPageUnloaded: function reactOnRailsPageUnloaded() {
    ClientStartup.reactOnRailsPageUnloaded();
  },


  ////////////////////////////////////////////////////////////////////////////////
  // INTERNALLY USED APIs
  ////////////////////////////////////////////////////////////////////////////////

  /**
   * Retrieve an option by key.
   * @param key
   * @returns option value
   */
  option: function option(key) {
    return this._options[key];
  },


  /**
   * Allows retrieval of the store generator by name. This is used internally by ReactOnRails after
   * a rails form loads to prepare stores.
   * @param name
   * @returns Redux Store generator function
   */
  getStoreGenerator: function getStoreGenerator(name) {
    return _StoreRegistry2.default.getStoreGenerator(name);
  },


  /**
   * Allows saving the store populated by Rails form props. Used internally by ReactOnRails.
   * @param name
   * @returns Redux Store, possibly hydrated
   */
  setStore: function setStore(name, store) {
    return _StoreRegistry2.default.setStore(name, store);
  },


  /**
   * ReactOnRails.render("HelloWorldApp", {name: "Stranger"}, 'app');
   *
   * Does this:
   *   ReactDOM.render(React.createElement(HelloWorldApp, {name: "Stranger"}),
   *     document.getElementById('app'))
   *
   * @param name Name of your registered component
   * @param props Props to pass to your component
   * @param domNodeId
   * @returns {virtualDomElement} Reference to your component's backing instance
   */
  render: function render(name, props, domNodeId) {
    var reactElement = (0, _createReactElement2.default)({ name: name, props: props, domNodeId: domNodeId });
    return _reactDom2.default.render(reactElement, document.getElementById(domNodeId));
  },


  /**
   * Get the component that you registered
   * @param name
   * @returns {name, component, generatorFunction}
   */
  getComponent: function getComponent(name) {
    return _ComponentRegistry2.default.get(name);
  },


  /**
   * Used by server rendering by Rails
   * @param options
   */
  serverRenderReactComponent: function serverRenderReactComponent(options) {
    return (0, _serverRenderReactComponent3.default)(options);
  },


  /**
   * Used by Rails to catch errors in rendering
   * @param options
   */
  handleError: function handleError(options) {
    return (0, _handleError3.default)(options);
  },


  /**
   * Used by Rails server rendering to replay console messages.
   */
  buildConsoleReplay: function buildConsoleReplay() {
    return (0, _buildConsoleReplay3.default)();
  },


  /**
   * Get an Object containing all registered components. Useful for debugging.
   * @returns {*}
   */
  registeredComponents: function registeredComponents() {
    return _ComponentRegistry2.default.components();
  },


  /**
   * Get an Object containing all registered store generators. Useful for debugging.
   * @returns {*}
   */
  storeGenerators: function storeGenerators() {
    return _StoreRegistry2.default.storeGenerators();
  },


  /**
   * Get an Object containing all hydrated stores. Useful for debugging.
   * @returns {*}
   */
  stores: function stores() {
    return _StoreRegistry2.default.stores();
  },
  resetOptions: function resetOptions() {
    this._options = (0, _assign2.default)({}, DEFAULT_OPTIONS);
  }
};

ReactOnRails.resetOptions();

ClientStartup.clientStartup(ctx);

exports.default = ctx.ReactOnRails;