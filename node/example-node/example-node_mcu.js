/*
 * example-node - Node-RED MCU runtime
 *
 * The same node for Node-RED MCU Edition. manifest.json registers this file;
 * package.json registers example-node.js for the Node-RED editor and runtime.
 */
import { Node } from "nodered";

/* RED._ does not translate on the MCU, so the default is written out */
const GREETING_DEFAULT = "Hello, World!";

class ExampleNode extends Node {
    #greeting;

    onStart(config) {
        super.onStart(config);     // resolves the wires; required before send()
        this.#greeting = config.greeting || GREETING_DEFAULT;
    }

    onMessage(msg, done) {
        msg.payload = this.#greeting;
        this.send(msg);
        done?.();
    }

    static type = "example-node";
    static {
        RED.nodes.registerType(this.type, this);
    }
}

export default ExampleNode;
