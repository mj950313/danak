const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const cookieParser = require('cookie-parser'); //쿠키를 읽으려면 필요
const multer = require("multer");
const multerS3 = require("multer-s3");

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
  origin: process.env.CORS_ORIGIN,
  credentials: true, 
}));
app.use(express.urlencoded({limit: "50mb",extended: true})); //req.body 쓰려면 이코드가 필요

//  몽고디비연결
const { MongoClient, ObjectId } = require('mongodb');

let db;
const url = "mongodb+srv://mj950313:100489jae@minjae.mpxmk1e.mongodb.net/?retryWrites=true&w=majority&appName=minjae";
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

const PORT = process.env.PORT || 8081
new MongoClient(url).connect().then(()=>{
    console.log("DB연결성공")
    db = client.db("danak");
    app.listen(PORT, function () {
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

// Multer S3 설정
const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^a-zA-Z0-9.]/g, '_') // 알파벳, 숫자, 점을 제외한 모든 문자를 _로 대체
    .toLowerCase(); // 소문자로 변환
};

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME, // S3 버킷 이름
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const sanitizedFilename = sanitizeFilename(file.originalname);
      cb(null, `${Date.now()}_${sanitizedFilename}`); // 안전한 파일명 지정
    },
  }),
  limits: { fileSize: 50 * 1024 * 1024 }, // 최대 50MB
});


  
// S3에 이미지(베이스64인코딩) 업로드 함수
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
  const key = decodeURIComponent(url.split('/').pop()); // URL에서 파일명 추출 및 디코딩
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };

  try {
    const command = new DeleteObjectCommand(params);
    const result = await s3Client.send(command);
    console.log(`S3 파일 삭제 완료: ${url}`, result);
  } catch (error) {
    console.error("S3 삭제 중 오류 발생:", error);
    throw new Error('S3 삭제 실패');
  }
};


// JWT 인증 미들웨어
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '토큰이 필요합니다.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY); // 토큰 검증
    req.user = decoded.userId; // 검증된 유저 정보를 req.user에 저장
    next();
  } catch (error) {
    return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
  }
};


// 상품 조회/등록 API
app.get("/api/products", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const category = req.query.category || "전체";
    const skip = (page - 1) * limit;

    const query = category === "전체" ? {} : { category };

    const totalProducts = await db.collection("products").countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await db
      .collection("products")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    res.json({
      products,
      totalPages,
      currentPage: page,
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ error: "서버 에러 발생" });
  }
});


app.get("/api/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await db.collection("products").findOne({ _id: new ObjectId(productId) });

    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

app.post("/api/products/new-product", verifyToken, upload.fields([
  { name: 'productImage', maxCount: 1 },
  { name: 'detailImages', maxCount: 3 }
]), async (req, res) => {
  try {
    // 이미지 파일 URL 가져오기
    const productImage = req.files.productImage[0].location; // 메인 상품 이미지
    const detailImages = req.files.detailImages.map(file => file.location); // 상세 이미지 리스트

    // 요청으로부터 폼 데이터를 받음
    const { productName, category, price, description } = req.body;

    // MongoDB에 상품 데이터 저장
    const newProduct = {
      productName,
      category,
      price: parseInt(price),
      description,
      productImage,
      detailImages, 
      userId: req.user,
      createdAt: new Date(),
    };

    await db.collection("products").insertOne(newProduct);

    res.status(201).json({ message: "상품이 성공적으로 등록되었습니다.", product: newProduct });
  } catch (error) {
    console.error("상품 등록 중 오류:", error);
    res.status(500).json({ error: "상품 등록 중 오류가 발생했습니다." });
  }
});

app.delete("/api/products/delete/:id", verifyToken, async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await db.collection("products").findOne({ _id: new ObjectId(productId) });

    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }

    // 메인 이미지와 상세 이미지 삭제
    const deleteMainImage = deleteFromS3(product.productImage);
    const deleteDetailImages = product.detailImages.map(imageUrl => deleteFromS3(imageUrl));

    await Promise.all([deleteMainImage, ...deleteDetailImages]);

    // MongoDB에서 상품 삭제
    await db.collection("products").deleteOne({ _id: new ObjectId(productId) });

    res.status(200).json({ message: "상품이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("상품 삭제 중 오류:", error);
    res.status(500).json({ error: "상품 삭제 중 오류가 발생했습니다." });
  }
});

