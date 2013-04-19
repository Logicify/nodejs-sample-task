MOCHA = ./node_modules/.bin/mocha
test:
    @NODE_ENV=test $(MOCHA) \
        -r should \
        -R spec
test-cov:lib-cov
    @APP_COV=1 $(MOCHA) \
        -r should \
        -R html-cov > coverage.html
lib-cov:
    @jscoverage --encoding=utf8 --no-highlight lib lib-cov
.PHONY: test test-cov