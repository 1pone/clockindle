window.onload = function() {
    if (rotation_mode !== "") {
        rotation_mode = Number(rotation_mode);
        rotation_mode = rotation_mode === 0 ? 3 : rotation_mode - 1;
        rotateScreen()
    } else {
        rotation_mode = rotation_mode_default;
        setCookie("rotation_mode", rotation_mode, 30)
    }
    if (hour24 !== "") { hour24 = hour24 === "true" ? true : false } else {
        hour24 = hour24_default;
        setCookie("hour24", hour24, 30)
    }
    if (bg_mode !== "") {
        bg_mode = Number(bg_mode);
        bg_mode = bg_mode === 0 ? BG_MODE.length - 1 : bg_mode - 1;
        changeBgMode()
    } else {
        bg_mode = bg_mode_default;
        setCookie("bg_mode", bg_mode, 30)
    }
    addEvent(bg_autoMode);
    hitokoto()
    hitokoto_timer = setInterval("hitokoto()", 60 * 1000 * 60)
    clock(bg_autoMode);
    time_timer = setInterval("clock(" + bg_autoMode + ")", 60 * 1000)
};
var BG_MODE = ["none", "dark", "auto"];
var morningHour = 6;
var nightHour = 19;
var bg_mode_default = 0;
var rotation_mode_default = 0;
var hour24_default = false;
var bg_autoMode = false;
var bg_mode = getCookie("bg_mode");
var rotation_mode = getCookie("rotation_mode");
var hour24 = getCookie("hour24");
var hitokoto_timer = null;
var time_timer = null;
var autoModeImg = "&#xe8e3";


function createXHR() { var xhr = null; if (window.XMLHttpRequest) { xhr = new XMLHttpRequest() } else { if (window.ActiveXObject) { xhr = new ActiveXObject("Microsoft.XMLHTTP") } } return xhr }

function hitokoto() {
    console.log("hitokoto update");
    var xhr = createXHR();
    xhr.open("GET", "js/sentences.json", true);
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            var hitokoto_collection = JSON.parse(this.responseText);
            var type_collection = hitokoto_collection[parseInt(Math.random() * hitokoto_collection.length)].data;
            console.log(type_collection.length)
            var hitokoto_data = type_collection[parseInt(Math.random() * type_collection.length)];
            console.log(hitokoto_data)
            document.getElementById("brackets-l").innerHTML = "『";
            document.getElementById("brackets-r").innerHTML = "』";
            document.getElementById("hitokoto").innerHTML = hitokoto_data.hitokoto;
            document.getElementById("from").innerHTML = hitokoto_data.from_who ? "「" + hitokoto_data.from + " " + hitokoto_data.from_who + "」" : "「" + hitokoto_data.from + "」"
        }
    };
    xhr.send(null)
}

function clock(autoMode) {
    var date = new Date();
    var utc8DiffMinutes = date.getTimezoneOffset() + 480;
    date.setMinutes(date.getMinutes() + utc8DiffMinutes);
    var MM = date.getMonth() + 1;
    var dd = date.getDate();
    var day = date.getDay();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var lightMode = true;
    if (autoMode) {
        if (hour > nightHour || hour < morningHour) {
            if (lightMode) {
                document.getElementsByClassName("page")[0].style.color = "#ffffff";
                document.getElementsByClassName("page")[0].style.backgroundColor = "#000000";
                lightMode = false
            }
        } else {
            if (!lightMode) {
                document.getElementsByClassName("page")[0].style.color = "#000000";
                document.getElementsByClassName("page")[0].style.backgroundColor = "#ffffff";
                lightMode = true
            }
        }
    }
    if (!hour24) {
        var apm = "上<br>午";
        if (hour > 12) {
            apm = "下<br>午";
            hour -= 12
        }
        document.getElementById("apm").innerHTML = apm
    } else { document.getElementById("apm").innerHTML = "" }
    var timeString = hour + ":" + ("0" + minutes).slice(-2);
    var dateString = MM + "月" + dd + "日";
    var weekList = ["日", "一", "二", "三", "四", "五", "六"];
    var weekString = "星期" + weekList[day];
    document.getElementById("time").innerHTML = timeString;
    document.getElementById("date").innerHTML = dateString + " " + weekString
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
        page.style.height = w + "px"
    } else {
        if (rotation_mode === 1) {
            body.classList.remove("rotate-90");
            body.classList.add("rotate-180");
            body.style.height = h + "px";
            page.style.width = w + "px";
            page.style.height = h + "px"
        } else {
            if (rotation_mode === 2) {
                body.classList.remove("rotate-180");
                body.classList.add("rotate-270");
                body.style.width = h + "px";
                page.style.height = w + "px";
                page.style.width = "auto"
            } else {
                if (rotation_mode === 3) {
                    body.classList.remove("rotate-270");
                    body.style.width = "auto";
                    body.style.height = h + "px";
                    page.style.width = w + "px";
                    page.style.height = h + "px"
                }
            }
        }
    }
    rotation_mode = rotation_mode === 3 ? 0 : rotation_mode + 1;
    setCookie("rotation_mode", rotation_mode, 30)
}

function changeBgMode() {
    console.log("# change background");
    var page = document.getElementsByClassName("page")[0];
    var pageClasses = page.classList;
    bg_mode = bg_mode === BG_MODE.length - 1 ? 0 : bg_mode + 1;
    setCookie("bg_mode", bg_mode, 30);
    if (bg_mode === 0) {
        pageClasses.remove("light")
        pageClasses.remove("dark")
        pageClasses.add("light")
    } else {
        if (bg_mode === 1) {
            pageClasses.remove("light");
            pageClasses.add("dark")
        } else {
            var date = new Date();
            var utc8DiffMinutes = date.getTimezoneOffset() + 480;
            date.setMinutes(date.getMinutes() + utc8DiffMinutes);
            var hour = date.getHours();
            if (hour > nightHour || hour < morningHour) {
                pageClasses.remove("light");
                pageClasses.add("dark")
            } else {
                pageClasses.remove("dark");
                pageClasses.add("light")
            }
            var icon = document.getElementById("light_dark_icon");
            var middle = document.getElementById("middle");
            icon.style.visibility = "visible";
            middle.style.visibility = "hidden";
            setTimeout(function() {
                icon.style.visibility = "hidden";
                middle.style.visibility = "visible"
            }, 1000)
        }
    }
}

function addEvent(autoMode) {
    document.getElementById("apmOuterWrapper").addEventListener("click", function() {
        console.log("hourCycle change");
        hour24 = !hour24;
        setCookie("hour24", hour24, 30);
        clock(autoMode)
    });
    document.getElementsByClassName("time")[0].addEventListener("click", rotateScreen);
    document.getElementById("date").addEventListener("click", changeBgMode)
};