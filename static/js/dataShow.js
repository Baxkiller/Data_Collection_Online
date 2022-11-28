// 显示人说的话
// 生成内容是innerHTML的内容
function showUser(sentence) {
    return "<div class=\"from-div\"> <img src=\"/static/img/user.png\" class=\"face_photo_left\"> <p class=\"from-them\">" + sentence + "</p> </div>"
}

// 显示电脑说的内容
// 生成内容是innerHTML的内容
function showComputer(sentence) {
    return "<div class=\"from-div\"> <img src=\"/static/img/robot.png\" class=\"face_photo_right\"> <p class=\"from-me\">" + sentence + "</p> </div>"
}

// 得到的数据格式形如["",""]
function showDialog(sentences) {
    let extend_dialog=""
    for(let i=0;i<sentences.length;i++)
    {   // 第一句保证由人来讲
        if(i%2===0){
            extend_dialog=extend_dialog+showUser(sentences[i])
        }else{
            extend_dialog=extend_dialog+showComputer(sentences[i])
        }
    }
    return extend_dialog
}

function showReferOutput(reference,output) {
    let extend_dialog=showComputer(reference)
    extend_dialog=extend_dialog+showComputer(output)
    return extend_dialog
}


function displayData(data) {
    let tmp_dialog=showDialog(data["context"])
    tmp_dialog=tmp_dialog+showReferOutput(data["reference"],data["output"])
    let message_box=document.getElementById("message_box")
    message_box.innerHTML=tmp_dialog
}

// 一共的四个问题,尝试展现第i个问题
function show_question(question_index)
{
    if(question_index > 0 && question_index <5)
    {
        question=document.getElementById("question"+question_index)
        question.style.display=""
        buttonStateChange(question_index)
    }
}

function hide_question(question_index) {
    if(question_index >0 && question_index < 5)
    {
        let question=document.getElementById("question"+question_index)
        question.style.display="none"
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

function freshQuestion(){
    for(let i=1;i<5;i++) {
        let question_name="q"+i
        $("input[name=" + question_name + "]:checked").removeAttr('checked');
    }
}