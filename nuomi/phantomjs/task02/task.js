var page = require('webpage').create();
var system = require('system');
var config = require('./config.json');
var device = config[system.args[2]];

console.log(device.width);
var t = Date.now();
var keyword = system.args[1];
//浏览器视口大小
page.viewportSize = {
  width: device.width,
  height: device.height
};
//网页截图大小
page.clipRect = {
  top: 1,
  left: 1,
  width: device.width,
  height: device.height
};
//浏览器信息
page.settings.userAgent = device.ua;

page.open('https://www.baidu.com/s?wd=' + keyword, function(status) {
	console.log(keyword);
	if (status !== 'success') {
		console.log(JSON.stringify({
			msg : '抓取失败',
            keyword : system.args[1],
            device : device
		}));
		phantom.exit();
	} else {
        page.includeJs("http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js", function() {
        	var result = {
        		dataList : []
        	};
            result.dataList = page.evaluate( function() {
                var lists = [];
                $('.c-container').each(function(index) {
                    lists.push({   
                        title: $(this).find('h3 a').text(),
                        info: $(this).find(".c-abstract").text(),            
                        link: $(this).find('h3 a').attr('href'),
                        pic: $(this).find('.c-img').attr('src') 
                    });
                });
                return lists;
            });
            result.code = 1;
            result.msg = '抓取成功';
            result.word = keyword;
            result.time = Date.now() - t;
            result.device = device;
            var fileName = system.args[2] + '.png';
            page.render(fileName, { format: 'png', quality: '100' });
            console.log(JSON.stringify(result, null, 2));
            phantom.exit();
        })
    }
})