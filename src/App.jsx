import React, { useState, useMemo } from 'react';
import { Star, MapPin, Search, X, Plus, Trash2, Edit2, Check, Package, Scroll } from 'lucide-react';

// 데이터 import
import { pokemonData } from './data/pokemon';
import { itemData } from './data/items';
import { questData } from './data/quests';
import { typeColors, typeEffectiveness, defensiveMatchup } from './data/types';

/**
 * 이미지 사용 가이드:
 *
 * 현재는 emoji를 사용하고 있습니다.
 * PNG 이미지를 사용하고 싶다면:
 *
 * 1. public/images 폴더에 하위 폴더 생성:
 *    - public/images/pokemon/
 *    - public/images/items/
 *    - public/images/quests/
 *
 * 2. 각 폴더에 ID에 맞는 이미지 파일 추가:
 *    - 포켓몬: 1.png, 2.png, 3.png, ...
 *    - 아이템: 1.png, 2.png, 3.png, ...
 *    - 퀘스트: 1.png, 2.png, 3.png, ...
 *
 * 3. ImageWithFallback 컴포넌트 사용:
 *    import ImageWithFallback from './components/ImageWithFallback';
 *    import { getPokemonImagePath } from './utils/imageLoader';
 *
 *    <ImageWithFallback
 *      src={getPokemonImagePath(pokemon.id)}
 *      fallback={pokemon.image}
 *      alt={pokemon.name}
 *      className="text-5xl"
 *    />
 */

