// TODO 配置参数、API抽离

window.onload = function() {
    //读取cookie数据重新赋值
    if (timezoneOffset !== '') {
        timezoneOffset = Number(timezoneOffset)
        clock(bg_autoMode)
        time_timer = setInterval('clock(' + bg_autoMode + ')', 60 * 1000)
    } else {
        getTimezoneOffset()
    }
    // rotation_mode 屏幕旋转标识
    if (rotation_mode !== '') {
        rotation_mode = Number(rotation_mode)
    } else {
        rotation_mode = rotation_mode_default
        setCookie('rotation_mode', rotation_mode, 30)
    }
    // 标识号退一再调用一次组件方法，实现组件的初始化
    rotation_mode = rotation_mode === 0 ? 3 : rotation_mode - 1
    rotateScreen()
        // hour24 时制标识
    if (hour24 !== '') {
        hour24 = hour24 === 'true' ? true : false
    } else {
        hour24 = hour24_default
        setCookie('hour24', hour24, 30)
    }
    // 顶部组件序号
    if (top_mode !== '') {
        top_mode = Number(top_mode)

        // 等价前两行
        // if (top_mode !== 0) {
        //     eval(TOP_MODE[top_mode] + '()')
        //     eval(TOP_MODE[top_mode] + '_timer = setInterval("TOP_MODE[top_mode]()", 60 * 1000 * 20)')
        //     document.getElementsByClassName(TOP_MODE[top_mode] + "_container")[0].style.display = 'block'
        // }
    } else {
        top_mode = top_mode_default
        setCookie('top_mode', top_mode, 30)
    }
    top_mode = top_mode === 0 ? TOP_MODE.length - 1 : top_mode - 1
    changeTopMode()
        // 底部组件序号
    if (bottom_mode !== '') {
        bottom_mode = Number(bottom_mode)
            // 等价前两行
            // if (bottom_mode !== 0) {
            //     eval(BOTTOM_MODE[bottom_mode] + '()')
            //     eval(BOTTOM_MODE[bottom_mode] + '_timer = setInterval("' + BOTTOM_MODE[bottom_mode] + '()", 60 * 1000 * 20)')
            //     document.getElementsByClassName(BOTTOM_MODE[bottom_mode] + "_container")[0].style.display = 'block'
            // }
    } else {
        bottom_mode = bottom_mode_default
        setCookie('bottom_mode', bottom_mode, 30)
    }
    bottom_mode = bottom_mode === 0 ? BOTTOM_MODE.length - 1 : bottom_mode - 1
    changeBottomMode()
        // 背景组件序号
    if (bg_mode !== '') {
        bg_mode = Number(bg_mode)
        bg_mode = bg_mode === 0 ? BG_MODE.length - 1 : bg_mode - 1
        changeBgMode()
    } else {
        bg_mode = bg_mode_default
        setCookie('bg_mode', bg_mode, 30)
    }

    // 绑定12/24小时制切换、横/竖屏切换事件
    addEvent(bg_autoMode) // autoMode

    // 时钟模块
    // clock(bg_autoMode)
    // time_timer = setInterval('clock(' + bg_autoMode + ')', 60 * 1000)

    // TODO 历史上的今天模块

    // 重写console.log方法，将控制台信息输出至页面，测试用
    // var logger = document.getElementById('log_container');
    // console.log(logger)
    // console.log = function(message) {
    //     if (typeof message == 'object') {
    //         logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
    //     } else {
    //         logger.innerHTML += message + '<br />';
    //     }
    // }
}

var ALAPI_TOKEN = 'pBsICqbRV2eVtGiI'
var UNSPLASH_ID = 'bXwWoUhPeVw-yvSesGMgaOENnlSzhHYB43kZIQOR8cQ'

// 组件容器
// TODO 添加组件刷新频率
var TOP_MODE = ['nonetop', 'hitokoto', 'poem', 'weibo']
var BOTTOM_MODE = ['nonebtm', 'weather']
var BG_MODE = ['none', 'dark', 'auto', 'pic']

// 默认配置项
var morningHour = 6 // 自动模式下夜晚结束时间
var nightHour = 19 // 自动模式下夜晚开始时间
var top_mode_default = 1 // 顶部组件默认序号，默认使用“一言”
var bottom_mode_default = 1 // 底部组件默认序号，默认使用“天气”
var bg_mode_default = 0 // 背景组件默认序号，默认使用白底
var rotation_mode_default = 0 // 默认使用0-竖屏模式 0=0°，1=90°，2=180°，3=270°
var hour24_default = false // 默认使用十二小时制
var bg_autoMode = false // 黑白背景自动切换
var weibo_num = 3 // 微博热搜条数
var cip = returnCitySN.cip // 客户端ip

