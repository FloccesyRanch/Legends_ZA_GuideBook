import React, { useState, useMemo } from 'react';
import { Star, MapPin, Search, X, Plus, Trash2, Edit2, Check, Package, Scroll } from 'lucide-react';

// 샘플 포켓몬 데이터
const pokemonData = [
  { id: 1, name: '이상해씨', name_en: 'Bulbasaur', type: ['풀', '독'], location: '프리즘 타워 정원', image: '🌱' },
  { id: 2, name: '이상해풀', name_en: 'Ivysaur', type: ['풀', '독'], location: '프리즘 타워 정원', image: '🌿' },
  { id: 3, name: '이상해꽃', name_en: 'Venusaur', type: ['풀', '독'], location: '프리즘 타워 정원', image: '🌺' },
  { id: 4, name: '파이리', name_en: 'Charmander', type: ['불꽃'], location: '산업 지구 화력발전소', image: '🔥' },
  { id: 5, name: '리자드', name_en: 'Charmeleon', type: ['불꽃'], location: '산업 지구 화력발전소', image: '🦎' },
  { id: 6, name: '리자몽', name_en: 'Charizard', type: ['불꽃', '비행'], location: '산업 지구 화력발전소', image: '🐉' },
  { id: 7, name: '꼬부기', name_en: 'Squirtle', type: ['물'], location: '센 강변 공원', image: '🐢' },
  { id: 8, name: '어니부기', name_en: 'Wartortle', type: ['물'], location: '센 강변 공원', image: '🐢' },
  { id: 9, name: '거북왕', name_en: 'Blastoise', type: ['물'], location: '센 강변 공원', image: '🐚' },
  { id: 152, name: '치코리타', name_en: 'Chikorita', type: ['풀'], location: '스타터 지급', image: '🍃' },
  { id: 153, name: '베이리프', name_en: 'Bayleef', type: ['풀'], location: '진화', image: '🌿' },
  { id: 154, name: '메가니움', name_en: 'Meganium', type: ['풀'], location: '진화', image: '🌸' },
  { id: 158, name: '리아코', name_en: 'Totodile', type: ['물'], location: '스타터 지급', image: '🐊' },
  { id: 159, name: '엘리게이', name_en: 'Croconaw', type: ['물'], location: '진화', image: '🐊' },
  { id: 160, name: '장크로다일', name_en: 'Feraligatr', type: ['물'], location: '진화', image: '🐊' },
  { id: 495, name: '주리비얀', name_en: 'Snivy', type: ['풀'], location: '북부 상업 지구', image: '🐍' },
  { id: 498, name: '뚜꾸리', name_en: 'Tepig', type: ['불꽃'], location: '스타터 지급', image: '🐷' },
  { id: 499, name: '차오꿀', name_en: 'Pignite', type: ['불꽃', '격투'], location: '진화', image: '🐖' },
  { id: 500, name: '염무왕', name_en: 'Emboar', type: ['불꽃', '격투'], location: '진화', image: '🐗' },
  { id: 650, name: '도치마론', name_en: 'Chespin', type: ['풀'], location: '산조르주 숲', image: '🦔' },
  { id: 653, name: '푸호꼬', name_en: 'Fennekin', type: ['불꽃'], location: '샹젤리제 거리', image: '🦊' },
  { id: 656, name: '개구마르', name_en: 'Froakie', type: ['물'], location: '센 강변', image: '🐸' },
  { id: 700, name: '님피아', name_en: 'Sylveon', type: ['페어리'], location: '카페 거리', image: '🎀' },
  { id: 716, name: '제르네아스', name_en: 'Xerneas', type: ['페어리'], location: '프리즘 타워 꼭대기', image: '🦌' },
  { id: 717, name: '이벨타르', name_en: 'Yveltal', type: ['악', '비행'], location: '지하 터널', image: '🦅' },
  { id: 718, name: '지가르데', name_en: 'Zygarde', type: ['드래곤', '땅'], location: '루미오스 지하', image: '🐉' },
  { id: 25, name: '피카츄', name_en: 'Pikachu', type: ['전기'], location: '시내 곳곳', image: '⚡' },
  { id: 26, name: '라이츄', name_en: 'Raichu', type: ['전기'], location: '진화', image: '⚡' },
  { id: 133, name: '이브이', name_en: 'Eevee', type: ['노말'], location: '카페 지구', image: '🦊' },
  { id: 143, name: '잠만보', name_en: 'Snorlax', type: ['노말'], location: '주거 지역', image: '😴' },
  { id: 448, name: '루카리오', name_en: 'Lucario', type: ['격투', '강철'], location: '체육관 지구', image: '🐺' },
  { id: 282, name: '가디안', name_en: 'Gardevoir', type: ['에스퍼', '페어리'], location: '예술 지구', image: '👗' },
  { id: 445, name: '한카리아스', name_en: 'Garchomp', type: ['드래곤', '땅'], location: '건설 현장', image: '🦈' },
  { id: 549, name: '드레디어', name_en: 'Lilligant', type: ['풀'], location: '보타니컬 정원', image: '🌺' },
  { id: 609, name: '샹델라', name_en: 'Chandelure', type: ['고스트', '불꽃'], location: '구시가지', image: '🕯️' },
];

