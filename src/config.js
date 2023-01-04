const config = {
    // ChatGPT 账号
    email: '',
    password: '',
    // 是否用谷歌账号登录（使用谷歌账号登录可避免复杂的机器人验证）
    isGoogleLogin: false,
    // 代理服务 格式 <ip>:<port>
    proxyServer: '',
    // 是否开启 at 触发
    enableAt: true,
    // 触发命令前缀
    cmdPrefix: '%'
}

module.exports = { config }
