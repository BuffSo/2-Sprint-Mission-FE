import { useEffect, useState } from 'react';
import CommentItem from './ArticleCommentItem';
import Image from 'next/image';
import styles from './ArticleCommentList.module.css';
import CommentForm from './ArticleCommentForm';
import { getArticleComments } from '@/lib/api/ArticleService';

export default function ArticleCommentList({ articleId }) {
  const [commentList, setCommentList] = useState([]);
  const [editingComment, setEditingComment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 댓글 목록 불러오기
  useEffect(() => {
    const fetchComments = async () => {
      if (!articleId) {
        setError('유효하지 않은 게시글 ID입니다.');
        setIsLoading(false);
        setCommentList([]);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const response = await getArticleComments(articleId, 10); // limit 설정
        const { list } = response;
        setCommentList(Array.isArray(list) ? list : []);
      } catch (error) {
        setError('댓글을 불러오는 데 실패했습니다.');
        setCommentList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [articleId]);

  // 댓글 삭제 처리
  const handleDeleteComment = (commentId) => {
    setCommentList((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId)
    );
  };

  // 댓글 수정 모드 진입
  const handleEditComment = (comment) => {
    setEditingComment(comment);
  };

  // 댓글 수정 완료
  const handleUpdateComment = (updatedComment) => {
    setCommentList((prevComments) =>
      prevComments.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment
      )
    );
    setEditingComment(null); // 수정 모드 해제
  };

  if (isLoading) return <p>댓글을 불러오는 중입니다...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {commentList.length === 0 ? (
        <div className={styles.noComments}>
          <div className={styles.iconWrapper}>
            <Image
              src="/images/articles/Img_reply_empty.svg"
              alt="댓글 없음"
              fill
              sizes="10rem"
            />
          </div>
          <p>아직 댓글이 없습니다.<br />첫 댓글을 남겨보세요!</p>
        </div>
    ) : (
      <div className={styles.hasComments}>
      {commentList.map((comment) => (
        editingComment && editingComment.id === comment.id ? (
          // 수정 중인 댓글에 대해서는 CommentForm을 렌더링
          <CommentForm
            key={comment.id}
            articleId={comment.articleId}
            initialComment={editingComment}
            onUpdateComment={handleUpdateComment} // 수정 완료 함수 전달
          />
        ) : (
          // 수정 중이 아닌 댓글에 대해서는 CommentItem을 렌더링
          <CommentItem
            key={comment.id}
            comment={comment}
            onDelete={handleDeleteComment}
            onEdit={handleEditComment} // 수정 모드 활성화 함수 전달
          />
        )
      ))}
    </div>
  )}
</div>
);
}