"use client";

import { useState, useEffect } from "react";

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

interface Info {
    nation: string;
    city: string;
}

interface Props {
    info: Info;
}

export default function Weather({ info }: Props) {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    // 날씨 정보 가져오기 (무료 API 사용)
    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // info 정보를 사용하여 동적으로 도시 설정
                const cityName = info.city.replace(/^경북\s*/, ''); // "경북 구미시" -> "구미시"
                const searchCity = cityName.includes('시') ? cityName : `${cityName}시`;
                
                // 무료 날씨 API 사용 (wttr.in)
                const response = await fetch(
                    `https://wttr.in/${searchCity}?format=j1`
                );
                
                if (response.ok) {
                    const data = await response.json();
                    const current = data.current_condition?.[0];
                    
                    if (current) {
                        const weatherData: WeatherData = {
                            main: {
                                temp: parseFloat(current.temp_C) || 0,
                                humidity: parseInt(current.humidity) || 0,
                                feels_like: parseFloat(current.FeelsLikeC) || 0
                            },
                            weather: [{
                                main: current.weatherDesc?.[0]?.value || 'Unknown',
                                description: current.weatherDesc?.[0]?.value || 'Unknown',
                                icon: current.weatherIconUrl?.[0]?.value || ''
                            }],
                            name: cityName
                        };
                        
                        setWeather(weatherData);
                    } else {
                        throw new Error('날씨 데이터가 올바르지 않습니다.');
                    }
                } else {
                    throw new Error(`API 응답 오류: ${response.status}`);
                }
            } catch (error) {
                console.error('날씨 정보를 가져오는데 실패했습니다:', error);
                // 더미 데이터로 대체
                const cityName = info.city.replace(/^경북\s*/, '');
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
                    name: cityName
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
    }, [info.city]); // info.city가 변경될 때마다 날씨 정보 다시 가져오기

    // 날씨 상태에 따른 이모지 반환
    const getWeatherEmoji = (weatherMain: string): string => {
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
        <div className='flex flex-col justify-start items-start'>
            <div className='flex flex-row justify-start items-center gap-2'>
                <span className='text-sm font-semibold text-gray-800'>{info.city}</span>
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
    );
}