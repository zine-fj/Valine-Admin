# Valine Admin


使用 LeanCloud 存储你的评论数据，在 LeanEngine 云引擎上管理你的评论，包括邮件通知和垃圾评论标记。

这是用于 [Valine 评论](https://valine.js.org/) 的后台管理，可以部署到你的 LeanCloud。它可以帮你完成：

- 完善的邮件通知
  - 收到评论后, 通知站长
  - 游客被 @ 通知
- 邮件模板定制
- 评论管理

## 更新历史
* 6.14 添加自定义邮件服务器功能. [点击查看](https://github.com/zhaojun1998/Valine-Admin#自定义邮件服务器)

**升级 FAQ**
1. 原先使用老版本的需要在后台部署最新代码 : 
![](https://cdn.jun6.net/201806070911_388.png)

2. 然后在设置中重新 [配置环境变量](https://github.com/zhaojun1998/Valine-Admin#部署)

3. 重启容器


## 演示

**游客 A 评论，站长收到邮件 :** 


![](https://cdn.jun6.net/201806062247_695.png)

![](https://cdn.jun6.net/201806062252_327.png)

**游客被 @ 收到的邮件 :**

![](https://cdn.jun6.net/201806062250_552.png)

![](https://cdn.jun6.net/201806062255_490.png)


> 分别为默认主题和 `rainbow` 彩虹主题

## 前置工作

配置 Valine 评论，我这里就不再多说了，请参考 [Valine 文档](https://valine.js.org/quickstart/)。


## 食用方法
虽然 Valine 是无后端的，但为了实现邮件通知，还是要进行些许操作。

### 部署

填写代码库并保存：`https://github.com/zhaojun1998/Valine-Admin`  

![](https://cdn.jun6.net/201804211508_545.png)
切换到部署标签页，分支使用 master，点击部署即可：
![](https://cdn.jun6.net/201801112055_212.png)
![](https://cdn.jun6.net/201804211336_271.png)
然后默默等待部署完成。

### 配置

此外，你需要设置云引擎的环境变量以提供必要的信息，点击云引擎的设置页，设置如下信息：
![](https://cdn.jun6.net/201806062257_798.png)

#### 必选参数 

* `SITE_NAME` : 网站名称。
* `SITE_URL` : 网站地址, **最后不要加 `/` 。**
* `SMTP_USER` : SMTP 服务用户名，一般为邮箱地址。
* `SMTP_PASS` : SMTP 密码，一般为授权码，而不是邮箱的登陆密码，请自行查询对应邮件服务商的获取方式
* `SMTP_SERVICE` : 邮件服务提供商，支持 `QQ`、`163`、`126`、`Gmail`、`"Yahoo"`、`......`，全部支持请参考 : [Nodemailer Supported services](https://nodemailer.com/smtp/well-known/#supported-services)。
* `SENDER_NAME` : 寄件人名称。

#### 可选参数

* `TO_EMAIL` : 指定站长收信邮箱，默认值为 `SITE_USER`。用于 SMTP 发件人与站长收件人不一致的情况下使用。
* `TEMPLATE_NAME` : 指定主题，默认值为 `default`，可选值为 `rainbow`，即上方演示的彩虹样式，此配置会去寻找 `template\{TEMPLATE_NAME}` 目录下的 `notice.ejs ` 与 `send.ejs` 模板文件，分别用于通知站长和通知游客，另外欢迎提供邮件主题样式。


#### 自定义邮件服务器
如 `SMTP_SERVICE` 中没有你使用的邮件服务提供商, 也可以进行自定义。

**注: 配置自定义邮件服务器的话，请不要同时配置 `SMTP_SERVICE`。当 `SMTP_SERVICE` 未配置时才会启用自定义邮件服务**

参数配置如下:

* `SMTP_HOST` : 邮件服务提供商 SMTP 地址，如 qq : `smtp.qq.com`，*此项需要自行查询或询问其服务商*。
* `SMTP_PORT` : 邮件服务提供商 SMTP 端口, *此项需要自行查询或询问其服务商*。
* `SMTP_SECURE` : 是否启用加密, 默认为 `true`，一般不需要设置，如有特殊请自行配置。 *此项需要自行查询或询问其服务商*。

    

#### 配置域名

现在后台可以浏览和删除留言列表, 预计会添加 `在线编辑 HTML 模板` 与 `测试 SMTP 服务配置` 功能。
![](https://cdn.jun6.net/201801112118_120.png)

后台登录需要账号密码，需要在这里设置，只需要填写 `email`、`password`、`username`，这三个字段即可，使用 `usernmae` 或 `email` 登陆即可。
![](https://cdn.jun6.net/201801112133_467.png)

#### 重启容器

注意修改配置后需要重启容器或才能生效。

![](https://cdn.jun6.net/201801112133_955.png)


## LeanCloud 休眠策略

免费版的 LeanCloud 容器，是有强制性休眠策略的，不能 24 小时运行：

* 每天必须休眠 6 个小时
* 30 分钟内没有外部请求，则休眠。
* 休眠后如果有新的外部请求实例则马上启动（但激活时此次发送邮件会失败）。

分析了一下上方的策略，如果不想付费的话，最佳使用方案就设置定时器，每天 7 - 23 点每 20 分钟访问一次，这样可以保持每天的绝大多数时间邮件服务是正常的。

附 `Linux crontab` 定时器代码：

```bash
*/20 7-23 * * * curl https://你配置的域名前缀.leanapp.cn
```

注 : 此 `crontab` 不是`LeanCloud` 后台的定时任务，如果你没有 `Linux` 机器来配置此定时器，那么可以在此 [issues](https://github.com/zhaojun1998/Valine-Admin/issues/1) 中回复我，我帮你加上。

## 本地运行

**以下内容仅用于 LeanEngine 开发，普通用户无需理会**

首先确认本机已经安装 [Node.js](http://nodejs.org/) 运行环境和 [LeanCloud 命令行工具](https://leancloud.cn/docs/leanengine_cli.html)，然后执行下列指令：

```
$ git clone https://github.com/zhaojun1998/Valine-Admin.git
$ cd Valine-Admin
```

安装依赖：

```
npm install
```

登录并关联应用：

```
lean login
lean switch
```

启动项目：

```
lean up
```

之后你就可以在 [localhost:3000](http://localhost:3000) 访问到你的应用了。

## 部署到 LeanEngine

部署到预备环境（若无预备环境则直接部署到生产环境）：
```
lean deploy
```



项目原作者 : https://github.com/panjunwen/Valine-Admin

Valine 项目 :  https://valine.js.org
