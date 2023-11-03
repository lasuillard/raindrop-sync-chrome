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
install:  ## Install the app locally
	pnpm install
.PHONY: install

init:  ## Initialize project repository
	git submodule update --init
	pre-commit autoupdate
	pre-commit install --install-hooks --hook-type pre-commit --hook-type commit-msg
.PHONY: init

browser:  ## Launch browser with extensions loaded
	dotenv google-chrome --no-first-run --disable-gpu --load-extension="${PWD}/dist" --no-sandbox
.PHONY: browser

run:  ## Run browser with development server
	dotenv pnpm exec concurrently \
		--kill-others \
		--kill-signal SIGKILL \
		--raw \
		"pnpm run dev" \
		"$(MAKE) browser"
.PHONY: run


# =============================================================================
# CI
# =============================================================================
ci: generate lint scan test benchmark e2e-test  ## Run CI tasks
.PHONY: ci

generate:  ## Generate codes from schemas

.PHONY: generate

format:  ## Run autoformatters
	pnpm exec prettier --list-different --write .
	pnpm exec eslint --fix .
.PHONY: format

lint: generate  ## Run all linters
	pnpm exec prettier --check .
	pnpm exec eslint .
	pnpm exec tsc --noEmit
.PHONY: lint

scan:  ## Run all scans
	checkov --quiet --directory .
.PHONY: scan

test: generate  ## Run tests
	pnpm run test
.PHONY: test

benchmark:  ## Run benchmarks

.PHONY: benchmark

e2e-test: generate  ## Run e2e tests
	pnpm run build
	pnpm run e2e
.PHONY: e2e-test

benchmark:  ## Run benchmarks

.PHONY: benchmark

docs:  ## Generate dev documents

.PHONY: docs


# =============================================================================
# Handy Scripts
# =============================================================================
clean:  ## Remove temporary files
	rm -rf coverage/ junit.xml .svelte-kit/ dist/ .tmp/
	find . -path '*/__snapshots__*' -delete
	find . -path "*.log*" -delete
.PHONY: clean
