import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProductList,
  getProduct,
  addProductFavorite,
  removeProductFavorite
} from '@/lib/api/ProductService';

export function useProductList(page = 1, pageSize = 10, orderBy = "recent", keyword = "") {
  return useQuery({
    queryKey: ["productList", page, pageSize, orderBy, keyword],
    queryFn: () => getProductList({ page, pageSize, orderBy, keyword }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    //select: (data) => data.list, // 제품 목록만 반환
    refetchInterval: 30000,      // 30초마다 데이터 리프레시
  });
}

/**
 * 상품 정보 조회 훅
 * @param {string} id - 상품 ID
 * @param {boolean} enabled - API 호출 활성화 여부 (기본값: true)
 */
export function useProduct(id, enabled = true) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    enabled: !!id && enabled, // id가 있고 enabled가 true일 때만 요청
    staleTime: 1000 * 60 * 5,
    select: (data) => data,
    retry: false, // 401 에러 시 재시도하지 않음
  });
}

export function useProductFavorite(productId) {
  const queryClient = useQueryClient();

  const addFavoriteMutation = useMutation({
    mutationFn: () => addProductFavorite(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] }); // 제품 데이터 갱신
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: () => removeProductFavorite(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] }); // 제품 데이터 갱신
    },
  });

  return { addFavoriteMutation, removeFavoriteMutation };
}
