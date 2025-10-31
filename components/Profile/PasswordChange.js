import { useState } from 'react';
import styles from './PasswordChange.module.css';

export default function PasswordChange() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  // 유효성 검사
  const validate = () => {
    const newErrors = {};

    if (!currentPassword) {
      newErrors.currentPassword = '현재 비밀번호를 입력하세요';
    }

    if (!newPassword) {
      newErrors.newPassword = '새 비밀번호를 입력하세요';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = '8자 이상, 영문+숫자 포함';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = '새 비밀번호를 재입력하세요';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = '새 비밀번호가 일치하지 않습니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 비밀번호 변경 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      // TODO: API 호출로 비밀번호 변경
      console.log('비밀번호 변경:', {
        currentPassword,
        newPassword,
      });
      alert('비밀번호가 변경되었습니다.');

      // 폼 초기화
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      alert('비밀번호 변경에 실패했습니다.');
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>비밀번호 변경</h2>
        <p className={styles.cardDescription}>
          비밀번호를 안전하게 변경하세요
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* 현재 비밀번호 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>현재 비밀번호</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="현재 비밀번호를 입력하세요"
            className={`${styles.input} ${errors.currentPassword ? styles.inputError : ''}`}
          />
          {errors.currentPassword && (
            <p className={styles.errorText}>{errors.currentPassword}</p>
          )}
        </div>

        {/* 새 비밀번호 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>새 비밀번호</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="8자 이상, 영문+숫자 포함"
            className={`${styles.input} ${errors.newPassword ? styles.inputError : ''}`}
          />
          {errors.newPassword && (
            <p className={styles.errorText}>{errors.newPassword}</p>
          )}
        </div>

        {/* 새 비밀번호 확인 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>새 비밀번호 확인</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="새 비밀번호를 재입력"
            className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
          />
          {errors.confirmPassword && (
            <p className={styles.errorText}>{errors.confirmPassword}</p>
          )}
        </div>

        {/* 변경 버튼 */}
        <button type="submit" className={styles.submitButton}>
          비밀번호 변경
        </button>
      </form>
    </div>
  );
}
