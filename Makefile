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

# Detect current environment is whether inside Docker container or not
CONTAINER := $(shell grep docker /proc/1/cgroup &>/dev/null && echo "1" || echo "$${CONTAINER:-}")

LOCBIN := ${PWD}/.bin
ifeq ($(CONTAINER), )
	PATH := ${LOCBIN}:${PATH}
endif


# =============================================================================
# Common
# =============================================================================

install:  ## Install the app locally
	if [ ! -z "${CONTAINER}" ]
	then
		echo 'Current environment is inside container thus install step is not necessary. Skipping it.'
		exit
	fi

	mkdir -p "${LOCBIN}"
	echo 'Some tools will be downloaded at "${LOCBIN}" unless already exists in system.'

	if command -v nodenv > /dev/null
	then
		echo '`nodenv` is found, downloading matching version.'
		nodenv install --skip-existing "$$(nodenv local)"
	else
		echo '`nodenv` not exists. Skip downloading Node matching project local version.'
	fi

	echo 'Downloading NPM packages.'
	npm install
.PHONY: install

init:  ## Initialize project repository
	git submodule update --init
	pre-commit autoupdate
	pre-commit install --install-hooks --hook-type pre-commit --hook-type commit-msg
.PHONY: init

run:  ## Run development server
	dotenv npm run dev -- --host
.PHONY: run


# =============================================================================
# CI
# =============================================================================
ci: generate lint test e2e-test scan  ## Run CI tasks
.PHONY: ci

generate:  ## Generate codes from schemas

.PHONY: generate

format:  ## Run autoformatters
	npx prettier --log-level debug --list-different --write .
	npx eslint --debug --fix .
.PHONY: format

lint: generate  ## Run all linters
	npx prettier --log-level debug --check .
	npx eslint --debug .
	npx tsc --noEmit
.PHONY: lint

test: generate  ## Run tests
	npm run test
.PHONY: test

e2e-test: generate  ## Run e2e tests
	npm run build
	npm run e2e
.PHONY: e2e-test

benchmark:  ## Run benchmarks

.PHONY: benchmark

scan:  ## Run all scans
	checkov -d .
.PHONY: scan

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

browser:  ## Launch Chrome browser with extensions loaded
	dotenv google-chrome --no-first-run --disable-gpu --load-extension="${PWD}/dist"
.PHONY: browser
