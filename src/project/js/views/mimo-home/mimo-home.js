/**
 * home view 初始化加载内容
 * @param ipadd
 */
function home_initload(ipadd) {
	var coversStar_url = '' + ipadd + '/MiMo/src/project/json/mimo-cover-stars.json/?jsoncallback=?';
	//star cover 封面模块加载 
	home_starload(coversStar_url);
	//页面初始化先进行一次下拉刷新
	mui('#pullrefresh').pullRefresh().pullupLoading();

}

/**
 * home页 上拉加载  （card modular loading ）
 * @param ipadd			ip地址前缀
 * @param t				加载显示时间
 * @param n     		每次加载数量
 */
function home_upload(ipadd, t, n) {
	//获取 home card 版块数据中，展示用户信息数量
	mui.getJSON('' + ipadd + '/MiMo/src/project/json/mimo-card-stars.json', function(data) {
		//若进行过下拉刷新操作，则把count 计数 清零
		if(refreshflag) count = 0;
		//获取 当前页面已经加载的 card 数量
		var cardNum = document.querySelectorAll('.mimo-home .mimo-home-cardshow .mimo-home-card').length;
		//获取 数据库中 card 的总数量
		var cardLeng = data.mimo.mimocard.length;
		//计算出上拉最大次数
		var uptimes = Math.ceil((cardLeng - n) / n);
		//console.log(cardLeng);
		//console.log(cardLeng - cardNum);
		if(cardLeng - cardNum >= n) {
			setTimeout(function() {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh((++count > uptimes)); //参数为true代表没有更多数据了。
				home_cardload('' + ipadd + '/MiMo/src/project/json/mimo-card-stars.json', cardNum, n);
			}, t);
		} else {
			setTimeout(function() {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh((++count > uptimes)); 
				home_cardload('' + ipadd + '/MiMo/src/project/json/mimo-card-stars.json', cardNum, cardLeng - cardNum);
			}, t);
		}
		//关闭再上拉加载开关
		refreshflag = false;
	});
}

/**
 * focus焦点板块版块   ajax加载
 * @param url
 * @param date
 */
function focusload(url, date) {
	//获取月份
	var Month = date.getMonth() + 1;
	//获取日期
	var Date = date.getDate();
	//填入日期数值
	document.querySelector('.mimo-focus .focusdate h5').innerText = chinese_month(Month);
	document.querySelector('.mimo-focus .focusdate p').innerText = Date;
	//获取对象类
	var dateobj = "focus" + date.getFullYear().toString() + "0" + Month.toString() + Date.toString();
	mui.ajax(url, {
		data: {
			homeloaded: 'true',
		},
		dataType: "jsonp",
		type: "get",
		crossDomain: true,
		jsonp: "jsoncallback",
		timeout: 10000,
		success: function(data) {
			var datainfo = JSON.parse(data);
			var focuscont = eval("datainfo." + dateobj + "");
			document.querySelectorAll('.mimo-focus .focuscont p span')[0].innerText = focuscont.focus_tit;
			document.querySelectorAll('.mimo-focus .focuscont p span')[1].innerText = focuscont.focus_subtit;
			document.querySelector('.mimo-focus .focus-tomorrow span').innerText = focuscont.focus_tomorrow;
		},
		error: function(xhr, type, errorThrown) {
			type == 'timeout' ? mui.toast("请求超时：请检查网络") : mui.toast('请求失败：' + type + '\n err:' + errorThrown);
		}
	});
}

/**
 * home 页  star版块loading  ajax加载
 * @param url
 */
function home_starload(url) {
	mui.ajax(url, {
		data: {
			homeloaded: 'true',
		},
		dataType: "jsonp", 
		type: "get", 
		crossDomain: true, 
		jsonp: "jsoncallback",
		timeout: 10000, 
		success: function(data) {
			var datainfo = JSON.parse(data);
			star_modular(datainfo);
		},
		error: function(xhr, type, errorThrown) {
			type == 'timeout' ? mui.toast("请求超时：请检查网络") : mui.toast('请求失败：' + type + '\n err:' + errorThrown);
		}
	});
}
/**
 * mimo 红人(star modular)内容填充  
 */
