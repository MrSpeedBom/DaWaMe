function print(a){console.log(a);}
const express = require('express');
const { stringify } = require('querystring');
db_con=require('./sqlconnect');
ip=require("ip");
const cors = require("cors");

path=require('path');
const app = express()
app.use(express.json());
app.use(cors());
const port = 3000

user_data_sample={NAME:'',MNAME:'',LNAME:'',NATIONAL_NUMBER:'',PHONE_NUMBER:'',GENDER:'' };
app.post('/signup',(req,res)=>{
    print('got signup request!');
    state=true;
    console.log(req.body);
    for(key in user_data_sample){
      if(!req.body.hasOwnProperty(key)){
        console.log(key);
        state=false;
      } 
    }
    data={};
    data.state=state;
    if(state){
      data.info='ok_done';
      data.HASH=db_con.insertUser(req.body);
    }else{
      data.info='err_no_enough_data';
      data.HASH=0;
    }
    res.end(JSON.stringify(data));
  });
app.get('/local_ip',(req,res)=>{
  res.writeHead(200, { 'Content-Type': 'application/json' });
  data={}
  data.ip=ip.address();
  data.port=port;
  res.end(JSON.stringify(data));
});
function handleCheckIn(req){
  data={}
  if(db_con.checkUser(req.body.ID)){
    data.state=db_con.insertCheckIn(req.body.ID);
    if(data.state)
    data.type='ok';
    else
    data.type='err_checkin_exists';
  }else{
    data.state=false;
    data.type='err_no_such_user';
  }
  return data;
}
function handleCheckOut(req){
  data={}
  if(db_con.checkUser(req.body.ID)){
    data.state=db_con.insertCheckOut(req.body.ID);
    if(data.state)
    data.type='ok';
    else
    data.type='err_checkin_exists';
  }else{
    data.state=false;
    data.type='err_no_such_user';
  }
  return data;
}
check_sample={ID:0,type:0};
app.post('/checktoday',(req,res)=>{
  print('got check request!');
  data={};
  state=true;
  for(key in check_sample){
    if(!req.body.hasOwnProperty(key)){
      state=false;
    }
  }
  if(!state){
    data.state=false;
    data.type='err_no_enough_data'
  }else{
    //todo:
    //here we must specify a time for checking in and out
    if(req.body.type==1){
      data=handleCheckIn(req);
    }else{
      data=handleCheckOut(req);
    }
    console.log(data);
  }
  res.end(JSON.stringify(data));
});
//todo:
db_con.connect('./unidb.db');
app.listen(port, () => {
  console.log(`DaWaMe server listening on port ${port}`)
})
