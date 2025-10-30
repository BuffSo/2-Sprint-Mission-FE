import styles from './ArticleInfo.module.css';
import Image from 'next/image';
import { deleteArticle } from '@/lib/api/ArticleService';
import { useRouter } from 'next/router';
import Dropdown from '@/components/Common/Dropdown';
import { useArticle, useArticleFavorite } from '@/lib/hooks/useArticleHooks';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import ModalConfirm from '../Common/ModalConfirm';

export default function ArticleInfo({ articleId, article: initialArticle }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  // 로딩 상태 추가

  // React Query 훅 - 게시글 정보 조회
  // initialArticle이 있으면 initialData로 사용하고 API 호출하지 않음
  const { data: article } = useArticle(articleId, false);
  const { addFavoriteMutation, removeFavoriteMutation } = useArticleFavorite(articleId);

  // props로 받은 article 사용
  const articleData = article || initialArticle;

  //console.log(article);
  // 삭제 핸들러
  const handleDelete = () => {
    setIsModalOpen(true);  // 모달 열기
  };

  const confirmDelete = async () => {
    try {
      await deleteArticle(articleId);
      queryClient.invalidateQueries('articleList');  // 게시글 목록 쿼리 무효화
      router.push('/articles');  // 삭제 후 게시글 목록으로 이동
    } catch (error) {
      const errorMessage = error.response?.data?.message || '게시글 삭제에 실패했습니다.';
      alert(errorMessage);
    } finally {
      setIsModalOpen(false);
    }
  };

  // 수정 핸들러
  const handleEdit = () => {
    router.push(`/articles/edit?id=${articleId}`);
  };

  // 드롭다운 핸들러
  const handleDropdownChange = (name, value) => {
    if (value === 'edit') handleEdit();
    if (value === 'delete') handleDelete();
  };

  // 좋아요 토글 핸들러
  const handleFavoriteToggle = async () => {
    if (isLoading) return;
    setIsLoading(true);

    const previousFavoriteState = articleData.isFavorite;
    const previousLikes = articleData.favoriteCount;

    queryClient.setQueryData(['article', articleId], (oldData) => ({
      ...oldData,
      isFavorite: !previousFavoriteState,
      favoriteCount: previousFavoriteState ? previousLikes - 1 : previousLikes + 1,
    }));

    try {
      if (previousFavoriteState) {
        await removeFavoriteMutation.mutateAsync();
      } else {
        await addFavoriteMutation.mutateAsync();
      }
    } catch (error) {
      console.error('좋아요 상태 변경 실패:', error);
      alert('좋아요 상태 변경에 실패했습니다.');

      // 실패 시 상태 롤백
      queryClient.setQueryData(['article', articleId], (oldData) => ({
        ...oldData,
        isFavorite: previousFavoriteState,
        favoriteCount: previousLikes,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  if (!articleData) return <p>게시글 정보를 불러오는 중입니다...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{articleData.title}</h1>

      <div className={styles.articleInfo}>
        <div className={styles.writerInfo}>
          <div className={styles.nicknameWrapper}>
            <div className={styles.profileIcon}>
              <Image
                src="/images/user_profile.png"
                alt="프로필 이미지"
                fill
                sizes="4rem"
                className={styles.profileImage}
              />
            </div>
            <div className={styles.writerDetails}>
              <span className={styles.nickname}>
                {articleData.ownerNickname || '익명'}
              </span>
              <span className={styles.date}>{new Date(articleData.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* 좋아요 버튼 */}
        <div className={styles.likesWrapper}>
          <div
            className={`${styles.likesIcon} ${isLoading ? styles.disabled : ''}`}
            onClick={handleFavoriteToggle}
          >
            <Image
              src={articleData.isFavorite ? '/images/ic_heart_active.svg' : '/images/articles/ic_heart.svg'}
              alt="좋아요 아이콘"
              fill
              sizes="3.2rem"
              className={styles.heartImage}
            />
          </div>
          <span className={styles.likesCount}>
            {articleData.favoriteCount > 9999 ? '9999+' : articleData.favoriteCount}
          </span>
        </div>

        <div className={styles.dropdownContainer}>
          <Dropdown
            name="articleOptions"
            iconMode={true}
            options={[
              { label: '수정하기', value: 'edit' },
              { label: '삭제하기', value: 'delete' },
            ]}
            value=""
            onChange={handleDropdownChange}
            className={styles.dropdownToggle}
          />
        </div>
      </div>

      <div className={styles.content}>{articleData.content}</div>

      {/* 삭제 확인 모달 */}
      <ModalConfirm
        isOpen={isModalOpen}
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
        message="게시글을 삭제하시겠습니까?"
      />
    </div>
  );
}
