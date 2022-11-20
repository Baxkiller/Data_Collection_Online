// 提交分数
function submitScore(uid,score,idx) {
    clearTimer()
    $.ajax({
        type: "POST",
        url: "/submitScore",
        data: {"uid":uid,"score":score,"index":idx},
        dataType:"json",
        success:function(msg){
            console.log("success");
            if(msg.status === 400){
                alert(msg.msg);
                reDirected()
            }
            return 1;
        },
        error: function(msg){
            console.log("error");
            return 0;
        }
    });
}

// 请求提交数据
// 包括提交分数,重新请求数据
// 设定时间计时器
function submitRequest() {
    let score=document.getElementById('score').value;
    let userName=document.cookie;
    document.getElementById('score').value="";

    if( score === "") {
        alert("请输入当前评分后再提交");
        return;
    }

    submitScore(userName,score,index);
    dataLoad(1);
    setTimer()
}

function setIndex()
{
    form2.iIndex.value=index;
}

// function prePage() {
//     // if(index!==0)
//     // {
//     //     index=index-1;
//     //     setIndex();
//     //     displayData(data[index]);
//     // }
// }
//
// function nxtPage() {
//     // if(index<data.length-1)
//     // {
//     //     index=index+1;
//     //     setIndex();
//     //     displayData(data[index]);
//     // }
// }
//
// function changeIndex() {
//     // i=Number(form2.iIndex.value);
//     // index=i;
//     // displayData(data[index])
// }
