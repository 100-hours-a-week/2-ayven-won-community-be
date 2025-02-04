import { config } from 'dotenv';
import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import memberRouter from './routes/userRouter.js';
import postRouter from './routes/postRouter.js';

config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 정적 파일 서빙 경로
const PUBLIC_PATH = path.join(__dirname, 'public');
const HTML_PATH = path.join(PUBLIC_PATH, 'html');

// express.static을 통해 정적 파일 서빙
app.use(express.static(PUBLIC_PATH));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// 초기 접속 -> 로그인 페이지
app.get('/', (req, res) => {
    res.redirect('/login');
});

// 로그인 페이지
app.get('/login', (req, res) => {
    res.sendFile(path.join(HTML_PATH, 'login.html'));
}); 
// 로그인 페이지css

app.get('/css/login.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname, 'public', 'css', 'login.css'));
  });

// '/join' 경로 처리 (회원가입 페이지)
app.get('/join', (req, res) => {
    res.sendFile(path.join(HTML_PATH, 'join.html')); 
});

// 회원과 관련된 모든 요청을 관리
app.use('/users', memberRouter);

// 게시판 페이지
app.get('/board', (req, res) => {
    res.sendFile(path.join(HTML_PATH, 'board.html'));
}); 

// 게시글수정 페이지
app.get('/edit_post', (req, res) => {
    res.sendFile(path.join(HTML_PATH, 'edit_post.html'));
}); 

// 비밀번호수정 페이지
app.get('/edit_password', (req, res) => {
    res.sendFile(path.join(HTML_PATH, 'edit_password.html'));
}); 


// 사용자 수정 페이지
app.get('/edit_member', (req, res) => {
    res.sendFile(path.join(HTML_PATH, 'edit_member.html'));
}); 

// 게시글 페이지
app.get('/post', (req, res) => {
    res.sendFile(path.join(HTML_PATH, 'post.html'));
}); 

// 게시글과 관련된 모든 요청을 관리
app.use('/posts', postRouter);

// 이미지
app.use('/image', express.static(path.join(__dirname, '../image')));


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
