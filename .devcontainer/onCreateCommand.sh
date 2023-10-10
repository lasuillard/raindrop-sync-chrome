#!/usr/bin/env bash

hooks_dir='./.devcontainer/onCreateCommand'

apt update && apt install -y bash-completion

echo '
if [ -f /etc/bash_completion ]; then
    . /etc/bash_completion
fi
' >> ~/.bashrc

# Run user hook scripts
if [ -d "${hooks_dir}" ]
then
    find "${hooks_dir}" -maxdepth 1 -type f -name '*.sh' -exec "{}" \;
fi
