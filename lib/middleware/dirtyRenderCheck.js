var asimov = require('asimov');

module.exports = function dirtyRenderCheckMiddleware (req, res, next) {

  if (req.url[req.url.length - 1] !== '/') return next();

  console.log('dirtyRenderCheckMiddleware', req.url)
  console.log(asimov.config('server.data'));
  next();
};
