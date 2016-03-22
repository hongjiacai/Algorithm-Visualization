var INFINITY=10086;

var HIGHLIGHT_EDGE=100000;
var MOVE_CIRCLE=100001;
var HIGHLIGHT_VERTEX=100002;
var REFRESH = 100004;
var PUSH_INTO_T =100005;
var UPDATE_SET_0 = 100006;
var UPDATE_SET_1 = 100007;

function Edge(s, e, l){
    this.start=s;
    this.end=e;
    this.l=l;
}


function Animation(){
    this.ctx = document.getElementById('myCanvas').getContext('2d');
    this.ctx.textAlign = "center";
    this.ctx.textBaseline="middle";
    this.ctx.font = "16px Arial";
    this.ctx.lineWidth=2;

    this.myStep = new Step();

    this.vertex =[
        {x:200, y:300},
        {x:400, y:200},
        {x:400, y:400},
        {x:600, y:100},
        {x:600, y:500},
        {x:800, y:200},
        {x:800, y:400},
        {x:1000, y:300}];

    this.edge = [];
    this.T=[];
    this.set = new Array(8);


    this.init=function(){
        this.myStep.init();
        this.edge.length=0;
        this.T.length=0;
        for(var i=0; i<8 ; i++){
            this.set[i]=-1;
        }
    };

    this.initForRefresh=function(){
        this.myStep.init();
        this.edge=this.edge.concat(this.T);
        this.T.length=0;
        for(var i=0; i<8 ; i++){
            this.set[i]=-1;
        }
        this.draw();
        this.drawText();
        this.Kruskal();
    };

    this.allow=[
        [false,    true,  true,  true,  true,  false, false, false],
        [false,  false,    true,  true,  false, true,  true,  false],
        [false,  false,  false,    false, true,  true,  true,  false],
        [false,  false,  false, false,    false, true,  false, true],
        [false,  false, false,  false, false,     false, true,  true],
        [false, false,  false,  false,  false, false,    true,  true],
        [false, false,  false,  false, false,  false,  false,    true],
        [false, false, false, false,  false,  false,  false,  false]];
    this.curve= [
        [0, 0, 0, 0.5, 0.3, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0.2, 0],
        [0, 0, 0, 0, 0, 0.2, 0, 0],
        [0.3, 0, 0, 0, 0, 0, 0, 0.5],
        [0.5, 0, 0, 0, 0, 0, 0, 0.3],
        [0, 0, 0.2, 0, 0, 0, 0, 0],
        [0, 0.2, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0.3, 0.5, 0, 0, 0]];

    this.animationSpeed=1000;
    this.circle_1=-1;
    this.circle_2=-1;
    this.int=null;
}

Animation.prototype.drawVertex=function(){
    this.ctx.strokeStyle="black";
    this.ctx.fillStyle="black";
    for(var i=0; i<8 ; i++){
        this.ctx.beginPath();
        this.ctx.arc(this.vertex[i].x, this.vertex[i].y, 20, 0, Math.PI*2);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.fillText(""+i, this.vertex[i].x, this.vertex[i].y);
    }
};

Animation.prototype.rebuildEdge=function(){
    for(var k=0; k<10; ){
        var x = Math.floor(Math.random()*8);
        var y = Math.floor(Math.random()*8);
        var z = Math.floor(Math.random()*20+1);
        if(this.allow[x][y]){
            var i;
            for( i=0; i<this.edge.length; i++){
                if(this.edge[i].start==x&& this.edge[i].end==y)
                    break;
            }
            if(i==this.edge.length){
                this.edge.push(new Edge(x, y, z));
                k++;
            }
        }
    }
};

Animation.prototype.drawSingleEdge=function(i, j, l, color){
    this.drawLine(this.vertex[i], this.vertex[j], 20, l, this.curve[i][j], color);
};

Animation.prototype.drawEdge=function(){
    for(var i=0; i<this.T.length ; i++){
        this.drawSingleEdge(this.T[i].start, this.T[i].end, this.T[i].l, "#4CAF50");
    }

    for(i=0; i<this.edge.length ; i++){
        this.drawSingleEdge(this.edge[i].start, this.edge[i].end, this.edge[i].l, "black");
    }

};

Animation.prototype.draw=function(){
    this.ctx.clearRect(175,0,1200,600);
    this.drawVertex();
    this.drawEdge();
};

