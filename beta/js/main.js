var ALAPI_TOKEN = 'pBsICqbRV2eVtGiI'
var UNSPLASH_ID = 'bXwWoUhPeVw-yvSesGMgaOENnlSzhHYB43kZIQOR8cQ'

var TOP_MODE = ['nonetop', 'hitokoto', 'weibo']
var BOTTOM_MODE = ['nonebtm', 'weather']
var BG_MODE = ['none', 'dark', 'pic']

var top_mode = 1 // 顶部组件序号，默认使用“一言”
var bottom_mode = 1 // 底部组件序号，默认使用“天气”
var bg_mode = 0 // 背景组件序号，默认使用白底

var morningHour = 6 // 自动模式下夜晚结束时间
var nightHour = 19 // 自动模式下夜晚开始时间
var vertical = true // 竖屏标识
var hour24 = false // 24小时制
var bg_autoMode = false // 黑白背景自动切换
var weibo_num = 3 // 微博热搜条数
var cip = returnCitySN.cip // 客户端ip

var hitokoto_timer = null // 一言模块定时器
var weibo_timer = null // 微博模块定时器
var time_timer = null // 时钟模块定时器
var weather_timer = null // 天气模块定时器
var pic_timer = null // 图片背景模块定时器

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
    var xhr = createXHR();
    xhr.open('GET', 'https://v1.hitokoto.cn?encode=json&charset=utf-8', true);
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            var data = JSON.parse(this.responseText)
            document.getElementById('hitokoto').innerHTML = data.hitokoto
            document.getElementById('from').innerHTML = data.from_who ? "「" + data.from + " " + data.from_who + "」" :
                "「" + data.from + "」"
        }
    }
    xhr.send(null);
    document.getElementById('time').style.textAlign = 'center' // 强制剧中
}


// 时钟模块
function clock(autoMode) {

    var date = new Date()

    var utc8DiffMinutes = date.getTimezoneOffset() + 480 // Kindle上new Date()为标准时间且getTimezoneOffset() === 0
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


// 天气模块
// 固定9种类型: xue、lei、shachen、wu、bingbao、yun、yu、yin、qing
var weaImgs = {
    xue: ['&#xe645;', '&#xe645;'],
    lei: ['&#xe643;', '&#xe643;'],
    shachen: ['&#xe646;', '&#xe646;'],
    wu: ['&#xe647;', '&#xe647;'],
    bingbao: ['&#xe667;', '&#xe667;'],
    yun: ['&#xe648;', '&#xe648;'],
    yu: ['&#xe64b;', '&#xe64b;'],
    yin: ['&#xe64a;', '&#xe652;'],
    qing: ['&#xe649;', '&#xe764;'],
    weizhi: ['&#xe6f2;', '&#xe6f2;']
}

function getWea() {
    var xhr = createXHR();
    xhr.open('GET', 'http://v2.alapi.cn/api/tianqi?token=' + ALAPI_TOKEN + '&ip=' + cip, true);
    // xhr.open('GET', 'https://tianqiapi.com/free/day?appid=48353766&appsecret=VjZ4oxd5', true);
    // xhr.open('GET','https://tianqiapi.com/free/day?appid=48373524&appsecret=5iHwLsS8',true);
    xhr.onreadystatechange = function() {
        var data = JSON.parse(this.responseText)
        if (this.readyState == 4) {
            if (data.code === 200) {
                data = data.data
                console.log(data)
                    // 获取天气图标信息
                var imgs = weaImgs[data.weather_code]
                var img = imgs[0]
                var date = new Date()
                var utc8DiffMinutes = date.getTimezoneOffset() + 480
                date.setMinutes(date.getMinutes() + utc8DiffMinutes)
                var hour = date.getHours()
                    // nightHour后天气使用夜间天气图标
                if (hour > nightHour || hour < morningHour) {
                    img = imgs[1]
                }

                var weaImg = '<span class="iconfont">' + img + '</span>' + '<div>天气：' + data.weather + '</div>';
                var weaTemp = '<div class="tempNum">' + data.temp + '<div class="symbol">&#8451;</div></div>' +
                    '<div>当前气温</div>';
                var highTemp = data.max_temp // 日间气温/最高气温
                var lowTemp = data.min_temp // 夜间气温/最低气温
                var airLevel = data.air.air_level || '' // 空气质量，air_level为alapi独有
                var updateTime = data.update_time.split(' ') // 更新时间，alapi格式为'年-月-日 时-分-秒'，tianqiapi格式为'时-分'
                updateTime = updateTime[updateTime.length - 1]
                var weaInfo = '<div>最高/低气温：' + highTemp + '/' + lowTemp + '&#8451;</div>' +
                    '<div>湿度：' + data.humidity + '</div>' +
                    '<div>空气质量：' + data.air + airLevel + '</div>' +
                    '<div>风向：' + data.wind + '</div>' +
                    '<div>风速：' + data.wind_speed + ' ' + data.wind_scale + '</div>' +
                    '<div>更新时间：' + updateTime + '</div>';
                document.getElementById('weaTitle').innerHTML = data.city + '当前天气'
                document.getElementById('weaImg').innerHTML = weaImg
                document.getElementById('weaTemp').innerHTML = weaTemp
                document.getElementById('weaInfo').innerHTML = weaInfo
            }
        }
    }
    xhr.send(null);
}

// 微博热搜模块
function weibo() {
    var xhr = createXHR();
    xhr.open("GET", "https://v2.alapi.cn/api/new/wbtop", true);
    xhr.setRequestHeader('token', ALAPI_TOKEN)
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            var data = JSON.parse(this.responseText);
            var hots = data.data;
            var hot_word = document.getElementById("hot_word");
            var hot_word_num = document.getElementById("hot_word_num");
            hot_word.innerHTML = "";
            hot_word_num.innerHTML = "";
            for (var i = 0; i < weibo_num; i++) {
                var index = i + 1;
                hot_word.innerHTML += "<li>" + index + ". " + hots[i].hot_word + "</li>";
                hot_word_num.innerHTML += "<li>" + hots[i].hot_word_num + "</li>";
            }
        }
    };
    xhr.send(null);
}

