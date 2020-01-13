
const compose = (...funcs) => {
  return args => extend =>
    funcs.reduce((composed, f) => f(composed, extend), args);
};

export const applyEffectMiddleware = (...middlewares) => {};
