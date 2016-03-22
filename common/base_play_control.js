var myAnimation = new Animation();

function refresh(){
    myAnimation.refresh();
    status_run();
}

function play(){
    if(document.getElementById("play").innerHTML=="play_arrow"){
        myAnimation.play();
        status_run();
    }
    else{
        myAnimation.pause();
        status_stop();
    }
}

function rewind(){
    myAnimation.rewind();
}

function forward(){
    myAnimation.forward();
}

function changeSpeed(){
    myAnimation.changeSpeed(parseInt(document.getElementById("speed").value));
}

function status_run(){
    document.getElementById("btn_forward").disabled=true;
    document.getElementById("btn_rewind").disabled=true;
    document.getElementById("play").innerHTML="pause";
}

function status_stop(){
    document.getElementById("play").innerHTML="play_arrow";
    document.getElementById("btn_forward").disabled=false;
    document.getElementById("btn_rewind").disabled=false;
}