function star_modular(data) {
	mui('.mimo-home .mui-scroll .mimo-home-stars .mimo-home-starsp').each(function(i) {
		var starshow =
			"<div class='card-portrait'>" +
			"<img src=" + data.mimo.mimostar[i].userstar.portrait + " alt=" + space_line(data.mimo.mimostar[i].userstar.name) + " />" +
			"<svg class='mimo-icon vip-icon-add vip-icon-fs' aria-hidden='true'>" +
			"<use xlink:href=" + classicon(data.mimo.mimostar[i].userstar.vipclassify) + ">" + "</use>" +
			"</svg>" +
			"</div>";
		starshow +=
			"<p class='text-hide-row1'>" + data.mimo.mimostar[i].userstar.name + "<br/>" +
			"<span class = 'text-hide-row1'>" + data.mimo.mimostar[i].userstar.signature + "</span>" +
			"</p>";
		this.innerHTML = starshow;
	});
}

/**
 * home 页  card版块loading  ajax加载
 * @param data
 * @param start       信息写入起始位置
 * @param leng		    信息写入长度	
 */
function home_cardload(url, start, leng) {
	mui.ajax(url, {
		data: {
			homeloaded: 'true',
		},
		dataType: "jsonp",
		type: "get",
		crossDomain: true,
		jsonp: "jsoncallback",
		timeout: 10000,
		success: function(data) {
			var datainfo = JSON.parse(data);
			card_modular(datainfo, start, leng)
		},
		error: function(xhr, type, errorThrown) {
			type == 'timeout' ? mui.toast("请求超时：请检查网络") : mui.toast('请求失败：' + type + '\n err:' + errorThrown);
		}
	});
}
/**
 * vip card 著名博主博文展示 (card modular) 内容填充 
 * @param data
 * @param start       信息写入起始位置
 * @param leng		    信息写入长度	
 */
function card_modular(data, start, leng) {
	for(var i = start; i < start + leng; i++) {
		var mimo_home_card = document.createElement("div");
		var mui_card_content = document.createElement("div");
		var mimo_card_conttext = document.createElement("div");
		//add class
		addClass(mimo_home_card, "mui-card mimo-home-card");
		addClass(mui_card_content, "mui-card-content");
		addClass(mimo_card_conttext, "mui-card-content-inner mimo-card-conttext text-hide-row3 mimo-star-article");

		document.querySelector('.mimo-home .mui-scroll .mimo-home-cardshow').appendChild(mimo_home_card);
		//definition html
		var cardhead =
			"<div class='mui-card-header mui-card-media clear-both'>" +
			"<div class='card-portrait mui-pull-left' style='width:34px;'>" +
			"<img src=" + data.mimo.mimocard[i].carduser.portrait + " alt=" + space_line(data.mimo.mimocard[i].carduser.name) + " />" +
			"<svg class='mimo-icon vip-icon-add vip-icon-fs' aria-hidden='true'>" +
			"<use xlink:href=" + classicon(data.mimo.mimocard[i].carduser.vipclassify) + ">" + "</use>" +
			"</svg>" +
			"</div>" +
			"<div class='mui-media-body .mui-pull-left'>" +
			data.mimo.mimocard[i].carduser.name +
			"<p class='text-hide-row1 font-weight-400'>" +
			data.mimo.mimocard[i].carduser.signature +
			"</p>" +
			"</div>" +
			"</div>";
		//card head innerHtml
		mimo_home_card.innerHTML = cardhead;
		//create card content
		mimo_home_card.appendChild(mui_card_content);
		//content img Part innerHtml
		var cardcontent = "<img src=" + data.mimo.mimocard[i].carduser.blog[0].article.cover + " alt=" + space_line(data.mimo.mimocard[i].carduser.blog[0].article.tit) + " width='100%'/>"
		mui_card_content.innerHTML = cardcontent;
		//create card content txt
		mui_card_content.appendChild(mimo_card_conttext);
		//load txt
		mui(mimo_card_conttext).load(data.mimo.mimocard[i].carduser.blog[0].article.txt);
	}
}