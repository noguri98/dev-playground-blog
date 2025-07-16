"use client";

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function Monthly() {
    const [currentDate, setCurrentDate] = useState(new Date());
    
    // 현재 월의 시작일과 마지막일
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    
    // 월의 모든 날짜 가져오기
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // 요일 헤더
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    
    // 이전 월로 이동
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };
    
    // 다음 월로 이동
    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };
    
    // 요일에 따른 색상 클래스 반환
    const getDayColorClass = (date: Date) => {
        const day = getDay(date);
        if (day === 0) return 'text-red-500'; // 일요일
        if (day === 6) return 'text-blue-500'; // 토요일
        return 'text-gray-700'; // 평일
    };
    
    // 오늘 날짜인지 확인
    const isToday = (date: Date) => isSameDay(date, new Date());
    
    // 월의 첫 번째 날의 요일 (0: 일요일, 1: 월요일, ...)
    const firstDayOfWeek = getDay(monthStart);
    
    // 빈 칸을 위한 배열 생성
    const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

    return (
        <div className='flex p-0.5 border-1 border-gray-300 rounded-[20px] px-2 ' style={{ width: '100%', height: '200px'}}>
            <div className="w-full h-full flex flex-col">
                {/* 헤더 - 월 표시 및 네비게이션 */}
                <div className="flex justify-between items-center mb-0.5 px-1 py-0.5">
                    <button 
                        onClick={prevMonth}
                        className="text-gray-500 hover:text-gray-700 text-l"
                    >
                        ‹
                    </button>
                    <span className="text-sm font-medium text-gray-800">
                        {format(currentDate, 'yyyy년 MM월', { locale: ko })}
                    </span>
                    <button 
                        onClick={nextMonth}
                        className="text-gray-500 hover:text-gray-700 text-l"
                    >
                        ›
                    </button>
                </div>
                
                {/* 요일 헤더 */}
                <div className="grid grid-cols-7 gap-0 mb-0.5">
                    {weekdays.map((day, index) => (
                        <div 
                            key={day} 
                            className={`text-xs font-medium text-center py-0 ${
                                index === 0 ? 'text-red-500' : 
                                index === 6 ? 'text-blue-500' : 
                                'text-gray-600'
                            }`}
                        >
                            {day}
                        </div>
                    ))}
                </div>
                
                {/* 날짜 그리드 */}
                <div className="grid grid-cols-7 gap-0 flex-1">
                    {/* 빈 칸들 */}
                    {emptyDays.map((_, index) => (
                        <div key={`empty-${index}`} className="py-0"></div>
                    ))}
                    
                    {/* 날짜들 */}
                    {monthDays.map((date) => (
                        <div 
                            key={date.toISOString()} 
                            className={`py-0 text-center text-xs font-medium cursor-pointer rounded hover:bg-gray-100 ${
                                getDayColorClass(date)
                            } ${
                                isToday(date) ? 'font-bold text-black' : ''
                            }`}
                        >
                            {format(date, 'd')}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}