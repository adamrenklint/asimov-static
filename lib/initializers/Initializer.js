var Base = require('../core/Base');
var _super = Base.prototype;

module.exports = Base.extend({

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.assert('function', self.run, 'Initializer class must implement a run method');
  }
});