;(function(){

'use strict';

window.BX24 = {};

/***************** private properties ******************/
var
isInit = false,
initList = [],
installList = [],

/* ready props */
isReady = false,
readyList = [],

/* list of registered proxy functions */
proxySalt = Math.random(),
proxyId = 1,
proxyList = [],
proxyContext = null,

/* list of registered event handlers */
eventsList = [],

/* chars list for string id generator */
charsList = '0123456789abcdefghijklmnopqrstuvwxyz';

/*************** public section ***********************/

BX24.init = function(callback)
{
	if(!!callback)
	{
		initList.push(callback);
	}
};

BX24.install = function(callback)
{
	if(!!callback)
	{
		installList.push(callback);
	}
};

BX24.installFinish = function()
{
	sendMessage('setInstallFinish',{});
};

BX24.callMethod = function(method, params, callback)
{
	return ajax({
		method: method,
		data: params,
		callback: callback
	});
};

/*
calls = [[method,params],[method,params]];
calls = [{method:method,params:params},[method,params]];
calls = {call_id:[method,params],...};
*/
BX24.callBatch = function(calls, callback, bHaltOnError)
{
	var cmd = util.type.isArray(calls) ? [] : {}, cnt = 0, cb = function(cmd){
		ajax.batch(cmd, callback, bHaltOnError);
	};

	for(var i in calls)
	{
		var method = null, params = null;

		if(!!calls[i] && calls.hasOwnProperty(i))
		{
			if(util.type.isArray(calls[i]))
			{
				method = calls[i][0]; params = calls[i][1];
			}
			else if (!!calls[i].method)
			{
				method = calls[i].method; params = calls[i].params;
			}

			if(!!method)
			{
				cnt++;
				cmd[i] = [method,params];
			}
		}
	}

	if(cnt > 0)
	{
		var e = function(i)
		{
			return function(str)
			{
				cmd[i] = cmd[i][0]+'?'+str;
				if(--cnt <= 0)
					cb(cmd);
			}
		}

		for(var i in cmd)
		{
			ajax.prepareData(cmd[i][1], '', e(i));
		}
	}

	return;
};

BX24.callBind = function(event, handler, auth_type, callback)
{
	if(!isInit)
	{
		var _a = arguments;
		BX24.init(function(){
			BX24.callBind.apply(document,_a);
		});
	}
	else if(BX24.isAdmin())
	{
		var p = {
			event: event||'',
			handler: handler||'',
			auth_type: (typeof auth_type == 'undefined') ? 0 : auth_type
		};

		return BX24.callMethod('event.bind', p, callback);
	}

	return false;
};

BX24.callUnBind =
BX24.callUnbind = function(event, handler, auth_type, callback)
{
	if(!isInit)
	{
		var _a = arguments;
		BX24.init(function(){
			BX24.callUnBind.apply(document,_a);
		});
	}
	else if(BX24.isAdmin())
	{
		var p = {
			event: event||'',
			handler: handler||''
		};

		if(typeof auth_type != 'undefined' && auth_type !== null)
		{
			p.auth_type = auth_type;
		}

		return BX24.callMethod('event.unbind', p, callback);
	}

	return false;
};

BX24.canUse = function(method)
{
	switch(method)
	{
		case 'upload':
			return fileReader.canUse();
		default:
			return true;
	}
};

BX24.isAdmin = function()
{
	return !!PARAMS.IS_ADMIN;
};

BX24.getAuth = function()
{
	return (isInit && PARAMS.AUTH_EXPIRES > (new Date()).valueOf())
		? {access_token: PARAMS.AUTH_ID, refresh_token: PARAMS.REFRESH_ID, expires_in: PARAMS.AUTH_EXPIRES, domain: PARAMS.DOMAIN, member_id: PARAMS.MEMBER_ID}
		: false;
};

BX24.getLang = function()
{
	return PARAMS.LANG;
};

BX24.getDomain = function()
{
	return PARAMS.DOMAIN;
};

BX24.refreshAuth = function(cb)
{
	if(isInit)
	{
		sendMessage('refreshAuth', {}, function(p){
			PARAMS.AUTH_ID = p.AUTH_ID;
			PARAMS.REFRESH_ID = p.REFRESH_ID;
			PARAMS.AUTH_EXPIRES = (new Date()).valueOf()+p.AUTH_EXPIRES*1000;
			if(!!cb)
			{
				cb(BX24.getAuth());
			}
		});
	}
};

BX24.resizeWindow = function(width, height, cb)
{
	width = parseInt(width); height = parseInt(height);
	if(width > 0 && height > 0)
	{
		sendMessage('resizeWindow', {width:width,height:height}, cb);
	}
};

BX24.fitWindow = function(cb)
{
	sendMessage('resizeWindow', {
		width:'100%', height:BX24.getScrollSize().scrollHeight
	}, cb);
};

BX24.reloadWindow = function(cb)
{
	sendMessage('reloadWindow', {}, cb);
};

BX24.setTitle = function(title, cb)
{
	sendMessage('setTitle', {title:title.toString()}, cb);
};

BX24.scrollParentWindow = function(scroll, cb)
{
	scroll = parseInt(scroll);
	if(!isNaN(scroll))
	{
		sendMessage('setScroll', {scroll:scroll}, cb);
	}
};

BX24.isReady = function()
{
	return !!isReady;
};

BX24.ready = function(handler)
{
	if (util.type.isFunction(handler))
	{
		readyList.push(handler);
	}
};

BX24.proxy = function(func, thisObject)
{
	if (!func || !thisObject)
		return func;

	util.initObjectProxy(thisObject)

	if (typeof func['__proxy_id_' + proxySalt] == 'undefined')
		func['__proxy_id_' + proxySalt] = proxyId++;

	if (!proxyList[thisObject['__proxy_id_' + proxySalt]][func['__proxy_id_' + proxySalt]])
		proxyList[thisObject['__proxy_id_' + proxySalt]][func['__proxy_id_' + proxySalt]] = util.delegate(func, thisObject);

	return proxyList[thisObject['__proxy_id_' + proxySalt]][func['__proxy_id_' + proxySalt]];
};

BX24.proxyContext = function()
{
	return proxyContext;
};

BX24.bind = function(el, evname, func)
{
	if (!el)
		return;

	if (evname === 'mousewheel')
	{
		BX24.bind(el, 'DOMMouseScroll', func);
	}
	else if (evname === 'transitionend')
	{
		BX24.bind(el, 'webkitTransitionEnd', func);
		BX24.bind(el, 'msTransitionEnd', func);
		BX24.bind(el, 'oTransitionEnd', func);
		// IE8-9 doesn't support this feature!
	}

	if (el.addEventListener)
		el.addEventListener(evname, func, false);
	else if(el.attachEvent) // IE
		el.attachEvent("on" + evname, BX24.proxy(func, el));
	else
		el["on" + evname] = func;

	eventsList[eventsList.length] = {'element': el, 'event': evname, 'fn': func};

};

BX24.unbind = function(el, evname, func)
{
	if (!el)
		return;

	if (evname === 'mousewheel')
		BX24.unbind(el, 'DOMMouseScroll', func);

	if(el.removeEventListener) // Gecko / W3C
		el.removeEventListener(evname, func, false);
	else if(el.detachEvent) // IE
		el.detachEvent("on" + evname, BX24.proxy(func, el));
	else
		el["on" + evname] = null;
};

BX24.getScrollSize = function()
{
	return {
		scrollWidth: Math.max(document.documentElement.scrollWidth, document.documentElement.offsetWidth),
		scrollHeight: Math.max(document.documentElement.scrollHeight, document.documentElement.offsetHeight)
	};
};

BX24.selectAccess = function(title, value, cb)
{
	if(!util.type.isString(title))
	{
		 cb = value; value = title;
	}

	if(util.type.isFunction(value))
	{
		cb = value; value = [];
	}

	sendMessage('selectAccess', {value:value}, cb);
};

BX24.selectUser = function(title, cb)
{
	if(util.type.isFunction(title))
	{
		cb = title; title = '';
	}

	sendMessage('selectUser', {title: title, mult:false}, cb);
};

BX24.selectUsers = function(title, cb)
{
	if(util.type.isFunction(title))
	{
		cb = title; title = '';
	}

	sendMessage('selectUser', {title: title, mult:true}, cb);
};

BX24.selectCRM = function(params, cb)
{
	if(util.type.isFunction(params))
	{
		cb = params;
		params = {};
	}

	sendMessage('selectCRM', {
		entityType: params.entityType,
		multiple: params.multiple,
		value: params.value,
	}, cb);
};

BX24.openApplication = function(params, cb)
{
	if(util.type.isFunction(params))
	{
		cb = params;
		params = {};
	}

	sendMessage('openApplication', params, cb);
};

BX24.closeApplication = function(cb)
{
	sendMessage('closeApplication', cb);
};

BX24.im = {
	callTo: function(userId, video)
	{
		sendMessage('imCallTo', {userId: userId, video: video});
	},
	phoneTo: function(phone)
	{
		sendMessage('imPhoneTo', {phone: phone});
	},
	openMessenger: function(dialogId)
	{
		sendMessage('imOpenMessenger', {dialogId: dialogId});
	},
	openHistory: function(dialogId)
	{
		sendMessage('imOpenHistory', {dialogId: dialogId});
	}
};

BX24.placement = {

	info: function()
	{
		return {
			placement: PARAMS.PLACEMENT,
			options: PARAMS.PLACEMENT_OPTIONS
		}
	},

	getInterface: function(cb)
	{
		sendMessage('getInterface', cb);
	},

	call: function(cmd, params, cb)
	{
		if(!!BX24[cmd])
		{
			return;
		}
		else
		{
			if(util.type.isFunction(params))
			{
				cb = params;
				params = {};
			}

			sendMessage(cmd, params, cb);
		}
	},

	bindEvent: function(eventName, cb)
	{
		sendMessage('placementBindEvent', {event: eventName}, cb);
	}
};

BX24.loadScript = function(script, callback)
{
	if (!isReady)
	{
		var _args = arguments;
		BX24.ready(function() {
			BX24.loadScript.apply(this, _args);
		});
		return;
	}

	if (util.type.isString(script))
		script = [script];
	var _callback = function()
	{
		return (callback && util.type.isFunction(callback)) ? callback() : null
	}
	var load_js = function(ind)
	{
		if(ind >= script.length)
			return _callback();

		if(!!script[ind])
		{
			var oHead = document.getElementsByTagName("HEAD")[0] || document.documentElement;
			var oScript = document.createElement('SCRIPT');
			oScript.setAttribute('charset', 'UTF-8');

			oScript.src = script[ind];

			var bLoaded = false;
			oScript.onload = oScript.onreadystatechange = function()
			{
				if (!bLoaded && (!oScript.readyState || oScript.readyState == "loaded" || oScript.readyState == "complete"))
				{
					bLoaded = true;
					setTimeout(function (){load_js(++ind);}, 50);

					oScript.onload = oScript.onreadystatechange = null;
					if (oHead && oScript.parentNode)
					{
						oHead.removeChild(oScript);
					}
				}
			}

			return oHead.insertBefore(oScript, oHead.firstChild);
		}
		else
		{
			load_js(++ind);
		}
	}

	load_js(0);
};

BX24.userOption = BX24.appOption = {
	get:function(){},set:function(){}
};

BX24.init(function(){
	BX24.userOption = {
		get: function(name)
		{
			return PARAMS.USER_OPTIONS[name];
		},
		set: function(name, value)
		{
			PARAMS.USER_OPTIONS[name] = value;
			sendMessage('setUserOption', {name:name,value:value});
		}
	};

	BX24.appOption = {
		get: function(name)
		{
			return PARAMS.APP_OPTIONS[name];
		},
		set: BX24.isAdmin() ? function(name,value,cb)
		{
			PARAMS.APP_OPTIONS[name] = value;
			sendMessage('setAppOption', {name:name,value:value}, cb);
		} : util.blank
	};
});
/*************** private section ***********************/

// utility
var util = {
	blank: function(){},
	init: function()
	{
		var f = function(data)
		{
			if(!PARAMS.DOMAIN)
				PARAMS.DOMAIN = data.DOMAIN;
			if(!PARAMS.PATH)
				PARAMS.PATH = data.PATH;
			if(!PARAMS.LANG)
				PARAMS.LANG = data.LANG;
			if(!PARAMS.PLACEMENT)
				PARAMS.PLACEMENT = data.PLACEMENT;

			PARAMS.PROTOCOL = data.PROTOCOL;
			PARAMS.DOMAIN = PARAMS.DOMAIN.replace(/\:(80|443)$/, '');

			if(!!data.AUTH_ID)
			{
				PARAMS.AUTH_ID = data.AUTH_ID;
				PARAMS.REFRESH_ID = data.REFRESH_ID;
				PARAMS.AUTH_EXPIRES = (new Date()).valueOf()+data.AUTH_EXPIRES*1000;
				PARAMS.IS_ADMIN = !!data.IS_ADMIN;
				PARAMS.MEMBER_ID = data.MEMBER_ID||'';
			}

			if(!PARAMS.USER_OPTIONS)
				PARAMS.USER_OPTIONS = data.USER_OPTIONS;

			if(!PARAMS.APP_OPTIONS)
				PARAMS.APP_OPTIONS = data.APP_OPTIONS;

			if(!PARAMS.PLACEMENT_OPTIONS)
				PARAMS.PLACEMENT_OPTIONS = data.PLACEMENT_OPTIONS;

			isInit = true;

			var doInit = function()
			{
				BX24.init = function(fn)
				{
					util.defer(fn).call(document);
				}

				if(!data.INSTALL)
				{
					BX24.installFinish = util.blank;
				}

				var fn, i = 0;
				while (initList && (fn = initList[i++]))
				{
					BX24.init(fn);
				}
			}

			if(!!data.FIRST_RUN && installList.length > 0)
			{
				util.install(doInit);
			}
			else
			{
				doInit();
			}
		}

		if(!PARAMS.DOMAIN||!PARAMS.LANG||!PARAMS.AUTH_ID)
		{
			sendMessage('getInitData', f);
		}
		else
		{
			f(PARAMS);
		}

		util.init = util.blank;
	},

	install: function(cb)
	{
		var installer = null,
			installFinish = function()
			{
				util.install(cb);
			};

		installer = installList.shift();
		if(!!installer)
		{
			if(util.type.isFunction(installer))
			{
				try
				{
					BX24.installFinish = installFinish;
					installer.call(document); // no defer!
				}
				catch(e)
				{
					alert('Installation failed!');
					console.log(e);
				}
			}
			else
			{
				BX24.loadScript(installer, function(){
					BX24.installFinish = installFinish;
				});
			}
		}
		else
		{
			BX24.installFinish = util.install = util.blank;
			sendMessage('setInstall', {install:true});

			util.defer(cb).call(document);
		}
	},

	ready: function()
	{
		if (document.readyState === "complete")
		{
			return util.runReady();
		}

		var __readyHandler;
		if (document.addEventListener)
		{
			__readyHandler = function()
			{
				document.removeEventListener("DOMContentLoaded", __readyHandler, false);
				util.runReady();
			}
			document.addEventListener("DOMContentLoaded", __readyHandler, false);
			window.addEventListener("load", util.runReady, false);
		}
		else if (document.attachEvent)
		{
			__readyHandler = function()
			{
				if (document.readyState === "complete")
				{
					document.detachEvent("onreadystatechange", __readyHandler);
					util.runReady();
				}
			}
			document.attachEvent("onreadystatechange", __readyHandler);
			window.attachEvent("onload", util.runReady);
		}

		util.ready = util.blank;

		return null;
	},

	runReady: function()
	{
		if (!isReady)
		{
			if (!document.body)
				return setTimeout(util.runReady, 15);

			isReady = true;

			BX24.ready = function(handler)
			{
				if (util.type.isFunction(handler))
				{
					util.defer(handler).call(document);
				}
			};

			if (readyList && readyList.length > 0)
			{
				var fn, i = 0;
				while (readyList && (fn = readyList[i++]))
				{
					BX24.ready(fn);
				}

				readyList = null;
			}
		}

		return null;
	},

	delegate: function (func, thisObject)
	{
		if (!func || !thisObject)
			return func;

		return function() {
			var cur = proxyContext;
			proxyContext = this;
			var res = func.apply(thisObject, arguments);
			proxyContext = cur;
			return res;
		}
	},

	initObjectProxy: function(thisObject)
	{
		if (typeof thisObject['__proxy_id_' + proxySalt] == 'undefined')
		{
			thisObject['__proxy_id_' + proxySalt] = proxyList.length;
			proxyList[thisObject['__proxy_id_' + proxySalt]] = {};
		}
	},

	defer: function(fn,t)
	{
		return function(){
			var arg = arguments;
			setTimeout(function(){fn.apply(this,arg)}, t||10);
		};
	},

	split: function(s,ss)
	{
		var r = s.split(ss);
		return [r[0],r.slice(1).join(ss)];
	},

	clone: function(obj, bCopyObj)
	{
		var _obj, i, l;
		if (bCopyObj !== false)
			bCopyObj = true;

		if (obj === null)
			return null;

		if (util.type.isDomNode(obj))
		{
			_obj = obj.cloneNode(bCopyObj);
		}
		else if (typeof obj == 'object')
		{
			if (util.type.isArray(obj))
			{
				_obj = [];
				for (i=0,l=obj.length;i<l;i++)
				{
					if (typeof obj[i] == "object" && bCopyObj)
						_obj[i] = util.clone(obj[i], bCopyObj);
					else
						_obj[i] = obj[i];
				}
			}
			else
			{
				_obj =  {};
				if (obj.constructor)
				{
					if (obj.constructor === Date)
						_obj = new Date(obj);
					else
						_obj = new obj.constructor();
				}

				for (i in obj)
				{
					if (typeof obj[i] == "object" && bCopyObj)
						_obj[i] = util.clone(obj[i], bCopyObj);
					else
						_obj[i] = obj[i];
				}
			}

		}
		else
		{
			_obj = obj;
		}

		return _obj;
	},

	uniqid: function()
	{
		var s = '';
		for (var i = 0; i <32; i++)
			s += charsList[Math.round(Math.random()*(charsList.length-1))];
		return s;
	},

	// datatype utility
	type: {
		isString: function(item) {
			return item === '' ? true : (item ? (typeof (item) == "string" || item instanceof String) : false);
		},
		isNotEmptyString: function(item) {
			return util.type.isString(item) ? item.length > 0 : false;
		},
		isBoolean: function(item) {
			return item === true || item === false;
		},
		isNumber: function(item) {
			return item === 0 ? true : (item ? (typeof (item) == "number" || item instanceof Number) : false);
		},
		isFunction: function(item) {
			return item === null ? false : (typeof (item) == "function" || item instanceof Function);
		},
		isElementNode: function(item) {
			return item && typeof (item) == "object" && "nodeType" in item && item.nodeType == 1 && item.tagName && item.tagName.toUpperCase() != 'SCRIPT' && item.tagName.toUpperCase() != 'STYLE' && item.tagName.toUpperCase() != 'LINK';
		},
		isDomNode: function(item) {
			return item && typeof (item) == "object" && "nodeType" in item;
		},
		isArray: function(item) {
			return item && Object.prototype.toString.call(item) == "[object Array]";
		},
		isDate : function(item) {
			return item && Object.prototype.toString.call(item) == "[object Date]";
		}
	}
};

// communication with parent frame utility
var sendMessage = function(cmd, params, cb)
{
	if(util.type.isFunction(params))
	{
		cb = params; params = null;
	}

	cmd += ':' + (!!params ? JSON.stringify(params) : '')
			+ ':' + sendMessage.setCallback(cb)
			+ (!!PARAMS.APP_SID ? (':' + PARAMS.APP_SID) : '');

	parent.postMessage(cmd, 'http'+(PARAMS.PROTOCOL?'s':'')+'://' + PARAMS.DOMAIN);
};

sendMessage.setCallback = function(cb)
{
	var cbId = '';
	if(!!cb)
	{
		cbId = util.uniqid();
		sendMessage[cbId] = cb;
	}

	return cbId;
};

sendMessage.runCallback = function(e)
{
	e = e || window.event;

	if(e.origin != 'http'+(PARAMS.PROTOCOL?'s':'')+'://'+PARAMS.DOMAIN)
		return;

	if(!!e.data)
	{
		var cmd = util.split(e.data,':',2),
			args = [];

		if(!!sendMessage[cmd[0]])
		{
			if(!!cmd[1])
				args = JSON.parse(cmd[1]);

			sendMessage[cmd[0]].apply(window, [args]);
		}
	}
};

var ajax = function(config)
{
	RestrictionManager.check(function(){
		ajax.call(config);
	});
}

ajax.call = function(config)
{
	if(!isInit)
	{
		BX24.init(function(){
			ajax.call(config);
		});
	}
	else if(PARAMS.AUTH_EXPIRES < (new Date()).valueOf())
	{
		ajax.refreshAuth(config);
	}
	else
	{
		var xhr = ajax.xhr(),
			url = 'http'+(PARAMS.PROTOCOL?'s':'')+'://' + PARAMS.DOMAIN + PARAMS.PATH + '/' + ajax.escape(config.method) + '.json';

		xhr.open('POST', url);

		var bRequestCompleted = false;

		// IE fix
		xhr.onprogress = function(){};
		xhr.ontimeout = function(){};
		xhr.timeout = 0;

		xhr.onload = function()
		{
			if (bRequestCompleted)
				return;

			xhr.onload = util.blank;

			var bSuccess = ajax.isSuccess(xhr);

			if(bSuccess)
			{
				var data = xhr.responseText;

				if(data.length > 0)
				{
					try{
						data = JSON.parse(data);
					}catch(e){bSuccess = false;}
				}
				else
				{
					data = {result:{}};
				}
			}

			var s = xhr.status;

			xhr = null;

			if(bSuccess)
			{
				if(data.error && data.error == 'expired_token')
				{
					ajax.refreshAuth(config);
				}
				else if(!!config.callback && util.type.isFunction(config.callback))
				{
					var res = new ajaxResult(data, config, s);
					config.callback.apply(window, [res]);
				}
			}
			else
			{
				throw('Query error!');
			}
		};

		xhr.onerror = function()
		{
			throw('Query error!');
		};

		var query_data = 'auth=' + PARAMS.AUTH_ID;

		if(typeof config.start != 'undefined')
		{
			query_data += '&start=' + parseInt(config.start);
		}

		if(!!config.data)
		{
			if(!!config.data['start'])
			{
				delete config.data['start'];
			}

			ajax.prepareData(config.data, '', function(res){
				query_data += '&' + res;
				util.defer(xhr.send.bind(xhr))(query_data);
			});
		}
		else
		{
			util.defer(xhr.send.bind(xhr))(query_data);
		}

		return xhr;
	}
};

ajax.batch = function(calls, callback, bHaltOnError)
{
	return ajax({
		method: 'batch',
		data: {halt:!!bHaltOnError?1:0, cmd:calls},
		callback: function(res, config, status){
			if(!!callback)
			{
				var data = res.data(),
					result = util.type.isArray(calls) ? [] : {};

				for(var i in calls)
				{
					if(!!calls[i] && calls.hasOwnProperty(i))
					{
						if(typeof data.result[i] !== 'undefined' || typeof data.result_error[i] !== 'undefined')
						{
							if(util.type.isString(calls[i]))
							{
								var q = calls[i].split('?');
							}
							else
							{
								q = [
									util.type.isArray(calls[i]) ? calls[i][0] : calls[i].method,
									util.type.isArray(calls[i]) ? calls[i][1] : calls[i].data,
								];
							}

							result[i] = new ajaxResult({
								result: typeof data.result[i] !== 'undefined' ? data.result[i] : {},
								error: data.result_error[i]||undefined,
								total: data.result_total[i],
								next: data.result_next[i]
							}, {
								method: q[0],
								data:q[1],
								callback: callback
							}, res.status);
						}
					}
				}

				callback.apply(window, [result]);
			}
		}
	});
};

ajax.refreshAuth = function(config)
{
	BX24.refreshAuth(function(){
		ajax(config)
	});
};

ajax.xhr = function()
{
	if(!!window.XDomainRequest)
		return new XDomainRequest();
	else
		return new XMLHttpRequest();
};

ajax.escape = function(str)
{
	return encodeURIComponent(str);
};

ajax.prepareData = function(arData, prefix, callback)
{
	var data = '', objects = [];
	if (util.type.isString(arData) || arData == null)
	{
		callback.call(document, arData||'');
	}
	else
	{
		for(var i in arData)
		{
			if (!arData.hasOwnProperty(i))
			{
				continue;
			}

			var name = ajax.escape(i);

			if(prefix)
				name = prefix + '[' + name + ']';

			if(typeof arData[i] == 'object')
			{
				objects.push([name,arData[i]]);
			}
			else
			{
				if (data.length > 0)
				{
					data += '&';
				}

				data += name + '=' + ajax.escape(arData[i])
			}
		}

		var cnt = objects.length;
		if(cnt > 0)
		{
			var cb = function(str)
			{
				data += (!!str ? '&' : '') + str;
				if(--cnt <= 0)
				{
					callback.call(document, data)
				}
			}

			var cnt1 = cnt;
			for(var i = 0; i < cnt1; i++)
			{
				if(util.type.isDomNode(objects[i][1]))
				{
					if(objects[i][1].tagName.toUpperCase() == 'INPUT' && objects[i][1].type == 'file')
					{
						if(fileReader.canUse())
						{
							fileReader(objects[i][1], (function(name){
								return function(result){
									if(util.type.isArray(result)&&result.length>0)
									{
										cb(name + '[0]=' + ajax.escape(result[0]) + '&' + name + '[1]=' + ajax.escape(result[1]));
									}
									else
									{
										cb(name+'=');
									}
								}
							})(objects[i][0]));
						}
					}
					else if(typeof objects[i][1].value != 'undefined')
					{
						cb(objects[i][0] + '=' + ajax.escape(objects[i][1].value));
					}
					else
					{
						cb('');
					}
				}
				else if(util.type.isDate(objects[i][1]))
				{
					cb(objects[i][0] + '=' + ajax.escape(objects[i][1].toJSON()));
				}
				else if(util.type.isArray(objects[i][1]) && objects[i][1].length <= 0)
				{
					cb(objects[i][0] + '=');
				}
				else
				{
					ajax.prepareData(objects[i][1], objects[i][0], cb);
				}
			}
		}
		else
		{
			callback.call(document, data)
		}
	}
};

ajax.isSuccess = function(xhr)
{
	return typeof xhr.status == 'undefined' || (xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || xhr.status >= 400 && xhr.status < 500 || xhr.status === 1223 || xhr.status === 0;
};

var ajaxResult = function(answer, query, status)
{
	this.answer = answer;
	this.query = util.clone(query);
	this.status = status;

	if(typeof this.answer.next != 'undefined')
	{
		this.answer.next = parseInt(this.answer.next);
	}

	if(typeof this.answer.error != 'undefined')
	{
		this.answer.ex = new ajaxError(this.status, typeof this.answer.error == 'string' ? this.answer : this.answer.error)
	}
};

ajaxResult.prototype.data = function()
{
	return this.answer.result;
};

ajaxResult.prototype.error = function()
{
	return this.answer.ex;
};

ajaxResult.prototype.error_description = function()
{
	return this.answer.error_description;
};

ajaxResult.prototype.more = function()
{
	return !isNaN(this.answer.next);
};

ajaxResult.prototype.total = function()
{
	return parseInt(this.answer.total);
};

ajaxResult.prototype.next = function(cb)
{
	if(this.more())
	{
		this.query.start = this.answer.next;

		if(!!cb && util.type.isFunction(cb))
		{
			this.query.callback = cb;
		}

		return ajax(this.query);
	}

	return false;
};

var ajaxError = function(status, ex)
{
	this.status = status;
	this.ex = ex;
};

ajaxError.prototype.getError = function()
{
	return this.ex;
};

ajaxError.prototype.getStatus = function()
{
	return this.status;
};

ajaxError.prototype.toString = function()
{
	return this.ex.error + (
		!!this.ex.error_description
			? ': ' + this.ex.error_description
			: ''
		) + ' ('+this.status+')';
};


var fileReader = function(fileInput, cb)
{
	if(fileReader.canUse())
	{
		var files = fileInput.files,
			len = 0,
			result = fileInput.multiple ? [] : null;

		for (var i = 0, f; f = files[i]; i++)
		{
			var reader = new window.FileReader();

			reader.BXFILENAME = files[i].name;

			reader.onload = function(e){
				e = e||window.event;

				var res = [this.BXFILENAME,btoa(e.target.result)];

				if(result === null)
					result = res;
				else
					result.push(res);

				if(--len <= 0)
				{
					cb(result);
				}
			};

			reader.readAsBinaryString(f);
		}
		len = i;
		if(len <= 0)
		{
			cb(result);
		}
	}
};

fileReader.canUse = function()
{
	return !!window.FileReader;
};

var RestrictionManager = function()
{
	var _ = this;

	this.param = {
		SLEEP: 1000,
		ALLOWED_SPEED: 0.002,
		ALLOWED_AMOUNT: 90
	};

	this.storage = {
		lastDecrement: 0,
		currentAmount: 0
	};

	this.wait = function(callback)
	{
		return util.defer(function()
		{
			return _.check(callback);
		}, this.param.SLEEP);
	};
};

RestrictionManager.prototype.check = function(callback)
{
	this.decrementStorage();

	if(!this.checkStorage())
	{
		this.wait(callback)();
	}
	else
	{
		this.incrementStorage();

		this.run(callback);
	}
};

RestrictionManager.prototype.run = function(callback)
{
	callback();
}

RestrictionManager.prototype.decrementStorage = function()
{
	if(this.storage.lastDecrement > 0)
	{
		this.storage.currentAmount -= ((new Date()).valueOf() - this.storage.lastDecrement) * this.param.ALLOWED_SPEED;

		if(this.storage.currentAmount < 0)
		{
			this.storage.currentAmount = 0;
		}
	}

	this.storage.lastDecrement = (new Date()).valueOf();
};

RestrictionManager.prototype.checkStorage = function()
{
	return this.storage.currentAmount < this.param.ALLOWED_AMOUNT;
};

RestrictionManager.prototype.incrementStorage = function()
{
	this.storage.currentAmount++;
};

/***************** exec ********************************/

// AUTH_ID can also be set via GET, but it's not recommended due to security reasons

var PARAMS = {
	DOMAIN: '',
	PROTOCOL: 1,
	APP_SID: false,
	PATH: '',
	LANG: '',
	AUTH_ID: '',
	REFRESH_ID: null,
	MEMBER_ID: null,
	PLACEMENT: null,
	IS_ADMIN: false,
	AUTH_EXPIRES: 0,
	USER_OPTIONS: null,
	APP_OPTIONS: null,
	PLACEMENT_OPTIONS: null
};

if(!!window.name)
{
	var q = window.name.split('|');
	PARAMS.DOMAIN = q[0].replace(/\:(80|443)$/, '');
	PARAMS.PROTOCOL = parseInt(q[1])||0;
	PARAMS.APP_SID = q[2];
}

if(!PARAMS.DOMAIN||!PARAMS.APP_SID)
{
	BX24 = null;
	throw new Error('Unable to initialize Bitrix24 JS library!');
}

/* bindings */
BX24.bind(window, 'message', sendMessage.runCallback);

util.ready();
util.init();

RestrictionManager = new RestrictionManager();

})();