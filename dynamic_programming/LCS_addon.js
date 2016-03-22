
function restart(){
    var x=document.getElementById("x").value;
    var y=document.getElementById("y").value;
    if(myAnimation.restart(x, y))
        status_run();
}


function load(){
    myAnimation.ctx.translate(300,0);
    myAnimation.ctx.font = "18px Arial";
    var x = document.getElementById("x").value;
    var y = document.getElementById("y").value;
    myAnimation.init(x, y);
    myAnimation.lcs();
    myAnimation.drawCode();
}