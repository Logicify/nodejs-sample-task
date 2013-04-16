
    FixPath = $(subst /,\,$1)


NODE_MODULES := ./node_modules/.bin/

test: 
    $(call FixPath, NODE_MODULES)mocha --require should --reporter spec tests

.PHONY: test