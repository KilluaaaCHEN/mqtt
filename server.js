var mosca = require('mosca');
var auth = require('./auth');

// var ascoltatore = {
//     //using ascoltatore
//     type:'mongo',
//     url:'mongodb://localhost:27017/mqtt',
//     pubsubCollection:'ascoltatori',
//     mongo:{}
// };

var mqtt_port = 1883;

var SECURE_KEY = __dirname + '/ssl/wechat.killuachen.com.key';
var SECURE_CERT = __dirname + '/ssl/wechat.killuachen.com.crt';

var settings = {
    port: mqtt_port,
    maxInflightMessages: 10240, //设置单条消息的最大长度,超出后服务端会返回
    secure: {
        port: 2883,
        keyPath: SECURE_KEY,
        certPath: SECURE_CERT,
    },
    //设置WebSocket参数
    http: {
        port: 1884,
        bundle: true,
        static: './'
    },
    // backend:ascoltatore
};

var server = new mosca.Server(settings);

// 以下事件为回调事件,可忽略
server.on('clientConnected', function (client) {
    console.log('连接成功:', client.id);
});
server.on('subscribed', function (topic, client) {
    console.log('开始订阅:', client.id, topic);
});
server.on('unSubscribed', function (topic, client) {
    console.log('取消订阅:', client.id, topic);
});
server.on('clientDisConnected', function (client) {
    console.log('连接关闭:', client.id);
});

server.on('ready', function () {
    console.log('Mosca server is up and running...');

    var clientId = auth.md5('redis_client' + Date.now());
    var username = 'redis_mqtt';

    //开始认证MQTT
    server.authenticate = function (client, username, password, callback) {
        var authorized = (password != undefined && username != undefined && password.toString() === auth.sign(client.id, username));
        console.log('开始认证:', client.id, authorized ? '===> 认证成功' : '===> 认证失败');
        callback(null, authorized);
    };
    // 发布授权
    server.authorizePublish = function (client, topic, payload, callback) {
        //只能从Redis发布消息
        (client.id === clientId) && callback(null, true);
    };
    // 订阅授权 默认允许
    // server.authorizeSubscribe = function (client, topic, callback) {
    //     callback(null, true);
    // };

    //开始订阅Redis频道
    var redis_cli = require("redis").createClient(6379, "127.0.0.1");
    redis_cli.auth('admin888');
    redis_cli.on("ready", function () {
        redis_cli.PSUBSCRIBE(['project1*']);//订阅project1开头的频道
        console.log("Redis Server Subscribe is running...");
    });

    //启动mqtt server后,创建mqtt链接实例用于publish消息
    var mqtt_cli = require('mqtt').connect('mqtt://127.0.0.1:' + mqtt_port, {
        clientId: clientId,
        username: username,
        password: auth.sign(clientId, username)
    });

    redis_cli.on("pmessage", function (parrten, channel, message) {
        mqtt_cli.publish(channel, message);
    });
});