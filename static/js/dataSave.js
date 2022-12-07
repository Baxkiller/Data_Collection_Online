// 提交分数
function submitScore(uid,score,idx) {
    return new Promise((resolve, reject) => {
        clearTimer()
        $.ajax({
            type: "POST",
            url: "/submitScore",
            data: {"uid": uid, "score": JSON.stringify(score), "index": idx},
            dataType: "json",
            success: function (msg) {
//                console.log("success");
                if (msg.status === 400) {
                    alert(msg.msg);
                    reDirected()
                }
            },
            error: function (msg) {
//                console.log(msg);
            }
        });
    })
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

    submitScore(userName,score,index).then(dataLoad)
    setTimer()
}


// 检查用户给定的选项是否合理
function submit_label() {
    let res=[];
    let flag=true;
    let no_answer_question=0;
    for(let i=1;i<5;i++)
    {
        let question_name="q"+i
        let answer = $("input[name=" + question_name + "]:checked").val();
        if(answer === undefined){
            alert("请选择第"+i+"个问题的选项后提交")
            flag=false;
            no_answer_question=i;
            break;
        } else{
            res.push(Number(answer));
        }
    }

    if(flag){
        let uid=document.cookie;
        
        submitScore(uid,res,index);
        dataLoad(1);
        setTimer();

    } else {
        hide_question(questionID);
        questionID=no_answer_question
        show_question(questionID);
    }
}