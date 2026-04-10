import { c as createLucideIcon, R as React2, f as clsx, r as reactExports, g as useActor, u as useSimulationStore, j as jsxRuntimeExports, N as Navigation, B as Button, h as RefreshCw, S as Skeleton, T as TriangleAlert, a as cn, i as Badge, k as createActor } from "./index-B2saiLCY.js";
import { i as isFunction, D as Dot, f as findAllByType, E as ErrorBar, L as Layer, a as filterProps, b as Curve, A as Animate, c as interpolateNumber, d as isEqual, e as isNil, h as hasClipDot, g as LabelList, j as getValueByDataKey, u as uniqueId, G as Global, k as getCateCoordinateOfLine, l as generateCategoricalChart, m as formatAxisMap, R as ResponsiveContainer, T as Tooltip, n as ReferenceLine, S as StatusBadge } from "./generateCategoricalChart-BlZ_UpE5.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent, S as Select, d as SelectTrigger, e as SelectValue, f as SelectContent, g as SelectItem } from "./select-DV-QCRQR.js";
import { a as getRoutes, b as getSegments, c as computeOptimalRoute } from "./trafficApi-Cx6Z_Vgx.js";
import { L as LoaderCircle } from "./loader-circle-CSSJnhgX.js";
import { M as MapPin } from "./map-pin-CMkI_NuK.js";
import { X as XAxis, Y as YAxis } from "./YAxis-CqFXLIIE.js";
import { C as CartesianGrid } from "./CartesianGrid-j6ZSpWe3.js";
import { C as Clock, a as CircleCheck } from "./clock-r8C7qKsq.js";
import "./chevron-up-Cp4dxTJd.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z",
      key: "l5xja"
    }
  ],
  [
    "path",
    {
      d: "M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z",
      key: "ep3f8r"
    }
  ],
  ["path", { d: "M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4", key: "1p4c4q" }],
  ["path", { d: "M17.599 6.5a3 3 0 0 0 .399-1.375", key: "tmeiqw" }],
  ["path", { d: "M6.003 5.125A3 3 0 0 0 6.401 6.5", key: "105sqy" }],
  ["path", { d: "M3.477 10.896a4 4 0 0 1 .585-.396", key: "ql3yin" }],
  ["path", { d: "M19.938 10.5a4 4 0 0 1 .585.396", key: "1qfode" }],
  ["path", { d: "M6 18a4 4 0 0 1-1.967-.516", key: "2e4loj" }],
  ["path", { d: "M19.967 17.484A4 4 0 0 1 18 18", key: "159ez6" }]
];
const Brain = createLucideIcon("brain", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "6", cy: "19", r: "3", key: "1kj8tv" }],
  ["path", { d: "M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15", key: "1d8sl" }],
  ["circle", { cx: "18", cy: "5", r: "3", key: "gq8acd" }]
];
const Route = createLucideIcon("route", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m18 14 4 4-4 4", key: "10pe0f" }],
  ["path", { d: "m18 2 4 4-4 4", key: "pucp1d" }],
  ["path", { d: "M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22", key: "1ailkh" }],
  ["path", { d: "M2 6h1.972a4 4 0 0 1 3.6 2.2", key: "km57vx" }],
  ["path", { d: "M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45", key: "os18l9" }]
];
const Shuffle = createLucideIcon("shuffle", __iconNode);
var _excluded = ["type", "layout", "connectNulls", "ref"], _excluded2 = ["key"];
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  for (var key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
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
  return _extends.apply(this, arguments);
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", { writable: false });
  return Constructor;
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch (t2) {
  }
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct2() {
    return !!t;
  })();
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
  Object.defineProperty(subClass, "prototype", { writable: false });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf(o, p);
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(t);
}
var Line = /* @__PURE__ */ function(_PureComponent) {
  function Line2() {
    var _this;
    _classCallCheck(this, Line2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _callSuper(this, Line2, [].concat(args));
    _defineProperty(_this, "state", {
      isAnimationFinished: true,
      totalLength: 0
    });
    _defineProperty(_this, "generateSimpleStrokeDasharray", function(totalLength, length) {
      return "".concat(length, "px ").concat(totalLength - length, "px");
    });
    _defineProperty(_this, "getStrokeDasharray", function(length, totalLength, lines) {
      var lineLength = lines.reduce(function(pre, next) {
        return pre + next;
      });
      if (!lineLength) {
        return _this.generateSimpleStrokeDasharray(totalLength, length);
      }
      var count = Math.floor(length / lineLength);
      var remainLength = length % lineLength;
      var restLength = totalLength - length;
      var remainLines = [];
      for (var i = 0, sum = 0; i < lines.length; sum += lines[i], ++i) {
        if (sum + lines[i] > remainLength) {
          remainLines = [].concat(_toConsumableArray(lines.slice(0, i)), [remainLength - sum]);
          break;
        }
      }
      var emptyLines = remainLines.length % 2 === 0 ? [0, restLength] : [restLength];
      return [].concat(_toConsumableArray(Line2.repeat(lines, count)), _toConsumableArray(remainLines), emptyLines).map(function(line) {
        return "".concat(line, "px");
      }).join(", ");
    });
    _defineProperty(_this, "id", uniqueId("recharts-line-"));
    _defineProperty(_this, "pathRef", function(node) {
      _this.mainCurve = node;
    });
    _defineProperty(_this, "handleAnimationEnd", function() {
      _this.setState({
        isAnimationFinished: true
      });
      if (_this.props.onAnimationEnd) {
        _this.props.onAnimationEnd();
      }
    });
    _defineProperty(_this, "handleAnimationStart", function() {
      _this.setState({
        isAnimationFinished: false
      });
      if (_this.props.onAnimationStart) {
        _this.props.onAnimationStart();
      }
    });
    return _this;
  }
  _inherits(Line2, _PureComponent);
  return _createClass(Line2, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (!this.props.isAnimationActive) {
        return;
      }
      var totalLength = this.getTotalLength();
      this.setState({
        totalLength
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (!this.props.isAnimationActive) {
        return;
      }
      var totalLength = this.getTotalLength();
      if (totalLength !== this.state.totalLength) {
        this.setState({
          totalLength
        });
      }
    }
  }, {
    key: "getTotalLength",
    value: function getTotalLength() {
      var curveDom = this.mainCurve;
      try {
        return curveDom && curveDom.getTotalLength && curveDom.getTotalLength() || 0;
      } catch (err) {
        return 0;
      }
    }
  }, {
    key: "renderErrorBar",
    value: function renderErrorBar(needClip, clipPathId) {
      if (this.props.isAnimationActive && !this.state.isAnimationFinished) {
        return null;
      }
      var _this$props = this.props, points = _this$props.points, xAxis = _this$props.xAxis, yAxis = _this$props.yAxis, layout = _this$props.layout, children = _this$props.children;
      var errorBarItems = findAllByType(children, ErrorBar);
      if (!errorBarItems) {
        return null;
      }
      var dataPointFormatter = function dataPointFormatter2(dataPoint, dataKey) {
        return {
          x: dataPoint.x,
          y: dataPoint.y,
          value: dataPoint.value,
          errorVal: getValueByDataKey(dataPoint.payload, dataKey)
        };
      };
      var errorBarProps = {
        clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : null
      };
      return /* @__PURE__ */ React2.createElement(Layer, errorBarProps, errorBarItems.map(function(item) {
        return /* @__PURE__ */ React2.cloneElement(item, {
          key: "bar-".concat(item.props.dataKey),
          data: points,
          xAxis,
          yAxis,
          layout,
          dataPointFormatter
        });
      }));
    }
  }, {
    key: "renderDots",
    value: function renderDots(needClip, clipDot, clipPathId) {
      var isAnimationActive = this.props.isAnimationActive;
      if (isAnimationActive && !this.state.isAnimationFinished) {
        return null;
      }
      var _this$props2 = this.props, dot = _this$props2.dot, points = _this$props2.points, dataKey = _this$props2.dataKey;
      var lineProps = filterProps(this.props, false);
      var customDotProps = filterProps(dot, true);
      var dots = points.map(function(entry, i) {
        var dotProps = _objectSpread(_objectSpread(_objectSpread({
          key: "dot-".concat(i),
          r: 3
        }, lineProps), customDotProps), {}, {
          index: i,
          cx: entry.x,
          cy: entry.y,
          value: entry.value,
          dataKey,
          payload: entry.payload,
          points
        });
        return Line2.renderDotItem(dot, dotProps);
      });
      var dotsProps = {
        clipPath: needClip ? "url(#clipPath-".concat(clipDot ? "" : "dots-").concat(clipPathId, ")") : null
      };
      return /* @__PURE__ */ React2.createElement(Layer, _extends({
        className: "recharts-line-dots",
        key: "dots"
      }, dotsProps), dots);
    }
  }, {
    key: "renderCurveStatically",
    value: function renderCurveStatically(points, needClip, clipPathId, props) {
      var _this$props3 = this.props, type = _this$props3.type, layout = _this$props3.layout, connectNulls = _this$props3.connectNulls;
      _this$props3.ref;
      var others = _objectWithoutProperties(_this$props3, _excluded);
      var curveProps = _objectSpread(_objectSpread(_objectSpread({}, filterProps(others, true)), {}, {
        fill: "none",
        className: "recharts-line-curve",
        clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : null,
        points
      }, props), {}, {
        type,
        layout,
        connectNulls
      });
      return /* @__PURE__ */ React2.createElement(Curve, _extends({}, curveProps, {
        pathRef: this.pathRef
      }));
    }
  }, {
    key: "renderCurveWithAnimation",
    value: function renderCurveWithAnimation(needClip, clipPathId) {
      var _this2 = this;
      var _this$props4 = this.props, points = _this$props4.points, strokeDasharray = _this$props4.strokeDasharray, isAnimationActive = _this$props4.isAnimationActive, animationBegin = _this$props4.animationBegin, animationDuration = _this$props4.animationDuration, animationEasing = _this$props4.animationEasing, animationId = _this$props4.animationId, animateNewValues = _this$props4.animateNewValues, width = _this$props4.width, height = _this$props4.height;
      var _this$state = this.state, prevPoints = _this$state.prevPoints, totalLength = _this$state.totalLength;
      return /* @__PURE__ */ React2.createElement(Animate, {
        begin: animationBegin,
        duration: animationDuration,
        isActive: isAnimationActive,
        easing: animationEasing,
        from: {
          t: 0
        },
        to: {
          t: 1
        },
        key: "line-".concat(animationId),
        onAnimationEnd: this.handleAnimationEnd,
        onAnimationStart: this.handleAnimationStart
      }, function(_ref) {
        var t = _ref.t;
        if (prevPoints) {
          var prevPointsDiffFactor = prevPoints.length / points.length;
          var stepData = points.map(function(entry, index) {
            var prevPointIndex = Math.floor(index * prevPointsDiffFactor);
            if (prevPoints[prevPointIndex]) {
              var prev = prevPoints[prevPointIndex];
              var interpolatorX = interpolateNumber(prev.x, entry.x);
              var interpolatorY = interpolateNumber(prev.y, entry.y);
              return _objectSpread(_objectSpread({}, entry), {}, {
                x: interpolatorX(t),
                y: interpolatorY(t)
              });
            }
            if (animateNewValues) {
              var _interpolatorX = interpolateNumber(width * 2, entry.x);
              var _interpolatorY = interpolateNumber(height / 2, entry.y);
              return _objectSpread(_objectSpread({}, entry), {}, {
                x: _interpolatorX(t),
                y: _interpolatorY(t)
              });
            }
            return _objectSpread(_objectSpread({}, entry), {}, {
              x: entry.x,
              y: entry.y
            });
          });
          return _this2.renderCurveStatically(stepData, needClip, clipPathId);
        }
        var interpolator = interpolateNumber(0, totalLength);
        var curLength = interpolator(t);
        var currentStrokeDasharray;
        if (strokeDasharray) {
          var lines = "".concat(strokeDasharray).split(/[,\s]+/gim).map(function(num) {
            return parseFloat(num);
          });
          currentStrokeDasharray = _this2.getStrokeDasharray(curLength, totalLength, lines);
        } else {
          currentStrokeDasharray = _this2.generateSimpleStrokeDasharray(totalLength, curLength);
        }
        return _this2.renderCurveStatically(points, needClip, clipPathId, {
          strokeDasharray: currentStrokeDasharray
        });
      });
    }
  }, {
    key: "renderCurve",
    value: function renderCurve(needClip, clipPathId) {
      var _this$props5 = this.props, points = _this$props5.points, isAnimationActive = _this$props5.isAnimationActive;
      var _this$state2 = this.state, prevPoints = _this$state2.prevPoints, totalLength = _this$state2.totalLength;
      if (isAnimationActive && points && points.length && (!prevPoints && totalLength > 0 || !isEqual(prevPoints, points))) {
        return this.renderCurveWithAnimation(needClip, clipPathId);
      }
      return this.renderCurveStatically(points, needClip, clipPathId);
    }
  }, {
    key: "render",
    value: function render() {
      var _filterProps;
      var _this$props6 = this.props, hide = _this$props6.hide, dot = _this$props6.dot, points = _this$props6.points, className = _this$props6.className, xAxis = _this$props6.xAxis, yAxis = _this$props6.yAxis, top = _this$props6.top, left = _this$props6.left, width = _this$props6.width, height = _this$props6.height, isAnimationActive = _this$props6.isAnimationActive, id = _this$props6.id;
      if (hide || !points || !points.length) {
        return null;
      }
      var isAnimationFinished = this.state.isAnimationFinished;
      var hasSinglePoint = points.length === 1;
      var layerClass = clsx("recharts-line", className);
      var needClipX = xAxis && xAxis.allowDataOverflow;
      var needClipY = yAxis && yAxis.allowDataOverflow;
      var needClip = needClipX || needClipY;
      var clipPathId = isNil(id) ? this.id : id;
      var _ref2 = (_filterProps = filterProps(dot, false)) !== null && _filterProps !== void 0 ? _filterProps : {
        r: 3,
        strokeWidth: 2
      }, _ref2$r = _ref2.r, r = _ref2$r === void 0 ? 3 : _ref2$r, _ref2$strokeWidth = _ref2.strokeWidth, strokeWidth = _ref2$strokeWidth === void 0 ? 2 : _ref2$strokeWidth;
      var _ref3 = hasClipDot(dot) ? dot : {}, _ref3$clipDot = _ref3.clipDot, clipDot = _ref3$clipDot === void 0 ? true : _ref3$clipDot;
      var dotSize = r * 2 + strokeWidth;
      return /* @__PURE__ */ React2.createElement(Layer, {
        className: layerClass
      }, needClipX || needClipY ? /* @__PURE__ */ React2.createElement("defs", null, /* @__PURE__ */ React2.createElement("clipPath", {
        id: "clipPath-".concat(clipPathId)
      }, /* @__PURE__ */ React2.createElement("rect", {
        x: needClipX ? left : left - width / 2,
        y: needClipY ? top : top - height / 2,
        width: needClipX ? width : width * 2,
        height: needClipY ? height : height * 2
      })), !clipDot && /* @__PURE__ */ React2.createElement("clipPath", {
        id: "clipPath-dots-".concat(clipPathId)
      }, /* @__PURE__ */ React2.createElement("rect", {
        x: left - dotSize / 2,
        y: top - dotSize / 2,
        width: width + dotSize,
        height: height + dotSize
      }))) : null, !hasSinglePoint && this.renderCurve(needClip, clipPathId), this.renderErrorBar(needClip, clipPathId), (hasSinglePoint || dot) && this.renderDots(needClip, clipDot, clipPathId), (!isAnimationActive || isAnimationFinished) && LabelList.renderCallByParent(this.props, points));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.animationId !== prevState.prevAnimationId) {
        return {
          prevAnimationId: nextProps.animationId,
          curPoints: nextProps.points,
          prevPoints: prevState.curPoints
        };
      }
      if (nextProps.points !== prevState.curPoints) {
        return {
          curPoints: nextProps.points
        };
      }
      return null;
    }
  }, {
    key: "repeat",
    value: function repeat(lines, count) {
      var linesUnit = lines.length % 2 !== 0 ? [].concat(_toConsumableArray(lines), [0]) : lines;
      var result = [];
      for (var i = 0; i < count; ++i) {
        result = [].concat(_toConsumableArray(result), _toConsumableArray(linesUnit));
      }
      return result;
    }
  }, {
    key: "renderDotItem",
    value: function renderDotItem(option, props) {
      var dotItem;
      if (/* @__PURE__ */ React2.isValidElement(option)) {
        dotItem = /* @__PURE__ */ React2.cloneElement(option, props);
      } else if (isFunction(option)) {
        dotItem = option(props);
      } else {
        var key = props.key, dotProps = _objectWithoutProperties(props, _excluded2);
        var className = clsx("recharts-line-dot", typeof option !== "boolean" ? option.className : "");
        dotItem = /* @__PURE__ */ React2.createElement(Dot, _extends({
          key
        }, dotProps, {
          className
        }));
      }
      return dotItem;
    }
  }]);
}(reactExports.PureComponent);
_defineProperty(Line, "displayName", "Line");
_defineProperty(Line, "defaultProps", {
  xAxisId: 0,
  yAxisId: 0,
  connectNulls: false,
  activeDot: true,
  dot: true,
  legendType: "line",
  stroke: "#3182bd",
  strokeWidth: 1,
  fill: "#fff",
  points: [],
  isAnimationActive: !Global.isSsr,
  animateNewValues: true,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: "ease",
  hide: false,
  label: false
});
_defineProperty(Line, "getComposedData", function(_ref4) {
  var props = _ref4.props, xAxis = _ref4.xAxis, yAxis = _ref4.yAxis, xAxisTicks = _ref4.xAxisTicks, yAxisTicks = _ref4.yAxisTicks, dataKey = _ref4.dataKey, bandSize = _ref4.bandSize, displayedData = _ref4.displayedData, offset = _ref4.offset;
  var layout = props.layout;
  var points = displayedData.map(function(entry, index) {
    var value = getValueByDataKey(entry, dataKey);
    if (layout === "horizontal") {
      return {
        x: getCateCoordinateOfLine({
          axis: xAxis,
          ticks: xAxisTicks,
          bandSize,
          entry,
          index
        }),
        y: isNil(value) ? null : yAxis.scale(value),
        value,
        payload: entry
      };
    }
    return {
      x: isNil(value) ? null : xAxis.scale(value),
      y: getCateCoordinateOfLine({
        axis: yAxis,
        ticks: yAxisTicks,
        bandSize,
        entry,
        index
      }),
      value,
      payload: entry
    };
  });
  return _objectSpread({
    points,
    layout
  }, offset);
});
var LineChart = generateCategoricalChart({
  chartName: "LineChart",
  GraphicalChild: Line,
  axisComponents: [{
    axisType: "xAxis",
    AxisComp: XAxis
  }, {
    axisType: "yAxis",
    AxisComp: YAxis
  }],
  formatAxisMap
});
const DISTRICTS = [
  "Downtown Core",
  "Westside Business District",
  "Eastside Residential",
  "North Industrial Zone"
];
const CONGESTION_RED = 70;
const CONGESTION_AMBER = 35;
function congestionColor(pct) {
  if (pct >= CONGESTION_RED) return "oklch(0.62 0.24 24)";
  if (pct >= CONGESTION_AMBER) return "oklch(0.72 0.23 55)";
  return "oklch(0.62 0.25 195)";
}
function congestionLabel(pct) {
  if (pct >= CONGESTION_RED) return "Critical";
  if (pct >= CONGESTION_AMBER) return "Moderate";
  return "Clear";
}
function fmtTime(ts) {
  return new Date(Number(ts)).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}
