import styles from './Auth.module.css';
import Image from 'next/image';
import { authApi } from '@/lib/api/AuthService';

export default function SocialLogin() {
  const handleGoogleLogin = () => {
    authApi.googleLogin();
  };

  const handleKakaoLogin = () => {
    authApi.kakaoLogin();
  };

  return (
    <div className={styles.socialLogin}>
      <p>간편 로그인하기</p>
      <div className={styles.socialIcons}>
        <button
          onClick={handleGoogleLogin}
          className={styles.iconWrapper}
          style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
        >
          <Image
            src="/images/auth/ic_google.png"
            alt="Google 로그인"
            fill
            style={{ objectFit: 'contain' }}
            sizes="2.4rem"
          />
        </button>
        <button
          onClick={handleKakaoLogin}
          className={styles.iconWrapper}
          style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
        >
          <Image
            src="/images/auth/ic_kakaotalk.png"
            alt="Kakao 로그인"
            fill
            style={{ objectFit: 'contain' }}
            sizes="2.4rem"
          />
        </button>
      </div>
    </div>
  );
}