//장바구니 API
app.get("/api/cart", verifyToken, async (req, res) => {
  try {
    const userId = req.user; // `verifyToken` 미들웨어에서 유저 ID를 가져옴

    // 해당 사용자의 장바구니를 조회
    const cart = await db.collection('carts').findOne({ userId: new ObjectId(userId) });

    if (!cart) {
      // 장바구니가 없는 경우
      return res.status(404).json({ message: "장바구니가 비어 있습니다." });
    }

    // 장바구니가 있을 경우
    res.status(200).json({
      cartItems: cart.cartItems,
      totalPrice: cart.totalPrice
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to retrieve cart" });
  }
});

app.post("/api/cart/add", verifyToken, async (req, res) => {
  try {
      const { productId, quantity, price, productName, productImage } = req.body;
      const cart = await db.collection('carts').findOne({ userId:new ObjectId(req.user) });

      if (cart) {
          const existingItem = cart.cartItems.find(item => item.productId.equals(new ObjectId(productId)));
          
          if (existingItem) {
              await db.collection('carts').updateOne(
                  { userId:new ObjectId(req.user), "cartItems.productId":new ObjectId(productId) },
                  { $inc: { "cartItems.$.quantity": quantity, "cartItems.$.price": price * quantity, totalPrice: price * quantity } }
              );
          } else {
              await db.collection('carts').updateOne(
                  { userId:new ObjectId(req.user) },
                  { 
                      $push: { 
                          cartItems: { 
                              productId:new ObjectId(productId), 
                              productName, 
                              productImage, 
                              quantity, 
                              price 
                          } 
                      },
                      $inc: { totalPrice: price * quantity }
                  }
              );
          }
      } else {
          await db.collection('carts').insertOne({
              userId:new ObjectId(req.user),
              cartItems: [{ productId:new ObjectId(productId), productName, productImage, quantity, price }],
              totalPrice: price * quantity
          });
      }

      res.status(200).json({ message: "Product added to cart successfully" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to add product to cart" });
  }
});

app.delete("/api/cart/delete/:productId", verifyToken, async (req, res) => {
  try {
    const userId = req.user;
    const productId = req.params.productId;

    // MongoDB에서 해당 productId를 가진 cartItem을 삭제 ($pull연산자가 삭제역할)
    const result = await db.collection("carts").updateOne(
      { userId: new ObjectId(userId) },
      { $pull: { cartItems: { productId: new ObjectId(productId) } } }
    ); 

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }

    const updatedCart = await db.collection("carts").findOne({ userId: new ObjectId(userId) });
    const totalPrice = updatedCart.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await db.collection("carts").updateOne(
      { userId: new ObjectId(userId) },
      { $set: { totalPrice: totalPrice } }
    );

    res.status(200).json({ message: "상품이 장바구니에서 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "장바구니에서 상품을 삭제하는 중 오류가 발생했습니다." });
  }
});


//마이페이지 API
app.get('/api/mypage/myinfo', verifyToken, async (req, res) => {
  try {
    // 유저 ID를 통해 MongoDB에서 사용자 정보 조회
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.user) });

    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    // 반환할 유저 정보
    const responseData = {
      nickname: user.nickname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      name: user.name,
      role: user.role || "user",
      createdAt: user.createdAt,
    };

    // 응답 데이터 전송
    res.json(responseData);
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

app.put("/api/mypage/myinfo/update", verifyToken, async (req, res) => {
  const { nickname, phone, password } = req.body;

  // 업데이트할 필드를 담을 객체
  let updatedFields = {};
  
  if (nickname && nickname.trim() !== "") {
    updatedFields.nickname = nickname;
  }
  if (phone && phone.trim() !== "") {
    updatedFields.phoneNumber = phone;
  }

  // 비밀번호가 입력된 경우에만 암호화 후 추가
  if (password && password.trim() !== "") {
    const hashedPassword = await bcrypt.hash(password, 10);
    updatedFields.password = hashedPassword;
  }

  // 업데이트할 필드가 없는 경우 처리
  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).json({ error: "업데이트할 필드가 없습니다." });
  }

  try {
    // 사용자 데이터 가져오기
    const user = await db.collection("users").findOne({ _id: new ObjectId(req.user) });
    if (!user) return res.status(404).json({ error: "유저를 찾을 수 없습니다." });

    // 사용자 정보 업데이트
    await db.collection("users").updateOne(
      { _id: new ObjectId(req.user) },
      { $set: updatedFields }
    );
    const updatedUser = await db.collection("users").findOne({ _id: new ObjectId(req.user) });
    return res.status(200).json({ message: "정보가 성공적으로 수정되었습니다." , updatedUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

app.get("/api/mypage/myposts", verifyToken, async (req, res) => {
  try {
    // 사용자가 작성한 글을 가져옴
    const posts = await db.collection("community").find({ userId: new ObjectId(req.user) }).toArray();
    // 결과 반환
    if (posts.length === 0) {
      return res.status(404).json({ message: "작성한 글이 없습니다." });
    }
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

// 마이페이지에서 내가 쓴 댓글 조회 API
app.get("/api/mypage/mycomments", verifyToken, async (req, res) => {
  try {
    const userId = new ObjectId(req.user); // 토큰에서 가져온 유저 ID

    const comments = await db.collection("comments").find({ authorId: userId }).toArray();

    if (!comments.length) {
      return res.status(404).json({ message: "작성한 댓글이 없습니다." });
    }

    // 각 댓글이 속한 커뮤니티 글의 ID와 댓글 내용을 함께 반환
    const commentsWithCommunityIds = await Promise.all(
      comments.map(async (comment) => {
        // 댓글이 속한 커뮤니티 글 찾기
        const community = await db
          .collection("community")
          .findOne({ _id: new ObjectId(comment.communityId) });

        return {
          commentId: comment._id, // 댓글 ID
          communityId: community?._id, // 커뮤니티 글 ID
          communityTitle: community?.title || "Unknown", // 커뮤니티 글 제목
          content: comment.content, // 댓글 내용
          createdAt: comment.createdAt, // 댓글 작성일
        };
      })
    );

    res.status(200).json(commentsWithCommunityIds);
  } catch (error) {
    console.error("댓글 조회 중 오류:", error);
    res.status(500).json({ error: "댓글 조회 중 오류가 발생했습니다." });
  }
});


//커뮤니티 API
app.get("/api/community", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const totalPosts = await db.collection("community").countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    const posts = await db
      .collection("community")
      .aggregate([
        {
          $lookup: {
            from: "users", // 참조할 컬렉션 (users)
            localField: "userId", // community 컬렉션의 필드
            foreignField: "_id", // users 컬렉션의 필드
            as: "userInfo", // 결과를 저장할 필드
          },
        },
        {
          $unwind: "$userInfo", // 병합된 배열을 객체로 변환
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
        {
          $project: {
            title: 1,
            content: 1,
            createdAt: 1,
            "userInfo.nickname": 1, // 유저 닉네임만 선택적으로 반환
          },
        },
      ])
      .toArray();

    res.json({
      posts,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.error("Database query failed:", error);
  }
});


app.get("/api/community/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // community 컬렉션에서 해당 게시글 조회
    const post = await db.collection("community").findOne({ _id: new ObjectId(id) });
    if (!post) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    // 해당 글 작성자의 userId로 유저 정보 조회
    const user = await db.collection("users").findOne({ _id: new ObjectId(post.userId) });
    if (!user) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }

    // 댓글 조회: 해당 게시글과 연관된 모든 댓글을 조회
    const comments = await db.collection("comments").find({ communityId: new ObjectId(id) }).toArray();

    // 작성자의 nickname을 포함하여 응답
    const response = {
      ...post,
      userNickname: user.nickname,
      comments, 
    };

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

    // 글을 찾기 위해 해당 글을 조회
    const post = await db.collection("community").findOne({ _id: new ObjectId(id) });

    if (!post) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    // JWT 토큰에서 가져온 userId와 글의 userId 비교
    if (post.userId.toString() !== req.user) {
      return res.status(403).json({ error: "삭제 권한이 없습니다." });
    }

    // 글에 포함된 이미지 URL을 추출 (예: content에서 이미지 URL을 추출)
    const imageUrls = extractImageUrlsFromContent(post.content); // content에서 이미지 URL을 추출하는 함수

    // S3에서 이미지 삭제
    await Promise.all(imageUrls.map(url => deleteFromS3(url)));

    // MongoDB에서 글 삭제
    const result = await db.collection("community").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
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

  // 기존 글을 찾아서 기존 이미지를 추출
  const existingPost = await db.collection("community").findOne({ _id: new ObjectId(id) });
  if (!existingPost) {
      return res.status(404).json({ error: "Story not found" });
  }
  if (existingPost.userId.toString() !== req.user) {
    return res.status(403).json({ error: "삭제 권한이 없습니다." });
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
    const userId = new ObjectId(req.user);
    const updatedContent = await replaceBase64WithUrls(content);
    
    // 글 작성 (참조 방식으로 userId만 저장)
    await db.collection("community").insertOne({
      userId,
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

// 댓글 API
app.post("/api/community/:id/comments", verifyToken, async (req, res) => {
  const communityId = req.params.id;
  const { content } = req.body;

  try {
    // 사용자 정보 조회
    const user = await db.collection("users").findOne({ _id: new ObjectId(req.user) });

    if (!user) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }

    // 댓글 저장
    const newComment = await db.collection("comments").insertOne({
      communityId: new ObjectId(communityId),
      content,
      author: user.nickname,
      createdAt: new Date(),
      authorId: new ObjectId(req.user),
    });

    // 댓글 ID를 해당 community 문서에 업데이트
    await db.collection("community").updateOne(
      { _id: new ObjectId(communityId) },
      { $push: { comments: newComment.insertedId } }
    );

    res.status(201).json({ message: "댓글이 성공적으로 추가되었습니다.", comment: newComment });
  } catch (error) {
    console.error("댓글 추가 중 오류:", error);
    res.status(500).json({ error: "댓글 추가 중 오류가 발생했습니다." });
  }
});

app.delete("/api/community/:communityId/comments/:commentId", verifyToken, async (req, res) => {
  const { communityId, commentId } = req.params;

  try {
    // 댓글을 찾는다
    const comment = await db.collection("comments").findOne({ _id: new ObjectId(commentId) });
    
    if (!comment) {
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    }

    // 댓글 작성자와 요청자가 동일한지 확인
    if (comment.authorId.toString() !== req.user) {
      return res.status(403).json({ message: "댓글을 삭제할 권한이 없습니다." });
    }

    // 댓글 삭제
    await db.collection("comments").deleteOne({ _id: new ObjectId(commentId) });

    // 해당 댓글 ID를 community 문서에서 제거
    await db.collection("community").updateOne(
      { _id: new ObjectId(communityId) },
      { $pull: { comments: new ObjectId(commentId) } }
    );

    res.status(200).json({ message: "댓글이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("댓글 삭제 중 오류:", error);
    res.status(500).json({ message: "댓글 삭제 중 오류가 발생했습니다." });
  }
});
  
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
  
      const accessToken = jwt.sign({ userId: user._id }, SECRET_KEY, {
        expiresIn: "1m",
      });
  
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
  
      res.json({ accessToken, userId:user._id , user: user.nickname, message: "로그인이 성공적으로 완료되었습니다." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "로그인 중 서버 오류가 발생했습니다." });
    }
  });

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("refreshToken", { httpOnly: true, secure: false });
  res.status(200).send("로그아웃되었습니다.");
});
  

//리프레쉬토큰 API
app.post("/api/auth/refresh-token", async (req, res) => {
  const refreshToken = req.cookies.refreshToken; // 쿠키에서 리프레시 토큰 추출
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
      userId: userFromDB._id
    });
  } catch (error) {
    console.error("리프레시 토큰 검증 실패:", error);
    res.status(403).json({ error: "유효하지 않은 리프레시 토큰입니다." });
  }
});


// 결제 등록 API
app.post('/api/payment', verifyToken, async (req, res) => {
  const { cartItems , totalPrice } = req.body;
  const userId = req.user;

  try {
    const payment = {
      userId:new ObjectId(userId),
      totalPrice,
      cartItems,
      status: '결제완료',
      createdAt: new Date(),
    };

    const result = await db.collection('payments').insertOne(payment);

    await db.collection("carts").updateOne(
      { userId: new ObjectId(userId) },
      { 
        $set: { 
          cartItems: [],
          totalPrice: 0 
        } 
      }
    );

    res.status(200).json({
      message: '결제 내역이 등록되었습니다.',
      paymentId: result.insertedId,
    });
  } catch (error) {
    console.error('결제 등록 오류:', error);
    res.status(500).json({ error: '결제 등록 중 오류가 발생했습니다.' });
  }
});

// 결제 내역 조회 API
app.get('/api/payment/history', verifyToken, async (req, res) => {
  const userId = req.user;

  try {
    // 해당 userId의 결제 내역을 조회
    const payments = await db.collection('payments').find({ userId: new ObjectId(userId) }).toArray();

    // 결제 내역이 없을 경우
    if (payments.length === 0) {
      return res.status(404).json({ message: '결제 내역이 없습니다.' });
    }

    // 결제 내역이 있을 경우 반환
    res.status(200).json({
      message: '결제 내역 조회 성공',
      payments,
    });
  } catch (error) {
    console.error('결제 내역 조회 오류:', error);
    res.status(500).json({ error: '결제 내역을 조회하는 중 오류가 발생했습니다.' });
  }
});


      
// 리액트 라우터사용
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname,"dist/index.html"))
})