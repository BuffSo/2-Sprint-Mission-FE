import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import styles from './Dropdown.module.css';

export default function Dropdown({
  className,
  name,
  value,
  options,
  onChange,
  iconMode = false,
  disabled = false,
  disabledOptions = [],
}) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);

  const handleInputClick = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      const isInside = inputRef.current?.contains(e.target);
      if (!isInside) {
        setIsOpen(false);
      }
    }
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`${iconMode ? styles.iconMode : styles.input} ${isOpen ? styles.opened : ''} ${className}`}
      onClick={handleInputClick}
      ref={inputRef}
    >
      {iconMode ? (
        <Image src="/images/articles/ic_kebab.svg" alt="더보기 메뉴 아이콘" width={24} height={24} />
      ) : (
        <div className={styles.labelWrapper}>
        {options.find((option) => option.value === value)?.label || '선택'}
        <span className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}>▲</span> {/* 화살표 추가 */}
        </div>
      )}
      {isOpen && (
        <div className={`${styles.options} ${iconMode ? styles.iconModeOptions : ''}`}>
          {options.map((option) => {
            const isDisabled = disabledOptions.includes(option.value);
            return (
              <div
                key={option.value}
                className={`${styles.option} ${value === option.value ? styles.selected : ''} ${isDisabled ? styles.disabledOption : ''}`}
                onClick={() => !isDisabled && onChange(name, option.value)}
                style={isDisabled ? { cursor: 'not-allowed', opacity: 0.5, color: '#9CA3AF' } : {}}
              >
                {option.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
