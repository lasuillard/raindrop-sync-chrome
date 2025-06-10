#!/usr/bin/env bash

# pre-commit
pipx install pre-commit

# dotenvx
curl -sfS https://dotenvx.sh | sudo sh

sudo chown -R "$(id -u):$(id -g)" ~/.config/google-chrome
