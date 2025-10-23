import { typeEffectiveness, defensiveMatchup } from '../data/types';

/**
 * 팀의 타입 상성을 분석하는 유틸리티 함수
 *
 * @param {Array} team - 포켓몬 배열
 * @returns {Object} 팀 분석 결과
 */
export const analyzeTeam = (team) => {
  const teamTypes = team.flatMap((p) => p.type);
  const uniqueTeamTypes = [...new Set(teamTypes)];

  // 1단계: 각 포켓몬의 약점과 저항 수집
  const allWeaknesses = {};
  const allResistances = {};
  const allImmunities = new Set();

  team.forEach((pokemon) => {
    pokemon.type.forEach((type) => {
      const matchup = defensiveMatchup[type];
      if (matchup) {
        matchup.weakTo.forEach((weakType) => {
          if (!allWeaknesses[weakType]) allWeaknesses[weakType] = [];
          allWeaknesses[weakType].push(pokemon.name);
        });
        matchup.resistFrom.forEach((resistType) => {
          if (!allResistances[resistType]) allResistances[resistType] = [];
          allResistances[resistType].push(pokemon.name);
        });
        matchup.immuneTo.forEach((immuneType) => {
          allImmunities.add(immuneType);
        });
      }
    });
  });

  // 2단계: 팀이 공격적으로 커버하는 타입 파악
  const teamCanAttackEffectively = new Set();
  uniqueTeamTypes.forEach((type) => {
    const effectiveness = typeEffectiveness[type];
    if (effectiveness) {
      effectiveness.weak.forEach((targetType) => {
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

  uniqueTeamTypes.forEach((type) => {
    const effectiveness = typeEffectiveness[type];
    if (effectiveness) {
      effectiveness.weak.forEach((targetType) => {
        offensiveCoverage[targetType] = (offensiveCoverage[targetType] || 0) + 1;
      });
      effectiveness.resist.forEach((targetType) => {
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
