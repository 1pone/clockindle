// Attention: Kindle浏览器不支持模版字符串、箭头函数等es6语法
// TODO 历史上的今天模块

window.onload = function () {
  getIpInfo();
  // 时钟模块
  clock(bg_autoMode);
  time_timer = setInterval("clock(" + bg_autoMode + ")", 60 * 1000);

  // rotation_mode 屏幕旋转标识
  if (rotation_mode !== "") {
    rotation_mode = Number(rotation_mode);
  } else {
    rotation_mode = rotation_mode_default;
    setCookie("rotation_mode", rotation_mode, 30);
  }
  // 标识号退一再调用一次组件方法，实现组件的初始化
  rotation_mode = rotation_mode === 0 ? 3 : rotation_mode - 1;
  rotateScreen();
  // hour24 时制标识
  if (hour24 !== "") {
    hour24 = hour24 === "true" ? true : false;
  } else {
    hour24 = hour24_default;
    setCookie("hour24", hour24, 30);
  }
  // 顶部组件序号
  if (top_mode !== "") {
    top_mode = Number(top_mode);
  } else {
    top_mode = top_mode_default;
    setCookie("top_mode", top_mode, 30);
  }
  top_mode = top_mode === 0 ? TOP_MODE.length - 1 : top_mode - 1;
  changeTopMode();
  // 底部组件序号
  if (bottom_mode !== "") {
    bottom_mode = Number(bottom_mode);
  } else {
    bottom_mode = bottom_mode_default;
    setCookie("bottom_mode", bottom_mode, 30);
  }
  bottom_mode = bottom_mode === 0 ? BOTTOM_MODE.length - 1 : bottom_mode - 1;
  changeBottomMode();
  // 背景组件序号
  if (bg_mode !== "") {
    bg_mode = Number(bg_mode);
    bg_mode = bg_mode === 0 ? BG_MODE.length - 1 : bg_mode - 1;
    changeBgMode();
  } else {
    bg_mode = bg_mode_default;
    setCookie("bg_mode", bg_mode, 30);
  }

  // 绑定12/24小时制切换、横/竖屏切换事件
  addEvent(bg_autoMode); // autoMode

  // 三秒后隐藏设置图标
  delayHiddenSetting();
};

// Keys
var KEY_UNSPLASH = "bXwWoUhPeVw-yvSesGMgaOENnlSzhHYB43kZIQOR8cQ";
var KEY_QWEATHER = getCookie("qweatherKey"); // "f3c3540923c24847b9f4d194888dbcef"; // https://console.qweather.com/#/apps
var KEY_LUNAR = "LwExDtUWhF3rH5ib";

// APIs
var API_HITOKOTO = "https://v1.hitokoto.cn?encode=json&charset=utf-8";
var API_IP_INFO = "https://ipapi.co/json?languages=zh-CN";
var API_LUNAR = "https://v2.alapi.cn/api/lunar?token=";
var API_WEATHER = "https://devapi.qweather.com/v7/weather/now?";
var API_WEIBO = "https://tenapi.cn/resou/";

// 组件容器
// TODO 添加组件刷新频率
var TOP_MODE = ["nonetop", "hitokoto", "poem", "weibo"];
var BOTTOM_MODE = ["nonebtm", "weather"];
var BG_MODE = ["none", "dark", "auto", "pic"];

// 默认配置项
var morningHour = 6; // 自动模式下夜晚结束时间
var nightHour = 19; // 自动模式下夜晚开始时间
var top_mode_default = 1; // 顶部组件默认序号，默认使用“一言”
var bottom_mode_default = 1; // 底部组件默认序号，默认使用“天气”
var bg_mode_default = 0; // 背景组件默认序号，默认使用白底
var rotation_mode_default = 0; // 默认使用0-竖屏模式 0=0°，1=90°，2=180°，3=270°
var hour24_default = false; // 默认使用十二小时制
var bg_autoMode = false; // 黑白背景自动切换
var weibo_num = 3; // 微博热搜条数
var timezoneOffset =  0; // 时区偏移分钟
var cIp = ""; // 客户端ip
var city = ""; // 客户端所在城市
var cityLocation = null; // 客户端经纬度信息

