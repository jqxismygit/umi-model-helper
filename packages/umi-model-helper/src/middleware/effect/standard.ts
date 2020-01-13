//这个middle是非常重要的middle
const StandardEffectMiddleware = context => result => next => {
  const { response } = context;
  if (response) {
    const { code, data } = response;
    if (code === 200 || code === 0) {
      
    }
  }
};
