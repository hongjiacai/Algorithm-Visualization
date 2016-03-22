var threshold=6;
function swap(A, i, j){
    var temp=A[i];
	A[i]=A[j];
	A[j]=temp;
}
function sort(A, low, high){
  for(var i=low+1; i <= high; i++)
		for(var j = i; j>low && A[j]<A[j-1];j--){
			swap(A, j, j-1);
		}
}
function select(A, low, high, k){
    var result=0;
    var p=high-low+1;
    if(p<threshold){
        sort(A, low, high);
        return A[k-1];
    }

    var q = Math.floor(p/5);
    var M = new Array(q);
    for(var i=0; i<q ; i++){
        sort(A, i*5, i*5+4);
        M[i] = A[i*5+2];
    }

    var mm = select(M, 0, q-1, Math.floor(q/2)+1);

    var A1 = new Array(p);
    var A2 = new Array(p);
    var A3 = new Array(p);
    var count1 = 0, count2 = 0, count3 = 0;
    for ( i = low; i <= high; i++) {
        if (A[i] < mm) {
            A1[count1++] = A[i];
        }
        else if (A[i] > mm) {
            A3[count3++] = A[i];
        }
        else {
            A2[count2++] = A[i];
        }
    }
    if (count1 >= k) {
        result = select(A1, 0, count1-1, k);
    } else if (count1+count2 >= k) {
        result = mm;
    } else if (count1+count2 < k) {
        result = select(A3, 0, count3-1, k-count1-count2);
    }
    return result;
}

