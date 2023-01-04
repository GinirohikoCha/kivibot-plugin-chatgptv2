function useOnAdminCmd (plugin, config) {
    plugin.onAdminCmd('/chatgpt', (e, params) => {
        const [cmd, value] = params

        if (cmd === 'setEmail' && value) {
            config.email = value
            plugin.saveConfig(config)

            return e.reply('账号配置完成，请继续配置密码', false)
        }

        if (cmd === 'setPassword' && value) {
            config.password = value
            plugin.saveConfig(config)

            return e.reply('密码配置完成，重载插件生效', false)
        }

        if (cmd === 'googleLogin' && value) {
            config.isGoogleLogin = value === 'on'
            plugin.saveConfig(config)

            return e.reply(`已${config.isGoogleLogin ? '开启' : '关闭'} 谷歌登录，重载插件生效`, false)
        }

        if (cmd === 'at' && ['on', 'off'].includes(value)) {
            config.enableAt = value === 'on'
            plugin.saveConfig(config)

            return e.reply(`已${config.enableAt ? '开启' : '关闭'} at 触发，重载插件生效`, false)
        }

        if (cmd === 'prefix' && value) {
            config.cmdPrefix = value
            plugin.saveConfig(config)

            return e.reply('已修改命令触发前缀，重载插件生效', true)
        }

        const cmds = ['/chatgpt setkey <apiKey>', '/chatgpt at on/off', '/chatgpt prefix <触发前缀>']

        return e.reply(cmds.join('\n'), true)
    })
}

module.exports = { useOnAdminCmd }
