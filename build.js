'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var PropTypes = require('prop-types');

var START_STATE = 'start';
var UPDATED_STATE = 'updated';
var FAILED_STATE = 'failed';

var Optimistic = function (_React$Component) {
  _inherits(Optimistic, _React$Component);

  function Optimistic(props) {
    _classCallCheck(this, Optimistic);

    var _this = _possibleConstructorReturn(this, (Optimistic.__proto__ || Object.getPrototypeOf(Optimistic)).call(this, props));

    _this.state = { state: START_STATE };
    return _this;
  }

  _createClass(Optimistic, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return this.props.children({
        state: this.state.state,
        reset: function reset() {
          _this2.setState({ state: START_STATE });
        },
        updater: function updater(action) {
          return function () {
            _this2.setState({
              state: UPDATED_STATE
            });

            return action.apply(undefined, arguments).catch(function () {
              _this2.setState({
                state: FAILED_STATE
              });
            });
          };
        }
      });
    }
  }]);

  return Optimistic;
}(React.Component);

Optimistic.propTypes = {
  children: PropTypes.func.isRequired
};

Optimistic.START_STATE = START_STATE;
Optimistic.UPDATED_STATE = UPDATED_STATE;
Optimistic.FAILED_STATE = FAILED_STATE;

module.exports = Optimistic;

