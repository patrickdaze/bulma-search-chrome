# Versioning / Building / Publishing

To publish a new version, update the version in `manifest.json`, create a new git tag `v#.#.#` and push to master. A GitHub action will automatically build the extension, create a release on GitHub, and publish to the Chrome Web Store.
