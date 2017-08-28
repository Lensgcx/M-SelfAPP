/** 
    @ Name : Kingwell Javascript Library 
    @ Author :kingwell 
    @ Date : 2012-8-22 
    @ Email : jinhua.leng##gmail.com 
    @ Version : 1.2 
    @ Update : http://kingwell-leng.iteye.com/blog/1570768 
    功能： 
    1:  $ID选择 
    2： 事件绑定，事件移除，获取事件目标 
    3： 阻止冒泡，阻止默认事件 
    4： 显示隐藏 
    5： 去除HTML 
    6： 去除首尾空格 
    7： 获取URL参数 
    8： Cookie操作，设置，删除，获取 
    9： 清除所有Cookie 
    10：表格排序 
    11: 动态转入Javascript 
    12: 封装Ajax 
    13：将HTML编码 
    调用方法： 
    KW.x(); 
     */
(function() {
	if(!window.KW) {
		window.KW = {};
	};
	window.KW = {
		version: "1.2",
		$: function() { //$()函数  
			var elements = new Array();
			for(var i = 0; i <= arguments.length; i++) {
				var element = arguments[i];
				//如果是一个字符串那假设它是一个ID  
				if(typeof element == 'string') {
					element = document.getElementById(element);
				}
				//如果只提供了一个参数,则立即返回这个参数  
				if(arguments.length == 1) {
					return element;
				}
				//否则，将它添加到数组中  
				elements.push(element);
			}
			return elements;
		},
		/*-------------------- 事件处理 --------------------*/
		addEvent: function(oTarget, oType, fnHandler) { //-----添加事件;  
			var oT = typeof oTarget == "string" ? this.$(oTarget) : oTarget;
			if(!oT) {
				alert('Not found \" ' + oTarget + ' \"');
				return false
			};
			if(oT.addEventListener) { //for DOM  
				oT.addEventListener(oType, fnHandler, false);
			} else if(oT.attachEvent) { //for IE  
				oT.attachEvent('on' + oType, fnHandler);
			} else { //for Others  
				oT['on' + oType] = fnHandler;
			}
		},
		removeEvent: function(oTarget, oType, fnHandler) { //-----移除事件;  
			var oT = this.$(oTarget);
			if(!oT) {
				alert('Not found \" ' + oTarget + ' \"');
				return false
			};
			if(oT.removeEventListener) { //for DOM  
				oT.removeEventListener(oType, fnHandler, false);
			} else if(oT.detachEvent) { //for IE  
				oT.detachEvent('on' + oType, fnHandler);
			} else { //for Others  
				oT['on' + oType] = null;
			}
		},
		getEvent: function(ev) { //-----获得事件-----  
			return ev || window.event;
		},
		getTarget: function(ev) { //-----获取目标----  
			return this.getEvent(ev).target || this.getEvent().srcElement;
		},
		stopPropagation: function() { //-----阻止冒泡-----  
			if(window.event) {
				return this.getEvent().cancelBubble = true;
			} else {
				return arguments.callee.caller.arguments[0].stopPropagation();
			}
		},
		stopDefault: function() { //-----阻止默认行为  
			if(window.event) {
				return this.getEvent().returnValue = false;
			} else {
				return arguments.callee.caller.arguments[0].preventDefault();
			}
		},
		/*-------------------- 常用函数 --------------------*/
		toggleDisplay: function(id) { //-----显示，隐藏-----  
			var oTarget = this.$(id);
			if(!oTarget) {
				return false;
			}
			oTarget.style.display == 'none' ? oTarget.style.display = 'block' : oTarget.style.display = 'none';
		},
		stripHTML: function(agr) { //-----移除HTML-----  
			var reTag = /<(?:.|\s)*?>/g;
			return agr.replace(reTag, '')
		},
		stripSpace: function(oTarget) { //-----移除空格-----  
			var re = /^\s*(.*?)\s*$/;
			return oTarget.replace(re, '$1');
		},
		isEmail: function(e) { //-----Is E-mail  
			var re = /^[a-zA-z_][a-zA-Z_0-9]*?@\w{1,}.\[a-zA-Z]{1,}/;
			return re.test(e);
		},
		/*-------------------- Cookie操作 --------------------*/
		setCookie: function(sName, sValue, oExpires, sPath, sDomain, bSecure) { //-----设置Cookie-----  
			var sCookie = sName + '=' + encodeURIComponent(sValue);
			if(oExpires) {
				var date = new Date();
				date.setTime(date.getTime() + oExpires * 60 * 60 * 1000);
				sCookie += '; expires=' + date.toUTCString();
			}
			if(sPath) {
				sCookie += '; path=' + sPath;
			}
			if(sDomain) {
				sCookie += '; domain=' + sDomain;
			}
			if(bSecure) {
				sCookie += '; secure';
			}
			document.cookie = sCookie;
		},
		getCookie: function(sName) { //-----获得Cookie值-----  
			var sRE = '(?:; )?' + sName + '=([^;]*)';
			var oRE = new RegExp(sRE);
			if(oRE.test(document.cookie)) {
				return decodeURIComponent(RegExp['$1']);
			} else {
				return null;
			}
		},
		deleteCookie: function(sName, sPath, sDomain) { //-----删除Cookie值-----  
			this.setCookie(sName, '', new Date(0), sPath, sDomain);
		},
		clearCookie: function() { //清除所有Cookie  
			var cookies = document.cookie.split(";");
			var len = cookies.length;
			for(var i = 0; i < len; i++) {
				var cookie = cookies[i];
				var eqPos = cookie.indexOf("=");
				var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
				name = name.replace(/^\s*|\s*$/, "");
				document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"
			}
		},
		convert: function(sValue, sDataType) { //类型转，根据不同类型数据排序，比如，整型，日期，浮点，字符串，接受两个参数，一个是值，一个是排序的数据类型  
			switch(sDataType) {
				case "int":
					return parseInt(sValue);
				case "float":
					return parseFloat(sValue);
				case "date":
					return new Date(Date.parse(sValue));
				default:
					return sValue.toString();
			}
		},
		geterateCompareTRs: function(iCol, sDataType) { //比较函数，用于sort排序用  
			return function compareTRs(oTR1, oTR2) {
				var vValue1,
					vValue2;
				if(oTR1.cells[iCol].getAttribute("value")) { //用于高级排序，比如图片，添加一个额外的属性来排序  
					vValue1 = KW.convert(oTR1.cells[iCol].getAttribute("value"), sDataType);
					vValue2 = KW.convert(oTR2.cells[iCol].getAttribute("value"), sDataType);
				} else {
					vValue1 = KW.convert(oTR1.cells[iCol].firstChild.nodeValue, sDataType);
					vValue2 = KW.convert(oTR2.cells[iCol].firstChild.nodeValue, sDataType);
				}
				if(vValue1 < vValue2) {
					return -1;
				} else if(vValue1 > vValue2) {
					return 1;
				} else {
					return 0;
				}
			}
		},
		tabSort: function(sTableID, iCol, sDataType) { //排序函数，sTableID为目标,iCol哪列排序，为必需，sDataType可选  
			var oTable = document.getElementById(sTableID);
			var oTBody = oTable.tBodies[0];
			var colDataRows = oTBody.rows;
			var aTRs = [];
			var len = colDataRows.length;
			for(var i = 0; i < len; i++) {
				aTRs[i] = colDataRows[i];
			};
			if(oTable.sortCol == iCol) { //如果已经排序，则倒序  
				aTRs.reverse();
			} else {
				aTRs.sort(this.geterateCompareTRs(iCol, sDataType));
			}
			var oFragment = document.createDocumentFragment();
			var trlen = aTRs.length;
			for(var j = 0; j < trlen; j++) {
				oFragment.appendChild(aTRs[j]);
			};
			oTBody.appendChild(oFragment);
			oTable.sortCol = iCol; //设置一个状态  
		},
		GetQueryString: function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if(r != null)
				return unescape(r[2]);
			return null;
		},
		HTMLEscape: function(str) {
			var s = "";
			if(str.length == 0) {
				return "";
			}
			s = str.replace(/&/g, "&amp;");
			s = s.replace(/</g, "&lt;");
			s = s.replace(/>/g, "&gt;");
			s = s.replace(/ /g, "&nbsp;");
			s = s.replace(/\'/g, "&#39;");
			s = s.replace(/\"/g, "&quot;");
			return s;
		},
		loadJS: function(url) {
			var statu = true; //初始状态  
			var js = document.getElementsByTagName("script");
			var len = js.length;
			for(var i = 0; i < len; i++) {
				if(js[i].getAttribute("src") == url) {
					statu = false; //如果已经添加，则设置为Flase，不再添加  
				}
			}
			if(statu) {
				var script = document.createElement("script");
				script.type = "text/javascript";
				script.src = url;
				var header = document.getElementsByTagName("head")[0];
				header.appendChild(script);

			}
		},
		ajax: function(obj) {
			if(!obj.url) {
				return false;
			};
			var method = obj.type || "GET";
			var async = obj.async || true;
			var dataType = obj.dataType;
			var XHR = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
			XHR.open(method, obj.url, async);
			XHR.setRequestHeader('If-Modified-Since', 'Thu, 06 Apr 2006 00:00: 00 GMT');
			XHR.send(null);
			if(obj.sendBefore) {
				obj.sendBefore();
			};
			XHR.onreadystatechange = function() {
				if(XHR.readyState == 4 && (XHR.status >= 200 && XHR.status < 300 || XHR.status == 304)) {

					if(obj.success) {
						if(dataType && dataType.toLocaleLowerCase() === "json") {
							obj.success(eval("(" + XHR.responseText + ")"))
						} else if(dataType && dataType.toLocaleLowerCase() === "xml") {
							obj.success(XHR.responseXML)
						} else {
							obj.success(XHR.responseText);
						}
					};
					if(obj.complete) {
						obj.complete()
					}

				} else {
					if(obj.complete) {
						obj.complete()
					}
					if(obj.error) {
						obj.error("The XMLHttpRequest failed. status: " + XHR.status);
					}

				}

			}
		}

	};

})();