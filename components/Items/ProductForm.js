import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './ProductForm.module.css';
import useValidateProductForm from '@/hooks/useValidateProductForm';
import { useRouter } from 'next/router';

export default function ProductForm({ initialData = {}, onSubmit, isEdit = false }) {
  const router = useRouter();

  //console.log('initialData', initialData);
  //  초기 상태 설정
  const { productData, setProductData, errors, handleChange, isFormValid } = useValidateProductForm({
    name: initialData.name || '',
    description: initialData.description || '',
    price: initialData.price || '',
    tags: initialData.tags || [],
    images: initialData.images || [], 
  });

  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState(initialData.images || []);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const fileInputRef = useRef(null);
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if ( previewImages.length + files.length > 2) {
      alert('이미지는 최대 2개까지 업로드 가능합니다.');
      return;
    }

    const imagePreviews = files.map((file) => URL.createObjectURL(file));
    //파일 객체 업데이트
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    // 미리보기 이미지 업데이트
    setPreviewImages((prevImages) => [...prevImages, ...imagePreviews]);
  }

  // // 이미지 제거
  // const removeImage = (index) => {
  //   const updatedFiles = [...selectedFiles];
  //   updatedFiles.splice(index, 1);
  //   setSelectedFiles(updatedFiles);

  //   const updatedImages = [...previewImages];
  //   updatedImages.splice(index, 1);
  //   setPreviewImages(updatedImages);

  // // 기존 이미지 URL이라면 removedImages에 추가
  // if (productData.images[index]) {
  //   setRemovedImages((prev) => [...prev, productData.images[index]]);
  // }    
  //   // 메모리 누수 방지를 위해 URL 객체 해제
  //   URL.revokeObjectURL(previewImages[index]);
  // }

  const removeImage = (index) => {
    const isExistingImage = index < productData.images.length;  // 기존 이미지인지 확인
  
    // 기존 이미지 제거
    if (isExistingImage) {
      const removedUrl = productData.images[index];
      setRemovedImages((prev) => [...prev, removedUrl]);  // 제거 목록에 추가
      setProductData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    } else {
      // 새로 추가된 이미지 제거
      const updatedFiles = [...selectedFiles];
      updatedFiles.splice(index - productData.images.length, 1);  // 새 이미지 인덱스 조정
      setSelectedFiles(updatedFiles);
    }
  
    // 미리보기 이미지도 제거
    const updatedImages = [...previewImages];
    updatedImages.splice(index, 1);
    setPreviewImages(updatedImages);
  };
  
   const nameInputRef = useRef(null);

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;  // 중복 제출 방지

    setIsSubmitting(true);

    if(!productData.name) {
      alert('상품명을 입력해 주세요.(productForm.js)');
      setIsSubmitting(false);
      return;
    }
    // 이미지 파일을 FormData로 변환
    const formData = new FormData();
    formData.append('name', productData.name || '');
    formData.append('description', productData.description || '');
    formData.append('price', parseInt(productData.price) || 0);

    productData.tags.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });

    // 새 파일 업로드
    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => {
        formData.append('images', file);  // 새 이미지 파일 추가
      });
    }

    // 기존 이미지 URL을 JSON 형태로 직렬화
    if (productData.images.length > 0) {
      formData.append('existingImages', JSON.stringify(productData.images));
    }  

    // 제거된 이미지 URL 전송
    if (removedImages.length > 0) {
      formData.append('removedImages', JSON.stringify(removedImages));
    }
      
    // console.log('FormData Entries:');
    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}:`, value);
    // }
     
    const payload = formData;
    console.log('Payload:', payload);

    try {
      if (isEdit) {
        await onSubmit(payload);
        alert('상품이 성공적으로 수정되었습니다!');
      } else {
        await onSubmit(payload);
        alert('상품이 성공적으로 등록되었습니다!');
      }
      router.push('/items');
    } catch (error) {
      console.error('서버 요청 실패', error);
      alert('작업에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleTagInputChange = (e) => setTagInput(e.target.value);

  // 태그 입력 및 추가
  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (productData.tags.includes(tagInput.trim())) {
        alert('이미 추가된 태그입니다.');
        return;
      }      
      if (tagInput.trim().length > 5) {
        alert('태그는 5글자 이내로 입력해 주세요.');
        return;
      }
      setProductData((prevData) => ({
        ...prevData,
        tags: [...prevData.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  // 태그 제거
  const handleRemoveTag = (index) => {
    const updatedTags = [...productData.tags];
    updatedTags.splice(index, 1);
    setProductData({ ...productData, tags: updatedTags });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>{isEdit ? '상품 수정하기' : '상품 등록하기'}</h2>
        <button
          type="submit"
          className={`${styles.submitBtn} ${isFormValid ? styles.active : ''}`}
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? (isEdit ? '수정 중' : '등록 중') : (isEdit ? '수정' : '등록')}
        </button>
      </div>
      <form onSubmit={handleSubmit} className={styles.form} encType='multipart/form-data'>


      <label className={styles.label} htmlFor="images">*상품 이미지</label>
        <div className={styles.imageUploadContainer}>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept='image/*'
            hidden
            onChange={handleFileChange}
          />
          <div className={styles.imageUploadBox} onClick={() => fileInputRef.current.click()}>
            <div className={styles.iconWrapper}>
              <Image
                src="/images/ic_plus.svg"
                alt="이미지 등록"
                fill
              />
            </div>
            <p className={styles.uploadText}>이미지 등록</p>
          </div>
          {previewImages.map((src, index) => (
            <div key={index} className={styles.previewContainer}>
              <Image
                src={src}
                alt={`preview-${index}`}
                width={100}
                height={100}
                className={styles.previewImage}
              />
              <button
                type="button"
                className={styles.removeImageButton}
                onClick={() => removeImage(index)}
              >
                <div className={styles.iconWrapperX}>
                  <Image
                    src="/images/ic_X.svg"
                    alt="이미지 제거"
                    fill
                  />
                </div>
              
              </button>
            </div>
          ))}     
        </div>


        <label className={styles.label} htmlFor="name">*상품명</label>
        <input
          id="name"
          type="text"
          name="name"
          className={`${styles.input} ${errors.name ? styles.errorInput : ''}`}
          placeholder="상품명을 입력해 주세요"
          value={productData.name}
          onChange={handleChange}
          //ref={nameInputRef}
        />
        {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}

        <label className={styles.label} htmlFor="description">*상품 소개</label>
        <textarea
          id="description"
          name="description"
          className={`${styles.textarea} ${errors.description ? styles.errorInput : ''}`}
          placeholder="상품 소개를 입력해 주세요"
          value={productData.description}
          onChange={handleChange}
        />
        {errors.description && <p className={styles.errorMessage}>{errors.description}</p>}

        <label className={styles.label} htmlFor="price">*판매가격</label>
        <input
          id="price"
          type="text"
          name="price"
          className={`${styles.input} ${errors.price ? styles.errorInput : ''}`}
          placeholder="판매 가격을 입력해 주세요"
          value={productData.price}
          onChange={handleChange}
        />
        {errors.price && <p className={styles.errorMessage}>{errors.price}</p>}

        <label className={styles.label} htmlFor="tags">태그</label>
        <input
          id="tags"
          type="text"
          name="tags"
          className={`${styles.input} ${errors.tags ? styles.errorInput : ''}`}
          placeholder="태그를 입력해 주세요"
          value={tagInput}
          onChange={handleTagInputChange}
          onKeyDown={handleTagInputKeyDown}
        />
        {errors.tags && <p className={styles.errorMessage}>{errors.tags}</p>}
        
        <div className={styles.tags}>
          {productData.tags.map((tag, index) => (
            <div key={index} className={styles.tag}>
              {tag}
              <div className={styles.removeTagIconWrapper}>
                <Image
                  src="/images/items/ic_X.png"
                  alt="태그 제거"
                  fill
                  className={styles.removeTagButton}
                  onClick={() => handleRemoveTag(index)}
                />
              </div>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}
