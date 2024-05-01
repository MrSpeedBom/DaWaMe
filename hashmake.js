int=require('BigInt')
prime = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61]
MD = 1000000000 + 7;
function value(H){
  res=1;
  for(i=0;i<18;i++){
    if(H&1){
      res*=prime[i];
      res%=MD;
    }
    H>>=1;
  }
  return res;
} 
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
function numLess(arr,x){
  l=0,r=arr.length,mid;
  if(arr.length==0 || arr[0]>x)return 0;
  while(l+1<r){
    mid=(l+r)>>1;
    if(a[mid]<=x)l=mid;
    else r=mid;
  }
  return l+1;
}
module.exports = {value,powll,MD};