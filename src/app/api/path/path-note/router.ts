import { NextRequest, NextResponse } from 'next/server';

const FASTAPI_BASE_URL = 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    // 요청 본문에서 note_path 추출
    const body = await request.json();
    const { note_path } = body;

    if (!note_path) {
      return NextResponse.json(
        { error: 'note_path is required' },
        { status: 400 }
      );
    }

    // FastAPI 백엔드의 /api/filelist 엔드포인트로 요청 전달
    const response = await fetch(`${FASTAPI_BASE_URL}/api/filelist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ note_path }),
    });

    if (!response.ok) {
      throw new Error(`FastAPI request failed: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
