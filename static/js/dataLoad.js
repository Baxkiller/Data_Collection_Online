var index;
var toShowData;

function update(d,i) {
    index=i;
    toShowData=d;
    setIndex();
    displayData(d);
}

// 每次数据请求,但是需要提前给定用户名
// 返回的数据是data+当前data的数据下标,自动显示并更新index
// mode代表用户登录后申请/提交后申请
function dataLoad(mode) {
    let uid = document.cookie;
    $.ajax({
        url: "/requestData",
        type: "POST",
        dataType: "json",
        data: {
            uid: uid,
            mode: mode,
        },
        success:
            function (data) {
                if(data.index === -1)
                {
                    alert("当前无数据可标注!请联系任务发布者或稍后再试...")
                    reDirected()
                }
                else if(data.index === -2)
                {
                    alert(data.msg)
                    reDirected()
                }
                update(data.d,data.index)
            }
    })

    return 1;
}