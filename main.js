db=require('./sqlconnect');
db.connect('./unidb.db')
m=require('./hashmake')
db.show_table('USERS');
db.show_table('HASHES');
db.show_table('CHECKINS');
db.show_table('CHECKOUTS');