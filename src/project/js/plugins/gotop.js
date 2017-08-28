/*
 +----------------------------------------------------------------------------------------------------------------------------------------------
 * jQuery gcxRegslideForm Plugin v1.1.0
 * update：2017.2
 * Plugin Introduce ：This plugin is based on jQuery development, using the plugin page form, according to user needs, custom plug-in content,
 * 					  with the help of validate, can be dynamically to verify the form and submit verification.
 * Copyright (c) 2017.2  高仓雄（gcx / Spring of broccoli）   In Hangzhou, China
 * Contact ：Wechat（lensgcx）
 +----------------------------------------------------------------------------------------------------------------------------------------------
 */
(function(factory) {
	if(typeof define === "function" && define.amd) {
		define(["jquery"], factory);
	} else {
		factory(jQuery);
	}
}(function($) {
	var defaults = {
		//language judgment
		scroll_win: '#pullrefresh',
		gotop_btn: '#gotop',
		language: 'zh_ch', //Simplified Chinese
		gotop_time: 2000,
		t1: 600,
		t2: 600,
		t3: 800
	};
	$.fn.extend({
		"gcxgoTop": function(options) {
			// Extend with options
			opts = $.extend(true, {}, defaults, speedOrtime, structure, nomodifiable, tagName, content, options);

			//Check whether the user enters the parameters are legitimate
			if(!isValid(options)) {
				return this;
			}
			return this.each(function() {
				_init(opts);
			});
		}
	});
	//Check whether the user enters the parameters are legitimate
	function isValid(options) {
		return !options || (options && typeof options === "object") ? true : false;
	}

	function _init(opts) {
		listenScroll(opts);
		tap(opts);
	}

	//回到顶部按钮 隐藏开关 （ 滚轮引动状态下，阻止用户点击前的代码运行 ）
	var listenScroll = function(opts) {
		var hs = false;
		var scroll = mui(opts.scroll_win).scroll();
		var gotop = document.querySelector(opts.gotop_btn);
		document.querySelector(opts.scroll_win).addEventListener('scroll', function(e) {
			e.stopPropagation();
			if(scroll.y <= -1200) {
				gotop.style.display = 'block';
				hs = true;
			} else {
				if(hs && gotop.style.display == 'block') {
					setTimeout(function() {
						gotop.style.display = 'none';
					}, 800);
				}
				if(gotop.style.display == 'none') {
					gotop.classList.remove('gotop-tap');
					gotop.classList.add('gotop-init');
					document.querySelector("" + opts.gotop_btn + " svg").innerHTML = "<use xlink:href='#icon-huidaodingbu-copy-copy'></use>"
				}
				hs = false;
			}
			console.log(scroll.y);
		});
	}

	//点击回到顶部
	var tap = function(opts) {
		var gotop = document.querySelector(opts.gotop_btn);
		gotop.addEventListener('tap', function(e) {
			e.stopPropagation();
			var icon = document.querySelector("" + opts.gotop_btn + " svg");
			removeClass(gotop, "gotop-init");
			addClass(gotop, "gotop-tap");
			setTimeout(function() {
				icon.innerHTML = "<use xlink:href='#icon-huojian'></use>"
				setTimeout(function() {
					_scrollUp(opts.gotop_time);
					setTimeout(function() {
						mui(opts.scroll_win).scroll().scrollTo(0, 0);
					}, opts.t3);
				}, opts.t2);
			}, opts.t1);
		});
	};

	/**
	 * scrollUp
	 * @param opts
	 * @param speed
	 */
	function _scrollUp(opts, speed) {
		if(mui.os.android) {
			window.scrollTo(0, 0);
		} else if(mui.os.ios) {
			mui(opts.scroll_win).pullRefresh().scrollTo(0, 0, speed);
		} else {
			mui(opts.scroll_win).pullRefresh().scrollTo(0, 0, speed);
		}
	}
}));