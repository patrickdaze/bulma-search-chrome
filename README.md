# Search for Bulma : Chrome Extension

An unofficial Chrome extension to search the [Bulma](https://bulma.io/) documentation.

This extension should work with most Chromium derived browsers including Avast Secure Browser, Blisk, Brave, Comodo Dragon, Microsoft Edge (recent versions), Yande, and more.

## Install

### Google Web Store

The Google Web Store installation not yet available but [is planned](https://github.com/patrickdaze/bulma-search-chrome/issues/1). For now the unpacked version can be installed.

### Install Unpacked

1. [Download](https://github.com/patrickdaze/bulma-search-chrome/archive/master.zip) or clone this repository to your desired location
2. Open the Extension Management page by navigating to `chrome://extensions`
3. Enable **Developer Mode** by clicking the toggle switch next to Developer mode
4. Click the **load unpacked** button and select the directory where this repository was cloned/downloaded (unzip the archive and select the folder)

### Updated Unpacked

1. Re-download/pull the latest version of this repository to the original install location
2. Open the Extension Management page by navigating to `chrome://extensions`
3. Click refresh beside the already installed extension

## Options

[A pull request](https://github.com/thomasedwards/bulmasearch/pull/1) is opened to provide deeper search results. Until it's merged into the main Bulma Search project the following credentials can be added to the extension's options page (`chrome://extensions` then **Details** then **Options**). The contents of this search index is provided by [a forked Bulma Search](https://github.com/patrickdaze/bulmasearch/tree/index-content).

```
Application ID: W95C6T7MO0
Application Key: 43107ef8232e4b438c5d1bf2b76916cb
```

## Usage

A search icon will appear in the main navigation of the Bulma documenation. Click it to toggle search.

## Footnotes

The Search for Bulma Chrome Extension project is not affiliated with Bulma and not developed by the core Bulma team. 

The search indexing and some of this project's UI code is provided by the [Bulma Search](https://github.com/thomasedwards/bulmasearch) project (code [MIT](https://choosealicense.com/licenses/mit/) / website [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)) via Algolia. The Bulma code is released with [MIT](https://choosealicense.com/licenses/mit/) and its website is released with [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
