/*
 +----------------------------------------------------------------------------------------------------------------------------------------------
 * Mimo Script Method
 * update：2017.4
 * Plugin Introduce ：These methods used in MIMO app, to provide relevant support for app, the use of native javescript prepared
 * Copyright (c) 2017.4  高仓雄（gcx / Spring of broccoli）   In Hangzhou, China
 * Contact ：Wechat（lensgcx）
 +----------------------------------------------------------------------------------------------------------------------------------------------
 */


/**
 * go to top 
 * @param t              Total time
 * @param scrTop		 the scroll of icon display/hide position
 * author:  gcx(高仓雄  西兰花的春天)
 */
var gcxgotop = function(t, scrTop) {
	var scroll = mui('#pullrefresh').scroll();
	var pullrefresh = document.querySelector('#pullrefresh');
	var gotop = document.getElementById('gotop');
	var icon = document.querySelector('#gotop svg');
	//The button of go to top'switch (wheel actuating hidden state, stop code to run before the user clicks)
	var hs = false;
	//Monitor scroll event
	pullrefresh.addEventListener('scroll', function(e) {
		e.stopPropagation();
		if(scroll.y <= -scrTop) {
			gotop.style.display = 'block';
			hs = true;
		} else {
			if(hs && gotop.style.display == 'block') {
				setTimeout(function() {
					gotop.style.display = 'none'; //delayed disappearance
				}, 0.4 * t);
			}
			if(gotop.style.display == 'none') {
				//class change
				gotop.classList.remove('gotop-tap');
				gotop.classList.add('gotop-init');
				//change icon
				icon.innerHTML = "<use xlink:href='#icon-huidaodingbu-copy-copy'></use>"
			}
			hs = false;
		}
		console.log(scroll.y);
	})

	//Monitor button(gotop) event
	gotop.addEventListener('tap', function(e) {
		e.stopPropagation();
		//class change
		removeClass(gotop, "gotop-init");
		addClass(gotop, "gotop-tap");
		//event
		setTimeout(function() {
			icon.innerHTML = "<use xlink:href='#icon-huojian'></use>" //change icon
			setTimeout(function() {
				scrollUp(t); //window(.mui-scroll-wrapper) go to top
				setTimeout(function() {
					mui('#pullrefresh').scroll().scrollTo(0, 0); //scroll value clear
				}, 0.4 * t);
			}, 0.3 * t);
		}, 0.3 * t);
	})

	/**
	 * scrollUp  
	 * @param speed
	 */
	function scrollUp(speed) {
		if(mui.os.android) {
			window.scrollTo(0, 0);
		} else if(mui.os.ios) {
			/*这里我特别标注一下，scroll（）方法，就算页面滚动到顶部，然后只要再滑动，立刻回回到刚刚下拉的位置，实际上，
			你要区别pullRefresh()和scroll（），以及pullRefresh.y和scroll.y，页面网上滚动用pullRefresh()方法，然后用
			mui('#pullrefresh').scroll().scrollTo(0, 0)将其归零即可。*/
			mui('#pullrefresh').pullRefresh().scrollTo(0, 0, speed); 
		} else {
			mui('#pullrefresh').pullRefresh().scrollTo(0, 0, speed);
		}
	}
};

/**
 * Underline replace spaces  下划线替换空格
 * @param value
 * @returns {string}
 */
function space_line(value) {
	var reg = / /g;
	new_str = value.replace(reg, '_');
	return new_str;
}
/**
 * 是否包含class类 
 * @param obj
 * @param cls
 * @returns {boolean }
 */
function hasClass(obj, cls) {
	return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
};
/**
 * 添加class类 
 * @param obj
 * @param cls
 */
function addClass(obj, cls) {
	if(!hasClass(obj, cls)) obj.className += " " + cls;
}
/**
 * 删除class类 
 * @param obj
 * @param cls
 */
function removeClass(obj, cls) {
	if(hasClass(obj, cls)) {
		var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
		obj.className = obj.className.replace(reg, " ");
	}
}
/**
 * 取反 添加/删除 class类 
 * @param obj
 * @param cls
 */
function toggleClass(obj, cls) {
	if(this.hasClass(obj, cls)) {
		this.removeClass(obj, cls);
	} else {
		this.addClass(obj, cls);
	}
};

/**
 * 去除所选对象所有的class类 
 * @param obj		操作对象
 * @param cls		去除的class类
 * @param leng       遍历循环长度
 */
function hideallcls(obj, cls, leng) {
	for(var i = 0; i < leng; i++) {
		removeClass(obj, cls);
	}
}

/**
 * 获取vip-icon 等级划分 显示图标class  
 * @param vipclassify    判断对象
 * @returns {string}
 */
function classicon(vipclassify) {
	switch(vipclassify) {
		case 'V':
			return '#icon-VIP1';
			break;
		case 'S':
			return '#icon-vip9';
			break;
		case 'T':
			break;
		case 'H':
			break;
		case 'N':
			return classicon = '';
			break;
	}
};

/**
 * 获取含有指定clss的元素的索引
 * @param obj
 * @param cls
 * @returns {number}
 */
function getindex(obj, cls) {
	for(var i = 0; i < obj.length; i++) {
		if(obj[i].classList.contains(cls)) {
			return i;
		}
	}
}

/**
 * 删除节点对象（可以是多个）
 * @param Label               处理对象标签
 */
function removeNode(Label) {
	var thisNode = document.querySelectorAll(Label);
	var leng = thisNode.length;
	if(leng > 0 && thisNode) {
		for(var i = 0; i < thisNode.length; i++) {
			thisNode[i].parentNode.removeChild(thisNode[i]);
		}
	} else {
		alert("Node is empty or laber is error !");
	}
}

/**
 * 清空对象下所有子节点
 * @param obj               待处理对象
 */
function emptyObj(obj) {
	for(var i = 0; i < obj.length; i++) {
		obj[i].innerHTML = "";
	};
}
/**
 * 隐藏部分节点对象
 * @param obj               待处理对象
 * @param start             待处理对象
 * @param end               待处理对象
 */
function hidePart(obj, start, end) {
	if(start < obj.length) {
		if(start < end) {
			for(var i = start; i < end; i++) {
				obj[i].style.display = 'none';
			}
		} else {
			return false;
		}
	} else {
		return false;
	}
}

/**
 * 显示部分节点对象
 * @param obj               待处理对象
 * @param start             待处理对象
 * @param end               待处理对象
 */
function showPart(obj, start, end) {
	if(start < obj.length) {
		if(start < end) {
			for(var i = start; i < end; i++) {
				obj[i].style.display = 'block';
			}
		} else {
			return false;
		}
	} else {
		return false;
	}
}

/**
 * 显示部分节点对象
 * @param m              输入数字月份值
 */
function chinese_month(m) {
	var mon = parseInt(m);
	if(isNaN(mon) || mon == "") {
		return false;
	} else {
		switch(mon) {
			case 1:
				return month = "一月";
				break;
			case 2:
				return month = "二月";
				break;
			case 3:
				return month = "三月";
				break;
			case 4:
				return month = "四月";
				break;
			case 5:
				return month = "五月";
				break;
			case 6:
				return month = "六月";
				break;
			case 7:
				return month = "七月";
				break;
			case 8:
				return month = "八月";
				break;
			case 9:
				return month = "九月";
				break;
			case 10:
				return month = "十月";
				break;
			case 11:
				return month = "十一月";
				break;
			case 12:
				return month = "十二月";
				break;
		}
	}
}