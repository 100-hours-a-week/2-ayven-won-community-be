// /models/postModel.js
import { getConnection } from '../db.js'; // db.js에서 createPool()로 만든 커넥션 가져옴

async function addPost(userInput, nickname) {
  const conn = await getConnection();
  // posts 테이블에 title, content, author(닉네임) 등을 저장한다고 가정
  const sql = 'INSERT INTO posts (title, content, author, created_at) VALUES (?, ?, ?, NOW())';
  const result = await conn.query(sql, [userInput.title, userInput.content, nickname]);
  conn.release();
  return result.insertId;  // 새 게시글 번호
}

async function getPostByNo(postNo) {
  const conn = await getConnection();
  const rows = await conn.query('SELECT * FROM posts WHERE id = ?', [postNo]);
  conn.release();
  // rows[0]이 존재하면 그걸 반환, 없으면 null
  return rows.length ? rows[0] : null;
}

async function increaseHit(postNo) {
  const conn = await getConnection();
  await conn.query('UPDATE posts SET hit = hit + 1 WHERE id = ?', [postNo]);
  conn.release();
}

async function editPost(postNo, userInput) {
  const conn = await getConnection();
  await conn.query(
    'UPDATE posts SET title = ?, content = ? WHERE id = ?',
    [userInput.title, userInput.content, postNo]
  );
  conn.release();
  // 필요하다면 이전에 쓰이던 이미지 경로 등을 리턴하거나, 그냥 비워둬도 무방
  return '';
}

async function deletePost(postNo) {
  const conn = await getConnection();
  await conn.query('DELETE FROM posts WHERE id = ?', [postNo]);
  conn.release();
  return '';
}

async function updateCommentCount(postNo, commentCount) {
  const conn = await getConnection();
  await conn.query('UPDATE posts SET comment_count=? WHERE id=?', [commentCount, postNo]);
  conn.release();
}

export default {
  addPost,
  getPostByNo,
  increaseHit,
  editPost,
  deletePost,
  updateCommentCount
};
