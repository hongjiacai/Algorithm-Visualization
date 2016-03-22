/**
 * 
 */
var t=new SortAlgorithm();
var s=t.step;
var sortAlgor=-1;
var speed=-1;

function graph(){
	this.arr=new Array();
	this.h1=-1;
	this.h2=-1;
	
	this.draw=function (){
		var c=document.getElementById("myCanvas");
		var cxt=c.getContext("2d");
		cxt.fillStyle = "#BBDEFB";
	    cxt.fillRect(0, 0, 900, 500);
	    var unitheight = 500/t.size;
	    var unitwidth = 900/t.size;
		for(var i=0;i<t.size;i++){
			if(i==this.h1||i==this.h2){
				cxt.fillStyle="#FFD600";
			}
			else{
				cxt.fillStyle="#03A9F4";
			}
			cxt.fillRect(i*unitwidth,500-this.arr[i]*unitheight,(unitwidth-2),this.arr[i]*unitheight);
		}
		
	};
	
}

function sortstep(){
	this.grap=new graph();
	this.steps=new Array();
	this.count=0;
	this.now=0;
	
	this.addstep=function (type, i, j){
		this.steps[this.count++]=type;
		this.steps[this.count++]=i;
		this.steps[this.count++]=j;
	};

}

sortstep.swap = function (arr,i,j){
	var temp=arr[i];
	arr[i]=arr[j];
	arr[j]=temp;
}

function SortAlgorithm(){
	this.arra = new Array();
    this.step= new sortstep();
	this.size =-1;
    
	this.swap=function (i , j){
		sortstep.swap(this.arra, i, j);
		this.step.addstep(1, i, j);
	}
	
	this.compare=function (i, j){
		this.step.addstep(2, i, j);
		if(this.arra[i] < this.arra[j]) return true;
		else return false;
	}
	
}

//插入排序
SortAlgorithm.prototype.inssort=function (){
	for(var i=1; i < this.size; i++)
		for(var j = i; j>0 && this.compare(j, j-1);j--){
			this.swap(j, j-1);
		}
}

//冒泡排序
SortAlgorithm.prototype.bubsort=function (){
	for(var i=0; i<this.size-1 ; i++)
		for(var j=this.size-1; j>i ; j--)
			if(this.compare(j, j-1)){
				this.swap(j, j-1);
			}	
}

//选择排序
SortAlgorithm.prototype.selsort = function (){
	for(var i = 0; i < this.size-1; i++) {
        var min = i;
        for(var j = this.size-1; j>i; j--) {
            if(this.compare(j, min)) {
                min = j;
            }
        }
        this.swap(i, min);
    }
}

//shell排序
SortAlgorithm.prototype.shellsort = function (){
   for(var gap=Math.floor(this.size/2); gap>0;gap=Math.floor(gap/2))
        for(var i = gap; i < this.size; i++) 
            for(var j = i; j>=0 &&this.compare(j,j-gap); j -= gap) 
                	this.swap(j,j-gap);
}

//归并排序
SortAlgorithm.prototype.insert = function (from, to){
	while(from != to) {
        if(from < to) {
            this.swap( from + 1);
            from += 1;
        } else {
            this.swap(from, from - 1);
            from -= 1;
        }
    }
}
SortAlgorithm.prototype.mergesort = function (left, right){
	 if(right <= left) {
	        return;
	    }
	    var middle = (left + right) / 2 | 0;
	    this.mergesort(left, middle);
	    this.mergesort(middle + 1, right);

	    var l = left;
	    var m = middle + 1;
	    while(l < m && m <= right) {
	        if(this.compare(m,l)) {
	            this.insert(m, l);
	            m++;
	        }
	        l++;
	    }    
}