// cookie变量
var top_mode = getCookie("top_mode"); // 顶部组件序号，默认使用“一言”
var bottom_mode = getCookie("bottom_mode"); // 底部组件序号，默认使用“天气”
var bg_mode = getCookie("bg_mode"); // 背景组件序号，默认使用白底
var rotation_mode = getCookie("rotation_mode"); // 竖屏标识
var hour24 = getCookie("hour24"); // 24小时制

// 模块缓存数据
var hitokoto_data = null; // 一言缓存数据
var weibo_data = null; // 微博热搜缓存数据
var poem_data = null; // 每日诗词缓存数据
var weather_data = null; // 天气缓存数据
var pic_data = null; // 背景图片缓存数据
var dd_data = null; // 当前日期全局变量，用于触发lunar和holiday接口

// 定时器
var hitokoto_timer = null; // 一言模块定时器
var poem_timer = null; // 每日诗词定时器
var weibo_timer = null; // 微博模块定时器
var time_timer = null; // 时钟模块定时器
var weather_timer = null; // 天气模块定时器
var pic_timer = null; // 图片背景模块定时器
var settings_timer = null; // 设置icon显隐定时器

// 背景自动模式图标
var autoModeImg = "&#xe8e3";

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
  console.log("hitokoto update");
  var xhr = createXHR();
  xhr.open("GET", API_HITOKOTO, true);
  xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
      hitokoto_data = JSON.parse(this.responseText);
      document.getElementById("brackets-l").innerHTML = "『";
      document.getElementById("brackets-r").innerHTML = "』";
      document.getElementById("hitokoto").innerHTML = hitokoto_data.hitokoto;
      document.getElementById("from").innerHTML = hitokoto_data.from_who
          ? "「" + hitokoto_data.from + " " + hitokoto_data.from_who + "」"
          : "「" + hitokoto_data.from + "」";
    }
  };
  xhr.send(null);
}

// 每日诗词
function poem() {
  console.log("poem update");
  jinrishici.load(function (result) {
    poem_data = result.data;
    var sentence = document.querySelector("#poem_sentence");
    var info = document.querySelector("#poem_info");
    sentence.innerHTML = poem_data.content;
    info.innerHTML =
        "【" +
        poem_data.origin.dynasty +
        "】" +
        poem_data.origin.author +
        "《" +
        poem_data.origin.title +
        "》";
  });
}

// 根据IP获取所在城市信息
function getIpInfo() {
  var xhr = createXHR();
  xhr.open("GET", API_IP_INFO, false);
  xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
      var data = JSON.parse(this.responseText);
      cityLocation = data.longitude + "," + data.latitude;
      cIp = data.ip;
      city = data.region;
      timezoneOffset = parseInt(data.utc_offset) * 0.6
    }
  };
  xhr.send(null);
}

// 时钟模块
function clock(autoMode) {
  var date = new Date();

  var utc8DiffMinutes = date.getTimezoneOffset() + timezoneOffset; // Kindle上new Date()为标准时间且getTimezoneOffset() === 0
  date.setMinutes(date.getMinutes() + utc8DiffMinutes);
  var MM = date.getMonth() + 1;
  var dd = date.getDate();
  var day = date.getDay();
  var hour = date.getHours();
  var minutes = date.getMinutes();

  // 深浅色模式标示
  var lightMode = true;

  // 自动模式
  if (autoMode) {
    // nightHour点后morningHour前启用深色模式
    if (hour > nightHour || hour < morningHour) {
      if (lightMode) {
        document.getElementsByClassName("page")[0].style.color = "#ffffff";
        document.getElementsByClassName("page")[0].style.backgroundColor =
            "#000000";
        lightMode = false;
      }
    } else {
      if (!lightMode) {
        document.getElementsByClassName("page")[0].style.color = "#000000";
        document.getElementsByClassName("page")[0].style.backgroundColor =
            "#ffffff";
        lightMode = true;
      }
    }
  }

  // 24小時制
  if (!hour24) {
    var apm = "上<br>午";
    if (hour > 12) {
      apm = "下<br>午";
      hour -= 12;
    }
    document.getElementById("apm").innerHTML = apm;
  } else {
    document.getElementById("apm").innerHTML = "";
  }

  var timeString = hour + ":" + ("0" + minutes).slice(-2);

  document.getElementById("time").innerHTML = timeString;

  if (!dd_data || dd !== dd_data) {
    dd_data = dd;
    var dateString = MM + "月" + dd + "日";
    var weekList = ["日", "一", "二", "三", "四", "五", "六"];
    var weekString = "星期" + weekList[day];
    document.getElementById("date").innerHTML = dateString + " " + weekString;
    // 获取农历日期及节假日
    getLunar();
  }
}

