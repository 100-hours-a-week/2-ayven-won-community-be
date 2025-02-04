import express from 'express';
import cors from 'cors';
import multer from 'multer';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

import userRouter from './routes/userRouter.js';
import boardRouter from './routes/boardRouter.js';
import postRouter from './routes/postRouter.js';
import { getConnection } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();
const port = 4000;

// Helmet 보안 헤더
server.use(helmet());

// 추가 보안 헤더 설정
server.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://trustedscripts.example.com"],
            styleSrc: ["'self'", "https://trustedstyles.example.com"],
            imgSrc: ["'self'", "data:"],
        },
    })
);
server.use(
    helmet.hsts({
        maxAge: 60 * 60 * 24 * 365,
        includeSubDomains: true,
    })
);
server.use(helmet.frameguard({ action: 'deny' }));
server.use(helmet.referrerPolicy({ policy: 'no-referrer' }));

// 세션 설정
server.use(
    session({
        secret: 'your_secret_key',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false, // HTTPS 사용 시 true로 설정
            httpOnly: true,
        },
    })
);

// CORS 설정
server.use(
    cors({
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
        credentials: true,
    })
);

// 쿠키 파서
server.use(cookieParser());

// JSON 요청 파싱
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

//정적 파일 서빙
server.use(express.static(path.join(__dirname, '../front/public')));

// CSRF 보호 미들웨어 설정
const csrfProtection = csrf({ cookie: true });
server.use(csrfProtection);

// CSRF 토큰 제공 경로 추가
server.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// multer 설정 - 파일 업로드
const upload = multer({ dest: 'uploads/' });

// 파일 업로드 라우터 연결
server.post('/users/image', upload.single('file'), (req, res) => {
    console.log('[DEBUG] Request Body:', req.body);
    console.log('[DEBUG] Uploaded File:', req.file);

    if (req.file) {
        res.status(200).json({ message: '파일 업로드 성공', filename: req.file.filename });
    } else {
        res.status(400).json({ message: '파일 업로드 실패' });
    }
});

// 라우터 경로 설정
server.use('/users', userRouter);
server.use('/board', boardRouter);
server.use('/posts', postRouter);

// 디버깅 로그 미들웨어
server.use((req, res, next) => {
    console.log('[DEBUG] CSRF Header:', req.headers['csrf-token']);
    console.log('[DEBUG] CSRF Cookie:', req.cookies._csrf);
    next();
});

// MySQL 연결 테스트 라우터 추가
server.get('/test-db', async (req, res) => {
    try {
        const conn = await getConnection();
        const [rows] = await conn.query('SELECT 1 + 1 AS result');
        conn.release();
        res.json({ message: 'MySQL 연결 성공!', result: rows[0].result });
    } catch (error) {
        console.error('DB 연결 오류:', error);
        res.status(500).json({ message: 'MySQL 연결 실패', error: error.message });
    }
});

// 서버 실행
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
