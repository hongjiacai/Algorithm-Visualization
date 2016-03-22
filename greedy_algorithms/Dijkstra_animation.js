var NULL=11111;
var INFINITY=10086;
var ADD_TO_X=100001;
var HIGHLIGHT_EDGE=100002;
var UPDATE_DISTANCE=100003;
var HIGHLIGHT_DISTANCE=100004;
var UPDATE_PATH=100005;


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
    this.X = new Array(8);
    this.Z = new Array(8);
    this.path = new Array(8);

    for(var i=0; i<8 ; i++){
        this.edge[i]=new Array(8);
    }


    this.init=function(){
        this.myStep.init();
        for(var i=0; i<8 ; i++){
            this.X[i]=0;
            this.Z[i]=INFINITY;
            this.path[i]=NULL;
            this.FP_start=0;
            this.FP_i=-1;
            for(var j=0; j<8 ; j++){
                this.edge[i][j]=INFINITY;
            }
        }
        this.ctx.clearRect(0, 0, 1200, 600);
    };
    this.initForRun=function(){
        this.myStep.init();
        for(var i=0; i<8 ; i++){
            this.X[i]=0;
            this.Z[i]=INFINITY;
            this.path[i]=NULL;
            this.FP_start=0;
            this.FP_i=-1;
        }
        this.ctx.clearRect(0, 0, 1200, 600);
    };
    this.initForRefresh=function(){
        this.myStep.now=0;
        for(var i=0; i<8 ; i++){
            this.X[i]=0;
            this.Z[i]=INFINITY;
            this.path[i]=NULL;
            this.FP_start=0;
            this.FP_i=-1;
        }
        this.ctx.clearRect(0, 0, 1200, 600);
    };

    this.allow=[
        [false, true,  true,  true,  true,  false, false, false],
        [true,  false, true,  true,  false, true,  true,  false],
        [true,  true,  false, false, true,  true,  true,  false],
        [true,  true,  false, false, false, true,  false, true],
        [true,  false, true,  false, false,  false, true,  true],
        [false, true,  true,  true,  false, false, true,  true],
        [false, true,  true,  false, true,  true,  false, true],
        [false, false, false, true,  true,  true,  true,  false]];
    this.curve= [
        [0, 0, 0, 0.5, 0.3, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0.2, 0],
        [0, 0, 0, 0, 0, 0.2, 0, 0],
        [0.3, 0, 0, 0, 0, 0, 0, 0.5],
        [0.5, 0, 0, 0, 0, 0, 0, 0.3],
        [0, 0, 0.2, 0, 0, 0, 0, 0],
        [0, 0.2, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0.3, 0.5, 0, 0, 0]];

    this.int=0;
    this.speed=500;
    this.animationSpeed=0.04;

    this.FP_start=0;
    this.FP_i=0;
}

