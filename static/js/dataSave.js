var index=0;
data=null;

function trans2Php(d,path){
    // 保存数据
    $.ajax({
        type: "POST",
        url: "/save_data",
        data: {"value":JSON.stringify(d),"path":path},
        dataType:"json",
        success:function(msg){
            console.log("success")
        },
        error: function(msg){
            console.log("error")
        }
    });
}

function getScore() {
    let score=Number(form1.score.value);
    let usrName=form1.user.value;

    form1.score.value="";

    if(usrName=="" || score === "")
    {
        alert("请输入标注人姓名 和 当前评分");
        return;
    }

    let fileName="static/data/"+index+".json"
    if(index<data.length-1)
    {
        $.ajax({
            url:fileName,// 文件的URL路径
            type:"get",// 可以使用其他请求方式：post/head
            cache:"false",
            timeout:5,// 超时时间设置，单位毫秒
            success:function(d){
                d["usr"][usrName]=score;
                trans2Php(d,fileName);
            },
            error:function(){// 如果不存在 直接创建一个新的文件
                console.log("creating File!")
                let tmp=data[index]
                tmp["usr"]={}
                tmp["usr"][usrName]=score;
                trans2Php(tmp,fileName);
            }
        })
        
        // 更新页面
        index=index+1;
        setIndex();
        displayData(data[index]);

    }
}

function prePage() {
    if(index!==0)
    {
        index=index-1;
        setIndex();
        displayData(data[index]);
    }
}

function nxtPage() {
    if(index<data.length-1)
    {
        index=index+1;
        setIndex();
        displayData(data[index]);
    }
}

function changeIndex() {
    i=Number(form2.iIndex.value);
    index=i;
    displayData(data[index])
}

function setIndex()
{
    form2.iIndex.value=index;
}

function initialize(d) {
    data=d;
    setIndex();
    displayData(data[index]);
}