// cookie变量
var top_mode = getCookie('top_mode') // 顶部组件序号，默认使用“一言”
var bottom_mode = getCookie('bottom_mode') // 底部组件序号，默认使用“天气”
var bg_mode = getCookie('bg_mode') // 背景组件序号，默认使用白底
var rotation_mode = getCookie('rotation_mode'); // 竖屏标识
var hour24 = getCookie('hour24'); // 24小时制
var timezoneOffset = getCookie('timezoneOffset'); // 时区偏移分钟

// 模块缓存数据
var hitokoto_data = null
var weibo_data = null
var poem_data = null
var weather_data = null
var pic_data = null

// 定时器
var hitokoto_timer = null // 一言模块定时器
var poem_timer = null // 每日诗词定时器
var weibo_timer = null // 微博模块定时器
var time_timer = null // 时钟模块定时器
var weather_timer = null // 天气模块定时器
var pic_timer = null // 图片背景模块定时器

// 天气模块图标
// 固定9种类型: xue、lei、shachen、wu、bingbao、yun、yu、yin、qing
var weaImgs = {
    xue: ['&#xe645;', '&#xe645;'],
    lei: ['&#xe643;', '&#xe643;'],
    shachen: ['&#xe646;', '&#xe646;'],
    wu: ['&#xe647;', '&#xe647;'],
    bingbao: ['&#xe667;', '&#xe667;'],
    yun: ['&#xe648;', '&#xe648;'],
    duoyun: ['&#xe648;', '&#xe648;'],
    yu: ['&#xe64b;', '&#xe64b;'],
    yin: ['&#xe64a;', '&#xe652;'],
    qing: ['&#xe649;', '&#xe764;'],
    weizhi: ['&#xe6f2;', '&#xe6f2;']
};

// 背景自动模式图标
var autoModeImg = '&#xe8e3'

/** 
 * 判断浏览器是否支持某一个CSS3属性 
 * @param {String} 属性名称 
 * @return {Boolean} true/false 
 * @version 1.0 
 * @author ydr.me 
 * 2014年4月4日14:47:19 
 */
function supportCss3(style) {
    var prefix = ['webkit', 'Moz', 'ms', 'o'],
        i,
        humpString = [],
        htmlStyle = document.documentElement.style,
        _toHumb = function(string) {
            return string.replace(/-(\w)/g, function($0, $1) {
                return $1.toUpperCase();
            });
        };

    for (i in prefix)
        humpString.push(_toHumb(prefix[i] + '-' + style));

    humpString.push(_toHumb(style));

    for (i in humpString)
        if (humpString[i] in htmlStyle) return true;

    return false;
}

function showScreenSize() {
    // 获取设备显示尺寸
    var w = document.documentElement.clientWidth || document.body.clientWidth;
    var h = document.documentElement.clientHeight || document.body.clientHeight;
    console.log(w, h)
    document.getElementById('screensize').innerHTML = '屏幕分辨率的宽：' + w +
        '</br>屏幕分辨率的高：' + h + '</br>getTimezoneOffset: ' + Boolean(new Date().getTimezoneOffset)
}

// 创建XMLHttpRequest对象
function createXHR() {
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xhr;
}

// 一言模块
function hitokoto() {
    console.log('hitokoto update')
    var xhr = createXHR();
    xhr.open('GET', 'https://v1.hitokoto.cn?encode=json&charset=utf-8', true);
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            hitokoto_data = JSON.parse(this.responseText)
            document.getElementById('brackets-l').innerHTML = "『"
            document.getElementById('brackets-r').innerHTML = "』"
            document.getElementById('hitokoto').innerHTML = hitokoto_data.hitokoto
            document.getElementById('from').innerHTML = hitokoto_data.from_who ? "「" + hitokoto_data.from + " " + hitokoto_data.from_who + "」" :
                "「" + hitokoto_data.from + "」"
        }
    }
    xhr.send(null);
}

// 每日诗词
function poem() {
    console.log('poem update')
    jinrishici.load(function(result) {
        poem_data = result.data
        var sentence = document.querySelector("#poem_sentence")
        var info = document.querySelector("#poem_info")
        sentence.innerHTML = poem_data.content
        info.innerHTML = '【' + poem_data.origin.dynasty + '】' + poem_data.origin.author + '《' + poem_data.origin.title + '》'
    });
}