// 아이템 데이터
const itemData = [
  { id: 1, name: '진화의돌 (물)', category: '진화의돌', location: '센 강변 공원 - 분수대 뒤편', image: '💎', color: 'bg-blue-100' },
  { id: 2, name: '진화의돌 (불꽃)', category: '진화의돌', location: '산업 지구 화력발전소 - 보일러실', image: '🔥', color: 'bg-red-100' },
  { id: 3, name: '진화의돌 (천둥)', category: '진화의돌', location: '프리즘 타워 - 전기실', image: '⚡', color: 'bg-yellow-100' },
  { id: 4, name: '진화의돌 (리프)', category: '진화의돌', location: '보타니컬 정원 - 온실 깊숙한 곳', image: '🍃', color: 'bg-green-100' },
  { id: 5, name: '진화의돌 (달)', category: '진화의돌', location: '구시가지 - 밤에만 나타나는 NPC', image: '🌙', color: 'bg-purple-100' },
  { id: 6, name: '진화의돌 (태양)', category: '진화의돌', location: '프리즘 타워 꼭대기 - 낮 12시', image: '☀️', color: 'bg-orange-100' },
  { id: 7, name: '빛나는돌', category: '진화의돌', location: '루미오스 지하 - 숨겨진 통로', image: '✨', color: 'bg-pink-100' },
  { id: 8, name: '어둠의돌', category: '진화의돌', location: '지하 터널 - 막다른 골목', image: '🌑', color: 'bg-gray-100' },
  { id: 9, name: '마스터볼', category: '중요 아이템', location: '스토리 완료 후 박사에게서 획득', image: '🎯', color: 'bg-purple-100' },
  { id: 10, name: '자전거', category: '중요 아이템', location: '샹젤리제 거리 - 자전거 가게 주인 퀘스트', image: '🚲', color: 'bg-blue-100' },
  { id: 11, name: '낚시대 (고급)', category: '중요 아이템', location: '센 강변 - 낚시꾼 NPC', image: '🎣', color: 'bg-blue-100' },
  { id: 12, name: '비전머신 (파도타기)', category: '비전머신', location: '센 강변 공원 - 체육관 승리 후', image: '🌊', color: 'bg-cyan-100' },
  { id: 13, name: '비전머신 (플라이)', category: '비전머신', location: '프리즘 타워 꼭대기 - 이벨타르 포획 후', image: '🦅', color: 'bg-sky-100' },
  { id: 14, name: '메가스톤 (리자몽X)', category: '메가스톤', location: '산업 지구 - 숨겨진 연구소', image: '💠', color: 'bg-indigo-100' },
  { id: 15, name: '메가스톤 (리자몽Y)', category: '메가스톤', location: '프리즘 타워 - 85층', image: '💠', color: 'bg-indigo-100' },
  { id: 16, name: '메가스톤 (루카리오)', category: '메가스톤', location: '체육관 지구 - 챔피언 방어 성공', image: '💠', color: 'bg-indigo-100' },
  { id: 17, name: '행운의 알', category: '특수 아이템', location: '카페 거리 - 매일 랜덤 NPC', image: '🥚', color: 'bg-yellow-100' },
  { id: 18, name: '경험치 부적', category: '특수 아이템', location: '북부 상업 지구 - 포켓몬 센터 옆 건물 2층', image: '📿', color: 'bg-amber-100' },
];

