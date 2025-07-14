import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
    try {
        // profile.json 파일 경로
        const profilePath = join(process.cwd(), 'public', 'data', 'profile.json');
        
        // 기존 프로필 데이터 읽기
        const profileData = JSON.parse(await readFile(profilePath, 'utf-8'));
        
        // profile 정보만 제거 (이미지 파일은 유지)
        delete profileData.profile;
        
        // 업데이트된 데이터를 파일에 저장
        await writeFile(profilePath, JSON.stringify(profileData, null, 2), 'utf-8');

        return NextResponse.json({
            success: true,
            message: '프로필이 성공적으로 삭제되었습니다.'
        });

    } catch (error) {
        console.error('Profile delete error:', error);
        return NextResponse.json(
            { error: '프로필 삭제 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 