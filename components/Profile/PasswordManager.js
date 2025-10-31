import { useState } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { sendVerificationCode, changePassword } from '@/lib/api/UserService';
import styles from './PasswordManager.module.css';

export default function PasswordManager() {
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: 인증코드 발송, 2: 비밀번호 입력
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const isPasswordSetup = !user?.password; // 비밀번호 설정 모드 여부

  // 인증 코드 발송 핸들러
  const handleSendCode = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      const type = isPasswordSetup ? 'password-setup' : 'password-reset';
      await sendVerificationCode(user.email, type);

      setCodeSent(true);
      setStep(2);
      alert('인증 코드가 이메일로 발송되었습니다. (유효시간: 10분)');
    } catch (error) {
      console.error('인증 코드 발송 실패:', error);
      const message = error.response?.data?.message || '인증 코드 발송에 실패했습니다.';
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  // 유효성 검사
  const validate = () => {
    const newErrors = {};

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

    if (!verificationCode) {
      newErrors.verificationCode = '인증 코드를 입력하세요';
    } else if (verificationCode.length !== 6) {
      newErrors.verificationCode = '6자리 인증 코드를 입력하세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 비밀번호 변경/설정 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    const data = {
      newPassword,
      verificationCode,
    };

    const result = await changePassword(data);

    if (result.success) {
      alert(
        isPasswordSetup
          ? '비밀번호가 설정되었습니다. 다시 로그인해주세요.'
          : '비밀번호가 변경되었습니다.'
      );

      // 폼 초기화
      setStep(1);
      setNewPassword('');
      setConfirmPassword('');
      setVerificationCode('');
      setCodeSent(false);
    } else {
      // 에러 처리 - throw 없이 상태로만 관리
      console.error('비밀번호 변경 실패:', result.error);
      setErrors({ general: result.error });
      alert(`오류: ${result.error}`);
    }

    setIsLoading(false);
  };

  // 뒤로가기 핸들러
  const handleBack = () => {
    setStep(1);
    setNewPassword('');
    setConfirmPassword('');
    setVerificationCode('');
    setErrors({});
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>
          {isPasswordSetup ? '비밀번호 설정' : '비밀번호 변경'}
        </h2>
        <p className={styles.cardDescription}>
          {isPasswordSetup
            ? '이메일 인증 후 비밀번호를 설정하세요'
            : '이메일 인증 후 비밀번호를 변경하세요'}
        </p>
      </div>

      {errors.general && (
        <div className={styles.errorBanner}>{errors.general}</div>
      )}

      {step === 1 ? (
        // Step 1: 인증 코드 발송
        <div className={styles.stepOne}>
          <div className={styles.infoBox}>
            <svg
              className={styles.infoIcon}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V9H11V15ZM11 7H9V5H11V7Z"
                fill="currentColor"
              />
            </svg>
            <div>
              <p className={styles.infoTitle}>보안 인증이 필요합니다</p>
              <p className={styles.infoText}>
                <strong>{user?.email}</strong>로 인증 코드를 발송합니다.
              </p>
            </div>
          </div>

          <button
            onClick={handleSendCode}
            disabled={isLoading}
            className={styles.sendCodeButton}
          >
            {isLoading ? '발송 중...' : '인증 코드 발송'}
          </button>
        </div>
      ) : (
        // Step 2: 비밀번호 입력
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* 인증 코드 입력 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              인증 코드 <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="6자리 인증 코드"
              maxLength={6}
              className={`${styles.input} ${errors.verificationCode ? styles.inputError : ''}`}
            />
            {errors.verificationCode && (
              <p className={styles.errorText}>{errors.verificationCode}</p>
            )}
            <p className={styles.helperText}>
              이메일로 발송된 6자리 인증 코드를 입력하세요 (유효시간: 10분)
            </p>
          </div>

          {/* 새 비밀번호 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              새 비밀번호 <span className={styles.required}>*</span>
            </label>
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
            <label className={styles.label}>
              새 비밀번호 확인 <span className={styles.required}>*</span>
            </label>
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

          {/* 버튼 그룹 */}
          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={handleBack}
              className={styles.backButton}
              disabled={isLoading}
            >
              뒤로가기
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading
                ? '처리 중...'
                : isPasswordSetup
                ? '비밀번호 설정'
                : '비밀번호 변경'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
