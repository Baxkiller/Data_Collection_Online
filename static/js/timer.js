var timeLimit=1000*59*2;
var myTimer="初始化Timer";

function setTimer() {
    console.log("set Timer!")
    myTimer=setTimeout("myTimeOut()",timeLimit);
}

function clearTimer() {
    clearTimeout(myTimer)
}

// 释放数据,并发出提示,退出登录
function myTimeOut() {
    freeData()
    alert("超时啦!将退出网页并重新登录!")
    window.open("about:blank","_self").close()
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