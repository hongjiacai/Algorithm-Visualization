/*
n    1    2    3    4    5    6    7    8
u    1    0    0    1    2    1    6    12
d    1    0    0    2    10  4    40  92
 */


function Animation(){
    this.canvasWidth=parseInt(document.getElementById('myCanvas').width);
    this.canvasHeight=parseInt(document.getElementById('myCanvas').height);

    this.ctx = document.getElementById('myCanvas').getContext('2d');
    this.ctx.textBaseline="middle";
    this.ctx.font = "16px Arial";
    this.ctx.lineWidth=1;

    this.n=0;
    this.k=0;
    this.c=new Array(8);
    this.solutionPattern=null;// true=graph   false=text;

    this.textOrGraph=function(n, all){
        var u=[1, 0, 0, 1, 2, 1, 6, 12];
        var d=[1, 0, 0, 2, 10, 4, 40, 92];
        var allSolution;
        if(all) allSolution=d[n-1];
        else allSolution=u[n-1];

        var width=this.canvasWidth-(n*30+100)*2;
        var height=(n*50+200);
        var x=Math.floor(width/(n*30+100));
        var y=Math.floor(height/(n*30+100));
        if((y+1)*(n*30+100)<this.canvasHeight) y+=1;
        var capacity=x*y;
        x+=2;
        y=Math.floor( ( this.canvasHeight-y*(n*30+100) ) / (n*30+100));
        capacity+=x*y;
        return capacity>=allSolution;
    };

    this.init=function(n, all){
        this.solutionPattern=this.textOrGraph(n, all);

        this.n=n;
        for(var i=0; i<this.n ; i++){
            this.c[i]=0;
        }
        this.k=0;
        this.solutionCount=0;
        this.all=all;
        this.autoNext=true;
    };

    this.animationSpeed=100;

    this.solutionCount=0;
    this.solutionSet=new Array(12);
    for(var i=0 ; i<12 ; i++){
        this.solutionSet[i]=new Array(8);
    }

    this.all=true;
    this.int=null;
    this.autoNext=true;
}

Animation.prototype.drawCell=function(x, y, n, cellSize){
    this.ctx.fillStyle="#ede0c8";
    for(var i=0; i< n ; i++){
        for(var j=(i%2); j<n ; ){
            this.ctx.fillRect(x+j*cellSize, y+i*cellSize, cellSize, cellSize);
            j+=2;
        }
    }
    this.ctx.fillStyle="#f2b179";
    for(i=0; i<n ; i++){
        for(j=(1-(i%2)); j<n ; ){
            this.ctx.fillRect(x+j*cellSize, y+i*cellSize, cellSize, cellSize);
            j+=2;
        }
    }
};

Animation.prototype.drawQueen=function(x, y, i, j, cellSize){
    this.ctx.beginPath();
    this.ctx.arc(x+(j+0.5)*cellSize, y+(i+0.5)*cellSize, 0.2*cellSize, 0, Math.PI*2);
    this.ctx.closePath();
    this.ctx.strokeStyle="black";
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.arc(x+(j+0.5)*cellSize, y+(i+0.5)*cellSize, 0.12*cellSize, 0, Math.PI*2);
    this.ctx.closePath();
    this.ctx.fillStyle="#444444";
    this.ctx.fill();
};

Animation.prototype.drawBase=function(){
    this.drawCell(100, 100, this.n, 50);
    for(var i=0; i<=this.k ; i++){
        this.drawQueen(100, 100, i, this.c[i]-1, 50);
    }
};

