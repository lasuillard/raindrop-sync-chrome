#!/usr/bin/env bash

curl -sL https://sentry.io/get-cli/ | sh

pipx install dotenv-cli

sudo chown -R "$(id -u):$(id -g)" ~/.config/google-chrome
