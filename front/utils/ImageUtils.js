import path, {dirname} from "path";
import fs from "fs";
import {fileURLToPath} from "url";
import multer from 'multer'; // multipart/form-data 처리용 body-parser

const __filename = fileURLToPath(import.meta.url);
// path.resolve -> __dirname이 route의 하위 경로이므로, route의 상위 디렉토리로 이동해야 public에 접근 가능
const __dirname = path.resolve(dirname(__filename), '..');

// 어디에 저장할 것인지 구분 -> posts 디렉토리에 저장할 파일들
const createStorage = (folder) => multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, `public/images/${folder}`));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

// 어디에 저장할 것인지 구분
const postsStorage = createStorage('posts');
const membersStorage = createStorage('users');

// 이미지 파일만 받을 수 있도록 filter 구성
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }

    cb("Error: File upload only supports the following filetypes - " + filetypes);
}

// posts 이미지 처리용 body-parser
const uploadPosts = multer({storage: postsStorage, fileFilter});
// members 이미지 처리용 body-parser
const uploadMembers = multer({storage: membersStorage, fileFilter});

const deleteImage = (dir, filename) => {
    const filePath = path.join(__dirname, `public/images/${dir}`, filename);
    fs.unlink(filePath, err => {
        if (err) {
            console.error(`Cannot delete file: ${err}`);
        }
    });
};

export default {
    deleteImage,
    uploadPosts,
    uploadMembers
};