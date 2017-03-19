var page = require('webpage').create();
var system = require('system');
var result = {
    code: 0, //返回状态码，1为成功，0为失败
    msg: '', //返回的信息
    word: '', //抓取的关键字
    time: 2000, //任务的时间
    dataList: [ //抓取结果列表
        {
            title: '', //结果条目的标题
            info: '', //摘要
            link: '', //链接
            pic: '' //缩略图地址
        }
    ]
};
var t = Date.now();
if (system.args.length === 1) {
    console.log('输入查询的关键字');
    phantom.exit();
} else {
    keyword = system.args[1];
    console.log(keyword);
}
page.open('https://www.baidu.com/s?wd=' + keyword, function(status) {
    if (status !== 'success') {
        result.code = 0;
        result.msg = '抓取失败';
        result.word = keyword;
        result.time = Date.now() - t;
        result.dataList = [];
        console.log(JSON.stringify(result, null, 2));
    } else {
        page.includeJs("http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js", function() {
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
            console.log(JSON.stringify(result, null, 2));
            phantom.exit();
        })
    }
})