Animation.prototype.getSolutionOrigin=function(){
    var originX;
    var originY;
    if(this.solutionPattern){    //  true=graph   false=text;
        var width=this.canvasWidth-(this.n*30+100)*2;
        var height=(this.n*50+200);
        var x=Math.floor(width/(this.n*30+100));
        var y=Math.floor(height/(this.n*30+100));
        if((y+1)*(this.n*30+100)<this.canvasHeight) y+=1;
        var capacity=x*y;
        if(capacity>this.solutionCount){
            originX=(this.solutionCount%x)*(this.n*30+100)+50+(this.n*30+100)*2;
            originY=( Math.floor(this.solutionCount/x) )*(this.n*30+100)+50;
        }
        else{
            x+=2;
            originX=( (this.solutionCount-capacity)%x)*(this.n*30+100)+50;
            originY=( Math.floor( (this.solutionCount-capacity)/x ) )*(this.n*30+100)+50+y*(this.n*30+100);
        }
    }
    else{
        width=this.canvasWidth-(this.n*30+100)*2;
        height=(this.n*50+200);
        x=Math.floor(width/(this.n*30+100));
        y=Math.floor(height/30);
        if( (y+30)<this.canvasHeight) y+=1;
        capacity=x*y;
        if(capacity>this.solutionCount){
            originX=(this.solutionCount%x)*(this.n*30+100)+50+(this.n*30+100)*2;
            originY=( Math.floor(this.solutionCount/x) )*30+50;
        }
        else{
            x+=2;
            originX=( (this.solutionCount-capacity)%x)*(this.n*30+100)+50;
            originY=( Math.floor( (this.solutionCount-capacity)/x ) )*30+y*30+50;
        }
    }
    return {x:originX, y:originY};
};

Animation.prototype.drawSolution=function(){
    this.drawCell(100, 100, this.n, 50);
    this.ctx.strokeStyle="red";
    this.ctx.fillStyle="red";
    for(var i=0; i<=this.k ; i++){
        this.ctx.beginPath();
        this.ctx.arc(100+(this.c[i]-1+0.5)*50, 100+(i+0.5)*50, 0.2*50, 0, Math.PI*2);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(100+(this.c[i]-1+0.5)*50, 100+(i+0.5)*50, 0.12*50, 0, Math.PI*2);
        this.ctx.closePath();
        this.ctx.fill();
    }
    this.ctx.fillStyle="black";
    this.ctx.strokeStyle="black";


    var origin=this.getSolutionOrigin();
    if(this.solutionPattern){    //  true=graph   false=text;
        this.drawCell(origin.x, origin.y, this.n, 30);
        for( i=0; i<this.n ; i++){
            this.drawQueen(origin.x, origin.y, i, this.c[i]-1, 30);
        }
        this.ctx.textAlign="center";
        this.ctx.fillText("solution "+(this.solutionCount+1), origin.x+this.n*15, origin.y+this.n*30+15);
    }
    else{
        this.ctx.textAlign='left';
        this.ctx.fillText( (this.solutionCount+1)+":", origin.x-30, origin.y);
        for(i=0; i<this.n ; i++){
            this.ctx.fillText(this.c[i], origin.x+30*i, origin.y);
        }
    }
    this.solutionCount++;
};

Animation.prototype.clearSolution=function(){
    this.solutionCount--;
    var origin=this.getSolutionOrigin();
    if(this.solutionPattern) {    //  true=graph   false=text;
        this.ctx.clearRect(origin.x, origin.y, this.n*30+100, this.n*30+100+30);
    }
    else{
        this.ctx.clearRect(origin.x-30, origin.y-15, this.n*30+100+30, 30);
    }
};


Animation.prototype.next=function(){
    if(this.k<0){
        this.drawBase();
        status_stop();
        return;
    }
    if(this.c[this.k]<this.n){
        this.c[this.k]++;
        this.drawBase();
        this.int=setTimeout(this.conflict.bind(this), this.animationSpeed);
    }
    else{
        this.c[this.k]=0;
        this.k--;
        this.drawBase();
        if(this.autoNext){
            this.int=setTimeout(this.next.bind(this), this.animationSpeed);
        }
    }
};
Animation.prototype.conflict=function(){
    if(this.noConflicts()){
        if(this.k==this.n-1){
            if(this.all){
                this.drawSolution();
            }
            else if(this.fundamental()) {
                for (var i = 0; i < this.n; i++)
                    this.solutionSet[this.solutionCount][i] = this.c[i];
                this.drawSolution();
            }
        }
        else this.k++;
    }
    if(this.autoNext){
        this.int=setTimeout(this.next.bind(this), this.animationSpeed);
    }
};

