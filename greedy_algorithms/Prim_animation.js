var INFINITY=10086;
var FIND_MIN=100009;
var PUSH_INTO_T=100001;
var HIGHLIGHT_EDGE=100003;
var UPDATE_N=100004;
var UPDATE_C=100005;
var REFRESH=100006;
var REFRESH_2=100007;
var COMPARE=100008;

function Animation(){
    this.ctx = document.getElementById('myCanvas').getContext('2d');
    this.ctx.textAlign = "center";
    this.ctx.textBaseline="middle";
    this.ctx.font = "16px Arial";
    this.ctx.lineWidth=2;

    this.myStep = new Step();
    this.vertex =[
        {x:300, y:300},
        {x:500, y:200},
        {x:500, y:400},
        {x:700, y:100},
        {x:700, y:500},
        {x:900, y:200},
        {x:900, y:400},
        {x:1100, y:300}];

    this.edge = new Array(8);
    this.T = new Array(8);
    this.X = new Array(8);
    this.N = new Array(8);
    this.C = new Array(8);
    for(var i=0; i<8 ; i++){
        this.edge[i]=new Array(8);
        this.T[i]=new Array(8);
    }

    this.highlightStart=null;
    this.highlightEnd=null;
    this.nowMin=null;

    this.init=function(){
        this.myStep.init();
        this.highlightStart=null;
        this.highlightEnd=null;
        this.nowMin=null;
        for(var i=0; i<8 ; i++){
            this.X[i]=0;
            this.N[i]=null;
            this.C[i]=INFINITY;
            for(var j=0; j<8 ; j++){
                this.edge[i][j]=INFINITY;
                this.T[i][j]=0;
            }
        }
    };
    this.initForRefresh=function(){
        this.myStep.now=0;
        this.highlightStart=null;
        this.highlightEnd=null;
        this.nowMin=null;
        for(var i=0; i<8 ; i++){
            this.X[i]=0;
            this.N[i]=null;
            this.C[i]=INFINITY;
            for(var j=0; j<8 ; j++){
                this.T[i][j]=0;
            }
        }
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

    this.int=null;
    this.animationSpeed=1000;
}


Animation.prototype.drawVertex=function(){
    for(var i=0; i<8 ; i++){
        this.ctx.beginPath();
        this.ctx.arc(this.vertex[i].x, this.vertex[i].y, 20, 0, Math.PI*2);
        this.ctx.closePath();
        if(i==this.nowMin){
            this.ctx.fillStyle="#2196f3";
            this.ctx.fill();
        }
        else if(i==this.highlightEnd){
            this.ctx.fillStyle="red";
            this.ctx.fill();
        }
        else if(this.X[i]==1){
            this.ctx.fillStyle="#4CAF50";
            this.ctx.fill();
        }
        else{
            this.ctx.strokeStyle="black";
            this.ctx.stroke();
        }
        this.ctx.fillStyle="black";
        this.ctx.fillText(""+i, this.vertex[i].x, this.vertex[i].y);
    }
};

Animation.prototype.rebuildEdge=function(){
    for(var k=0; k<10; ){
        var x = Math.floor(Math.random()*8);
        var y = Math.floor(Math.random()*8);
        var z = Math.floor(Math.random()*20+1);
        if(this.allow[x][y]){
            this.edge[x][y]=z;
            k++;
        }
    }
};

Animation.prototype.drawSingleEdge=function(i, j, color){
    this.drawLine(this.vertex[i], this.vertex[j], 20, this.edge[i][j], this.curve[i][j], color);
};

Animation.prototype.drawEdge=function(){
    for(var i=0; i<8 ; i++){
        for(var j=i+1; j<8 ; j++){
            if(this.edge[i][j]!=INFINITY){
                if( (i==this.highlightStart && j==this.highlightEnd) ||
                    (j==this.highlightStart && i==this.highlightEnd))
                    this.drawSingleEdge(i, j, "red");
                else if(this.T[i][j]==1)
                    this.drawSingleEdge(i, j, "#4CAF50");
                else this.drawSingleEdge(i, j, "black");
            }
        }
    }
};

Animation.prototype.drawText=function() {
    this.ctx.clearRect(0, 0, 150, 600);
    this.ctx.fillStyle = "black";
    this.ctx.fillText("C", 75, 30);
    this.ctx.fillText("N", 120, 30);

    for (var i = 0; i < 8; i++) {
        if(this.X[i]==1)
            this.ctx.fillStyle="rgba(0, 0, 0, 0.3)";
        else this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
        this.ctx.fillText("" + i, 30, 40 * i + 60);
        this.ctx.fillText(this.C[i]!=INFINITY?this.C[i]: "∞", 75, 40 * i + 60);
        this.ctx.fillText(this.N[i]!=null?this.N[i]: "null", 120, 40 * i + 60);
    }
};


Animation.prototype.draw=function(){
    this.ctx.clearRect(0,0,1200,600);
    this.drawVertex();
    this.drawEdge();
    this.drawText();
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

Animation.prototype.prim=function(start){
    var n=8;
    var E = this.edge.slice(0);
    var X=new Array(n);
    this.myStep.addStep(FIND_MIN, start);
    for(var i=0; i<n ; i++){
        if(i==start) X[i]=1;
        else X[i]=0;
    }
    var N=new Array(n);
    var C=new Array(n);
    for( i=0; i<n ; i++){
        if(E[start][i]<INFINITY || E[i][start]<INFINITY){
            this.myStep.addStep(HIGHLIGHT_EDGE, start, i);
            this.myStep.addStep(COMPARE, i, start, i);
            N[i] = start;
            this.myStep.addStep(UPDATE_N, i, start);
            C[i] = E[start][i]!=INFINITY? E[start][i] : E[i][start];
            this.myStep.addStep(UPDATE_C, i, start, i);
            this.myStep.addStep(REFRESH);
        }
        else{
            C[i]=INFINITY;
        }
    }
    this.myStep.addStep(REFRESH_2);

    for(i=1; i<n; i++){
        var min=INFINITY;
        var y;
        var theEnd=true;
        for(var j=0; j< n ; j++){
            if(X[j]==0&&C[j]<min){
                min=C[j];
                y=j;
                theEnd=false;
            }
        }
        if(theEnd) return;
        X[y]=1;
        this.myStep.addStep(FIND_MIN, y);
        this.myStep.addStep(PUSH_INTO_T, N[y], y);

        for( j=0; j< n ; j++){
            if(X[j]!=1){
                if(E[y][j]<C[j] || E[j][y]<C[j]){
                    this.myStep.addStep(HIGHLIGHT_EDGE, y, j);
                    this.myStep.addStep(COMPARE, j, y, j);
                    N[j]=y;
                    this.myStep.addStep(UPDATE_N, j, y);
                    C[j]=E[y][j]<C[j]? E[y][j] : E[j][y];
                    this.myStep.addStep(UPDATE_C, j, y, j);
                    this.myStep.addStep(REFRESH);
                }
                else if(E[j][y]<INFINITY || E[y][j]<INFINITY){
                    this.myStep.addStep(HIGHLIGHT_EDGE, y, j);
                    this.myStep.addStep(COMPARE, j, y, j);
                    this.myStep.addStep(REFRESH);
                }
            }
        }
        this.myStep.addStep(REFRESH_2);
    }
};

Animation.prototype.findMin=function(i){
    this.ctx.beginPath();
    this.ctx.arc(this.vertex[i].x, this.vertex[i].y, 20, 0, Math.PI*2);
    this.ctx.closePath();
    this.ctx.fillStyle="#2196f3";
    this.ctx.fill();
    this.ctx.fillStyle="black";
    this.ctx.fillText(i, this.vertex[i].x, this.vertex[i].y);
    this.X[i]=1;
    this.nowMin=i;
};

Animation.prototype.highlightEdge=function(start, end){
    this.ctx.beginPath();
    this.ctx.arc(this.vertex[end].x, this.vertex[end].y, 20, 0, Math.PI*2);
    this.ctx.closePath();
    this.ctx.fillStyle="red";
    this.ctx.fill();
    this.ctx.fillStyle="black";
    this.ctx.fillText(end, this.vertex[end].x, this.vertex[end].y);

    if(start>end) this.drawSingleEdge(end, start, "red");
    else this.drawSingleEdge(start, end, "red");
    this.highlightStart=start;
    this.highlightEnd=end;
};

Animation.prototype.compare=function(i, edgeStart, edgeEnd, startTime, duration){
    var progress=((new Date().getTime())-startTime)/duration;
    if(progress>1) progress=1;
    this.ctx.clearRect(55, 40 * i + 40, 40, 40);
    this.ctx.fillStyle="red";
    if(progress<0.5)
        this.ctx.font=(16+16*progress)+"px Arial";
    else this.ctx.font=(16+16*(1-progress))+"px Arial";
    this.ctx.fillText(this.C[i]!=INFINITY?this.C[i]: "∞", 75, 40 * i + 60);
    var labelPos;
    if(edgeStart>edgeEnd){
        labelPos=this.getLabelPos(edgeEnd, edgeStart);
        this.ctx.clearRect(labelPos.x-13, labelPos.y-13, 26, 26);
        this.ctx.fillText(this.edge[edgeEnd][edgeStart], labelPos.x, labelPos.y);
        this.drawSingleEdge(edgeEnd, edgeStart, "red");
    }
    else{
        labelPos=this.getLabelPos(edgeStart, edgeEnd);
        this.ctx.clearRect(labelPos.x-13, labelPos.y-13, 26, 26);
        this.ctx.fillText(this.edge[edgeStart][edgeEnd], labelPos.x, labelPos.y);
        this.drawSingleEdge(edgeStart, edgeEnd, "red");
    }

    if(progress<1){
        window.requestAnimationFrame(this.compare.bind(this, i, edgeStart, edgeEnd, startTime, duration));
    }
};

Animation.prototype.pushIntoT=function(start, end, startTime, duration){
    var progress=((new Date().getTime())-startTime)/duration;
    if(progress>1) progress=1;
    this.ctx.lineWidth=2;
    this.ctx.shadowColor=null;
    this.ctx.shadowBlur=null;
    this.draw();
    this.ctx.lineWidth=10-progress*8;
    this.ctx.shadowColor="#4CAF50";
    this.ctx.shadowBlur=20*(1-progress);
    var color="rgba(76, 175, 80,"+(0.5+0.5*progress)+")";
    if(start>end)
        this.drawLine(this.vertex[end], this.vertex[start], 20*progress, this.edge[end][start], this.curve[end][start], color);
    else this.drawLine(this.vertex[start], this.vertex[end], 20*progress, this.edge[start][end], this.curve[start][end], color);
    if(progress<1){
        window.requestAnimationFrame(this.pushIntoT.bind(this, start, end, startTime, duration));
    }
    else{
        this.ctx.lineWidth=2;
        this.ctx.shadowColor=null;
        this.ctx.shadowBlur=null;
        if(start>end) this.T[end][start]=1;
        else this.T[start][end]=1;
    }
};


Animation.prototype.updateN=function(i, newValue, startTime, duration){
    this.draw();
    var progress=((new Date().getTime())-startTime)/duration;
    if(progress>1) progress=1;
    this.ctx.fillStyle="black";
    this.ctx.fillText(newValue, this.vertex[newValue].x+(120-this.vertex[newValue].x)*progress,
        this.vertex[newValue].y+((40*i+60)-this.vertex[newValue].y)*progress);
    if(progress<1){
        window.requestAnimationFrame(this.updateN.bind(this, i, newValue, startTime, duration));
    }
    else{
        this.N[i]=newValue;
        this.drawText();
    }
};

Animation.prototype.updateC=function(i, from, to){
    if(to<from){
        var temp=to;
        to=from;
        from=temp;
    }
    var pos=this.getLabelPos(from, to);
    this.updateCAnimation(i, pos.x, pos.y, this.edge[from][to], new Date().getTime(), this.animationSpeed*0.85);
};

Animation.prototype.getLabelPos=function(from, to){
    var edgeStart=this.vertex[from];
    var edgeEnd=this.vertex[to];
    var dis = Math.sqrt(Math.pow(edgeEnd.x-edgeStart.x, 2)+Math.pow(edgeEnd.y-edgeStart.y, 2));
    var cos = (edgeEnd.x-edgeStart.x)/dis;
    var sin = (edgeEnd.y-edgeStart.y)/dis;
    var startX=edgeStart.x+20*cos;
    var startY=edgeStart.y+20*sin;
    var endX=edgeEnd.x-20*cos;
    var endY=edgeEnd.y-20*sin;
    var curve=this.curve[from][to];
    var tangentX;
    var tangentY;
    var deltaX = endX - startX;
    var deltaY = endY - startY;
    if(curve==0){
        tangentX=(endX+startX)/2;
        tangentY=(endY+startY)/2;
    }
    else{
        var midX = (deltaX) / 2.0 + startX;
        var midY = (deltaY) / 2.0 + startY;
        tangentX = midX + deltaY * curve;
        tangentY = midY - deltaX * curve;
    }

    var labelPosX = 0.25* startX + 0.5*tangentX + 0.25*endX;
    var labelPosY =  0.25* startY + 0.5*tangentY + 0.25*endY;
    var midLen = Math.sqrt(deltaY*deltaY + deltaX*deltaX);
    if (midLen != 0)
    {
        labelPosX +=  (- deltaY * (curve>0?-1:1))  / midLen*10;
        labelPosY += ( deltaX * (curve>0?-1:1))  / midLen*10 ;
    }
    return {x:labelPosX, y:labelPosY};
};

Animation.prototype.updateCAnimation=function(i, fromX, fromY, value, startTime, duration){
    this.draw();
    var progress=((new Date().getTime())-startTime)/duration;
    if(progress>1) progress=1;
    this.ctx.fillStyle="black";
    this.ctx.fillText(value, fromX+(75-fromX)*progress,
        fromY+((40*i+60)-fromY)*progress);
    if(progress<1){
        window.requestAnimationFrame(this.updateCAnimation.bind(this, i, fromX, fromY, value, startTime, duration));
    }
    else{
        this.C[i]=value;
        this.drawText();
    }
};

Animation.prototype.refreshEdge=function(){
    this.highlightStart=null;
    this.highlightEnd=null;
    this.draw();
};

Animation.prototype.refreshMin=function(){
    this.nowMin=null;
    this.draw();
};



Animation.prototype.runStep=function(){
    if(this.myStep.now<this.myStep.count){
        var type = this.myStep.steps[this.myStep.now++];
        var par1 = this.myStep.steps[this.myStep.now++];
        var par2 = this.myStep.steps[this.myStep.now++];
        switch (type)
        {
            case FIND_MIN:this.findMin(par1);this.myStep.now--;break;
            case PUSH_INTO_T:this.pushIntoT(par1, par2, new Date().getTime(), this.animationSpeed*0.85);break;
            case HIGHLIGHT_EDGE:this.highlightEdge(par1, par2);break;
            case UPDATE_N:this.updateN(par1, par2, new Date().getTime(), this.animationSpeed*0.85);break;
            case UPDATE_C:this.updateC(par1, par2, this.myStep.steps[this.myStep.now++],
                new Date().getTime(), this.animationSpeed*0.85);break;
            case REFRESH:this.refreshEdge();this.myStep.now-=2;break;
            case REFRESH_2:this.refreshMin();this.myStep.now-=2;break;
            case COMPARE:this.compare(par1, par2, this.myStep.steps[this.myStep.now++],
                new Date().getTime(), this.animationSpeed*0.85);break;
        }
        if(this.myStep.now==this.myStep.count){
            window.clearInterval(this.int);
            status_stop();
        }
    }
};

Animation.prototype.backStep=function(){
    if(this.myStep.now>0) {
        var par = [];
        var i = 0;
        do {
            par[i] = this.myStep.steps[--this.myStep.now];
        }
        while (par[i++] < 100000);
        switch (par[--i]) {
            case FIND_MIN:this.nowMin=null;this.X[par[0]]=0;break;
            case PUSH_INTO_T:this.T[par[1]][par[0]]=0;break;
            case HIGHLIGHT_EDGE:this.highlightStart=null;this.highlightEnd=null;break;
            case UPDATE_N:this.N[par[1]]=null;break;
            case UPDATE_C:this.C[par[2]]=INFINITY;break;
            case REFRESH:break;
            case REFRESH_2:break;
            case COMPARE:break;
        }
        this.draw();
    }
};

Animation.prototype.run=function(){
    this.int=setInterval(this.runStep.bind(this), this.animationSpeed);
};

Animation.prototype.runPrim=function(startVertex){
    this.prim(startVertex);
    this.run();
};

Animation.prototype.newGraph=function(){
    window.clearInterval(this.int);
    this.init();
    this.rebuildEdge();
    this.draw();
};

Animation.prototype.refresh=function(){
    window.clearInterval(this.int);
    this.initForRefresh();
    this.draw();
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
