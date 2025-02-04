// path variable에서 파싱한 게시글의 번호
const path = window.location.pathname;
const postNo = path.substring(path.lastIndexOf('/') + 1);

// 헤더
// 뒤로 가기 버튼
document.querySelector('.back').addEventListener('click', () => {
    window.location.href = `/board`;
});

// 조회수와 댓글의 개수를 변환하는 함수
function convertCount(count) {
    if (count >= 100000) {
        return '100k';
    } else if (count >= 10000) {
        return '10k';
    } else if (count >= 1000) {
        return '1k';
    } else {
        return count;
    }
}

// @Deprecated
// 회원들의 닉네임과 프로필 이미지를 Map 형태로 반환
// async function getImageMap() {
//     const memberResponse = await fetch('http://localhost:4000/json/users/images');
//     const members = await memberResponse.json();
//
//     return members.profileImages.reduce((memberMap, member) => {
//         memberMap.set(member.nickname, member.image);
//         return memberMap;
//     }, new Map());
// }

// 게시글 템플릿에 JSON 데이터 삽입
function insertText(post) {
    // 제목
    const title = document.querySelector('.title > h2');
    title.textContent = post.title;
    // 프로필 사진
    const profile = document.querySelector('.writer .image');
    // getImageMap().then(map => {
    //     profile.src = `../images/users/${map.get(post.writer)}`;
    // });
    profile.src = `../images/users/${post.profile_image}`;
    // 작성자
    const nickname = document.querySelector('.nickname');
    nickname.textContent = post.nickname;
    // 작성일
    const regDt = document.querySelector('.date');
    regDt.textContent = post.created_at;
    // 이미지
    const image = document.querySelector('.content .image img');
    if (post.image === '') {
        // 이미지를 등록하지 않으면 이미지가 보이지 않도록 만듦
        document.querySelector('.content .image').style.display = 'none';
    } else {
        document.querySelector('.content .image').style.display = 'block';
        image.src = `/images/posts/${post.post_image}`;
    }
    // 본문
    const content = document.querySelector('.text');
    content.textContent = post.content;
    // 조회수
    const views = document.querySelector('.count div:first-child p:first-child');
    views.textContent = convertCount(post.views);
    // 댓글수
    const comment = document.querySelector('.count div:nth-child(2) p:first-child');
    comment.textContent = convertCount(post.comment_count);
}

// 댓글 리스트 생성
const commentList = document.querySelector('.comment-list');

async function makeCommentList(nickname) {
    const response = await fetch(`http://localhost:4000/json/posts/${postNo}/comments`);
    const comments = await response.json();

    // const imageMap = await getImageMap();

    comments.forEach(comment => {
        // 댓글 요소 생성
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment-element');

        commentElement.innerHTML = `
            <div>
                <img class="image" src="../images/users/${comment.profile_image}" alt="" />
            </div>
            <div class="center">
                <div class="comment-no" style="display:none">${comment.comment_id}</div>
                <div>
                    <div class="nickname bold">${comment.nickname}</div>
                    <div class="date regular">${comment.created_at}</div>
                </div>
                <p>${comment.content}</p>
            </div>
            <div class="buttons">
                <button class="edit-comment regular">수정</button>
                <button class="delete-comment regular">삭제</button>
            </div>
        `;
        // 본인이 아니면 댓글 수정/삭제 못하게 막기
        if (comment.nickname !== nickname) {
            commentElement.querySelector('.buttons').style.display = 'none';
        }
        // 댓글 요소 생성 후 댓글 리스트 요소에 추가
        commentList.appendChild(commentElement);
    });

    return commentList;
}

// JSON에 있는 데이터로 동적으로 요소를 생성하고 추가
document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch(`http://localhost:4000/json/users`, {
        credentials: 'include',
    });
    const json = await response.json();
    const nickname = json.nickname;

    fetch(`http://localhost:4000/json/posts/${postNo}`, {
        credentials: 'include',
    })
        .then(response => {
            if (response.status === 401) { // 회원정보가 없으면 로그인 화면으로
                window.location.href = '/users/login';
            }
            return response.json()
        })
        .then(post => {
            const commentSection = document.querySelector('.comment');
            insertText(post);

            // 만약 작성자가 아니면 수정/삭제 버튼 숨김
            if (post.nickname !== nickname) {
                document.querySelector('.info .buttons').style.visibility = 'hidden';
            }

            const commentList = makeCommentList(nickname);
            commentSection.appendChild(commentList);
        }) // then
        .catch(error => console.log(`Error: ${error}`));
});

