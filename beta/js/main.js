function showScreenSize() {
    // 获取设备显示尺寸
    var w = window.screen.width
    var h = window.screen.height
    console.log(w, h)
    document.getElementById('screensize').innerHTML = '屏幕分辨率的宽：' + w + '</br>屏幕分辨率的高：' + h
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
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            var data = JSON.parse(this.responseText)
            document.getElementById('hitokoto').innerHTML = data.hitokoto
            document.getElementById('from').innerHTML = data.from_who ? "「" + data.from + " " + data.from_who + "」" :
                "「" + data.from + "」"
        }
    }
    xhr.send(null);
}


// 时钟模块
function clock(hour24) {
    var d = new Date();

    //得到1970年一月一日到现在的秒数
    var local = d.getTime();

    //本地时间与GMT时间的时间偏移差
    var offset = d.getTimezoneOffset() * 60000;

    //获取本地时区，判断如果是负的则相加得到格林尼治时间，正的则相减
    var localUtc = new Date().getTimezoneOffset() / 60;
    //得到现在的格林尼治时间
    var utcTime;
    if (localUtc > 0) {
        utcTime = local - offset;
    } else {
        utcTime = local + offset;
    }
    console.log(localUtc)
    //得到时区的绝对值
    var localTime = utcTime + 3600000 * Math.abs(localUtc);

    // 得到当前时区的时间对象
    var nd = new Date(localTime);
    var MM = nd.getMonth() + 1
    var dd = nd.getDate()
    var day = nd.getDay()
    var hour = nd.getHours()
    var minutes = nd.getMinutes()

    if (!hour24) {
        var apm = '上<br>午'
        if (hour > 12) {
            apm = '下<br>午'
            hour -= 12
        }

        document.getElementById('apm').innerHTML = apm
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
    xhr.open('GET', 'https://tianqiapi.com/free/day?appid=48353766&appsecret=VjZ4oxd5', true);
    // xhr.open('GET','https://tianqiapi.com/free/day?appid=48373524&appsecret=5iHwLsS8',true);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            var data = JSON.parse(this.responseText)
            // 获取天气图标信息
            var imgs = weaImgs[data.wea_img]
            console.log(imgs)
            var img = imgs[0]
            var date = new Date()
            var utc8DiffMinutes = date.getTimezoneOffset() + 480
            date.setMinutes(date.getMinutes() + utc8DiffMinutes)
            var hour = date.getHours()
            // 20点后天气使用夜间天气图标
            if (hour > 19 || hour < 6) {
                img = imgs[1]
            }

            var weaImg = '<span class="iconfont">' + img + '</span>' + '<div>天气：' + data.wea + '</div>';
            var weaTemp = '<div class="tempNum">' + data.tem + '<div class="symbol">&#8451;</div></div>' +
                '<div>当前气温</div>';
            var weaInfo = '<div>最高气温：' + data.tem_day + '&#8451;</div>' +
                '<div>最低气温：' + data.tem_night + '&#8451;</div>' +
                '<div>空气质量：' + data.air + '</div>' +
                '<div>风向：' + data.win + '</div>' +
                '<div>风速：' + data.win_speed + ' ' + data.win_meter + '</div>' +
                '<div>更新时间：' + data.update_time + '</div>';
            document.getElementById('weaTitle').innerHTML = data.city + '当前天气'
            document.getElementById('weaImg').innerHTML = weaImg
            document.getElementById('weaTemp').innerHTML = weaTemp
            document.getElementById('weaInfo').innerHTML = weaInfo
        }
    }
    xhr.send(null);
}