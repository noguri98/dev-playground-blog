import { useState, useEffect } from "react";
import { getDateTime } from "@/utils/funDatetime";

interface UseDatetimeUpdateProps {
    nation?: string;
    city?: string;
}

export function useDateTimeUpdate({ nation, city }: UseDatetimeUpdateProps) {
    // 시간 정보를 state로 관리 (초기값은 null로 설정)
    const [dateTimeInfo, setDateTimeInfo] = useState<any>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // 클라이언트에서만 실행
        setIsClient(true);
        setDateTimeInfo(getDateTime(nation, city));
        
        const timer = setInterval(() => {
            setDateTimeInfo(getDateTime(nation, city));
        }, 1000); // 1초마다 시간 업데이트

        // 컴포넌트 언마운트 시 타이머 정리
        return () => clearInterval(timer);
    }, [nation, city]);

    return {
        dateTimeInfo: isClient ? dateTimeInfo : null,
        isClient
    };
}