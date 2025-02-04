import { getConnection } from '../db.js';

/**
 * 특정 게시판에 속한 모든 게시글 조회
 */
async function getPostsByBoard(boardId) {
  const conn = await getConnection();
  const rows = await conn.query(
    'SELECT * FROM posts WHERE board_id = ? ORDER BY id DESC',
    [boardId]
  );
  conn.release();
  return rows;
}

/**
 * 게시글 상세 조회
 */
async function getPostByNo(postNo) {
  const conn = await getConnection();
  const rows = await conn.query('SELECT * FROM posts WHERE id = ?', [postNo]);
  conn.release();
  return rows.length ? rows[0] : null;
}

/**
 * 조회수 증가
 */
async function increaseHit(postNo) {
  const conn = await getConnection();
  await conn.query('UPDATE posts SET hit = hit + 1 WHERE id = ?', [postNo]);
  conn.release();
}

/**
 * 댓글 수 업데이트
 */
async function updateCommentCount(postNo, commentCount) {
  const conn = await getConnection();
  await conn.query('UPDATE posts SET comment_count = ? WHERE id = ?', [commentCount, postNo]);
  conn.release();
}

/**
 * 새 게시글 추가
 */
async function addPost(boardId, userInput, nickname, imageName = '') {
  const conn = await getConnection();
  const sql = `
    INSERT INTO posts (board_id, title, content, image, writer, reg_dt, like_count, comment_count, hit)
    VALUES (?, ?, ?, ?, ?, NOW(), 0, 0, 0)
  `;
  const { insertId } = await conn.query(sql, [
    boardId,
    userInput.title,
    userInput.content,
    imageName,
    nickname
  ]);
  conn.release();
  return insertId; // 새 게시글 번호
}

/**
 * 게시글 수정
 * @returns 수정 전 이미지 이름(prevImage)
 */
async function editPost(postNo, userInput) {
  const conn = await getConnection();

  // 1) 이전 게시글 조회
  const [oldPost] = await conn.query('SELECT image FROM posts WHERE id=?', [postNo]);
  if (!oldPost) {
    conn.release();
    throw new Error('게시글을 찾을 수 없습니다.');
  }
  const prevImage = oldPost.image;

  // 2) 수정
  await conn.query(
    'UPDATE posts SET title=?, content=?, image=?, reg_dt=NOW() WHERE id=?',
    [userInput.title, userInput.content, userInput.image, postNo]
  );
  conn.release();

  return prevImage;
}

/**
 * 게시글 삭제
 * @returns 삭제 전 이미지 이름(prevImage)
 */
async function deletePost(postNo) {
  const conn = await getConnection();

  // 삭제 전 이미지 조회
  const [oldPost] = await conn.query('SELECT image FROM posts WHERE id=?', [postNo]);
  if (!oldPost) {
    conn.release();
    throw new Error('게시글 정보를 찾을 수 없습니다.');
  }
  const prevImage = oldPost.image;

  await conn.query('DELETE FROM posts WHERE id=?', [postNo]);
  conn.release();

  return prevImage;
}

//특정 작성자의 닉네임 일괄 변경

async function changeNickname(prevNickname, newNickname) {
  const conn = await getConnection();
  await conn.query('UPDATE posts SET writer=? WHERE writer=?', [newNickname, prevNickname]);
  conn.release();
}

export default {
  getPostsByBoard,
  getPostByNo,
  increaseHit,
  updateCommentCount,
  addPost,
  editPost,
  deletePost,
  changeNickname
};
