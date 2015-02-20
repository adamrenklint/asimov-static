var asimov = require('asimov');
var _ = require('lodash');

function normalizeUrl (url) {
  url = url.split('?')[0];
  if (url.length > 1 && url[url.length - 1] === '/') {
    url = url.substr(0, url.length - 1);
  }
  return url;
}

function findModel (url) {
  if (!url) return;
  url = normalizeUrl(url);
  var collections = Object.keys(asimov.collections);
  var collection, model;
  while (collections.length) {
    collection = asimov.collections[collections.shift()];
    model = collection.get(url);
    if (model) collections = [];
  }
  return model;
}

var find = _.memoize(findModel);

function dirtyRenderCheckMiddleware (req, res, next) {

  asimov.requestData({
    'url': normalizeUrl(req.url)
  }, function (data) {
    next();
  });
}

function dirtyRenderCheckResponder (data, next) {
  
  var model = find(data.url);

  if (model && model.attributes.dirty) {
    asimov.queue.add(model);
    asimov.queue.prio(model.attributes.url, next.bind(null, data));
  }
  else {
    next(data);
  }
}

exports.middleware = dirtyRenderCheckMiddleware;
exports.responder = dirtyRenderCheckResponder;