import React, { useState } from 'react';

// 컴포넌트 import
import Header from './components/Header';
import PokemonTab from './components/PokemonTab';
import PokemonModal from './components/PokemonModal';
import TeamsTab from './components/TeamsTab';
import ItemsTab from './components/ItemsTab';
import MegastonesTab from './components/MegastonesTab';
import QuestsTab from './components/QuestsTab';

/**
 * 포켓몬 Legends Z-A 도감 메인 앱
 *
 * 데이터 구조:
 * - src/data/ 폴더에 모든 데이터가 분리되어 있습니다
 * - 컴포넌트는 src/components/ 폴더에 분리되어 있습니다
 *
 * 이미지 추가 가이드:
 * 1. public/images 폴더에 하위 폴더 생성 (pokemon, items, quests)
 * 2. 각 폴더에 ID.png 형식으로 이미지 추가 (예: 1.png, 2.png, ...)
 * 3. ImageWithFallback 컴포넌트를 사용하면 이미지가 없을 때 emoji로 폴백됩니다
 */
const App = () => {
  // 상태 관리
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem('teams');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [currentTab, setCurrentTab] = useState('all');

  // 찜하기 토글
  const toggleFavorite = (id) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((fid) => fid !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  // 현재 탭에 따른 컴포넌트 렌더링
  const renderCurrentTab = () => {
    switch (currentTab) {
      case 'all':
        return <PokemonTab favorites={favorites} toggleFavorite={toggleFavorite} onPokemonClick={setSelectedPokemon} />;
      case 'teams':
        return <TeamsTab teams={teams} setTeams={setTeams} favorites={favorites} toggleFavorite={toggleFavorite} />;
      case 'items':
        return <ItemsTab />;
      case 'megastones':
        return <MegastonesTab />;
      case 'quests':
        return <QuestsTab />;
      default:
        return <PokemonTab favorites={favorites} toggleFavorite={toggleFavorite} onPokemonClick={setSelectedPokemon} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} teamsCount={teams.length} />

      <div className="max-w-7xl mx-auto px-4 py-6">{renderCurrentTab()}</div>

      <PokemonModal
        pokemon={selectedPokemon}
        isFavorite={selectedPokemon ? favorites.includes(selectedPokemon.id) : false}
        onToggleFavorite={toggleFavorite}
        onClose={() => setSelectedPokemon(null)}
      />
    </div>
  );
};

export default App;
