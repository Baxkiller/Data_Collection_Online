var index;
var toShowData;
var recordCnt;
var questionID;

function update(d,i,cnt,qIdx) {
    let preQuestion=questionID

    index=i;
    toShowData=d;
    recordCnt=cnt;
    questionID=qIdx;

    setCnt();
    displayData(d);

    freshQuestion();
    hide_question(preQuestion);
    show_question(qIdx);
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
                    alert("您已标注"+data.cnt+"组数据;当前无可用数据;请联系任务发布者或稍后再试...")
                    reDirected()
                }
                else if(data.index === -2)
                {
                    alert(data.msg)
                    reDirected()
                }
                update(data.d,data.index,data.cnt,1)
            }
    })

    return 1;
}