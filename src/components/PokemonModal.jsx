import React from 'react';
import { X, MapPin, Star } from 'lucide-react';
import { typeColors } from '../data/types';

/**
 * 포켓몬 상세 정보 모달 컴포넌트
 */
const PokemonModal = ({ pokemon, isFavorite, onToggleFavorite, onClose }) => {
  if (!pokemon) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
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

        <div className="text-6xl text-center mb-6">{pokemon.image}</div>

        <div className="mb-6">
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

        <div className="mb-6">
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
    </div>
  );
};

export default PokemonModal;
