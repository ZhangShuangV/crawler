/**
 * Created by zhangshuang on 2016/10/13.
 */
var request = require('request'); //请求模块，
var cheerio = require('cheerio'); //相当于jQuery
var fs = require('fs'); //nodejs的文件模块File System

function getHtml(url) {
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body,{ //加载html
                decodeEntities:false //禁止转码
            });
            $("div.arcBody>p").each(function () { //这个地方需要根据目标页面修改
                var content = $(this).text(); //获取抓取的信息
                fs.appendFileSync('yikedou.txt',content); //这里只是简单的添加进了txt文件中，需要样式的，直接加入标签在写入文件即可。
            });
            var prevArcLink = $("div.prevNextArc>span#prevArcLink>a").attr("href"); //获取地址
            var realPrevArcLink = site + prevArcLink; //因为该网站的地址不是带域名的绝对路径，所以这里要将网站的域名加上，应具体问题具体修改
            getHtml(realPrevArcLink); //递归，将真实路径传入，递归抓取
            // fs.appendFileSync('yikedou.txt',cnt)
        } else{
            console.log(error,response.statusCode);
        }
    });
}

var site = "http://www.yikedou.com"; //目标页面的域名
var firstUrl = 'http://www.yikedou.com/wenzi/201510/48767.html'; //第一次要抓取的页面

getHtml(firstUrl); //执行