// 获取所在时区
function getTimezoneOffset() {
    var xhr = createXHR();
    xhr.open('GET', 'https://worldtimeapi.org/api/ip', true);
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            timezoneOffset = JSON.parse(this.responseText).raw_offset / 60
            setCookie("timezoneOffset", timezoneOffset, 30)
            clock()
        }
    }
    xhr.send(null);
}

// 时钟模块
function clock(autoMode) {

    var date = new Date()

    var utc8DiffMinutes = date.getTimezoneOffset() + timezoneOffset // Kindle上new Date()为标准时间且getTimezoneOffset() === 0
    date.setMinutes(date.getMinutes() + utc8DiffMinutes)

    var MM = date.getMonth() + 1
    var dd = date.getDate()
    var day = date.getDay()
    var hour = date.getHours()
    var minutes = date.getMinutes()

    // 深浅色模式标示
    var lightMode = true

    // 自动模式
    if (autoMode) {
        // nightHour点后morningHour前启用深色模式
        if (hour > nightHour || hour < morningHour) {
            if (lightMode) {
                document.getElementsByClassName('page')[0].style.color = '#ffffff'
                document.getElementsByClassName('page')[0].style.backgroundColor = '#000000'
                lightMode = false
            }
        } else {
            if (!lightMode) {
                document.getElementsByClassName('page')[0].style.color = '#000000'
                document.getElementsByClassName('page')[0].style.backgroundColor = '#ffffff'
                lightMode = true
            }
        }
    }

    // 24小時制
    if (!hour24) {
        var apm = '上<br>午'
        if (hour > 12) {
            apm = '下<br>午'
            hour -= 12
        }

        document.getElementById('apm').innerHTML = apm
    } else {
        document.getElementById('apm').innerHTML = ''
    }

    var timeString = hour + ':' + ('0' + minutes).slice(-2)
    var dateString = MM + '月' + dd + '日'
    var weekList = ['日', '一', '二', '三', '四', '五', '六']
    var weekString = '星期' + weekList[day]

    document.getElementById("time").innerHTML = timeString
    document.getElementById("date").innerHTML = dateString + " " + weekString
}

function weather() {
    console.log('weather update')
    var xhr = createXHR();
    xhr.open('GET', 'https://v2.alapi.cn/api/tianqi?token=' + ALAPI_TOKEN + '&ip=' + cip, true);
    // xhr.open('GET', 'https://tianqiapi.com/free/day?appid=48353766&appsecret=VjZ4oxd5', true);
    // xhr.open('GET','https://tianqiapi.com/free/day?appid=48373524&appsecret=5iHwLsS8',true);
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            var data = JSON.parse(this.responseText)
            if (data.code === 200) {
                weather_data = data.data
                    // 获取天气图标信息
                var imgs = weaImgs[weather_data.weather_code]
                var img = imgs[0]
                var date = new Date()
                var utc8DiffMinutes = date.getTimezoneOffset() + 480
                date.setMinutes(date.getMinutes() + utc8DiffMinutes)
                var hour = date.getHours()
                    // nightHour后天气使用夜间天气图标
                if (hour > nightHour || hour < morningHour) {
                    img = imgs[1]
                }

                var weaImg = '<span class="iconfont">' + img + '</span>' + '<div>天气：' + weather_data.weather + '</div>';
                var weaTemp = '<div class="tempNum">' + weather_data.temp + '</div><div class="symbol">&#8451;</div>' +
                    '<div>当前气温</div>';
                var highTemp = weather_data.max_temp // 日间气温/最高气温
                var lowTemp = weather_data.min_temp // 夜间气温/最低气温
                var air = weather_data.aqi.air
                air = air ? air : '未知'
                var airLevel = weather_data.aqi.air_level // 空气质量，air_level为alapi独有
                airLevel = airLevel && air ? airLevel : ''
                var updateTime = weather_data.update_time.split(' ') // 更新时间，alapi格式为'年-月-日 时-分-秒'，tianqiapi格式为'时-分'
                updateTime = updateTime[updateTime.length - 1]
                var weaInfo = '<div>最高/低气温：' + highTemp + '/' + lowTemp + '&#8451;</div>' +
                    '<div>湿度：' + weather_data.humidity + '</div>' +
                    '<div>空气质量：' + air + airLevel + '</div>' +
                    '<div>风向：' + weather_data.wind + '</div>' +
                    '<div>风速：' + weather_data.wind_speed + ' ' + weather_data.wind_scale + '</div>' +
                    '<div>更新时间：' + updateTime + '</div>';
                document.getElementById('weaTitle').innerHTML = weather_data.city + '当前天气'
                document.getElementById('weaImg').innerHTML = weaImg
                document.getElementById('weaTemp').innerHTML = weaTemp
                document.getElementById('weaInfo').innerHTML = weaInfo
            } else {
                console.error('天气数据获取失败: ' + weather_data.msg)
                document.getElementById("weaTitle").innerHTML = '数据获取失败，请稍后再试～';
            }
        }
    }
    xhr.send(null);
}

