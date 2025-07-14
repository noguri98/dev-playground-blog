import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('image') as File;
        
        if (!file) {
            return NextResponse.json(
                { error: '이미지 파일이 필요합니다.' },
                { status: 400 }
            );
        }

        // 파일 타입 검증
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { error: '이미지 파일만 업로드할 수 있습니다.' },
                { status: 400 }
            );
        }

        // 파일 크기 검증 (5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: '파일 크기는 5MB 이하여야 합니다.' },
                { status: 400 }
            );
        }

        // 파일 확장자 추출
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!fileExtension || !['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
            return NextResponse.json(
                { error: '지원하지 않는 파일 형식입니다.' },
                { status: 400 }
            );
        }

        // 고유한 파일명 생성
        const timestamp = Date.now();
        const filename = `profile_${timestamp}.${fileExtension}`;
        
        // 저장 경로 설정
        const uploadDir = join(process.cwd(), 'public', 'image', 'user', 'noguri');
        const filePath = join(uploadDir, filename);

        // 디렉토리가 없으면 생성
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // 파일을 바이트 배열로 변환
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 파일 저장
        await writeFile(filePath, buffer);

        return NextResponse.json({
            success: true,
            filename: filename,
            message: '이미지가 성공적으로 업로드되었습니다.'
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: '파일 업로드 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 