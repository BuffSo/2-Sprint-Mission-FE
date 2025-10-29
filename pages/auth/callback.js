import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthProvider';

export default function OAuthCallback() {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const { accessToken, refreshToken, error } = router.query;

      // OAuth 에러가 있는 경우
      if (error) {
        console.error('OAuth error:', error);
        alert('Google 로그인에 실패했습니다. 다시 시도해주세요.');
        router.replace('/signin');
        return;
      }

      // 토큰이 있는 경우
      if (accessToken && refreshToken) {
        try {
          // localStorage에 토큰 저장
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);

          console.log('토큰 저장 완료, 사용자 정보 가져오는 중...');

          // AuthProvider의 login으로 사용자 정보 가져오기
          const result = await login({ skipApiCall: true });

          if (result) {
            // 에러가 발생한 경우
            console.error('Login error:', result);
            alert(`로그인 처리 중 오류: ${result}`);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            router.replace('/signin');
            return;
          }

          // 성공: 메인 페이지로 리다이렉트
          console.log('로그인 성공!');
          router.replace('/');
        } catch (error) {
          console.error('Token storage error:', error);
          alert('로그인 처리 중 오류가 발생했습니다.');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          router.replace('/signin');
        }
      }
    };

    // router.query가 준비되면 실행 (한 번만)
    if (router.isReady && router.query.accessToken) {
      handleOAuthCallback();
    }
  }, [router.isReady, router.query.accessToken, router.query.refreshToken, router.query.error]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666',
      }}
    >
      로그인 처리 중...
    </div>
  );
}
