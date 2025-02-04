// 게시글 작성 페이지로 이동
document.querySelector('.create-button').addEventListener('click', () => {
    window.location.href = '/edit_post';
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

// 게시글 요소를 생성하는 코드
function makePostElement(post) {
    const article = document.createElement('article');
    let hit = convertCount(parseInt(`${post.hit}`));
    let comment = convertCount(parseInt(`${post.comment}`));
    article.classList.add('post');
    article.innerHTML = `
        <input type="hidden" name="no" class="no" value="${post.post_id}">
        <section class="post-info">
            <h3>${post.title}</h3>
            <div class="numeric">
                <div class="count">
                    <div>좋아요 0</div>
                    <div>댓글 ${post.comment_count}</div>
                    <div>조회수 ${post.views}</div>
                </div>
                <div class="date">${post.created_at}</div>
            </div>
        </section>
        <hr class="post-horizontal" />
        <section class="writer">
            <img class="image" src="../images/users/${post.profile_image}" alt="">
            <div class="nickname">${post.nickname}</div>
        </section>`;
    return article;
}

// 페이지가 로드될 때 게시글을 가져오기
document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('http://localhost:4000/json/board', {
        credentials: "include"
    });

    const json = await response.json();

    if (response.status === 401) {
        window.location.href = '/users/login';
    }

    const postList = document.querySelector('.post-list');
    json.forEach(post => {
        let newPostElement = makePostElement(post);
        postList.appendChild(newPostElement);
    });
});

// 이벤트 위임을 통해 특정 게시글로 이동
document.querySelector('.post-list').addEventListener('click', (e) => {
    const boardNo = e.target.closest('.post').childNodes[1].value;
    window.location.href = `/posts/${boardNo}`;
});
