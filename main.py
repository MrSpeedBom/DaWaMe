import requests
from datetime   import datetime
#for signup request
signup={'NAME':'','MNAME':'','LNAME':'','NATIONAL_NUMBER':'','PHONENUMBER':'','GENDER':'','PASSWORD':''};
user1={'NAME':'احمد','MNAME':'تمام','LNAME':'الحاج يحيى','NATIONAL_NUMBER':'','PHONENUMBER':'0938362215','GENDER':'M','PASSWORD':'PASS'};

#for checkup request
today=datetime.today();
check={'seed':0,'hash':0}
hash=37539

seed=[today.second,today.minute,today.hour]
print(seed[0],' ',seed[1],' ',seed[2]);
seed=seed[0]+60*seed[1]+3600*seed[2]
check['seed']=seed;
check['hash']=((today.second+1)*(today.minute+1)+hash*(today.hour+1))%(1000000007);


response = requests.post(url="http://127.0.0.1:3000/signup",json=user1)
#response = requests.post(url="http://127.0.0.1:3000/checktoday",json=check)
print(response.json())