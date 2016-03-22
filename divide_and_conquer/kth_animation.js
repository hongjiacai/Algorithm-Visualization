var Black="rgba(0,0,0,0.54)";
var White="#FFFFFF";
var Blue="#2196F3";
var Red="#F44336";
var Green="#4CAF50";
var Yellow="#FFEB3B";
var Pink="#E91E63";
var Purple="#9C27B0";
var Cyan="#00BCD4";


function KthAnimation(){
    this.ctx = document.getElementById("myCanvas").getContext("2d");

    this.cellSize=60;
    this.size = 0;
    this.arra = new Array(100);
    this.originX=0;
    this.originY=0;
    this.canvasWidth = document.getElementById("myCanvas").getAttribute("width")-300;
    this.canvasWidthMargin=this.canvasWidth;

    this.init=function(){
        this.clear();
        this.originX=0;
        this.originY=0;
        this.canvasWidth = document.getElementById("myCanvas").getAttribute("width")-300;
        this.canvasWidthMargin=this.canvasWidth;
    };

    this.initCtx=function(){
        this.ctx.translate(300, 0);
        this.drawText();
    };

    this.code=[
        ["select(A, low, high, k)"],
        ["p = high-low+1;", "if p<threshold then", "将A排序 return (A[k])"],
        ["q=p/5", "将A分成q组,每组5个元素", "每组单独排序,每组中项集合为M"],
        ["mm = select(M, 0, q-1, q/2);", "mm为中项集合的中项"],
        ["将A[low high]分成3组", "A1={a| a<mm }   |A1|=", "A2={a| a=mm }   |A2|=", "A3={a| a>mm }   |A3|="],
        ["case"],
        ["|A1|>=k: return select(A1, 1, |A1|, k);"],
        ["|A1|+|A2|>=k: return mm;"],
        ["|A1|+|A2|< k: ", "return select(A3, 1, |A3|, k-|A1|-|A2|);"]
    ];

    this.countA1=0;
    this.countA2=0;
    this.countA3=0;

    this.appearID=new Array(5);

    this.cancelAnimationFrame=function(){
        for(var i=0; i<5 ; i++)
            window.cancelAnimationFrame(this.appearID[i]);
    };

    this.animationSpeed=400;
}

KthAnimation.prototype.newSelect=function(p){
    this.size=p;
    this.countA1=0;
    this.countA2=0;
    this.countA3=0;
    this.drawText();

    var needWidth=(Math.floor(p/5)+(p%5==0?0:1))*60;
    if(needWidth>this.canvasWidthMargin){
        this.originY+=400;
        this.originX=0;
        this.canvasWidthMargin=this.canvasWidth-needWidth;
    }
    else {
        this.originX=this.canvasWidth-this.canvasWidthMargin;
        this.canvasWidthMargin-=needWidth;
    }
};


KthAnimation.prototype.draw=function(position, bgStyle, textStyle){ //draw circle
    var x = Math.floor(position/5);
    var y = position%5;

    this.ctx.clearRect(this.originX+this.cellSize*x, this.originY+this.cellSize*y, this.cellSize, this.cellSize);

    this.ctx.beginPath();
    this.ctx.arc(this.originX+ this.cellSize*(x+0.5), this.originY+this.cellSize*(y+0.5), 20, 0, Math.PI*2, true);
    this.ctx.closePath();
    this.ctx.shadowColor="#666666";
    this.ctx.shadowBlur=4;
    this.ctx.shadowOffsetY=2;
    this.ctx.fillStyle=bgStyle;
    this.ctx.fill();

    this.ctx.shadowColor=null;
    this.ctx.shadowBlur=null;
    this.ctx.shadowOffsetY=null;
    this.ctx.fillStyle=textStyle;
    this.ctx.fillText(this.arra[position], this.originX+ this.cellSize*(x+0.5), this.originY+this.cellSize*(y+0.5));
};

KthAnimation.prototype.addShadow=function(){
    this.ctx.shadowColor="#666666";
    this.ctx.shadowBlur=4;
    this.ctx.shadowOffsetY=2;
};

KthAnimation.prototype.swap=function(target){
    this.addShadow();
    this.swapAnimation(target, new Date().getTime(), this.animationSpeed*0.85);
};

