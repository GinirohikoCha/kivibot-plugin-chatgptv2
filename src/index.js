const { KiviPlugin } = require('@kivibot/core')
const { version } = require('../package.json')

const plugin = new KiviPlugin('ChatGPTv2', version)

const { config } = require('./config')
const { useOnAdminCmd } = require("./admin")

// session map
const sessionMap = new Map()

const msgs = {
    needConfig: `ChatGPT: 请先配置账号密码`,
    apiError: 'ChatGPT: API 请求异常，可能是 apiKey 错误，请查看日志'
}

plugin.onMounted(async bot => {
    const { ChatGPTAPIBrowser } = await import('chatgpt')

    plugin.saveConfig(Object.assign(config, plugin.loadConfig()))
    // onAdminCmd
    useOnAdminCmd(plugin, config)

    if (!config.email || !config.password) {
        await bot.sendPrivateMsg(plugin.mainAdmin, msgs.needConfig)
        return plugin.log(msgs.needConfig)
    }

    const api = new ChatGPTAPIBrowser({
        email: config.email,
        password: config.password,
        isGoogleLogin: config.isGoogleLogin,
        proxyServer: config.proxyServer || undefined
    })

    const apiResult = await api.initSession()
    plugin.debug('apiResult:' + apiResult)

    plugin.onMessage(async event => {
        const { message, raw_message } = event

        // 消息符合命令前缀
        const isCmd = raw_message.trim().startsWith(config.cmdPrefix)
        // Bot 被艾特
        const isAt = message.some(e => e.type === 'at' && e.qq === bot.uin)
        // 触发条件（符合命令前缀，或者在启用艾特触发时，Bot 被艾特）
        const isHit = isCmd || (config.enableAt && isAt)

        // 过滤不触发的消息
        if (!isHit) {
            return
        }

        const reg = /((换个?话题)|([说讲聊]点?(别|(其他))的))/
        const shouldChangeContext = raw_message.match(reg)

        // 过滤更新会话消息
        if (shouldChangeContext) {
            sessionMap.delete(getSessionId(event))
            return event.reply('好的，让我们重新开始。', true)
        }

        plugin.debug('sessionMap:')
        plugin.debug(sessionMap.keys())
        plugin.debug(sessionMap.values())
        const session = getSession(event)
        plugin.debug('session:' + JSON.stringify(session))

        const question = raw_message
            .replace(new RegExp(`^\\s*${config.cmdPrefix}`), '')
            .replace(new RegExp(`@${bot.nickname}`, 'g'), '')
            .trim()

        plugin.debug('question:' + question)

        let res;

        if (session) {
            res = await api.sendMessage(question, session.option)
        } else {
            res = await api.sendMessage(question)
        }

        plugin.debug('res:' + JSON.stringify(res))

        const { response, conversationId, messageId } = res

        const newSession = {
            option: { conversationId, parentMessageId: messageId },
            time: Date.now()
        }
        sessionMap.set(getSessionId(event), newSession)
        plugin.debug('sessionMap:')
        plugin.debug(sessionMap.keys())
        plugin.debug(sessionMap.values())

        await event.reply(response, true)
    })
})

function getSessionId(event) {
    switch (event.message_type) {
        case 'private':
            return event.sender.user_id
        case 'group':
            return event.group_id
        case 'discuss':
            return event.discuss_id
    }
}

function getSession(event) {
    const id = getSessionId(event)
    const now = Date.now()

    let session = sessionMap.get(id)

    if (session) {
        const tenMinutesMs = 1000 * 60 * 10
        const isTimeout = now - session.time >= tenMinutesMs

        if (isTimeout) {
            sessionMap.delete(id)
            return undefined
        }
    }

    return session
}

module.exports = { plugin }
