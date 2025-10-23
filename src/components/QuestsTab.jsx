import React, { useState, useMemo } from 'react';
import { Search, MapPin } from 'lucide-react';
import { questData } from '../data/quests';

/**
 * 퀘스트 탭 컴포넌트
 */
const QuestsTab = () => {
  const [questSearchTerm, setQuestSearchTerm] = useState('');
  const [questDifficultyFilter, setQuestDifficultyFilter] = useState('전체');

  const questDifficulties = ['전체', '쉬움', '보통', '어려움', '매우 어려움'];

  const filteredQuests = useMemo(() => {
    return questData.filter((quest) => {
      const matchSearch =
        quest.title.toLowerCase().includes(questSearchTerm.toLowerCase()) ||
        quest.location.toLowerCase().includes(questSearchTerm.toLowerCase()) ||
        quest.npc.toLowerCase().includes(questSearchTerm.toLowerCase());
      const matchDifficulty = questDifficultyFilter === '전체' || quest.difficulty === questDifficultyFilter;
      return matchSearch && matchDifficulty;
    });
  }, [questSearchTerm, questDifficultyFilter]);

  return (
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
            {questDifficulties.map((difficulty) => (
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
        <div className="text-center py-12 text-gray-500">검색 결과가 없습니다.</div>
      ) : (
        <div className="space-y-4">
          {filteredQuests.map((quest) => (
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
  );
};

export default QuestsTab;
