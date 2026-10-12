# MCU Node Guide (Node-RED MCU Edition)

Lessons from building nodes for [Node-RED MCU Edition](https://github.com/phoddie/node-red-mcu) on the Moddable SDK
(node-red-contrib-mcu-dualshock4, node-red-contrib-mcu-hid, node-red-contrib-mcu-serial, node-red-mcu-mcp23017).
The basics of the MCU runtime file are in [node-definition.md](node-definition.md#nodes-for-node-red-mcu-edition).

## Project Layout

```
node-red-contrib-mcu-<name>/
├── package.json             # node-red.nodes: editor-side files; "files" whitelist
├── manifest.json            # MCU modules of the nodes + include of native/manifest.json
├── node/
│   └── <type>/
│       ├── <type>.js        # Editor-side definition (createNode only)
│       ├── <type>_mcu.js    # MCU runtime
│       ├── <type>.html      # Editor UI
│       └── locales/         # en-US / ja: <type>.json, <type>.html (help)
├── native/                  # Shared classes, XS in C, per-board settings
│   ├── manifest.json
│   └── sdkconfig/<target>/sdkconfig.defaults
├── test/
│   ├── moddable/            # Moddable SDK project without Node-RED (main.js + manifest.json)
│   └── ...                  # Node.js tests of the MCU modules (npm test)
├── examples/                # Sample flows
└── docs/                    # Usage, specification (en / ja)
```

- Name node types with a prefix that will not collide with other packages (`mcu-hid-config`, `mcu-hid-keyboard`), and name the files after the type: Node-RED finds `locales/<lang>/<type>.json` and the help by the file name.
- The editor-side `<type>.js` only calls `RED.nodes.createNode`; the node does nothing on PC Node-RED.

## Design Patterns

- **Shared hardware → configuration node + singleton.** One class in `native/` owns the device (Bluetooth, USB, a bus); the configuration node starts it and the other nodes `attach()` to it. Only one configuration can own the hardware: keep the first one (`owner`) and report `use only one <config>` when a second one has different settings.
- **One `Timer.repeat`** in the shared class polls the hardware and drives queues. Notify the nodes through listeners (`connect`, `disconnect`, `state`, `data`, `error`).
- **Status from the configuration node.** `attach(node)` sets the node's status for each state, and shows the start error in red. MCU status texts are not translated: write them in short English.
- **Do not send at start-up**, and do not put status in `msg` (`msg._status`): use `this.status()`.
- **Queue output that takes time** (typing, sending frames) and call `done()` when it has finished, then `send(msg)` so flows can chain. Report failures with `done(error)`.
- **Optional features as separate modules.** Load them with `Modules.has(specifier)` / `Modules.importNow(specifier)` (include `$(MODDABLE)/modules/base/modules/manifest.json` in a Moddable-only test; node-red-mcu includes it). A board that lacks the feature then reports an error instead of failing the build.
- **Freeze constant tables** (`Object.freeze`, recursively for nested objects). Preloaded modules keep them in flash, and the build stops printing `not frozen` warnings. A module-level `let` (singleton) gives a `no const` warning; that is expected.
- **Objects made at module level of a preloaded module are read-only (in ROM).** Passing one to `status()`, `send()` or `JSON.stringify` aborts XS with `read only value (in stringify)`: pass a copy (`{ ...STATUS[state] }`). A module-level `Map` / `Set` cannot be written: declare `let cache;` and create it on first use (`cache ??= new Map`). Module-level code such as `Date.now()` runs at build time.
- **Return errors from native functions, do not throw**: a throw also stops in xsbug. JavaScript turns the returned message into `this.error()` / status.

## manifest.json

- Module names without extensions. A `.c` file listed under `"*"` is compiled as native code; give it a base name different from the JavaScript module (`hid_usb.js` + `hid_usb_native.c`).
- Do not include `$(MODDABLE)/examples/manifest_base.json` in the node's manifest (the application includes it). A Moddable-only test project includes it.
- Do not put `moddable_manifest` in the node's `.html` defaults or in example flows. Moddable's `mcmanifest.js` reads it from the flow: a `{"git": ...}` include clones the repository on every build and includes the package twice (it fails offline and for private repositories). node-red-mcu-plugin already finds the package's `manifest.json`.
- Include everything the MCU files import. Do not rely on modules such as `pins/digital` being there: build for the target to check.
- **`platforms` match the build target**, not the chip: `-p esp32/xiao_esp32s3` matches `"esp32/xiao_esp32s3"`, then `"esp32"`, then `"..."`. List the targets a chip-specific feature supports, and end with `"...": { "error": "..." }` for unsupported platforms.
- A platform block can `include` other manifests, which keeps per-feature files small (`native/ble/manifest.json`, `native/usb/manifest.json`).
- **ESP-IDF components** (component manager) are added with `dependency` inside an `esp32` platform block. `namespace` defaults to `espressif`. Header directories of the component (other than `include/`) and of components it depends on are not on the include path: add them with their own entry and `includes`.
  ```json
  "platforms": {
      "esp32": {
          "dependency": [
              { "name": "esp_tinyusb", "version": "^1.4.0" },
              { "name": "tinyusb", "includes": ["src"] }
          ]
      }
  }
  ```
- **`build.SDKCONFIGPATH` replaces the board's sdkconfig** (the base `xsProj-<chip>` defaults are still merged). For a board with its own settings (flash size, PSRAM: XIAO ESP32S3, M5Stack Core2, ...) copy the board's `sdkconfig.defaults` into the node's file, one directory per target, and set it in that target's platform block.
- BLE GATT services go in `"ble": { "*": ["./bleservices/*"] }` next to an include of `$(MODDABLE)/modules/network/ble/manifest_server.json`.

## Editor

- Show what the user has to check before building in the edit dialog with `form-tips`: supported boards, required build options, wiring. Put the same in the help.
- Use `oneditprepare` to show tips that depend on a setting (for example, notes for USB only when USB is selected) and trigger the change handler once so the dialog opens in the right state.
- Give every setting with a format a `validate` function. An optional setting validates the empty value as well (omit `required`).
- Write the connection / pairing steps in the configuration node's help, in the README and in the usage docs.

## Chip and Board Notes (ESP32)

- Bluetooth Classic is only on the original ESP32, and Moddable needs a patch to keep its memory (see node-red-contrib-mcu-dualshock4).
- USB device (HID, ...) needs the USB OTG of the ESP32-S2 / S3. The C3 / C6 / H2 have only USB Serial/JTAG.
- On the ESP32-S3 the USB OTG and USB Serial/JTAG share one PHY. Starting TinyUSB moves the port to OTG: on single-port boards (XIAO ESP32S3) the serial log, xsbug and the Node-RED MCU debug connection stop. Build without debugging, and enter the bootloader (BOOT + RESET) to write again.
- Node-RED MCU plugin builds are debug builds unless none of the debug options is selected.

## Testing

1. **Node.js tests** of the MCU modules: strip the `import` lines, pass mocks (`Timer`, `Modules`, the transport) and run the class with `new Function(...)`. Run them with `npm test`.
2. **Build without a board**: `mcconfig -m -p <target> -t build` (add `-d` for a debug build). Build every supported target, including the "BLE only" / fallback ones. Check that native symbols are linked with `xtensa-esp32s3-elf-nm build/xs_esp32.elf`.
3. **Moddable-only test project** (`test/moddable`) on the board, without Node-RED: isolates the native part.
4. **Node-RED MCU** with the sample flow on the board. Without a board, the flow can run in the Moddable simulator (`mcconfig -d -m -p lin`, `mcsim`) with the hardware replaced by mocks and an xsbug stand-in on port 5002; with `"config": {"noderedmcu": {"editor": true}}` the runtime reports each node's status, warnings, errors and debug output there.
5. **Example flows** in their own tab with `"_mcu": {"mcu": true}` on the tab and the nodes, so an import is an MCU flow straight away.
6. **Editor**: install the package into a Node-RED 4 user directory and check `/nodes` (templates, help) and `/locales/<module>/<type>` with `Accept-Language: ja`.

Note in the README and commit what was verified on hardware and what was only built.
