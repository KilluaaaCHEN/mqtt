<?php
/**
 * Created by PhpStorm.
 * User: Killua Chen
 * Date: 2019-11-09
 * Time: 22:56
 */

$redis = new \Redis();
$redis->connect('127.0.0.1', 6379);
$redis->auth('admin888');

$topic_list = ['project1/user/13090', 'project1/user/13020', 'project1/room/666', 'project1/broadcast'];
$count = count($topic_list) - 1;
for ($i = 0; ; $i++) {
    $topic = $topic_list[rand(0, $count)];
    $redis->publish($topic, json_encode(['type' => 'php', 'msg' => '来之PHP的消息' . $i], JSON_UNESCAPED_UNICODE));
    echo $i . ':  ' . $topic . ' ' . PHP_EOL;
    usleep(100000);
}