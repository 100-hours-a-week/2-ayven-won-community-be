import express from 'express';
import userController from "../controllers/userController.js";
import { isAuthenticated, hasRole } from "../middlewares/authMiddleware.js";

// 비동기 에러 핸들러
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const router = express.Router();

// 사용자 정보 조회
router.get('/', asyncHandler(async (req, res) => {
    console.log('[DEBUG] Request to GET /');
    await userController.findUserById(req, res);
}));

// 로그인
router.post('/login', asyncHandler(async (req, res) => {
    console.log('[DEBUG] Request to POST /login');
    console.log('[DEBUG] Request Body:', req.body);
    
    console.log('[DEBUG] CSRF Token Header:', req.headers['csrf-token']);
    console.log('[DEBUG] CSRF Cookie:', req.cookies._csrf);
    await userController.loginCheck(req, res);
}));

// 회원가입
router.post('/join', asyncHandler(async (req, res) => {
    console.log('[DEBUG] Request to POST /join');
    console.log('[DEBUG] Request Body:', req.body);
    console.log('[DEBUG] Uploaded File:', req.file);
    console.log('[DEBUG] CSRF Token Header:', req.headers['csrf-token']);
    console.log('[DEBUG] CSRF Cookie:', req.cookies._csrf);
    await userController.join(req, res);
}));

// 회원정보 수정
router.put('/', isAuthenticated, asyncHandler(async (req, res) => {
    console.log('[DEBUG] Request to PUT /');
    await userController.editUser(req, res);
}));

// 회원 탈퇴
router.delete('/', isAuthenticated, asyncHandler(async (req, res) => {
    console.log('[DEBUG] Request to DELETE /');
    await userController.deleteUser(req, res);
}));

// 프로필 정보 확인
router.get('/profile', isAuthenticated, (req, res) => {
    console.log('[DEBUG] Request to GET /profile');
    res.status(200).json({
        message: '인증 성공!',
        user: req.session.user,
    });
});

// 관리자 권한 확인
router.get('/admin', isAuthenticated, hasRole('admin'), (req, res) => {
    console.log('[DEBUG] Request to GET /admin');
    res.status(200).json({
        message: '관리자 권한으로 접근 성공!',
    });
});

export default router;
