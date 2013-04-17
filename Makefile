FixPath = $(subst /,\,$1)

NODE_MODULES := ./node_modules/.bin/

test:
   set APP_COV=0
   $(call FixPath, NODE_MODULES)mocha --require should --reporter spec tests

test-cov: app-cov
     set APP_COV=1
     $(call FixPath, NODE_MODULES)mocha --reporter html-cov > coverage.html tests
app-cov:
    rm -rf book-cov
    rm -rf coverage.html
    @jscoverage book book-cov

.PHONY: test test-cov