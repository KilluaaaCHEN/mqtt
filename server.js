var mosca = require('mosca');

// var ascoltatore = {
//     //using ascoltatore
//     type: 'mongo',
//     url: 'mongodb://localhost:27017/mqtt',
//     pubsubCollection: 'ascoltatori',
//     mongo: {}
// };

var settings = {
    port: 1883,
    // backend: ascoltatore
};

var server = new mosca.Server(settings);

/*server.on('clientConnected', function (client) {
    console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', function (packet, client) {
    console.log('Published', packet.payload.toString());
});*/


server.on('subscribe', function (channel, username) {
    console.log(channel, username);
});
server.on('ready', setup);

function setup() {
    console.log('Mosca server is up and running...');

    //开始订阅Redis频道
    var redis_cli = require("redis").createClient(63790, "127.0.0.1");
    redis_cli.auth('admin888');
    redis_cli.on("ready", function () {
        //订阅消息
        redis_cli.PSUBSCRIBE(['chat*']);
        console.log("Redis Server Subscribe is running...");
    });

    //启动mqtt server后,创建mqtt链接实例用于publish消息
    var mqtt_cli = require('mqtt').connect('mqtt://127.0.0.1:1883');

    redis_cli.on("message", function (channel, message) {
        mqtt_cli.publish(channel, message);
        console.log("Redis Message: ", channel, message);
    });

    redis_cli.on("pmessage", function (parrten, channel,message) {
        mqtt_cli.publish(channel, message);
        console.log("Redis Message: ", channel, message);
    });
}