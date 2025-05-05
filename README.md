# Node Create Guidelines

Guidelines for Creating Nodes for Node-RED

## About This Project

This project includes a sample node (`example-node`) that adheres to the recommended structure for Node-RED node development. It serves as a reference implementation for creating well-structured and localized nodes.

## Project Structure

```
node-create-guidelines/  
├── README.md                # This document  
├── package.json             # Package settings including "node-red.nodes" field  
├── docs/                    # Development guides  
│   ├── folder-structure.md  # Folder structure guide  
│   ├── node-definition.md   # Node definition template explanation  
│   └── publishing.md        # NPM publishing steps  
├── node/                    # Template implementation directory for nodes  
│   ├── <node-name>/         
│   │   ├── <node-name>.js   # Runtime implementation template  
│   │   ├── <node-name>.html # Editor UI definition template  
│   │   └── locales/         # i18n dictionary folder (recommended)  
│   └── index.js             # Entry point for registering all nodes  
├── manifest.json            # Required configuration file for MCU nodes  
└── examples/                # Sample flows (JSON)  
```

## Documentation

For more detailed information, please refer to the `docs/` folder, which includes:

- `folder-structure.md`: Details on the recommended project structure.
- `node-definition.md`: Guidelines for defining Node-RED nodes.
- `publishing.md`: Steps for publishing to NPM and updating versions.
