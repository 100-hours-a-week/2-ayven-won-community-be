import jsonUserModel from '../models/jsonUserModel.js';

const loginCheck = async (req, res) => {
    const userInput = req.body;
    const users = await jsonUserModel.getUsers();  

    const user = users.find(user =>
        user.email === userInput.email && user.password === userInput.password);

    if (user) {
        res.status(200).json({
            message: 'Login successful',
            userId: user.id
        });
    } else {
        res.status(401).json({
            message: 'Login Fail'
        });
    }
};

const join = async (req, res) => {
    try {
        const { email, password, nickname } = req.body;

        // 유효성 검사
        if (!email || !password || !nickname) {
            return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
        }

        // 기존 사용자 데이터 가져오기
        const users = await jsonUserModel.getUsers();

        // 중복 검사
        const isEmailExist = users.some(user => user.email === email);
        const isNicknameExist = users.some(user => user.nickname === nickname);

        if (isEmailExist) {
            return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
        }
        if (isNicknameExist) {
            return res.status(409).json({ message: '이미 존재하는 닉네임입니다.' });
        }

        // 새로운 사용자 저장
        const newUser = { email, password, nickname, id: users.length + 1 };
        await jsonUserModel.saveUser(newUser);

        res.status(201).json({ message: '회원가입 성공!' });
    } catch (error) {
        console.error('회원가입 처리 중 오류 발생:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

const findUserById = async (req, res) => {
    const userId = req.query.id;
    const user = await userModel.getUserById(userId);  // userModel에서 데이터 조회

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({
            message: 'User not found'
        });
    }
};

const checkDuplication = async (req, res) => {
    const userNickname = req.query.nickname;
    const users = await userModel.getUsers();
    const isNicknameExist = users.some(user => user.nickname === userNickname);

    if (isNicknameExist) {
        res.status(409).json({message: '이미 존재하는 닉네임입니다.'});
    } else {
        res.status(200).json({message: '사용 가능한 닉네임입니다.'});
    }
};

const editUser = async (req, res) => {
    try {
        await userModel.editUser(req);
    } catch (error) {
        res.status(500).json({message: '회원정보 수정에 실패했습니다. 잠시 후 다시 시도해주세요.'});
    }
    res.status(200).json({message: '회원정보 수정이 성공적으로 완료되었습니다.'});
};

const deleteUser = async (req, res) => {
    let prevImage;
    try {
        prevImage = await userModel.deleteUser(req);
    } catch (error) {
        res.status(500).json({message: '탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.'});
    }
    res.status(200).json({
        prevImage: prevImage,
        message: '회원 탈퇴를 완료했습니다. 이용해주셔서 감사합니다.'
    });
};

const editPassword = async (req, res) => {
    try {
        const result = await userModel.editUser(req);
        if (!result) {
            res.status(409).json({message: '기존 비밀번호와 동일한 비밀번호로는 변경할 수 없습니다.'});
            return;
        }
    } catch (error) {
        res.status(500).json({message: '비밀번호 수정에 실패했습니다. 잠시 후 다시 시도해주세요.'});
    }
    res.status(200).json({message: '비밀번호 수정이 성공적으로 완료되었습니다.'});
};

export default {
    loginCheck,
    join,
    findUserById,
    checkDuplication,
    editUser,
    deleteUser,
    editPassword
};
