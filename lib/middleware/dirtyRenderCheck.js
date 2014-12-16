var asimov = require('asimov');

function dirtyRenderCheckMiddleware (req, res, next) {

  if (req.url[req.url.length - 1] !== '/') return next();

  asimov.requestData({
    'url': req.url
  }, function (data) {
    next();
  });
}

function find (url) {
  var collections = Object.keys(asimov.collections);
  var collection, model;
  while (collections.length) {
    collection = asimov.collections[collections.shift()];
    model = collection.get(url);
    if (model) collections = [];
  }
  return model;
}

function dirtyRenderCheckResponder (data, next) {
  var model = find(data.url);

  if (model.attributes.dirty) {
    asimov.queue.add(model);
    asimov.queue.prio(model.attributes.url, next.bind(null, data));
  }
  else {
    next(data);
  }
}

exports.middleware = dirtyRenderCheckMiddleware;
exports.responder = dirtyRenderCheckResponder;