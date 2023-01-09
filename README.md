# Chatgpt-v2 for KiviBot

[![npm-version](https://img.shields.io/npm/v/kivibot-plugin-chatgptv2?color=10a37f&label=kivibot-plugin-chatgptv2&style=flat-square)](https://npm.im/kivibot-plugin-chatgptv2)
[![dm](https://shields.io/npm/dm/kivibot-plugin-chatgptv2?color=10a37f&style=flat-square)](https://npm.im/kivibot-plugin-chatgptv2)

[`KiviBot`](https://beta.kivibot.com) 的 [Chatgpt](https://openai.com/blog/chatgpt/) 插件v2版本，调用官方GPT-3模型更精准，但需要更「科学」的网络环境和更复杂的配置。

由于Chatgpt访问量过大，官方加了Cloudflare进行访问保护，可能会遇到需要间隔一段时间就需要进行 CAPTCHA 验证的情况，在官方提供API之前本项目依然处于不稳定的状态。

**前置需求**

+ 已安装谷歌浏览器
+ Nodejs 最低版本 18
+ 全局科学上网/配置代理服务

**安装**

```shell
/plugin add chatgptv2
```

**启用**

```shell
/plugin on chatgptv2
```
启用后框架会打开Google Chrome浏览器并自动进入chatgpt对话页面，可能会遇见 CAPTCHA 验证失败的情况，手动完成验证进入下个页面即可；使用过程中请勿关闭浏览器页面。

**使用**

```shell
%帮我写一段Java代码
@bot 帮我写一段Java代码
```

**指令**

```shell
# 设置邮箱
/chatgpt setEmail <email>
# 设置密码
/chatgpt setPassword <password>
# 设置启用/停用谷歌登录
/chatgpt googleLogin <on/off>
# 设置启用/停用 @ 触发
/chatgpt at <on/off>
# 设置触发的前缀
/chatgpt prefix <prefix>
```

**配置**

编辑 `框架目录/data/plugins/chatgptv2/config.json` 文件。

```
{
    // ChatGPT 账号
    email: '',
    password: '',
    // 是否用谷歌账号登录（为true时上方为关联的谷歌账号邮箱）
    //（使用谷歌账号登录可避免复杂的机器人验证）
    isGoogleLogin: false,
    // 代理服务 格式 <ip>:<port>，无需代理的情况下留空
    // 以v2ray为例 'socks5://127.0.0.1:10808'
    proxyServer: '',
    // 是否开启 at 触发
    enableAt: true,
    // 触发命令前缀
    cmdPrefix: '%'
}
```

然后使用以下命令重载插件生效。

```shell
/plugin reload chatgptv2
```

**已知问题**
+ 非美国的「科学上网」容易导致在继续话题的情况中发生 429（频繁访问） 错误，目前只能通过换更好的网络环境解决。
+ 根据网络状况和登录时长可能会多次进行 CAPTCHA 验证。chatgpt-api推荐有财力的订阅下面的框架：
  + nopecha - 使用AI来验证 CAPTCHAS （用魔法打败魔法！） 更快且更便宜
  + 2captcha - 使用人工来验证 CAPTCHAS 更精准，不易产生问题
  + 以上两种方式兼容api直接配置密钥，会在稍后的更新中添加配置字段
+ OpenAI 在加强模型的伦理性上有很强的趋势，很多魔法例如让AI变为猫娘的语句已经受到了约束，目前可以通过更改语句细节和重试来获得更满意的结果，但未来会如何发展不得而知
