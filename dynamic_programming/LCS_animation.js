
function Animation(){
    this.cellSize=50;
    this.MAX_X = Math.floor((document.getElementById('myCanvas').height-100)/50);
    this.MAX_Y = Math.floor((document.getElementById('myCanvas').width-400)/50);
    this.arra = new Array(this.MAX_X);
    this.dire=new Array(this.MAX_X);
    for(var i=0; i<this.MAX_X ; i++){
        this.arra[i] = new Array(this.MAX_Y);
        this.dire[i] = new Array(this.MAX_Y);
    }
    for(i=0; i<this.MAX_X ; i++)
        this.arra[i][0] = 0;
    for(i=1; i<this.MAX_Y ; i++)
        this.arra[0][i] = 0;


    this.now=0;
    this.x="";
    this.y="";
    this.init=function(x, y){
        this.now=0;
        this.x=x;
        this.y=y;
        this.printI= x.length;
        this.printJ= y.length;
    };

    this.ctx = document.getElementById('myCanvas').getContext('2d');
    this.animationSpeed=0.05;
    this.autoNext=true;
    this.printI=0;
    this.printJ=0;
    this.requestId=0;
    this.code=[
        "LCS(x, y)",
        "if  x[i] = y[j]",
        "    then L[i, j] = L[i-1, j-1]+1;",
        "else",
        "    L[i, j] = max(L[i, j-1], L[i-1, j]);",
        "",
        "PRINT-LCS(b, X, i, j)",
        "if  i=0 or j=0",
        "    then return",
        "if b[i, j]='↖'",
        "    then print  x[i]",
        "         PRINT-LCS(b, X, i-1, j-1)",
        "else if b[i, j]='↑'",
        "    then PRINT-LCS(b, X, i-1, j)",
        "else  PRINT-LCS(b, X, i, j-1)"
    ];
}

Animation.prototype.lcs=function(){
    for(var i=1; i<=this.x.length ; i++)
        for(var j=1; j<=this.y.length ; j++){
            if(this.x[i-1]== this.y[j-1]){
                this.arra[i][j] = this.arra[i-1][j-1]+1;
                this.dire[i][j] = 2;
            }
            else{
                if(this.arra[i][j-1]>this.arra[i-1][j]){
                    this.arra[i][j] = this.arra[i][j-1];
                    this.dire[i][j] = 0;
                }
                else{
                    this.arra[i][j] = this.arra[i-1][j];
                    this.dire[i][j] = 1;
                }
            }
        }
};

Animation.prototype.drawHead= function(){
    this.ctx.textAlign = "center";
    this.ctx.textBaseline="middle";
    this.ctx.fillStyle="black";

    this.ctx.fillText("i", this.cellSize*0.5, this.cellSize*1.5);
    for(var i=0; i<= this.x.length; i++){
        this.ctx.fillText(""+i, this.cellSize*0.5, this.cellSize*(i+2.5));
    }
    this.ctx.fillText("j", this.cellSize*1.5, this.cellSize*0.5);
    for(i=0; i<= this.y.length; i++){
        this.ctx.fillText(""+i, this.cellSize*(i+2.5), this.cellSize*0.5);
    }

    this.ctx.fillText("Xi", this.cellSize*1.5, this.cellSize*2.5);
    for(i=1; i<= this.x.length; i++){
        this.ctx.fillText(this.x[i-1], this.cellSize*1.5, this.cellSize*(i+2.5));
    }
    this.ctx.fillText("Yi", this.cellSize*2.5, this.cellSize*1.5);
    for(i=1; i<= this.y.length; i++){
        this.ctx.fillText(this.y[i-1], this.cellSize*(i+2.5), this.cellSize*1.5);
    }
};

