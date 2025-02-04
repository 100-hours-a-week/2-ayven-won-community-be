import { getConnection } from '../db.js';
import bcrypt from 'bcrypt';

// 모든 사용자 조회
async function getUsers() {
    const conn = await getConnection();
    try {
      const [rows] = await conn.query('SELECT * FROM users'); 
      console.log('[DEBUG] Fetched Users:', rows); // 디버깅 추가
      return rows;
    } catch (error) {
      console.error('[ERROR] DB Query Error:', error); //  쿼리 오류 확인
      return []; // 오류 발생 시 빈 배열 반환
    } finally {
      conn.release();
    }
  }
  

// 새 사용자 저장
async function saveUser(user) {
  const conn = await getConnection();
  await conn.query(
    'INSERT INTO users (email, password, nickname, image) VALUES (?, ?, ?, ?)',
    [user.email, user.password, user.nickname, user.profileImage || 'default-profile.png']
  );
  conn.release();
}

// ID로 사용자 조회
async function getUserById(userId) {
  const conn = await getConnection();
  const [rows] = await conn.query('SELECT * FROM users WHERE id = ?', [userId]);
  conn.release();
  return rows.length ? rows[0] : null;
}

// 사용자 정보 수정
async function editUser(req) {
  const { id, email, nickname, profileImage } = req.body;
  const conn = await getConnection();

  await conn.query(
    `UPDATE users
     SET email = ?, nickname = ?, image = ?
     WHERE id = ?`,
    [email, nickname, profileImage, id]
  );

  conn.release();
}

// 비밀번호 수정
async function editPassword(req) {
  const { id, oldPassword, newPassword } = req.body;
  const conn = await getConnection();

  const [users] = await conn.query('SELECT * FROM users WHERE id = ?', [id]);
  const user = users[0];

  if (!user) {
    conn.release();
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (isPasswordValid) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await conn.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
    conn.release();
    return true;
  } else {
    conn.release();
    return false;
  }
}

// 사용자 삭제
async function deleteUser(req) {
  const { id } = req.body;
  const conn = await getConnection();

  const [users] = await conn.query('SELECT image FROM users WHERE id = ?', [id]);
  const user = users[0];

  if (!user) {
    conn.release();
    throw new Error('User not found');
  }

  await conn.query('DELETE FROM users WHERE id = ?', [id]);
  conn.release();

  return user.image;
}

export default {
  getUsers,
  saveUser,
  getUserById,
  editUser,
  editPassword,
  deleteUser
};