// 微博热搜模块
function weibo() {
    console.log('weibo update')
    var xhr = createXHR();
    // xhr.open("GET", "http://api.tianapi.com/txapi/weibohot/index?num="+weibo_num+"&key=130dbb050d6326886a2c6d3b0a819405", true); // tianapi 免费接口：：单日100次
    xhr.open("GET", "https://v2.alapi.cn/api/new/wbtop?num=" + weibo_num, true); //
    xhr.setRequestHeader('token', ALAPI_TOKEN)
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            var data = JSON.parse(this.responseText);
            var weibo_title = document.getElementsByClassName("weibo_title")[0];
            var hot_word = document.getElementById("hot_word");
            var hot_word_num = document.getElementById("hot_word_num");
            if (data.code === 200) {
                // var hots = data.newslist; // tianapi
                weibo_data = data.data; // alapi
                weibo_title.innerHTML = "微博实时热搜";
                hot_word.innerHTML = "";
                hot_word_num.innerHTML = "";
                for (var i = 0; i < weibo_num; i++) {
                    var index = i + 1;
                    // hot_word.innerHTML += "<li>" + index + ". " + weibo_data[i].hotword + "</li>"; // tianapi
                    // hot_word_num.innerHTML += "<li>" + weibo_data[i].hotwordnum + "</li>"; // tianapi
                    hot_word.innerHTML += "<li>" + index + ". " + weibo_data[i].hot_word + "</li>"; // alapi
                    hot_word_num.innerHTML += "<li>" + weibo_data[i].hot_word_num + "</li>"; // alapi
                }
            } else {
                console.error('微博热搜数据获取失败: ' + data.msg)
                weibo_title.innerHTML = '数据获取失败，请稍后再试～';
            }
        }
    };
    xhr.send(null);
}

// 图片背景模块 目前API处于开发阶段，请求频率受限，每小时50次
function picture() {
    console.log('picture update');
    // var xhr = createXHR();
    // xhr.open('GET', 'https://api.unsplash.com/photos/random?client_id=' + UNSPLASH_ID, true);
    // xhr.onreadystatechange = function() {
    //     if (this.readyState == 4) {
    //         var data = JSON.parse(this.responseText)
    //         pic_data = data
    //         document.getElementsByClassName('page')[0].style.backgroundImage = 'url(' + pic_data.urls.regular + ')'
    //     }
    // }
    // xhr.send(null);

    // ACG picture
    // document.getElementsByClassName('page')[0].style.backgroundImage = 'url(https://v1.alapi.cn/api/acg)'
    // Bing picture
    // document.getElementsByClassName('page')[0].style.backgroundImage = 'url(https://v1.alapi.cn/api/bing)'
}

// 模块切换时销毁定时器，按需创建定时器，节约接口请求
// 组件更新策略：第一次切换组件将发送请求并缓存相应数据，之后切换组件直接从缓存读取数据并更新定时器
// 可能存在的问题：
// 如果在定时器周期内来回切换组件将因为重置定时器导致数据不会得到更新，
// 如要更新数据需使用当前组件超过定时器周期时长，或刷新页面

// 切换功能组件方法
function changeMode(pos) {
    // Kindle似乎对e事件接收存在问题，故需采用额外函数判断事件触发者
    // var pos
    //   console.log(e.path)
    //   for (var p of e.path) {
    //       var id = p.id
    //       if (id === 'top') {
    //           pos = id
    //           break
    //       } else if (id === 'bottom') {
    //           pos = id
    //           break
    //       }
    //   }
    console.log('# change ' + pos + ' mode')
    var pos_mode = eval(pos + '_mode')
    var POS_MODE = eval(pos.toUpperCase() + '_MODE')
    if (pos_mode !== 0 && eval(POS_MODE[pos_mode] + '_timer')) {
        clearInterval(eval(POS_MODE[pos_mode] + '_timer'))
        eval(POS_MODE[pos_mode] + '_timer = null')
        console.log(POS_MODE[pos_mode] + '_timer destroyed')
    }
    pos_mode++
    if (pos_mode === POS_MODE.length) pos_mode = 0
    eval(pos + '_mode = pos_mode')
    setCookie(pos + '_mode', pos_mode, 30)

    if (pos_mode !== 0) {
        if (!eval(POS_MODE[pos_mode] + '_data')) {
            eval(POS_MODE[pos_mode] + '()')
        }
        eval(POS_MODE[pos_mode] + '_timer = setInterval(POS_MODE[pos_mode] + "()", 60 * 1000 * 20)')
        console.log(POS_MODE[pos_mode] + '_timer created')
    }
    for (var i = 0; i < POS_MODE.length; i++) {
        document.getElementsByClassName(POS_MODE[i] + "_container")[0].style.display = 'none'
    }
    document.getElementsByClassName(POS_MODE[pos_mode] + "_container")[0].style.display = 'block'
}