function getLunar() {
  var xhr = createXHR();
  xhr.open("GET", API_LUNAR + KEY_LUNAR, true);
  xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
      var data = JSON.parse(this.responseText);
      if (data.code == 200) {
        var lunar_data = data.data;
        document.getElementById("lunar").innerHTML =
            lunar_data.ganzhi_year + "年" + lunar_data.lunar_month_chinese + lunar_data.lunar_day_chinese;
        // if (lunar_data.festival.length)
        //   document.getElementById("holiday").innerHTML =
        //     "&nbsp;&nbsp;" + lunar_data.festival[0];
      } else {
        console.error("农历数据获取失败");
      }
    }
  };
  xhr.send(null);
}

function weather() {
  if (!getCookie("qweatherKey")) {
    document.getElementById("weaTitle").innerHTML =
        "请刷新后点击右上角设置按钮填写 API Key～";
    return;
  }
  console.log("weather update");
  var xhr = createXHR();
  xhr.open(
      "GET",
      API_WEATHER + "key=" + KEY_QWEATHER + "&location=" + cityLocation,
      true
  );
  xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
      var data = JSON.parse(this.responseText);
      var wea_now = data.now;
      if (data.code === "200") {
        var img = "<i class=qi-" + wea_now.icon + "></i>";

        var weaImg = img + "<div>天气：" + wea_now.text + "</div>";

        var weaTemp =
            '<div class="tempNum">' +
            parseInt(wea_now.temp) +
            '</div><div class="symbol">&#8451;</div>' +
            "<div>当前气温</div>";

        var weaInfo =
            "<div>" +
            city +
            "当前天气" +
            "</div>" +
            "<div>体感温度：" +
            wea_now.feelsLike +
            "&#8451;</div>" +
            "<div>湿度：" +
            wea_now.humidity +
            "%</div>" +
            "<div>风向：" +
            wea_now.windDir +
            "</div>" +
            "<div>风速：" +
            wea_now.windScale +
            "级 " +
            wea_now.windSpeed +
            "km/h</div>" +
            "<div>更新时间：" +
            wea_now.obsTime.match(/T(.+)\+/)[1] +
            "</div>";

        document.getElementById("weaTitle").innerHTML = "";
        document.getElementById("weaImg").innerHTML = weaImg;
        document.getElementById("weaTemp").innerHTML = weaTemp;
        document.getElementById("weaInfo").innerHTML = weaInfo;
      } else {
        console.error("天气数据获取失败");
        document.getElementById("weaTitle").innerHTML =
            "数据获取失败，请检查 API Key～";
      }
    }
  };
  xhr.send(null);
}

// 微博热搜模块
// https://docs.tenapi.cn/resou.html#%E8%AF%B7%E6%B1%82url
function weibo() {
  console.log("weibo update");
  var xhr = createXHR();
  xhr.open("GET", API_WEIBO, true);
  xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
      var data = JSON.parse(this.responseText);
      var weibo_title = document.getElementsByClassName("weibo_title")[0];
      var hot_word = document.getElementById("hot_word");
      var hot_word_num = document.getElementById("hot_word_num");
      if (data.data === 200) {
        // var hots = data.newslist; // tianapi
        weibo_data = data.list; // alapi
        weibo_title.innerHTML = "微博实时热搜";
        hot_word.innerHTML = "";
        hot_word_num.innerHTML = "";
        for (var i = 0; i < weibo_num; i++) {
          var index = i + 1;
          hot_word.innerHTML +=
              "<li>" + index + ". " + weibo_data[i].name + "</li>"; // alapi
          hot_word_num.innerHTML += "<li>" + weibo_data[i].hot + "</li>"; // alapi
        }
      } else {
        console.error("微博热搜数据获取失败: " + data.msg);
        weibo_title.innerHTML = "数据获取失败，请稍后再试～";
      }
    }
  };
  xhr.send(null);
}

