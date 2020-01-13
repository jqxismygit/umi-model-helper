import { Proxy } from '../index';

//一次遍历找出所有子节点的children

const build = (workspace, current) => {
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

const buildRelationShip = (node, map) => {
  const children = map[node.id];
  children &&
    children.forEach((element) => {
      buildRelationShip(element, map);
    });
  node.children = children;
  return node;
};

const proxy: Proxy<any> = {
  normalize: (list) => {
    const normalized = (list &&
      list.reduce(
        (prev, c) => {
          if (c && c.id) {
            prev.byId[c.id] = c;
            prev.workspace = build(prev.workspace, c);
          }
          return prev;
        },
        { byId: {}, workspace: {} }
      )) || { byId: {}, workspace: {} };
    return {
      byId: normalized.byId,
      allIds: normalized.workspace.roots.map((i) =>
        buildRelationShip(i, normalized.workspace.childMap)
      )
    };
  },
  transform: (byId) => {
    const normalized = Object.keys(byId || {}).reduce(
      (workspace, id) => build(workspace, byId[id]),
      {}
    );
    return normalized.workspace.roots.map((i) =>
      buildRelationShip(i, normalized.workspace.childMap)
    );
  }
};

export default proxy;
