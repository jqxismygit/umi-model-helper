"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var proxy = {
  normalize: function normalize(list) {
    var byId = list && list.reduce(function (prev, c) {
      if (c && c.id) {
        prev[c.id] = c;
      }

      return prev;
    }, {});
    return {
      byId: byId || [],
      allIds: list || []
    };
  },
  transform: function transform(byId) {
    return Object.keys(byId || {}).reduce(function (prev, id) {
      return prev.concat(byId[id]);
    }, []);
  }
};
var _default = proxy;
exports.default = _default;