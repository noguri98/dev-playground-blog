"use client";

import { getJsonData, getDateTime } from "@/utils/funLeftpnl";
import { useState, useEffect } from "react";

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

    // 시간 정보를 state로 관리
    const [dateTimeInfo, setDateTimeInfo] = useState(() => 
        getDateTime(jsonData.info.nation, jsonData.info.city)
    );

    // 1초마다 시간 업데이트
    useEffect(() => {
        const timer = setInterval(() => {
            setDateTimeInfo(getDateTime(jsonData.info.nation, jsonData.info.city));
        }, 1000);

        // 컴포넌트 언마운트 시 타이머 정리
        return () => clearInterval(timer);
    }, [jsonData.info.nation, jsonData.info.city]);

    return (
        <div className='flex items-center flex-col border-1 border-gray-300 rounded-[20px] gap-[30px] px-2 pb-4' style={{ width: '250px', minHeight: '500px', height: '100%'}}>
            <Profile jsonData={jsonData}/>
            <DateTime dateTimeInfo={dateTimeInfo} info={jsonData.info}/>
            <Monthly />
        </div>
    )
}