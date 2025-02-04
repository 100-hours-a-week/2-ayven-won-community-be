const loginButton = document.querySelector('.button');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');

// 처음엔 확인하지 않았으므로 false로 초기화
let isCollectEmail = false;
let isCollectPassword = false;

// 이메일과 비밀번호의 유효성 검사를 모두 통과했다면,
// 버튼의 색상과 커서의 모양을 변경해서 사용자가 클릭할 수 있음을 알림
function changeButtonState() {
    loginButton.style.backgroundColor = isCollectEmail && isCollectPassword ? '#7f6aee' : '#aca0eb';
    loginButton.style.cursor = isCollectEmail && isCollectPassword ? 'pointer' : 'default';
}

// 이메일을 입력하고 포커스가 빠져나갔을 때
emailInput.addEventListener('change', () => {
    const email = emailInput.value;
    // 이메일 정규 표현식
    const emailRegExp = /^[a-zA-Z0-9._-]+@[a-z]+\.[a-z]{2,3}$/;
    // 사용자가 입력한 이메일이 조건에 부합하는지 확인
    isCollectEmail = emailRegExp.test(email);

    // 만약 이메일이 유효하면 도움말을 숨기고, 유효하지 않다면 도움말을 표시
    const helper = document.querySelector('.email-helper');
    helper.style.visibility = isCollectEmail ? 'hidden' : 'visible';

    changeButtonState();
});

function showHelperText(helper, text) {
    helper.textContent = text;
    helper.style.visibility = 'visible';
}

// 비밀번호를 입력하고 포커스가 빠져나갔을 때
passwordInput.addEventListener('change', () => {
    const password = passwordInput.value;
    // 비밀번호 조건
    // 1. 8자 이상, 20자 이하여야 한다.
    // 2. 대문자, 소문자, 숫자, 특수문자가 각각 최소 1개 포함되어야 한다.
    const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
    // 사용자가 입력한 비밀번호가 조건에 부합하는지 확인
    isCollectPassword = passwordRegExp.test(password);

    // 만약 비밀번호가 유효하면 도움말을 숨기고, 유효하지 않다면 도움말을 표시
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

// 이메일과 비밀번호의 유효성 검사를 모두 통과했다면, 로그인 버튼을 눌렀을 때 게시판으로 이동
loginButton.addEventListener('click', () => {
    if (isCollectEmail && isCollectPassword) {
        const email = emailInput.value;
        const password = passwordInput.value;
        // 클라이언트 서버에 로그인 정보를 보냄
        // 클라이언트 서버는 JSON API 서버에서 JSON을 받아서 비교 후 로그인 처리
        fetch('http://localhost:4000/json/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        })
            .then(response => {
                const helper = document.querySelector('.password-helper');

                if (response.status === 200) {
                    response.json()
                        .then(data => window.location.href = `/board?id=${data.id}`)
                } else if (response.status === 400) {
                    showHelperText(helper, '*잘못된 요청 정보입니다.');
                } else if (response.status === 401) {
                    showHelperText(helper, '*아이디 또는 비밀번호가 일치하지 않습니다.');
                }
            });
    }
});