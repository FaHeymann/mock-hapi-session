.PHONY: build test publish

build:
	npm run build

test: build
	npm test

publish: test
	npm publish
