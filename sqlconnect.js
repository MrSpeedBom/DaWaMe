
//sqlite3 = require('sqlite3');
sqlite3=require('better-sqlite3');
hmake=require('./hashmake');
fs=require('fs');
let db;
function connect(db_name) {
    console.log('connnecting to the database');
  db=new sqlite3(db_name);
  createTables();
  console.log('done!');
}
function createTables() {
  db.exec(`
    create table IF NOT EXISTS HASHES (
      ID INT PRIMARY KEY NOT NULL,
      HASH INT NOT NULL
    );
    create table IF NOT EXISTS  USERS (
      ID INT PRIMARY KEY NOT NULL,
      NAME CHAR(20) NOT NULL,
      MNAME CHAR(20) NOT NULL,
      LNAME CHAR(20) NOT NULL,
      NATIONAL_NUMBER CHAR(11),
      PHONENUMBER CHAR(10),
      GENDER CHAR(1),
      PASSWORD CHAR(100)
    );
    create table IF NOT EXISTS CHECKS (
      ID INT NOT NULL,
      AT DATETIME NOT NULL,
      PRIMARY KEY (ID,AT)
    );
    create table IF NOT EXISTS CHECKINS (
      ID INT NOT NULL,
      AT DATE NOT NULL,
      T TIME NOT NULL,
      PRIMARY KEY (ID,AT)
    );
    create table IF NOT EXISTS CHECKOUTS (
      ID INT NOT NULL,
      AT DATE NOT NULL,
      T TIME NOT NULL,
      PRIMARY KEY (ID,AT)
    );
    `);
}
function count_rows(table_name){
  var num=0;
  num=db.prepare(`SELECT COUNT(*) AS 'cnt' FROM ${table_name}`).get();
  num=num.cnt;
  return num;
}
function insertUser(user) {
  ID=count_rows('USERS');
  db.exec(`INSERT INTO USERS VALUES(${ID},'${user.NAME}','${user.MNAME}','${user.LNAME}','${user.NATIONAL_NUMBER}','${user.PHONENUMBER}','${user.GENDER}','${user.PASSWORD}')`);
  return newHash(ID);
}

//O(n)
//todo:
//improve to O(log(n)) complexity 
function newHash(ID){
  hashes=db.prepare(`SELECT HASH FROM HASHES`).all();
  val=0;
  arr=[]
  for(i=0;i<2**18;i++)arr.push(1);
  for(h in hashes)arr[h]=0;
  range=2**18-hashes.length;
  val=Math.floor(Math.random()*range)+1;
  i=0;
  while(arr[i]<val){
    i++;
    arr[i]+=arr[i-1];
  }
  db.exec(`INSERT INTO HASHES VALUES(${ID},${i})`);
  return i;
}
function checkIdentity(seed,hash){
  var data=[]
  for(i=0;i<3;i++){
    data.push(seed%60+1);
    seed=Math.floor(seed/60);
  }
  hash=(hmake.powll(data[2],hmake.MD-2)*BigInt(hash-(data[0]*data[1])))%BigInt(hmake.MD);
  res= db.prepare(`SELECT ID FROM HASHES WHERE HASH=${hash}`).get();
  if(res==undefined)
  return -1;
  else 
  return res.ID;
}
function insertCheckIn(ID){
  gdate=new Date();
  gdate=gdate.toISOString();
  date=gdate.slice(0,10);
  tim=gdate.slice(11,8);
  exists=db.prepare(`SELECT * FROM CHECKINS WHERE ID=${ID} AND AT='${date}'`).get()!=undefined;
  if(exists)return false;
  db.exec(`INSERT INTO CHECKINS VALUES(${ID},'${date}','${tim}')`);
  return true;
}
function insertCheckOut(ID){
  gdate=new Date();
  gdate=gdate.toISOString();
  date=gdate.slice(0,10);
  tim=gdate.slice(11,8);
  exists=db.prepare(`SELECT * FROM CHECKOUTS WHERE ID=${ID} AND AT='${date}'`).get()!=undefined;
  if(exists)return false;
  db.exec(`INSERT INTO CHECKOUTS VALUES(${ID},'${date}','${tim}')`);
  return true;
}
function show_table(table_name){
    console.log(table_name)
  rows=db.prepare(`SELECT * FROM ${table_name}`).all();
  console.log(rows);
}
module.exports={connect,insertUser,show_table,checkIdentity,insertCheckOut,insertCheckIn};
