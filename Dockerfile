FROM node:20.8.0-bookworm-slim AS workspace

USER root:root

SHELL ["/bin/bash", "-c"]

# Install core tools
RUN apt-get update && apt-get install --no-install-recommends -y \
    curl \
    fonts-noto \
    git \
    gnupg2 \
    make \
    python3-pip \
    xvfb \
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
    && rm -rf /var/lib/apt/lists/*

# Add Google APT repository
RUN curl -fsSL https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor | apt-key add - \
    && echo 'deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main' | tee /etc/apt/sources.list.d/chrome.list

# Install core tools
RUN apt-get update && apt-get install --no-install-recommends -y \
    google-chrome-stable \
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
    && rm -rf /var/lib/apt/lists/*

ARG WORKSPACE="/workspace"

WORKDIR "${WORKSPACE}"

# Install dev tools
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt --break-system-packages

# Enable PNPM
RUN corepack enable && pnpm config set store-dir ~/.local/share/pnpm/store

# Install deps
COPY .npmrc package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

VOLUME ["${WORKSPACE}/node_modules"]

# For Devcontainer GPG forwarding
RUN rm -rf ~/.gnupg

RUN git config --system --add safe.directory "${WORKSPACE}"

HEALTHCHECK NONE
