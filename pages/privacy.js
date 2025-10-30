import styles from '@/styles/PolicyPage.module.css';

export default function PrivacyPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Privacy Policy</h1>
      <div className={styles.content}>
        <section className={styles.section}>
          <h2>개인정보 수집 및 이용</h2>
          <p>판다마켓은 회원가입, 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다:</p>
          <ul>
            <li>필수 정보: 이메일 주소, 닉네임, 비밀번호</li>
            <li>선택 정보: 프로필 이미지</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>개인정보의 이용 목적</h2>
          <ul>
            <li>회원 가입 및 관리</li>
            <li>서비스 제공 및 운영</li>
            <li>중고거래 및 커뮤니티 서비스 이용</li>
            <li>고객 문의 및 불만 처리</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>개인정보의 보유 및 이용 기간</h2>
          <p>회원 탈퇴 시까지 보유하며, 관계 법령에 따라 일정 기간 보관할 수 있습니다:</p>
          <ul>
            <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
            <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
            <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>개인정보의 제3자 제공</h2>
          <p>판다마켓은 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 아래의 경우는 예외로 합니다:</p>
          <ul>
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>개인정보의 파기</h2>
          <p>개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>
        </section>

        <section className={styles.section}>
          <h2>이용자의 권리</h2>
          <p>이용자는 언제든지 다음과 같은 권리를 행사할 수 있습니다:</p>
          <ul>
            <li>개인정보 열람 요구</li>
            <li>개인정보 정정 요구</li>
            <li>개인정보 삭제 요구</li>
            <li>개인정보 처리정지 요구</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>문의</h2>
          <p>개인정보 처리에 관한 문의사항이 있으시면 아래로 연락해주세요:</p>
          <p>이메일: support@buffso-pandamarket.vercel.app</p>
        </section>

        <p className={styles.lastUpdated}>최종 수정일: 2024년 10월 30일</p>
      </div>
    </div>
  );
}
