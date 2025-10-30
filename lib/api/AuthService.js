import instance from './axiosInstance';

// 회원가입
const signUp = async (data) => {
  try {
    const res = await instance.post('/auth/signUp', data);
    return res;
  } catch (error) {
    console.error("회원가입 요청 중 오류 발생:", error);
    throw error;
  }
};

// 로그인
const signIn = async (data) => {
  try {
    const res = await instance.post('/auth/signIn', data);
    const { accessToken, refreshToken } = res || {};
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    return res;
  } catch (error) {
    //console.error("로그인 요청 중 오류 발생:", error);  // error 자체를 출력하면 오류 표시가 뜸
    const errorMessage = error.response?.data?.message || '로그인에 실패했습니다.';
    console.error("로그인 요청 중 오류 발생:", error.response?.data?.message || '로그인에 실패했습니다.');
    return { error: errorMessage };
  }
};

// 사용자 정보 가져오기
const getUser = async () => {
  try {
    const res = await instance.get('/users/me');
    return res;
  } catch (error) {
    // 401 에러 또는 404 에러일 경우에는 오류를 남기지 않고 null 반환
    if (error.response && (error.response.status === 401 || error.response.status === 404)) {
      if (error.response.status === 401) {
        console.warn("인증이 필요합니다. 로그인되지 않은 상태입니다.");
      } else {
        console.warn("사용자 정보를 찾을 수 없습니다. 토큰을 삭제합니다.");
        // 404 에러면 토큰 삭제
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      return null; // 401/404 에러 시 null 반환
    }
    console.error("사용자 정보 가져오기 중 오류 발생:", error);
    throw error;
  }
};

// 로그아웃
const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// Google 로그인 (OAuth 플로우 시작)
const googleLogin = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  window.location.href = `${apiUrl}/auth/google`;
};

// Kakao 로그인 (OAuth 플로우 시작)
const kakaoLogin = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  window.location.href = `${apiUrl}/auth/kakao`;
};

export const authApi = {
  signUp,
  signIn,
  getUser,
  logout,
  googleLogin,
  kakaoLogin,
};