Animation.prototype.drawCell=function(){
    this.ctx.strokeStyle="grey";
    this.ctx.lineWidth=1;
    //横
    this.ctx.beginPath();
    for(var i=0; i<=(this.x.length+1) ; i++){
        this.ctx.moveTo(this.cellSize*2, (2+i)*this.cellSize);
        this.ctx.lineTo((3+this.y.length)*this.cellSize, (2+i)*this.cellSize);
    }
    //竖
    for(i=0; i<=(this.y.length+1) ; i++){
        this.ctx.moveTo((2+i)*this.cellSize, this.cellSize*2);
        this.ctx.lineTo((2+i)*this.cellSize, (3+this.x.length)*this.cellSize);
    }
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.fillStyle="black";
    this.ctx.textAlign = "left";
    this.ctx.textBaseline="top";
    for(i=0; i<=this.y.length ; i++){
        this.ctx.fillText("0", this.cellSize*(i+2.5), this.cellSize*2.5);
    }
    for(i=1; i<=this.x.length ; i++){
        this.ctx.fillText("0", this.cellSize*2.5, this.cellSize*(i+2.5));
    }
};

Animation.prototype.draw=function(){
    this.ctx.clearRect(0, 0, 1200, 600);
    this.drawHead();
    this.drawCell();
    this.ctx.textAlign = "left";
    this.ctx.textBaseline="top";
    for(var i=0; i<this.now ; i++){
        var x=Math.floor(i/this.y.length)+1;
        var y=i%this.y.length+1;
        this.ctx.fillStyle="black";
        this.ctx.fillText(this.arra[x][y], this.cellSize*(y+2.5), this.cellSize*(x+2.5));
        this.arrow(x, y, this.dire[x][y]);
    }
};

Animation.prototype.arrow=function(x, y, direction){
    var startX;
    var startY;
    this.ctx.strokeStyle="#4CAF50";
    this.ctx.lineWidth=4;
    this.ctx.fillStyle="#4CAF50";
    if(direction==0){
        startX=this.cellSize*(y+2.5);
        startY=this.cellSize*(x+2.5)+8;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(startX-15, startY);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(startX-25, startY);
        this.ctx.lineTo(startX-15, startY-10);
        this.ctx.lineTo(startX-15, startY+10);
        this.ctx.lineTo(startX-25, startY);
        this.ctx.closePath();
        this.ctx.fill();
    }
    else if(direction==1){
        startX=this.cellSize*(y+2.5)+8;
        startY=this.cellSize*(x+2.5);
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(startX, startY-15);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY-25);
        this.ctx.lineTo(startX-10, startY-15);
        this.ctx.lineTo(startX+10, startY-15);
        this.ctx.lineTo(startX, startY-25);
        this.ctx.closePath();
        this.ctx.fill();
    }
    else{
        startX=this.cellSize*(y+2.5);
        startY=this.cellSize*(x+2.5);
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(startX-12, startY-12);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(startX-20, startY-20);
        this.ctx.lineTo(startX-18, startY-6);
        this.ctx.lineTo(startX-6, startY-18);
        this.ctx.lineTo(startX-20, startY-20);
        this.ctx.closePath();
        this.ctx.fill();
    }
};

Animation.prototype.highlight=function(xi, yi, progress){
    if(progress>1) progress=1;
    this.ctx.fillStyle="#4CAF50";
    //x
    this.ctx.beginPath();
    this.ctx.arc( this.cellSize*1.5, this.cellSize*(xi+2.5), 18-6*(Math.abs(0.5-progress)), 0, Math.PI*2);
    this.ctx.closePath();
    this.ctx.fill();
    //y
    this.ctx.beginPath();
    this.ctx.arc(this.cellSize*(yi+2.5), this.cellSize*1.5, 18-6*(Math.abs(0.5-progress)), 0, Math.PI*2);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.fillStyle="black";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline="middle";
    this.ctx.fillText(this.x[xi-1], 75,  this.cellSize*(xi+2.5));
    this.ctx.fillText(this.y[yi-1], this.cellSize*(yi+2.5), 75);
};

