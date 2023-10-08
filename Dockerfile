ARG NODE_VERSION=20.1.0

FROM node:${NODE_VERSION}-bullseye-slim AS workspace

SHELL ["/bin/bash", "-c"]

# Install core tools
RUN apt-get update && apt-get install --no-install-recommends -y \
    curl \
    fonts-noto \
    git \
    gnupg2 \
    make \
    python3-pip \
    #checkov:skip=CKV2_DOCKER_1:Allow `sudo` for dev environment
    sudo \
    xvfb \
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
    && rm -rf /var/lib/apt/lists/*

# Allow to use `sudo` without password
RUN echo "user ALL=(ALL:ALL) NOPASSWD: ALL" >> /etc/sudoers.d/user

# Add Google APT repository
RUN curl -fsSL https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | tee /etc/apt/sources.list.d/chrome.list

# Install core tools
RUN apt-get update && apt-get install --no-install-recommends -y \
    google-chrome-stable \
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
    && rm -rf /var/lib/apt/lists/*

# Create workspace user
ARG UID="1000"
ARG GID="1000"
ARG WORKSPACE="/workspace"

WORKDIR "${WORKSPACE}"

# Install dev tools
COPY requirements.txt ./
RUN pip3 install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r requirements.txt

RUN groupdel -f node && userdel -fr node \
    && groupadd --gid "${GID}" user \
    && useradd  --system --uid "${UID}" --gid "${GID}" --create-home user --shell /bin/bash \
    && chown -R user:user "${WORKSPACE}" /home/user

USER user:user

ENV NODE_ENV="development"
ENV PUPPETEER_CACHE_DIR="/home/user/.cache/puppeteer"

VOLUME ["${WORKSPACE}/node_modules"]

COPY --chown=user:user package.json package-lock.json ./
RUN npm ci --include=dev

# Extra workspace persistency
VOLUME ["${HOME}/.config/google-chrome"]

HEALTHCHECK NONE
