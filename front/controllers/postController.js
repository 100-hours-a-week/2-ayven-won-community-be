import {fileURLToPath} from "url";
import path, {dirname} from "path";
import imageUtils from "../utils/ImageUtils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(dirname(__filename), '..');
const HTML_PATH = path.join(__dirname, 'public/html');

const methods = {
    showPost(req, res) {
        res.sendFile(path.join(HTML_PATH, 'post.html'));
    },
    showAddForm(req, res) {
        res.sendFile(path.join(HTML_PATH, 'add_post.html'));
    },
    showEditForm(req, res) {
        res.sendFile(path.join(HTML_PATH, 'edit_post.html'));
    },
    async savePostImage(req, res) {
        res.status(200).json({imageName: req.file.filename});
    },
    async editPost(req, res) {
        const postNo = Number(req.params.no);
        const response = await fetch(`http://localhost:4000/json/posts/${postNo}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...req.body,
                image: req.file === undefined ? "" : req.file.filename
            })
        });
        const json = await response.json();
        if (response.ok) {
            if (json.prevImage !== '') {
                imageUtils.deleteImage('posts', json.prevImage);
            }
            res.status(200).json(json);
        } else {
            res.status(response.status).json({message: json.message});
        }
    },
    async deletePost(req, res) {
        const postNo = Number(req.params.no);
        const response = await fetch(`http://localhost:4000/json/posts/${postNo}`, {
            method: 'DELETE'
        });
        const json = await response.json();
        if (response.ok) {
            imageUtils.deleteImage('posts', json.prevImage);
            res.status(200).json(json);
        } else {
            res.status(response.status).json({message: json.message});
        }
    },
}

export default methods;