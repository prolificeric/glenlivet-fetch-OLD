test:
	@node_modules/.bin/mocha --reporter spec --require should --growl

test-watch:
	@node_modules/.bin/mocha --reporter spec --require should --growl --watch

test-cov:
	GLENLIVET_FETCH_COV=1 node_modules/.bin/mocha --reporter html-cov --require should > coverage.html

test-coveralls:
	GLENLIVET_FETCH_COV=1 node_modules/.bin/mocha --reporter mocha-lcov-reporter --require should | node_modules/.bin/coveralls

.PHONY: all test