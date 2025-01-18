import { getCsrfToken } from '/front/utils/csrfToken.js'; // CSRF 토큰 가져오는 유틸리티 추가

const loginButton = document.querySelector('.button');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');

// 초기 상태
let isCollectEmail = false;
let isCollectPassword = false;

// 버튼 상태 변경 함수
function changeButtonState() {
    loginButton.style.backgroundColor = isCollectEmail && isCollectPassword ? '#7f6aee' : '#aca0eb';
    loginButton.style.cursor = isCollectEmail && isCollectPassword ? 'pointer' : 'default';
}

// 이메일 유효성 검사
emailInput.addEventListener('input', () => {
    const email = emailInput.value.trim();
    const emailRegExp = /^[a-zA-Z0-9._-]+@[a-z]+\.[a-z]{2,3}$/; // 올바른 이메일 정규식
    isCollectEmail = emailRegExp.test(email);

    const helper = document.querySelector('.email-helper');
    helper.style.visibility = isCollectEmail ? 'hidden' : 'visible';

    changeButtonState();
});

// 비밀번호 유효성 검사
passwordInput.addEventListener('input', () => {
    const password = passwordInput.value.trim();
    const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/; // 올바른 비밀번호 정규식
    isCollectPassword = passwordRegExp.test(password);

    const helper = document.querySelector('.password-helper');
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

// 도움말 텍스트 표시 함수
function showHelperText(helper, text) {
    helper.innerHTML = text; // HTML로 설정
    helper.style.visibility = 'visible';
}

// 로그인 버튼 클릭 처리
loginButton.addEventListener('click', async (event) => {
    event.preventDefault();

    if (isCollectEmail && isCollectPassword) {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        try {
            // CSRF 토큰 가져오기
            const csrfToken = await getCsrfToken();
            console.log('[DEBUG] CSRF Token:', csrfToken);


            // 로그인 요청
            const response = await fetch('http://localhost:4000/json/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': csrfToken, // CSRF 토큰 추가
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            const helper = document.querySelector('.password-helper');

            if (response.ok) {
                const data = await response.json();
                console.log('[DEBUG] Response Status:', response.status);
                alert(`로그인 성공! 환영합니다, ${data.user.nickname}님.`);
                window.location.href = `/board?id=${data.user.id}`; // 성공 시 게시판으로 이동
            } else if (response.status === 400) {
                showHelperText(helper, '*잘못된 요청 정보입니다.');
                console.log('[DEBUG] Response Status:', response.status);
            } else if (response.status === 401) {
                showHelperText(helper, '*아이디 또는 비밀번호가 일치하지 않습니다.');
                console.log('[DEBUG] Response Status:', response.status);
            } else {
                console.log('[DEBUG] Response Status:', response.status);
                showHelperText(helper, '*로그인 중 문제가 발생했습니다.');
            }
        } catch (error) {
            console.log('[DEBUG] Response Status:', response.status);
            console.error('로그인 요청 중 오류 발생:', error);
            alert('로그인 중 문제가 발생했습니다. 다시 시도해주세요.');
        }
    } else {
        alert('이메일과 비밀번호를 올바르게 입력해주세요.');
    }
});
