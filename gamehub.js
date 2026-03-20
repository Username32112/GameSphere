
// =============== SCREEN SWITCH ==================
function show(screen){
    document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
    document.getElementById(screen).classList.add("active");
}

// ================== CLICKER GAME ==================
let coins=0, autoClick=0, doubleCoins=false, clickMultiplier=1;
let upgrades=[
    {name:"Auto +1/sec", type:"auto", cost:50, value:1},
    {name:"Auto +5/sec", type:"auto", cost:500, value:5},
    {name:"Double Coins", type:"double", cost:100, value:true},
    {name:"Click x2", type:"mult", cost:200, value:2},
    {name:"Click x5", type:"mult", cost:1000, value:5},
    {name:"Coin Boost +100", type:"boost", cost:0, value:100, oneTime:true},
    {name:"Auto +20/sec", type:"auto", cost:5000, value:20},
    {name:"Click x10", type:"mult", cost:10000, value:10}
];

function updateClickerButtons(){
    let container=document.getElementById("clickerButtons");
    container.innerHTML="";
    upgrades.forEach(upg=>{
        if(coins>=upg.cost || (upg.oneTime && !upg.bought)){
            let btn=document.createElement("button");
            btn.innerText=upg.name+(upg.cost>0?" - Cost:"+upg.cost:"");
            btn.onclick=()=>{buyUpgrade(upg.name);}
            container.appendChild(btn);
        }
    });
}

function addCoin(){
    coins+=clickMultiplier*(doubleCoins?2:1);
    document.getElementById("coins").innerText=coins;
    updateClickerButtons();
}

function buyUpgrade(name){
    let upg=upgrades.find(u=>u.name===name);
    if(upg.cost<=coins || (upg.oneTime && !upg.bought)){
        coins-=upg.cost;
        if(upg.type==="auto") autoClick+=upg.value;
        if(upg.type==="double") doubleCoins=true;
        if(upg.type==="mult") clickMultiplier=upg.value;
        if(upg.type==="boost") coins+=upg.value;
        upg.bought=true;
        document.getElementById("coins").innerText=coins;
        updateClickerButtons();
    }
}

setInterval(()=>{
    coins+=autoClick*(doubleCoins?2:1);
    document.getElementById("coins").innerText=coins;
    updateClickerButtons();
},1000);

updateClickerButtons();

// ================== ADMIN PANEL ==================
let adminVisible=false;
let adminPanel=document.createElement("div");
adminPanel.style.position="fixed";
adminPanel.style.top="50px";
adminPanel.style.right="50px";
adminPanel.style.padding="20px";
adminPanel.style.background="#222";
adminPanel.style.color="#0f0";
adminPanel.style.border="2px solid #0f0";
adminPanel.style.display="none";
adminPanel.style.zIndex="9999";
adminPanel.innerHTML=`
<h3>Admin Panel</h3>
<button onclick="coins+=1000; document.getElementById('coins').innerText=coins; updateClickerButtons()">Add 1000 Coins</button>
<button onclick="autoClick+=10">Add +10 Auto Click</button>
<button onclick="clickMultiplier=10">Set Click x10</button>
<button onclick="doubleCoins=true; updateClickerButtons()">Enable Double Coins</button>
<button onclick="coins=0; autoClick=0; clickMultiplier=1; doubleCoins=false; updateClickerButtons()">Reset Clicker</button>
<button onclick="guessNumber=Math.floor(Math.random()*500)+1;document.getElementById('guessMsg').innerText='Number reset'">Reset Guess</button>
<button onclick="typeScore=0; document.getElementById('typeScore').innerText=0">Reset Typing</button>
<button onclick="reactionBest='--'; document.getElementById('reactionBest').innerText='--'">Reset Reaction</button>
<button onclick="colorScore=0; document.getElementById('colorScore').innerText=0">Reset Color</button>
<button onclick="mathScore=0; document.getElementById('mathScore').innerText=0">Reset Math</button>
<button onclick="aimScore=0; document.getElementById('aimScore').innerText=0">Reset Aim</button>
<button onclick="snakeScore=0; document.getElementById('snakeScore').innerText=0">Reset Snake</button>
<button onclick="moves=0; document.getElementById('moves').innerText=0; initMemory()">Reset Memory</button>
`;
document.body.appendChild(adminPanel);

let keysPressed={};
document.addEventListener("keydown",e=>{
    keysPressed[e.key.toLowerCase()]=true;
    if(keysPressed['c']&&keysPressed['m']&&keysPressed['d']&&keysPressed['s']){
        adminVisible=!adminVisible;
        adminPanel.style.display=adminVisible?"block":"none";
    }
});
document.addEventListener("keyup",e=>{keysPressed[e.key.toLowerCase()]=false});

// ================== BASIC PLACEHOLDER FOR OTHER GAMES ==================
// You would continue here with:
// - Reaction game logic
// - Guess game logic
// - Typing game logic
// - Memory game logic
// - Color match logic
// - Math logic
// - Aim trainer logic
// - Snake game logic

// Each game can now use admin commands for testing/cheats
