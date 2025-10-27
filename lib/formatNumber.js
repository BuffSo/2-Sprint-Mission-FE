/**
 * 숫자를 천 단위 콤마 포맷으로 변환
 * @param {number|string} value - 변환할 숫자 또는 문자열
 * @returns {string} 천 단위 콤마가 적용된 문자열
 */
export function formatNumberWithCommas(value) {
  if (!value) return '';

  // 숫자가 아닌 문자 제거 (콤마와 숫자만 남김)
  const numericValue = String(value).replace(/[^\d]/g, '');

  // 숫자를 천 단위로 콤마 추가
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 콤마가 포함된 문자열을 순수 숫자로 변환
 * @param {string} value - 콤마가 포함된 문자열
 * @returns {number} 순수 숫자
 */
export function parseNumberFromFormatted(value) {
  if (!value) return 0;

  // 모든 콤마 제거 후 숫자로 변환
  return parseInt(String(value).replace(/,/g, ''), 10) || 0;
}

/**
 * 입력값에서 숫자만 추출하고 콤마 포맷 적용
 * @param {string} value - 입력값
 * @returns {string} 포맷된 숫자 문자열
 */
export function sanitizeAndFormatNumber(value) {
  // 숫자만 추출
  const numbers = String(value).replace(/[^\d]/g, '');

  // 빈 문자열이면 그대로 반환
  if (!numbers) return '';

  // 콤마 포맷 적용
  return formatNumberWithCommas(numbers);
}