// 图片背景模块 目前API处于开发阶段，请求频率受限，每小时50次
// 暂时使用css中的接口，背景切换定时器失效
function picture() {
  console.log("picture update");
  // var xhr = createXHR();
  // xhr.open(
  //   "GET",
  //   "https://api.unsplash.com/photos/random?client_id=" + KEY_UNSPLASH,
  //   true
  // );
  // xhr.onreadystatechange = function () {
  //   if (this.readyState == 4) {
  //     var data = JSON.parse(this.responseText);
  //     pic_data = data;
  //     document.getElementsByClassName("page")[0].style.backgroundImage =
  //       "url(" + pic_data.urls.regular + ")";
  //   }
  // };
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
  console.log("# change " + pos + " mode");
  var pos_mode = eval(pos + "_mode");
  var POS_MODE = eval(pos.toUpperCase() + "_MODE");
  if (pos_mode !== 0 && eval(POS_MODE[pos_mode] + "_timer")) {
    clearInterval(eval(POS_MODE[pos_mode] + "_timer"));
    eval(POS_MODE[pos_mode] + "_timer = null");
    console.log(POS_MODE[pos_mode] + "_timer destroyed");
  }
  pos_mode++;
  if (pos_mode === POS_MODE.length) pos_mode = 0;
  eval(pos + "_mode = pos_mode");
  setCookie(pos + "_mode", pos_mode, 30);

  if (pos_mode !== 0) {
    if (!eval(POS_MODE[pos_mode] + "_data")) {
      eval(POS_MODE[pos_mode] + "()");
    }
    eval(
        POS_MODE[pos_mode] +
        '_timer = setInterval(POS_MODE[pos_mode] + "()", 60 * 1000 * 60)'
    );
    console.log(POS_MODE[pos_mode] + "_timer created");
  }
  for (var i = 0; i < POS_MODE.length; i++) {
    document.getElementsByClassName(
        POS_MODE[i] + "_container"
    )[0].style.display = "none";
  }
  document.getElementsByClassName(
      POS_MODE[pos_mode] + "_container"
  )[0].style.display = "block";
}

function changeTopMode() {
  changeMode("top");
}

function changeBottomMode() {
  changeMode("bottom");
}

function rotateScreen() {
  console.log("# rotate screen " + rotation_mode);

  var body = document.getElementsByTagName("body")[0];
  var page = document.getElementsByClassName("page")[0];
  var w = document.documentElement.clientWidth || document.body.clientWidth;
  var h = document.documentElement.clientHeight || document.body.clientHeight;
  if (rotation_mode === 0) {
    body.classList.add("rotate-90");
    body.style.height = w + "px";
    page.style.width = h + "px";
    page.style.height = w + "px";
  } else if (rotation_mode === 1) {
    body.classList.remove("rotate-90");
    body.classList.add("rotate-180");
    body.style.height = h + "px";
    page.style.width = w + "px";
    page.style.height = h + "px";
  } else if (rotation_mode === 2) {
    body.classList.remove("rotate-180");
    body.classList.add("rotate-270");
    body.style.width = h + "px";
    page.style.height = w + "px";
    page.style.width = "auto";
  } else if (rotation_mode === 3) {
    body.classList.remove("rotate-270");
    body.style.width = "auto";
    body.style.height = h + "px";
    page.style.width = w + "px";
    page.style.height = h + "px";
  }
  rotation_mode = rotation_mode === 3 ? 0 : rotation_mode + 1;
  setCookie("rotation_mode", rotation_mode, 30);
}

