var timeLimit = 1000 * 59 * 5;
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
    freeData();
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

// 请求释放数据,有可能已经被其他用户造成的过期检查释放过了,后端进行判断
function freeData() {
    // let uid=document.cookie;
    // let idx=index;
    // $.ajax({
    //     type: "POST",
    //     url: "/requestFree",
    //     data: {"uid":uid,"index":idx},
    //     dataType:"json",
    //     success:function(msg){
    //         console.log("success");
    //         return 1;
    //     },
    //     error: function(msg){
    //         console.log("error");
    //         return 0;
    //     }
    // });
}