function print(a){console.log(a);}
const express = require('express')
db_con=require('./sqlconnect');

const app = express()
app.use(express.json());
const port = 3000

datasample={NAME:'',MNAME:'',LNAME:'',NATIONAL_NUMBER:'',PHONENUMBER:'',GENDER:'',PASSWORD:''};
app.post('/signup',(req,res)=>{
    print('got signup request!');
    state=true;
    for(key in datasample){
      if(!req.body.hasOwnProperty(key)){
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
function handleCheckIn(req){
  data={}
  state=db_con.checkIdentity(req.body.seed,req.body.hash);
  if(state==-1){
    data.state=false;
    data.type='err_user_unveryfied';
  }else{
    data.state=db_con.insertCheckIn(state);
    if(data.state)
    data.type='ok';
    else
    data.type='err_checkin_exists';
  }
  return data;
}
function handleCheckOut(req){
  data={}
  state=db_con.checkIdentity(req.body.seed,req.body.hash);
  if(state==-1){
    data.state=false;
    data.type='err_user_unveryfied';
  }else{
    data.state=db_con.insertCheckIn(state);
    if(data.state)
    data.type='ok';
    else
    data.type='err_checkin_exists';
  }
  return data;
}
checksample={seed:0,hash:0};
app.post('/checktoday',(req,res)=>{
  print('got check request!');
  data={};
  state=true;
  for(key in checksample){
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
    if(true){
      data=handleCheckIn(req);
    }else{
      data=handleCheckOut(req);
    }
    console.log(data);
  }
  res.end(JSON.stringify(data));
});
//todo:
//sign in to your account with username and password 
app.post('/signin',(req,res)=>{
  print('got signin request!');
  print(req.body);
  data={};

  res.end(JSON.stringify(data));
});

db_con.connect('./unidb.db');
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})