// 사이드 퀘스트 데이터
const questData = [
  {
    id: 1,
    title: '잃어버린 반려 포켓몬',
    location: '카페 거리',
    npc: '카페 주인 마리',
    reward: '님피아 + 5,000골드',
    difficulty: '쉬움',
    description: '카페 주인의 님피아가 도망쳤습니다. 예술 지구에서 찾아주세요.',
    emoji: '🎀',
    difficultyColor: 'text-green-600 bg-green-50'
  },
  {
    id: 2,
    title: '센 강의 수호자',
    location: '센 강변',
    npc: '노인 피에르',
    reward: '진화의돌(물) + 고급 낚시대',
    difficulty: '보통',
    description: '센 강에 나타난 강력한 물 포켓몬을 잡아주세요.',
    emoji: '🌊',
    difficultyColor: 'text-blue-600 bg-blue-50'
  },
  {
    id: 3,
    title: '프리즘 타워의 비밀',
    location: '프리즘 타워',
    npc: '경비원 앙투안',
    reward: '비전머신(플라이) + 경험치 부적',
    difficulty: '어려움',
    description: '프리즘 타워 꼭대기의 비밀을 밝혀내세요. 이벨타르와의 조우가 기다립니다.',
    emoji: '🗼',
    difficultyColor: 'text-orange-600 bg-orange-50'
  },
  {
    id: 4,
    title: '메가진화의 비밀',
    location: '산업 지구',
    npc: '연구원 로렌',
    reward: '메가스톤(리자몽X) + 50,000골드',
    difficulty: '어려움',
    description: '숨겨진 연구소에서 메가진화 실험을 도와주세요.',
    emoji: '🔬',
    difficultyColor: 'text-orange-600 bg-orange-50'
  },
  {
    id: 5,
    title: '지하 터널의 괴소문',
    location: '지하 터널',
    npc: '탐험가 장',
    reward: '어둠의돌 + 이벨타르 위치 정보',
    difficulty: '보통',
    description: '지하 터널 깊숙한 곳에서 이상한 소리가 들린다고 합니다.',
    emoji: '🕳️',
    difficultyColor: 'text-blue-600 bg-blue-50'
  },
  {
    id: 6,
    title: '보타니컬 정원 축제',
    location: '보타니컬 정원',
    npc: '정원사 소피',
    reward: '진화의돌(리프) + 드레디어',
    difficulty: '쉬움',
    description: '정원 축제를 위해 풀 타입 포켓몬 5마리를 보여주세요.',
    emoji: '🌺',
    difficultyColor: 'text-green-600 bg-green-50'
  },
  {
    id: 7,
    title: '샹젤리제의 패션쇼',
    location: '샹젤리제 거리',
    npc: '디자이너 클로에',
    reward: '자전거 + 푸호꼬',
    difficulty: '쉬움',
    description: '패션쇼에 출연할 귀여운 포켓몬을 추천해주세요.',
    emoji: '👗',
    difficultyColor: 'text-green-600 bg-green-50'
  },
  {
    id: 8,
    title: '구시가지의 유령',
    location: '구시가지',
    npc: '소녀 아멜리',
    reward: '진화의돌(달) + 샹델라',
    difficulty: '보통',
    description: '밤에만 나타나는 유령 포켓몬의 정체를 밝혀주세요.',
    emoji: '🕯️',
    difficultyColor: 'text-blue-600 bg-blue-50'
  },
  {
    id: 9,
    title: '루미오스 챔피언 도전',
    location: '체육관 지구',
    npc: '챔피언 방어자',
    reward: '메가스톤(루카리오) + 마스터볼',
    difficulty: '매우 어려움',
    description: '10명의 연속 도전자를 물리치고 챔피언 자리를 지켜내세요.',
    emoji: '🏆',
    difficultyColor: 'text-red-600 bg-red-50'
  },
  {
    id: 10,
    title: '전설의 포켓몬 제르네아스',
    location: '프리즘 타워 꼭대기',
    npc: '박사 플라타느',
    reward: '메가링 + 제르네아스 조우',
    difficulty: '매우 어려움',
    description: '프리즘 타워에서 생명의 포켓몬 제르네아스를 만나보세요.',
    emoji: '🦌',
    difficultyColor: 'text-red-600 bg-red-50'
  },
];

const typeColors = {
  '노말': '#A8A878',
  '불꽃': '#F08030',
  '물': '#6890F0',
  '전기': '#F8D030',
  '풀': '#78C850',
  '얼음': '#98D8D8',
  '격투': '#C03028',
  '독': '#A040A0',
  '땅': '#E0C068',
  '비행': '#A890F0',
  '에스퍼': '#F85888',
  '벌레': '#A8B820',
  '바위': '#B8A038',
  '고스트': '#705898',
  '드래곤': '#7038F8',
  '악': '#705848',
  '강철': '#B8B8D0',
  '페어리': '#EE99AC',
};

