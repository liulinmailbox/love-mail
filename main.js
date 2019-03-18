/**
 * Created by Administrator on 2019/3/1.
 */
const Koa = require('koa2');
var app = new Koa();
var request = require('request')
var cheerio = require('cheerio')
var nodemailer = require('nodemailer')
var ejs = require('ejs')
const fs  = require('fs'); //文件读写
const path = require('path'); //路径配置

app.use(ctx => {
    request('http://wufazhuce.com/',(err, req) => {
        var $ = cheerio.load(req.body)
        var oneData = $('.item')[0]
        let todayOneData={  //保存到一个json中
            imgUrl:$(oneData).find('.fp-one-imagen').attr('src'),
            type:$(oneData).find('.fp-one-imagen-footer').text().replace(/(^\s*)|(\s*$)/g, ""),
            text:$(oneData).find('.fp-one-cita').text().replace(/(^\s*)|(\s*$)/g, "")
        };

        //将目录下的mail.ejs获取到，得到一个模版
        const template = ejs.compile(fs.readFileSync(path.resolve(__dirname, 'mail.ejs'), 'utf8'));
        //将数据传入模版中，生成HTML
        const html = template(todayOneData);

        console.log(html)

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'QQ',
            secure: true, // true for 465, false for other ports
            auth: {
                user: '820877138@qq.com', // generated ethereal user
                pass: 'hkocdshlzhoobdfa' // generated ethereal password
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"温馨提示👻" <820877138@qq.com>', // sender address
            to: "liulinforwork@163.com, 736669202@qq.com", // list of receivers
            subject: "通知：来自小哥哥的问候", // Subject line
            text: "一个最帅的小哥哥", // plain text body
            html: html
        };
        //发送邮件
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('邮件发送成功 ID：', info.messageId);
        });
    })
    ctx.body = '11'
});

app.listen(3000)