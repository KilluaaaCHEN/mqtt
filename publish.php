<?php
/**
 * Created by PhpStorm.
 * User: Killua Chen
 * Date: 2019-11-09
 * Time: 22:56
 */

$redis = new \Redis();
$redis->connect('127.0.0.1', 63790);
$redis->auth('admin888');
for ($i = 0; ; $i++) {
    $redis->publish('chat', json_encode(['type' => 'php', 'msg' => '来之PHP的消息' . $i], JSON_UNESCAPED_UNICODE));
    echo $i . PHP_EOL;
    usleep(1);
}