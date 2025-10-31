import instance from './axiosInstance';

/**
 * 인증 코드 발송 API
 * @param {string} email - 이메일
 * @param {'password-setup' | 'password-reset'} type - 인증 타입
 * @returns {Promise<{message: string}>}
 */
export const sendVerificationCode = async (email, type) => {
  try {
    const response = await instance.post('/users/send-verification-code', {
      email,
      type,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 비밀번호 변경/설정 API
 * @param {Object} data
 * @param {string} data.newPassword - 새 비밀번호
 * @param {string} data.verificationCode - 인증 코드
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const changePassword = async (data) => {
  try {
    const response = await instance.patch('/users/me/password', data);
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || '비밀번호 변경에 실패했습니다.';
    return { success: false, error: message };
  }
};

/**
 * 사용자 프로필 정보 업데이트 API
 * @param {Object} data
 * @param {string} [data.nickname] - 닉네임
 * @param {string} [data.image] - 이미지 URL
 * @returns {Promise<Object>} 업데이트된 사용자 정보
 */
export const updateProfile = async (data) => {
  try {
    const response = await instance.patch('/users/me', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  sendVerificationCode,
  changePassword,
  updateProfile,
};
