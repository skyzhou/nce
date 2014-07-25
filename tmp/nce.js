
(function(){
	var keyHdl = {};
	var block = "        ";
	var isInit = false;
	var style = '.ce-wrap{border: 1px solid #ccc;position: relative;}.ce-dis,.ce-ipt{line-height: 18px;white-space: pre;height: 80px;font-size: 12px;padding: 0px;margin: 0px;word-wrap:break-word;border: 0px;}.ce-dis{z-index: 222;pointer-events:none;position: absolute;top:0px;left: 0px;text-shadow:0 0 5px #fff;font-family: Consolas, "Liberation Mono", Courier, monospace;}.ce-ipt{outline: none; resize:none;background-color: transparent; overflow: hidden;color: #000;margin-left: 40px;border-left:1px solid #ccc;padding-left:10px;vertical-align:bottom;font-family: Nce,Consolas, "Liberation Mono", Courier, monospace;}';
	var keyState = 0;

	function match(str,c1,c2){
		var p = str.lastIndexOf(c1);
		if( p <0){
			return 	p;
		}
		var s = str.substr(p+1);

		if(s.split(c1).length == s.split(c2).length){
			return p;
		}
		else{
			return match(str.substring(0,p),c1,c2);
		}
	}

	window.nce = {
		create:function(container,language,option){
			if(!window.qnml){
				return;
			}
			if(!isInit){
				qnml.insertStyle(style);
			}
			var __this = this;

			var config = {
				width:1000,
				height:180,
				raw:""
			}
			option = option || {};

			for(var p in option){
				config[p] = option[p];
			}

			var wrapEl = document.createElement("div")
			var displayEl = document.createElement("div")
			var inputEl = document.createElement("textarea");

			wrapEl.className = "ce-wrap";
			displayEl.className = "ce-dis";
			inputEl.className = "ce-ipt";
			inputEl.setAttribute("spellcheck","false");

			wrapEl.appendChild(displayEl);
			wrapEl.appendChild(inputEl);

			wrapEl.style.width = config.width+"px";
			displayEl.style.width = config.width-2+"px";
			inputEl.style.width = config.width-52+'px';

			if(!("pointer-events" in document.documentElement.style)){
				inputEl.style.position="relative";
				inputEl.style.zIndex = "999";
			}

			container.appendChild(wrapEl);

			nce.addEvt.call(inputEl,"keydown",function(evt){
				var keyCode = evt.keyCode;
				
				var hdl = keyHdl[keyCode];
				if(hdl){
					var str = this.value.replace(/\r\n/g,"\n");
					var inputSelection = nce.getInputSelection.call(this);
					var start = inputSelection.selectionStart;
					var end = inputSelection.selectionEnd;
					var obj = {
						start:start,
						end:end,
						str:str,
						evt:evt,
						str1:str.substr(0,start),
						str2:str.substr(end)
					}

					var ret = hdl.call(obj,this);
					if(ret){
						this.value = ret.str.replace(/\r\n/g,"\n");

						nce.setInputSelection.call(this,{
							selectionStart:ret.start,
							selectionEnd:ret.end
						});
						//这里渲染了 接下来的keyup不会渲染
						__this.render();
						keyState = 1;
						return true;
					}
				}
				
			})
			if("oninput" in inputEl){
				nce.addEvt.call(inputEl,"input",function(){
					__this.render();
				})
			}
			else{
				nce.addEvt.call(inputEl,"keyup",function(){
					if(keyState){
						keyState = 0;
						return;
					}
					__this.render();
				})
			}
			

			this.id = +new Date();
			this.language = "qnml:"+language;
			this.wrapEl = wrapEl;
			this.displayEl = displayEl;
			this.inputEl = inputEl;

			this.setRaw(config.raw,0);
		},
		addKey:function(keyCode,hdl){
			keyHdl[keyCode] = hdl;
		},
		addEvt:function(type,hdl){
			var fn = function(e){
				var evt = e || window.event;
				if(hdl.call(evt.target||evt.srcElement,evt)){
					if(evt.preventDefault){
						evt.preventDefault();
					}
					else{
						evt.returnValue = false;
					}
					
				}
			}
			if(this.addEventListener){
				this.addEventListener(type,fn)
			}
			else{
				this.attachEvent('on'+type,fn)
			}
		},
		getInputSelection:function(){
			if("selectionStart" in this){
				return {
					selectionStart:this.selectionStart,
					selectionEnd:this.selectionEnd
				}
			}
			else{
				
				var bookmark = document.selection.createRange().getBookmark();
				var range = this.createTextRange();
				var len = this.value.replace(/\r\n/g,"\n").length;
				range.moveToBookmark(bookmark);

				var start = - range.moveStart("character",-len)
				var end = - range.moveEnd("character",-len);
				

				return {
					selectionStart:start,
					selectionEnd:end
				}	
			}
		},
		setInputSelection:function(option){
			if(typeof option != "object"){
				option = {
					selectionStart:option,
					selectionEnd:option
				}
			}
			if("selectionStart" in this){
				this.selectionStart = option.selectionStart;
				this.selectionEnd = option.selectionEnd
			}
			else{
				var range = this.createTextRange();
				range.moveStart("character",option.selectionStart)
				//range.moveEnd("character",option.selectionStart)
				range.collapse()
				range.select();
			}
			
		}
	}

	nce.create.prototype = {
		getRaw:function(){
			return this.inputEl.value;
		},
		
		setRaw:function(raw,cursor){
			this.inputEl.value = raw;;
			this.render();

			if(cursor === undefined){
				cursor = raw.length;
			}

			nce.setInputSelection.call(this.inputEl,cursor)
		},
		setLanuage:function(language){
			this.language = "qnml:"+language;
		},
		getLanuage:function(){
			return this.language.replace("qnml:","");
		},
		render:function(){
			var value = this.inputEl.value+"\n ";
			var html = qnml.parse(
				value,
				this.language);
			this.displayEl.innerHTML =  html;
			this.inputEl.style.height = this.displayEl.scrollHeight+'px';
		}
	}

	//删除
	nce.addKey(8,function(){
		if(/^\s{8}$/.test(this.str1.substring(this.start-8,this.start))){
			var str =  [
				this.str1.substr(0,this.start-8),
				this.str2
			].join("");
			var pos = this.start-8;
			return {
				start:pos,
				end:pos,
				str:str
			}
		}
	})

	//table IE有bug
	nce.addKey(9,function(){
		//如果未选中的情况下table
		if(this.start == this.end){
			var str = [
				this.str1,
				block,
				this.str2
			].join("");
			var pos = this.start+block.length;
			return {
				start:pos,
				end:pos,
				str:str
			}
		}
		//有选择情况下的table
		else{
			var len = 0,flag = false,begin;
			
			//获取选取上一个回车的位置
			begin = this.str1.lastIndexOf("\n");

			//如果上个没有回车，则未0 置flag
			if(begin < 0){
				begin = 0;
				flag = true;
			}

			//多行文本中的第一行行首空白字符数量
			var white = this.str1.substring(begin,this.end).replace(/\S.*/,'').replace(/[^ ]/g,'');

			//减少缩进
			if(this.evt.shiftKey){
				//在有回车的地方缩减空格，并记录减少的数量
				var mid = this.str.substring(begin,this.end).replace(/\n( {1,4})/g,function(m,w){
						len += w.length;
						return "\n";
					});
				//如果起始行被选中，起始行缩减
				if(flag){
					mid = mid.replace(/^( {1,4})/,function(m,w){
						len += w.length;
						return '';
					});
				}

				var str = [
					this.str1.substr(0,begin),
					mid,
					this.str2
				].join("");

				return {
					start:this.start-Math.min(white.length,4),
					end:this.end-len,
					str:str
				}
			}
			else{
				var str = [
					flag?block:this.str1.substr(0,begin),
					this.str.substring(begin,this.end-1).replace(/\n/g,function(){
						len += block.length;
						return "\n"+block;
					}),
					this.str.substr(this.end-1)
				].join("");
				return{
					start:this.start+block.length,
					end:this.end+len+(flag?block.length:0),
					str:str
				}
			}
			
			
		}
	})

	//回车
	nce.addKey(13,function(){
		var white = this.str1.substr(this.str1.lastIndexOf("\n")+1).replace(/\S.*/,'');
		var tail = "";
		var s1 = this.str1.length;
		if(this.str1.substring(s1-1) == "{"){
			if(this.str2.substr(0,1) == "}"){
				tail = "\n"+white;
			}
			white += block;	
		}
		else if(/\/\*+/.test(this.str1.substring(s1-3))){
			white += " *";
		}
		else if(this.str1.substr(-1) == "*"){
			white += "*";
		}
		else if(/\*\//.test(this.str1.substring(s1-2))){
			white = white.replace(/ $/,'');
		}


		var str = [
			this.str1,
			"\n",
			white,
			tail,
			this.str2
		].join("");

		var pos = this.start+white.length+1;
		return {
			start:pos,
			end:pos,
			str:str
		}
		
	})
	//闭标签
	nce.addKey(221,function(){
		if (this.evt.shiftKey) {
			//当前行
			var p1 = this.str1.lastIndexOf("\n");
			var s1 = this.str1.substring(p1+1,this.start);
			var len1 = s1.length;
			if(/^\s*$/.test(s1)){
				//上文行
				var str = this.str1.substring(0,match(this.str1,"{","}"));
				var s2 = str.substring(str.lastIndexOf("\n")+1,str.length).replace(/\S.*/,"");

				var str =  [
					this.str1.substr(0,p1+1),
					s2,
					"}",
					this.str2
				].join("");
				var pos = this.start-(s1.length-s2.length)+1;
				return {
					start:pos,
					end:pos,
					str:str
				}
			}
		}
		
	})
})()
