const express=require("express")
//라이브러리 로드
//서버 생성
const app=express();
//서버를 구동
/*
    bind() => IP와 PORT 연결해주는 역할
    listen() => 대기상태
    accept() => 클라이언트가 접속을 했을 때 처리하는 부분
 */
app.listen(3355,()=>{
    console.log("Server Start...","http://localhost:3355")
})
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
//클라이언트와 통신하는 부분
//사용자(클라이언트)의 URI를 받아옴 => 사용자가 이용할 수 있는게 브라우저밖에 없어서 이걸 가져오는 것.URI 주소는 다 다르기 때문에 이걸로 구분
//mongoDB 연결
const  Client = require("mongodb").MongoClient;
//mongoDB connection
app.get('/recipe',(request,response)=>{
    //request = 사용자가 보내준 요청 정보
    //요청 처리
    //response = 결과를 전송
    var page=request.query.page; //request.getParameter("page")
    var rowSize = 12;
    var skip=(page*rowSize)-rowSize;

    var url="mongodb://211.238.142.181:27017"; //몽고디비 주소
    Client.connect(url, (err,client)=>{
        var db = client.db('mydb');
        //db.collection('recipe').find({})  == select * from recipe
        //find({"title":{"$regex":".*"+값}} == select * from recipe where title Like '%값%'
        db.collection('recipe').find({}).skip(skip).limit(rowSize).toArray((err,docs)=>{ //데이터가 배열이 아닌 낱개로 들어가서 이렇게 해줌
            //요청한 사용자에게 값 보내기
            response.json(docs);
            console.log(docs);
            client.close();
        })

    });


})