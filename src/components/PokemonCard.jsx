import React from 'react';
import { Star } from 'lucide-react';
import { typeColors } from '../data/types';

/**
 * 재사용 가능한 포켓몬 카드 컴포넌트
 *
 * @param {Object} pokemon - 포켓몬 데이터
 * @param {boolean} isFavorite - 찜 여부
 * @param {Function} onToggleFavorite - 찜하기 토글 함수
 * @param {Function} onClick - 카드 클릭 핸들러
 * @param {boolean} isSelected - 선택 여부 (팀 생성 시)
 * @param {boolean} isDisabled - 비활성화 여부
 */
const PokemonCard = ({
  pokemon,
  isFavorite,
  onToggleFavorite,
  onClick,
  isSelected = false,
  isDisabled = false,
}) => {
  const handleCardClick = () => {
    if (!isDisabled && onClick) {
      onClick(pokemon);
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(pokemon.id);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white rounded-lg p-4 shadow-sm transition-all relative ${
        isSelected
          ? 'ring-2 ring-blue-500 bg-blue-50'
          : isDisabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:shadow-md cursor-pointer'
      }`}
    >
      <button
        onClick={handleFavoriteClick}
        className="absolute top-2 right-2 z-10"
      >
        <Star
          size={20}
          className={isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
        />
      </button>

      <div className="text-5xl text-center mb-2">{pokemon.image}</div>
      <div className="text-center">
        <p className="text-xs text-gray-500">No.{pokemon.id}</p>
        <p className="font-bold text-gray-900">{pokemon.name}</p>
        <p className="text-xs text-gray-600">{pokemon.name_en}</p>
        <div className="flex gap-1 justify-center mt-2 flex-wrap">
          {pokemon.type.map((type) => (
            <span
              key={type}
              className="px-2 py-1 rounded text-xs text-white"
              style={{ backgroundColor: typeColors[type] }}
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
