export const getCsrfToken = async () => {
    try {
        const response = await fetch('http://localhost:4000/csrf-token', {
            method: 'GET',
            credentials: 'include', // 쿠키 포함
        });
        if (!response.ok) {
            throw new Error(`CSRF 토큰 요청 실패: ${response.statusText}`);
        }
        const data = await response.json();
        return data.csrfToken; // 서버에서 제공하는 CSRF 토큰 반환
    } catch (error) {
        console.error('CSRF 토큰 가져오기 실패:', error);
        alert('CSRF 토큰을 가져오는 데 문제가 발생했습니다.');
        throw error; // 오류를 호출자에게 전달
    }
};