Animation.prototype.drawVertex=function(){
    for(var i=0; i<8 ; i++){
        this.ctx.beginPath();
        this.ctx.arc(this.vertex[i].x, this.vertex[i].y, 20, 0, Math.PI*2);
        this.ctx.closePath();
        if(this.X[i]==1){
            this.ctx.fillStyle="red";
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
    for(var k=0; k<15; ){
        var x = Math.floor(Math.random()*8);
        var y = Math.floor(Math.random()*8);
        var z = Math.floor(Math.random()*9+1);
        if(this.allow[x][y]){
            this.edge[x][y]=z;
            k++;
        }
    }
};

Animation.prototype.drawSingleEdge=function(i, j, color){
    if(this.edge[i][j]!=INFINITY){
        if(this.edge[j][i]!=INFINITY && this.curve[i][j]==0 )
            this.drawLine(this.vertex[i], this.vertex[j], 20, this.edge[i][j], 0.18, color);
        else
            this.drawLine(this.vertex[i], this.vertex[j], 20, this.edge[i][j], this.curve[i][j], color);
    }
};

Animation.prototype.drawEdge=function(){
    for(var i=0; i<8 ; i++){
        for(var j=0; j<8 ; j++){
            this.drawSingleEdge(i, j, "black");
        }
    }
};

Animation.prototype.drawDistance=function(){
    for(var i=0; i<8 ; i++){
        if(this.Z[i]<INFINITY)
            this.ctx.fillText(this.Z[i], this.vertex[i].x, this.vertex[i].y+(i%2==0?30:-30));
        else this.ctx.fillText("∞", this.vertex[i].x, this.vertex[i].y+(i%2==0?30:-30));
    }
};

Animation.prototype.draw=function(){
    this.ctx.clearRect(279,0,1200,600);
    this.drawVertex();
    this.drawEdge();
    this.drawDistance();
};

Animation.prototype.drawLine=function(from, to, cut, text, curve, color){
    //Reference http://www.cs.usfca.edu/~galles/visualization/AnimationLibrary/Line.js
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
    this.ctx.fillStyle="black";
    this.ctx.fillText(text, labelPosX, labelPosY);

    var arrowHeight=6;
    var arrowWidth=6;
    var xVec = tangentX - endX;
    var yVec = tangentY - endY;
    var len = Math.sqrt(xVec * xVec + yVec*yVec);
    if (len > 0)
    {
        xVec = xVec / len;
        yVec = yVec / len;
        this.ctx.beginPath();
        this.ctx.moveTo(endX, endY);
        this.ctx.lineTo(endX + xVec*arrowHeight - yVec*arrowWidth, endY + yVec*arrowHeight + xVec*arrowWidth);
        this.ctx.lineTo(endX + xVec*arrowHeight + yVec*arrowWidth, endY + yVec*arrowHeight - xVec*arrowWidth);
        this.ctx.lineTo(endX, endY);
        this.ctx.closePath();
        this.ctx.fillStyle=color;
        this.ctx.fill();
    }
};

Animation.prototype.dijkstra=function(start){
    var X = new Array(8);
    var Z = new Array(8);
    var path = new Array(8);
    X[start]=1;
    Z[start]=0;
    path[start]=NULL;
    this.myStep.addStep(ADD_TO_X, start);
    this.myStep.addStep(UPDATE_DISTANCE, start, INFINITY, 0);
    for(var i=0; i< 8 ; i++){
        if(i!=start){
            X[i] = 0;
            Z[i]=this.edge[start][i];
            path[i]=NULL;
            if(Z[i]<INFINITY){
                this.myStep.addStep(HIGHLIGHT_EDGE, start, i);
                this.myStep.addStep(UPDATE_DISTANCE, i, INFINITY, Z[i]);
                this.myStep.addStep(UPDATE_PATH, i, NULL, start);
            }
        }
    }

    for(i=0; i<7 ; i++){
        var min=INFINITY;
        var y=INFINITY;
        for(var j=0; j< 8 ; j++){
            if(X[j]==0&&Z[j]<min){
                min=Z[j];
                y=j;
            }
        }
        if(y!=INFINITY){
            this.myStep.addStep(HIGHLIGHT_DISTANCE, y);
            X[y]=1;
            this.myStep.addStep(ADD_TO_X, y);
            for(var w=0; w< 8 ; w++){
                if(this.edge[y][w]<INFINITY){
                    this.myStep.addStep(HIGHLIGHT_EDGE, y, w);
                    if(Z[y]+this.edge[y][w]<Z[w]){
                        this.myStep.addStep(UPDATE_DISTANCE, w, Z[w], Z[y]+this.edge[y][w]);
                        this.myStep.addStep(UPDATE_PATH, w, path[w], y);
                        Z[w]=Z[y]+this.edge[y][w];
                        path[w]=y;
                    }
                }
            }
        }
    }
};


Animation.prototype.highlightDistance=function(i){
    this.ctx.strokeStyle="red";
    this.ctx.strokeText(this.Z[i], this.vertex[i].x, this.vertex[i].y+(i%2==0?30:-30));
};


Animation.prototype.updateDistance=function(i, oldDistance, newDistance, progress){
    if(progress>1) progress=1;
    if(progress==0){
        this.draw();
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(this.vertex[i].x-10, this.vertex[i].y+(i%2==0?20:-40), 20, 20);
        this.ctx.closePath();
        this.ctx.clip();
    }

    this.ctx.clearRect(this.vertex[i].x-10, this.vertex[i].y+(i%2==0?0:-60), 20, 40);
    this.ctx.translate(0, 20*this.animationSpeed);
    this.ctx.fillStyle="black";
    this.ctx.fillText(newDistance, this.vertex[i].x, this.vertex[i].y+(i%2==0?10:-50));
    this.ctx.fillText(oldDistance==INFINITY?"∞":oldDistance, this.vertex[i].x, this.vertex[i].y+(i%2==0?30:-30));

    if(progress<1){
        window.requestAnimationFrame(this.updateDistance.bind(this, i, oldDistance, newDistance, progress+this.animationSpeed));
    }
    else{
        this.Z[i]=newDistance;
        this.ctx.restore();
    }
};

Animation.prototype.addToX=function(i, progress){
    if(progress>1) progress=1;
    if(progress==0){
        this.draw();
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(this.vertex[i].x, this.vertex[i].y, 20, 0, Math.PI*2);
        this.ctx.closePath();
        this.ctx.clip();
    }
    this.ctx.beginPath();
    this.ctx.arc(this.vertex[i].x-20, this.vertex[i].y-20, 40*Math.sqrt(2)*progress, 0, Math.PI*2);
    this.ctx.closePath();
    this.ctx.fillStyle="red";
    this.ctx.fill();
    this.ctx.fillStyle="black";
    this.ctx.fillText(i, this.vertex[i].x, this.vertex[i].y);
    if(progress<1){
        window.requestAnimationFrame(this.addToX.bind(this, i, progress+this.animationSpeed));
    }
    else{
        this.X[i]=1;
        this.ctx.restore();
    }
};

Animation.prototype.highlightEdge=function(i, j){
    this.draw();
    this.drawSingleEdge(i, j, "red");
};

Animation.prototype.updatePath=function(i, value){
    this.ctx.clearRect(60, 30*i+60-15, 36, 30);
    this.ctx.fillStyle="black";
    this.ctx.fillText(value==NULL?"null":value, 80, 30*i+60);
    this.path[i]=value;
};


Animation.prototype.drawText=function(){
    this.ctx.clearRect(0, 0, 100, 600);
    this.ctx.fillText("vertex", 35, 30);
    for(var i=0; i<8 ; i++){
        this.ctx.fillText(""+i, 35, 30*i+60);
    }
    this.ctx.fillText("path", 80, 30);
    for( i=0; i<8 ; i++){
        this.ctx.fillText(this.path[i]!=NULL?this.path[i]:"null", 80, 30*i+60);
    }
    this.ctx.moveTo(98, 15);
    this.ctx.lineTo(98, 285);
    this.ctx.stroke();
};

Animation.prototype.drawPath=function(i, j, progress){
    if(progress>1) progress=1;
    this.ctx.clearRect(100, 30*i+45, 150, 30);
    this.ctx.fillStyle="black";
    var temp=i;
    for(var k=0; k<j ; k++){
        this.ctx.fillText(temp, 110+20*(j-k-1)+progress*20, 30*i+60);
        temp=this.path[temp];
    }
    if(progress==1){
        this.ctx.fillText(temp, 110, 30*i+60);
    }
    if(progress<1){
        window.requestAnimationFrame(this.drawPath.bind(this, i, j, progress+this.animationSpeed));
    }
};

Animation.prototype.findPath=function(start, i){
    var temp=start;
    for(var j=0; j<i ; j++)
        temp=this.path[temp];
    if(this.path[temp]!=NULL){
        this.drawSingleEdge(this.path[temp], temp, "red");
        this.drawPath(start, i+1, 0);
    }
};


Animation.prototype.runStep=function(){
    if(this.myStep.now<this.myStep.count) {
        var type = this.myStep.steps[this.myStep.now++];
        var par = this.myStep.steps[this.myStep.now++];
        switch (type) {
            case ADD_TO_X:
                this.addToX(par, 0);
                break;
            case HIGHLIGHT_EDGE:
                this.highlightEdge(par, this.myStep.steps[this.myStep.now++]);
                break;
            case UPDATE_DISTANCE:
                this.updateDistance(par, this.myStep.steps[this.myStep.now++], this.myStep.steps[this.myStep.now++], 0);
                break;
            case HIGHLIGHT_DISTANCE:
                this.highlightDistance(par);
                break;
            case UPDATE_PATH:
                ++this.myStep.now;
                this.updatePath(par, this.myStep.steps[this.myStep.now++]);
                break;
        }
    }
    else{
        var temp=this.FP_start;
        for(var j=0; j<this.FP_i ; j++)
            temp=this.path[temp];
        if(this.path[temp]!=NULL){
            this.findPath(this.FP_start, ++this.FP_i);
        }
        else {
            this.draw();
            if(this.FP_start<7){
                this.FP_i=-1;
                this.findPath(++this.FP_start, ++this.FP_i);
            }
            else{
                window.clearInterval(this.int);
                status_stop();
            }
        }
    }
};

Animation.prototype.backStep=function(){
    if(this.myStep.now<this.myStep.count&&this.myStep.now>0){
        var par = this.myStep.steps[--this.myStep.now];
        var type = this.myStep.steps[--this.myStep.now];
        var par2;
        if(type<100000){
            par2=par;
            par = type;
            type=this.myStep.steps[--this.myStep.now];
        }
        if(type<100000){
            par2=par;
            par = type;
            type=this.myStep.steps[--this.myStep.now];
        }
        if(type==ADD_TO_X){
            this.X[par]=0;
        }
        else if(type==UPDATE_DISTANCE){
            this.Z[par]=par2;
        }
        else if(type==UPDATE_PATH){
            this.path[par]=par2;
            this.drawText();
        }
        this.draw();
    }
};

Animation.prototype.run=function(){
    this.int=setInterval(this.runStep.bind(this),this.speed);
};


Animation.prototype.play=function(){
    myAnimation.run();
};
Animation.prototype.pause=function(){
    window.clearInterval(this.int);
};
Animation.prototype.runDijkstra=function(i){
    window.clearInterval(this.int);
    this.initForRun();
    this.draw();
    this.drawText();
    this.dijkstra(i);
    this.run();
};
Animation.prototype.refresh=function(){
    window.clearInterval(this.int);
    this.initForRefresh();
    this.draw();
    this.drawText();
    this.run();
};
Animation.prototype.rewind=function(){
    this.backStep();
};
Animation.prototype.forward=function(){
    this.runStep();
};
Animation.prototype.changeSpeed=function(value){
    window.clearInterval(this.int);
    var speeds=[1000, 500, 300, 200, 110];
    var animationSpeeds=[0.02, 0.04, 0.06, 0.085, 0.15];
    this.speed=speeds[value];
    this.animationSpeed=animationSpeeds[value];
    if(document.getElementById("play").innerHTML!="play_arrow"){
        this.run();
    }
};
Animation.prototype.newGraph=function(){
    window.clearInterval(this.int);
    this.init();
    this.rebuildEdge();
    this.draw();
    this.drawText();
    this.dijkstra(parseInt(document.getElementById("start").value));
};