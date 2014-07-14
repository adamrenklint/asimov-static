var libPath = '../../lib/';
var ScriptHandler = require(libPath + 'updaters/ScriptHandler');
var Collection = require(libPath + 'core/Collection');
var Test = require(libPath + 'runner/Test');
var _ = require('lodash');

Test.run('updaters/ScriptHandler', function (test) {

  var instance;

  test.beforeEach(function () {
    instance = new ScriptHandler({
      'pages': new Collection(),
      'templates': new Collection(),
      'scripts': new Collection()
    });
  });

  test.afterEach(function () {
    instance.destroy();
  });

  test.spec('modified (string path, array graph)', function () {

    test.when('graph contains a script', function () {

      test.when('the script matches the modified path', function () {

        test.it('should call fetch() on the script', function () {

          var modified = new instance.options.scripts.model({
            'path': '/foo/bar/script.js'
          });
          var spy = sinon.spy(modified, 'fetch');

          instance.modified('/foo/bar/script.js', [modified]);

          expect(spy).to.have.been.calledOnce;
          modified.fetch.restore();
        });
      });

      test.when('the styleSheet doesn\'t match the modified path', function (done) {

        test.it('should defer trigger "change:raw" on styleSheet', function (done) {

          var notModified = instance.options.scripts.create({
            'path': '/foo/bar/script.js'
          });

          instance.modified('/foo/bar22/script.js', [notModified]);

          notModified.on('change:raw', function () {
            done();
          });
        });
      });
    });
  });

  test.spec('deleted (string path, array graph)', function () {

    test.when('graph contains a script', function () {

      test.when('script matches the deleted path', function () {

        test.it('should call destroy() on the deleted script', function () {

          var deleted = new instance.options.scripts.model({
            'path': '/foo/bar/script.js'
          });
          var spy = sinon.spy(deleted, 'destroy');

          instance.deleted('/foo/bar/script.js', [deleted]);

          expect(spy).to.have.been.calledOnce;
          deleted.destroy.restore();
        });
      });

      test.when('script doesn\'t match the deleted path', function (done) {

        test.it('should defer trigger "change:raw" with script', function (done) {

          var notDeleted = instance.options.scripts.create({
            'path': '/foo/bar/script.js'
          });

          instance.deleted('/foo/bar/page.js', [notDeleted]);

          notDeleted.on('change:raw', function () {
            done();
          });
        });
      });
    });
  });
});