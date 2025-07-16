import { useState, useEffect, useCallback } from 'react';
import { FileStructure, Profile } from '../type/constFilelist';
import { fetchFileStructureFromAPI, compareFileStructures } from '../utils/funFilelist';

const useFilelist = () => {
  const [fileStructure, setFileStructure] = useState<FileStructure>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<string>('');

  // 기본 profile 설정 (fallback)
  const defaultProfile: Profile = {
    name: "노규민",
    note_path: "/home/noguri/문서/obsidian",
    user: "noguri",
    message: "꾸준히 성장하는 개발자 noguri입니다.",
    info: {
      nation: "대한민국",
      city: "경북 구미시"
    }
  };

  // profile.json에서 note_path 가져오기 (여러 경로 시도)
  const getProfilePath = useCallback(async (): Promise<string> => {
    const possiblePaths = [
      '/profile.json',        // public 폴더
      './profile.json',       // 현재 디렉토리
      '../profile.json',      // 상위 디렉토리
      '/public/profile.json', // public 폴더 (명시적)
    ];

    // 1. 여러 경로에서 profile.json 시도
    for (const path of possiblePaths) {
      try {
        console.log(`Trying to load profile from: ${path}`);
        const response = await fetch(path);
        if (response.ok) {
          const profile: Profile = await response.json();
          console.log('Profile loaded successfully:', profile);
          return profile.note_path;
        }
      } catch (err) {
        console.log(`Failed to load from ${path}:`, err);
        continue;
      }
    }

    // 2. 모든 경로 실패 시 localStorage에서 시도
    try {
      const savedProfile = localStorage.getItem('profile');
      if (savedProfile) {
        const profile: Profile = JSON.parse(savedProfile);
        console.log('Profile loaded from localStorage:', profile);
        return profile.note_path;
      }
    } catch (err) {
      console.error('localStorage에서 profile 로드 실패:', err);
    }

    // 3. 환경변수에서 시도
    const envPath = process.env.REACT_APP_NOTE_PATH;
    if (envPath) {
      console.log('Using note path from environment variable:', envPath);
      return envPath;
    }

    // 4. 모든 방법 실패 시 기본값 사용
    console.warn('모든 profile 로드 방법 실패, 기본값 사용:', defaultProfile.note_path);
    
    // localStorage에 기본 profile 저장
    try {
      localStorage.setItem('profile', JSON.stringify(defaultProfile));
    } catch (err) {
      console.error('localStorage 저장 실패:', err);
    }
    
    return defaultProfile.note_path;
  }, [defaultProfile]);

  // FastAPI로 파일 구조 요청
  const fetchFileStructure = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const notePath = await getProfilePath();
      console.log('Using note path:', notePath);
      
      const newFileStructure = await fetchFileStructureFromAPI(notePath);
      console.log('API Response:', newFileStructure);
      
      // 이전 파일 구조와 비교하여 업데이트
      setFileStructure(prevStructure => {
        const isSame = compareFileStructures(prevStructure, newFileStructure);
        
        if (!isSame) {
          console.log('파일 구조 업데이트됨:', newFileStructure);
          return newFileStructure;
        }
        
        return prevStructure;
      });
      
      setCurrentPath(notePath);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '파일 구조를 가져오는데 실패했습니다.';
      setError(errorMessage);
      console.error('파일 구조 가져오기 오류:', err);
    } finally {
      setIsLoading(false);
    }
  }, [getProfilePath]);

  // 수동으로 profile 설정하는 함수 추가
  const updateProfile = useCallback((newProfile: Partial<Profile>) => {
    try {
      const currentProfile = { ...defaultProfile, ...newProfile };
      localStorage.setItem('profile', JSON.stringify(currentProfile));
      console.log('Profile updated:', currentProfile);
      
      // 즉시 파일 구조 새로고침
      fetchFileStructure();
    } catch (err) {
      console.error('Profile 업데이트 실패:', err);
    }
  }, [defaultProfile, fetchFileStructure]);

  // 3초마다 파일 구조 업데이트
  useEffect(() => {
    // 초기 로드
    fetchFileStructure();
    
    // 3초마다 업데이트
    const interval = setInterval(fetchFileStructure, 3000);
    
    return () => clearInterval(interval);
  }, [fetchFileStructure]);

  return {
    fileStructure,      // 새로운 JSON 구조
    isLoading,
    error,
    currentPath,
    refetch: fetchFileStructure,
    updateProfile,
    defaultProfile
  };
};

export default useFilelist;