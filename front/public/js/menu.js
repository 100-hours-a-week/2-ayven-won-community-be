// 유저 이미지 클릭 시 메뉴 토글
document.querySelector('.user-profile').addEventListener('click', () => {
    const menu = document.querySelector('.menu');
    // 메뉴 껐다 켜기
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});

// 메뉴 클릭 시 페이지 이동
document.querySelectorAll('.menu div').forEach(menuItem => {
    menuItem.addEventListener('click', () => {
        let path;
        switch (menuItem.textContent) {
            case '회원정보수정':
                path = '/edit_member';
                break;
            case '비밀번호수정':
                path = '/edit_password';
                break;
            case '로그아웃':
                path = '/logout'; // 실제 로그아웃 로직 구현 필요
                break;
        }
        if (path) {
            window.location.href = path; // 해당 경로로 이동
        }
    });
});
