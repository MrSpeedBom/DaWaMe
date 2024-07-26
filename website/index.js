function synchronousRequest(url) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    if (xhr.status === 200) {
       return xhr.responseText;
    } else {
       throw new Error('Request failed: ' + xhr.statusText);
    }
 }
 function cypher(str,key){
   return str;
   arr=[]
   karr=[]
   for(i=0;i<str.length;i++){
       arr.push(str.charCodeAt(i));
   } 
   for(i=0;i<key.length;i++){
       karr.push(key.charCodeAt(i));
   }
   for(i=0;i<arr.length;i++){
       arr[i]=arr[i]^karr[i%karr.length];
   }
   console.log(arr);
   res=String.fromCharCode(arr);
   return res;
}