var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://127.0.0.1:1883');

client.on('connect', function () {
    client.subscribe('chat/user/123');
});

client.on('message', function (topic, message) {
    console.log(message.toString());
});