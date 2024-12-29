import { useRouter } from 'next/router';
import { createProduct } from '@/lib/api/ProductService';
import ProductForm from '@/components/Items/ProductForm';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function RegisterProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 제출 시 호출되는 함수
  const handleCreateProduct = async (productData) => {
    if (isSubmitting) return;  // 중복 제출 방지
    setIsSubmitting(true);

    try {
      // 상품 생성 API 호출
      const createdProduct = await createProduct(productData);

      // 상품 생성 후, 상품 목록 쿼리 무효화
      queryClient.invalidateQueries('productList');

      // 상품 등록 후, 생성된 상품의 상세 페이지로 이동
      router.push(`/items/${createdProduct.id}`);
    } catch (error) {
      console.error(error);
      alert('상품 등록에 실패했습니다.');
    }
  };

  return (
    <ProductForm onSubmit={handleCreateProduct} isSubmitting={isSubmitting} />
  );
}
