module.exports = function(RED) {
    function ExampleNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        const greeting = config.greeting || RED._('example-node.greeting_default');

        node.on('input', function(msg, send, done) {
            // Node-RED 0.x compatibility
            send = send || function() { node.send.apply(node, arguments); };
            done = done || function(err) { if (err) { node.error(err, msg); } };

            msg.payload = greeting;
            send(msg);
            done();
        });
    }
    RED.nodes.registerType('example-node', ExampleNode);
};