Animation.prototype.gotoEnd=function(){
    while(this.k>=0){
        while(this.c[this.k]<this.n){
            this.c[this.k]++;
            if(this.noConflicts()){
                if(this.k==this.n-1){
                    if(this.all){
                        this.drawSolution();
                    }
                    else if(this.fundamental()) {
                        for (var i = 0; i < this.n; i++)
                            this.solutionSet[this.solutionCount][i] = this.c[i];
                        this.drawSolution();
                    }
                }
                else{
                    this.k++;
                }
            }
        }
        this.c[this.k]=0;
        this.k--;
    }
    this.drawBase();
    status_stop();
};

Animation.prototype.back=function(){
    if(this.k==this.n-1&&this.noConflicts()){
        if(this.all){
            this.clearSolution();
        }
        else if(this.fundamental()) {
            for (var i = 0; i < this.n; i++)
                this.solutionSet[this.solutionCount-1][i] = 0;
            this.clearSolution();
        }
    }

    if(this.k>=0){
        if(this.c[this.k]>1) {
            this.c[this.k]--;
            this.drawBase();
            if(this.noConflicts() && this.k != this.n - 1) {
                this.k++;
                this.c[this.k]=this.n+1;
            }
        }
        else{
            this.c[this.k]=0;
            this.k--;
            this.drawBase();
        }
    }
};


Animation.prototype.noConflicts=function(){
    for(var i=0; i<this.k ; i++){
        if(this.c[this.k]==this.c[i]) return false;
        if( (this.c[this.k]-this.c[i])==(this.k-i)||(this.c[this.k]-this.c[i])==(i-this.k) ) return false;
    }
    return true;
};

Animation.prototype.fundamental=function(){
    for(var i=0; i<this.solutionCount ; i++){
        //上下对称
        for(var j=0; j<this.n ; j++){
            if(this.c[j]!=this.solutionSet[i][this.n-j-1]) break;
        }
        if(j==this.n) return false;

        //左右对称
        for(j=0; j<this.n ; j++){
            if(this.c[j]+this.solutionSet[i][j]!=this.n+1) break;
        }
        if(j==this.n) return false;

        //90度
        for(j=0; j<this.n ; j++){
            if(this.c[this.solutionSet[i][j]-1]!=this.n-j) break;
        }
        if(j==this.n) return false;

        //180度
        for(j=0; j<this.n ; j++){
            if(this.c[j]+this.solutionSet[i][this.n-j-1]!=this.n+1) break;
        }
        if(j==this.n) return false;

        //270度
        for(j=0; j<this.n ; j++){
            if(this.c[this.n-this.solutionSet[i][j]]!=j+1) break;
        }
        if(j==this.n) return false;

        //对角线对称（左上右下）
        for(j=0; j<this.n ; j++){
            if(this.c[this.n-this.solutionSet[i][j]]!=this.n-j) break;
        }
        if(j==this.n) return false;

        //对角线对称（右上左下）
        for(j=0; j<this.n ; j++){
            if(this.c[this.solutionSet[i][j]-1]!=j+1) break;
        }
        if(j==this.n) return false;
    }
    return true;
};

Animation.prototype.start=function(n, all){
    window.clearTimeout(this.int);
    this.init(n, all);
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.next();
};

Animation.prototype.skip=function(){
    window.clearTimeout(this.int);
    this.gotoEnd();
};

Animation.prototype.refresh=function(){
    window.clearTimeout(this.int);
    this.init(this.n, this.all);
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.next();
};

Animation.prototype.play=function(){
    this.autoNext=true;
    this.next();
};

Animation.prototype.pause=function(){
    window.clearTimeout(this.int);
};

Animation.prototype.rewind=function(){
    this.autoNext=false;
    this.back();
};
Animation.prototype.forward=function(){
    this.autoNext=false;
    if(this.k==-1) this.k++;
    this.next();
};

Animation.prototype.changeSpeed=function(i){
    window.clearTimeout(this.int);
    var speeds=[500, 100, 50, 20, 5];
    this.animationSpeed=speeds[i];
    if(document.getElementById("play").innerHTML=="pause") this.next();
};

function start(){
    var n=parseInt(document.getElementById('n').value);
    if(n>0&&n<9){
        var all= document.getElementById('all').checked?true:false;
        myAnimation.start(n, all);
        status_run();
    }
    else {
        alert("N超出范围");
    }

}

function skip(){
    myAnimation.skip();
}