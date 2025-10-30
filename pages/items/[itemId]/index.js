import { useRouter } from "next/router";
import BackButton from "@/components/Common/BackButton";
import ProductInfo from "@/components/ItemDetail/ProductInfo";
import styles from "@/styles/ItemDetailPage.module.css";
import ProductCommentList from "@/components/ItemDetail/ProductCommentList";
import ProductCommentForm from "@/components/ItemDetail/ProductCommentForm";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthProvider";
import { useProduct } from "@/lib/hooks/useProductHooks";

export default function ItemDetailPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { itemId: id } = router.query;

  // 로그인 필수 페이지
  const { user, isPending } = useAuth(true);

  // 인증이 완료되고 사용자가 있을 때만 상품 데이터 불러오기
  const { data: product, isLoading, isError } = useProduct(id, !isPending && !!user);

  // 인증 확인 중이거나 라우터 준비 안 됨
  if (!router.isReady || isPending) {
    return <p>상품 정보를 불러오는 중입니다....</p>;
  }

  // 인증되지 않은 사용자는 여기까지 오지 않음 (useAuth가 리다이렉트)
  if (!user) {
    return null;
  }

  if (!id) return <p>유효한 상품 ID가 없습니다.</p>;

  if (isLoading) return <p>상품 정보를 불러오는 중입니다....</p>;
  if (isError || !product) return <p>상품 정보를 불러오는 데 실패했습니다.</p>;

  const handleBack = () => {
    queryClient.invalidateQueries("productList");
    router.push("/items");
  }

  return (
    <div className={styles.container}>
      <ProductInfo productId={id} product={product} />
      <ProductCommentForm productId={id} />
      <ProductCommentList productId={id} />
      <BackButton onClick={handleBack} />
    </div>
  );
}

/*  상품 정보를 SSR 로 하면 localStorage의 accessToken 문제로 
 *  Authorization header 를 보낼 수 없음 
 */
/*
import BackButton from "@/components/Common/BackButton";
import ProductInfo from "@/components/ItemDetail/ProductInfo";
import { getProduct } from "@/lib/api/ProductService";
import { useRouter } from "next/router"
import styles from "@/styles/ItemDetailPage.module.css";
import ProductCommentList from "@/components/ItemDetail/ProductCommentList";
import ProductCommentForm from "@/components/ItemDetail/ProductCommentForm";

export async function getServerSideProps(context) {
  const id = context.query['itemId'];
  const product = await getProduct(id);
  
  return {
    props: {
      product: product || {}, // 제품 데이터가 없을 경우 빈 객체 전달
      id, 
    }
  }
}
export default function ItemDetailPage( {id, product }) {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <ProductInfo product={product} />              
      <ProductCommentForm productId={id} />          
      <ProductCommentList productId={id} />           
      <BackButton onClick={() => router.push('/items')} />
    </div>
  )
}
*/