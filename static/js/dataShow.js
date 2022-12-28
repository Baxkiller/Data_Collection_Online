sample_score_output=[0,3,4,3,4]
sample_score_refer1=[0,1,2,3,1]
sample_score_refer2=[0,5,5,5,5]

// 显示人说的话
// 生成内容是innerHTML的内容
function showUser(sentence) {
    return "<div class=\"from-div\"> <img src=\"/static/img/user.png\" class=\"face_photo_left\"> <p class=\"from-them\">" + sentence + "</p> </div>"
}

// 显示电脑说的内容
// 生成内容是innerHTML的内容
function showComputer(sentence) {
    return "<div class=\"from-div\"> <img src=\"/static/img/robot1.png\" class=\"face_photo_right\"> <p class=\"from-me\">" + sentence + "</p> </div>"
}

function showOutput(sentence,mode) {
    if(mode === 0){
        return "<div class=\"from-div\"> <img src=\"/static/img/robot1.png\" class=\"face_photo_right\"> <p class=\"from-me\">" + sentence + "</p> </div>"
    }else {
        return "<div class=\"from-div\"><p id='reference_score' style='font-weight: bold;color: red'>评分:4</p> <img src=\"/static/img/robot1.png\" class=\"face_photo_right\"> <p class=\"from-me\">" + sentence + "</p> </div>"
    }
}

function showReference(sentence,mode,score=3) {
    if(mode === 0){
        return "<div class='output-dialog dialog'><div class=\"from-div\"> <p style='font-weight: bold;color: red'>参考评分:"+score+"</p> <img src=\"/static/img/robot2.png\" class=\"face_photo_right\"> <p class=\"from-me\">" + sentence + "</p> </div></div>"
    } else {
        let tmp="<div class='output-dialog dialog'>"
        for(let i=0;i<sentence.length;i++)
        {
            let idx=i+1
            tmp=tmp+"<div class=\"from-div\"><p style='font-weight: bold;color: red' id='refer_score"+idx+"'>参考评分"+idx+" :3分</p> <img src=\"/static/img/robot2.png\" class=\"face_photo_right\"> <p class=\"from-me\">" + sentence[i] + "</p></div>"
        }
        tmp=tmp+"</div>"
        return tmp;
    }
}

// 得到的数据格式形如["",""]
function showDialog(sentences,emotion) {
    let extend_dialog="<div class='context-dialog dialog'>"
    let hint_emotion="<div class='hint_emotion'><b style='color: red'>对话上文</b></div>"
    extend_dialog=extend_dialog+hint_emotion
    for(let i=0;i<sentences.length-1;i++)
    {   // 第一句保证由人来讲
        if(i%2===0){
            extend_dialog=extend_dialog+showUser(sentences[i])
        }else{
            extend_dialog=extend_dialog+showComputer(sentences[i])
        }
    }
    extend_dialog=extend_dialog+"</div>"
    extend_dialog=extend_dialog+showUser(sentences[sentences.length-1])
    return extend_dialog
}

// 0代表正常输出,1代表样例sample输出
function showReferOutput(reference,output,mode,score=3) {
    let extend_dialog=showOutput(output,mode)
    extend_dialog=extend_dialog+showReference(reference,mode,score)
    return extend_dialog
}


function displayData(data) {
    let tmp_dialog=showDialog(data["context"],data["emotion"])
    tmp_dialog=tmp_dialog+showReferOutput(data["reference"],data["output"],0,data["score"][0].toFixed(1))
    let message_box=document.getElementById("message_box")
    message_box.innerHTML=tmp_dialog

    let robot_infos=showRobotInfo(data["personality"])
    document.getElementById("robot_information").innerHTML=robot_infos
}

// 一共的四个问题,尝试展现第i个问题
function show_question(question_index)
{
    if(question_index > 0 && question_index <5)
    {
        let question=document.getElementById("question"+question_index)
        let question_hint=document.getElementById("hint_q"+question_index)
        let table=document.getElementById("table_q"+question_index)
        let score=document.getElementById("suggest_refer_score"+question_index)

        document.getElementById("reference_score").innerText="分数:"+sample_score_output[question_index]
        document.getElementById("refer_score1").innerText="参考评分1 :"+sample_score_refer1[question_index]+"分"
        document.getElementById("refer_score2").innerText="参考评分2 :"+sample_score_refer2[question_index]+"分"

        question.style.display=""
        question_hint.style.display=""
        table.style.display=""
        score.style.display=""
        buttonStateChange(question_index)
    }
}

function hide_question(question_index) {
    if(question_index >0 && question_index < 5)
    {
        let question=document.getElementById("question"+question_index)
        let question_hint=document.getElementById("hint_q"+question_index)
        let table=document.getElementById("table_q"+question_index)
        let score=document.getElementById("suggest_refer_score"+question_index)

        question_hint.style.display="none"
        question.style.display="none"
        table.style.display="none"
        score.style.display="none"
    }
}

function buttonStateChange(question_index)
{
    let preBtn=document.getElementById("previous_button")
    let nxtBtn=document.getElementById("next_button")
    let submitBtn=document.getElementById("submit_inline")

    if(question_index === 1) {
        preBtn.style.display="none"
        submitBtn.style.display = "none";
        nxtBtn.style.display="block"
    }
    else if(question_index === 4) {
        nxtBtn.style.display="none"
        preBtn.style.display="block"
        submitBtn.style.display="block";
    }
    else{
        submitBtn.style.display="none";
        nxtBtn.style.display="block"
        preBtn.style.display="block"
    }
}

function previous_question() {
    hide_question(questionID)
    questionID=questionID-1
    show_question(questionID)
}

function next_question() {
    hide_question(questionID)
    questionID=questionID+1
    show_question(questionID)
}

function setCnt()
{
    document.getElementById("labelCnt").value=recordCnt
}

function freshQuestion(score){
    for(let i=1;i<5;i++) {
        let question_name="q"+i
        $("input[name=" + question_name + "]:checked").removeAttr('checked');
        let score_name="suggest_refer_score"+i
        document.getElementById(score_name).value=score
    }
}

function showRobotInfo(infos){
    if(infos === undefined)
        return ""
    let ret="<div class='wrap_robot_infos'><div class='robot_infos_title'> <b style='color: red'>语音助手性格设定</b></div>"
    ret=ret+"<div class='robot_infos'>"
    for(let i=0;i<infos.length;i++)
    {
        ret=ret+
            "<div class='robot_info'><span>"+infos[i]+"</span></div>"
    }
    return ret+"</div></div>"
}

function show_sample() {
    // 先读取data
    $.ajax({
        url: "/requestSample",
        type: "GET",
        dataType: "json",
        success:
            function (d) {
                let data=d.d[0]
                let sample_box=document.getElementById("sample_dialog")
                let sample_dialog=showDialog(data["context"],"激动，感激")
                sample_dialog=sample_dialog+showOutput(data["output"])
                sample_dialog=sample_dialog+showReference(data["reference"],1)
                sample_box.innerHTML=sample_dialog

                let sample_robot_infos=document.getElementById("robot_info_sample")
                let robot_infos=showRobotInfo(data["personality"])
                sample_robot_infos.innerHTML=robot_infos
            }
    })

}