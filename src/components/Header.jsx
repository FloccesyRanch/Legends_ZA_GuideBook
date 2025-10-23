import React from 'react';
import { Package, Scroll } from 'lucide-react';

/**
 * 앱 헤더 및 탭 네비게이션 컴포넌트
 */
const Header = ({ currentTab, setCurrentTab, teamsCount }) => {
  const tabs = [
    { id: 'all', label: '포켓몬 도감', icon: null },
    { id: 'teams', label: `내 팀 (${teamsCount})`, icon: null },
    { id: 'megastones', label: '💠 메가스톤', icon: null },
    { id: 'items', label: '아이템', icon: Package },
    { id: 'quests', label: '퀘스트', icon: Scroll },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-900">포켓몬 Legends Z-A 도감</h1>
        <p className="text-sm text-gray-600">루미오스 시티 포켓몬 가이드</p>

        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`py-2 px-4 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  currentTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${Icon ? 'flex items-center gap-2' : ''}`}
              >
                {Icon && <Icon size={18} />}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;
