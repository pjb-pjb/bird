let screen = document.querySelector(".screen"); //场景
let screenWidth = screen.offsetWidth;//场景的宽度
let screenHeight = screen.offsetHeight;//场景的高度
let bird = document.querySelector(".bird"); //鸟
let birdSize = bird.offsetWidth;    //鸟的大小
let footer = document.querySelector(".footer"); //墙
let footerTop = footer.offsetTop;//墙距顶部的距离
let footerHeight = footer.offsetHeight;//墙距顶部的距离
let birdDropSpeed = 1;  //鸟掉落的速度
let birdJumpSpeed = -1;  //鸟上升的速度
let birdJumpMaxSize = 1;    //鸟上升的最大高度(倍数)
let conduitSpeed = -1;  //管道移动的速度
let conduitWidth = 30;  //管道的宽度
let conduitProSpe = screenWidth/(Math.abs(conduitSpeed)/10);   //管道生成的速度
let conduitGap = 3;

let time1;  //保存bird掉落的定时器
let time2;  //保存bird上升的定时器
let time4;  //保存生成管道的定时器
let time5Arr = []; //保存所有管道移动的定时器
//开始游戏
function start() {
    birdDrop();
    produceConduit();
    setBirdJump();
}
start();

//鸟掉落
function birdDrop() {
    time1 = setInterval(function () {
        isCheckFail();
        bird.style.top =  (bird.offsetTop+birdDropSpeed)+"px";
    },10);
}

//鸟上升
function birdJump() {
    clearInterval(time1);    //停止鸟下降
    clearInterval(time2);    //停止上一次鸟的上升
    let oldTop = bird.offsetTop;
    time2 = setInterval(function () {
        let newTop = bird.offsetTop;
        if(birdJumpMaxSize*birdSize<=oldTop-newTop||newTop<=0){
            clearInterval(time2);   //停止上升
            birdDrop();             //开始下降
        }
        bird.style.top =  (bird.offsetTop+birdJumpSpeed)+"px";
    },5);
}

//结束游戏
function stop() {
    clearInterval(time1);   //清除鸟掉落的定时器
    clearInterval(time4);//停止生成管道

    /*
    * 停止所有管道移动
    * */
    time5Arr.forEach(function (val) {
        clearInterval(val);
    });
    //停止鸟上升
    window.onkeydown = null;
}

//检查游戏是否失败
function isCheckFail(){
    if(bird.offsetTop+birdDropSpeed>footerTop-birdSize){
        stop();
    }
}

//设置鸟上升
function setBirdJump() {
    //监听键盘按下事件
    window.onkeydown = function (e) {
        if(e.keyCode === 32){
            birdJump();
        }
    }
}

//创建管道
function createConduit() {
   let conduit1 = document.createElement("div");
   let conduit2 = document.createElement("div");
    conduit1.classList.add("conduit1");
    conduit2.classList.add("conduit2");
    conduitGap = getRandom(2.5,4);
    let height1 = getRandom(birdSize*2,screenHeight-birdSize*(1+conduitGap)-footerHeight);
    let height2 = screenHeight - height1 - conduitGap*birdSize;
    conduit1.style.height = height1+"px";
    conduit2.style.height = height2+"px";
    screen.appendChild(conduit1);
    screen.appendChild(conduit2);
    //管道移动
    let time3 = setInterval(function () {
        if(conduit1.offsetLeft+conduitSpeed<=-conduitWidth){
            clearInterval(time3);
            time5Arr.shift();
            screen.removeChild(conduit1);
            screen.removeChild(conduit2);
        }
        conduit1.style.left = (conduit1.offsetLeft+conduitSpeed)+"px";
        conduit2.style.left = (conduit1.offsetLeft+conduitSpeed)+"px";
    },10);
    time5Arr.push(time3);
}

//生成管道
function produceConduit() {
    createConduit();
    time4 = setInterval(createConduit,conduitProSpe/1.5);
}

//生成随机数
function getRandom(start,end) {
    return Math.random()*(end-start)+start;
}
window.onblur = function () {
    stop();
}

