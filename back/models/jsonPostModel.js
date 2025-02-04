import fs from 'fs';
import path from 'path';
import { getCurrentTime } from '../utils/dataUtils.js';
import { fileURLToPath } from 'url'; 

// __dirname 대체 정의
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// JSON 파일 경로
const JSON_FILE = path.join(__dirname, "..", 'json/board.json');

// JSON 파일을 읽고 파싱된 데이터를 반환
const getBoardJson = async () => {
    const file = await fs.promises.readFile(JSON_FILE, 'utf8');
    return JSON.parse(file);
};

// 모든 게시글 가져오기
const getBoard = async () => {
    return getBoardJson()
        .then(json => json.posts);
};

// 현재 시퀀스 값 가져오기
const getSequence = async () => {
    return getBoardJson()
        .then(json => json.sequence);
};

// 게시글 번호로 특정 게시글 찾기
let board; // 다른 함수에서 재사용할 보드 데이터 저장
const getPostByNo = async (postNo) => {
    board = await getBoard();
    return board.find(post => post.no === postNo);
};

// 특정 게시글의 조회수 증가
const increaseHit = async (postNo) => {
    const post = await getPostByNo(postNo);
    post.hit += 1;
    await fs.promises.writeFile(JSON_FILE, JSON.stringify({sequence: await getSequence(), posts: board}, null, 2));
};

// 특정 게시글의 댓글 수 업데이트
const updateCommentCount = async (postNo, commentCount) => {
    const post = await getPostByNo(postNo);

    post.comment = commentCount;
    await fs.promises.writeFile(JSON_FILE, JSON.stringify({sequence: await getSequence(), posts: board}, null, 2));
};

// 새로운 게시글 추가하고 시퀀스 번호 반환
const addPost = async (userInput, imageName, nickname) => {
    const board = await getBoard();
    const sequence = await getSequence();

    const newPost = {
        no: sequence,
        title: userInput.title,
        content: userInput.content,
        image: imageName,
        writer: nickname,
        regDt: getCurrentTime(),
        like: 0,
        comment: 0,
        hit: 0,
    };
    board.unshift(newPost);

    await fs.promises.writeFile(JSON_FILE, JSON.stringify({sequence: sequence + 1, posts: board}, null, 2));
    return sequence;
};

// 게시글 수정하고 이전 이미지 이름 반환
const editPost = async (postNo, userInput) => {
    const post = await getPostByNo(postNo);

    const prevImage = post.image; // 업데이트 전에 현재 이미지 이름 저장

    post.title = userInput.title;
    post.content = userInput.content;
    post.image = userInput.image;
    post.regDt = getCurrentTime();

    const json = JSON.stringify({sequence: await getSequence(), posts: board}, null, 2);
    await fs.promises.writeFile(JSON_FILE, json);

    return prevImage;
};

// 게시글 번호로 게시글 삭제하고 이전 이미지 이름 반환
const deletePost = async (postNo) => {
    const board = await getBoard();

    const index = board.findIndex(post => post.no === postNo);
    const prevImage = board[index].image;
    if (index !== -1) {
        board.splice(index, 1);
    } else {
        throw new Error('게시글 정보를 찾을 수 없습니다.');
    }

    await fs.promises.writeFile(JSON_FILE, JSON.stringify({sequence: await getSequence(), posts: board}, null, 2));
    return prevImage;
};

// 모든 게시글에서 작성자의 닉네임 변경
const changeNickname = async (prevNickname, newNickname) => {
    const board = await getBoard();
    board.forEach(post => {
        if (post.writer === prevNickname) {
            post.writer = newNickname;
        }
    });

    await fs.promises.writeFile(JSON_FILE, JSON.stringify({sequence: await getSequence(), posts: board}, null, 2));
};

export default {
    getBoard,
    getPostByNo,
    increaseHit,
    updateCommentCount,
    addPost,
    editPost,
    deletePost,
    changeNickname,
};
