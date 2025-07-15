"use client";

import { getJsonData } from "@/utils/funLeftpnl";
import { useDateTimeUpdate } from "@/hooks/useLeftpnl";

import Profile from "@/components/com/leftpnl_profile";
import DateTime from "@/components/com/leftpnl_datetime";
import Monthly from "@/components/com/leftpnl_monthly";

export default function LeftPnl() {
    const jsonData = getJsonData();
    /*
        jsonData 형식
        {
            "name": "노규민",
            "user": "noguri",
            "message": "꾸준히 성장하는 개발자 noguri입니다.",
            "info": {
                "nation": "대한민국",
                "city": "경북 구미시"
            }
        }
    */

    // 커스텀 훅을 사용하여 시간 정보 관리
    const { dateTimeInfo } = useDateTimeUpdate({
        nation: jsonData.info.nation,
        city: jsonData.info.city
    });

    return (
        <div className='flex items-center flex-col border-1 border-gray-300 rounded-[20px] gap-[30px] px-2 pb-4' style={{ width: '250px', minHeight: '500px', height: '100%'}}>
            <Profile jsonData={jsonData}/>
            <DateTime dateTimeInfo={dateTimeInfo} info={jsonData.info}/>
            <Monthly />
        </div>
    )
}