KthAnimation.prototype.swapAnimation=function(i, startTime, duration){  //swap i and i+1
    var progress=((new Date().getTime())-startTime)/duration;
    if(progress>1) progress=1;

    if(progress>=1){
        var temp=this.arra[i];
        this.arra[i]=this.arra[i+1];
        this.arra[i+1]=temp;
        this.draw(i, Blue, White);
        this.draw(i+1, Blue, White);
        return;
    }

    var x = Math.floor(i/5);
    var y = i%5;

    this.ctx.clearRect(this.originX+this.cellSize*x, this.originY+this.cellSize*y, this.cellSize, this.cellSize*2);

    this.ctx.beginPath();
    this.ctx.arc( this.originX+ this.cellSize*(x+0.5), this.originY+this.cellSize*(y+0.5)+progress*this.cellSize,
        20, 0, Math.PI*2, true);
    this.ctx.closePath();
    this.ctx.fillStyle=Yellow;
    this.ctx.fill();
    this.ctx.fillStyle=Black;
    this.ctx.fillText(this.arra[i], this.originX+ this.cellSize*(x+0.5), this.originY+this.cellSize*(y+0.5)+progress*this.cellSize);

    y++;
    this.ctx.beginPath();
    this.ctx.arc(this.originX+ this.cellSize*(x+0.5), this.originY+this.cellSize*(y+0.5)-progress*this.cellSize,
        20, 0, Math.PI*2, true);
    this.ctx.closePath();
    this.ctx.fillStyle=Yellow;
    this.ctx.fill();
    this.ctx.fillStyle=Black;
    this.ctx.fillText(this.arra[i+1], this.originX+ this.cellSize*(x+0.5), this.originY+this.cellSize*(y+0.5)-progress*this.cellSize);

    if(progress<1){
        window.requestAnimationFrame(this.swapAnimation.bind(this, i, startTime, duration));
    }
};

KthAnimation.prototype.highlight=function(i){
    this.draw(i, Red , White);
};

KthAnimation.prototype.assignNewValue=function(target, value){
    this.arra[target]=value;
    this.appear(target, new Date().getTime(), this.animationSpeed*3);
};

KthAnimation.prototype.appear=function(target, startTime, duration){
    var progress=((new Date().getTime())-startTime)/duration;
    if(progress>1) progress=1;

    var x = Math.floor(target/5);
    var y = target%5;
    this.ctx.clearRect(this.originX+this.cellSize*x, this.originY+this.cellSize*y, this.cellSize, this.cellSize);

    this.ctx.font = 18*progress+"px Arial";
    this.ctx.fillStyle=Blue;
    this.ctx.beginPath();
    this.ctx.arc( this.originX+ this.cellSize*(x+0.5), this.originY+this.cellSize*(y+0.5), 20*progress, 0, Math.PI*2, true);
    this.ctx.closePath();
    this.ctx.shadowColor="#666666";
    this.ctx.shadowBlur=4;
    this.ctx.shadowOffsetY=2;
    this.ctx.fill();

    this.ctx.fillStyle=White;
    this.ctx.shadowColor=null;
    this.ctx.shadowBlur=null;
    this.ctx.shadowOffsetY=null;
    this.ctx.fillText(this.arra[target], this.originX+ this.cellSize*(x+0.5), this.originY+this.cellSize*(y+0.5));

    if(progress<1){
        this.appearID[target%5]=window.requestAnimationFrame(this.appear.bind(this, target, startTime, duration));
    }
};

KthAnimation.prototype.disappear=function(target, startTime, duration){
    var progress=((new Date().getTime())-startTime)/duration;
    if(progress>1) progress=1;

    var x = Math.floor(target/5);
    var y = target%5;
    this.ctx.clearRect(this.originX+this.cellSize*x, this.originY+this.cellSize*y, this.cellSize, this.cellSize);

    this.ctx.fillStyle=Blue;
    this.ctx.beginPath();
    this.ctx.arc( this.originX+ this.cellSize*(x+0.5), this.originY+this.cellSize*(y+0.5), 20*(1-progress), 0, Math.PI*2, true);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.font = 20*(1-progress)+"px Arial";
    this.ctx.fillStyle=White;
    this.ctx.fillText(this.arra[target], this.originX+ this.cellSize*(x+0.5), this.originY+this.cellSize*(y+0.5));

    if(progress<1){
        window.requestAnimationFrame(this.disappear.bind(this, target, startTime, duration));
    }
};


KthAnimation.prototype.normal=function(i){
    this.draw(i, Blue, White);
};

KthAnimation.prototype.divideToA1=function(i){
    this.draw(i, Green, White);
    this.addCount(1);
};

KthAnimation.prototype.divideToA2=function(i){
    this.draw(i, Red, White);
    this.addCount(2);
};

KthAnimation.prototype.divideToA3=function(i){
    this.draw(i, Purple, White);
    this.addCount(3);
};

KthAnimation.prototype.finalAnswer=function(value){
    for(var j=0; j<this.size ; j++){
        if(this.arra[j]===value) {
            this.pop(j, new Date().getTime(), this.animationSpeed);break;
        }
    }
};

