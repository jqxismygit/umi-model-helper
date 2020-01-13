//一次遍历找出所有子节点的children
var build = function build(workspace, current) {
  //初始化
  if (!workspace.roots) {
    workspace.roots = [];
  }

  if (!workspace.childMap) {
    workspace.childMap = {};
  }

  if (current.parentId) {
    if (workspace.childMap[current.parentId]) {
      workspace.childMap[current.parentId].push(current);
    } else {
      workspace.childMap[current.parentId] = [current];
    }
  } else {
    if (!workspace.childMap.hasOwnProperty(current.id)) {
      workspace.childMap[current.id] = [];
    }

    workspace.roots.push(current);
  }

  return workspace;
};

var buildRelationShip = function buildRelationShip(node, map) {
  var children = map[node.id];
  children && children.forEach(function (element) {
    buildRelationShip(element, map);
  });
  node.children = children;
  return node;
};

var proxy = {
  normalize: function normalize(list) {
    var normalized = list && list.reduce(function (prev, c) {
      if (c && c.id) {
        prev.byId[c.id] = c;
        prev.workspace = build(prev.workspace, c);
      }

      return prev;
    }, {
      byId: {},
      workspace: {}
    }) || {
      byId: {},
      workspace: {}
    };
    return {
      byId: normalized.byId,
      allIds: normalized.workspace.roots.map(function (i) {
        return buildRelationShip(i, normalized.workspace.childMap);
      })
    };
  },
  transform: function transform(byId) {
    var normalized = Object.keys(byId || {}).reduce(function (workspace, id) {
      return build(workspace, byId[id]);
    }, {});
    return normalized.workspace.roots.map(function (i) {
      return buildRelationShip(i, normalized.workspace.childMap);
    });
  }
};
export default proxy;