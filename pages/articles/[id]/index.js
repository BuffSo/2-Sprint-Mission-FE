import { useRouter } from 'next/router';
import ArticleInfo from '@/components/ArticleDetail/ArticleInfo';
import BackButton from '@/components/Common/BackButton';
import ArticleCommentForm from '@/components/ArticleDetail/ArticleCommentForm';
import ArticleCommentList from '@/components/ArticleDetail/ArticleCommentList';
import { useArticle } from '@/lib/hooks/useArticleHooks';
import { useAuth } from '@/contexts/AuthProvider';
import styles from '@/styles/ArticleDetailPage.module.css';

export default function ArticleDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  // 로그인 필수 페이지
  const { user, isPending } = useAuth(true);

  // 인증이 완료되고 사용자가 있을 때만 게시글 데이터 불러오기
  // enabled 옵션으로 API 호출을 제어
  const { data: article, isLoading, isError } = useArticle(id, !isPending && !!user);

  // 인증 확인 중이거나 라우터 준비 안 됨
  if (!router.isReady || isPending) {
    return <p>게시글 정보를 불러오는 중입니다....</p>;
  }

  // 인증되지 않은 사용자는 여기까지 오지 않음 (useAuth가 리다이렉트)
  // 하지만 방어적 코드로 추가
  if (!user) {
    return null;
  }

  if (isLoading) return <p>게시글 정보를 불러오는 중입니다....</p>;
  if (isError || !article) return <p>게시글이 존재하지 않습니다.</p>;

  return (
    <div className={styles.container}>
      <ArticleInfo articleId={id} article={article} />  {/* 게시글 주요 정보 */}
      <ArticleCommentForm articleId={id} />  {/* 댓글 작성 및 등록 */}
      <ArticleCommentList articleId={id} />  {/* 댓글 리스트 */}
      <BackButton onClick={() => router.push('/articles')} />
    </div>
  );
}

/*
import { getArticleById } from '@/lib/api/ArticleService';
import ArticleInfo from '@/components/ArticleDetail/ArticleInfo';
import BackButton from '@/components/Common/BackButton';
import { generateRandomNickname, getRandomInt } from '@/lib/utils';
import formatDate from '@/lib/formatDate';
import styles from '@/styles/ArticleDetailPage.module.css';
import { useRouter } from 'next/router';
import ArticleCommentForm from '@/components/ArticleDetail/ArticleCommentForm';
import ArticleCommentList from '@/components/ArticleDetail/ArticleCommentList';

export async function getServerSideProps(context) {
  const id = context.query['id'];
  const data = await getArticleById(id);

  // 필요한 추가 정보 설정
  const articleWithExtras = {
    ...data,
    imageUrl: '/images/articles/img_default_article.png', // 기본 이미지 경로
    nickname: data.author.nickname, // 랜덤 닉네임 생성
    likes: data.favoriteCount, // 랜덤 좋아요 수
    formattedDate: formatDate(data.createdAt) // 포맷된 날짜
  };

  return {
    props: {
      articleWithExtras, 
      id,
    },
  }
}

export default function ArticleDetailPage({id, articleWithExtras : article }) {
  const router = useRouter();
  if (!article) return <p>게시글이 존재하지 않습니다.</p>;

  return (
    <div className={styles.container}>
      <ArticleInfo articleId={id} />                 
      <ArticleCommentForm articleId={id} />                    
      <ArticleCommentList articleId={id} />
      <BackButton onClick={() => router.push('/articles')} />
    </div>
  );
}
*/