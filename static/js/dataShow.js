function showContext(data) {
    let par=document.getElementsByClassName("context-show");
    for(let i=0;i<par.length;i++)
    {
        let childs=par[i].childNodes;
        if (childs.length===0) continue;
        for(let j=childs.length-1;j>=0;j--)
            par[i].removeChild(childs[j]);
    }

    for (let i=0;i<data.length;i++)
    {
        for(let j=0;j<par.length;j++)
        {
            let contextDiv=document.createElement("div");
            if(i%2===0)
                contextDiv.className="people people_A";
            else
                contextDiv.className="people people_B";

            let text=document.createTextNode(data[i])
            contextDiv.appendChild(text)
            par[j].appendChild(contextDiv)
        }
    }
}

function showReference(reference,output) {

    let referDiv=document.getElementsByClassName("reference")
    for(let i=0;i<referDiv.length;i++)
    {
        let childs=referDiv[i].childNodes;
        if (childs.length===0) continue;
        for(let j=childs.length-1;j>=0;j--)
            referDiv[i].removeChild(childs[j])
    }

    // let referText=document.createTextNode(reference)
    // let outputText=document.createTextNode(output)
    let referText=document.createElement("p")
    let outputText=document.createElement("p")
    referText.innerText=reference
    outputText.innerText=output

    referDiv[0].appendChild(referText)
    referDiv[1].appendChild(outputText)
}

function showScore(score) {

    let givenScore=document.getElementsByClassName("given-score")

    for(let i=0;i<givenScore.length;i++)
    {
        let childs=givenScore[i].childNodes;
        if (childs.length===0) continue;
        for(let j=childs.length-1;j>=0;j--)
            givenScore[i].removeChild(childs[j])
    }

    let text=document.createElement("p")
    text.innerText="score : "+score[0]
    givenScore[0].appendChild(text)
}

// 当前问题是请求数据,然后看数据的反馈效果

function displayData(data) {
    showContext(data["context"])
    showReference(data["reference"],data["output"])
    showScore(data["score"])
}