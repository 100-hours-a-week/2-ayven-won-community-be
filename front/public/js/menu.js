// 유저 이미지 클릭 시 메뉴 토글
document.querySelector('.user-profile').addEventListener('click', () => {
    const menu = document.querySelector('.menu');
    // 메뉴 껐다 켜기
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});

// 메뉴 클릭 시 페이지 이동
document.querySelectorAll('.menu div').forEach(menuItem => {
    menuItem.addEventListener('click', async () => { 
        let path;
        switch (menuItem.textContent.trim()) { //텍스트 공백 제거
            case '회원정보수정':
                path = '/edit_member';
                break;
            case '비밀번호수정':
                path = '/edit_password';
                break;
            case '로그아웃':
                try {
                    const response = await fetch('/users/logout', { method: 'POST' });
                    if (response.ok) {
                        alert('로그아웃 성공');
                        path = '/login'; // 로그아웃 후 로그인 페이지로 이동
                    } else {
                        alert('로그아웃 실패. 다시 시도해주세요.');
                        return; // 실패 시 이동하지 않음
                    }
                } catch (error) {
                    console.error('로그아웃 처리 중 오류:', error);
                    alert('서버와의 통신 중 문제가 발생했습니다.');
                    return; // 오류 발생 시 이동하지 않음
                }
                break;
        }
        if (path) {
            window.location.href = path; // 해당 경로로 이동
        }
    });
});
