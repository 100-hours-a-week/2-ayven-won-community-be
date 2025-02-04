import express from 'express';
import cors from 'cors';

import userRouter from './routes/userRouter.js';
import boardRouter from './routes/boardRouter.js';
import postRouter from './routes/postRouter.js';

const server = express();
const port = 4000;

// CORS 설정
server.use(cors({
    origin: 'http://localhost:3000', // 프론트엔드 주소
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'], 
    credentials: true // 쿠키를 사용하려면 true
}));

// JSON 요청 파싱
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

// 라우터 경로 설정
server.use('/json/users', userRouter);   // 사용자 관련 라우터
server.use('/json/board', boardRouter);  // 게시판 관련 라우터
server.use('/json/posts', postRouter);   // 게시글 관련 라우터

// 서버 실행
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