// 图片背景模块 目前API处于开发阶段，请求频率受限，每小时50次
function picture() {
    var xhr = createXHR();
    xhr.open('GET', 'https://api.unsplash.com/photos/random?client_id=' + UNSPLASH_ID, true);
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            var data = JSON.parse(this.responseText)
            document.getElementsByClassName('page')[0].style.backgroundImage = 'url(' + data.urls.regular + ')'
        }
    }
    xhr.send(null);
    // ACG picture
    // document.getElementsByClassName('page')[0].style.backgroundImage = 'url(https://v1.alapi.cn/api/acg)'
    // Bing picture
    // document.getElementsByClassName('page')[0].style.backgroundImage = 'url(https://v1.alapi.cn/api/bing)'
}

// TODO 模块切换时销毁定时器，按需创建定时器，节约接口请求
function changeTopMode() {
    console.log('change top mode')
    top_mode++
    if (top_mode === TOP_MODE.length) top_mode = 0

    for (var i = 0; i < TOP_MODE.length; i++) {
        document.getElementsByClassName(TOP_MODE[i] + "_container")[0].style.display = 'none'
    }
    document.getElementsByClassName(TOP_MODE[top_mode] + "_container")[0].style.display = 'block'

}

function changeBottomMode() {
    console.log('change bottom mode')
    bottom_mode++
    if (bottom_mode === BOTTOM_MODE.length) bottom_mode = 0

    for (var i = 0; i < BOTTOM_MODE.length; i++) {
        document.getElementsByClassName(BOTTOM_MODE[i] + "_container")[0].style.display = 'none'
    }
    document.getElementsByClassName(BOTTOM_MODE[bottom_mode] + "_container")[0].style.display = 'block'
}

function rotateScreen() {
    console.log('rotateScreen')

    var body = document.getElementsByTagName('body')[0]
    var page = document.getElementsByClassName("page")[0]
    var w = document.documentElement.clientWidth || document.body.clientWidth;
    var h = document.documentElement.clientHeight || document.body.clientHeight;
    if (vertical) {
        body.classList.add('horizontal')
        body.style.height = w + "px"
        page.style.width = h + "px"
    } else {
        body.classList.remove('horizontal')
        body.style.height = h + "px"
        page.style.width = w + "px"
    }
    vertical = !vertical
}

function changeBgMode() {
    var page = document.getElementsByClassName('page')[0]
    var pageClasses = page.classList
    bg_mode++
    if (bg_mode === BG_MODE.length) bg_mode = 0
    if (bg_mode === 0) {
        clearInterval(pic_timer)
        pic_timer = null
        pageClasses.remove('pic')
        pageClasses.add('white')
    } else if (bg_mode === 1) {
        pageClasses.remove('white')
        pageClasses.add('dark')
    } else {
        pageClasses.remove('dark')
        pageClasses.add('pic')
    }
}

function addEvent(autoMode) {
    document.getElementById("apm").addEventListener('click', function() {
        console.log('hourCycle change')
        hour24 = !hour24
        clock(autoMode)
    })
    document.getElementsByClassName("time")[0].addEventListener('click', rotateScreen)
    document.getElementById("top").addEventListener('click', changeTopMode)
    document.getElementById("bottom").addEventListener('click', changeBottomMode)
    document.getElementById("date").addEventListener('click', changeBgMode)
}