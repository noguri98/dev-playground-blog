"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface WeatherData {
    main: {
        temp: number;
        humidity: number;
        feels_like: number;
    };
    weather: Array<{
        main: string;
        description: string;
        icon: string;
    }>;
    name: string;
}

export default function DateTime() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    // 실시간 시간 업데이트
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // 날씨 정보 가져오기 (무료 API 사용)
    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // 구미시의 위도/경도 (대략적인 위치)
                const lat = 36.1194;
                const lon = 128.3446;
                
                // 무료 날씨 API 사용 (wttr.in)
                const response = await fetch(
                    `https://wttr.in/Gumi?format=j1`
                );
                
                if (response.ok) {
                    const data = await response.json();
                    const current = data.current_condition[0];
                    
                    const weatherData: WeatherData = {
                        main: {
                            temp: parseFloat(current.temp_C),
                            humidity: parseInt(current.humidity),
                            feels_like: parseFloat(current.FeelsLikeC)
                        },
                        weather: [{
                            main: current.weatherDesc[0].value,
                            description: current.weatherDesc[0].value,
                            icon: current.weatherIconUrl[0].value
                        }],
                        name: '구미'
                    };
                    
                    setWeather(weatherData);
                }
            } catch (error) {
                console.error('날씨 정보를 가져오는데 실패했습니다:', error);
                // 더미 데이터로 대체
                const dummyWeather: WeatherData = {
                    main: {
                        temp: 22,
                        humidity: 65,
                        feels_like: 24
                    },
                    weather: [{
                        main: 'Clear',
                        description: '맑음',
                        icon: '01d'
                    }],
                    name: '구미시'
                };
                setWeather(dummyWeather);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
        
        // 30분마다 날씨 정보 업데이트
        const weatherTimer = setInterval(fetchWeather, 30 * 60 * 1000);
        
        return () => clearInterval(weatherTimer);
    }, []);

    // 날씨 아이콘 URL 생성
    const getWeatherIconUrl = (iconCode: string) => {
        return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    };

    // 날씨 상태에 따른 이모지 반환
    const getWeatherEmoji = (weatherMain: string) => {
        switch (weatherMain.toLowerCase()) {
            case 'clear': return '☀️';
            case 'clouds': return '☁️';
            case 'rain': return '🌧️';
            case 'snow': return '❄️';
            case 'thunderstorm': return '⛈️';
            case 'drizzle': return '🌦️';
            case 'mist':
            case 'fog': return '🌫️';
            default: return '🌤️';
        }
    };

    return (
        <div className='flex flex-col border-1 border-gray-300 rounded-[20px] p-3 gap-2' style={{ width: '100%', height: '150px'}}>            
          <div className='flex flex-col justify-start items-start'>
            <span className='text-sm font-medium text-gray-800'>
                {format(currentDate, 'yyyy.MM.dd (E)', { locale: ko })}
            </span>
            <span className='text-l font-bold text-gray-800'>
                {format(currentDate, 'HH:mm:ss')}
            </span>
          </div>

          <div className='flex flex-col justify-start items-start'>
          <div className='flex flex-row justify-start items-center gap-2'>
            <span className='text-sm font-semibold text-gray-800'>구미</span>
              {loading ? (
                <div className='text-xs text-gray-500'>날씨 로딩중...</div>
              ) : weather ? (
                <div className='flex items-center gap-1'>
                  <span className='text-lg'>{getWeatherEmoji(weather.weather[0].main)}</span>
                  <span className='text-xs text-gray-600'>{Math.round(weather.main.temp)}°C</span>
                </div>
              ) : (
                <div className='text-xs text-gray-500'>날씨 정보 없음</div>
              )}
        </div>
        {weather && (
                <div className='flex flex-col justify-start items-start gap-0.5'>
                    <div className='text-xs text-gray-600'>
                        습도: {weather.main.humidity}%
                    </div>
                    <div className='text-xs text-gray-600'>
                        체감: {Math.round(weather.main.feels_like)}°C
                    </div>
                </div>
            )}
        </div>
        </div>
    )
}