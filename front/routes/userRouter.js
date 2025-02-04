import express from 'express';
import memberController from '../controllers/userController.js';
import imageUtils from "../utils/ImageUtils.js";

const router = express.Router();

const {uploadMembers} = imageUtils;

// 로그인 페이지
router.get('/login', memberController.showLoginForm);

// 사용자가 로그인 시도
router.post('/login', memberController.loginCheck);

// 회원가입 페이지 서빙
router.get('/join', memberController.showJoinForm);

// 사용자가 회원가입 시도
router.post('/join', uploadMembers.single('file'), memberController.join);

// 사용자 정보 수정 페이지 
router.get('/info', memberController.showEditInfoForm);

// 사용자 정보 수정
router.patch('/', uploadMembers.single('file'), memberController.editMemberImage);

// 사용자 정보 삭제
router.delete('/', memberController.deleteMember);

// 비밀번호 변경 페이지 서빙
router.get('/password', memberController.showPasswordForm);

export default router;