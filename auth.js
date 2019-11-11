exports.md5 = function (text) {
    return require('crypto').createHash('md5').update(text).digest('hex');
}
exports.sign = function (client_id, username) {
    var salt = 'd299443ac974ec4a165e05635d69a0b6';//加密盐
    return this.md5(client_id + username + salt);
}