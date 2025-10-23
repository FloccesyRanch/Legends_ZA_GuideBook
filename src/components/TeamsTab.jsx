import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Edit2, Check, X, Search, Star } from 'lucide-react';
import { pokemonData } from '../data/pokemon';
import { typeColors } from '../data/types';
import { analyzeTeam } from '../utils/teamAnalyzer';
import PokemonCard from './PokemonCard';
import TeamAnalysis from './TeamAnalysis';

/**
 * 팀 관리 탭 컴포넌트
 */
const TeamsTab = ({ teams, setTeams, favorites, toggleFavorite }) => {
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [currentTeam, setCurrentTeam] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTypes, setFilterTypes] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const uniqueTypes = ['전체', ...new Set(pokemonData.flatMap((p) => p.type))];

  const startCreatingTeam = () => {
    setIsCreatingTeam(true);
    setCurrentTeam([]);
    setTeamName('');
    setEditingTeamId(null);
    setSearchTerm('');
    setFilterTypes([]);
    setShowOnlyFavorites(false);
  };

  const addToCurrentTeam = (pokemon) => {
    if (currentTeam.length < 6 && !currentTeam.find((p) => p.id === pokemon.id)) {
      setCurrentTeam([...currentTeam, pokemon]);
    }
  };

  const removeFromCurrentTeam = (id) => {
    setCurrentTeam(currentTeam.filter((p) => p.id !== id));
  };

  const saveTeam = () => {
    if (currentTeam.length === 0 || !teamName.trim()) return;

    const newTeam = {
      id: editingTeamId || Date.now(),
      name: teamName,
      pokemon: currentTeam,
      createdAt: new Date().toISOString(),
    };

    let newTeams;
    if (editingTeamId) {
      newTeams = teams.map((t) => (t.id === editingTeamId ? newTeam : t));
    } else {
      newTeams = [...teams, newTeam];
    }

    setTeams(newTeams);
    localStorage.setItem('teams', JSON.stringify(newTeams));
    setIsCreatingTeam(false);
    setCurrentTeam([]);
    setTeamName('');
    setEditingTeamId(null);
    setSearchTerm('');
    setFilterTypes([]);
    setShowOnlyFavorites(false);
  };

  const deleteTeam = (id) => {
    const newTeams = teams.filter((t) => t.id !== id);
    setTeams(newTeams);
    localStorage.setItem('teams', JSON.stringify(newTeams));
  };

  const editTeam = (team) => {
    setIsCreatingTeam(true);
    setCurrentTeam(team.pokemon);
    setTeamName(team.name);
    setEditingTeamId(team.id);
    setSearchTerm('');
    setFilterTypes([]);
    setShowOnlyFavorites(false);
  };

  const cancelTeamCreation = () => {
    setIsCreatingTeam(false);
    setCurrentTeam([]);
    setTeamName('');
    setEditingTeamId(null);
    setSearchTerm('');
    setFilterTypes([]);
    setShowOnlyFavorites(false);
  };

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

  if (!isCreatingTeam) {
    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">내 포켓몬 팀</h2>
          <button
            onClick={startCreatingTeam}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus size={20} />
            새 팀 만들기
          </button>
        </div>

        {teams.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-4">아직 만든 팀이 없습니다.</p>
            <p className="text-sm">찜한 포켓몬으로 6마리 팀을 구성해보세요!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {teams.map((team) => {
              const analysis = analyzeTeam(team.pokemon);
              return (
                <div key={team.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{team.name}</h3>
                      <p className="text-sm text-gray-500">
                        {team.pokemon.length}마리 • {new Date(team.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => editTeam(team)} className="text-blue-600 hover:text-blue-700 p-2">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => deleteTeam(team.id)} className="text-red-600 hover:text-red-700 p-2">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-2 mb-4">
                    {team.pokemon.map((pokemon) => (
                      <div key={pokemon.id} className="bg-gray-50 rounded-lg p-2 text-center">
                        <div className="text-3xl mb-1">{pokemon.image}</div>
                        <p className="text-xs font-medium text-gray-900 mb-1">{pokemon.name}</p>
                        <div className="flex gap-0.5 justify-center flex-wrap">
                          {pokemon.type.map((type) => (
                            <span
                              key={type}
                              className="px-1.5 py-0.5 rounded text-xs text-white font-medium"
                              style={{ backgroundColor: typeColors[type] }}
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <TeamAnalysis analysis={analysis} />
                </div>
              );
            })}
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">{editingTeamId ? '팀 수정하기' : '새 팀 만들기'}</h2>
          <button onClick={cancelTeamCreation} className="text-gray-600 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>

        <input
          type="text"
          placeholder="팀 이름을 입력하세요"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900">현재 팀 ({currentTeam.length}/6)</h3>
            <button
              onClick={saveTeam}
              disabled={!teamName.trim() || currentTeam.length === 0}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                teamName.trim() && currentTeam.length > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Check size={18} />
              저장
            </button>
          </div>
          <div className="grid grid-cols-6 gap-2 mb-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="aspect-square bg-white rounded-lg flex items-center justify-center relative border-2 border-dashed border-gray-300"
              >
                {currentTeam[idx] ? (
                  <>
                    <div className="text-center">
                      <div className="text-3xl mb-1">{currentTeam[idx].image}</div>
                      <p className="text-xs font-medium text-gray-900">{currentTeam[idx].name}</p>
                    </div>
                    <button
                      onClick={() => removeFromCurrentTeam(currentTeam[idx].id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <Plus size={24} className="text-gray-400" />
                )}
              </div>
            ))}
          </div>

          {currentTeam.length > 0 && <TeamAnalysis analysis={analyzeTeam(currentTeam)} compact />}
        </div>

        <h3 className="font-semibold text-gray-900 mb-3">포켓몬 선택하기</h3>

        <div className="mb-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="포켓몬 이름으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              찜한 포켓몬만
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
      </div>

      {filteredPokemon.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {showOnlyFavorites
            ? '찜한 포켓몬이 없습니다. 먼저 포켓몬을 찜해주세요!'
            : '검색 결과가 없습니다.'}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredPokemon.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              isFavorite={favorites.includes(pokemon.id)}
              onToggleFavorite={toggleFavorite}
              onClick={addToCurrentTeam}
              isSelected={currentTeam.find((p) => p.id === pokemon.id)}
              isDisabled={currentTeam.length >= 6}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default TeamsTab;
