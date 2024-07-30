const { exists } = require('fs');

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
    create table IF NOT EXISTS  USERS (
      ID INT PRIMARY KEY NOT NULL,
      NAME CHAR(20) NOT NULL,
      MNAME CHAR(20) NOT NULL,
      LNAME CHAR(20) NOT NULL,
      NATIONAL_NUMBER CHAR(11),
      PHONENUMBER CHAR(10),
      GENDER CHAR(1)
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
function checkUser(ID){
  user_exists=db.prepare(`SELECT * FROM USERS WHERE ID=${ID}`).get()!=undefined;
  return user_exists;
}
function insertUser(user){
  ID=count_rows('USERS');
  db.exec(`INSERT INTO USERS VALUES(${ID},'${user.NAME}','${user.MNAME}','${user.LNAME}','${user.NATIONAL_NUMBER}','${user.PHONENUMBER}','${user.GENDER}')`);
  return ID;
}

function insertCheckIn(ID){
  gdate=new Date();
  gdate=gdate.toISOString();
  console.log(gdate);
  date=gdate.substr (0,10);
  tim=gdate.substr(11,8);
  console.log(tim);
  check_exists=db.prepare(`SELECT * FROM CHECKINS WHERE ID=${ID} AND AT='${date}'`).get()!=undefined;
  if(check_exists)return false;
  db.exec(`INSERT INTO CHECKINS VALUES(${ID},'${date}','${tim}')`);
  return true;
}
function insertCheckOut(ID){
  gdate=new Date();
  gdate=gdate.toISOString();
  date=gdate.slice(0,10);
  tim=gdate.slice(11,8);
  check_exists=db.prepare(`SELECT * FROM CHECKOUTS WHERE ID=${ID} AND AT='${date}'`).get()!=undefined;
  if(check_exists)return false;
  db.exec(`INSERT INTO CHECKOUTS VALUES(${ID},'${date}','${tim}')`);
  return true;
}
function show_table(table_name){
  console.log(table_name)
  rows=db.prepare(`SELECT * FROM ${table_name}`).all();
  console.log(rows);
}
module.exports={connect,insertUser,show_table,insertCheckOut,insertCheckIn,checkUser};
