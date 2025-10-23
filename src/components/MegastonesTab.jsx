import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { itemData } from '../data/items';

/**
 * 메가스톤 탭 컴포넌트
 */
const MegastonesTab = () => {
  const [itemSearchTerm, setItemSearchTerm] = useState('');

  const filteredMegastones = itemData.filter(
    (item) =>
      item.category === '메가스톤' &&
      (item.name.toLowerCase().includes(itemSearchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(itemSearchTerm.toLowerCase()))
  );

  return (
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
        </div>
      </div>

      {filteredMegastones.length === 0 ? (
        <div className="text-center py-12 text-gray-500">검색 결과가 없습니다.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMegastones.map((item) => (
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
  );
};

export default MegastonesTab;
