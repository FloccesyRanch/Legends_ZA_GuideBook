import React, { useState } from 'react';

/**
 * 이미지를 로드하고 실패 시 emoji로 폴백하는 컴포넌트
 *
 * @param {Object} props
 * @param {string} props.src - 이미지 경로
 * @param {string} props.fallback - 이미지 로드 실패 시 표시할 emoji
 * @param {string} props.alt - 이미지 alt 텍스트
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {Object} [props.style] - 인라인 스타일
 */
const ImageWithFallback = ({ src, fallback, alt, className = '', style = {} }) => {
  const [hasError, setHasError] = useState(false);

  // 이미지 로드 실패 시 emoji로 폴백
  if (hasError || !src) {
    return (
      <div className={className} style={style}>
        {fallback}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setHasError(true)}
    />
  );
};

export default ImageWithFallback;
