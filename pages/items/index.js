import { useEffect, useState } from "react";
import useMaxItems from "@/hooks/useMaxItems";
import ProductList from "@/components/Items/ProductList";
import { getProductList } from "@/lib/api/ProductService";
import { getDeviceTypeInitialCount } from "@/lib/getDeviceTypeInitialCount";
//import styles from '@/styles/ItemPage.module.css';  // 임시 주석 : 베스트 상품시 추가 예정

export async function getServerSideProps(context) {
  const userAgent = context.req.headers['user-agent'];
  const { productCount : initialProductCount } = getDeviceTypeInitialCount(userAgent);
  //console.log('initialProductCount', initialProductCount);

  try {
    const response = await getProductList({ page: 1, pageSize: initialProductCount, orderBy: 'recent' });
    const products = response.list;
    //console.log('products', products);
    
    return {
      props: {
        initialProducts: products,
        initialProductCount: initialProductCount,
      }
    }
  } catch (error) {
    console.log('데이터 로드 오류', error);
    return {
      props: {
        initialProducts: [],
        initialProductCount: 0,
      }
    }
  } 
}

export default function ItemPage({ initialProducts, initialProductCount }) {
  const maxProductCount = useMaxItems() || initialProductCount; // 클라이언트에서만 접근 가능
  const [displayedProducts, setDisplayedProducts] = useState(initialProducts);

  useEffect(() => {
    if (Array.isArray(initialProducts) && maxProductCount) {
      setDisplayedProducts(initialProducts.slice(0, maxProductCount));
    }
  }, [maxProductCount, initialProducts]);

  //console.log('initialProducts', initialProducts);  // 서버에서 콘솔 표시됨


  return (
    <div>
      {/* 
      <h2 className={styles.sectionTitle}>베스트 상품</h2>

      {displayedBestArticles.length > 0 ? (
        <BestArticleList articles={displayedBestArticles} />
      ) : (
        <p>베스트 상품이 없습니다.</p>
      )}
      */}

      <ProductList products={displayedProducts} />
    </div>
  );  
}
