import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
  getArticleById,
  addArticleFavorite,
  removeArticleFavorite,
} from '@/lib/api/ArticleService';

/**
 * 게시글 정보 조회 훅
 * @param {string} articleId - 게시글 ID
 * @param {boolean} enabled - API 호출 활성화 여부 (기본값: true)
 */
export function useArticle(articleId, enabled = true) {
  return useQuery({
    queryKey: ['article', articleId],
    queryFn: () => getArticleById(articleId),
    enabled: !!articleId && enabled,  // articleId가 있고 enabled가 true일 때만 호출
    staleTime: 1000 * 60 * 5,  // 5분 동안 데이터 캐싱
    retry: false,  // 401 에러 시 재시도하지 않음
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
