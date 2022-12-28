var timeLimit = 990 * 60 * 10;
var myTimer = "初始化Timer";

function setTimer() {
    // console.log("set Timer!");
    myTimer = setTimeout("myTimeOut()", timeLimit);
}

function clearTimer() {
    clearTimeout(myTimer);
}

// 释放数据,并发出提示,退出登录
function myTimeOut() {
    alert("超时啦!将退出网页并重新登录!");
    reDirected();
}

function reDirected() {
    document.cookie = ""
    window.location.href = "./"

    $(document).ready(function (e) {
        var counter = 0;
        if (window.history && window.history.pushState) {
            $(window).on('popstate', function () {
                window.history.pushState('forward', null, '#');
                window.history.forward(1);
                // alert("不可回退");  //如果需在弹框就有它
                self.location="orderinfo.html"; //如查需要跳转页面就用它
            });
        }

        window.history.pushState('forward', null, '#'); //在IE中必须得有这两行
        window.history.forward(1);
    });

}