const App = () => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem('teams');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTypes, setFilterTypes] = useState([]);
  const [currentTab, setCurrentTab] = useState('all');
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [currentTeam, setCurrentTeam] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // 아이템 필터
  const [itemCategoryFilter, setItemCategoryFilter] = useState('전체');
  const [itemSearchTerm, setItemSearchTerm] = useState('');

  // 퀘스트 필터
  const [questDifficultyFilter, setQuestDifficultyFilter] = useState('전체');
  const [questSearchTerm, setQuestSearchTerm] = useState('');

  const toggleTypeFilter = (type) => {
    if (type === '전체') {
      setFilterTypes([]);
    } else {
      if (filterTypes.includes(type)) {
        setFilterTypes(filterTypes.filter(t => t !== type));
      } else if (filterTypes.length < 2) {
        setFilterTypes([...filterTypes, type]);
      }
    }
  };

  const toggleFavorite = (id) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(fid => fid !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

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
    if (currentTeam.length < 6 && !currentTeam.find(p => p.id === pokemon.id)) {
      setCurrentTeam([...currentTeam, pokemon]);
    }
  };

  const removeFromCurrentTeam = (id) => {
    setCurrentTeam(currentTeam.filter(p => p.id !== id));
  };

  const saveTeam = () => {
    if (currentTeam.length === 0 || !teamName.trim()) return;

    const newTeam = {
      id: editingTeamId || Date.now(),
      name: teamName,
      pokemon: currentTeam,
      createdAt: new Date().toISOString()
    };

    let newTeams;
    if (editingTeamId) {
      newTeams = teams.map(t => t.id === editingTeamId ? newTeam : t);
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
    const newTeams = teams.filter(t => t.id !== id);
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

  // 팀 상성 분석
  const analyzeTeam = (team) => {
    const teamTypes = team.flatMap(p => p.type);
    const uniqueTeamTypes = [...new Set(teamTypes)];

    // 1단계: 각 포켓몬의 약점과 저항 수집
    const allWeaknesses = {};
    const allResistances = {};
    const allImmunities = new Set();

    team.forEach(pokemon => {
      pokemon.type.forEach(type => {
        const matchup = defensiveMatchup[type];
        if (matchup) {
          matchup.weakTo.forEach(weakType => {
            if (!allWeaknesses[weakType]) allWeaknesses[weakType] = [];
            allWeaknesses[weakType].push(pokemon.name);
          });
          matchup.resistFrom.forEach(resistType => {
            if (!allResistances[resistType]) allResistances[resistType] = [];
            allResistances[resistType].push(pokemon.name);
          });
          matchup.immuneTo.forEach(immuneType => {
            allImmunities.add(immuneType);
          });
        }
      });
    });

    // 2단계: 팀이 공격적으로 커버하는 타입 파악
    const teamCanAttackEffectively = new Set();
    uniqueTeamTypes.forEach(type => {
      const effectiveness = typeEffectiveness[type];
      if (effectiveness) {
        effectiveness.weak.forEach(targetType => {
          teamCanAttackEffectively.add(targetType);
        });
      }
    });

    // 3단계: 실질적 약점 계산 (커버되지 않는 약점만)
    const uncoveredWeaknesses = {};
    Object.entries(allWeaknesses).forEach(([weakType, affectedPokemon]) => {
      // 이 타입 공격에 저항하거나 면역인 포켓몬이 있는지 확인
      const hasResistance = allResistances[weakType] && allResistances[weakType].length > 0;
      const hasImmunity = allImmunities.has(weakType);

      // 이 타입을 효과적으로 공격할 수 있는지 확인 (역으로 방어 가능)
      const canCounterAttack = teamCanAttackEffectively.has(weakType);

      // 커버되지 않은 약점만 표시
      // 저항/면역이 있거나, 역으로 공격할 수 있으면 제외
      if (!hasResistance && !hasImmunity && !canCounterAttack) {
        uncoveredWeaknesses[weakType] = affectedPokemon.length;
      }
    });

    // 방어 저항 분석
    const defensiveResistances = {};
    Object.entries(allResistances).forEach(([resistType, resistingPokemon]) => {
      defensiveResistances[resistType] = resistingPokemon.length;
    });

    // 공격 커버리지 분석
    const offensiveCoverage = {};
    const offensiveWeaknesses = {};

    uniqueTeamTypes.forEach(type => {
      const effectiveness = typeEffectiveness[type];
      if (effectiveness) {
        effectiveness.weak.forEach(targetType => {
          offensiveCoverage[targetType] = (offensiveCoverage[targetType] || 0) + 1;
        });
        effectiveness.resist.forEach(targetType => {
          offensiveWeaknesses[targetType] = (offensiveWeaknesses[targetType] || 0) + 1;
        });
      }
    });

    return {
      defensiveWeaknesses: Object.entries(uncoveredWeaknesses).sort((a, b) => b[1] - a[1]),
      defensiveResistances: Object.entries(defensiveResistances).sort((a, b) => b[1] - a[1]),
      offensiveCoverage: Object.entries(offensiveCoverage).sort((a, b) => b[1] - a[1]),
      offensiveWeaknesses: Object.entries(offensiveWeaknesses).sort((a, b) => b[1] - a[1]),
      immunities: Array.from(allImmunities),
    };
  };

  const uniqueTypes = ['전체', ...new Set(pokemonData.flatMap(p => p.type))];
  const itemCategories = ['전체', ...new Set(itemData.filter(i => i.category !== '메가스톤').map(i => i.category))];
  const questDifficulties = ['전체', '쉬움', '보통', '어려움', '매우 어려움'];

  const filteredPokemon = useMemo(() => {
    let pokemon = pokemonData;

    if (showOnlyFavorites) {
      pokemon = pokemon.filter(p => favorites.includes(p.id));
    }

    return pokemon.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.name_en.toLowerCase().includes(searchTerm.toLowerCase());

      const matchType = filterTypes.length === 0 ||
                       filterTypes.every(selectedType => p.type.includes(selectedType));

      return matchSearch && matchType;
    });
  }, [searchTerm, filterTypes, favorites, showOnlyFavorites]);

  const filteredItems = useMemo(() => {
    return itemData.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(itemSearchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(itemSearchTerm.toLowerCase());
      const matchCategory = itemCategoryFilter === '전체' || item.category === itemCategoryFilter;
      const notMegastone = item.category !== '메가스톤';
      return matchSearch && matchCategory && notMegastone;
    });
  }, [itemSearchTerm, itemCategoryFilter]);

  const filteredQuests = useMemo(() => {
    return questData.filter(quest => {
      const matchSearch = quest.title.toLowerCase().includes(questSearchTerm.toLowerCase()) ||
                         quest.location.toLowerCase().includes(questSearchTerm.toLowerCase()) ||
                         quest.npc.toLowerCase().includes(questSearchTerm.toLowerCase());
      const matchDifficulty = questDifficultyFilter === '전체' || quest.difficulty === questDifficultyFilter;
      return matchSearch && matchDifficulty;
    });
  }, [questSearchTerm, questDifficultyFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">포켓몬 Legends Z-A 도감</h1>
          <p className="text-sm text-gray-600">루미오스 시티 포켓몬 가이드</p>

          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            <button
              onClick={() => setCurrentTab('all')}
              className={`py-2 px-4 rounded-lg font-medium transition-colors whitespace-nowrap ${
                currentTab === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              포켓몬 도감
            </button>
            <button
              onClick={() => setCurrentTab('teams')}
              className={`py-2 px-4 rounded-lg font-medium transition-colors whitespace-nowrap ${
                currentTab === 'teams'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              내 팀 ({teams.length})
            </button>
            <button
              onClick={() => setCurrentTab('megastones')}
              className={`py-2 px-4 rounded-lg font-medium transition-colors whitespace-nowrap ${
                currentTab === 'megastones'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              💠 메가스톤
            </button>
            <button
              onClick={() => setCurrentTab('items')}
              className={`py-2 px-4 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                currentTab === 'items'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Package size={18} />
              아이템
            </button>
            <button
              onClick={() => setCurrentTab('quests')}
              className={`py-2 px-4 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                currentTab === 'quests'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Scroll size={18} />
              퀘스트
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {currentTab === 'megastones' ? (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">💠 메가스톤 위치</h2>

              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="메가스톤 이름이나 장소로 검색..."
                    value={itemSearchTerm}
                    onChange={(e) => setItemSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {itemData.filter(item => item.category === '메가스톤' &&
              (item.name.toLowerCase().includes(itemSearchTerm.toLowerCase()) ||
               item.location.toLowerCase().includes(itemSearchTerm.toLowerCase()))
            ).length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                검색 결과가 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {itemData.filter(item => item.category === '메가스톤' &&
                  (item.name.toLowerCase().includes(itemSearchTerm.toLowerCase()) ||
                   item.location.toLowerCase().includes(itemSearchTerm.toLowerCase()))
                ).map(item => (
                  <div key={item.id} className={`${item.color} rounded-lg p-4 shadow-sm`}>
                    <div className="flex items-start gap-4">
                      <div className="text-4xl flex-shrink-0">{item.image}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-bold text-gray-900">{item.name}</h3>
                          <span className="px-2 py-1 bg-white rounded text-xs font-medium text-gray-700 whitespace-nowrap">
                            {item.category}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-gray-700">
                          <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                          <p>{item.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : currentTab === 'items' ? (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">아이템 위치</h2>

              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="아이템 이름이나 장소로 검색..."
                    value={itemSearchTerm}
                    onChange={(e) => setItemSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                  {itemCategories.map(category => (
                    <button
                      key={category}
                      onClick={() => setItemCategoryFilter(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        itemCategoryFilter === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                검색 결과가 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map(item => (
                  <div key={item.id} className={`${item.color} rounded-lg p-4 shadow-sm`}>
                    <div className="flex items-start gap-4">
                      <div className="text-4xl flex-shrink-0">{item.image}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-bold text-gray-900">{item.name}</h3>
                          <span className="px-2 py-1 bg-white rounded text-xs font-medium text-gray-700 whitespace-nowrap">
                            {item.category}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-gray-700">
                          <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                          <p>{item.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : currentTab === 'quests' ? (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">사이드 퀘스트</h2>

              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="퀘스트 이름, 장소, NPC로 검색..."
                    value={questSearchTerm}
                    onChange={(e) => setQuestSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                  {questDifficulties.map(difficulty => (
                    <button
                      key={difficulty}
                      onClick={() => setQuestDifficultyFilter(difficulty)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        questDifficultyFilter === difficulty
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {difficulty}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filteredQuests.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                검색 결과가 없습니다.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuests.map(quest => (
                  <div key={quest.id} className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="text-5xl flex-shrink-0">{quest.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{quest.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${quest.difficultyColor}`}>
                            {quest.difficulty}
                          </span>
                        </div>

                        <p className="text-gray-700 mb-3">{quest.description}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-gray-500 flex-shrink-0" />
                            <span className="text-gray-700">{quest.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">👤</span>
                            <span className="text-gray-700">{quest.npc}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">🎁</span>
                            <span className="text-gray-700 font-medium">{quest.reward}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : currentTab === 'teams' ? (
          <div>
            {!isCreatingTeam ? (
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
                    {teams.map(team => {
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
                            <button
                              onClick={() => editTeam(team)}
                              className="text-blue-600 hover:text-blue-700 p-2"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => deleteTeam(team.id)}
                              className="text-red-600 hover:text-red-700 p-2"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-6 gap-2 mb-4">
                          {team.pokemon.map(pokemon => (
                            <div key={pokemon.id} className="bg-gray-50 rounded-lg p-2 text-center">
                              <div className="text-3xl mb-1">{pokemon.image}</div>
                              <p className="text-xs font-medium text-gray-900 mb-1">{pokemon.name}</p>
                              <div className="flex gap-0.5 justify-center flex-wrap">
                                {pokemon.type.map(type => (
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

                        {/* 상성 분석 */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                          <h4 className="font-semibold text-gray-900 text-sm">팀 상성 분석</h4>

                          {/* 방어 약점 */}
                          <div>
                            <p className="text-xs font-medium text-red-600 mb-2">⚠️ 방어 약점 (주의 필요)</p>
                            <div className="flex gap-1 flex-wrap">
                              {analysis.defensiveWeaknesses.slice(0, 8).map(([type, count]) => (
                                <span
                                  key={type}
                                  className="px-2 py-1 rounded text-xs text-white font-medium"
                                  style={{ backgroundColor: typeColors[type] }}
                                >
                                  {type}
                                </span>
                              ))}
                              {analysis.defensiveWeaknesses.length === 0 && (
                                <span className="text-xs text-green-600 font-medium">✓ 커버되지 않는 약점 없음!</span>
                              )}
                            </div>
                          </div>

                          {/* 공격 커버리지 */}
                          <div>
                            <p className="text-xs font-medium text-green-600 mb-2">⚔️ 공격 효과적 (강점)</p>
                            <div className="flex gap-1 flex-wrap">
                              {analysis.offensiveCoverage.slice(0, 8).map(([type, count]) => (
                                <span
                                  key={type}
                                  className="px-2 py-1 rounded text-xs text-white font-medium"
                                  style={{ backgroundColor: typeColors[type] }}
                                >
                                  {type}
                                </span>
                              ))}
                              {analysis.offensiveCoverage.length === 0 && (
                                <span className="text-xs text-gray-500">커버리지 없음</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                    })}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      {editingTeamId ? '팀 수정하기' : '새 팀 만들기'}
                    </h2>
                    <button
                      onClick={() => {
                        setIsCreatingTeam(false);
                        setCurrentTeam([]);
                        setTeamName('');
                        setEditingTeamId(null);
                        setSearchTerm('');
                        setFilterTypes([]);
                        setShowOnlyFavorites(false);
                      }}
                      className="text-gray-600 hover:text-gray-800"
                    >
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
                      <h3 className="font-semibold text-gray-900">
                        현재 팀 ({currentTeam.length}/6)
                      </h3>
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
                                <p className="text-xs font-medium text-gray-900">
                                  {currentTeam[idx].name}
                                </p>
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

                    {/* 실시간 팀 상성 분석 */}
                    {currentTeam.length > 0 && (
                      <div className="bg-white rounded-lg p-3 space-y-3">
                        <h4 className="font-semibold text-gray-900 text-sm">실시간 팀 상성</h4>

                        {(() => {
                          const analysis = analyzeTeam(currentTeam);
                          return (
                            <>
                              {/* 방어 약점 */}
                              <div>
                                <p className="text-xs font-medium text-red-600 mb-2">⚠️ 방어 약점</p>
                                <div className="flex gap-1 flex-wrap">
                                  {analysis.defensiveWeaknesses.slice(0, 6).map(([type, count]) => (
                                    <span
                                      key={type}
                                      className="px-2 py-1 rounded text-xs text-white font-medium"
                                      style={{ backgroundColor: typeColors[type] }}
                                    >
                                      {type}
                                    </span>
                                  ))}
                                  {analysis.defensiveWeaknesses.length === 0 && (
                                    <span className="text-xs text-green-600 font-medium">✓ 약점 없음!</span>
                                  )}
                                </div>
                              </div>

                              {/* 공격 커버리지 */}
                              <div>
                                <p className="text-xs font-medium text-green-600 mb-2">⚔️ 공격 효과적</p>
                                <div className="flex gap-1 flex-wrap">
                                  {analysis.offensiveCoverage.slice(0, 6).map(([type, count]) => (
                                    <span
                                      key={type}
                                      className="px-2 py-1 rounded text-xs text-white font-medium"
                                      style={{ backgroundColor: typeColors[type] }}
                                    >
                                      {type}
                                    </span>
                                  ))}
                                  {analysis.offensiveCoverage.length === 0 && (
                                    <span className="text-xs text-gray-500">커버리지 없음</span>
                                  )}
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}
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
                        {uniqueTypes.filter(t => t !== '전체').map(type => (
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
                    {filteredPokemon.map(pokemon => (
                      <div
                        key={pokemon.id}
                        onClick={() => addToCurrentTeam(pokemon)}
                        className={`bg-white rounded-lg p-4 shadow-sm transition-all cursor-pointer relative ${
                          currentTeam.find(p => p.id === pokemon.id)
                            ? 'ring-2 ring-blue-500 bg-blue-50'
                            : currentTeam.length >= 6
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:shadow-md'
                        }`}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(pokemon.id);
                          }}
                          className="absolute top-2 right-2 z-10"
                        >
                          <Star
                            size={20}
                            className={favorites.includes(pokemon.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                          />
                        </button>

                        <div className="text-5xl text-center mb-2">{pokemon.image}</div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">No.{pokemon.id}</p>
                          <p className="font-bold text-gray-900">{pokemon.name}</p>
                          <p className="text-xs text-gray-600">{pokemon.name_en}</p>
                          <div className="flex gap-1 justify-center mt-2 flex-wrap">
                            {pokemon.type.map(type => (
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
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6 space-y-4">
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
                  {uniqueTypes.filter(t => t !== '전체').map(type => (
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
              {filteredPokemon.map(pokemon => (
                <div
                  key={pokemon.id}
                  onClick={() => setSelectedPokemon(pokemon)}
                  className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(pokemon.id);
                    }}
                    className="absolute top-2 right-2 z-10"
                  >
                    <Star
                      size={20}
                      className={favorites.includes(pokemon.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  </button>

                  <div className="text-5xl text-center mb-2">{pokemon.image}</div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">No.{pokemon.id}</p>
                    <p className="font-bold text-gray-900">{pokemon.name}</p>
                    <p className="text-xs text-gray-600">{pokemon.name_en}</p>
                    <div className="flex gap-1 justify-center mt-2 flex-wrap">
                      {pokemon.type.map(type => (
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
        )}
      </div>

      {selectedPokemon && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedPokemon(null)}
        >
          <div
            className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">No.{selectedPokemon.id}</p>
                <h2 className="text-2xl font-bold text-gray-900">{selectedPokemon.name}</h2>
                <p className="text-gray-600">{selectedPokemon.name_en}</p>
              </div>
              <button
                onClick={() => setSelectedPokemon(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="text-6xl text-center mb-6">{selectedPokemon.image}</div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">타입</h3>
              <div className="flex gap-2">
                {selectedPokemon.type.map(type => (
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
                <p className="text-gray-800">{selectedPokemon.location}</p>
              </div>
            </div>

            <button
              onClick={() => toggleFavorite(selectedPokemon.id)}
              className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                favorites.includes(selectedPokemon.id)
                  ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Star
                size={20}
                className={favorites.includes(selectedPokemon.id) ? 'fill-current' : ''}
              />
              {favorites.includes(selectedPokemon.id) ? '찜 해제' : '찜하기'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
