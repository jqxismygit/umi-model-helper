"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createModel;
exports.addProxy = void 0;

var _flat = _interopRequireDefault(require("./proxy/flat"));

var _singleTree = _interopRequireDefault(require("./proxy/single-tree"));

var _multipleTree = _interopRequireDefault(require("./proxy/multiple-tree"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var proxies = {};

var addProxy = function addProxy(id, proxy) {
  proxies[id] = proxy;
}; //加入自带的proxy


exports.addProxy = addProxy;
addProxy('flat', _flat.default);
addProxy('single-tree', _singleTree.default);
addProxy('multiple-tree', _multipleTree.default);

function createModel(namespace, api, option) {
  var _fetch = api.fetch,
      _fetchPart = api.fetchPart,
      _create = api.create,
      _update = api.update,
      _remove = api.remove,
      _detail = api.detail;
  var type = option ? option.type : 'flat';
  var proxy = proxies[type];

  if (!proxy) {
    throw new Error("no proxy for this type [".concat(type, "]"));
  }

  var defaultReduce = function defaultReduce(state, byId, allIds, total) {
    return _objectSpread({}, state, {
      byId: byId,
      allIds: allIds,
      total: total
    });
  };

  var transform = proxy.transform,
      normalize = proxy.normalize;
  var reduce = proxy.reduce || defaultReduce;
  return {
    namespace: namespace,
    state: {
      byId: {},
      allIds: [],
      total: 0
    },
    effects: {
      fetch:
      /*#__PURE__*/
      regeneratorRuntime.mark(function fetch(_ref, _ref2) {
        var payload, call, put, response, list, total;
        return regeneratorRuntime.wrap(function fetch$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                payload = _ref.payload;
                call = _ref2.call, put = _ref2.put;

                if (!_fetch) {
                  _context.next = 12;
                  break;
                }

                _context.next = 5;
                return call(_fetch, payload);

              case 5:
                response = _context.sent;
                console.log(response);

                if (!(response && (response.code === 200 || response.code === 0))) {
                  _context.next = 12;
                  break;
                }

                //TODO这个retlist是java的，以后肯定要一致
                list = response.data.list || response.data.retlist || response.data || [];
                total = response.data.total || list.length;
                _context.next = 12;
                return put({
                  type: 'onFetch',
                  payload: {
                    list: list,
                    total: total
                  }
                });

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, fetch);
      }),
      fetchPart:
      /*#__PURE__*/
      regeneratorRuntime.mark(function fetchPart(_ref3, _ref4) {
        var payload, call, put, response, list, total;
        return regeneratorRuntime.wrap(function fetchPart$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                payload = _ref3.payload;
                call = _ref4.call, put = _ref4.put;

                if (!_fetchPart) {
                  _context2.next = 11;
                  break;
                }

                _context2.next = 5;
                return call(_fetchPart, payload);

              case 5:
                response = _context2.sent;

                if (!(response && (response.code === 200 || response.code === 0))) {
                  _context2.next = 11;
                  break;
                }

                list = response.data.list || response.data || [];
                total = response.data.total || list.length;
                _context2.next = 11;
                return put({
                  type: 'onFetchPart',
                  payload: {
                    list: list,
                    total: total
                  }
                });

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, fetchPart);
      }),
      create:
      /*#__PURE__*/
      regeneratorRuntime.mark(function create(_ref5, _ref6) {
        var payload, call, put, response, data;
        return regeneratorRuntime.wrap(function create$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                payload = _ref5.payload;
                call = _ref6.call, put = _ref6.put;

                if (!_create) {
                  _context3.next = 10;
                  break;
                }

                _context3.next = 5;
                return call(_create, payload);

              case 5:
                response = _context3.sent;

                if (!(response && (response.code === 200 || response.code === 0))) {
                  _context3.next = 10;
                  break;
                }

                data = response.data;
                _context3.next = 10;
                return put({
                  type: 'onCreate',
                  payload: data
                });

              case 10:
              case "end":
                return _context3.stop();
            }
          }
        }, create);
      }),
      update:
      /*#__PURE__*/
      regeneratorRuntime.mark(function update(_ref7, _ref8) {
        var payload, call, put, id, response, data;
        return regeneratorRuntime.wrap(function update$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                payload = _ref7.payload;
                call = _ref8.call, put = _ref8.put;

                if (!_update) {
                  _context4.next = 11;
                  break;
                }

                id = payload && payload.id || payload;
                _context4.next = 6;
                return call(_update, id, payload);

              case 6:
                response = _context4.sent;

                if (!(response && (response.code === 200 || response.code === 0))) {
                  _context4.next = 11;
                  break;
                }

                data = response.data;
                _context4.next = 11;
                return put({
                  type: 'onUpdate',
                  payload: data
                });

              case 11:
              case "end":
                return _context4.stop();
            }
          }
        }, update);
      }),
      remove:
      /*#__PURE__*/
      regeneratorRuntime.mark(function remove(_ref9, _ref10) {
        var payload, call, put, id, response;
        return regeneratorRuntime.wrap(function remove$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                payload = _ref9.payload;
                call = _ref10.call, put = _ref10.put;

                if (!_remove) {
                  _context5.next = 10;
                  break;
                }

                id = payload && payload.id || payload;
                _context5.next = 6;
                return call(_remove, id);

              case 6:
                response = _context5.sent;

                if (!(response && (response.code === 200 || response.code === 0))) {
                  _context5.next = 10;
                  break;
                }

                _context5.next = 10;
                return put({
                  type: 'onRemove',
                  payload: {
                    id: id
                  }
                });

              case 10:
              case "end":
                return _context5.stop();
            }
          }
        }, remove);
      }),
      detail:
      /*#__PURE__*/
      regeneratorRuntime.mark(function detail(_ref11, _ref12) {
        var payload, call, put, response, data;
        return regeneratorRuntime.wrap(function detail$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                payload = _ref11.payload;
                call = _ref12.call, put = _ref12.put;

                if (!_detail) {
                  _context6.next = 10;
                  break;
                }

                _context6.next = 5;
                return call(_detail, payload);

              case 5:
                response = _context6.sent;

                if (!(response && (response.code === 200 || response.code === 0))) {
                  _context6.next = 10;
                  break;
                }

                data = response.data;
                _context6.next = 10;
                return put({
                  type: 'onUpdate',
                  payload: data
                });

              case 10:
              case "end":
                return _context6.stop();
            }
          }
        }, detail);
      })
    },
    reducers: {
      onFetch: function onFetch(state, _ref13) {
        var payload = _ref13.payload;
        var list = payload.list,
            total = payload.total;
        var normalized = normalize(list);
        return _objectSpread({
          total: total
        }, reduce(state, normalized.byId, normalized.allIds, total));
      },
      onFetchPart: function onFetchPart(state, _ref14) {
        var payload = _ref14.payload;
        var list = payload.list,
            total = payload.total;
        var normalized = normalize([].concat(list, state.allIds));
        return _objectSpread({
          total: state.total + total
        }, reduce(state, normalized.byId, normalized.allIds, state.total + total));
      },
      onCreate: function onCreate(state, _ref15) {
        var payload = _ref15.payload;

        if (payload && payload.id) {
          var byId = _objectSpread({}, state.byId, _defineProperty({}, payload.id, payload));

          var allIds = transform(byId);
          return _objectSpread({
            total: state.total + 1
          }, reduce(state, byId, allIds, state.total + 1));
        } else {
          return state;
        }
      },
      onUpdate: function onUpdate(state, _ref16) {
        var payload = _ref16.payload;

        if (payload && payload.id) {
          var byId = _objectSpread({}, state.byId, _defineProperty({}, payload.id, payload));

          var allIds = transform(byId);
          return reduce(state, byId, allIds, state.total);
        } else {
          return state;
        }
      },
      onRemove: function onRemove(state, _ref17) {
        var payload = _ref17.payload;

        if (payload && payload.id) {
          var byId = _objectSpread({}, state.byId);

          delete byId[payload.id];
          var allIds = transform(byId);
          return _objectSpread({
            total: state.total - 1
          }, reduce(state, byId, allIds, state.total - 1));
        } else {
          return state;
        }
      }
    }
  };
}