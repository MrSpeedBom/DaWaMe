db=require('./sqlconnect');
db.connect('./unidb.db')
m=require('./hashmake')
db.show_table('USERS');
db.show_table('CHECKINS');
db.show_table('CHECKOUTS');
function cypher(str,key){
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
    
    return arr;
}
