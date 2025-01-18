// postRouter.js
import express from 'express';
import methods from '../controllers/postController.js';
import { isLoggedIn } from '../middlewares/checkLogin.js';
import uploadTemporary from '../utils/ImageUtils.js';

const router = express.Router();

// 댓글 조회
router.get('/:no/comments', methods.showComments);

// 댓글 등록
router.post('/:no/comments', isLoggedIn, methods.addComment);

// 댓글 수정
router.patch('/:postNo/comments/:commentNo', methods.editComment);

// 댓글 삭제
router.delete('/:postNo/comments/:commentNo', methods.deleteComment);

// 게시글 등록
router.post('/', isLoggedIn, uploadTemporary.single('file'), methods.addPost);

// 게시글 데이터 조회
router.get('/:no', isLoggedIn, methods.showPost);

// 게시글 수정
router.put('/:no', methods.editPost);

// 게시글 삭제
router.delete('/:no', methods.deletePost);

export default router;
