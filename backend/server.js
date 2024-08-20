const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
// const secretKey = crypto.randomBytes(32).toString('hex');
// console.log(secretKey); // 생성된 비밀키를 출력
require('dotenv').config(); // .env 파일에서 환경 변수를 불러옵니다.

const SECRET_KEY = process.env.SECRET_KEY; 

app.use(express.json());
var cors = require('cors');
app.use(cors());
app.use(express.urlencoded({extended: true})); //req.body 쓰려면 이코드가 필요

//  몽고디비연결
const { MongoClient, ObjectId } = require('mongodb');

let db;
const url = "mongodb+srv://mj950313:100489jae@minjae.mpxmk1e.mongodb.net/?retryWrites=true&w=majority&appName=minjae";
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

new MongoClient(url).connect().then(()=>{
    console.log("DB연결성공")
    db = client.db("danak");
    app.listen(8080, function () {
        console.log('Server is running on port 8080');
    });
}).catch((err)=>{
    console.log(err)
})

const products = [
    { id: 1, name: "BIXOD N MOUNTAIN STREAM", description: "(빅소드 엔 마운틴 스트림)", price: "290,000원", image: "/path/to/image1.jpg", category: "신제품" },
    { id: 2, name: "INK N AIR", description: "잉크 엔 에어 쭈꾸미 갑오징어 낚싯대", price: "330,000원", image: "/path/to/image2.jpg", category: "신제품" },
    { id: 3, name: "40주년 로드", description: "40주년 한정판)배스,참돔,오징어,갑오징어,광어", price: "410,000원", image: "/path/to/image3.jpg", category: "바다" },
    { id: 4, name: "BIXOD N BLACK LABEL", description: "(BIXOD N BLACK LABEL)배스", price: "500,000원", image: "/path/to/image4.jpg", category: "민물" },
    { id: 5, name: "BIXOD N BLACK LABEL", description: "(BIXOD N BLACK LABEL)배스", price: "500,000원", image: "/path/to/image4.jpg", category: "루어" },
  ];
  
  
  // 회원가입 API
app.post("/api/auth/register", async (req, res) => {
    const { email, password, confirmPassword, name, nickname, phoneNumber } = req.body;
  
    // 이메일 중복 확인
    const existingUser = await db.collection('users').findOne({ email });
    const vaildNickname = await db.collection('users').findOne({ nickname });
    
    if (vaildNickname) {
        return res.status(400).json({ error: "이미 사용 중인 닉네임입니다." });
      }
    if (existingUser) {
      return res.status(400).json({ error: "이미 사용 중인 이메일입니다." });
    }
   
    if (password.length < 8) {
      return res.status(400).json({ error: "비밀번호는 8자 이상이어야 합니다." });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ error: "비밀번호와 비밀번호 확인이 일치하지 않습니다." });
      }
  
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      // 사용자 정보 저장
      const newUser = await db.collection("users").insertOne({
        email,
        password: hashedPassword,
        nickname,
        phoneNumber,
        name,
        createdAt: new Date(),
      });
  
      // 사용자에게 JWT 토큰 발급
      const token = jwt.sign({ userId: newUser.insertedId }, SECRET_KEY, { expiresIn: '1h' });
      
      // 성공 응답
      res.json({ token, message: "회원가입이 완료되었습니다." });
  
    } catch (error) {
      res.status(500).json({ error: "회원가입 중 서버 오류가 발생했습니다." });
    }
  });

// API
app.get("/api/products", (req, res) => {
    res.json(products)
})

//커뮤니티 API
app.get("/api/community", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // 요청된 페이지 번호 (기본값 1)
        const limit = 10; // 한 페이지에 보여줄 글의 수
        const skip = (page - 1) * limit; // 스킵할 문서 수 계산

        const totalPosts = await db.collection("community").countDocuments(); // 전체 게시물 수
        const totalPages = Math.ceil(totalPosts / limit); // 전체 페이지 수

        const response = await db.collection("community")
            .find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();

        res.json({
            posts: response,
            totalPages, // 전체 페이지 수 반환
            currentPage: page, // 현재 페이지
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
        console.error("Database query failed:", error);
    }
});

app.get("/api/community/:id", async (req, res) => {
     try {
        const id = req.params.id;
        const response = await db.collection("community").findOne({ _id: new ObjectId(id) });
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
        console.error("Database query failed:", error);
    }
});

app.delete("/api/community/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const result = await db.collection("community").deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Story not found" });
        }

        res.send("글 삭제 완료");
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).send("글 삭제 중 서버에러가 발생했습니다.");
    }
});

app.put("/api/community/write/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const updateData = {
            title: req.body.title,
            content: req.body.content,
            updatedAt: new Date()
        };

        const result = await db.collection("community").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Story not found" });
        }

        res.send("글 수정 완료");
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).send("글 수정 중 서버에러가 발생했습니다.");
    }
});

app.post("/api/community/write", async (req, res) => {
    if (req.body.title.trim() === "") {
     return res.status(400).send("제목을 입력해주세요");
    }
    if (req.body.content.trim() === "") {
     return res.status(400).send("내용을 입력해주세요");
    }
    try {
        const currentTime = new Date();

        await db.collection("community").insertOne({
            title: req.body.title,
            content: req.body.content,
            createdAt: currentTime,
            updatedAt: currentTime 
        });
        res.send("글 작성 완료");
    } catch (error) {
        console.error("Error writing post:", error);
        res.status(500).send("글 작성 중 서버에러가 발생했습니다.");
    }
 });
 



// 리액트 라우터사용
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname,"../frontend/dist/index.html"))
})