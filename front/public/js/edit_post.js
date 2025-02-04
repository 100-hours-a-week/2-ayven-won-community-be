// 헤더
// 뒤로 가기 버튼
// path variable에서 파싱한 게시글의 번호
const path = window.location.pathname;
const no = path.split('/')[2];
const id = new URLSearchParams(window.location.search).get('id');

document.querySelector('.back').addEventListener('click', () => {
    window.location.href = `/posts/${no}`;
});

// 게시글의 데이터를 백엔드 서버에 요청
const title = document.querySelector('#title');
const content = document.querySelector('#content');
document.addEventListener('DOMContentLoaded', () => {
    fetch(`http://localhost:4000/json/posts/${no}`, {
        credentials: 'include',
    })
        .then(response => {
            if (response.status === 401) { // 회원정보가 없으면 로그인 화면으로
                window.location.href = '/login';
            }

            return response.json()
        })
        .then(post => {
            title.value = post.title;
            content.value = post.content;
        });
});

// 제목과 본문이 공백이 아닌지 검사
function isValidToSubmit() {
    const button = document.querySelector('.submit button');
    const helper = document.querySelector('.helper');

    if (title.value.trim() === '' || content.value.trim() === '') {
        helper.style.visibility = 'visible';
        button.style.backgroundColor = '#aca0eb';
        return false;
    } else {
        helper.style.visibility = 'hidden';
        button.style.backgroundColor = '#7f6aee';
        return true;
    }
}

const elements = [title, content];
elements.forEach(element => {
    element.addEventListener('change', () => {
        isValidToSubmit();
    });
});

const image = document.querySelector('#image');
document.querySelector('.submit button').addEventListener('click', (e) => {
    if (isValidToSubmit()) {
        const formData = new FormData();
        formData.append('file', image.files[0]);
        formData.append('title', title.value);
        formData.append('content', content.value);

        fetch(`http://localhost:4000/json/posts/${no}`, {
            method: 'PUT',
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    alert('게시글을 성공적으로 수정하였습니다.');
                    window.location.href = `/posts/${no}`
                } else {
                    alert('게시글 수정에 실패하였습니다. 잠시 후 다시 시도해주세요.');
                }
            });
    }
});