// 댓글 입력 시 댓글 등록 버튼 상태를 변경
const commentTextarea = document.querySelector('.comment-text textarea');
const commentButton = document.querySelector('.comment-button');
commentTextarea.addEventListener('keyup', () => {
    const isCommentEmpty = commentTextarea.value.trim() === '';

    commentButton.style.backgroundColor = isCommentEmpty ? '#aca0eb' : '#7f6aee';
    commentButton.style.cursor = isCommentEmpty ? 'defalut' : 'pointer';
});

const modal = document.querySelector('.modal');
const modalBackground = document.querySelector('.modal-background');

function showModal(text) {
    document.querySelector('.modal p:first-child').textContent = text;
    modal.style.display = 'flex';
    modalBackground.style.display = 'flex';
}

// 본문
// 게시글 수정/삭제 버튼 이벤트 등록
document.querySelector('.post').addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-post')) {
        window.location.href = `/posts/${postNo}/edit-form`;
    } else if (e.target.classList.contains('delete-post')) {
        showModal('게시글을 삭제하시겠습니까?');
    }
});

// 댓글 등록 기능
document.querySelector('.comment-button').addEventListener('click', async () => {
    const comment = commentTextarea.value;

    if (comment.trim() === '') return;

    const response = await fetch(`http://localhost:4000/json/posts/${postNo}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({comment}),
        credentials: 'include',
    });

    const json = await response.json();
    if (response.ok) {
        alert(json.message);
        window.location.reload();
    } else {
        alert(json.message);
    }
});


// 댓글 수정/삭제 버튼 이벤트 등록
let commentNo;
document.querySelector('.comment').addEventListener('click', async (e) => {
    commentNo = e.target.closest('.comment-element').querySelector('.comment-no').textContent;

    if (e.target.classList.contains('edit-comment')) {
        // 댓글 정보가 표시되는 영역
        const commentText = e.target.closest('.comment-element').querySelector('.center');

        let before; // 바뀌기 전 요소
        let after; // 바뀌고 난 후의 요소
        // 단순히 댓글을 표시 중이라면, 댓글 내용을 댓글 수정란에 넣음
        if (commentText.querySelector('p') !== null) {
            before = document.createElement('textarea');
            after = commentText.querySelector('p');
            before.value = after.textContent;
        } else { // 댓글 수정 중이라면, 수정된 내용을 표시창에 출력
            before = document.createElement('p');
            after = commentText.querySelector('textarea');
            before.textContent = after.value;
            // UI를 변경한 후에 실제로 서버에 데이터를 전송
            const response = await fetch(`http://localhost:4000/json/posts/${postNo}/comments/${commentNo}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({content: before.textContent})
            });

            if (!response.ok) {
                response.json()
                    .then(json => {
                        alert(json.message);
                    });
                return;
            }
        }
        after.remove();
        commentText.appendChild(before);
    } else if (e.target.classList.contains('delete-comment')) {
        showModal('댓글을 삭제하시겠습니까?');
    }
});

// 모달 취소 버튼
document.querySelector('.modal .cancel').addEventListener('click', () => {
    modal.style.display = 'none';
    modalBackground.style.display = 'none';
});

// 모달 확인 버튼
document.querySelector('.modal .confirm').addEventListener('click', () => {
    const modalText = document.querySelector('.modal p:first-child').textContent;
    let path;

    const isCommentModal = modalText.includes('댓글');
    if (isCommentModal) {
        path = `http://localhost:4000/json/posts/${postNo}/comments/${commentNo}`;
    } else {
        path = `http://localhost:3000/posts/${postNo}`;
    }

    fetch(path, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                if (isCommentModal) {
                    alert(`댓글을 성공적으로 삭제하였습니다.`);
                    window.location.reload();
                } else {
                    alert(`게시글을 성공적으로 삭제하였습니다.`);
                    window.location.href = `/board`;
                }
            }
        });
});