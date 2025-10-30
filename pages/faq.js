import { useState } from 'react';
import styles from '@/styles/PolicyPage.module.css';

const faqs = [
  {
    question: '회원가입은 어떻게 하나요?',
    answer: '상단의 "회원가입" 버튼을 클릭하고 이메일, 닉네임, 비밀번호를 입력하시면 됩니다. 소셜 로그인(Google, Kakao)도 지원합니다.',
  },
  {
    question: '상품은 어떻게 등록하나요?',
    answer: '로그인 후 중고마켓 페이지에서 "상품 등록" 버튼을 클릭하세요. 상품명, 가격, 설명, 이미지를 입력하면 등록이 완료됩니다.',
  },
  {
    question: '등록한 상품을 수정하거나 삭제할 수 있나요?',
    answer: '네, 가능합니다. 본인이 등록한 상품 상세 페이지에서 수정 및 삭제 버튼을 통해 관리할 수 있습니다.',
  },
  {
    question: '게시글 작성은 어떻게 하나요?',
    answer: '자유게시판 페이지에서 "글쓰기" 버튼을 클릭하고 제목과 내용을 입력하세요.',
  },
  {
    question: '댓글을 수정하거나 삭제할 수 있나요?',
    answer: '네, 본인이 작성한 댓글에 한해 수정 및 삭제가 가능합니다. 댓글 우측의 메뉴 버튼을 클릭하세요.',
  },
  {
    question: '좋아요 기능은 어떻게 사용하나요?',
    answer: '상품이나 게시글 상세 페이지에서 하트 아이콘을 클릭하면 좋아요를 등록하거나 취소할 수 있습니다.',
  },
  {
    question: '비밀번호를 잊어버렸어요.',
    answer: '현재 비밀번호 찾기 기능은 준비 중입니다. 고객센터로 문의해주세요.',
  },
  {
    question: '회원 탈퇴는 어떻게 하나요?',
    answer: '마이페이지에서 회원 탈퇴를 진행하실 수 있습니다. 탈퇴 시 모든 개인정보가 삭제됩니다.',
  },
  {
    question: '거래는 어떻게 진행되나요?',
    answer: '판다마켓은 중고거래 플랫폼으로, 실제 거래는 판매자와 구매자 간 직접 진행됩니다. 안전한 거래를 위해 직거래나 안전결제를 권장합니다.',
  },
  {
    question: '부적절한 게시물을 발견했어요.',
    answer: '고객센터로 신고해주시면 검토 후 조치하겠습니다. 이메일: support@buffso-pandamarket.vercel.app',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>자주 묻는 질문 (FAQ)</h1>
      <div className={styles.content}>
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <button
                className={`${styles.faqQuestion} ${openIndex === index ? styles.active : ''}`}
                onClick={() => toggleFAQ(index)}
              >
                <span>Q. {faq.question}</span>
                <span className={styles.faqIcon}>{openIndex === index ? '−' : '+'}</span>
              </button>
              {openIndex === index && (
                <div className={styles.faqAnswer}>
                  <p>A. {faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <section className={styles.section}>
          <h2>추가 문의</h2>
          <p>위 내용으로 해결되지 않는 문제가 있으신가요?</p>
          <p>이메일: support@buffso-pandamarket.vercel.app</p>
        </section>
      </div>
    </div>
  );
}
