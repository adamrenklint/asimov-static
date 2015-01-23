var libPath = '../../lib/';
var DependencyParser = require(libPath + 'parsers/DependencyParser');
var Model = require(libPath + 'core/Model');
var Test = require(libPath + 'runner/Test');
var _ = require('lodash');

Test.run('parsers/DependencyParser', function (test) {

  var instance;

  test.beforeEach(function () {
    instance = new DependencyParser();
  });

  test.afterEach(function () {
    instance.destroy();
  });

  test.spec('parse ()', function () {

    test.it('should throw an error', function () {

      expect(function () {
        instance.parse();
      }).to.throw(Error);
    });
  });

  test.spec('assertAttributes (object attributes, string raw)', function () {

    test.when('attributes is not an object', function () {

      test.itShould.throwError('invalid model', function () {
        instance.assertAttributes(null, 'foo');
      });
    });

    test.when('attributes.path is not a string', function () {

      test.it('should throw an error', function () {

        expect(function () {
          instance.assertAttributes({}, 'foo');
        }).to.throw(Error);
      });
    });

    test.when('raw is not a string',  function () {

      test.when('attributes.raw is a string', function () {

        test.it('should return attributes.raw', function () {

          var attributes = {
            'path': 'foo/bar',
            'raw': 'fooo'
          };
          var result = instance.assertAttributes(attributes);
          expect(result).to.equal('fooo');
        });
      });

      test.when('attributes.raw is not a string', function () {

        test.it('should throw an error', function () {

          expect(function () {
            instance.assertAttributes({
              'path': 'foo/bar'
            });
          }).to.throw(Error);
        });
      });
    });

    test.when('raw is a string', function () {

      test.it('should retun raw', function () {

        var result = instance.assertAttributes({
          'path': 'foo/bar'
        }, 'foo');
        expect(result).to.equal('foo');
      });
    });
  });

  test.spec('add (object model, string path, object dependencies)', function () {

    test.when('model is not a valid model', function () {

      test.it('should throw an error', function () {

        var dependencies = new Model();
        expect(function () {
          instance.add({}, 'foo', dependencies);
        }).to.throw(Error);
      });
    });

    test.when('path is not a string', function () {

      test.it('should throw an error', function () {

        var model = new Model();
        var dependencies = new Model();
        expect(function () {
          instance.add(model, null, dependencies);
        }).to.throw(Error);
      });
    });

    test.when('dependencies is not a valid model', function () {

      test.it('should throw an error', function () {

        var model = new Model();
        expect(function () {
          instance.add(model, 'null');
        }).to.throw(Error);
      });
    });

    test.when('valid options are provided', function () {

      test.when('model is not already registered as a dependency of path', function () {

        test.it('it should add model as a dependency of path', function () {

          var model = new Model({
            'id': 'foo',
            'bar': 'baz'
          });
          var watcherModel = new Model();

          var UsableClass = DependencyParser.extend({
            'parse': function () {}
          });
          instance = new UsableClass();

          var path = 'foo/bar/baz/boo';
          instance.add(model, path, watcherModel);
          var deps = watcherModel.get(process.cwd() + '/' + path);
          var found = _.find(deps, function (dep) {
            return dep.id = model.id;
          });
          expect(found.id).to.equal(model.id);
        });
      });

      test.when('model is already registered as a dependency of path', function () {

        test.it('it should not add model again', function () {

          var model = new Model({
            'id': 'foo',
            'bar': 'baz'
          });
          var watcherModel = new Model();

          var UsableClass = DependencyParser.extend({
            'parse': function () {}
          });
          instance = new UsableClass();

          var path = 'foo/bar/baz/boo';
          instance.add(model, path, watcherModel);
          instance.add(model, path, watcherModel);
          instance.add(model, path, watcherModel);
          instance.add(model, path, watcherModel);
          instance.add(model, path, watcherModel);
          var deps = watcherModel.get(process.cwd() + '/' + path);
          var found = _.filter(deps, function (dep) {
            return dep.id === model.id;
          }) || [];
          expect(found.length).to.equal(1);
          expect(deps.length).to.equal(1);
        });
      });
    });
  });
});