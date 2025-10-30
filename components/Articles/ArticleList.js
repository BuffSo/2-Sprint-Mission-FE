import styles from './ArticleList.module.css';
import Image from 'next/image';
import SearchBar from '@/components/Common/SearchBar';
import Dropdown from '@/components/Common/Dropdown';
import { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getArticleList } from '@/lib/api/ArticleService';
import formatDate from '@/lib/formatDate';
import Link from 'next/link';

const ARTICLE_COUNT = 5;

export default function ArticleList({ initialArticles }) {
  const [sortOrder, setSortOrder] = useState('recent');
  const [searchKeyword, setSearchKeyword] = useState('');
  const observerTarget = useRef(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['articles', sortOrder],
    queryFn: async ({ pageParam = 1 }) => {
      const data = await getArticleList({
        page: pageParam,
        pageSize: ARTICLE_COUNT,
        orderBy: sortOrder
      });
      return {
        articles: data.map((article) => ({
          ...article,
          imageUrl: '/images/articles/img_default_article.png',
          nickname: article.author.nickname,
          likes: article.favoriteCount,
          formattedDate: formatDate(article.createdAt),
        })),
        nextPage: data.length === ARTICLE_COUNT ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5분
  });

  // 무한 스크롤 옵저버
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allArticles = data?.pages.flatMap((page) => page.articles) || [];

  const filteredArticles = searchKeyword
    ? allArticles.filter((article) =>
        article.title.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    : allArticles;

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
  };

  const handleDropdownChange = (name, value) => {
    setSortOrder(value);
  };

  if (isLoading) {
    return <div className='content-spacer'><p>로딩 중...</p></div>;
  }

  if (error) {
    return <p className={styles.error}>게시글을 불러오는 데 문제가 발생했습니다.</p>;
  }

  return (
    <div className={`${styles.articleContainer} ${filteredArticles.length === 0 ? styles.noArticles : ''}`}>
      <div className={styles.controls}>
        <SearchBar initialValue="" onSearch={handleSearch} />
        <Dropdown
          className={styles.dropdown}
          name="sortOrder"
          value={sortOrder}
          options={[
            { label: '최신순', value: 'recent' },
            { label: '좋아요 순', value: 'favorite' },
          ]}
          onChange={handleDropdownChange}
        />
      </div>

      <ul className={styles.articleList}>
        {filteredArticles.map((article) => (
          <li key={article.id} className={styles.articleItem}>
            <div className={styles.articleWrapper}>
              <div className={styles.articleTop}>
                <Link href={`/articles/${article.id}`} passHref>
                  <h3 className={styles.articleTitle}>{article.title}</h3>
                </Link>
                <Link href={`/articles/${article.id}`} passHref>
                  <div className={styles.articleImageWrapper}>
                    <Image
                      src={article.imageUrl}
                      alt="게시글 이미지"
                      fill
                      sizes="8rem"
                      className={styles.articleImage}
                    />
                  </div>
                </Link>
              </div>

              <div className={styles.articleBottom}>
                <div className={styles.articleInfo}>
                  <div className={styles.nicknameWrapper}>
                    <div className={styles.profileIcon}>
                      <Image
                        src="/images/user_profile.png"
                        alt="프로필 이미지"
                        fill
                        sizes="2.4rem"
                      />
                    </div>
                    <span className={styles.nickname}>{article.nickname}</span>
                  </div>
                  <span className={styles.date}>{article.formattedDate}</span>
                </div>
                <div className={styles.likes}>
                  <div className={styles.likesIcon}>
                    <Image
                      src="/images/articles/ic_heart.svg"
                      alt="좋아요 아이콘"
                      fill
                      sizes="2.4rem"
                    />
                  </div>
                  {article.favoriteCount > 9999 ? '9999+' : article.favoriteCount}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* 무한 스크롤 트리거 */}
      <div ref={observerTarget} className={styles.loadMoreTrigger}>
        {isFetchingNextPage && <p>더 불러오는 중...</p>}
      </div>

      {!hasNextPage && filteredArticles.length > 0 && (
        <p className={styles.endMessage}>모든 게시글을 불러왔습니다.</p>
      )}
    </div>
  );
}
