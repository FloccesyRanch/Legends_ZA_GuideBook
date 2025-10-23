/**
 * 이미지 로더 유틸리티
 *
 * 이 파일은 포켓몬, 아이템, 퀘스트 이미지를 로드하는 유틸리티 함수들을 제공합니다.
 *
 * ## 이미지 파일 구조:
 * - 포켓몬: public/images/pokemon/{id}.png
 * - 아이템: public/images/items/{id}.png
 * - 퀘스트: public/images/quests/{id}.png
 *
 * ## 사용 방법:
 * 1. public/images 폴더에 해당하는 하위 폴더 생성 (pokemon, items, quests)
 * 2. 각 폴더에 ID에 맞는 이미지 파일 추가 (예: 1.png, 2.png, ...)
 * 3. 이미지가 없으면 자동으로 emoji로 폴백됩니다
 */

/**
 * 포켓몬 이미지 경로를 반환합니다.
 *
 * @param {number} id - 포켓몬 ID
 * @returns {string} 이미지 경로
 */
export const getPokemonImagePath = (id) => `/images/pokemon/${id}.png`;

/**
 * 아이템 이미지 경로를 반환합니다.
 *
 * @param {number} id - 아이템 ID
 * @returns {string} 이미지 경로
 */
export const getItemImagePath = (id) => `/images/items/${id}.png`;

/**
 * 퀘스트 이미지 경로를 반환합니다.
 *
 * @param {number} id - 퀘스트 ID
 * @returns {string} 이미지 경로
 */
export const getQuestImagePath = (id) => `/images/quests/${id}.png`;

/**
 * 이미지 로딩 여부를 확인하는 헬퍼 함수
 *
 * @param {string} src - 이미지 경로
 * @returns {Promise<boolean>} 이미지 로드 성공 여부
 */
export const checkImageExists = async (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
};
