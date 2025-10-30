import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import ArticleForm from '@/components/Articles/ArticleForm';
import { getArticleById, updateArticle } from '@/lib/api/ArticleService';
import { useAuth } from '@/contexts/AuthProvider';

export default function ArticleEditPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth(true);
  const [initialTitle, setInitialTitle] = useState('');
  const [initialContent, setInitialContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const alertShownRef = useRef(false);

  // 기존 게시글 데이터를 불러오는 함수
  useEffect(() => {
    if (!id || !user || alertShownRef.current) return;

    const fetchArticle = async () => {
      try {
        const article = await getArticleById(id);

        // 본인의 글인지 확인
        if (article.ownerId !== user.id) {
          if (!alertShownRef.current) {
            alertShownRef.current = true;
            alert('본인이 작성한 글만 수정할 수 있습니다.');
          }
          setHasPermission(false);
          setLoading(false);
          return;
        }

        setInitialTitle(article.title);
        setInitialContent(article.content);
        setHasPermission(true);
      } catch (error) {
        console.error(error);
        const errorMessage = error.response?.data?.message || '게시글 정보를 불러오는데 실패했습니다.';
        alert(errorMessage);
        setHasPermission(false);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, user]);

  // 게시글 수정 처리 함수
  const handleUpdateArticle = async (articleData) => {
    try {
      await updateArticle(id, articleData);
      router.push(`/articles/${id}`); // 수정된 게시글 상세 페이지로 이동
    } catch (error) {
      console.error(error);
      // 백엔드에서 반환한 에러 메시지 표시
      const errorMessage = error.response?.data?.message || '게시글 수정에 실패했습니다.';
      alert(errorMessage);

      // 권한이 없는 경우 게시글 상세 페이지로 이동
      if (error.response?.status === 403) {
        router.push(`/articles/${id}`);
      }
    }
  };

  if (loading) return <p>로딩 중...</p>;

  // 권한이 없으면 빈 페이지 표시 (alert는 이미 표시됨)
  if (!hasPermission) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>본인이 작성한 글만 수정할 수 있습니다.</p>
        <button
          onClick={() => router.push(`/articles/${id}`)}
          style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
        >
          게시글로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <ArticleForm
      initialTitle={initialTitle}
      initialContent={initialContent}
      onSubmit={handleUpdateArticle}
      isEdit={true}
    />
  );
}
