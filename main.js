db=require('./sqlconnect');
db.connect('./unidb.db')
m=require('./hashmake')
db.show_table('USERS');
db.show_table('CHECKINS');
db.show_table('CHECKOUTS');
gdate=new Date();
  gdate=gdate.toISOString();
  console.log(gdate);
  date=gdate.slice(0,10);
  timm=gdate.substr(11,8);
  console.log(timm);
