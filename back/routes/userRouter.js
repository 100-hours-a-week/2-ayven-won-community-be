import express from 'express';
import userController from "../controllers/userController.js";

const router = express.Router();

router.get('/', userController.findUserById);
router.post('/login', userController.loginCheck);
router.post('/join', userController.join);
router.get('/duplication', userController.checkDuplication);
router.put('/', userController.editUser);
router.delete('/', userController.deleteUser);
router.patch('/password', userController.editPassword);

export default router;
