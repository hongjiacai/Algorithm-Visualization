var SWAP = 1001;
var HIGHLIGHT = 1002;
var DIVIDE_TO_A1 = 1003;
var DIVIDE_TO_A2 = 1004;
var DIVIDE_TO_A3 = 1005;
var ASSIGN_NEW_VALUE = 1006;
var NEW_SELECT = 1007;
var FINAL_ANSWER = 1008;
var END_ASSIGN_NEW_VALUE=1009;
var SORT = 1022;
var DIVIDE_AND_SORT = 1023;
var MEDIAN_OF_MEDIAN = 1024;
var DIVIDE_INTO_3 = 1025;
var RETURN_1 = 1027;
var RETURN_mm = 1029;
var RETURN_3 = 1028;
var DRAW_ARROW = 1010;
var speeds=[2500, 1600, 1000, 300, 120];

function Animation(){
    this.arra = new Array(100);
    this.myStep = new Step();
    this.myAnimation = new KthAnimation();
    this.canvasNeedHeight=0;
    this.canvasWidth=parseInt(document.getElementById("myCanvas").getAttribute("width"))-300;
    this.marginWidth=this.canvasWidth;

    this.init=function(size){
        for(var i=0; i<size ; i++){
            this.arra[i]=Math.floor(Math.random() * 200 );
        }
        this.myStep.init();
        this.myAnimation.init();
        this.canvasNeedHeight=300;
        this.marginWidth=this.canvasWidth;
    };

    this.int=null;
    this.speedValue=3;
}

Animation.prototype.swap=function(A, i){
    swap(A, i, i-1);
    this.myStep.addStep(SWAP, i-1);
};

Animation.prototype.sort=function (A, low, high){
    for(var i=low+1; i <= high; i++)
        for(var j = i; j>low && A[j]<A[j-1];j--){
            this.swap(A, j);   //swap j,j-1
        }
};

Animation.prototype.select=function(A, low, high, k){
    var result=0;
    var p=high-low+1;
    this.updateCanvasHeight((Math.floor(p/5)+(p%5==0?0:1))*60);
    this.myStep.addStep(NEW_SELECT, p);
    for(var i=0; i<p ; i++){
        this.myStep.addStep(ASSIGN_NEW_VALUE, i, A[i]);
    }
    this.myStep.addStep(END_ASSIGN_NEW_VALUE,0);

    if(p<threshold){
        this.myStep.addStep(SORT, 0);
        this.sort(A, low, high);
        return A[k-1];
    }

    this.myStep.addStep(DIVIDE_AND_SORT,0);
    var q = Math.floor(p/5);
    var M = new Array(q);
    for( i=0; i<q ; i++){
        this.sort(A, i*5, i*5+4);
        M[i] = A[i*5+2];
    }

    this.myStep.addStep(MEDIAN_OF_MEDIAN,0);
    var middle= ( q % 2===0)?q/2:Math.floor(q/2)+1;
    var mm = select(M, 0, q-1, middle);
    for(i=0; i<q ; i++){
        if(A[i*5+2]==mm){
            this.myStep.addStep(HIGHLIGHT, i*5+2);break;
        }
    }

    this.myStep.addStep(DIVIDE_INTO_3, 0);
    var A1 = new Array(p);
    var A2 = new Array(p);
    var A3 = new Array(p);
    var count1 = 0, count2 = 0, count3 = 0;
    for (i = low; i <= high; i++) {
        if (A[i] < mm) {
            A1[count1++] = A[i];
            this.myStep.addStep(DIVIDE_TO_A1, i);
        } else if (A[i] > mm) {
            A3[count3++] = A[i];
            this.myStep.addStep(DIVIDE_TO_A3, i);
        } else {
            A2[count2++] = A[i];
            this.myStep.addStep(DIVIDE_TO_A2, i);
        }
    }

    if (count1 >= k) {
        this.myStep.addStep(DRAW_ARROW, 0);
        this.updateCanvasHeight(100);
        this.myStep.addStep(RETURN_1, 0);
        result = this.select(A1, 0, count1-1, k);
    } else if (count1+count2 >= k) {
        this.myStep.addStep(RETURN_mm, 0);
        result = mm;
    } else if (count1+count2 < k) {
        this.myStep.addStep(DRAW_ARROW, 0);
        this.updateCanvasHeight(100);
        this.myStep.addStep(RETURN_3, 0);
        result = this.select(A3, 0, count3-1, k-count1-count2);
    }
    return result;
};

Animation.prototype.updateCanvasHeight=function(needWidth){
    if(needWidth>this.marginWidth){
        this.canvasNeedHeight+=400;
        this.marginWidth=this.canvasWidth-needWidth;
    }
    else{
        this.marginWidth-=needWidth;
    }
};

Animation.prototype.changeCanvasHeight=function(newHeight){
    document.getElementById("myCanvas").setAttribute("height", newHeight);
    this.myAnimation.initCtx();
};

Animation.prototype.generate=function(size, k){
    this.myStep.addStep(FINAL_ANSWER, this.select(this.arra , 0, size-1, k));
};

