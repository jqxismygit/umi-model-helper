//该算法时间复杂度是n,按层级深度先分类
var buildWorkspace = function buildWorkspace(workspace, current) {
  var depth = current && current.parentIds && current.parentIds.length || 0;

  if (!workspace[depth]) {
    workspace[depth] = {};
  }

  workspace[depth][current.id] = current;
  return workspace;
};

var buildTree = function buildTree(workspace) {
  var depth = workspace.length - 1;

  var _loop = function _loop(i) {
    Object.keys(workspace[i]).forEach(function (c) {
      var element = workspace[i][c]; // const parentId = element.parentIds[element.parentIds.length - 1];

      var parentId = element.parentIds[0];
      var parent = workspace[i - 1][parentId];

      if (parent) {
        if (parent.children) {
          parent.children.push(element);
        } else {
          parent.children = [element];
        }
      }
    });
  };

  for (var i = depth; i > 0; --i) {
    _loop(i);
  }

  if (workspace && workspace.length > 0) {
    return Object.keys(workspace[0]).reduce(function (prev, c) {
      return prev.concat(workspace[0][c]);
    }, []);
  } else {
    return [];
  }
};

var proxy = {
  normalize: function normalize(list) {
    var normalized = list && list.reduce(function (prev, c) {
      if (c && c.id) {
        prev.byId[c.id] = c;
        prev.workspace = buildWorkspace(prev.workspace, c);
      }

      return prev;
    }, {
      byId: {},
      workspace: []
    }) || {
      byId: {},
      workspace: []
    };
    return {
      byId: normalized.byId,
      allIds: buildTree(normalized.workspace)
    };
  },
  transform: function transform(byId) {
    var normalized = Object.keys(byId || {}).reduce(function (workspace, id) {
      return buildWorkspace(workspace, byId[id]);
    }, {});
    return buildTree(normalized.workspaces);
  }
};
export default proxy;