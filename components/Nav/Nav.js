import styles from '@/components/Nav/Nav.module.css';
import { useAuth } from '@/contexts/AuthProvider';
import GnbLogoImg from '@/public/images/logo_gnb.png';
import GnbLogoImgMobile from '@/public/images/logo_gnb_m.png';
import UserMenu from '@/components/UserMenu/UserMenu';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Nav() {
  const { user, isPending } = useAuth();
  const router = useRouter();

  // 현재 경로에 따른 링크 스타일을 적용
  function getLinkStyle(path) {
    return {
      color: router.pathname === path ? 'var(--primary-color)' : 'var(--nav-text-color)',
    };
  }

  useEffect(() => {
    //console.log('Current user:', user);
    const accessToken = localStorage.getItem('accessToken');
    //console.log('accessToken', accessToken);
  }, [user]);
  //console.log(user);

  return (
    <div className={styles.gnbWrapper}>
      <div className={styles.gnb}>
        <div className={styles.gnbLogo}>
          <Link href="/">
            <div className={styles.gnbLogoDesktop}>
              <Image
                src={GnbLogoImg}
                alt="Logo"
                fill
                sizes = "15.3rem"
                className={styles.logoImage}
                priority 
              />
            </div>
            <div className={styles.gnbLogoMobile}>
              <Image
                src={GnbLogoImgMobile}
                alt="Logo"
                fill
                sizes = "8.1rem"
                className={styles.logoImage}
              />
            </div>
          </Link>
        </div>       
        <nav className={styles.gnbNav}>
          <ul className={styles.gnbNavList}>
            <li><Link href="/articles" style={getLinkStyle('/articles')}>자유게시판</Link></li>
            <li><Link href="/items" style={getLinkStyle('/items')}>중고마켓</Link></li>
          </ul>
        </nav>
        {/* isPending이 false일 때만 gnbUser 영역을 렌더링 : 로그인 버튼 깜빡이지 않기 위해 */}
        {!isPending && (
          <div className={styles.gnbUser}>
            {!user ? (
              <Link href="/signin" className={styles.gnbBtnLogin}>로그인</Link>
            ) : (
              <UserMenu />
            )}
          </div>
        )}
      </div>
    </div>    
  );
}