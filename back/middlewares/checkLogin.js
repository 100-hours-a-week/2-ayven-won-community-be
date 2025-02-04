// 사용자 인증을 확인하는 미들웨어 함수
export const isLoggedIn = (req, res, next) => {
    // 세션에 사용자 정보가 없는 경우 (로그인되지 않은 상태)
    if (!req.session.user) {
        // 상태 코드 401과 함께 응답을 반환하여 인증 실패 메시지를 전달
        res.status(401).json({ message: '회원 정보를 찾을 수 없습니다.' });
        return; 
    }
    // 사용자가 로그인된 상태인 경우 다음 미들웨어 또는 라우트 핸들러로 요청을 넘김
    next();
};
