import React from 'react';
import { typeColors } from '../data/types';

/**
 * 팀 상성 분석 표시 컴포넌트
 *
 * @param {Object} analysis - analyzeTeam 함수의 결과
 * @param {boolean} compact - 컴팩트 모드 (팀 생성 시)
 */
const TeamAnalysis = ({ analysis, compact = false }) => {
  if (!analysis) return null;

  const maxDisplay = compact ? 6 : 8;

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
      <h4 className="font-semibold text-gray-900 text-sm">
        {compact ? '실시간 팀 상성' : '팀 상성 분석'}
      </h4>

      {/* 방어 약점 */}
      <div>
        <p className="text-xs font-medium text-red-600 mb-2">
          ⚠️ 방어 약점 {compact ? '' : '(주의 필요)'}
        </p>
        <div className="flex gap-1 flex-wrap">
          {analysis.defensiveWeaknesses.slice(0, maxDisplay).map(([type, count]) => (
            <span
              key={type}
              className="px-2 py-1 rounded text-xs text-white font-medium"
              style={{ backgroundColor: typeColors[type] }}
            >
              {type}
            </span>
          ))}
          {analysis.defensiveWeaknesses.length === 0 && (
            <span className="text-xs text-green-600 font-medium">
              ✓ {compact ? '약점 없음!' : '커버되지 않는 약점 없음!'}
            </span>
          )}
        </div>
      </div>

      {/* 공격 커버리지 */}
      <div>
        <p className="text-xs font-medium text-green-600 mb-2">
          ⚔️ 공격 효과적 {compact ? '' : '(강점)'}
        </p>
        <div className="flex gap-1 flex-wrap">
          {analysis.offensiveCoverage.slice(0, maxDisplay).map(([type, count]) => (
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
  );
};

export default TeamAnalysis;
