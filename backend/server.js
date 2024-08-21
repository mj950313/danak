const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const cookieParser = require('cookie-parser'); //쿠키를 읽으려면 필요

app.use(cookieParser());


require('dotenv').config();

// const crypto = require('crypto');
// const secretKey = crypto.randomBytes(32).toString('hex');
// console.log(secretKey); // 생성된 비밀키를 출력

const SECRET_KEY = process.env.SECRET_KEY; 
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

app.use(express.json({limit:"50mb"}));
var cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, 
}));
app.use(express.urlencoded({limit: "50mb",extended: true})); //req.body 쓰려면 이코드가 필요

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

// AWS S3 설정
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

  
// S3에 이미지 업로드 함수
const uploadToS3 = async (base64Image, fileName) => {
  const buffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
  const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg', // 이미지는 상황에 맞게 설정
  };
  
  try {
      const command = new PutObjectCommand(params);
      await s3Client.send(command);
      return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`; // S3 URL 반환
  } catch (error) {
      console.error("S3 업로드 중 오류 발생:", error);
      throw new Error('S3 업로드 실패');
  }
};

// S3에서 이미지 삭제 함수
const deleteFromS3 = async (url) => {
  const key = url.split('/').pop(); // S3의 파일명 추출
  const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
  };

  try {
      const command = new DeleteObjectCommand(params);
      await s3Client.send(command);
      console.log(`S3 파일 삭제 완료: ${url}`);
  } catch (error) {
      console.error("S3 삭제 중 오류 발생:", error);
      throw new Error('S3 삭제 실패');
  }
};

// JWT 인증 미들웨어
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // 'Bearer' 이후의 토큰만 추출

  if (!token) {
    return res.status(401).json({ error: '토큰이 필요합니다.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY); // 토큰 검증
    req.user = decoded; // 검증된 유저 정보를 req.user에 저장
    next();
  } catch (error) {
    return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
  }
};

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

const extractImageUrlsFromContent = (content) => {
const urls = [];
const base64Regex = /<img[^>]+src="([^">]+)"/g;
let match;

while ((match = base64Regex.exec(content)) !== null) {
  const src = match[1];
  if (!src.startsWith("data:image/")) {
      urls.push(src); // base64가 아닌 URL만 추출
  }
}

return urls;
};

app.delete("/api/community/:id", verifyToken, async (req, res) => {
try {
  const id = req.params.id;

    // JWT 토큰에서 가져온 userId로 DB에서 해당 사용자의 정보를 조회
    const userFromDB = await db.collection("users").findOne({ _id: new ObjectId(req.user.userId) });
    
    if (!userFromDB) {
      return res.status(404).json({ error: "토큰이 유효하지 않습니다." });
    }

  // 글을 찾기 위해 먼저 해당 글을 조회
  const post = await db.collection("community").findOne({ _id: new ObjectId(id) });

  if (!post) {
      return res.status(404).json({ error: "Story not found" });
  }

  // 글에 포함된 이미지 URL을 추출 (예: content에서 이미지 URL을 추출)
  const imageUrls = extractImageUrlsFromContent(post.content); // content에서 이미지 URL을 추출하는 함수

  // S3에서 이미지 삭제
  await Promise.all(imageUrls.map(url => deleteFromS3(url)));

  // MongoDB에서 글 삭제
  const result = await db.collection("community").deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Story not found" });
  }

  res.send("글 삭제 완료");
} catch (error) {
  console.error("Error deleting post:", error);
  res.status(500).send("글 삭제 중 서버 에러가 발생했습니다.");
}
});


app.put("/api/community/write/:id", verifyToken, async (req, res) => {
try {
  const id = req.params.id;

    // JWT 토큰에서 가져온 userId로 DB에서 해당 사용자의 정보를 조회
    const userFromDB = await db.collection("users").findOne({ _id: new ObjectId(req.user.userId) });
    
    if (!userFromDB) {
      return res.status(404).json({ error: "토큰이 유효하지 않습니다." });
    }

  // 기존 글을 찾아서 기존 이미지를 추출
  const existingPost = await db.collection("community").findOne({ _id: new ObjectId(id) });
  if (!existingPost) {
      return res.status(404).json({ error: "Story not found" });
  }

  // 기존 글의 이미지 URL 추출
  const oldImageUrls = extractImageUrlsFromContent(existingPost.content);

  // 수정된 글의 이미지 URL 추출
  const updatedContent = await replaceBase64WithUrls(req.body.content);
  const newImageUrls = extractImageUrlsFromContent(updatedContent);

  // 기존 이미지 중에서 더 이상 사용되지 않는 이미지를 삭제
  const imagesToDelete = oldImageUrls.filter(url => !newImageUrls.includes(url));
  await Promise.all(imagesToDelete.map(url => deleteFromS3(url)));

  // 수정된 글 데이터 업데이트
  const updateData = {
      title: req.body.title,
      content: updatedContent, // base64 이미지가 URL로 대체된 content
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
  res.status(500).send("글 수정 중 서버 에러가 발생했습니다.");
}
});


const replaceBase64WithUrls = async (content) => {
  const base64Regex = /<img[^>]+src="data:image\/[^">]+"/g;
  let match;
  let updatedContent = content;

  while ((match = base64Regex.exec(content)) !== null) {
  const base64Image = match[0].match(/src="([^"]+)"/)[1]; // base64 이미지 추출
  const fileName = `${Date.now()}.jpeg`; // 파일명 설정

  // S3에 업로드하고 URL 반환
  const imageUrl = await uploadToS3(base64Image, fileName);

  // base64 이미지 URL로 교체
  updatedContent = updatedContent.replace(base64Image, imageUrl);
  }

  return updatedContent;
};


app.post("/api/community/write", verifyToken, async (req, res) => {
  const { title, content } = req.body;

  try {
    // JWT 토큰에서 가져온 userId로 DB에서 해당 사용자의 정보를 조회
    const userFromDB = await db.collection("users").findOne({ _id: new ObjectId(req.user.userId) });
    
    if (!userFromDB) {
      return res.status(404).json({ error: "토큰이 유효하지 않습니다." });
    }

    // base64 이미지 처리 (S3 업로드 후 URL로 교체)
    const updatedContent = await replaceBase64WithUrls(content);

    // 글 작성
    await db.collection("community").insertOne({
      userNickname: userFromDB.nickname, // 유저 닉네임은 토큰으로 인증된 유저 정보를 사용
      title,
      content: updatedContent,
      createdAt: new Date(),
    });

    res.status(200).send("글 작성 완료");
  } catch (error) {
    console.error("Error writing post:", error);
    res.status(500).send("글 작성 중 서버 에러가 발생했습니다.");
  }
});




const products = [
    { id: 1, name: "BIXOD N MOUNTAIN STREAM", description: "(빅소드 엔 마운틴 스트림)", price: "290,000원", image: "/path/to/image1.jpg", category: "신제품" },
    { id: 2, name: "INK N AIR", description: "잉크 엔 에어 쭈꾸미 갑오징어 낚싯대", price: "330,000원", image: "/path/to/image2.jpg", category: "신제품" },
    { id: 3, name: "40주년 로드", description: "40주년 한정판)배스,참돔,오징어,갑오징어,광어", price: "410,000원", image: "/path/to/image3.jpg", category: "바다" },
    { id: 4, name: "BIXOD N BLACK LABEL", description: "(BIXOD N BLACK LABEL)배스", price: "500,000원", image: "/path/to/image4.jpg", category: "민물" },
    { id: 5, name: "BIXOD N BLACK LABEL", description: "(BIXOD N BLACK LABEL)배스", price: "500,000원", image: "/path/to/image4.jpg", category: "루어" },
  ];

  // API
app.get("/api/products", (req, res) => {
  res.json(products)
})

  
  
// 회원가입/로그인 API
app.post("/api/auth/register", async (req, res) => {
    const { email, password, confirmPassword, name, nickname, phoneNumber } = req.body;
  
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
      const newUser = await db.collection("users").insertOne({
        email,
        password: hashedPassword,
        nickname,
        phoneNumber,
        name,
        createdAt: new Date(),
      });
  
      res.json({ message: "회원가입이 완료되었습니다.", user: newUser });
    } catch (error) {
      res.status(500).json({ error: "회원가입 중 서버 오류가 발생했습니다." });
    }
  });


app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await db.collection("users").findOne({ email });
  
      if (!user) {
        return res.status(400).json({ error: "이메일 또는 존재하지 않는 이메일입니다." });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "이메일 또는 비밀번호가 일치하지 않습니다." });
      }
  
      // JWT 액세스 토큰 발급 (유효기간 15분)
      const accessToken = jwt.sign({ userId: user._id }, SECRET_KEY, {
        expiresIn: "1m",
      });
  
      // JWT 리프레시 토큰 발급 (유효기간 7일)
      const refreshToken = jwt.sign({ userId: user._id }, REFRESH_SECRET_KEY, {
        expiresIn: "7d",
      });
  
      // 리프레시 토큰을 HttpOnly 쿠키로 전송
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // JS로 접근 불가
        secure: true,   // HTTPS에서만 전송 (개발 시에는 false로 설정)
        sameSite: "None", // CSRF 공격 방지
        maxAge: 7 * 24 * 60 * 60 * 1000, // 쿠키 유효기간 7일
      });
  
      res.json({ accessToken, user: user.nickname, message: "로그인이 성공적으로 완료되었습니다." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "로그인 중 서버 오류가 발생했습니다." });
    }
  });

//리프레쉬토큰 API
app.post("/api/auth/refresh-token", async (req, res) => {
  const refreshToken = req.cookies.refreshToken; // 쿠키에서 리프레시 토큰 추출
console.log("refreshToken", refreshToken);
  if (!refreshToken) {
    return res.status(401).json({ error: "리프레시 토큰이 없습니다." });
  }

  try {
    // 리프레시 토큰 검증
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
    const userId = decoded.userId;

    // 사용자 정보 가져오기
    const userFromDB = await db.collection("users").findOne({ _id: new ObjectId(userId) });

    if (!userFromDB) {
      return res.status(404).json({ error: "유저를 찾을 수 없습니다." });
    }

    // 새로운 액세스 토큰 발급 (유효기간 15분)
    const newAccessToken = jwt.sign({ userId: userFromDB._id }, SECRET_KEY, {
      expiresIn: "15m",
    });

    // 새로운 액세스 토큰 반환
    res.json({
      accessToken: newAccessToken,
      user: userFromDB.nickname,
    });
  } catch (error) {
    console.error("리프레시 토큰 검증 실패:", error);
    res.status(403).json({ error: "유효하지 않은 리프레시 토큰입니다." });
  }
});

      
// 리액트 라우터사용
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname,"../frontend/dist/index.html"))
})