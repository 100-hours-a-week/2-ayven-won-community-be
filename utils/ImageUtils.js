import path from 'path';
import multer from 'multer';

// 업로드된 파일의 타입을 검사
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;

    // 업로드된 파일의 MIME 타입이 지원하는 타입인지 확인
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    // MIME 타입과 확장자가 모두 지원되는 경우
    if (mimetype && extname) {
        return cb(null, true);
    }

    // MIME 타입 또는 확장자가 지원되지 않는 경우
    cb(new Error("Error: File upload only supports the following filetypes - " + filetypes));
};

// 이미지 파일을 메모리 내 임시 저장소에 저장하도록 설정
const uploadTemporary = multer({
    storage: multer.memoryStorage(),
    fileFilter
});

export default uploadTemporary;