Animation.prototype.runStep=function(){
    if(this.myStep.now<this.myStep.count){
        var type = this.myStep.steps[this.myStep.now++];
        var target = this.myStep.steps[this.myStep.now++];
        switch (type)
        {
            case SWAP: this.myAnimation.swap(target);break;
            case HIGHLIGHT: this.myAnimation.highlight(target);break;
            case DIVIDE_TO_A1: this.myAnimation.divideToA1(target );break;
            case DIVIDE_TO_A2: this.myAnimation.divideToA2(target );break;
            case DIVIDE_TO_A3: this.myAnimation.divideToA3(target);break;
            case ASSIGN_NEW_VALUE: this.myAnimation.assignNewValue(target, this.myStep.steps[this.myStep.now++]);break;
            case NEW_SELECT: this.myAnimation.newSelect(target);
                if(document.getElementById("play").innerHTML=="pause") this.speedUp();
                else this.myAnimation.animationSpeed=Math.floor(this.myAnimation.animationSpeed/5);break;
            case FINAL_ANSWER: this.myAnimation.finalAnswer(target);break;
            case END_ASSIGN_NEW_VALUE:
                if(document.getElementById("play").innerHTML=="pause") this.speedDown();
                 else this.myAnimation.animationSpeed=speeds[this.speedValue];break;
            case SORT: this.myAnimation.drawText(1);break;
            case DIVIDE_AND_SORT: this.myAnimation.drawText(2);break;
            case MEDIAN_OF_MEDIAN: this.myAnimation.drawText(3);break;
            case DIVIDE_INTO_3: this.myAnimation.drawText(4);break;
            case RETURN_1: this.myAnimation.drawText(6);break;
            case RETURN_mm: this.myAnimation.drawText(7);break;
            case RETURN_3: this.myAnimation.drawText(8);break;
            case DRAW_ARROW: this.myAnimation.arrow();break;
        }
    }
    else{
        window.clearInterval(this.int);
        status_stop();
    }
};

Animation.prototype.run=function(){
    window.clearInterval(this.int);
    this.int=setInterval(this.runStep.bind(this), this.myAnimation.animationSpeed);
};

Animation.prototype.restart=function(size, k){
    window.clearInterval(this.int);
    this.myAnimation.cancelAnimationFrame();
    this.init(size);
    this.generate(size, k);
    if(this.canvasNeedHeight<700) this.canvasNeedHeight=700;
    var height=parseInt(document.getElementById("myCanvas").getAttribute("height"));
    if(height!= this.canvasNeedHeight)
        this.changeCanvasHeight(this.canvasNeedHeight);
    this.myAnimation.clear();
    this.myAnimation.animationSpeed=speeds[this.speedValue];
    this.run();
};

Animation.prototype.refresh=function(){
    window.clearInterval(this.int);
    this.myAnimation.cancelAnimationFrame();
    this.myStep.now=0;
    this.myAnimation.init();
    this.myAnimation.animationSpeed=speeds[this.speedValue];
    setTimeout(this.run.bind(this), this.myAnimation.animationSpeed);
};

Animation.prototype.rewind=function(){
    if(this.myStep.now>0){
        var target = this.myStep.steps[--this.myStep.now];
        var type = this.myStep.steps[--this.myStep.now];
        if(type<1000){
            target=type;
            type=this.myStep.steps[--this.myStep.now];
        }
        switch (type)
        {
            case SWAP: this.myAnimation.swap(target);break;
            case HIGHLIGHT: this.myAnimation.normal(target);break;
            case DIVIDE_TO_A1: this.myAnimation.normal(target );this.myAnimation.reduceCount(1);break;
            case DIVIDE_TO_A2: this.myAnimation.normal(target );this.myAnimation.reduceCount(2);break;
            case DIVIDE_TO_A3: this.myAnimation.normal(target);this.myAnimation.reduceCount(3);break;
            case ASSIGN_NEW_VALUE: this.myAnimation.disappear(target, new Date().getTime(), this.myAnimation.animationSpeed);break;
            case NEW_SELECT: this.myAnimation.animationSpeed=speeds[this.speedValue];this.myStep.now+=2;break;
            case FINAL_ANSWER: this.myAnimation.normal(target);break;
            case END_ASSIGN_NEW_VALUE:this.myAnimation.animationSpeed=Math.floor(this.myAnimation.animationSpeed/5);break;
            case SORT: this.myAnimation.drawText();break;
            case DIVIDE_AND_SORT: this.myAnimation.drawText();break;
            case MEDIAN_OF_MEDIAN: this.myAnimation.drawText();break;
            case DIVIDE_INTO_3: this.myAnimation.drawText();break;
            case RETURN_1: this.myAnimation.drawText();break;
            case RETURN_mm: this.myAnimation.drawText();break;
            case RETURN_3: this.myAnimation.drawText();break;
            case DRAW_ARROW: this.myStep.now+=2;break;
        }
    }
};

Animation.prototype.play=function(){
    if(document.getElementById("play").innerHTML=="pause"){
        window.clearInterval(this.int);
    }
    else{
        this.run();
    }
};

Animation.prototype.pause=function(){
    window.clearInterval(this.int);
};

Animation.prototype.changeSpeed=function(value){
    window.clearInterval(this.int);
    this.myAnimation.animationSpeed=speeds[value];
    this.speedValue=value;
    if(document.getElementById("play").innerHTML=="pause") this.run();
};

Animation.prototype.forward=function(){
    this.runStep();
};


Animation.prototype.speedUp=function(){
    this.myAnimation.animationSpeed=Math.floor(this.myAnimation.animationSpeed/5);
    this.run();
};
Animation.prototype.speedDown=function(){
    this.myAnimation.animationSpeed=this.myAnimation.animationSpeed*5;
    this.run();
};

