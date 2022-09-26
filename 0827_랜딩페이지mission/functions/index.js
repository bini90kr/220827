const functions = require("firebase-functions");
let admin = require("firebase-admin");
const cors = require("cors")({origin:true});
let serviceAccount = require("./bini0827mission-firebase-adminsdk-yc6ki-c9f391d1fa");
let axios = require("axios");
let FormData = require("form-data");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bini0827mission-default-rtdb.firebaseio.com"
});

let db = admin.database();

exports.helloWorld = functions.https.onRequest((request, response) => {
  cors(request, response, ()=>{
    db.ref("msgs").on("value",(snapshot)=>{
      response.send(snapshot.val());
    });
  });
});

exports.ceocamp = functions.https.onRequest((request, response) => {
  let bini = {
    name : "정수빈",
    age : "33",
    height : 168
  }
  response.send(bini);
});

exports.login = functions.https.onRequest((request, response) => {
  cors(request, response, ()=>{
    let id = request.body.id;
    let pwd = request.body.pwd;
    db.ref("members/"+id).on("value", (snapshot)=>{
      if(snapshot.val()){
        if(snapshot.val() == pwd){
          response.send({"reslut":"로그인 되었습니다."});
        }else{
          response.send({"reslut":"비밀번호가 일치하지 않습니다."});
        }
      }else{
        response.send({"reslut":"가입되지 않은 회원입니다."});
      }
    });
  });
});

exports.join = functions.https.onRequest((request, response) => {
  cors(request, response, ()=>{
    let id = request.body.id;
    let pwd = request.body.pwd;
    db.ref("members/"+id).set(pwd);
  });
});

exports.sendSMS = functions.https.onRequest((request, response) => {
  cors(request, response, ()=>{

    let phone = request.body.phone;

    let data = new FormData();
    data.append("remote_id", "artslur2021");
    data.append("remote_pass", "art20211011!");
    data.append("remote_num", "1");
    data.append("remote_phone", phone);
    data.append("remote_callback", "18111225");
    data.append("remote_msg", "안녕하세요~ 아트슬러입니다:)");

    axios({
      method:"post",
      url:"https://www.munja123.com/Remote/RemoteSms.html",
      headers: {
        ...data.getHeaders()
      },
      data: data
    }).then((res)=>{
      response.send({"result_code":"1", "result":"전송 완료"});
    });
  });
});