function changeTopMode() {
    changeMode('top')
}

function changeBottomMode() {
    changeMode('bottom')
}

function rotateScreen() {
    console.log('# rotate screen ' + rotation_mode)

    var body = document.getElementsByTagName('body')[0]
    var page = document.getElementsByClassName("page")[0]
    var w = document.documentElement.clientWidth || document.body.clientWidth;
    var h = document.documentElement.clientHeight || document.body.clientHeight;
    if (rotation_mode === 0) {
        body.classList.add('rotate-90')
        body.style.height = w + "px"
        page.style.width = h + "px"
        page.style.height = w + "px"
    } else if (rotation_mode === 1) {
        body.classList.remove('rotate-90')
        body.classList.add('rotate-180')
        body.style.height = h + "px"
        page.style.width = w + "px"
        page.style.height = h + "px"
    } else if (rotation_mode === 2) {
        body.classList.remove('rotate-180')
        body.classList.add('rotate-270')
        body.style.width = h + "px"
        page.style.height = w + "px"
        page.style.width = "auto"
    } else if (rotation_mode === 3) {
        body.classList.remove('rotate-270')
        body.style.width = "auto"
        body.style.height = h + "px"
        page.style.width = w + "px"
        page.style.height = h + "px"
    }
    rotation_mode = rotation_mode === 3 ? 0 : rotation_mode + 1
    setCookie("rotation_mode", rotation_mode, 30)
}

function changeBgMode() {
    console.log('# change background')
    var page = document.getElementsByClassName('page')[0]
    var pageClasses = page.classList
    bg_mode = bg_mode === BG_MODE.length - 1 ? 0 : bg_mode + 1
    setCookie("bg_mode", bg_mode, 30)
    if (bg_mode === 0) {
        // light bg
        clearInterval(pic_timer)
        pic_timer = null
        pageClasses.remove('pic')
        console.log('picture close')
        pageClasses.add('light')
    } else if (bg_mode === 1) {
        // dark bg
        pageClasses.remove('light')
        pageClasses.add('dark')
    } else if (bg_mode === 2) {
        // auto bg
        var date = new Date()
        var utc8DiffMinutes = date.getTimezoneOffset() + 480
        date.setMinutes(date.getMinutes() + utc8DiffMinutes)
        var hour = date.getHours()
        if (hour > nightHour || hour < morningHour) {
            pageClasses.remove('light')
            pageClasses.add('dark')
        } else {
            pageClasses.remove('dark')
            pageClasses.add('light')
        }
        var icon = document.getElementById('light_dark_icon')
        var middle = document.getElementById('middle')
            // var iconClasses = icon.classList
            // var middleClasses = middle.classList
        icon.style.visibility = 'visible';
        middle.style.visibility = 'hidden';
        // iconClasses.add('fadein')
        // middleClasses.add('fadeout')
        // setTimeout(function() {
        //     iconClasses.remove('fadein')
        //     middleClasses.remove('fadeout')
        //     iconClasses.add('fadeout')
        //     middleClasses.add('fadein')
        // }, 1000)
        setTimeout(function() {
            // iconClasses.remove('fadeout')
            // middleClasses.remove('fadein')
            icon.style.visibility = 'hidden'
            middle.style.visibility = 'visible'
        }, 1000)
    } else {
        // picture bg
        console.log('picture open')
        if (!pic_data) {
            picture()
        }
        pic_timer = setInterval("picture()", 60 * 1000 * 60)
        pageClasses.remove('light')
        pageClasses.remove('dark')
        pageClasses.add('pic')
    }
}

function addEvent(autoMode) {
    document.getElementById("apmOuterWrapper").addEventListener('click', function() {
        console.log('hourCycle change')
        hour24 = !hour24
        setCookie('hour24', hour24, 30)
        clock(autoMode)
    })
    document.getElementsByClassName("time")[0].addEventListener('click', rotateScreen)
    document.getElementById("top").addEventListener('click', changeTopMode)
    document.getElementById("bottom").addEventListener('click', changeBottomMode)
    document.getElementById("date").addEventListener('click', changeBgMode)
}