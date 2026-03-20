// ===================== SCREEN SWITCH =====================
function show(screen){
    document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
    document.getElementById(screen).classList.add("active");
}

// ===================== REACTION GAME =====================
let reactionStart, waiting=false, ready=false, timeout;
let bestReaction=localStorage.getItem("reactionBest")||0;
document.getElementById("reactionBest").innerText=bestReaction;
document.getElementById("reactionBox").onclick=function(){
    let box=this;
    if(!waiting&&!ready){
        box.style.background="red"; box.innerText="Wait...";
        waiting=true;
        timeout=setTimeout(()=>{
            box.style.background="lime"; box.innerText="CLICK!";
            reactionStart=Date.now(); ready=true; waiting=false;
        }, Math.random()*3000+2000);
    } else if(waiting){
        clearTimeout(timeout); box.innerText="Too early!"; waiting=false;
    } else if(ready){
        let t=Date.now()-reactionStart;
        document.getElementById("reactionResult")?.remove();
        box.insertAdjacentHTML("afterend","<p id='reactionResult'>"+t+" ms</p>");
        if(bestReaction==0 || t<bestReaction){bestReaction=t; localStorage.setItem("reactionBest",t); document.getElementById("reactionBest").innerText=t;}
        box.innerText="Click again"; box.style.background="#222"; ready=false;
    }
};

// ===================== MEMORY GAME =====================
const emojis=["🔥","🚓","🚑","🚒","💰","🎮","⚡","👑"];
let memCards=[], flipped=[], memMoves=0;
function startMemory(){
    let grid=document.getElementById("grid"); grid.innerHTML=""; flipped=[]; memMoves=0; document.getElementById("moves").innerText=0;
    memCards=[...emojis,...emojis].sort(()=>Math.random()-0.5);
    memCards.forEach(e=>{
        let c=document.createElement("div"); c.className="card"; c.dataset.val=e;
        c.onclick=()=>{ if(flipped.length<2&&!c.classList.contains("matched")) flipCard(c); };
        grid.appendChild(c);
    });
}
function flipCard(c){
    c.innerText=c.dataset.val; c.classList.add("flipped"); flipped.push(c);
    if(flipped.length==2){ memMoves++; document.getElementById("moves").innerText=memMoves;
        if(flipped[0].dataset.val==flipped[1].dataset.val){flipped.forEach(x=>x.classList.add("matched")); flipped=[];}
        else setTimeout(()=>{flipped.forEach(x=>{x.innerText=""; x.classList.remove("flipped");}); flipped=[];},600);
    }
}
startMemory();

// ===================== GUESS GAME =====================
let guessNum=Math.floor(Math.random()*500)+1;
function checkGuess(){
    let g=Number(document.getElementById("guessInput").value);
    if(g==guessNum) document.getElementById("guessMsg").innerText="🎉 Correct!"; 
    else if(g<guessNum) document.getElementById("guessMsg").innerText="Too low"; 
    else document.getElementById("guessMsg").innerText="Too high";
}

// ===================== CLICKER GAME =====================
let coins=0, autoClick=0, doubleCoins=false;
let autoCost=50, doubleCost=100;
function addCoin(){ coins+=doubleCoins?2:1; document.getElementById("coins").innerText=coins; }
function buyUpgrade(type){
    if(type==="auto" && coins>=autoCost){ coins-=autoCost; autoClick++; autoCost=Math.floor(autoCost*1.5); document.getElementById("autoCost").innerText=autoCost; }
    if(type==="double" && coins>=doubleCost){ coins-=doubleCost; doubleCoins=true; doubleCost=Math.floor(doubleCost*2); document.getElementById("doubleCost").innerText=doubleCost; }
    document.getElementById("coins").innerText=coins;
}
setInterval(()=>{ coins+=autoClick*(doubleCoins?2:1); document.getElementById("coins").innerText=coins; },1000);

