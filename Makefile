test:
	@npm test

publish-beta:
	@npm test && npm publish && make tag

publish:
	@npm test && npm publish --tag beta && make tag

tag:
	@git tag "v$(shell node -e "var config = require('./package.json'); console.log(config.version);")"
	@git push --tags
