
MOCHA_OPTS=tests
REPORTER = spec

check: test

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
        --require should\
		--reporter $(REPORTER) \
		$(MOCHA_OPTS)


test-cov: lib-cov
	@APP_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
	@jscoverage book book-cov

clean:
	rm -f coverage.html
	rm -fr book-cov

.PHONY: test clean