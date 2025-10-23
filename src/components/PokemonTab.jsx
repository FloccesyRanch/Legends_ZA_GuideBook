import React, { useState, useMemo } from 'react';
import { Search, Star } from 'lucide-react';
import { pokemonData } from '../data/pokemon';
import PokemonCard from './PokemonCard';

/**
 * 포켓몬 도감 탭 컴포넌트
 */
const PokemonTab = ({ favorites, toggleFavorite, onPokemonClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTypes, setFilterTypes] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const uniqueTypes = ['전체', ...new Set(pokemonData.flatMap((p) => p.type))];

  const toggleTypeFilter = (type) => {
    if (type === '전체') {
      setFilterTypes([]);
    } else {
      if (filterTypes.includes(type)) {
        setFilterTypes(filterTypes.filter((t) => t !== type));
      } else if (filterTypes.length < 2) {
        setFilterTypes([...filterTypes, type]);
      }
    }
  };

  const filteredPokemon = useMemo(() => {
    let pokemon = pokemonData;

    if (showOnlyFavorites) {
      pokemon = pokemon.filter((p) => favorites.includes(p.id));
    }

    return pokemon.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.name_en.toLowerCase().includes(searchTerm.toLowerCase());

      const matchType =
        filterTypes.length === 0 || filterTypes.every((selectedType) => p.type.includes(selectedType));

      return matchSearch && matchType;
    });
  }, [searchTerm, filterTypes, favorites, showOnlyFavorites]);

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="포켓몬 이름으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <div className="flex gap-2 items-center flex-wrap">
          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
              showOnlyFavorites
                ? 'bg-yellow-400 text-gray-900'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Star size={16} className={showOnlyFavorites ? 'fill-current' : ''} />
            찜한 포켓몬만 ({favorites.length})
          </button>
          <div className="flex gap-2 overflow-x-auto pb-2 flex-1">
            <button
              onClick={() => toggleTypeFilter('전체')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filterTypes.length === 0
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              전체
            </button>
            {uniqueTypes
              .filter((t) => t !== '전체')
              .map((type) => (
                <button
                  key={type}
                  onClick={() => toggleTypeFilter(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    filterTypes.includes(type)
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {type}
                </button>
              ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredPokemon.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            isFavorite={favorites.includes(pokemon.id)}
            onToggleFavorite={toggleFavorite}
            onClick={onPokemonClick}
          />
        ))}
      </div>

      {filteredPokemon.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {showOnlyFavorites
            ? '찜한 포켓몬이 없습니다. 별 아이콘을 눌러 포켓몬을 찜해보세요!'
            : '검색 결과가 없습니다.'}
        </div>
      )}
    </>
  );
};

export default PokemonTab;
