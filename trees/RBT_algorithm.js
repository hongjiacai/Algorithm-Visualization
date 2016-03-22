var RED = true;
var BLACK = false;
function RedBlack(){

}

RedBlack.prototype.rotateRight=function(h){
    var x = h.rightTree;
    h.rightTree = x.leftTree;
    x.leftTree = h;
    x.color = x.leftTree.color;
    x.leftTree.color = RED;
    return x;
};

RedBlack.prototype.rotateLeft=function(h){
    var x = h.leftTree;
    h.leftTree = x.rightTree;
    x.rightTree = h;
    x.color = x.rightTree.color;
    x.rightTree.color = RED;
    return x;
};

function isRed(h){
    if(h==null) return false;
    return (h.color==RED);
}
function colorFlip(h){
    h.color = !h.color;
    h.leftTree.color = !h.leftTree.color;
    h.rightTree.color = !h.rightTree.color;
    return h;
}
function compare(i, j){
    return j-i;
}

RedBlack.prototype.insert=function(h, key, value){
    if(h==null)
        return new RedBlackNode(key, value, RED);
    if(isRed(h.leftTree)&& isRed(h.rightTree))
        colorFlip(h);
    var cmp= compare(key, h.key);
    if(cmp==0) h.value=value;
    else if(cmp<0)
        h.leftTree = this.insert(h.leftTree, key, value);
    else h.rightTree = this.insert(h.rightTree, key, value);
    if(isRed(h.rightTree))
        h = this.rotateLeft(h);
    if(isRed(h.leftTree)&&isRed(h.leftTree.leftTree))
        h = this.rotateRight(h);
    return h;
};

function RedBlackNode()
{
    this.key = 0;
    this.value = "";
    this.color = true;
    this.leftTree=null;
    this.rightTree=null;
}
