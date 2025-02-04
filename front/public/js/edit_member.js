const image = document.querySelector('.image');
const emailInput = document.querySelector('.email p:nth-child(2)');
const nicknameInput = document.querySelector('#nickname');
const helper = document.querySelector('.helper');
const editButton = document.querySelector('.button');

document.addEventListener('DOMContentLoaded', () => {
    fetch(`http://localhost:4000/json/users`, {
        credentials: "include",
    })
        .then(response => {
            if (response.status === 401) { // 회원정보가 없으면 로그인 화면으로
                window.location.href = '/users/login';
            }

            return response.json()
        })
        .then(user => {
            image.src = `/images/users/${user.profile_image}`;
            emailInput.textContent = user.email;
            nicknameInput.value = user.nickname;
        });
});

let newImage;
document.querySelector('.change').addEventListener('change', (e) => {
    newImage = e.target.files[0]; // 사용자가 업로드한 파일
    const reader = new FileReader();
    // onloadend -> 파일 읽기 작업이 끝났을 때
    reader.onloadend = () => {
        image.src = `${reader.result}`;
    };
    reader.readAsDataURL(newImage);
});

// 도움말을 보여주는 함수
function showHelperText(text) {
    helper.textContent = text;
    helper.style.visibility = 'visible';
}

const finishButton = document.querySelector('.finish');
function changeFinishButton(state) {
    finishButton.style.backgroundColor = state ? '#7f6aee' : '#aca0eb';
    finishButton.style.cursor = state ? 'pointer' : 'default';
}

async function checkDuplication(nickname) {
    const response = await fetch(`http://localhost:4000/json/users/duplication?nickname=${nickname}`, {
        credentials: 'include',
    });

    return !response.ok;
}

const toast = document.querySelector('.toast-message');
function showToast() {
    helper.style.visibility = 'hidden';
    toast.classList.add('active'); // 클래스를 통해 토스트 메시지를 제어
    setTimeout(() => {
        toast.classList.remove('active');
    }, 1000);
}

let isChanged = false;
editButton.addEventListener('click', async () => {
    const nickname = nicknameInput.value;

    console.log(nickname);

    if (nickname.trim() === '') {
        showHelperText('*닉네임을 입력해주세요.');
        changeFinishButton(false);
    } else if (await checkDuplication(nickname)) {
        showHelperText('*중복된 닉네임입니다.');
        changeFinishButton(false);
    } else if (nickname.length > 10) {
        showHelperText('*닉네임은 최대 10자 까지 작성 가능합니다.');
        changeFinishButton(false);
    } else {
        const formData = new FormData();
        formData.append('nickname', nickname);
        if (newImage !== undefined) {
            formData.append('file', newImage);
        }
        helper.style.visibility = 'hidden';

        const response = await fetch(`http://localhost:4000/json/users`, {
            method: 'PUT',
            body: formData,
            credentials: 'include',
        });

        if (response.status === 400) {
            showHelperText('*변경사항이 없습니다.');
        }

        if (response.ok) {
            isChanged = true;
            showToast();
            changeFinishButton(true);
        }
    }
});

finishButton.addEventListener('click', () => {
    if (isChanged) {
        window.location.href = `/board`;
    }
});

const modal = document.querySelector('.modal');
const modalBackground = document.querySelector('.modal-background');
function showModal() {
    modal.style.display = 'flex';
    modalBackground.style.display = 'flex';
}

document.querySelector('.quit').addEventListener('click', (e) => {
    e.preventDefault();
    showModal();
});

document.querySelector('.modal .confirm').addEventListener('click', async () => {
    const response = await fetch(`http://localhost:4000/json/users`, {
        method: 'DELETE',
        credentials: 'include',
    });

    const json = await response.json();
    if (response.ok) {
        alert(json.message);
        window.location.href = '/login';
    } else {
        alert(json.message);
    }
});

// 모달 취소 버튼
document.querySelector('.modal .cancel').addEventListener('click', () => {
    modal.style.display = 'none';
    modalBackground.style.display = 'none';
});