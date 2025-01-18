import fs from 'fs/promises'; // 최신 Node.js 모듈 사용
import path from 'path';

const USERS_FILE = path.resolve('json/users.json'); // JSON 파일 경로

// 사용자 목록 읽기
const getUsers = async () => {
    try {
        const data = await fs.readFile(USERS_FILE, 'utf-8');
        console.log('[DEBUG] Raw JSON Data:', data);
        const parsedData = JSON.parse(data);
        console.log('[DEBUG] Parsed Data:', parsedData);
        return parsedData;
    } catch (error) {
        console.error('[ERROR] 사용자 데이터를 불러오는 중 오류 발생:', error);
        throw error;
    }
};


// 사용자 저장
const saveUser = async (user) => {
    try {
        const users = await getUsers();
        users.push(user);
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
        console.log('[INFO] 새로운 사용자 저장:', user);
    } catch (error) {
        console.error('사용자 데이터를 저장하는 중 오류 발생:', error);
    }
};

// ID로 사용자 조회
const getUserById = async (userId) => {
    try {
        const users = await getUsers();
        const user = users.find(user => user.id === Number(userId)); // 숫자 비교
        console.log('[DEBUG] getUserById - 찾은 사용자:', user);
        return user;
    } catch (error) {
        console.error('Error fetching user by id:', error);
        throw error;
    }
};

// 사용자 정보 수정
const editUser = async (req) => {
    try {
        const users = await getUsers();
        const userIndex = users.findIndex(user => user.id === req.body.id);
        if (userIndex === -1) throw new Error('User not found');

        users[userIndex] = { ...users[userIndex], ...req.body };
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error editing user:', error);
        throw error;
    }
};

// 비밀번호 수정
const editPassword = async (req) => {
    try {
        const users = await getUsers();
        const user = users.find(user => user.id === req.body.id);
        if (!user) throw new Error('User not found');

        if (user.password === req.body.oldPassword) {
            user.password = req.body.newPassword;
            await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error editing password:', error);
        throw error;
    }
};

// 사용자 삭제
const deleteUser = async (req) => {
    try {
        const users = await getUsers();
        const userIndex = users.findIndex(user => user.id === req.body.id);
        if (userIndex === -1) throw new Error('User not found');

        const deletedUser = users.splice(userIndex, 1);
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
        return deletedUser[0].profileImage; // 삭제된 사용자 이미지 반환
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

export default {
    getUsers,
    saveUser,
    getUserById,
    editUser,
    editPassword,
    deleteUser
};
