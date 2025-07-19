import { useState, useEffect, useCallback } from 'react';
import { FileStructure, Profile } from '../type/constFilelist';
import { fetchFileStructureFromAPI, compareFileStructures } from '../utils/funFilelist';

const useFilelist = () => {
  const [fileStructure, setFileStructure] = useState<FileStructure>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<string>('');

  // note_path 가져오기 (환경변수 우선, 그 다음 profile.json, localStorage 순)
  const getProfilePath = useCallback(async (): Promise<string> => {
    // 1. 환경변수에서 시도 (최우선)
    const envPath = process.env.NOTE_PATH;
    if (envPath) {
      console.log('Using note path from environment variable:', envPath);
      return envPath;
    }

    // 2. localStorage에서 시도
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

    // 3. profile.json 파일에서 시도 (public/data 폴더)
    try {
      const response = await fetch('/data/profile.json');
      if (response.ok) {
        const profile: Profile = await response.json();
        console.log('Profile loaded successfully from /data/profile.json:', profile);
        return profile.note_path;
      }
    } catch (err) {
      console.log('Failed to load from /data/profile.json:', err);
    }

    // 4. 기본값 반환
    console.log('Using default note path');
    return '/Users/nogyumin/obsidian';
  }, []);

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
      const currentProfile = { ...newProfile };
      localStorage.setItem('profile', JSON.stringify(currentProfile));
      console.log('Profile updated:', currentProfile);
      
      // 즉시 파일 구조 새로고침
      fetchFileStructure();
    } catch (err) {
      console.error('Profile 업데이트 실패:', err);
    }
  }, [fetchFileStructure]);

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
  };
};

export default useFilelist;