Animation.prototype.move=function(ix, iy, direction, progress){
    if(progress>2) progress=2;
    this.draw();
    this.highlight(iy, ix, progress);
    this.ctx.textAlign = "left";
    this.ctx.textBaseline="top";
    this.ctx.strokeStyle="#F44336";
    this.ctx.lineWidth=5;
    this.ctx.strokeRect(this.cellSize*(2+ix)+2.5, this.cellSize*(2+iy)+2.5,  this.cellSize-5, this.cellSize-5);
    if(progress<0.4){
        this.drawCode(1);
    }
    else{
        if(direction==2) this.drawCode(2);
        else this.drawCode(4);
    }
    if(progress>0.6){
        switch (direction){
            case 0:
            case 1:this.ctx.strokeRect(this.cellSize*(1+ix)+2.5, this.cellSize*(2+iy)+2.5, this.cellSize-5, this.cellSize-5);
                this.ctx.strokeRect(this.cellSize*(2+ix)+2.5, this.cellSize*(1+iy)+2.5, this.cellSize-5, this.cellSize-5);break;
            case 2:this.ctx.strokeRect(this.cellSize*(1+ix)+2.5, this.cellSize*(1+iy)+2.5, this.cellSize-5, this.cellSize-5);break;
        }
    }
    if(progress>1){
        this.ctx.fillStyle="black";
        switch (direction){
            case 0:this.ctx.fillText(this.arra[iy][ix], this.cellSize*(ix+0.5+progress),  this.cellSize*(iy+2.5));break;
            case 1:this.ctx.fillText(this.arra[iy][ix], this.cellSize*(ix+2.5),  this.cellSize*(iy+0.5+progress));break;
            case 2:this.ctx.fillText((this.arra[iy][ix]),  this.cellSize*(ix+0.5+progress), this.cellSize*(iy+0.5+progress));break;
        }
    }

    //judge what to do next
    if(progress<2){
        this.requestId=window.requestAnimationFrame(this.move.bind(this, ix, iy, direction, progress+this.animationSpeed));
    }
    else if(this.autoNext){
        this.now++;
        if(this.now<this.x.length*this.y.length){
            this.moveNow();
        }
        else {
            this.draw();
            this.printLCS(this.printI, this.printJ, 0);
        }
    }
    else{
        this.now++;
        this.draw();
        this.drawCode();
    }
};

Animation.prototype.moveNow=function(){
    var ix=Math.floor(this.now/this.y.length)+1;
    var iy=this.now%this.y.length+1;
    var direction=this.dire[ix][iy];
    this.move(iy, ix, direction, 0);
};

Animation.prototype.printLCS=function(i, j, progress){
    if(progress==0){
        this.ctx.fillStyle="grey";
        this.ctx.fillRect(this.cellSize*(j+2)+1, this.cellSize*(i+2)+1, this.cellSize-2, this.cellSize-2);
        this.ctx.fillStyle="black";
        this.ctx.textAlign = "left";
        this.ctx.textBaseline="top";
        this.ctx.fillText(this.arra[i][j], this.cellSize*(j+2.5), this.cellSize*(i+2.5));
        if(i!=0&&j!=0) this.arrow(i, j, this.dire[i][j]);
    }
    else if(progress<0.25){
        this.drawCode(7);
    }
    else if(progress<0.5){
        if(i==0||j==0){
            this.drawCode(8);
        }
        else this.drawCode(9);
    }
    else if(progress<0.75){
        if(i==0||j==0){
            this.drawCode(8);
        }
        else{
            switch (this.dire[i][j])
            {
                case 0:
                case 1:this.drawCode(12);break;
                case 2:this.drawCode(10);this.highlight(i, j, 0);break;
            }
        }
    }
    else if(progress<1){
        if(i==0||j==0){
            this.drawCode();
        }
        else{
            switch (this.dire[i][j])
            {
                case 0:this.drawCode(14);break;
                case 1:this.drawCode(13);break;
                case 2:this.drawCode(11);break;
            }
        }
    }
    else{
        if(i==0||j==0){
            this.printI--;
            this.printJ--;
            status_stop();return;
        }
        else if(this.dire[i][j]==2){
            this.printI=i-1;
            this.printJ=j-1;
        }
        else if(this.dire[i][j]==1){
            this.printI=i-1;
            this.printJ=j;
        }
        else{
            this.printI=i;
            this.printJ=j-1;
        }
        if(this.autoNext) this.printLCS(this.printI, this.printJ, 0);
        return;
    }

    this.requestId=window.requestAnimationFrame(this.printLCS.bind(this, i, j, progress+this.animationSpeed));
};

