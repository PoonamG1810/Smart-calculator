const display = document.getElementById("display");
const historyList = document.getElementById("historyList");

historyList.innerHTML =
localStorage.getItem("history") || "";

function appendValue(value){
    display.value += value;
}

function clearDisplay(){
    display.value = "";
}

function deleteLast(){
    display.value = display.value.slice(0,-1);
}

function calculate(){

    try{

        let originalExpression = display.value;
        let expression = originalExpression;

        expression = expression.replace(/sin\(/g,"Math.sin(");
        expression = expression.replace(/cos\(/g,"Math.cos(");
        expression = expression.replace(/tan\(/g,"Math.tan(");
        expression = expression.replace(/sqrt\(/g,"Math.sqrt(");

        const result =
        Function('"use strict"; return (' +
        expression + ')')();

        display.value = result;

        const item =
        document.createElement("li");

        item.textContent =
        `${originalExpression} = ${result}`;

        historyList.prepend(item);

        localStorage.setItem(
            "history",
            historyList.innerHTML
        );

    }catch{
        display.value = "Error";
    }
}

function clearHistory(){
    historyList.innerHTML = "";
    localStorage.removeItem("history");
}

const themeBtn =
document.getElementById("themeBtn");

if(localStorage.getItem("theme")==="dark"){
    document.body.classList.add("dark");
}

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark")
        ? "dark"
        : "light"
    );

});

document.addEventListener("keydown",(e)=>{

    const key = e.key;

    if(!isNaN(key) ||
       "+-*/().".includes(key)){
        display.value += key;
    }

    if(key==="Enter"){
        calculate();
    }

    if(key==="Backspace"){
        deleteLast();
    }

    if(key==="Escape"){
        clearDisplay();
    }

});

const voiceBtn =
document.getElementById("voiceBtn");

voiceBtn.addEventListener("click",()=>{

    const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

    if(!SpeechRecognition){
        alert("Speech Recognition not supported in this browser.");
        return;
    }

    const recognition =
    new SpeechRecognition();

    recognition.onresult = (event)=>{

        let text =
        event.results[0][0].transcript;

        text = text
        .replace(/plus/g,"+")
        .replace(/minus/g,"-")
        .replace(/times/g,"*")
        .replace(/divide/g,"/");

        display.value = text;
    };

    recognition.start();

});