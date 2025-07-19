import { FileStructure, FileStructureResponse, FileTreeNode } from '../type/constFilelist';

// JSON 구조 파일 리스트 API 요청 함수
export const fetchFileStructureFromAPI = async (notePath: string): Promise<FileStructure> => {
  try {
    const response = await fetch('http://localhost:8000/api/filelist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        note_path: notePath
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: FileStructureResponse = await response.json();
    
    if (data.status === 'error') {
      throw new Error(data.error_message || 'API에서 오류가 발생했습니다');
    }
    
    return data.file_structure || {};
  } catch (error) {
    console.error('파일 구조 요청 오류:', error);
    throw error;
  }
};

// 파일 구조 비교 함수
export const compareFileStructures = (oldStructure: FileStructure, newStructure: FileStructure): boolean => {
  return JSON.stringify(oldStructure) === JSON.stringify(newStructure);
};

// JSON 파일 구조를 FileTreeNode로 변환
export const convertToFileTreeNodes = (structure: FileStructure, parentPath: string = ''): FileTreeNode[] => {
  const nodes: FileTreeNode[] = [];
  
  for (const [key, value] of Object.entries(structure)) {
    const currentPath = parentPath ? `${parentPath}/${key}` : key;
    
    if (key === '_files' && Array.isArray(value)) {
      // 파일들은 개별 노드로 추가
      value.forEach(fileName => {
        nodes.push({
          name: fileName,
          type: 'file',
          path: `${parentPath}/${fileName}`
        });
      });
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      // 디렉토리인 경우
      const children = convertToFileTreeNodes(value, currentPath);
      const files = value._files as string[] || [];
      
      nodes.push({
        name: key,
        type: 'directory',
        children,
        files,
        path: currentPath
      });
    }
  }
  
  return nodes.sort((a, b) => {
    // 디렉토리가 파일보다 먼저, 그 다음 알파벳 순
    if (a.type !== b.type) {
      return a.type === 'directory' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
};

// 파일 확장자에 따른 아이콘 반환
export const getFileIcon = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'md':
      return '📝';
    case 'txt':
      return '📄';
    case 'pdf':
      return '📕';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
    case 'svg':
      return '🖼️';
    case 'js':
    case 'jsx':
      return '🟨';
    case 'ts':
    case 'tsx':
      return '🔷';
    case 'json':
      return '📋';
    case 'py':
      return '🐍';
    case 'html':
      return '🌐';
    case 'css':
      return '🎨';
    case 'scss':
    case 'sass':
      return '💅';
    case 'xml':
      return '📃';
    case 'csv':
      return '📊';
    case 'zip':
    case 'rar':
    case '7z':
      return '📦';
    case 'mp3':
    case 'wav':
    case 'flac':
      return '🎵';
    case 'mp4':
    case 'avi':
    case 'mov':
      return '🎬';
    case 'doc':
    case 'docx':
      return '📝';
    case 'xls':
    case 'xlsx':
      return '📊';
    case 'ppt':
    case 'pptx':
      return '📊';
    default:
      return '📄';
  }
};

// 디렉토리 아이콘 반환
export const getDirIcon = (isOpen: boolean = false): string => {
  return isOpen ? '📂' : '📁';
};

// 파일 구조에서 특정 경로의 아이템 찾기
export const findItemInStructure = (structure: FileStructure, targetPath: string): FileStructure | string[] | null => {
  const pathParts = targetPath.split('/').filter(part => part !== '');
  let current: any = structure;
  
  for (const part of pathParts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return null;
    }
  }
  
  return current;
};

// 파일 구조 깊이 계산
export const calculateStructureDepth = (structure: FileStructure): number => {
  let maxDepth = 0;
  
  const traverse = (obj: any, depth: number) => {
    maxDepth = Math.max(maxDepth, depth);
    
    if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
      for (const value of Object.values(obj)) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          traverse(value, depth + 1);
        }
      }
    }
  };
  
  traverse(structure, 0);
  return maxDepth;
};

// 파일 구조에서 모든 파일 경로 추출
export const extractAllFilePaths = (structure: FileStructure, parentPath: string = ''): string[] => {
  const paths: string[] = [];
  
  for (const [key, value] of Object.entries(structure)) {
    if (key === '_files' && Array.isArray(value)) {
      value.forEach(fileName => {
        const filePath = parentPath ? `${parentPath}/${fileName}` : fileName;
        paths.push(filePath);
      });
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      const dirPath = parentPath ? `${parentPath}/${key}` : key;
      paths.push(...extractAllFilePaths(value, dirPath));
    }
  }
  
  return paths;
};

// 파일 구조 검색 함수
export const searchInFileStructure = (structure: FileStructure, query: string): FileStructure => {
  if (!query.trim()) return structure;
  
  const lowerQuery = query.toLowerCase();
  const result: FileStructure = {};
  
  const searchRecursive = (obj: FileStructure, currentResult: FileStructure) => {
    for (const [key, value] of Object.entries(obj)) {
      if (key === '_files' && Array.isArray(value)) {
        const matchingFiles = value.filter(fileName => 
          fileName.toLowerCase().includes(lowerQuery)
        );
        if (matchingFiles.length > 0) {
          currentResult._files = matchingFiles;
        }
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        const dirMatches = key.toLowerCase().includes(lowerQuery);
        const subResult: FileStructure = {};
        searchRecursive(value, subResult);
        
        if (dirMatches || Object.keys(subResult).length > 0) {
          currentResult[key] = subResult;
        }
      }
    }
  };
  
  searchRecursive(structure, result);
  return result;
};