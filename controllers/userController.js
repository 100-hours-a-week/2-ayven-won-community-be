import bcrypt from 'bcrypt';
import jsonUserModel from '../models/jsonUserModel.js';

const loginCheck = async (req, res) => {
    const { email, password } = req.body;
    console.log('[DEBUG] Email:', email);
    console.log('[DEBUG] Password:', password);
    try {
        const data = await jsonUserModel.getUsers();
        const users = data.users;

        // 디버깅 로그
        console.log('[DEBUG] Users:', users);

        const user = users.find(user => user.email === email);
        if (!user) {
            console.log('[DEBUG] User not found');
            return res.status(401).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
        }

        const isPasswordValid = user.password === password; // 비밀번호 확인
        if (!isPasswordValid) {
            console.log('[DEBUG] Password mismatch');
            return res.status(401).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
        }

        req.session.user = { id: user.id, email: user.email, nickname: user.nickname };
        console.log('[DEBUG] Session:', req.session);

        res.status(200).json({ user: req.session.user });
    } catch (error) {
        console.error('[ERROR] 로그인 처리 중 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

const join = async (req, res) => {
    try {
        console.log('[DEBUG] Request Body:', req.body);
        console.log('[DEBUG] Uploaded File:', req.file);

        const { email, password, nickname } = req.body;
        if (!email || !password || !nickname) {
            console.log('[ERROR] 필수 필드 누락');
            return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
        }

        const { users, sequence } = await jsonUserModel.getUsers();
        if (!Array.isArray(users)) {
            throw new Error('Users 데이터가 배열이 아닙니다.');
        }

        const isEmailExist = users.some(user => user.email === email);
        const isNicknameExist = users.some(user => user.nickname === nickname);

        if (isEmailExist) {
            console.log('[ERROR] 중복된 이메일:', email);
            return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
        }
        if (isNicknameExist) {
            console.log('[ERROR] 중복된 닉네임:', nickname);
            return res.status(409).json({ message: '이미 존재하는 닉네임입니다.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: sequence,
            email,
            password: hashedPassword,
            nickname,
            role: 'user',
            profileImage: req.file ? req.file.filename : 'default-profile.png',
        };

        console.log('[DEBUG] New User:', newUser);

        await jsonUserModel.saveUser(newUser);
        res.status(201).json({ message: '회원가입 성공!' });
    } catch (error) {
        console.error('[ERROR] 회원가입 처리 중 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

export default {
    loginCheck,
    join,
};