KthAnimation.prototype.pop=function(i, startTime, duration){
    if(this.stop) return;
    var progress=((new Date().getTime())-startTime)/duration;
    if(progress>1) progress=1;

    var x = Math.floor(i/5);
    var y = i%5;

    this.ctx.clearRect(this.originX+this.cellSize*x, this.originY+this.cellSize*y, this.cellSize, this.cellSize);

    this.ctx.fillStyle=Pink;
    this.ctx.shadowColor="#666666";
    this.ctx.shadowBlur=4;
    this.ctx.shadowOffsetY=2;
    this.ctx.beginPath();
    this.ctx.arc(this.originX+ this.cellSize*(x+0.5), this.originY+this.cellSize*(y+0.5), 25-10*(Math.abs(0.5-progress)), 0, Math.PI*2, true);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.shadowColor=null;
    this.ctx.shadowBlur=null;
    this.ctx.shadowOffsetY=null;
    this.ctx.fillStyle=White;
    this.ctx.fillText(this.arra[i], this.originX+ this.cellSize*(x+0.5), this.originY+this.cellSize*(y+0.5));
    if(progress<1){
        window.requestAnimationFrame(this.pop.bind(this, i, startTime, duration));
    }
};

KthAnimation.prototype.arrow=function(){
    var startX;
    var startY;
    if(this.canvasWidthMargin>100){
        startX = this.canvasWidth-this.canvasWidthMargin+10;
        this.canvasWidthMargin-=100;
    }
    else{
        startX = 10;
        this.originY+=400;
        this.canvasWidthMargin=this.canvasWidth-100;
    }
    startY = this.originY+160;

    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(startX+50, startY);
    this.ctx.lineTo(startX+50, startY+20);
    this.ctx.lineTo(startX+80,startY-10);

    this.ctx.lineTo(startX+50, startY-40);
    this.ctx.lineTo(startX+50, startY-20);
    this.ctx.lineTo(startX,startY-20);
    this.ctx.lineTo(startX,startY);
    this.ctx.closePath();
    this.ctx.fillStyle=Cyan;
    this.ctx.fill();
};

KthAnimation.prototype.clear=function(){
    var height = parseInt(document.getElementById("myCanvas").getAttribute("height"));
    this.ctx.clearRect(0, 0, this.canvasWidth, height);
};

KthAnimation.prototype.drawText=function(highlight){
    this.ctx.clearRect(-300, 0, 300, parseInt(document.getElementById("myCanvas").getAttribute("height")));

    this.ctx.font = "18px Arial";
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "middle";
    this.ctx.shadowColor=null;
    this.ctx.shadowBlur=null;
    this.ctx.shadowOffsetY=null;
    var y=20;
    for(var i=0; i<this.code.length ; i++){
        if(i==highlight) this.ctx.fillStyle=Red;
        else this.ctx.fillStyle="black";
        if(i!=4){
            for(var j=0; j<this.code[i].length ; j++){
                this.ctx.fillText(this.code[i][j], -290, y);
                y+=30;
            }
        }
        else{
            this.ctx.fillText(this.code[i][0], -290, y);
            this.ctx.fillText(this.code[i][1]+this.countA1, -290, y+30);
            this.ctx.fillText(this.code[i][2]+this.countA2, -290, y+60);
            this.ctx.fillText(this.code[i][3]+this.countA3, -290, y+90);
            y+=120;
        }
        y+=10;
    }

    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
};

KthAnimation.prototype.updateAn=function(n, i){
    this.ctx.font = "18px Arial";
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle="red";
    switch (n)
    {
        case 1:this.ctx.clearRect(-290, 345, 300, 30);this.ctx.fillText(this.code[4][1]+i, -290, 360);break;
        case 2:this.ctx.clearRect(-290, 375, 300, 30);this.ctx.fillText(this.code[4][2]+i, -290, 390);break;
        case 3:this.ctx.clearRect(-290, 405, 300, 30);this.ctx.fillText(this.code[4][3]+i, -290, 420);break;
    }
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
};


KthAnimation.prototype.addCount=function(n){
    switch (n)
    {
        case 1:this.countA1++;this.updateAn(n, this.countA1);break;
        case 2:this.countA2++;this.updateAn(n, this.countA2);break;
        case 3:this.countA3++;this.updateAn(n, this.countA3);break;
    }
};

KthAnimation.prototype.reduceCount=function(n){
    switch (n)
    {
        case 1:this.countA1--;this.updateAn(n, this.countA1);break;
        case 2:this.countA2--;this.updateAn(n, this.countA2);break;
        case 3:this.countA3--;this.updateAn(n, this.countA3);break;
    }
};