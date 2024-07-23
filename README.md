# Raindrop Sync for Chrome

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![CI](https://github.com/lasuillard/raindrop-sync-chrome/actions/workflows/ci.yaml/badge.svg)](https://github.com/lasuillard/raindrop-sync-chrome/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/lasuillard/raindrop-sync-chrome/graph/badge.svg?token=52rvoFBAEb)](https://codecov.io/gh/lasuillard/raindrop-sync-chrome)
![GitHub Release](https://img.shields.io/github/v/release/lasuillard/raindrop-sync-chrome)

Chrome browser extension for syncing bookmarks with Raindrop.

## 🚀 Getting Started

> ❗ This project is under development. Most of features may incomplete and buggy.

### 📦 Installing extension locally

The extension is not published to Chrome Web Store yet, here we describe how to install extension locally. Once most of core features implemented and stabilized, we will publish it to the Chrome Web Store.

1. Download the extension archive (`.zip`) file from [releases](https://github.com/lasuillard/raindrop-sync-chrome/releases).

2. Unzip the archive at location you want, and open up the Chrome browser.

3. Go to `chrome://extensions`.

4. Enable **Developer Mode**, toggle at the top-right corner.

    ![Chrome Manage Extensions Page](/docs/images/chrome-manage-extensions.png)

5. Click the **Load Unpacked** button and go to the directory you unzipped at prior step.

    ![Chrome Load Unpacked Extension](/docs/images/chrome-load-unpacked-extension.png)

6. Now you will see the extension in the list.

    ![Chrome Extension Installed](/docs/images/chrome-extension-installed.png)

7. Now extension is available for use.

> ‼️ Again, this project is at a early stage of development. Most of features incomplete and buggy, and possibly break your bookmarks due to poor implementation. Before use, we recommend having backup of your bookmarks list.

### 👟 Initializing application

1. Visit options page.

2. Go to **Settings** tab.

3. Go to Raindrop.io and create an integrations for this extension.

    ![Raindrop App Installation](/docs/images/raindrop-app-installation.png)

    The extension identifier in URL(`https://<EXTENSION_ID>.chromiumapp.org/`) may differ based on location of unpacked extension, so you need to replace it accordingly.

    Now, there are two ways of initializing application for use:

    ![RSFC Register App](/docs/images/rsfc-register-app.png)

    1. Simplest and recommended way is using test token. It never expires, Just click the **Create test token** in app settings in Raindrop and copy & paste (no need to click **Register**) it to extension settings' **Access Token** field.

    2. The other method is registering the extension as OAuth app using client ID and client secret. Copy and paste each value to settings and click **Register** to authorize application.
