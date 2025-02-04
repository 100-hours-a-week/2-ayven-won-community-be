import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export const getConnection = async () => {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log('[DEBUG] DB 연결 성공'); // ✅ DB 연결 확인
    return pool.getConnection();
  } catch (error) {
    console.error('[ERROR] DB 연결 실패:', error); // ❌ DB 연결 실패 시
    throw error;
  }
};
