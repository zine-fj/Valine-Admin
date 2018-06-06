const AV = require('leanengine');
const mail = require('./utilities/send-mail');
AV.Cloud.afterSave('Comment', function (request) {
    let currentComment = request.object;

    // 通知站长
    mail.notice(currentComment);
    
    // AT评论通知
    let rid;
    
    // 拿到评论内容
    let comment = currentComment.get('comment');

    // 判断是否包含 class="at", 如包含则截取被 @ 的评论记录 id 值
    if (comment.indexOf("class=\"at\"") != -1) {
        let start = comment.indexOf("#") + 1;
        let end = comment.substr(start).indexOf("'");
        rid = comment.substr(start, end);
    } else {
        console.log("这条评论没有 @ 任何人");
        return;
    }
    // 通过被 @ 的评论 id, 则找到这条评论留下的邮箱并发送通知.
    let query = new AV.Query('Comment');
    query.get(rid).then(function (parentComment) {
        if (parentComment.get('mail')) {
            mail.send(currentComment, parentComment);
        } else {
            console.log(currentComment.get('nick') + " @ 了" + parentComment.get('nick') + ", 已通知. 但被 @ 的人没留邮箱... 无法通知");
        }
    }, function (error) {
        console.warn('好像 @ 了一个不存在的人!!!');
    });
});
