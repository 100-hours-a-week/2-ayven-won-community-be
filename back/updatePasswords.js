import bcrypt from 'bcrypt';
import { getConnection } from './db.js';

async function updatePasswords() {
    const conn = await getConnection();
    
    const users = [
        { email: 'qwe0@gmail.com', password: 'qweQWE123!' },
        { email: 'qwe1@gmail.com', password: 'qweQWE123!' },
        { email: 'qwe2@gmail.com', password: 'qweQWE123!' },
        { email: 'qwe3@gmail.com', password: 'qweQWE123!' }
    ];

    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await conn.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, user.email]);
        console.log(`[DEBUG] 비밀번호 업데이트 완료: ${user.email}`);
    }

    conn.release();
    console.log('✅ 모든 비밀번호가 성공적으로 업데이트되었습니다.');
}

updatePasswords().catch(console.error);
