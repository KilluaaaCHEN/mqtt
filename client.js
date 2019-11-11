var mqtt = require('mqtt');
var auth = require('./auth');

process.stdout.write("请输入您的UID:");
process.stdin.on('data', (input) => {
    var uid = input.toString().trim();
    if (uid === '') {
        uid = Math.random().toString();
    }

    var clientId = auth.md5('client_id@' + uid + Date.now());
    var username = uid;
    var client = mqtt.connect('mqtt://127.0.0.1:1883', {
        clientId: clientId,
        username: username,
        password: auth.sign(clientId, username)
    });

    client.on('connect', function () {
        console.log('MQTT 连接成功...');
        client.subscribe('project1/user/' + username);//订阅私聊消息
        client.subscribe('project1/room/666');//订阅某房间消息
        client.subscribe('project1/broadcast');//订阅广播消息
    });

    client.on('message', function (topic, message) {
        console.log(topic, message.toString());
    });

});