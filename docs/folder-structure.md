# Folder Structure Guide

This document explains the recommended folder structure for Node-RED node development projects.

## Recommended Structure

```
node-create-guidelines/  
├── README.md                # Main documentation  
├── package.json             # Package settings including "node-red.nodes" field  
├── manifest.json            # Required configuration file for MCU nodes  
├── node/                    # Template implementation directory for nodes  
│   ├── <node-name>/         
│   │   ├── <node-name>.js   # Runtime implementation template  
│   │   ├── <node-name>_mcu.js # Node-RED MCU runtime (MCU nodes only)  
│   │   ├── <node-name>.html # Editor UI definition template  
│   │   └── locales/         # i18n dictionary folder (recommended)  
│   └── index.js             # Entry point for registering all nodes  
├── examples/                # Sample flows (JSON)  
├── images/                  # Visual representations of sample flows  
├── docs/                    # Usage and specification (en / ja), optional  
└── test/                    # Tests (npm test), Moddable-only test project for MCU nodes  
```

MCU nodes also have a `native/` folder for shared classes, XS in C and per-board settings; see [mcu-nodes.md](mcu-nodes.md#project-layout).
Name each node folder and its files after the node type (`node/<type>/<type>.js`), so that Node-RED finds `locales/<lang>/<type>.json`.

This structure ensures clarity and maintainability for both developers and users.
