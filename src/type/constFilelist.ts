// JSON 구조 파일 시스템 타입
export interface FileStructure {
    [key: string]: FileStructure | string[];
  }
  
  // 기존 평면적 파일 리스트 타입 (호환성용)
  export interface FileList {
    files: string[];
  }
  
  // JSON 구조 API 응답 타입
  export interface FileStructureResponse {
    path: string;
    file_structure: FileStructure;
    status: string;
    error_message?: string;
  }
  
  // 기존 평면적 API 응답 타입 (호환성용)
  export interface FileListResponse {
    path: string;
    file_list: string[];
    status: string;
    error_message?: string;
  }
  
  // Profile 데이터 타입
  export interface Profile {
    name: string;
    note_path: string;
    user: string;
    message: string;
    info: {
      nation: string;
      city: string;
    };
  }
  
  // 파일 트리 노드 타입
  export interface FileTreeNode {
    name: string;
    type: 'file' | 'directory';
    children?: FileTreeNode[];
    files?: string[];
    path: string;
  }
  
  // 파일 리스트 상태 타입
  export interface FileListState {
    fileStructure: FileStructure;
    isLoading: boolean;
    error: string | null;
    currentPath: string;
  }