function Vue(obj) {
	this.obj = obj;	
	this.ele = document.querySelector(obj.el);
	this.template = this.ele.innerHTML;//保存{{*}}数据
	this.data = obj.data;
	this.walk(this.data);
	this.render();
}
Vue.prototype = {
	constructor: Vue,
	walk: function(obj) {
		let self = this;
		let val;
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				val = obj[key];
				if (typeof val === 'object') {
					self.walk(val);					
				}
				self.convert(obj, key, val);
				this.render();
			}		
		}
	},
	convert: function(obj, key, val) {
		let self = this;
		
		Object.defineProperty(obj, key, {

			get: function() {
				// console.log('访问了' + key);
				return val;
			},
			set: function(newVal) {
				console.log('你设置了 ' + key + ', 新的值为 ' + newVal);
				val = newVal;
				self.render();
				if (typeof newVal === 'object') {
					self.walk(newVal);					
				}			
			}
		})
	},
	render: function() {		
		let str = this.template;
		let newStr;
		let eleArray = [];
		let strArray = str.match(/{{(.*)}}/g);
		if (strArray) {
			for (let i = 0, length = strArray.length; i < length; i++) {
				//去掉{{*}}
				eleArray.push(strArray[i].replace(/[{}]/g, ''));
				index = eleArray[i].indexOf('.');
				if (index !== -1) {
					//获取data的数据
					newStr = this.data[eleArray[i].slice(0,index)][eleArray[i].slice(index + 1)];
					str = str.replace(strArray[i], newStr);
				} else {
					newStr = this.data[eleArray[i]];
					str = str.replace(strArray[i], newStr);
				}
			}
		}
		this.ele.innerHTML = str;
	}
}

