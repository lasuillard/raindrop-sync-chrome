#!/usr/bin/env bash

curl -sL https://sentry.io/get-cli/ | sh

sudo apt-get update && sudo apt-get install -y \
    bash-completion

pipx install dotenv-cli
