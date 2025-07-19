import React, { useState } from 'react';
import useFilelist from '../hooks/useFilelist';
import { FileStructure } from '../type/constFilelist';
import { getFileIcon, searchInFileStructure, extractAllFilePaths } from '../utils/funFilelist';

// FileTree 컴포넌트 (내장)
interface FileTreeProps {
  structure: FileStructure;
  level?: number;
  onFileClick?: (filePath: string) => void;
  onDirClick?: (dirPath: string) => void;
}

const FileTree: React.FC<FileTreeProps> = ({ 
  structure, 
  level = 0, 
  onFileClick,
  onDirClick 
}) => {
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());

  const getDirIcon = (isOpen: boolean = false): React.ReactNode => {
    if (isOpen) {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 4H9L11 6H19C20.1046 6 21 6.89543 21 8V9H5V6C5 4.89543 4.10457 4 3 4V4C3 4 3 4 5 4Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1"/>
          <path d="M3 9H21L19.5 18.5C19.3 19.4 18.5 20 17.6 20H6.4C5.5 20 4.7 19.4 4.5 18.5L3 9Z" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="1"/>
        </svg>
      );
    } else {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V8C22 6.89543 21.1046 6 20 6H12L10 4Z" fill="#94A3B8" stroke="#64748B" strokeWidth="1"/>
        </svg>
      );
    }
  };

  const toggleDirectory = (dirName: string) => {
    const newExpanded = new Set(expandedDirs);
    if (newExpanded.has(dirName)) {
      newExpanded.delete(dirName);
    } else {
      newExpanded.add(dirName);
    }
    setExpandedDirs(newExpanded);
    onDirClick?.(dirName);
  };

  const renderFileStructure = (struct: FileStructure, currentLevel: number = 0): React.ReactNode => {
    const items: React.ReactNode[] = [];

    // 먼저 디렉토리들을 처리
    const directories = Object.entries(struct).filter(([key, value]) => 
      key !== '_files' && typeof value === 'object' && !Array.isArray(value)
    );

    // 파일들을 처리
    const files = struct._files as string[] || [];

    // 디렉토리 렌더링
    directories.forEach(([dirName, dirContent]) => {
      const isExpanded = expandedDirs.has(dirName);
      
      items.push(
        <div key={`dir-${dirName}`} className="mb-1">
          <div 
            className="flex items-center cursor-pointer hover:bg-blue-50 p-1 rounded select-none"
            style={{ paddingLeft: `${currentLevel * 1}px` }}
            onClick={() => toggleDirectory(dirName)}
          >
            <span 
              className={`mr-2 text-xs text-gray-500 transition-transform duration-200 ${
                isExpanded ? 'transform rotate-90' : ''
              }`}
            >
              &gt;
            </span>
            <span className="font-semibold text-gray-500 text-sm">{dirName}</span>
          </div>
          
          {isExpanded && (
            <div className="ml-2">
              {renderFileStructure(dirContent as FileStructure, currentLevel + 1)}
            </div>
          )}
        </div>
      );
    });

    // 파일 렌더링
    files.forEach((fileName) => {
      const fileIcon = getFileIcon(fileName);
      
      items.push(
        <div 
          key={`file-${fileName}`}
          className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded text-gray-700 select-none"
          style={{ paddingLeft: `${currentLevel * 2}px` }}
          onClick={() => onFileClick?.(fileName)}
        >
          <span className="mr-2 text-sm">{fileIcon}</span>
          <span className="text-sm">{fileName}</span>
        </div>
      );
    });

    return items;
  };

  if (Object.keys(structure).length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        <div className="text-2xl mb-2">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V8C22 6.89543 21.1046 6 20 6H12L10 4Z" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 4"/>
          </svg>
        </div>
        <p className="text-sm">폴더가 비어있습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {renderFileStructure(structure, level)}
    </div>
  );
};

// 메인 파일 리스트 컴포넌트
export default function FileList() {
  const { fileStructure, isLoading, error, currentPath, refetch, updateProfile } = useFilelist();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // 검색된 파일 구조
  const filteredStructure = searchQuery 
    ? searchInFileStructure(fileStructure, searchQuery)
    : fileStructure;

  // 총 파일 개수 계산
  const totalFiles = extractAllFilePaths(fileStructure).length;

  const handleFileClick = (fileName: string) => {
    console.log('파일 클릭:', fileName);
    // 여기에 파일 열기 로직 추가 가능
  };

  const handleDirClick = (dirName: string) => {
    console.log('디렉토리 클릭:', dirName);
    // 여기에 디렉토리 관련 로직 추가 가능
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
    }
  };

  if (isLoading && Object.keys(fileStructure).length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">파일 구조 로딩 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <div className="flex items-center text-red-600 mb-2">
          <span className="mr-2">⚠️</span>
          오류 발생
        </div>
        <p className="text-sm text-red-500 mb-3">{error}</p>
        <button 
          onClick={refetch}
          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto border border-gray-300 rounded-[20px] bg-white" style={{ width: '100%', height: 'auto'}}>
      {/* 헤더 */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10 rounded-t-[20px]">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-800">파일 탐색기</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleSearchToggle}
              className="p-1 hover:bg-gray-100 rounded"
              title="검색"
            >
              <span className="text-sm">🔍</span>
            </button>
            <button 
              onClick={refetch}
              className="p-1 hover:bg-gray-100 rounded"
              disabled={isLoading}
              title="새로고침"
            >
              <span className={`text-sm ${isLoading ? 'animate-spin' : ''}`}>
                🔄
              </span>
            </button>
          </div>
        </div>

        {/* 검색 박스 */}
        {showSearch && (
          <div className="mb-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="파일명 검색..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        
        {/* 현재 경로 및 파일 개수 표시 */}
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <div className="flex justify-between items-center">
            <span className="truncate">{currentPath || '로딩 중...'}</span>
            <span className="ml-2 whitespace-nowrap">
              {totalFiles > 0 && `${totalFiles}개 파일`}
            </span>
          </div>
        </div>

        {/* 검색 결과 표시 */}
        {searchQuery && (
          <div className="mt-2 text-xs text-blue-600">
            "{searchQuery}" 검색 결과
          </div>
        )}
      </div>

      {/* 파일 트리 */}
      <div className="p-2">
        {Object.keys(filteredStructure).length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-2xl mb-2">
              {searchQuery ? '🔍' : (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V8C22 6.89543 21.1046 6 20 6H12L10 4Z" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 4"/>
                </svg>
              )}
            </div>
            <p className="text-sm">
              {searchQuery ? '검색 결과가 없습니다' : '파일이 없습니다'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs text-blue-600 hover:underline"
              >
                검색 초기화
              </button>
            )}
          </div>
        ) : (
          <FileTree 
            structure={filteredStructure}
            onFileClick={handleFileClick}
            onDirClick={handleDirClick}
          />
        )}
      </div>

      {/* 상태 표시 */}
      {isLoading && Object.keys(fileStructure).length > 0 && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm shadow-lg">
          동기화 중...
        </div>
      )}
    </div>
  );
}