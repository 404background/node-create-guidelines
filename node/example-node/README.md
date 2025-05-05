# Example Node

The Example Node is a simple Node-RED node that outputs a greeting message. It is designed to demonstrate the basic structure and functionality of a Node-RED node.

## Features
- Outputs a configurable greeting message.
- Fully localized with support for English and Japanese.
- Easy to use and integrate into Node-RED flows.

## Configuration
- **Name**: A custom name for the node.
- **Greeting**: The message to output. Defaults to "Hello, World!".

## Sample Flow
A sample flow is provided in the `examples/` folder. The flow includes:
- An Inject node to trigger the Example Node.
- The Example Node configured with a default greeting message.
- A Debug node to display the output.

### Flow Diagram
The following images illustrate the sample flow:

- **English (en-US):**
  ![Sample Flow](https://raw.githubusercontent.com/404background/node-create-guidelines/main/images/example_en-US.png)

- **Japanese (ja):**
  ![サンプルフロー](https://raw.githubusercontent.com/404background/node-create-guidelines/main/images/example_ja.png)

When the Node-RED language is set to Japanese, the node's labels and placeholders will appear in Japanese.