// 타입 상성표 (공격하는 타입 -> 받는 타입)
const typeEffectiveness = {
  '노말': { weak: [], resist: ['바위', '강철'], immune: ['고스트'] },
  '불꽃': { weak: ['풀', '얼음', '벌레', '강철'], resist: ['불꽃', '물', '바위', '드래곤'], immune: [] },
  '물': { weak: ['불꽃', '땅', '바위'], resist: ['물', '풀', '드래곤'], immune: [] },
  '전기': { weak: ['물', '비행'], resist: ['전기', '풀', '드래곤'], immune: ['땅'] },
  '풀': { weak: ['물', '땅', '바위'], resist: ['불꽃', '풀', '독', '비행', '벌레', '드래곤', '강철'], immune: [] },
  '얼음': { weak: ['풀', '땅', '비행', '드래곤'], resist: ['불꽃', '물', '얼음', '강철'], immune: [] },
  '격투': { weak: ['노말', '얼음', '바위', '악', '강철'], resist: ['독', '비행', '에스퍼', '벌레', '페어리'], immune: ['고스트'] },
  '독': { weak: ['풀', '페어리'], resist: ['독', '땅', '바위', '고스트'], immune: ['강철'] },
  '땅': { weak: ['불꽃', '전기', '독', '바위', '강철'], resist: ['풀', '벌레'], immune: ['비행'] },
  '비행': { weak: ['풀', '격투', '벌레'], resist: ['전기', '바위', '강철'], immune: [] },
  '에스퍼': { weak: ['격투', '독'], resist: ['에스퍼', '강철'], immune: ['악'] },
  '벌레': { weak: ['풀', '에스퍼', '악'], resist: ['불꽃', '격투', '독', '비행', '고스트', '강철', '페어리'], immune: [] },
  '바위': { weak: ['불꽃', '얼음', '비행', '벌레'], resist: ['격투', '땅', '강철'], immune: [] },
  '고스트': { weak: ['에스퍼', '고스트'], resist: ['악'], immune: ['노말'] },
  '드래곤': { weak: ['드래곤'], resist: ['강철'], immune: ['페어리'] },
  '악': { weak: ['에스퍼', '고스트'], resist: ['격투', '악', '페어리'], immune: [] },
  '강철': { weak: ['바위', '얼음', '페어리'], resist: ['불꽃', '물', '전기', '강철'], immune: [] },
  '페어리': { weak: ['격투', '드래곤', '악'], resist: ['불꽃', '독', '강철'], immune: [] },
};

// 방어 상성표 (포켓몬이 받는 데미지)
const defensiveMatchup = {
  '노말': { weakTo: ['격투'], resistFrom: [], immuneTo: ['고스트'] },
  '불꽃': { weakTo: ['물', '땅', '바위'], resistFrom: ['불꽃', '풀', '얼음', '벌레', '강철', '페어리'], immuneTo: [] },
  '물': { weakTo: ['전기', '풀'], resistFrom: ['불꽃', '물', '얼음', '강철'], immuneTo: [] },
  '전기': { weakTo: ['땅'], resistFrom: ['전기', '비행', '강철'], immuneTo: [] },
  '풀': { weakTo: ['불꽃', '얼음', '독', '비행', '벌레'], resistFrom: ['물', '전기', '풀', '땅'], immuneTo: [] },
  '얼음': { weakTo: ['불꽃', '격투', '바위', '강철'], resistFrom: ['얼음'], immuneTo: [] },
  '격투': { weakTo: ['비행', '에스퍼', '페어리'], resistFrom: ['벌레', '바위', '악'], immuneTo: [] },
  '독': { weakTo: ['땅', '에스퍼'], resistFrom: ['풀', '격투', '독', '벌레', '페어리'], immuneTo: [] },
  '땅': { weakTo: ['물', '풀', '얼음'], resistFrom: ['독', '바위'], immuneTo: ['전기'] },
  '비행': { weakTo: ['전기', '얼음', '바위'], resistFrom: ['풀', '격투', '벌레'], immuneTo: ['땅'] },
  '에스퍼': { weakTo: ['벌레', '고스트', '악'], resistFrom: ['격투', '에스퍼'], immuneTo: [] },
  '벌레': { weakTo: ['불꽃', '비행', '바위'], resistFrom: ['풀', '격투', '땅'], immuneTo: [] },
  '바위': { weakTo: ['물', '풀', '격투', '땅', '강철'], resistFrom: ['노말', '불꽃', '독', '비행'], immuneTo: [] },
  '고스트': { weakTo: ['고스트', '악'], resistFrom: ['독', '벌레'], immuneTo: ['노말', '격투'] },
  '드래곤': { weakTo: ['얼음', '드래곤', '페어리'], resistFrom: ['불꽃', '물', '전기', '풀'], immuneTo: [] },
  '악': { weakTo: ['격투', '벌레', '페어리'], resistFrom: ['고스트', '악'], immuneTo: ['에스퍼'] },
  '강철': { weakTo: ['불꽃', '격투', '땅'], resistFrom: ['노말', '풀', '얼음', '비행', '에스퍼', '벌레', '바위', '드래곤', '강철', '페어리'], immuneTo: ['독'] },
  '페어리': { weakTo: ['독', '강철'], resistFrom: ['격투', '벌레', '악'], immuneTo: ['드래곤'] },
};

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
