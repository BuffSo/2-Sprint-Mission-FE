import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductForm from '@/components/Items/ProductForm'; //
import { getProduct, updateProduct } from '@/lib/api/ProductService';
import { useQueryClient } from '@tanstack/react-query';

export default function ProductEditPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = router.query; // URL의 id 파라미터로부터 상품 ID를 가져옴
  const [initialData, setInitialData] = useState(null); // 초기 상품 데이터를 저장
  const [loading, setLoading] = useState(true);

  // 기존 상품 데이터를 불러오는 함수
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const product = await getProduct(id);

          setInitialData(product); // 초기 데이터 설정
        } catch (error) {
          console.error(error);
          alert('상품 정보를 불러오는데 실패했습니다.');
          //router.push('/items');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, router]);

  const handleUpdateProduct = async (productData) => {
    
    try {
      // 상품 수정 시 ID는 URL에, formData는 Body로 전달
      await updateProduct(initialData.id, productData);  

      // 수정 후 상품 리스트 쿼리 무효화
      queryClient.invalidateQueries(['productList']);
      // alert("상품이  수정되었습니다.");
      // router.push('/items');
    } catch (error) {
      console.error('상품 수정 실패:', error);
      //alert('상품 수정에 실패했습니다.');
      throw error;
    }
  };
  
  
  if (loading) return <p>로딩 중...</p>;

  return (
    <ProductForm
      initialData={initialData}
      onSubmit={handleUpdateProduct}
      isEdit={true}
    />
  );
}