Animation.prototype.drawText=function(){
    this.ctx.clearRect(0, 0, 100, 600);
    this.ctx.fillStyle="black";
    for(var i=0; i<8 ; i++){
        this.ctx.fillText(""+i, 30, 40*i+60);
    }
    this.ctx.fillText("set", 75, 30);
    for( i=0; i<8 ; i++){
        this.ctx.fillText(this.set[i], 75, 40*i+60);
    }
    if(this.circle_1>=0){
        this.ctx.beginPath();
        this.ctx.arc(30, 40*this.circle_1+60, 15, 0, Math.PI*2);
        this.ctx.closePath();
        this.ctx.strokeStyle="red";
        this.ctx.stroke();
    }
    if(this.circle_2>=0){
        this.ctx.beginPath();
        this.ctx.arc(30, 40*this.circle_2+60, 15, 0, Math.PI*2);
        this.ctx.closePath();
        this.ctx.strokeStyle="blue";
        this.ctx.stroke();
    }
};

Animation.prototype.drawLine=function(from, to, cut, text, curve, color){
    var dis = Math.sqrt(Math.pow(to.x-from.x, 2)+Math.pow(to.y-from.y, 2));
    var cos = (to.x-from.x)/dis;
    var sin = (to.y-from.y)/dis;
    var startX=from.x+cut*cos;
    var startY=from.y+cut*sin;
    var endX=to.x-cut*cos;
    var endY=to.y-cut*sin;
    var tangentX;
    var tangentY;
    var deltaX = endX - startX;
    var deltaY = endY - startY;
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    if(curve==0){
        tangentX=(endX+startX)/2;
        tangentY=(endY+startY)/2;
        this.ctx.lineTo(endX, endY);
    }
    else{
        var midX = (deltaX) / 2.0 + startX;
        var midY = (deltaY) / 2.0 + startY;
        tangentX = midX + deltaY * curve;
        tangentY = midY - deltaX * curve;
        this.ctx.quadraticCurveTo(tangentX, tangentY, endX, endY);
    }
    this.ctx.strokeStyle=color;
    this.ctx.stroke();

    var labelPosX = 0.25* startX + 0.5*tangentX + 0.25*endX;
    var labelPosY =  0.25* startY + 0.5*tangentY + 0.25*endY;
    var midLen = Math.sqrt(deltaY*deltaY + deltaX*deltaX);
    if (midLen != 0)
    {
        labelPosX +=  (- deltaY * (curve>0?-1:1))  / midLen*10;
        labelPosY += ( deltaX * (curve>0?-1:1))  / midLen*10 ;
    }
    this.ctx.fillStyle=color;
    this.ctx.fillText(text, labelPosX, labelPosY);
};



Animation.prototype.find=function(a, x, circle){
    if(a[x] < 0){
        return x;
    }
    else{
        this.myStep.addStep(MOVE_CIRCLE, x, a[x], circle);
        return this.find(a, a[x], circle);
    }
};

Animation.prototype.union=function(a, x, t){
    var oldValueX=a[x];
    var oldValueT=a[t];
    if((a[x]==a[t]&&x>t) || (a[x] < a[t]) ){
        if(a[t]<0) a[x]+=a[t];
        else a[x]--;
        a[t]=x;
        this.myStep.addStep(UPDATE_SET_0, x, t, a[x], oldValueX);
        this.myStep.addStep(UPDATE_SET_1, t, x, oldValueT);
    }
    else{
        if(a[x]<0) a[t]+=a[x];
        else a[t]--;
        a[x]=t;
        this.myStep.addStep(UPDATE_SET_0, t, x, a[t], oldValueT);
        this.myStep.addStep(UPDATE_SET_1, x, t, oldValueX);
    }
};

Animation.prototype.Kruskal=function(){
    var edge=this.edge.slice(0);
    var T = [];
    var set = this.set.slice(0);
    edge.sort(function(a, b){
        if(a.l== b.l){
            if(a.start== b.start){
                return a.end- b.end;
            }
            else return a.start- b.start;
        }
        else return a.l- b.l;
    });

    var j=0;
    while(T.length<7 && edge.length>j){
        var s = edge[j].start;
        var e = edge[j].end;
        var l = edge[j].l;
        this.myStep.addStep(HIGHLIGHT_EDGE, s, e, l);
        this.myStep.addStep(HIGHLIGHT_VERTEX, s, 0);
        var a= this.find(set, s, 0);
        this.myStep.addStep(HIGHLIGHT_VERTEX, e, 1);
        var b = this.find(set, e, 1);
        if(a!=b){
            T.push(edge.splice(j, 1)[0]);
            this.myStep.addStep(PUSH_INTO_T, s, e);
            this.union(set, a, b);
        }
        else{
            j++;
        }
        this.myStep.addStep(REFRESH);
    }
};

