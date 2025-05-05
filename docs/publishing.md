# Publishing Guide

This document explains how to publish a Node-RED node to NPM and register it in the Flow Library.

## Steps to Publish
1. Log in to NPM:
   ```bash
   npm login
   ```
2. Publish the package:
   ```bash
   npm publish --access public
   ```

## Updating Versions

To update the version of your Node-RED node, you can use the following commands:

- For a major version update (e.g., v1.0.0 to v2.0.0):
  ```bash
  npm version major
  ```

- For a minor version update (e.g., v1.0.0 to v1.1.0):
  ```bash
  npm version minor
  ```

- For a patch version update (e.g., v1.0.0 to v1.0.1):
  ```bash
  npm version patch
  ```

After updating the version, commit the changes and tag the new version:

```bash
git add package.json
git commit -m "Bump version to x.y.z"
git tag vX.Y.Z
git push origin vX.Y.Z
```

Finally, publish the updated package to NPM:

```bash
npm publish --access public
```

## Flow Library Registration
- After publishing, register the node at [Flow Library](https://flows.nodered.org/add/node).
- Ensure the `README.md` and `package.json` meet the library's requirements.
