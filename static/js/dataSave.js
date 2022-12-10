// 提交分数
function submitScore(uid,score,idx) {
        clearTimer()
        $.ajax({
            type: "POST",
            url: "/submitScore",
            data: {"uid": uid, "score": JSON.stringify(score), "index": idx},
            dataType: "json",
            sync:false,
            success: function (msg) {
                if (msg.status === 400) {
                    alert(msg.msg);
                    reDirected()
                }
                else if(msg.status===200){
                    dataLoad()
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest.status);
                // 状态
                console.log(XMLHttpRequest.readyState);
                // 错误信息
                console.log(textStatus);
            }
        });
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

    } else {
        hide_question(questionID);
        questionID=no_answer_question
        show_question(questionID);
    }
}