Animation.prototype.highlightEdge=function(start, end, l){
    this.ctx.fillStyle="red";
    this.ctx.beginPath();
    this.ctx.arc(this.vertex[start].x, this.vertex[start].y, 22, 0, Math.PI*2);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(this.vertex[end].x, this.vertex[end].y, 22, 0, Math.PI*2);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.fillStyle="black";
    this.ctx.fillText(""+start, this.vertex[start].x, this.vertex[start].y);
    this.ctx.fillText(""+end, this.vertex[end].x, this.vertex[end].y);
    this.drawSingleEdge(start, end, l, "red");
};

Animation.prototype.findSet=function(i, color){
    this.ctx.beginPath();
    this.ctx.arc(30, 40*i+60, 15, 0, Math.PI*2);
    this.ctx.closePath();
    if(color==0){
        this.ctx.strokeStyle="red";
        this.circle_1=i;
    }
    else{
        this.ctx.strokeStyle="blue";
        this.circle_2=i;
    }
    this.ctx.stroke();
};

Animation.prototype.moveCircle=function(from, to, color, startTime, duration){
    var progress=((new Date().getTime())-startTime)/duration;
    if(progress>1) progress=1;
    this.ctx.clearRect(14, 40, 32, 360);
    this.ctx.fillStyle="black";
    for(var i=0; i<8 ; i++){
        this.ctx.fillText(""+i, 30, 40*i+60);
    }
    if(color==1){
        this.ctx.beginPath();
        this.ctx.arc(30, 40*this.circle_1+60, 15, 0, Math.PI*2);
        this.ctx.closePath();
        this.ctx.strokeStyle="red";
        this.ctx.stroke();
    }
    this.ctx.beginPath();
    this.ctx.arc(30, 40*((to-from)*progress+from)+60, 15, 0, Math.PI*2);
    this.ctx.closePath();
    this.ctx.strokeStyle= (color==0)?"red":"blue";
    this.ctx.stroke();

    if(progress<1){
        window.requestAnimationFrame(this.moveCircle.bind(this, from, to, color, startTime, duration));
    }
    else{
        if(color==0){
            this.circle_1=to;
        }
        else {
            this.circle_2=to;
        }
    }
};

Animation.prototype.updateSet0=function(x, from, ax, startTime, duration){
    var progress=((new Date().getTime())-startTime)/duration;
    if(progress>1) progress=1;
    this.ctx.fillStyle="black";
    this.ctx.clearRect(55, 40, 40, 320);
    for(var i=0; i<8 ; i++){
        this.ctx.fillText(this.set[i], 75, 40*i+60);
    }
    this.ctx.fillText(""+(ax-this.set[x]), 75, 40*from+60+40*(x-from)*progress);
    if(progress==1){
        this.ctx.clearRect(55, 40*x+40, 40, 40);
        this.ctx.fillText(ax, 75, 40*x+60);
    }

    if(progress<1){
        window.requestAnimationFrame(this.updateSet0.bind(this, x, from, ax, startTime, duration));
    }
    else{
        this.set[x] = ax;
    }
};

Animation.prototype.updateSet1=function(x, from, startTime, duration){
    var progress=((new Date().getTime())-startTime)/duration;
    if(progress>1) progress=1;

    this.ctx.fillStyle="black";
    this.drawText();

    this.ctx.beginPath();
    this.ctx.arc(30, 40*this.circle_1+60, 15, 0, Math.PI*2);
    this.ctx.closePath();
    this.ctx.strokeStyle="red";
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(30, 40*this.circle_2+60, 15, 0, Math.PI*2);
    this.ctx.closePath();
    this.ctx.strokeStyle="blue";
    this.ctx.stroke();

    this.ctx.fillText(from, 30+45*progress, 40*from+60+40*(x-from)*progress);

    if(progress==1){
        this.ctx.clearRect(55, 40*x+40, 40, 40);
        this.ctx.fillText(from, 75, 40*x+60);
    }

    if(progress<1){
        window.requestAnimationFrame(this.updateSet1.bind(this, x, from, startTime, duration));
    }
    else{
        this.set[x] = from;
    }
};


Animation.prototype.pushIntoT=function(s, e){
    var i;
    for(i=0; i<this.edge.length ; i++){
        if(this.edge[i].start==s&&this.edge[i].end==e) break;
    }
    this.pushIntoTAnimation(i, new Date().getTime(), this.animationSpeed*0.85);
};

