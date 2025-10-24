import React, { useState, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';

/**
 * 아이템 상세 정보 모달 컴포넌트
 */
const ItemModal = ({ item, onClose }) => {
  const [mapImageSrc, setMapImageSrc] = useState(null);
  const [mapImageError, setMapImageError] = useState(false);

  useEffect(() => {
    if (!item) return;

    // 아이템 이름을 기반으로 지도 이미지 경로 생성
    // 괄호와 특수문자 제거, 공백을 하이픈으로 변환
    const itemNameForPath = item.name
      .replace(/\([^)]*\)/g, '') // 괄호와 내용 제거
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-'); // 공백을 하이픈으로

    const extensions = ['png', 'jpg', 'jpeg', 'webp'];

    // 첫 번째 확장자로 시도
    const tryLoadImage = (index = 0) => {
      if (index >= extensions.length) {
        setMapImageError(true);
        return;
      }

      const img = new Image();
      const src = `/images/maps/${itemNameForPath}.${extensions[index]}`;

      img.onload = () => {
        setMapImageSrc(src);
        setMapImageError(false);
      };

      img.onerror = () => {
        tryLoadImage(index + 1);
      };

      img.src = src;
    };

    setMapImageError(false);
    setMapImageSrc(null);
    tryLoadImage();
  }, [item]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-5xl w-full p-6 max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <X size={24} />
        </button>

        {/* 좌우 분할 레이아웃 */}
        <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-6">
          {/* 좌측: 아이템 정보 */}
          <div className="flex flex-col min-h-[500px]">
            {/* 아이템 이름 정보 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{item.name}</h2>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {item.category}
              </span>
            </div>

            <div className="flex-1 flex items-center justify-center my-6">
              <div className="text-[min(20vw,180px)]">{item.image}</div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <MapPin size={18} />
                획득 위치
              </h3>
              <div className={`${item.color} p-4 rounded-lg`}>
                <p className="text-gray-800">{item.location}</p>
              </div>
            </div>
          </div>

          {/* 우측: 지도 이미지 */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">위치 지도</h3>
            <div className="bg-gray-50 rounded-lg p-4 flex-1 flex items-center justify-center min-h-[400px]">
              {mapImageSrc && !mapImageError ? (
                <img
                  src={mapImageSrc}
                  alt={`${item.name} 획득 지도`}
                  className="max-w-full max-h-full object-contain rounded"
                />
              ) : (
                <div className="text-center">
                  <div className="text-8xl mb-2">🗺️</div>
                  <p className="text-gray-500 text-sm">지도 이미지 준비 중</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;
