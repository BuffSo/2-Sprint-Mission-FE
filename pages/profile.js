import { useAuth } from '@/contexts/AuthProvider';
import ProfileInfo from '@/components/Profile/ProfileInfo';
import PasswordChange from '@/components/Profile/PasswordChange';
import styles from '@/styles/Profile.module.css';

export default function ProfilePage() {
  const { user } = useAuth(true); // 로그인 필수

  if (!user) {
    return null; // 로그인 체크 중
  }

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.pageTitle}>프로필 설정</h1>
      <div className={styles.cardsWrapper}>
        <ProfileInfo user={user} />
        <PasswordChange />
      </div>
    </div>
  );
}
