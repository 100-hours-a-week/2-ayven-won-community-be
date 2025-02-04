import fetch from 'node-fetch';//서버 간 HTTP 요청을 보낼 때
import path, {dirname} from 'path';//파일 경로를 조작하여 필요한 HTML 파일을 찾거나 사용
import {fileURLToPath} from "url";
import imageUtils from "../utils/ImageUtils.js";//이미지를 처리하는 유틸리티

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(dirname(__filename), '..');
const HTML_PATH = path.join(__dirname, 'public/html');

const methods = {
    showLoginForm(req, res) {
        res.sendFile(path.join(HTML_PATH, 'login.html'));
    },
    async loginCheck(req, res) {
        try {
            const response = await fetch('http://localhost:4000/json/users/login', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req.body)
            });

            const result = await response.json();
            if (response.ok) {
                res.status(200).json({
                    id: result.userId
                });
            } else {
                res.sendStatus(401);
            }
        } catch (error) {
            res.sendStatus(500);
        }
    },
    showJoinForm(req, res) {
        res.sendFile(path.join(HTML_PATH, 'join.html'));
    },
    async join(req, res) {
        const newUser = {
            ...req.body,
            image: req.file.filename
        }

        const response = await fetch('http://localhost:4000/json/users/join', {
            method: 'POST',
            body: JSON.stringify(newUser),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status !== 201) {
            imageUtils.deleteImage('users', req.file.filename);
        }

        response.json().then(data => {
            res.status(response.status).json(data);
        });
    },
    showEditInfoForm(req, res) {
        res.sendFile(path.join(HTML_PATH, 'edit_member.html'));
    },
    async editMemberImage(req, res) {
        try {
            imageUtils.deleteImage('users', req.body.prevImageName);
            res.status(200).json({imageName: req.file.filename});
        } catch (error) {
            res.status(500).json({message: '이미지 삭제에 실패했습니다.'});
        }
    },
    async deleteMember(req, res) {
        try {
            imageUtils.deleteImage('users', req.query.image);
            res.status(200).json({})
        } catch (error) {
            res.status(500).json({message: '이미지 삭제에 실패했습니다.'});
        }
    },
    showPasswordForm(req, res) {
        res.sendFile(path.join(HTML_PATH, 'edit_password.html'));
    }
}

export default methods;