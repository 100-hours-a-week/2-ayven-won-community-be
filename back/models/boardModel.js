import { getConnection } from '../db.js';

/**
 * 모든 게시판 조회
 */
async function getAllBoards() {
  const conn = await getConnection();
  const rows = await conn.query('SELECT * FROM boards ORDER BY id DESC');
  conn.release();
  return rows;
}

/**
 * 특정 게시판 정보 조회
 */
async function getBoardById(boardId) {
  const conn = await getConnection();
  const rows = await conn.query('SELECT * FROM boards WHERE id = ?', [boardId]);
  conn.release();
  return rows.length ? rows[0] : null;
}

/**
 * 새 게시판 생성
 * @param {object} boardData { board_name, description }
 */
async function createBoard(boardData) {
  const conn = await getConnection();
  const sql = `
    INSERT INTO boards (board_name, description)
    VALUES (?, ?)
  `;
  const { insertId } = await conn.query(sql, [boardData.board_name, boardData.description || '']);
  conn.release();
  return insertId; // 새로 생성된 board id
}

/**
 * 게시판 정보 수정
 * @param {number} boardId
 * @param {object} boardData { board_name, description }
 */
async function updateBoard(boardId, boardData) {
  const conn = await getConnection();
  await conn.query(
    'UPDATE boards SET board_name = ?, description = ? WHERE id = ?',
    [boardData.board_name, boardData.description, boardId]
  );
  conn.release();
}

/**
 * 게시판 삭제
 */
async function deleteBoard(boardId) {
  const conn = await getConnection();
  await conn.query('DELETE FROM boards WHERE id = ?', [boardId]);
  conn.release();
}

export default {
  getAllBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard
};
