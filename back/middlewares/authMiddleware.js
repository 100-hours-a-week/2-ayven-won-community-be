

// 로그인 상태 확인
export const isAuthenticated = (req, res, next) => {
    console.log('[DEBUG] isAuthenticated - 세션 상태:', req.session);
    if (!req.session.user) {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
    }
    next();
};

// 특정 사용자 또는 역할 기반 권한 확인
export const hasRole = (role) => {
    return (req, res, next) => {
        console.log(`[DEBUG] hasRole - 세션 사용자: ${req.session.user}`);
        const user = req.session.user;

        if (!user) {
            return res.status(401).json({ message: '로그인이 필요합니다.' });
        }

        if (!user.role || user.role !== role) {
            return res.status(403).json({ message: '권한이 없습니다.' });
        }

        next();
    };
};
console.log('[DEBUG] Exported Middleware:');
console.log({ isAuthenticated, hasRole });
