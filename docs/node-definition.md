# Node Definition Template Guide

This document explains how to define a Node-RED node using the provided templates, following the guidelines from the [Node-RED documentation](https://nodered.org/docs/creating-nodes).

## Naming Conventions
- Node names should be lowercase and use hyphens (`-`) to separate words (e.g., `example-node`).
- Avoid using underscores (`_`) or camelCase in node names.
- The name should clearly reflect the node's purpose.

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
- Implement the node's functionality in the `on('input', ...)` handler.
- Use `node.error()` to handle errors gracefully.
- Add status indicators using `node.status()` to provide feedback to the user.

## Editor UI Definition (`<node-name>.html`)
- Define the node's properties and UI elements using `<script type="text/html">`.
- Include help text and descriptions for each property.
- Use `RED.nodes.registerType()` to register the node and define its category, color, inputs, outputs, and defaults.

## Internationalization
- Use the `locales/` folder to provide translations for the node's labels and messages.
- Follow the [Node-RED Internationalisation Guide](https://nodered.org/docs/creating-nodes/internationalisation) for best practices.

## Examples
- Provide sample flows in the `examples/` folder to demonstrate the node's functionality.
- Include screenshots and import instructions in the `README.md` file.
