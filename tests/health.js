var test = require('asimov-test');

test('health check', function (test) {

  test.integration('/health', function () {

    test.itShould.loadPage();
  });

  test.integration('/api/health', function () {

    test.itShould.loadPage();
  });
});