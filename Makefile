.PHONY: build test publish

test: build
	npm test

publish: test
	npm publish
