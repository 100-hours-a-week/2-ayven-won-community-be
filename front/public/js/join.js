const signupButton = document.querySelector('.button');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const confirmPasswordInput = document.querySelector('#confirm-password');
const nicknameInput = document.querySelector('#nickname');
const profileImageInput = document.querySelector('#profileImageInput');
const profileImgPreview = document.querySelector('#profileImgPreview');

let isCollectEmail = false;
let isCollectPassword = false;
let isCollectConfirmPassword = false;
let isCollectNickname = false;

// 버튼 상태 변경 함수
function changeButtonState() {
    signupButton.style.backgroundColor =
        isCollectEmail && isCollectPassword && isCollectConfirmPassword && isCollectNickname
            ? '#7f6aee'
            : '#aca0eb';
    signupButton.style.cursor =
        isCollectEmail && isCollectPassword && isCollectConfirmPassword && isCollectNickname
            ? 'pointer'
            : 'default';
}

// 이메일 유효성 검사
emailInput.addEventListener('input', () => {
    const email = emailInput.value.trim();
    const emailRegExp = /^[a-zA-Z0-9._-]+@[a-z]+\.[a-z]{2,3}$/;
    isCollectEmail = emailRegExp.test(email);

    const helper = document.querySelector('#emailError');
    helper.style.visibility = isCollectEmail ? 'hidden' : 'visible';

    changeButtonState();
});

// 비밀번호 유효성 검사
passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
    isCollectPassword = passwordRegExp.test(password);

    const helper = document.querySelector('#passwordError');
    if (password === '') {
        showHelperText(helper, '*비밀번호를 입력해주세요.');
    } else if (!isCollectPassword) {
        helper.innerHTML = '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를<br> 각각 최소 1개 포함해야 합니다.';
        helper.style.visibility = 'visible';
    } else {
        helper.style.visibility = 'hidden';
    }

    changeButtonState();
});

// 비밀번호 확인 유효성 검사
confirmPasswordInput.addEventListener('input', () => {
    const confirmPassword = confirmPasswordInput.value;
    const password = passwordInput.value;
    isCollectConfirmPassword = confirmPassword === password;

    const helper = document.querySelector('#confirmPasswordError');
    helper.style.visibility = isCollectConfirmPassword ? 'hidden' : 'visible';

    changeButtonState();
});

// 닉네임 유효성 검사
nicknameInput.addEventListener('input', () => {
    const nickname = nicknameInput.value.trim();
    isCollectNickname = nickname.length >= 2 && nickname.length <= 10;

    const helper = document.querySelector('#nicknameError');
    helper.style.visibility = isCollectNickname ? 'hidden' : 'visible';

    changeButtonState();
});

// 도움말 텍스트 표시 함수
function showHelperText(helper, text) {
    helper.textContent = text;
    helper.style.visibility = 'visible';
}

// 프로필 이미지를 클릭하면 파일 선택 창 열기
profileImgPreview.addEventListener('click', () => {
    profileImageInput.click(); // 파일 입력 창 활성화
});

// 선택한 이미지 파일을 미리보기로 표시
profileImageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file) {
        console.log('Selected file:', file); // 파일 정보 디버깅
        const reader = new FileReader();

        // 파일 읽기 완료 후 실행되는 이벤트
        reader.onload = (e) => {
            console.log('File read result:', e.target.result); // 파일 읽기 결과 디버깅
            profileImgPreview.src = e.target.result; // 이미지 미리보기 표시
        };

        reader.onerror = (error) => {
            console.error('Error reading file:', error); // 파일 읽기 오류 디버깅
        };

        reader.readAsDataURL(file); // 파일을 읽어 Data URL 생성
    } else {
        console.log('No file selected or file selection canceled.'); // 파일 선택 취소 로그
        profileImgPreview.src = '/image/default-profile.png';
    }
});


// 회원가입 버튼 클릭 처리
signupButton.addEventListener('click', async (event) => {
    event.preventDefault();

    if (isCollectEmail && isCollectPassword && isCollectConfirmPassword && isCollectNickname) {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const nickname = nicknameInput.value.trim();
        const profileImageFile = profileImageInput.files[0];

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('nickname', nickname);

        if (profileImageFile) {
            formData.append('file', profileImageFile);
        }

        try {
            const response = await fetch('http://localhost:4000/json/users/join', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            if (response.ok) {
                alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
                window.location.href = '/login'; // 로그인 페이지로 이동
            } else {
                const error = await response.json();
                alert(`회원가입 실패: ${error.message}`);
            }
        } catch (error) {
            console.error('회원가입 요청 중 오류 발생:', error);
            alert('회원가입 도중 문제가 발생했습니다.');
        }
    } else {
        alert('모든 입력값을 올바르게 작성해주세요.');
    }
});