Animation.prototype.pushIntoTAnimation=function(i, startTime, duration){
    var progress=((new Date().getTime())-startTime)/duration;
    if(progress>1) progress=1;
    this.ctx.lineWidth=2;
    this.ctx.shadowColor=null;
    this.ctx.shadowBlur=null;
    this.draw();
    var s=this.edge[i].start;
    var e=this.edge[i].end;
    this.ctx.lineWidth=10-progress*8;
    this.ctx.shadowColor="#4CAF50";
    this.ctx.shadowBlur=20*(1-progress);
    var color="rgba(76, 175, 80,"+(0.5+0.5*progress)+")";
    this.drawLine(this.vertex[s], this.vertex[e], 20*progress, this.edge[i].l, this.curve[s][e], color);
    if(progress<1){
        window.requestAnimationFrame(this.pushIntoTAnimation.bind(this, i, startTime, duration));
    }
    else{
        this.ctx.lineWidth=2;
        this.ctx.shadowColor=null;
        this.ctx.shadowBlur=null;
        this.T.push(this.edge.splice(i, 1)[0]);
    }
};

Animation.prototype.runStep=function(){
    if(this.myStep.now<this.myStep.count) {
        var type = this.myStep.steps[this.myStep.now++];
        var par1 = this.myStep.steps[this.myStep.now++];
        var par2 = this.myStep.steps[this.myStep.now++];
        switch (type)
        {
            case HIGHLIGHT_EDGE:this.highlightEdge(par1, par2, this.myStep.steps[this.myStep.now++]);break;
            case HIGHLIGHT_VERTEX:this.findSet(par1, par2);break;
            case MOVE_CIRCLE:this.moveCircle(par1, par2, this.myStep.steps[this.myStep.now++],
                new Date().getTime(), this.animationSpeed*0.85);break;
            case UPDATE_SET_0:this.updateSet0(par1, par2, this.myStep.steps[this.myStep.now++],
                new Date().getTime(), this.animationSpeed*0.85);this.myStep.now++;break;
            case UPDATE_SET_1:this.updateSet1(par1, par2, new Date().getTime(), this.animationSpeed*0.85);
                this.myStep.now++;break;
            case REFRESH:this.myStep.now-=2;this.circle_1=this.circle_2=-1;this.draw();this.drawText();break;
            case PUSH_INTO_T:this.pushIntoT(par1, par2);break;
        }
    }
    else{
        window.clearInterval(this.int);
        status_stop();
    }
};

Animation.prototype.backStep=function(){
    if(this.myStep.now>0){
        var par=[];
        var i=0;
        do{
            par[i]=this.myStep.steps[--this.myStep.now];
        }
        while(par[i++]<100000);
        switch (par[--i])
        {
            case HIGHLIGHT_EDGE :this.draw();break;
            case MOVE_CIRCLE :
            case HIGHLIGHT_VERTEX :
                if(par[0]==0) this.circle_1=-1;
                else this.circle_2=-1;
                this.drawText();
                break;
            case REFRESH :this.draw();break;
            case PUSH_INTO_T :this.edge.push(this.T.pop());this.draw();break;
            case UPDATE_SET_0 :this.set[par[3]]=par[0];this.drawText();break;
            case UPDATE_SET_1 :this.set[par[2]]=par[0];this.drawText();break;
        }
    }
};

Animation.prototype.test=function(){
    this.edge.push(new Edge(0, 1, 2));
    this.edge.push(new Edge(0, 3, 8));
    this.edge.push(new Edge(0, 4, 8));
    this.edge.push(new Edge(1, 2, 5));
    this.edge.push(new Edge(1, 5, 7));
    this.edge.push(new Edge(2, 5, 8));
    this.edge.push(new Edge(4, 7, 2));
    this.edge.push(new Edge(5, 7, 4));
};


Animation.prototype.run=function(){
    this.int=setInterval(this.runStep.bind(this),this.animationSpeed);
};

Animation.prototype.runKruskal=function(){
    this.run();
};

Animation.prototype.newGraph=function(){
    this.init();
    this.rebuildEdge();
    this.draw();
    this.drawText();
    this.Kruskal();
};

Animation.prototype.refresh=function(){
    window.clearInterval(this.int);
    this.initForRefresh();
    this.run();
};

Animation.prototype.play=function(){
    this.run();
};

Animation.prototype.pause=function(){
    window.clearInterval(this.int);
};

Animation.prototype.rewind=function(){
    this.backStep();
};
Animation.prototype.forward=function(){
    this.runStep();
};

Animation.prototype.changeSpeed=function(i){
    window.clearInterval(this.int);
    var speeds=[4000, 2000, 1000, 500, 200];
    this.animationSpeed=speeds[i];
    if(document.getElementById("play").innerHTML=="pause") this.run();
};