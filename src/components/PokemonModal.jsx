import React, { useState, useEffect } from 'react';
import { X, MapPin, Star } from 'lucide-react';
import { typeColors } from '../data/types';

/**
 * 포켓몬 상세 정보 모달 컴포넌트
 */
const PokemonModal = ({ pokemon, isFavorite, onToggleFavorite, onClose }) => {
  const [mapImageSrc, setMapImageSrc] = useState(null);
  const [mapImageError, setMapImageError] = useState(false);

  useEffect(() => {
    if (!pokemon) return;

    // 포켓몬 영문명을 기반으로 지도 이미지 경로 생성
    const pokemonNameLower = pokemon.name_en.toLowerCase().replace(/\s+/g, '-');
    const extensions = ['png', 'jpg', 'jpeg', 'webp'];

    // 첫 번째 확장자로 시도
    const tryLoadImage = (index = 0) => {
      if (index >= extensions.length) {
        setMapImageError(true);
        return;
      }

      const img = new Image();
      const src = `/images/maps/${pokemonNameLower}.${extensions[index]}`;

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
  }, [pokemon]);

  if (!pokemon) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 헤더 */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-500">No.{pokemon.id}</p>
            <h2 className="text-2xl font-bold text-gray-900">{pokemon.name}</h2>
            <p className="text-gray-600">{pokemon.name_en}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* 좌우 분할 레이아웃 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 좌측: 기존 정보들 */}
          <div className="space-y-6">
            <div className="text-6xl text-center">{pokemon.image}</div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">타입</h3>
              <div className="flex gap-2">
                {pokemon.type.map((type) => (
                  <span
                    key={type}
                    className="px-4 py-2 rounded text-white font-medium"
                    style={{ backgroundColor: typeColors[type] }}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <MapPin size={18} />
                출현 위치
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800">{pokemon.location}</p>
              </div>
            </div>

            <button
              onClick={() => onToggleFavorite(pokemon.id)}
              className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                isFavorite
                  ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Star size={20} className={isFavorite ? 'fill-current' : ''} />
              {isFavorite ? '찜 해제' : '찜하기'}
            </button>
          </div>

          {/* 우측: 지도 이미지 */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">위치 지도</h3>
            <div className="bg-gray-50 rounded-lg p-4 flex-1 flex items-center justify-center min-h-[300px]">
              {mapImageSrc && !mapImageError ? (
                <img
                  src={mapImageSrc}
                  alt={`${pokemon.name} 출현 지도`}
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

export default PokemonModal;
