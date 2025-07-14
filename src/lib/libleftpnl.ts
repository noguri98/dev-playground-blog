
/*
    프로필 데이터를 가져와 내보내는 함수

    PATH: /public/data/profile.json
*/

import profile from "../../public/data/profile.json";
import { timezoneMap, cityTimezoneMap } from "../type/timezoneMaps";

export function getJsonData() {
    return profile;
}

/*
    날짜와 시간을 가져와 포맷을 변경하고 내보내는 함수
    국가와 도시 정보를 받아서 해당 지역의 시간대에 맞춰 반환
*/
export function getDateTime(nation?: string, city?: string) {

    let timezone = "Asia/Seoul"; // 기본값

    // 도시가 있으면 도시 기준으로 시간대 설정
    if (city && cityTimezoneMap[city]) {
        timezone = cityTimezoneMap[city];
    }
    // 도시가 없고 국가가 있으면 국가 기준으로 시간대 설정
    else if (nation && timezoneMap[nation]) {
        timezone = timezoneMap[nation];
    }

    try {
        const now = new Date();
        const localTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
        
        const year = localTime.getFullYear();
        const month = String(localTime.getMonth() + 1).padStart(2, '0');
        const day = String(localTime.getDate()).padStart(2, '0');
        const hours = String(localTime.getHours()).padStart(2, '0');
        const minutes = String(localTime.getMinutes()).padStart(2, '0');
        const seconds = String(localTime.getSeconds()).padStart(2, '0');
        
        return {
            date: `${year}-${month}-${day}`,
            time: `${hours}:${minutes}:${seconds}`,
            full: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
            timezone: timezone,
            location: city ? `${nation}, ${city}` : nation || "Unknown"
        };
    } catch (error) {
        // 시간대 변환에 실패하면 로컬 시간 사용
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        return {
            date: `${year}-${month}-${day}`,
            time: `${hours}:${minutes}:${seconds}`,
            full: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
            timezone: "Local",
            location: "Local Time"
        };
    }
}