import fs from 'fs';
import path from 'path';

const filePath = path.resolve('json', 'users.json');
const USERS_FILE = './data/users.json'; // JSON 파일 경로

// 파일에서 사용자 목록을 읽어오는 함수
const getUsers = async () => {
    try {
        const data = await fs.readFile(USERS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('사용자 데이터를 불러오는 중 오류 발생:', error);
        return [];
    }
};

// 사용자 정보 저장 함수
const saveUser = async (user) => {
    try {
        const users = await getUsers();
        users.push(user);
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
        console.log('새로운 사용자 저장 완료:', user);
    } catch (error) {
        console.error('사용자 데이터를 저장하는 중 오류 발생:', error);
    }
};


// 사용자 정보를 id로 찾는 함수
const getUserById = async (userId) => {
    try {
        const users = await getUsers();
        return users.find(user => user.id === userId);
    } catch (error) {
        console.error('Error fetching user by id:', error);
        throw error;
    }
};

// 사용자 정보 수정 함수
const editUser = async (req) => {
    try {
        const users = await getUsers();
        const userIndex = users.findIndex(user => user.id === req.body.id);
        if (userIndex === -1) throw new Error('User not found');
        
        users[userIndex] = { ...users[userIndex], ...req.body };
        await fs.promises.writeFile(filePath, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error editing user:', error);
        throw error;
    }
};

// 비밀번호 수정 함수
const editPassword = async (req) => {
    try {
        const users = await getUsers();
        const user = users.find(user => user.id === req.body.id);
        if (!user) throw new Error('User not found');

        if (user.password === req.body.oldPassword) {
            user.password = req.body.newPassword;
            await fs.promises.writeFile(filePath, JSON.stringify(users, null, 2));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error editing password:', error);
        throw error;
    }
};

// 사용자 삭제 함수
const deleteUser = async (req) => {
    try {
        const users = await getUsers();
        const userIndex = users.findIndex(user => user.id === req.body.id);
        if (userIndex === -1) throw new Error('User not found');

        const deletedUser = users.splice(userIndex, 1);
        await fs.promises.writeFile(filePath, JSON.stringify(users, null, 2));
        return deletedUser[0].profileImage; // 만약 프로필 이미지를 삭제할 경우 해당 부분 추가
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
