"use client";

import Profile from "@/components/leftpnl_profile";
import DateTime from "@/components/datetime";
import Monthly from "@/components/leftpnl_monthly";

interface LeftPnlProps {
    jsonData: any;
}

export default function LeftPnl({ jsonData }: LeftPnlProps) {
    
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



    return (
        <div className='flex items-center flex-col border-1 border-gray-300 rounded-[20px] gap-[30px] px-2 pb-4' style={{ width: '250px', minHeight: '500px', height: '100%'}}>
            <Profile jsonData={jsonData} />
            <Monthly />
        </div>
    )
}