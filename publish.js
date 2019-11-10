var redis = require("redis");
var client = redis.createClient(63790, "127.0.0.1");
client.auth('admin888');
var i = 0;
setInterval(function () {
    i++;
    client.publish("chat", "{'type':'text','msg':'Hello World!  " + i + "'}");
    console.log("第" + i + "次");
}, 1);
