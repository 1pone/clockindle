## Kindle拯救计划 —— 你的Kindle实用工具网站

> 你的Kindle还好么？是否还藏在角落吃灰呢？赶紧拿出来擦一擦，与其闲置着不如让它成为一台墨水屏时钟，既实用又有格调。当然，它能做的远不止一台时钟...

### 如何使用 😛

​		现在就在你的Kindle浏览器中打开Kindle实用工具网站主页 https://1pone.github.io 吧！

<div align=center><img src="./images/index.png" alt="index.png" width="400"/><p>「 首页 」</p>
  </p></div>


### 一点技巧 🥳

​		为了让屏幕关闭自动锁屏保持常亮，请在Kindle主页搜索栏输入`~ds` 并回车，这时并不会有明显的反应，但是当你尝试按锁屏键时已无法锁屏，即已生效。当你想要恢复正常锁屏重启Kindle即可。

<div align=center><img src="https://github.com/1pone/1pone.github.io/raw/master/images/～ds.png" alt="～ds.png" width="400"/><p>「 输入 ～ds 保持屏幕常亮 」</p></div>

### 更多功能 🤩

​		你可以根据你的喜好需求选择 `模式` `功能` 对应下的路径，将至添加到主页 https://1pone.github.io 之后，即可访问相应页面，如，`深色模式` `时钟` 页面的路径为 https://1pone.github.io/clockDark ，路径省略时默认路径为`/index`，即 `浅色模式`，`一言 + 时钟 + 天气`功能。

|      功能模块      | 浅色模式路径 | 深色模式路径 | 自动模式路径 | 离线支持 | 完成 |
| :----------------: | :----------: | :----------: | :----------: | :------: | :--: |
| 一言 + 时钟 + 天气 |   `/index`   |   `/dark`    |   `/auto`    |    ✕     |  √   |
|        时钟        |   `/clock`   | `/clockDark` | `/clockAuto` |    √     |  √   |
| 微博热搜+时钟+天气 |   `/weibo`   | `/weiboDark` | `/weiboAuto` |    ✕     |  √   |
|     图片+时钟      |    `/pic`    |      ✕       |      ✕       |    ✕     |  √   |
|    一言 + 时钟     |   `/yiyan`   | `/yiyanDark` | `/yiyanAuto` |    √     |  ✕   |
|        ...         |     ...      |     ...      |     ...      |   ...    | ...  |

<div align=center><img src="https://github.com/1pone/1pone.github.io/raw/master/images/dark.png" alt="dark.png" width="400"/><p>「 深色模式 一言 + 时钟 + 天气 」</p></div>

****

<div align=center><img src="https://github.com/1pone/1pone.github.io/raw/master/images/clock.png" alt="clock.png" width="400"/><p>「 浅色模式 时钟 」</p></div>

****

<div align=center><img src="https://github.com/1pone/1pone.github.io/raw/master/images/clockDark.png" alt="clockDark.png" width="400"/><p>「 深色模式 时钟 」</p></div>

****

<div align=center><img src="https://github.com/1pone/1pone.github.io/raw/master/images/weibo.png" alt="weibo.png" width="400"/><p>「 浅色模式 微博热搜 + 时钟 + 天气 」</p></div>

****

<div align=center><img src="https://github.com/1pone/1pone.github.io/raw/master/images/weiboDark.png" alt="weiboDark.png" width="400"/><p>「 深色模式 微博热搜 + 时钟 + 天气 」</p></div>

****

<div align=center><img src="https://github.com/1pone/1pone.github.io/raw/master/images/pic.png" alt="pic.png" width="400"/><p>「  图片 + 时钟  」</p></div>



### 一点说明 😏

2. 时钟默认为12小时制，需要24小时制请在路径前添加`/24`，如24小时制浅色时钟路径为`/24/clock`
3. 自动模式根据当前时间自动切换深浅色模式，深色模式开启时间为晚上8点到早上6点。
4. 信息更新频率：时钟/1分钟，一言/1小时，天气/20分钟，微博热搜/20分钟，图片/1小时。
4. 离线支持的页面允许你打开网站后开启飞行模式并正常运作，这将更节省电量。
5. 当页面布局有偏差时请尝试手动刷新页面，当存在页面滚动条时请尝试双指捏合页面或手动刷新页面。
6. 由于当前天气查询接口为公用免费接口，可能存在因查询次数超过上限无法显示。

### 最后的话 😌

​		一个偶然的机会我在网上看到一个方法可以让Kindle摇身一变成为一台时钟，即用Kindle登陆 http://k.ilib.io/u/clock.html 网站，这让我兴奋不已，我吃灰已久的Kindle似乎要迎来第二春。然而当我在我的Kindle k7 k8 上打开网站发现网页排版存在一点点问题，在Kindle pw4上是正常的。我在查看网页源代码后发现网站并没有对不同分辨率的Kindle实现适配，kw4的分辨率有1072 * 1448，然而k7 k8只有600 * 800，于是我打算用我刚学且粗劣的前端开发知识为k7 k8单独写个时钟页面。写完之后我意识到这么一大块屏幕只用来显示时钟似乎有些浪费，要是再加点名人名言啊天气啊似乎会很不错，随着想到的功能越来越多，我意识到我可以把这当作自己的第一个小项目，再利用GitHub的page服务让大家的的泡面板都能迎来第二春。

​		网页的源码其实并不复杂，就是一些静态页面，甚至由于我的学艺不精可能略显拙劣，但是胜在实用。

​		感谢你阅读到最后，如果觉得我的网页还不错的话欢迎点个小星星🌟，如果有更好的建议或意见欢迎留言，我会尽可能答复；）

