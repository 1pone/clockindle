// 判断浏览器是否支持某一个CSS3属性
function supportCss3(style) {
  var prefix = ["webkit", "Moz", "ms", "o"],
    i,
    humpString = [],
    htmlStyle = document.documentElement.style,
    _toHumb = function (string) {
      return string.replace(/-(\w)/g, function ($0, $1) {
        return $1.toUpperCase();
      });
    };
  for (i in prefix) humpString.push(_toHumb(prefix[i] + "-" + style));
  humpString.push(_toHumb(style));
  for (i in humpString) if (humpString[i] in htmlStyle) return true;
  return false;
}

// 获取设备显示尺寸
function showScreenSize() {
  var w = document.documentElement.clientWidth || document.body.clientWidth;
  var h = document.documentElement.clientHeight || document.body.clientHeight;
  console.log(w, h);
  document.getElementById("screensize").innerHTML =
    "屏幕分辨率的宽：" +
    w +
    "</br>屏幕分辨率的高：" +
    h +
    "</br>getTimezoneOffset: " +
    Boolean(new Date().getTimezoneOffset);
}

// 重写console.log方法，将控制台信息输出至页面，测试用
function reLog() {
  var logger = document.getElementById("log_container");
  console.log(logger);
  console.log = function (message) {
    if (typeof message == "object") {
      logger.innerHTML +=
        (JSON && JSON.stringify ? JSON.stringify(message) : message) + "<br />";
    } else {
      logger.innerHTML += message + "<br />";
    }
  };
}

reLog();
console.log(new Date().toLocaleString());
