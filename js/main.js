window.onload=function(){if(timezoneOffset!==""){timezoneOffset=Number(timezoneOffset);clock(bg_autoMode);time_timer=setInterval("clock("+bg_autoMode+")",60*1000)}else{getTimezoneOffset()}if(rotation_mode!==""){rotation_mode=Number(rotation_mode)}else{rotation_mode=rotation_mode_default;setCookie("rotation_mode",rotation_mode,30)}rotation_mode=rotation_mode===0?3:rotation_mode-1;rotateScreen();if(hour24!==""){hour24=hour24==="true"?true:false}else{hour24=hour24_default;setCookie("hour24",hour24,30)}if(top_mode!==""){top_mode=Number(top_mode)}else{top_mode=top_mode_default;setCookie("top_mode",top_mode,30)}top_mode=top_mode===0?TOP_MODE.length-1:top_mode-1;changeTopMode();if(bottom_mode!==""){bottom_mode=Number(bottom_mode)}else{bottom_mode=bottom_mode_default;setCookie("bottom_mode",bottom_mode,30)}bottom_mode=bottom_mode===0?BOTTOM_MODE.length-1:bottom_mode-1;changeBottomMode();if(bg_mode!==""){bg_mode=Number(bg_mode);bg_mode=bg_mode===0?BG_MODE.length-1:bg_mode-1;changeBgMode()}else{bg_mode=bg_mode_default;setCookie("bg_mode",bg_mode,30)}addEvent(bg_autoMode)};var ALAPI_TOKEN="pBsICqbRV2eVtGiI";var UNSPLASH_ID="bXwWoUhPeVw-yvSesGMgaOENnlSzhHYB43kZIQOR8cQ";var TOP_MODE=["nonetop","hitokoto","poem","weibo"];var BOTTOM_MODE=["nonebtm","weather"];var BG_MODE=["none","dark","auto","pic"];var morningHour=6;var nightHour=19;var top_mode_default=1;var bottom_mode_default=1;var bg_mode_default=0;var rotation_mode_default=0;var hour24_default=false;var bg_autoMode=false;var weibo_num=3;var cip=returnCitySN.cip;var top_mode=getCookie("top_mode");var bottom_mode=getCookie("bottom_mode");var bg_mode=getCookie("bg_mode");var rotation_mode=getCookie("rotation_mode");var hour24=getCookie("hour24");var timezoneOffset=getCookie("timezoneOffset");var hitokoto_data=null;var weibo_data=null;var poem_data=null;var weather_data=null;var pic_data=null;var dd_data=null;var hitokoto_timer=null;var poem_timer=null;var weibo_timer=null;var time_timer=null;var weather_timer=null;var pic_timer=null;var weaImgs={xue:["&#xe645;","&#xe645;"],lei:["&#xe643;","&#xe643;"],shachen:["&#xe646;","&#xe646;"],wu:["&#xe647;","&#xe647;"],bingbao:["&#xe667;","&#xe667;"],yun:["&#xe648;","&#xe648;"],duoyun:["&#xe648;","&#xe648;"],yu:["&#xe64b;","&#xe64b;"],yin:["&#xe64a;","&#xe652;"],qing:["&#xe649;","&#xe764;"],weizhi:["&#xe6f2;","&#xe6f2;"],};var autoModeImg="&#xe8e3";function createXHR(){var xhr=null;if(window.XMLHttpRequest){xhr=new XMLHttpRequest()}else{if(window.ActiveXObject){xhr=new ActiveXObject("Microsoft.XMLHTTP")}}return xhr}function hitokoto(){console.log("hitokoto update");var xhr=createXHR();xhr.open("GET","https://v1.hitokoto.cn?encode=json&charset=utf-8",true);xhr.onreadystatechange=function(){if(this.readyState==4){hitokoto_data=JSON.parse(this.responseText);document.getElementById("brackets-l").innerHTML="『";document.getElementById("brackets-r").innerHTML="』";document.getElementById("hitokoto").innerHTML=hitokoto_data.hitokoto;document.getElementById("from").innerHTML=hitokoto_data.from_who?"「"+hitokoto_data.from+" "+hitokoto_data.from_who+"」":"「"+hitokoto_data.from+"」"}};xhr.send(null)}function poem(){console.log("poem update");jinrishici.load(function(result){poem_data=result.data;var sentence=document.querySelector("#poem_sentence");var info=document.querySelector("#poem_info");sentence.innerHTML=poem_data.content;info.innerHTML="【"+poem_data.origin.dynasty+"】"+poem_data.origin.author+"《"+poem_data.origin.title+"》"})}function getTimezoneOffset(){var xhr=createXHR();xhr.open("GET","https://worldtimeapi.org/api/ip/"+(cip||null),true);xhr.onreadystatechange=function(){if(this.readyState==4){timezoneOffset=JSON.parse(this.responseText).raw_offset/60;setCookie("timezoneOffset",timezoneOffset,30);clock()}};xhr.send(null)}function clock(autoMode){var date=new Date();var utc8DiffMinutes=date.getTimezoneOffset()+timezoneOffset;date.setMinutes(date.getMinutes()+utc8DiffMinutes);var MM=date.getMonth()+1;var dd=date.getDate();var day=date.getDay();var hour=date.getHours();var minutes=date.getMinutes();var lightMode=true;if(autoMode){if(hour>nightHour||hour<morningHour){if(lightMode){document.getElementsByClassName("page")[0].style.color="#ffffff";document.getElementsByClassName("page")[0].style.backgroundColor="#000000";lightMode=false}}else{if(!lightMode){document.getElementsByClassName("page")[0].style.color="#000000";document.getElementsByClassName("page")[0].style.backgroundColor="#ffffff";lightMode=true}}}if(!hour24){var apm="上<br>午";if(hour>12){apm="下<br>午";hour-=12}document.getElementById("apm").innerHTML=apm}else{document.getElementById("apm").innerHTML=""}var timeString=hour+":"+("0"+minutes).slice(-2);document.getElementById("time").innerHTML=timeString;if(!dd_data||dd!==dd_data){console.log("get lunar");dd_data=dd;var dateString=MM+"月"+dd+"日";var weekList=["日","一","二","三","四","五","六"];var weekString="星期"+weekList[day];document.getElementById("date").innerHTML=dateString+" "+weekString;getLunar();getHoliday()}}function getLunar(){var lunarString="";
var xhr=createXHR();xhr.open("GET","https://v2.alapi.cn/api/lunar?token="+ALAPI_TOKEN);xhr.onreadystatechange=function(){if(this.readyState==4){var data=JSON.parse(this.responseText);console.log(data);if(data.code===200){var lunar_data=data.data;lunarString=lunar_data.ganzhi_year+"年"+lunar_data.lunar_month_chinese+lunar_data.lunar_day_chinese;lunar=document.getElementById("lunar").innerHTML=lunarString;console.log(lunar_data)}else{console.error("农历数据获取失败")}}};xhr.send(null)}function getHoliday(){var xhr=createXHR();xhr.open("GET","https://timor.tech/api/holiday/info/");xhr.onreadystatechange=function(){if(this.readyState==4){if(this.status===200){var data=JSON.parse(this.responseText);console.log(data);data.holiday&&(document.getElementById("holiday").innerHTML="&nbsp;&nbsp;"+data.holiday.name)}else{console.error("节假日数据获取失败")}}};xhr.send(null)}function weather(){console.log("weather update");var xhr=createXHR();xhr.open("GET","https://v2.alapi.cn/api/tianqi?token="+ALAPI_TOKEN+"&ip="+cip,true);xhr.onreadystatechange=function(){if(this.readyState==4){var data=JSON.parse(this.responseText);if(data.code===200){weather_data=data.data;var imgs=weaImgs[weather_data.weather_code];var img=imgs[0];var date=new Date();var utc8DiffMinutes=date.getTimezoneOffset()+480;date.setMinutes(date.getMinutes()+utc8DiffMinutes);var hour=date.getHours();if(hour>nightHour||hour<morningHour){img=imgs[1]}var weaImg='<span class="iconfont">'+img+"</span>"+"<div>天气："+weather_data.weather+"</div>";var weaTemp='<div class="tempNum">'+weather_data.temp+'</div><div class="symbol">&#8451;</div>'+"<div>当前气温</div>";var highTemp=weather_data.max_temp;var lowTemp=weather_data.min_temp;var air=weather_data.aqi.air;air=air?air:"未知";var airLevel=weather_data.aqi.air_level;airLevel=airLevel&&air?airLevel:"";var updateTime=weather_data.update_time.split(" ");updateTime=updateTime[updateTime.length-1];var weaInfo="<div>"+weather_data.city+"气温："+highTemp+"/"+lowTemp+"&#8451;</div>"+"<div>湿度："+weather_data.humidity+"</div>"+"<div>空气质量："+air+airLevel+"</div>"+"<div>风向："+weather_data.wind+"</div>"+"<div>风速："+weather_data.wind_speed+" "+weather_data.wind_scale+"</div>"+"<div>更新时间："+updateTime+"</div>";document.getElementById("weaTitle").innerHTML="";document.getElementById("weaImg").innerHTML=weaImg;document.getElementById("weaTemp").innerHTML=weaTemp;document.getElementById("weaInfo").innerHTML=weaInfo}else{console.error("天气数据获取失败: "+weather_data.msg);document.getElementById("weaTitle").innerHTML="数据获取失败，请稍后再试～"}}};xhr.send(null)}function weibo(){console.log("weibo update");var xhr=createXHR();xhr.open("GET","https://v2.alapi.cn/api/new/wbtop?num="+weibo_num,true);xhr.setRequestHeader("token",ALAPI_TOKEN);xhr.onreadystatechange=function(){if(this.readyState==4){var data=JSON.parse(this.responseText);var weibo_title=document.getElementsByClassName("weibo_title")[0];var hot_word=document.getElementById("hot_word");var hot_word_num=document.getElementById("hot_word_num");if(data.code===200){weibo_data=data.data;weibo_title.innerHTML="微博实时热搜";hot_word.innerHTML="";hot_word_num.innerHTML="";for(var i=0;i<weibo_num;i++){var index=i+1;hot_word.innerHTML+="<li>"+index+". "+weibo_data[i].hot_word+"</li>";hot_word_num.innerHTML+="<li>"+weibo_data[i].hot_word_num+"</li>"}}else{console.error("微博热搜数据获取失败: "+data.msg);weibo_title.innerHTML="数据获取失败，请稍后再试～"}}};xhr.send(null)}function picture(){console.log("picture update")}function changeMode(pos){console.log("# change "+pos+" mode");var pos_mode=eval(pos+"_mode");var POS_MODE=eval(pos.toUpperCase()+"_MODE");if(pos_mode!==0&&eval(POS_MODE[pos_mode]+"_timer")){clearInterval(eval(POS_MODE[pos_mode]+"_timer"));eval(POS_MODE[pos_mode]+"_timer = null");console.log(POS_MODE[pos_mode]+"_timer destroyed")}pos_mode++;if(pos_mode===POS_MODE.length){pos_mode=0}eval(pos+"_mode = pos_mode");setCookie(pos+"_mode",pos_mode,30);if(pos_mode!==0){if(!eval(POS_MODE[pos_mode]+"_data")){eval(POS_MODE[pos_mode]+"()")}eval(POS_MODE[pos_mode]+'_timer = setInterval(POS_MODE[pos_mode] + "()", 60 * 1000 * 20)');console.log(POS_MODE[pos_mode]+"_timer created")}for(var i=0;i<POS_MODE.length;i++){document.getElementsByClassName(POS_MODE[i]+"_container")[0].style.display="none"}document.getElementsByClassName(POS_MODE[pos_mode]+"_container")[0].style.display="block"}function changeTopMode(){changeMode("top")}function changeBottomMode(){changeMode("bottom")}function rotateScreen(){console.log("# rotate screen "+rotation_mode);var body=document.getElementsByTagName("body")[0];var page=document.getElementsByClassName("page")[0];var w=document.documentElement.clientWidth||document.body.clientWidth;var h=document.documentElement.clientHeight||document.body.clientHeight;if(rotation_mode===0){body.classList.add("rotate-90");body.style.height=w+"px";page.style.width=h+"px";page.style.height=w+"px"}else{if(rotation_mode===1){body.classList.remove("rotate-90");body.classList.add("rotate-180");body.style.height=h+"px";page.style.width=w+"px";page.style.height=h+"px"
}else{if(rotation_mode===2){body.classList.remove("rotate-180");body.classList.add("rotate-270");body.style.width=h+"px";page.style.height=w+"px";page.style.width="auto"}else{if(rotation_mode===3){body.classList.remove("rotate-270");body.style.width="auto";body.style.height=h+"px";page.style.width=w+"px";page.style.height=h+"px"}}}}rotation_mode=rotation_mode===3?0:rotation_mode+1;setCookie("rotation_mode",rotation_mode,30)}function changeBgMode(){console.log("# change background");var page=document.getElementsByClassName("page")[0];var pageClasses=page.classList;bg_mode=bg_mode===BG_MODE.length-1?0:bg_mode+1;setCookie("bg_mode",bg_mode,30);if(bg_mode===0){clearInterval(pic_timer);pic_timer=null;pageClasses.remove("pic");console.log("picture close");pageClasses.add("light")}else{if(bg_mode===1){pageClasses.remove("light");pageClasses.add("dark")}else{if(bg_mode===2){var date=new Date();var utc8DiffMinutes=date.getTimezoneOffset()+480;date.setMinutes(date.getMinutes()+utc8DiffMinutes);var hour=date.getHours();if(hour>nightHour||hour<morningHour){pageClasses.remove("light");pageClasses.add("dark")}else{pageClasses.remove("dark");pageClasses.add("light")}var icon=document.getElementById("light_dark_icon");var middle=document.getElementById("middle");icon.style.visibility="visible";middle.style.visibility="hidden";setTimeout(function(){icon.style.visibility="hidden";middle.style.visibility="visible"},1000)}else{console.log("picture open");if(!pic_data){picture()}pic_timer=setInterval("picture()",60*1000*60);pageClasses.remove("light");pageClasses.remove("dark");pageClasses.add("pic")}}}}function addEvent(autoMode){document.getElementById("apmOuterWrapper").addEventListener("click",function(){console.log("hourCycle change");hour24=!hour24;setCookie("hour24",hour24,30);clock(autoMode)});document.getElementsByClassName("time")[0].addEventListener("click",rotateScreen);document.getElementById("top").addEventListener("click",changeTopMode);document.getElementById("bottom").addEventListener("click",changeBottomMode);document.getElementById("date").addEventListener("click",changeBgMode)};