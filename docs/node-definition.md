# Node Definition Template Guide

This document explains how to define a Node-RED node using the provided templates, following the guidelines from the [Node-RED documentation](https://nodered.org/docs/creating-nodes).

## Naming Conventions
- Node names should be lowercase and use hyphens (`-`) to separate words (e.g., `example-node`).
- Avoid using underscores (`_`) or camelCase in node names.
- The name should clearly reflect the node's purpose.
- Do not rename a node type once it is published: flows that use it stop loading.

## General Guidelines
Nodes should:
- Be well-defined in their purpose. Avoid creating nodes that expose every possible option of an API. Instead, focus on the most commonly used and essential features to keep the node simple and user-friendly.
- Be simple to use, regardless of the underlying functionality. Hide complexity and avoid jargon.
- Be forgiving in what types of message properties they accept (e.g., strings, numbers, booleans, Buffers, objects, arrays, or nulls).
- Be consistent in what they send and document the properties they add to messages.
- Catch errors to prevent the entire flow from stopping. Register error handlers for any asynchronous calls.
- Support multiple instances of the same node in a flow. If necessary, use a configuration node to manage shared resources or common settings across multiple nodes.

## Runtime Implementation (`<node-name>.js`)
- Use `RED.nodes.createNode(this, config)` to initialize the node.
- Implement the node's functionality in the `on('input', function(msg, send, done) { ... })` handler.
  - Send with `send(msg)` and call `done()` when the message is handled, so Complete nodes work.
  - Report errors with `done(err)` only. Calling `node.error(err, msg)` as well triggers Catch nodes twice.
  - For Node-RED 0.x, fall back to `node.send` and `node.error` when `send` / `done` are missing (see `example-node.js`).
- Release timers, child processes, sockets and workers in `on('close', function(removed, done) { ... })`.
- Add status indicators using `node.status()` to provide feedback to the user.
- Resolve TypedInput values with `RED.util.evaluateNodeProperty(value, type, node, msg)` rather than reading `msg` / flow / global yourself: it handles context stores (`#:(file)::key`), `env`, `num`, `json` and the other types.
- Do not run long synchronous work (`spawnSync`, `execSync`, large file I/O) in the constructor: it blocks the whole runtime during deploy.
- Do not pass user input (editor settings, HTTP query, `msg`) to a shell. Spawn with an argument array and no `shell` option.
- Locate files of dependencies with `require.resolve(...)`, never with a path such as `../../node_modules/...`: npm hoists dependencies next to the package.
- Store data the node creates under `RED.settings.userDir`, not in the package folder, which npm replaces on update.

## Editor UI Definition (`<node-name>.html`)
- Define the node's properties and UI elements using `<script type="text/html">`.
- Use `RED.nodes.registerType()` to register the node and define its category, color, inputs, outputs, and defaults.
- Give `defaults` a `validate` function where a value must have a format (numbers, pins, addresses); the editor marks the node and warns on deploy.
- Put the help text in `locales/<lang>/<node-name>.html` (see below). Help written in `<node-name>.html` itself becomes the en-US help and hides `locales/en-US/<node-name>.html`.

## Internationalization
- Use the `locales/` folder next to the node's `.js` file to provide translations for the node's labels, help and messages: `locales/<lang>/<node-name>.json` and `locales/<lang>/<node-name>.html`.
- Keep the same keys in every language.
- Status texts may be locale keys (`node.status({ text: "example-node.status.ready" })`); the editor translates them.
- Follow the [Node-RED Internationalisation Guide](https://nodered.org/docs/creating-nodes/i18n) for best practices.

## Nodes for Node-RED MCU Edition
A node that runs on a microcontroller with [Node-RED MCU Edition](https://github.com/phoddie/node-red-mcu) has two runtime files.
Design patterns, native code, ESP-IDF components, per-board settings and testing are in [mcu-nodes.md](mcu-nodes.md).

| File | Runs on | Registered in |
|------|---------|---------------|
| `<node-name>.js` | Node-RED (editor side) | `package.json` → `node-red.nodes` |
| `<node-name>_mcu.js` | the MCU (XS / Moddable SDK) | `manifest.json` → `modules` and `preload` |

`example-node_mcu.js` is the MCU version of the example node. Points that differ from Node-RED:

- The MCU file is an ES module: `import { Node } from "nodered"`, `class ... extends Node`, and `RED.nodes.registerType(this.type, this)` in a `static {}` block.
- Call `super.onStart(config)` first in `onStart`; it connects the outputs.
- Messages arrive in `onMessage(msg, done)`. `onStop()` is never called: flows on the MCU do not stop.
- `RED._()` does not translate and `this._` does not exist. `console` only has `log`; use `trace()` or `this.warn()`.
- `RED.util.getMessageProperty` supports top-level properties only, and `RED.util.evaluateNodeProperty` is not available.
- `device.I2C.default` describes a bus (io constructor and pins); open it with `new device.io.SMBus({ ...device.I2C.default, address })` or `new device.I2C.default.io({ ...device.I2C.default, address })`.
- `manifest.json` lists module names without file extensions. Do not include `$(MODDABLE)/examples/manifest_base.json`; the node-red-mcu application includes it already.

```json
{
    "modules": {
        "example-node_mcu": "./node/example-node/example-node_mcu"
    },
    "preload": [
        "example-node_mcu"
    ]
}
```

## Examples
- Provide sample flows in the `examples/` folder to demonstrate the node's functionality. Node-RED lists them under Import → Examples.
- Include screenshots and import instructions in the `README.md` file.
