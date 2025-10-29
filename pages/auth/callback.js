import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthProvider';

export default function OAuthCallback() {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      console.log('=== OAuth Callback 시작 ===');
      console.log('router.query:', router.query);

      const { accessToken, refreshToken, error } = router.query;

      // OAuth 에러가 있는 경우
      if (error) {
        console.error('OAuth error:', error);
        router.replace('/signin');
        return;
      }

      // 토큰 확인
      console.log('accessToken 존재:', !!accessToken);
      console.log('refreshToken 존재:', !!refreshToken);

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
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          router.replace('/signin');
        }
      } else {
        console.log('토큰이 없습니다. router.query:', router.query);
        if (router.isReady) {
          console.log('router는 준비되었지만 토큰이 없어 /signin으로 리다이렉트');
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
