#!/usr/bin/env -S make -f

MAKEFLAGS += --warn-undefined-variable
MAKEFLAGS += --no-builtin-rules
MAKEFLAGS += --silent

-include Makefile.*

SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
.DEFAULT_GOAL := help

help: Makefile  ## Show help
	for makefile in $(MAKEFILE_LIST)
	do
		@echo "$${makefile}"
		@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' "$${makefile}" | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'
	done


# =============================================================================
# Common
# =============================================================================
install:  ## Install deps and tools
	yarn install
	yarn run playwright install --with-deps
	pre-commit install --install-hooks
.PHONY: install

update:  ## Update deps and tools
	yarn upgrade
	pre-commit autoupdate
.PHONY: update

browser:  ## Launch browser with extensions loaded
	dotenvx run -- google-chrome \
		--no-first-run \
		--disable-gpu \
		--load-extension="${PWD}/dist" \
		--no-sandbox \
		--remote-debugging-port=9222
.PHONY: browser

run:  ## Run browser with development server
	dotenvx run -- yarn run concurrently \
		--kill-others \
		--kill-signal SIGKILL \
		--raw \
		"yarn run dev" \
		"$(MAKE) browser"
.PHONY: run


# =============================================================================
# CI
# =============================================================================
ci: generate lint test e2e-test  ## Run CI tasks
.PHONY: ci

generate:  ## Generate codes from schemas

.PHONY: generate

format:  ## Run autoformatters
	yarn run prettier --list-different --write .
	yarn run eslint --fix .
.PHONY: format

lint: generate  ## Run all linters
	yarn run prettier --check .
	yarn run eslint .
	yarn run tsc --noEmit
.PHONY: lint

test: generate  ## Run tests
	yarn run test
.PHONY: test

build: generate
	yarn run build
.PHONY: build

e2e-test: build  ## Run e2e tests
	yarn run e2e --update-snapshots
.PHONY: e2e-test

docs:  ## Generate dev documents

.PHONY: docs


# =============================================================================
# Handy Scripts
# =============================================================================
clean:  ## Remove temporary files
	rm -rf coverage/ junit.xml .svelte-kit/ dist/ .tmp/ playwright-report/ dummy-non-existing-folder/
	find . -path '*/__snapshots__*' -delete
	find . -path "*.log*" -delete
.PHONY: clean
