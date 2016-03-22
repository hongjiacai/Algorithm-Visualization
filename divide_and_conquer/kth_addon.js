
function restart(){
    var size =parseInt(document.getElementById("size").value);
    var k = parseInt(document.getElementById("k").value);
    if(!(isNaN(size)||isNaN(k)||size>maxSize||size<1)){
        myAnimation.restart(size, k);
        status_run();
    }
    else alert("ÊýÖµ³¬³ö·¶Î§");
}


function load(){
    myAnimation.myAnimation.initCtx();
    myAnimation.myAnimation.drawText();
}