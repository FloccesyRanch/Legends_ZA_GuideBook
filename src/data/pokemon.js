// 포켓몬 데이터
export const pokemonData = [
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

/**
 * 포켓몬 이미지 경로를 반환합니다.
 * public/images/pokemon/{id}.png 형식의 이미지를 찾습니다.
 *
 * @param {number} id - 포켓몬 ID
 * @returns {string} 이미지 경로
 */
export const getPokemonImagePath = (id) => `/images/pokemon/${id}.png`;

/**
 * 아이템 이미지 경로를 반환합니다.
 * public/images/items/{id}.png 형식의 이미지를 찾습니다.
 *
 * @param {number} id - 아이템 ID
 * @returns {string} 이미지 경로
 */
export const getItemImagePath = (id) => `/images/items/${id}.png`;

/**
 * 퀘스트 이미지 경로를 반환합니다.
 * public/images/quests/{id}.png 형식의 이미지를 찾습니다.
 *
 * @param {number} id - 퀘스트 ID
 * @returns {string} 이미지 경로
 */
export const getQuestImagePath = (id) => `/images/quests/${id}.png`;
