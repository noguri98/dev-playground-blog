/*
    프로필 데이터를 가져와 내보내는 함수

    PATH: /public/data/profile.json
*/

import profile from "../../public/data/profile.json";

export function getJsonData() {
    return profile;
}