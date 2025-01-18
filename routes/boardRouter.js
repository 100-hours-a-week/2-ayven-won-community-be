import express from 'express';
import boardController from '../controllers/boardController.js';
import { isLoggedIn } from '../middlewares/checkLogin.js';

const router = express.Router();

// boardController에서 필요한 메서드 가져오기
const { showBoard } = boardController;

router.get('/', isLoggedIn, showBoard);

export default router;
