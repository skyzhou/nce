(function(){
	var keyHdl = {};
	var block = "    ";
	var isInit = false;
	var style = NCE.STYLE.EDITOR;
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
				width:400,
				height:80,
				raw:''
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

			wrapEl.appendChild(displayEl);
			wrapEl.appendChild(inputEl);

			wrapEl.style.width = config.width+"px";
			displayEl.style.width = config.width-2+"px";
			inputEl.style.width = config.width-52+'px';


			container.appendChild(wrapEl);

			inputEl.addEventListener("paste",function(evt){
				var text = evt.clipboardData.getData("text");
				text = __this.filter(text);

				var target = evt.target;
				var start = target.selectionStart;
				var str = target.value;
				var str1 = str.substr(0,start);
				var str2 = str.substr(start);
				target.value = [
					str1,
					text,
					str2
				].join('');

				target.selectionStart = target.selectionEnd = start + text.length;
				__this.render();
				evt.preventDefault();
			})
			inputEl.addEventListener("keydown",function(evt){
				
				var keyCode = evt.keyCode;
				var target = evt.target;
				var str = target.value;
				var start = target.selectionStart;
				var end = target.selectionEnd

				var obj = {
					start:start,
					end:end,
					str:str,
					evt:evt,
					str1:str.substr(0,start),
					str2:str.substr(end)
				}

				var hdl = keyHdl[keyCode];
				if(hdl){
					var ret = hdl.call(obj);
					if(ret){
						target.value = ret.str;
						target.selectionStart = ret.start;
						target.selectionEnd = ret.end;
						__this.render();
						evt.preventDefault();
					}
				}
			})
			inputEl.addEventListener("input",function(){
				__this.render();
			})

			this.id = +new Date();
			this.language = "qnml:code-"+language;
			this.wrapEl = wrapEl;
			this.displayEl = displayEl;
			this.inputEl = inputEl;

			this.setRaw(config.raw);
		},
		addKey:function(keyCode,hdl){
			keyHdl[keyCode] = hdl;
		}
	}

	nce.create.prototype = {
		getRaw:function(){
			return this.inputEl.value;
		},
		filter:function(text){
			return text.replace(/\t/g,block);
		},
		setRaw:function(raw){
			this.inputEl.value = this.filter(raw);
			this.render();
			this.inputEl.selectionStart = raw.length;
		},
		render:function(){
			var value = this.inputEl.value;
			this.displayEl.innerHTML =  qnml.parse(
				value,
				this.language);
			this.inputEl.style.height = this.displayEl.scrollHeight+'px';
			
		}
	}

	//删除
	nce.addKey(8,function(){
		if(this.str1.substring(this.start-4,this.start) == block){
			var str =  [
				this.str1.substr(0,this.start-4),
				this.str2
			].join("");
			var pos = this.start-4;
			return {
				start:pos,
				end:pos,
				str:str
			}
		}
	})

	//table
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
		
		if(this.str1.substr(-1) == "{"){
			white += block;
		}
		else if(/\/\*+/.test(this.str1.substr(-3))){
			white += " *";
		}
		else if(this.str1.substr(-1) == "*"){
			white += "*";
		}
		else if(/\*\//.test(this.str1.substr(-2))){
			white = white.replace(/ $/,'');
		}

		var str = [
			this.str1,
			"\n",
			white,
			this.str2
		].join("");

		var pos = this.start+white.length+1;
		return {
			start:pos,
			end:pos,
			str:str
		}
	})

})()