const STATIC_EVENTS = [
  {
    id: "s1",
    timestamp: "12:04:22",
    segment: "Westside Ave",
    reason: "Congestion spike detected (>75%)",
    action: "Redirected 34 vehicles via North Bypass",
    severity: "high"
  },
  {
    id: "s2",
    timestamp: "11:52:01",
    segment: "East Harbor Rd",
    reason: "Animal obstacle detected on road surface",
    action: "Temporary signal hold + alternate route activated",
    severity: "medium"
  },
  {
    id: "s3",
    timestamp: "11:38:47",
    segment: "Industrial Blvd",
    reason: "Active construction zone — lane reduction",
    action: "Weight-restricted detour applied to heavy vehicles",
    severity: "low"
  }
];
function buildRerouteHistory(anomalies, segMap) {
  const live = anomalies.filter((a) => a.isActive).slice(0, 5).map((a) => ({
    id: a.id,
    timestamp: fmtTime(a.detectedAt),
    segment: segMap[a.segmentId] ?? a.segmentId,
    reason: a.description,
    action: `Rerouted — ${a.reasoning.slice(0, 80)}${a.reasoning.length > 80 ? "…" : ""}`,
    severity: a.severity === "Critical" || a.severity === "High" ? "high" : a.severity === "Medium" ? "medium" : "low"
  }));
  return [...live, ...STATIC_EVENTS].slice(0, 5);
}
function RouteBreadcrumb({ segments }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-1", children: segments.map((seg, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 font-mono text-[11px] text-primary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3 shrink-0" }),
      seg
    ] }),
    i < segments.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5 shrink-0 text-muted-foreground" })
  ] }, seg)) });
}
function RoutePathDiagram({ segments }) {
  if (segments.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex items-start gap-0 overflow-x-auto pb-2", children: segments.map((seg, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex shrink-0 items-start", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex flex-col items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: cn(
            "flex h-8 w-8 items-center justify-center rounded-full border-2 font-mono text-[10px] font-bold",
            i === 0 || i === segments.length - 1 ? "border-primary bg-primary/20 text-primary" : "border-border bg-muted text-muted-foreground"
          ),
          children: i + 1
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "max-w-[68px] break-words text-center font-mono text-[9px] leading-tight text-muted-foreground", children: seg })
    ] }),
    i < segments.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-1 mt-3.5 h-0.5 w-8 shrink-0 bg-primary/30" })
  ] }, seg)) });
}
function RouteResultCard({ route }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4",
      "data-ocid": "route-result-card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "h-4 w-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-sm font-semibold text-foreground", children: route.name }),
              route.isOptimal && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  className: "border-primary/40 bg-primary/15 font-mono text-[10px] text-primary",
                  variant: "outline",
                  children: "OPTIMAL"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-center gap-1 font-mono text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: route.fromDistrict }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: route.toDistrict })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-lg font-bold tabular-nums text-primary", children: [
                route.totalDistance.toFixed(1),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-0.5 font-mono text-[10px] text-muted-foreground", children: "km" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[9px] uppercase tracking-widest text-muted-foreground", children: "Distance" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-lg font-bold tabular-nums text-accent", children: [
                Number(route.estimatedMinutes),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-0.5 font-mono text-[10px] text-muted-foreground", children: "min" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[9px] uppercase tracking-widest text-muted-foreground", children: "Est. Time" })
            ] })
          ] })
        ] }),
        route.segments.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Route Path" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RouteBreadcrumb, { segments: route.segments }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RoutePathDiagram, { segments: route.segments })
        ] }),
        route.reasoning && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex gap-2 rounded border border-primary/20 bg-background/60 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-0.5 font-mono text-[10px] uppercase tracking-widest text-primary", children: "AI Reasoning" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-xs leading-relaxed text-muted-foreground", children: route.reasoning })
          ] })
        ] })
      ]
    }
  );
}
function CongestionTooltip({ active, payload, label }) {
  if (!active || !(payload == null ? void 0 : payload.length)) return null;
  const pct = payload[0].value;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded border border-border bg-popover px-3 py-2 shadow-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "mt-0.5 font-display text-sm font-bold tabular-nums",
        style: { color: congestionColor(pct) },
        children: [
          pct,
          "%",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] font-normal text-muted-foreground", children: [
            "— ",
            congestionLabel(pct)
          ] })
        ]
      }
    )
  ] });
}
function SortIndicator({ active, asc }) {
  if (!active) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 font-mono text-[10px] text-primary", children: asc ? "↑" : "↓" });
}
function RouteTableRow({ route }) {
  const isCongested = !route.isOptimal && !!route.alternateOf;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "tr",
    {
      className: cn(
        "border-b border-border/50 transition-colors hover:bg-muted/20",
        route.isOptimal && "bg-primary/5",
        isCongested && "bg-accent/5"
      ),
      "data-ocid": "route-table-row",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Route,
            {
              className: cn(
                "h-3.5 w-3.5 shrink-0",
                route.isOptimal ? "text-primary" : "text-muted-foreground"
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: cn(
                "font-body text-sm",
                route.isOptimal ? "font-semibold text-primary" : "text-foreground"
              ),
              children: route.name
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 font-mono text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: route.fromDistrict }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3 shrink-0 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: route.toDistrict })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2.5 text-right font-mono text-sm tabular-nums text-foreground", children: [
          route.totalDistance.toFixed(1),
          " km"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2.5 text-right font-mono text-sm tabular-nums text-foreground", children: [
          Number(route.estimatedMinutes),
          " min"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: route.isOptimal ? /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: "Optimal", status: "Operational" }) : isCongested ? /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: "Congested", status: "Degraded" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: "Alternative", status: "Low" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "max-w-[200px] px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "truncate font-body text-xs text-muted-foreground",
            title: route.reasoning,
            children: route.reasoning
          }
        ) })
      ]
    }
  );
}
function RerouteRow({ event }) {
  const styles = {
    high: {
      border: "border-l-destructive",
      bg: "bg-destructive/5",
      icon: "text-destructive"
    },
    medium: {
      border: "border-l-accent",
      bg: "bg-accent/5",
      icon: "text-accent"
    },
    low: {
      border: "border-l-primary",
      bg: "bg-primary/5",
      icon: "text-primary"
    }
  };
  const s = styles[event.severity];
  const Icon = event.severity === "high" ? TriangleAlert : event.severity === "medium" ? Shuffle : CircleCheck;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn("flex gap-3 rounded border-l-2 p-3", s.border, s.bg),
      "data-ocid": "reroute-history-row",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("mt-0.5 h-4 w-4 shrink-0", s.icon) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body text-sm font-medium text-foreground", children: event.segment }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 font-mono text-[10px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
              event.timestamp
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 font-body text-xs text-muted-foreground", children: event.reason }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 font-mono text-[10px] text-foreground", children: [
            "↳ ",
            event.action
          ] })
        ] })
      ]
    }
  );
}
function Routing() {
  const { actor, isFetching: actorLoading } = useActor(createActor);
  const snapshot = useSimulationStore((s) => s.snapshot);
  const [routes, setRoutes] = reactExports.useState([]);
  const [segments, setSegments] = reactExports.useState([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = reactExports.useState(true);
  const [fromDistrict, setFromDistrict] = reactExports.useState("");
  const [toDistrict, setToDistrict] = reactExports.useState("");
  const [computedRoute, setComputedRoute] = reactExports.useState(
    void 0
  );
  const [isComputing, setIsComputing] = reactExports.useState(false);
  const [sortKey, setSortKey] = reactExports.useState("totalDistance");
  const [sortAsc, setSortAsc] = reactExports.useState(true);
  const intervalRef = reactExports.useRef(null);
  const loadData = reactExports.useCallback(async () => {
    if (!actor) return;
    try {
      const [r, s] = await Promise.all([getRoutes(actor), getSegments(actor)]);
      setRoutes(r);
      setSegments(s);
    } catch {
    } finally {
      setIsLoadingRoutes(false);
    }
  }, [actor]);
  reactExports.useEffect(() => {
    if (actorLoading || !actor) return;
    loadData();
    intervalRef.current = setInterval(loadData, 1e4);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [actor, actorLoading, loadData]);
  const handleCompute = async () => {
    if (!actor || !fromDistrict || !toDistrict || fromDistrict === toDistrict)
      return;
    setIsComputing(true);
    setComputedRoute(void 0);
    try {
      const result = await computeOptimalRoute(actor, fromDistrict, toDistrict);
      setComputedRoute(result);
    } catch {
      setComputedRoute(null);
    } finally {
      setIsComputing(false);
    }
  };
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortAsc((p) => !p);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };
  const sortedRoutes = [...routes].sort((a, b) => {
    let va;
    let vb;
    if (sortKey === "estimatedMinutes") {
      va = Number(a.estimatedMinutes);
      vb = Number(b.estimatedMinutes);
    } else if (sortKey === "totalDistance") {
      va = a.totalDistance;
      vb = b.totalDistance;
    } else {
      va = a.name;
      vb = b.name;
    }
    if (va < vb) return sortAsc ? -1 : 1;
    if (va > vb) return sortAsc ? 1 : -1;
    return 0;
  });
  const chartData = segments.map((s) => ({
    name: s.name.length > 14 ? `${s.name.slice(0, 12)}…` : s.name,
    congestion: Number(s.congestionPct)
  }));
  const segMap = {};
  for (const s of segments) {
    segMap[s.id] = s.name;
  }
  const anomalies = (snapshot == null ? void 0 : snapshot.activeAnomalies) ?? [];
  const rerouteHistory = buildRerouteHistory(anomalies, segMap);
  const sameDistrict = fromDistrict && toDistrict && fromDistrict === toDistrict;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 p-6", "data-ocid": "routing-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "h-5 w-5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "Adaptive Vehicle Rerouting Engine" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 font-body text-sm text-muted-foreground", children: "Graph-based pathfinding with A*/Dijkstra optimization for real-time traffic conditions" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          className: "gap-2 border-border bg-muted font-mono text-xs text-muted-foreground hover:border-primary/40 hover:text-primary",
          "data-ocid": "refresh-routes-btn",
          onClick: loadData,
          size: "sm",
          variant: "outline",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5" }),
            "Refresh"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: "border-border bg-card",
        "data-ocid": "route-calculator-panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { className: "h-4 w-4 text-primary" }),
            "Route Calculator"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "From District" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    onValueChange: (v) => setFromDistrict(v),
                    value: fromDistrict,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        SelectTrigger,
                        {
                          "aria-label": "Select origin district",
                          className: "border-input bg-background font-body text-sm",
                          "data-ocid": "from-district-select",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select origin district" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: DISTRICTS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: d, children: d }, d)) })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "To District" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    onValueChange: (v) => setToDistrict(v),
                    value: toDistrict,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        SelectTrigger,
                        {
                          "aria-label": "Select destination district",
                          className: "border-input bg-background font-body text-sm",
                          "data-ocid": "to-district-select",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select destination district" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: DISTRICTS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: d, children: d }, d)) })
                    ]
                  }
                )
              ] })
            ] }),
            sameDistrict && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[11px] text-destructive", children: "Origin and destination must be different districts." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                className: "gap-2 font-mono text-xs",
                "data-ocid": "compute-route-btn",
                disabled: !fromDistrict || !toDistrict || !!sameDistrict || isComputing,
                onClick: handleCompute,
                children: [
                  isComputing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "h-3.5 w-3.5" }),
                  isComputing ? "Computing…" : "Compute Optimal Route"
                ]
              }
            ),
            isComputing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-2", "data-ocid": "route-loading-state", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full" })
            ] }),
            !isComputing && computedRoute !== void 0 && computedRoute !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(RouteResultCard, { route: computedRoute }),
            !isComputing && computedRoute === null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-2 rounded border border-accent/30 bg-accent/5 px-3 py-2 font-mono text-xs text-accent", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 shrink-0" }),
              "No route found between selected districts. Try a different pair."
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", "data-ocid": "routes-table-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { className: "h-4 w-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground", children: "All Routes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto font-mono text-[10px] text-muted-foreground", children: [
          routes.length,
          " total"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: isLoadingRoutes ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 p-4", children: [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full min-w-[640px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-muted/30", children: [
          {
            key: "name",
            label: "Route",
            align: "left"
          },
          { key: null, label: "From → To", align: "left" },
          {
            key: "totalDistance",
            label: "Distance",
            align: "right"
          },
          {
            key: "estimatedMinutes",
            label: "Est. Time",
            align: "right"
          },
          { key: null, label: "Status", align: "left" },
          { key: null, label: "Reasoning", align: "left" }
        ].map(({ key, label, align }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "th",
          {
            className: cn(
              "px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
              align === "right" ? "text-right" : "text-left",
              key && "cursor-pointer hover:text-foreground"
            ),
            onClick: key ? () => handleSort(key) : void 0,
            onKeyDown: key ? (e) => {
              if (e.key === "Enter" || e.key === " ")
                handleSort(key);
            } : void 0,
            children: [
              label,
              key && /* @__PURE__ */ jsxRuntimeExports.jsx(
                SortIndicator,
                {
                  active: sortKey === key,
                  asc: sortAsc
                }
              )
            ]
          },
          label
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: sortedRoutes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            className: "px-4 py-10 text-center font-mono text-xs text-muted-foreground",
            colSpan: 6,
            "data-ocid": "routes-empty-state",
            children: "No routes available — run a simulation tick to generate data."
          }
        ) }) : sortedRoutes.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(RouteTableRow, { route: r }, r.id)) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", "data-ocid": "congestion-chart-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-primary" }),
          "Traffic Flow — Congestion by Segment"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-4 pt-1", children: [
          { color: "bg-destructive/60", label: "Critical (>70%)" },
          { color: "bg-accent/60", label: "Moderate (35–70%)" },
          { color: "bg-primary/60", label: "Clear (<35%)" }
        ].map(({ color, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn("inline-block h-2 w-4 rounded-sm", color)
                }
              ),
              label
            ]
          },
          label
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: segments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-40 items-center justify-center font-mono text-xs text-muted-foreground", children: "Awaiting segment data…" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { height: 230, width: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        LineChart,
        {
          data: chartData,
          margin: { top: 8, right: 16, bottom: 44, left: 0 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CartesianGrid,
              {
                stroke: "hsl(var(--border))",
                strokeDasharray: "3 3",
                strokeOpacity: 0.4
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              XAxis,
              {
                angle: -30,
                dataKey: "name",
                height: 50,
                interval: 0,
                textAnchor: "end",
                tick: {
                  fill: "oklch(0.52 0 0)",
                  fontSize: 9,
                  fontFamily: "JetBrains Mono"
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              YAxis,
              {
                domain: [0, 100],
                tick: {
                  fill: "oklch(0.52 0 0)",
                  fontSize: 9,
                  fontFamily: "JetBrains Mono"
                },
                tickFormatter: (v) => `${v}%`,
                width: 38
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(CongestionTooltip, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ReferenceLine,
              {
                label: {
                  value: "Critical",
                  position: "insideTopRight",
                  fill: "oklch(0.62 0.24 24)",
                  fontSize: 9
                },
                stroke: "oklch(0.62 0.24 24)",
                strokeDasharray: "4 3",
                strokeOpacity: 0.7,
                y: CONGESTION_RED
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ReferenceLine,
              {
                label: {
                  value: "Moderate",
                  position: "insideTopRight",
                  fill: "oklch(0.72 0.23 55)",
                  fontSize: 9
                },
                stroke: "oklch(0.72 0.23 55)",
                strokeDasharray: "4 3",
                strokeOpacity: 0.7,
                y: CONGESTION_AMBER
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Line,
              {
                dataKey: "congestion",
                dot: (props) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "circle",
                  {
                    cx: props.cx,
                    cy: props.cy,
                    fill: congestionColor(props.payload.congestion),
                    r: 4,
                    stroke: "oklch(0.12 0 0)",
                    strokeWidth: 1.5
                  },
                  `dot-${props.index}`
                ),
                stroke: "oklch(0.62 0.25 195)",
                strokeWidth: 2,
                type: "monotone"
              }
            )
          ]
        }
      ) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: "border-border bg-card",
        "data-ocid": "rerouting-history-card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-primary" }),
            "Rerouting History",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto font-mono text-[10px] text-muted-foreground", children: "Last 5 events" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-2", children: rerouteHistory.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center gap-2 py-8 text-center",
              "data-ocid": "reroute-empty-state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-8 w-8 text-primary/40" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: "No rerouting events detected. Traffic is flowing normally." })
              ]
            }
          ) : rerouteHistory.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx(RerouteRow, { event: e }, e.id)) })
        ]
      }
    )
  ] });
}
export {
  Routing
};
