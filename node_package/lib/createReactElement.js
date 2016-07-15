'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createReactElement;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ReactOnRails = require('./ReactOnRails');

var _ReactOnRails2 = _interopRequireDefault(_ReactOnRails);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Logic to either call the generatorFunction or call React.createElement to get the
 * React.Component
 * @param options
 * @param options.name
 * @param options.props
 * @param options.domNodeId
 * @param options.trace
 * @param options.location
 * @returns {Element}
 */
function createReactElement(_ref) {
  var name = _ref.name;
  var props = _ref.props;
  var railsContext = _ref.railsContext;
  var domNodeId = _ref.domNodeId;
  var trace = _ref.trace;
  var location = _ref.location;

  if (trace) {
    if (railsContext && railsContext.serverSide) {
      console.log('RENDERED ' + name + ' to dom node with id: ' + domNodeId + ' with railsContext:', railsContext);
    } else {
      console.log('RENDERED ' + name + ' to dom node with id: ' + domNodeId + ' with props, railsContext:', props, railsContext);
    }
  }

  var componentObj = _ReactOnRails2.default.getComponent(name);

  var component = componentObj.component;
  var generatorFunction = componentObj.generatorFunction;


  if (generatorFunction) {
    return component(props, railsContext);
  }

  return _react2.default.createElement(component, props);
}