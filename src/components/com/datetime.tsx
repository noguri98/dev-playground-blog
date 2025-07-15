"use client";

import { useDateTimeUpdate } from "@/hooks/useDatetime";

interface Info {
    nation: string;
    city: string;
}

export default function DateTime({ info }: { info: Info }) {
    
    // 커스텀 훅을 사용하여 시간 정보 관리
    const { dateTimeInfo } = useDateTimeUpdate({
        nation: info.nation,
        city: info.city
    });

    return (
        <div className='flex items-center py-2 gap-[20px]' style={{ width: '100%', height: '100%'}}>
          <span className='text-sm text-gray-400'>{dateTimeInfo.date} </span>
          <span className='text-sm text-gray-400'>{dateTimeInfo.time}</span>
          <span className='text-sm text-gray-400'>{dateTimeInfo.timezone}</span>
        </div>
    );
}