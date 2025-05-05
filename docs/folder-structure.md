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
│   │   ├── <node-name>.html # Editor UI definition template  
│   │   └── locales/         # i18n dictionary folder (recommended)  
│   └── index.js             # Entry point for registering all nodes  
├── examples/                # Sample flows (JSON)  
├── images/                  # Visual representations of sample flows  
```

This structure ensures clarity and maintainability for both developers and users.
