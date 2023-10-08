#!/usr/bin/env bash

hooks_dir='./.devcontainer/postStartCommand'

# Run user hook scripts
if [ -d "${hooks_dir}" ]
then
    find "${hooks_dir}" -maxdepth 1 -type f -name '*.sh' -exec "{}" \;
fi