// ===================== AIM TRAINER =====================
let aimScore=0; let aimBox=document.getElementById("aimBox");
aimBox.onclick=function(){ aimScore++; document.getElementById("aimScore").innerText=aimScore;
this.style.top=Math.random()*200+"px"; this.style.left=Math.random()*200+"px";};

// ===================== TYPING SPEED =====================
const words=["cat","dog","apple","banana","orange","keyboard","javascript","game","amazing","unbelievable","development","extraordinary","fantastic","programming"];
let typeScore=0; let currentWord="";
function newWord(){ 
    let idx=Math.min(typeScore,words.length-1);
    currentWord=words[idx]; document.getElementById("typeWord").innerText=currentWord; document.getElementById("typeInput").value="";
}
document.getElementById("typeInput").addEventListener("input",function(){
    if(this.value.toLowerCase()===currentWord.toLowerCase()){ typeScore++; document.getElementById("typeScore").innerText=typeScore; newWord();}
});
newWord();

// ===================== COLOR MATCH =====================
let colorScore=0; const colors=["red","green","blue"];
function newColor(){ let txt=colors[Math.floor(Math.random()*3)]; let col=colors[Math.floor(Math.random()*3)]; let el=document.getElementById("colorText"); el.innerText=txt; el.style.color=col;}
function checkColor(c){ let el=document.getElementById("colorText"); if(c===el.style.color){ colorScore++; document.getElementById("colorScore").innerText=colorScore;} newColor();}
newColor();

// ===================== MATH GAME =====================
let mathScore=0;
function newMath(){ let a=Math.floor(Math.random()*10*(mathScore+1)+1), b=Math.floor(Math.random()*10*(mathScore+1)+1); document.getElementById("mathQ").innerText=a+" + "+b; document.getElementById("mathAns").dataset.correct=a+b; document.getElementById("mathAns").value="";}
function checkMath(){ let ans=Number(document.getElementById("mathAns").value); if(ans==document.getElementById("mathAns").dataset.correct){mathScore++; document.getElementById("mathScore").innerText=mathScore;} newMath();}
newMath();

// ===================== SNAKE =====================
let snakeCanvas=document.getElementById("snakeCanvas"), ctx=snakeCanvas.getContext("2d");
let snake=[{x:10,y:10}], snakeDir={x:1,y:0}, snakeFood={x:15,y:15}, snakeScore=0;
function drawSnake(){ ctx.fillStyle="#111"; ctx.fillRect(0,0,300,300); ctx.fillStyle="lime"; snake.forEach(s=>ctx.fillRect(s.x*15,s.y*15,15,15)); ctx.fillStyle="red"; ctx.fillRect(snakeFood.x*15,snakeFood.y*15,15,15);}
function updateSnake(){ let head={x:snake[0].x+snakeDir.x,y:snake[0].y+snakeDir.y};
if(head.x<0||head.y<0||head.x>19||head.y>19||snake.some(s=>s.x===head.x&&s.y===head.y)){snake=[{x:10,y:10}]; snakeScore=0; document.getElementById("snakeScore").innerText=snakeScore; return;}
snake.unshift(head);
if(head.x===snakeFood.x&&head.y===snakeFood.y){snakeScore++; document.getElementById("snakeScore").innerText=snakeScore; snakeFood={x:Math.floor(Math.random()*20),y:Math.floor(Math.random()*20)};}else snake.pop();
drawSnake();}
document.addEventListener("keydown",e=>{if(e.key==="ArrowUp"&&snakeDir.y!==1)snakeDir={x:0,y:-1}; if(e.key==="ArrowDown"&&snakeDir.y!==-1)snakeDir={x:0,y:1}; if(e.key==="ArrowLeft"&&snakeDir.x!==1)snakeDir={x:-1,y:0}; if(e.key==="ArrowRight"&&snakeDir.x!==-1)snakeDir={x:1,y:0};});
setInterval(updateSnake,150);
