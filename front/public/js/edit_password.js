const passwordInput = document.querySelector('#password');
const passwordCheckInput = document.querySelector('#password-check');
const editButton = document.querySelector('.button');

let isCollectPassword = false; // 비밀번호 양식이 올바른가
let isSameWithPasswordCheck = false; // 비밀번호가 비밀번호 확인과 동일한가
let isSameWithPassword = false; // 비밀번호 확인이 비밀번호와 동일한가

// 도움말을 보여주는 함수
function showHelperText(helper, text) {
    helper.textContent = text;
    helper.style.visibility = 'visible';
}

// 모든 입력란의 유효성 검사를 통과했다면,
// 버튼의 색상과 커서의 모양을 변경해서 사용자가 클릭할 수 있음을 알림
function changeButtonState() {
    editButton.style.backgroundColor =
        isCollectPassword && isSameWithPasswordCheck && isSameWithPassword ? '#7f6aee' : '#aca0eb';
    editButton.style.cursor =
        isCollectPassword && isSameWithPasswordCheck && isSameWithPassword ? 'pointer' : 'default';
}

// 비밀번호를 입력하고 포커스가 빠져나갔을 때
passwordInput.addEventListener('change', () => {
    const password = passwordInput.value;
    const passwordCheck = passwordCheckInput.value;
    // 비밀번호 조건
    // 1. 8자 이상, 20자 이하여야 한다.
    // 2. 대문자, 소문자, 숫자, 특수문자가 각각 최소 1개 포함되어야 한다.
    const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
    // 비밀번호 도움말
    const helper = document.querySelector('.password-helper')
    // 사용자가 입력한 비밀번호가 조건에 부합하는지 확인
    isCollectPassword = passwordRegExp.test(password);
    // 비밀번호와 비밀번호 확인의 입력값이 동일한지 확인
    isSameWithPasswordCheck = password === passwordCheck;

    // 안내문을 위한 추가 조건 검증
    if (password === '') {
        showHelperText(helper, '*비밀번호를 입력해주세요');
    } else if (!isSameWithPasswordCheck && passwordCheck.trim() !== '') {
        // passwordCheck.trim() !== '' -> 비밀번호 확인을 입력하기 전에 안내가 표시되는 것을 방지
        showHelperText(helper, '*비밀번호 확인과 다릅니다.');
    } else if (!isCollectPassword) {
        // innerHTML을 사용한 이유 -> <br>을 사용하기 위해(가독성을 위해 줄바꿈을 추가)
        helper.innerHTML = '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를<br> 각각 최소 1개 포함해야 합니다.';
        helper.style.visibility = 'visible';
    } else {
        helper.style.visibility = 'hidden';
    }

    changeButtonState();
});

// 비밀번호 확인을 입력하고 포커스가 빠져나갔을 때
passwordCheckInput.addEventListener('change', () => {
    const password = passwordInput.value;
    const passwordCheck = passwordCheckInput.value;
    // 비밀번호 확인 도움말
    const helper = document.querySelector('.password-check-helper');
    // 비밀번호와 비밀번호 확인의 입력값이 동일한지 확인
    isSameWithPassword = password === passwordCheck;
    isSameWithPasswordCheck = password === passwordCheck;

    // 안내문을 위한 추가 조건 검증
    if (passwordCheck === '') {
        showHelperText(helper, '*비밀번호를 한 번 더 입력해주세요.');
    } else if (!isSameWithPassword) {
        showHelperText(helper, '*비밀번호와 다릅니다.');
    } else {
        helper.style.visibility = 'hidden';
    }

    changeButtonState();
});

const toast = document.querySelector('.toast-message');
// 모든 유효성 검사를 통과했다면, 수정하기 버튼을 눌렀을 때
editButton.addEventListener('click', async () => {
    if (isCollectPassword && isSameWithPasswordCheck && isSameWithPassword) {
        const response = await fetch(`http://localhost:4000/json/users/password`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: passwordInput.value
            }),
            credentials: 'include',
        });

        if (response.ok) {
            toast.classList.add('active'); // 클래스를 통해 토스트 메시지를 제어
            setTimeout(() => {
                toast.classList.remove('active');
                const agreement = confirm('비밀번호 수정이 완료되었습니다. 게시판으로 이동하시겠습니까?');
                if (agreement) {
                    window.location.href = `/board`;
                }
            }, 1000);
        } else if (response.status === 409) {
            response.json()
                .then(json => alert(json.message));
        }
    } else {
        const event = new Event('change');
        passwordInput.dispatchEvent(event);
        passwordCheckInput.dispatchEvent(event);
    }
});