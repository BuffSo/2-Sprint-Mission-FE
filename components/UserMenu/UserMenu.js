import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthProvider';
import UserProfileImg from '@/public/images/user_profile.png';
import styles from './UserMenu.module.css';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef(null);

  // 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // 로그아웃 핸들러
  const handleLogout = () => {
    const confirmed = window.confirm('정말 로그아웃 하시겠습니까?');
    if (confirmed) {
      logout();
      setIsOpen(false);
    }
  };

  // 메뉴 토글
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // 사용자 이니셜 생성 (이미지가 없을 때)
  const getUserInitial = () => {
    if (user?.nickname) {
      return user.nickname.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return '?';
  };

  // 관리자 여부 확인 (추후 user.role 필드로 체크)
  const isAdmin = false; // 현재는 비활성화

  return (
    <div
      className={styles.userMenuContainer}
      ref={menuRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.userMenuTrigger} onClick={handleToggle}>
        {/* 프로필 이미지 또는 이니셜 */}
        <div className={styles.userAvatar}>
          {user?.image ? (
            <Image
              src={user.image}
              alt="User Profile"
              fill
              sizes="4rem"
              className={styles.avatarImage}
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className={styles.avatarInitial}>
              {getUserInitial()}
            </div>
          )}
        </div>

        {/* 닉네임 */}
        <span className={styles.userName}>
          {user?.nickname || user?.email?.split('@')[0] || '익명'}
        </span>

        {/* Chevron (hover 시에만 표시) */}
        <svg
          className={`${styles.chevron} ${isHovered || isOpen ? styles.chevronVisible : ''} ${isOpen ? styles.chevronRotated : ''}`}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className={styles.dropdownMenu}>
          <Link href="/profile" className={styles.menuItem} onClick={() => setIsOpen(false)}>
            <svg
              className={styles.menuIcon}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z"
                fill="currentColor"
              />
              <path
                d="M10 12C4.477 12 0 14.477 0 17.5V20H20V17.5C20 14.477 15.523 12 10 12Z"
                fill="currentColor"
              />
            </svg>
            프로필 설정
          </Link>

          {/* 관리자 메뉴 (현재는 비활성화 상태로 표시) */}
          <div className={`${styles.menuItem} ${styles.menuItemDisabled}`}>
            <svg
              className={styles.menuIcon}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 0L12.39 7.26L20 7.27L13.81 11.78L16.18 19.04L10 14.51L3.82 19.04L6.19 11.78L0 7.27L7.61 7.26L10 0Z"
                fill="currentColor"
              />
            </svg>
            관리자 화면
          </div>

          <button onClick={handleLogout} className={styles.menuItem}>
            <svg
              className={styles.menuIcon}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 0H2C0.9 0 0 0.9 0 2V18C0 19.1 0.9 20 2 20H13C14.1 20 15 19.1 15 18V16H13V18H2V2H13V4H15V2C15 0.9 14.1 0 13 0Z"
                fill="currentColor"
              />
              <path
                d="M16.09 15.59L14.67 14.17L17.34 11.5H6V9.5H17.34L14.67 6.83L16.09 5.41L21.67 11L16.09 15.59Z"
                fill="currentColor"
              />
            </svg>
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