Animation.prototype.drawCode=function(line){
    this.ctx.clearRect(-300, 0, 300, 600);
    this.ctx.textAlign = "left";
    this.ctx.textBaseline="top";
    this.ctx.fillStyle="rgba(0,0,0,0.87)";
    for(var i=0; i<this.code.length ; i++){
        if(i!=line) this.ctx.fillText(this.code[i], -280, 30*i+30);
    }
    if(line!=null){
        this.ctx.fillStyle="red";
        this.ctx.fillText(this.code[line], -280, 30*line+30);
    }
};

Animation.prototype.cancelPrint=function(){
    var tempI;
    var tempJ;
    var i=this.x.length;
    var j=this.y.length;
    if(this.printI==-1||this.printJ==-1){
        this.printI++;
        this.printJ++;
    }
    else{
        do{
            tempI = i;
            tempJ = j;
            if(this.dire[i][j]==2){
                i=i-1;
                j=j-1;
            }
            else if(this.dire[i][j]==1){
                i=i-1;
            }
            else{
                j=j-1;
            }
        }
        while(i!=this.printI||j!=this.printJ);
        this.printI=tempI; this.printJ=tempJ;
    }

    this.ctx.clearRect(this.cellSize*(this.printJ+2)+1, this.cellSize*(this.printI+2)+1, this.cellSize-2, this.cellSize-2);
    this.ctx.fillStyle="black";
    this.ctx.textAlign = "left";
    this.ctx.textBaseline="top";
    this.ctx.fillText(this.arra[this.printI][this.printJ], this.cellSize*(this.printJ+2.5), this.cellSize*(this.printI+2.5));
    if(this.printI!=0&&this.printJ!=0) this.arrow(this.printI, this.printJ, this.dire[this.printI][this.printJ]);
    if(this.dire[this.printI][this.printJ]==2){
        this.ctx.fillStyle="black";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline="middle";
        this.ctx.clearRect(this.cellSize, this.cellSize*(this.printI+2), this.cellSize-2, this.cellSize-2);
        this.ctx.fillText(this.x[this.printI-1], this.cellSize*1.5, this.cellSize*(this.printI+2.5));
        this.ctx.clearRect(this.cellSize*(this.printJ+2), this.cellSize, this.cellSize-2, this.cellSize-2);
        this.ctx.fillText(this.y[this.printJ-1], this.cellSize*(this.printJ+2.5), this.cellSize*1.5);
    }
};

Animation.prototype.backStep=function(){
    if(this.now>0){
        if(this.now<this.x.length*this.y.length ||
            (this.printI==this.x.length&&this.printJ==this.y.length)){
            this.now--;
            this.draw();
        }
        else{
            this.cancelPrint();
        }
    }
};

Animation.prototype.rewind=function(){
    this.autoNext=false;
    this.backStep();
};

Animation.prototype.runStep=function(){
    if(this.now<this.x.length*this.y.length){
        this.moveNow();
    }
    else if(this.printI!=-1&&this.printJ!=-1)
        this.printLCS(this.printI, this.printJ, 0);
};

Animation.prototype.forward=function(){
    this.autoNext=false;
    this.runStep();
};

Animation.prototype.play=function(){
    this.autoNext=true;
    this.runStep();
};

Animation.prototype.restart=function(x, y){
    if(x.length>this.MAX_X-1|| y.length>this.MAX_Y-1){
        var str="字符串过长：x<"+this.MAX_X+", y<"+this.MAX_Y+"\n";
        str+="当前长度：x:"+ x.length+", y:"+ y.length;
        alert(str);
    }
    else{
        this.pause();
        this.init(x, y);
        this.lcs();
        this.autoNext=true;
        this.runStep();
        return true;
    }
};

Animation.prototype.refresh=function(){
    this.pause();
    this.now=0;
    this.printI=this.x.length;
    this.printJ=this.y.length;
    this.play();
};

Animation.prototype.pause=function(){
    window.cancelAnimationFrame(this.requestId);
};

Animation.prototype.changeSpeed=function(value){
    var animationSpeeds=[0.008, 0.02, 0.04, 0.08, 0.25];
    this.animationSpeed=animationSpeeds[value];
};


