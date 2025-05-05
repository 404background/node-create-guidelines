module.exports = function(RED) {
    function ExampleNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        const greeting = config.greeting || RED._('example-node.greeting_default');

        node.on('input', function(msg) {
            msg.payload = greeting;
            node.send(msg);
        });
    }
    RED.nodes.registerType('example-node', ExampleNode);
};
