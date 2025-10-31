import { useState, useRef } from 'react';
import Image from 'next/image';
import UserProfileImg from '@/public/images/user_profile.png';
import styles from './ProfileInfo.module.css';

export default function ProfileInfo({ user }) {
  const [profileImage, setProfileImage] = useState(user?.image || null);
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [name, setName] = useState(user?.name || '');
  const fileInputRef = useRef(null);

  // 프로필 이미지 변경 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // 이미지 미리보기
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 프로필 이미지 클릭 핸들러
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // 프로필 정보 저장 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // TODO: API 호출로 프로필 정보 업데이트
      console.log('프로필 업데이트:', { nickname, name, profileImage });
      alert('프로필이 업데이트되었습니다.');
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      alert('프로필 업데이트에 실패했습니다.');
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>프로필 정보</h2>
        <p className={styles.cardDescription}>
          기본 정보를 수정할 수 있습니다
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* 프로필 이미지 */}
        <div className={styles.imageSection}>
          <div className={styles.imageWrapper} onClick={handleImageClick}>
            <Image
              src={profileImage || UserProfileImg}
              alt="Profile"
              fill
              sizes="10rem"
              className={styles.profileImage}
              style={{ objectFit: 'cover' }}
            />
            <div className={styles.imageOverlay}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                  fill="white"
                />
                <circle cx="12" cy="13" r="4" fill="currentColor" />
              </svg>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.fileInput}
          />
        </div>

        {/* 이메일 (읽기 전용) */}
        <div className={styles.formGroup}>
          <label className={styles.label}>이메일</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className={`${styles.input} ${styles.inputDisabled}`}
          />
          <p className={styles.helperText}>이메일은 변경할 수 없습니다</p>
        </div>

        {/* 닉네임 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
            className={styles.input}
          />
        </div>

        {/* 이름 (선택) */}
        <div className={styles.formGroup}>
          <label className={styles.label}>이름 (선택)</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
            className={styles.input}
          />
        </div>

        {/* 회원 등급 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>회원 등급</label>
          <input
            type="text"
            value="무료"
            disabled
            className={`${styles.input} ${styles.inputDisabled}`}
          />
        </div>

        {/* 수정 버튼 */}
        <button type="submit" className={styles.submitButton}>
          수정
        </button>
      </form>
    </div>
  );
}