function changeBgMode() {
  console.log("# change background");
  var page = document.getElementsByClassName("page")[0];
  var backdropClasses = document.getElementById("settings_backdrop").classList;
  var settingsClasses = document.getElementById("settings_card").classList;
  var pageClasses = page.classList;
  bg_mode = bg_mode === BG_MODE.length - 1 ? 0 : bg_mode + 1;
  setCookie("bg_mode", bg_mode, 30);
  if (bg_mode === 0) {
    // light bg
    clearInterval(pic_timer);
    pic_timer = null;
    console.log("picture close");
    pageClasses.remove("pic");
    pageClasses.add("light");
  } else if (bg_mode === 1) {
    // dark bg
    pageClasses.remove("light");
    pageClasses.add("dark");

    backdropClasses.remove("backdrop_black");
    backdropClasses.add("backdrop_white");

    settingsClasses.remove("light");
    settingsClasses.add("dark");
  } else if (bg_mode === 2) {
    // auto bg
    var date = new Date();
    var utc8DiffMinutes = date.getTimezoneOffset() + 480;
    date.setMinutes(date.getMinutes() + utc8DiffMinutes);
    var hour = date.getHours();
    if (hour > nightHour || hour < morningHour) {
      pageClasses.remove("light");
      pageClasses.add("dark");
      backdropClasses.remove("backdrop_black");
      backdropClasses.add("backdrop_white");

      settingsClasses.remove("light");
      settingsClasses.add("dark");
    } else {
      pageClasses.remove("dark");
      pageClasses.add("light");
      backdropClasses.remove("backdrop_white");
      backdropClasses.add("backdrop_black");

      settingsClasses.remove("dark");
      settingsClasses.add("light");
    }
    var icon = document.getElementById("light_dark_icon");
    var middle = document.getElementById("middle");
    icon.style.visibility = "visible";
    middle.style.visibility = "hidden";
    setTimeout(function () {
      icon.style.visibility = "hidden";
      middle.style.visibility = "visible";
    }, 1000);
  } else {
    // picture bg
    console.log("picture open");
    if (!pic_data) {
      picture();
    }
    pic_timer = setInterval("picture()", 60 * 1000 * 60);
    pageClasses.remove("light");
    pageClasses.remove("dark");
    pageClasses.add("pic");

    backdropClasses.remove("backdrop_white");
    backdropClasses.add("backdrop_black");

    settingsClasses.remove("dark");
    settingsClasses.add("light");
  }
}

function delayHiddenSetting() {
  settings_timer = setTimeout(function () {
    document.getElementById("settings_icon").style.visibility = "hidden";
  }, 3000);
}

function openSettingsDialog() {
  clearTimeout(settings_timer);
  document.getElementById("qweather_input").value = KEY_QWEATHER;
  document.getElementById("settings_dialog").style.display = "block";
}

function closeSettingsDialog() {
  delayHiddenSetting();
  document.getElementById("settings_dialog").style.display = "none";
}

function saveSettings() {
  const qweatherKey = document.getElementById("qweather_input").value;
  KEY_QWEATHER = qweatherKey;
  setCookie("qweatherKey", qweatherKey, 360);

  closeSettingsDialog();
  window.location.reload();
}

function addEvent(autoMode) {
  document
      .getElementById("apmOuterWrapper")
      .addEventListener("click", function () {
        console.log("hourCycle change");
        hour24 = !hour24;
        setCookie("hour24", hour24, 30);
        clock(autoMode);
      });
  document
      .getElementsByClassName("time")[0]
      .addEventListener("click", rotateScreen);
  document.getElementById("top").addEventListener("click", changeTopMode);
  document.getElementById("bottom").addEventListener("click", changeBottomMode);
  document.getElementById("date").addEventListener("click", changeBgMode);
  document
      .getElementById("settings_icon")
      .addEventListener("click", openSettingsDialog);
  document
      .getElementById("save_button")
      .addEventListener("click", saveSettings);
  document
      .getElementById("settings_backdrop")
      .addEventListener("click", closeSettingsDialog);
}
