window.onload = function() {
    var ALAPI_TOKEN = 'pBsICqbRV2eVtGiI'
    var UNSPLASH_ID = 'bXwWoUhPeVw-yvSesGMgaOENnlSzhHYB43kZIQOR8cQ'

    // 组件容器
    var TOP_MODE = ['nonetop', 'hitokoto', 'weibo']
    var BOTTOM_MODE = ['nonebtm', 'weather']
    var BG_MODE = ['none', 'dark', 'pic']

    // 激活组件当前序号
    var top_mode = 1 // 顶部组件序号，默认使用“一言”
    var bottom_mode = 1 // 底部组件序号，默认使用“天气”
    var bg_mode = 0 // 背景组件序号，默认使用白底

    var morningHour = 6 // 自动模式下夜晚结束时间
    var nightHour = 19 // 自动模式下夜晚开始时间
    var vertical = getCookie('vertical');
    if (vertical !== '') {
        if (vertical === 'false') {
            vertical = true
            rotateScreen()
        } else
            vertical = true
    } else {
        vertical = true
        setCookie('vertical', true, 30)
    }

    var vertical = document.cookie.vertical || true // 竖屏标识
    var hour24 = false // 24小时制
    var bg_autoMode = false // 黑白背景自动切换
    var weibo_num = 3 // 微博热搜条数
    var cip = returnCitySN.cip // 客户端ip

    // 模块缓存数据
    var hitokoto_data = null
    var weibo_data = null
    var wea_data = null
    var pic_data = null

    // 定时器
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
                    wea_data = data.data
                        // 获取天气图标信息
                    var imgs = weaImgs[wea_data.weather_code]
                    var img = imgs[0]
                    var date = new Date()
                    var utc8DiffMinutes = date.getTimezoneOffset() + 480
                    date.setMinutes(date.getMinutes() + utc8DiffMinutes)
                    var hour = date.getHours()
                        // nightHour后天气使用夜间天气图标
                    if (hour > nightHour || hour < morningHour) {
                        img = imgs[1]
                    }

                    var weaImg = '<span class="iconfont">' + img + '</span>' + '<div>天气：' + wea_data.weather + '</div>';
                    var weaTemp = '<div class="tempNum">' + wea_data.temp + '<div class="symbol">&#8451;</div></div>' +
                        '<div>当前气温</div>';
                    var highTemp = wea_data.max_temp // 日间气温/最高气温
                    var lowTemp = wea_data.min_temp // 夜间气温/最低气温
                    var airLevel = wea_data.air.air_level || '' // 空气质量，air_level为alapi独有
                    var updateTime = wea_data.update_time.split(' ') // 更新时间，alapi格式为'年-月-日 时-分-秒'，tianqiapi格式为'时-分'
                    updateTime = updateTime[updateTime.length - 1]
                    var weaInfo = '<div>最高/低气温：' + highTemp + '/' + lowTemp + '&#8451;</div>' +
                        '<div>湿度：' + wea_data.humidity + '</div>' +
                        '<div>空气质量：' + wea_data.air + airLevel + '</div>' +
                        '<div>风向：' + wea_data.wind + '</div>' +
                        '<div>风速：' + wea_data.wind_speed + ' ' + wea_data.wind_scale + '</div>' +
                        '<div>更新时间：' + updateTime + '</div>';
                    document.getElementById('weaTitle').innerHTML = wea_data.city + '当前天气'
                    document.getElementById('weaImg').innerHTML = weaImg
                    document.getElementById('weaTemp').innerHTML = weaTemp
                    document.getElementById('weaInfo').innerHTML = weaInfo
                } else {
                    console.error('天气数据获取失败: ' + wea_data.msg)
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
        console.log('picture update')
        var xhr = createXHR();
        xhr.open('GET', 'https://api.unsplash.com/photos/random?client_id=' + UNSPLASH_ID, true);
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                var data = JSON.parse(this.responseText)
                pic_data = data
                document.getElementsByClassName('page')[0].style.backgroundImage = 'url(' + pic_data.urls.regular + ')'
            }
        }
        xhr.send(null);
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
    function changeTopMode() {
        console.log('# change top mode')
        if (top_mode !== 0 && eval(TOP_MODE[top_mode] + '_timer')) {
            clearInterval(eval(TOP_MODE[top_mode] + '_timer'))
            eval(TOP_MODE[top_mode] + '_timer = null')
            console.log(TOP_MODE[top_mode] + '_timer destroyed')
        }
        top_mode++
        if (top_mode === TOP_MODE.length) top_mode = 0

        for (var i = 0; i < TOP_MODE.length; i++) {
            document.getElementsByClassName(TOP_MODE[i] + "_container")[0].style.display = 'none'
        }

        if (top_mode !== 0) {
            if (!eval(TOP_MODE[top_mode] + '_data')) {
                eval(TOP_MODE[top_mode] + '()')
            }
            eval(TOP_MODE[top_mode] + '_timer = setInterval(TOP_MODE[top_mode] + "()", 60 * 1000 * 20)')
            console.log(TOP_MODE[top_mode] + '_timer created')
        }

        document.getElementsByClassName(TOP_MODE[top_mode] + "_container")[0].style.display = 'block'

    }

    function changeBottomMode() {
        console.log('# change bottom mode')
        if (bottom_mode === 0) {
            bottom_mode = 1
            if (!wea_data) {
                weather()
            }
            weather_timer = setInterval('weather()', 60 * 1000 * 20)
            console.log('weather_timer created')
            document.getElementsByClassName("nonebtm_container")[0].style.display = 'none'
            document.getElementsByClassName("weather_container")[0].style.display = 'block'
        } else if (bottom_mode === 1) {
            bottom_mode = 0
            clearInterval(weather_timer)
            weather_timer = null
            console.log('weather_timer destroyed')
            document.getElementsByClassName("nonebtm_container")[0].style.display = 'block'
            document.getElementsByClassName("weather_container")[0].style.display = 'none'
        }

        // bottom_mode++
        // if (bottom_mode === BOTTOM_MODE.length) bottom_mode = 0

        // for (var i = 0; i < BOTTOM_MODE.length; i++) {
        //     document.getElementsByClassName(BOTTOM_MODE[i] + "_container")[0].style.display = 'none'
        // }
        // document.getElementsByClassName(BOTTOM_MODE[bottom_mode] + "_container")[0].style.display = 'block'
    }

    function rotateScreen() {
        console.log('# rotate screen')

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
        setCookie("vertical", vertical, 30)
    }

    function changeBgMode() {
        console.log('# change background')
        var page = document.getElementsByClassName('page')[0]
        var pageClasses = page.classList
        bg_mode++
        if (bg_mode === BG_MODE.length) bg_mode = 0
        if (bg_mode === 0) {
            clearInterval(pic_timer)
            pic_timer = null
            pageClasses.remove('pic')
            console.log('picture close')
            pageClasses.add('white')
        } else if (bg_mode === 1) {
            pageClasses.remove('white')
            pageClasses.add('dark')
        } else {
            console.log('picture open')
            if (!pic_data) {
                picture()
            }
            pic_timer = setInterval("picture()", 60 * 1000 * 60)
            pageClasses.remove('dark')
            pageClasses.add('pic')
        }
    }

    function addEvent(autoMode) {
        document.getElementById("apmOuterWrapper").addEventListener('click', function() {
            console.log('hourCycle change')
            hour24 = !hour24
            clock(autoMode)
        })
        document.getElementsByClassName("time")[0].addEventListener('click', rotateScreen)
        document.getElementById("top").addEventListener('click', changeTopMode)
        document.getElementById("bottom").addEventListener('click', changeBottomMode)
        document.getElementById("date").addEventListener('click', changeBgMode)
    }


    // 绑定12/24小时制切换、横/竖屏切换事件
    addEvent(bg_autoMode) // autoMode

    // 一言模块
    hitokoto()
    hitokoto_timer = setInterval("hitokoto()", 60 * 1000 * 60)

    // 时钟模块
    clock(bg_autoMode)
    time_timer = setInterval('clock(' + bg_autoMode + ')', 60 * 1000)

    // 天气模块
    weather()
    weather_timer = setInterval("weather()", 60 * 1000 * 20)

    // 微博热搜模块在模块切换器中加载...
    // weibo();
    // weibo_timer = setInterval("weibo()", 60 * 1000 * 20);

    // 图片背景模块在模块切换器中加载...
    // picture()
    // pic_timer = setInterval("picture()", 60 * 1000 * 60)

    // TODO 历史上的今天模块
}