//快速排序
SortAlgorithm.prototype.qsort=function (i , j){
	if(j<=i) return;
	var pivotindex=Math.floor((i+j)/2);
	this.swap(pivotindex,j);
	var k = this.partition(i-1 , j , j);
	this.swap(k , j);
	this.qsort(i , k-1);
	this.qsort(k+1 , j);
}
SortAlgorithm.prototype.partition=function (l , r , privot){
	do{
		while(this.compare(++l, privot));
		while(( l < r) && this.compare(privot, --r) );
		this.swap( l , r);
	}while(l < r)
		return l;
}

//堆排序
SortAlgorithm.prototype.shiftdown = function (n, pos){
	while( pos<Math.floor(n/2) ){
		var j = 2*pos + 1;
		var rc = 2*pos + 2;
		if( (rc<n) && this.compare(j, rc))
			j = rc;
		if(this.compare(j, pos)) return;
		this.swap(pos, j);
		pos = j;
	}
}
SortAlgorithm.prototype.heapsort = function (){
	var n = this.size;
	for(var i=Math.floor(n/2)-1; i>=0 ; i--)  //buildHeap
		this.shiftdown(n, i);
	for(var i=0; i<this.size ;i++){   //removeFirst
		this.swap(0, --n);
		if(n != 0) this.shiftdown(n, 0);
	}
}


function load(){
	setUI();
	changeSize(3);
	speed=100;
	changeAlgorithm(0);
	
}

function init(){
	for(var i=0;i<t.size;i++){
		t.arra[i]=i+1;
	}
	for(var i=0;i<t.size;i++){
		var rnd = Math.floor(Math.random() * (i + 1) );
        sortstep.swap(t.arra, i, rnd);
	}
	for(var i=0;i<t.size;i++){
	     t.step.grap.arr[i]=t.arra[i];
	}
	t.step.grap.draw();
	t.step.count=0;
	t.step.now=0;
}

function runstep(){
		if(s.now<s.count){
			var type = s.steps[s.now++];
			var i = s.steps[s.now++];
			var j = s.steps[s.now++];
			if(type==1){
				sortstep.swap(s.grap.arr, i, j);
			}
			s.grap.h1 = i;
			s.grap.h2 = j;
			s.grap.draw();
			setTimeout(runstep,speed);
		}
		else{
			s.grap.h1 = -1;
			s.grap.h2 = -1;
			s.grap.draw();
		}
}

function changeAlgorithm(val){
	if(sortAlgor!=val){
		sortAlgor=val;
		restart();
		for(var i=0;i<8;i++){
			if(val==i){
				document.getElementById(i).style.background="#00BFA5";
			}
			else {
				document.getElementById(i).style.background="#2196f3";
			}
	}
	
	}
}

function changeSpeed(){
	var speeds=new Array(2000,1200,800,400,200,100,50,25,10, 4);
	speed=speeds[parseInt(document.getElementById("ran").value)-1];
}

function changeSize(si){
	var sizes = new Array(5,10,50,100,150);
	if(sizes[si]!=t.size){
		t.size=sizes[si];
		restart();
		for(var i=0;i<5;i++){
			if(si==i){
				document.getElementById("1"+i).style.background="#00BFA5";
			}
			else {
				document.getElementById("1"+i).style.background="#dfdfdf";
			}
	}
	}
}

function restart(){
	init();
	switch (sortAlgor)
	{
	case 0:t.inssort();break;
	case 1:t.bubsort();break;
	case 2:t.selsort();break;
	case 3:t.shellsort();break;
	case 4:t.mergesort(0, t.size-1);break;
	case 5:t.qsort(0,t.size-1);break;
	case 6:t.heapsort();break;
	case 7:t.radix();break;
	}
	setTimeout(runstep,1000);
}

function setUI(){
	var w=screen.availWidth;
	if(w<=900)
		document.getElementById("canvas").style.left="10px";
	else if(w>1200)
		document.getElementById("canvas").style.left="300px";
	else
		document.getElementById("canvas").style.left=""+(w-900)/2+"px";
}

function close(){
	document.getElementById("rel").style.visibility="hidden";
}
