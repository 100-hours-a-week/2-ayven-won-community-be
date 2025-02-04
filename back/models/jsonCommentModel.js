import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getCurrentTime } from '../utils/dataUtils.js';

// __dirname 대체 정의
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 댓글 데이터를 저장한 JSON 파일 경로
const JSON_PATH = path.join(__dirname, "..", "json/comment.json");

// JSON 파일을 읽어들여 파싱된 데이터를 반환
const getCommentJson = async () => {
    try {
        const file = await fs.promises.readFile(JSON_PATH, 'utf8');
        return JSON.parse(file);
    } catch (error) {
        throw new Error('댓글 JSON 파일을 읽는 중 오류가 발생했습니다.');
    }
};

// 특정 게시글 번호에 해당하는 댓글을 찾아 반환
const findCommentsByPostNo = async (postNo) => {
    const json = await getCommentJson();
    return json[postNo];
};

// 새로운 게시글이 등록되면 새로운 댓글 객체를 생성하고 JSON 파일에 추가
const makeCommentObject = async (postNo) => {
    const json = await getCommentJson();
    json[postNo] = {
        sequence: 1,
        comments: []
    };
    await fs.promises.writeFile(JSON_PATH, JSON.stringify(json, null, 2));
};

// 특정 게시글 번호에 해당하는 댓글 객체를 JSON 파일에서 삭제
const deleteCommentObject = async (postNo) => {
    const json = await getCommentJson();
    delete json[postNo];
    await fs.promises.writeFile(JSON_PATH, JSON.stringify(json, null, 2));
};

// 댓글을 저장하고 저장된 댓글 수를 반환
const saveComment = async (postNo, member, content) => {
    const json = await getCommentJson();
    const findComments = json[postNo];

    if (!findComments) {
        throw new Error('해당 게시글의 댓글을 찾을 수 없습니다.');
    }

    const newComment = {
        no: findComments.sequence,
        content: content,
        writer: member.nickname,
        regDt: getCurrentTime()
    };

    findComments.sequence++;
    findComments.comments.push(newComment);

    await fs.promises.writeFile(JSON_PATH, JSON.stringify(json, null, 2));
    return findComments.comments.length;
};

// 댓글을 수정하고 수정 후의 내용을 JSON 파일에 저장
const editComment = async (postNo, commentNo, newContent) => {
    const json = await getCommentJson();
    const findComments = json[postNo];

    if (!findComments) {
        throw new Error('해당 게시글의 댓글을 찾을 수 없습니다.');
    }

    const comment = findComments.comments.find(comment => comment.no === commentNo);
    if (comment) {
        comment.content = newContent;
        await fs.promises.writeFile(JSON_PATH, JSON.stringify(json, null, 2));
    } else {
        throw new Error('댓글 정보를 찾을 수 없습니다.');
    }
};

// 특정 게시글 번호와 댓글 번호에 해당하는 댓글을 삭제하고 삭제 후 댓글 수를 반환
const deleteComment = async (postNo, commentNo) => {
    const json = await getCommentJson();
    const findComments = json[postNo];

    if (!findComments) {
        throw new Error('해당 게시글의 댓글을 찾을 수 없습니다.');
    }

    const index = findComments.comments.findIndex(comment => comment.no === commentNo);
    if (index !== -1) {
        findComments.comments.splice(index, 1);
        await fs.promises.writeFile(JSON_PATH, JSON.stringify(json, null, 2));
        return findComments.comments.length;
    } else {
        throw new Error('댓글 정보를 찾을 수 없습니다.');
    }
};

// 댓글 작성자의 닉네임을 변경
const changeNickname = async (prevNickname, newNickname) => {
    const json = await getCommentJson();

    Object.keys(json).forEach(postNo => {
        json[postNo].comments.forEach(comment => {
            if (comment.writer === prevNickname) {
                comment.writer = newNickname;
            }
        });
    });

    await fs.promises.writeFile(JSON_PATH, JSON.stringify(json, null, 2));
};

export default {
    findCommentsByPostNo,
    makeCommentObject,
    deleteCommentObject,
    saveComment,
    editComment,
    deleteComment,
    changeNickname,
};
