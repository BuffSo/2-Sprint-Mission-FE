import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
  getArticleById,
  addArticleFavorite,
  removeArticleFavorite,
} from '@/lib/api/ArticleService';

/**
 * 게시글 정보 조회 훅
 * @param {string} articleId
 */
export function useArticle(articleId) {
  return useQuery({
    queryKey: ['article', articleId],
    queryFn: () => getArticleById(articleId),
    enabled: !!articleId,  // articleId가 있을 때만 호출
    staleTime: 1000 * 60 * 5,  // 5분 동안 데이터 캐싱
  });
}

/**
 * 게시글 좋아요 훅
 * @param {string} articleId
 */
export function useArticleFavorite(articleId) {
  const queryClient = useQueryClient();

  const addFavoriteMutation = useMutation({
    mutationFn: () => addArticleFavorite(articleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article', articleId] });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: () => removeArticleFavorite(articleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article', articleId] });
    },
  });

  return { addFavoriteMutation, removeFavoriteMutation };
}
