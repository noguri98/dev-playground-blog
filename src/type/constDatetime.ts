/*
    국가별, 도시별 시간대 매핑 데이터
*/

// 국가별 시간대 매핑
export const timezoneMap: { [key: string]: string } = {
    "대한민국": "Asia/Seoul",
    "미국": "America/New_York",
    "일본": "Asia/Tokyo",
    "중국": "Asia/Shanghai",
    "영국": "Europe/London",
    "프랑스": "Europe/Paris",
    "독일": "Europe/Berlin",
    "호주": "Australia/Sydney",
    "캐나다": "America/Toronto",
    "브라질": "America/Sao_Paulo"
};

// 도시별 특별한 시간대 매핑
export const cityTimezoneMap: { [key: string]: string } = {
    "서울": "Asia/Seoul",
    "부산": "Asia/Seoul",
    "대구": "Asia/Seoul",
    "인천": "Asia/Seoul",
    "광주": "Asia/Seoul",
    "대전": "Asia/Seoul",
    "울산": "Asia/Seoul",
    "구미시": "Asia/Seoul",
    "뉴욕": "America/New_York",
    "로스앤젤레스": "America/Los_Angeles",
    "시카고": "America/Chicago",
    "런던": "Europe/London",
    "파리": "Europe/Paris",
    "베를린": "Europe/Berlin",
    "도쿄": "Asia/Tokyo",
    "상하이": "Asia/Shanghai",
    "시드니": "Australia/Sydney"
}; 