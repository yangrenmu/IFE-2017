function Vue(obj) {
	this.render(obj);
}
Vue.prototype = {
	constructor: Vue,
	render: function(obj) {
		let ele = document.querySelector(obj.el);
		let data = obj.data;		
		let str = ele.innerHTML;
		let newStr;
		let eleArray = [];
		let strArray = str.match(/{{(.*)}}/g);
		for (let i = 0, length = strArray.length; i < length; i++) {
			//去掉{{*}}
			eleArray.push(strArray[i].replace(/[{}]/g, ''));
			index = eleArray[i].indexOf('.');
			if (index !== -1) {
				//获取data的数据
				newStr = data[eleArray[i].slice(0,index)][eleArray[i].slice(index + 1)];
				str = str.replace(strArray[i], newStr);
			}
		}
		ele.innerHTML = str;
	}
}
