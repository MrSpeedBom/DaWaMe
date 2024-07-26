int=require('BigInt')
MD = 1000000000 + 7;
function powll(a,b){
  a=BigInt(a)
  b=BigInt(b)
  res=BigInt(1);
  while(b>0){
    if(b%BigInt(2)==1){
      res*=a;
      res%=BigInt(MD);
    }
    a=(a*a)%BigInt(MD);
    b>>=BigInt(1);
  }
  return res;
}
module.exports = {powll};