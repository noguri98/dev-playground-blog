/*
    profile.tsx의 util function 패키지

    1. ProfileRender: profile img 렌더링
    2. ProfileShow: profile img viewer
    3. ProfileTool: profile img menu
    4. ProfileUpdate: profile img update
    5. ProfileDelete: profile img delete
*/
"use client";

import { useState, useEffect } from 'react';

export function ProfileRender({ 
    userInfo,
    profile,
    onImageClick, 
    onContextMenu 
}: { 
    userInfo: any;
    profile: any;
    onImageClick: (imagePath: string) => void;
    onContextMenu: (e: React.MouseEvent, imagePath: string) => void;
}) {
    // noguri 회원이 아니거나 프로필 데이터가 없는 경우 기본 이미지 사용
    const imagePath = userInfo && userInfo.user === 'noguri' && profile && Object.keys(profile).length > 0 
        ? `/image/user/noguri/${profile.image || 'profile.png'}`
        : '/image/profile/profile.png';

    const handleImageClick = () => {
        onImageClick(imagePath);
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        onContextMenu(e, imagePath);
    };

    return (
        <div className="profile-render">
            <img 
                src={imagePath} 
                alt="Profile" 
                style={{ 
                    width: '170px', 
                    height: '170px', 
                    borderRadius: '50%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                }}
                onClick={handleImageClick}
                onContextMenu={handleContextMenu}
            />
        </div>
    );
}

export function ProfileShow({ imagePath, onClose }: { imagePath: string; onClose: () => void }) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden'; // 배경 스크롤 방지

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    return (
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                cursor: 'pointer'
            }}
            onClick={onClose}
        >
            <div 
                style={{
                    position: 'relative',
                    maxWidth: '90vw',
                    maxHeight: '90vh'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <img 
                    src={imagePath} 
                    alt="Profile Viewer" 
                    style={{
                        width: 'auto',
                        height: 'auto',
                        maxWidth: '100%',
                        maxHeight: '100%',
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                    }}
                />
                <div
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '-40px',
                        right: '0',
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: 'none',
                        color: 'white',
                        fontSize: '24px',
                        cursor: 'pointer',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        userSelect: 'none'
                    }}
                >
                    ×
                </div>
            </div>
        </div>
    );
}

export function ProfileTool({ position, onClose, onEdit, onDelete }: { 
    position: { x: number; y: number }; 
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const menuItems = [
        { id: 'edit', label: '프로필 수정', action: onEdit },
        { id: 'delete', label: '프로필 삭제', action: onDelete }
    ];

    useEffect(() => {
        const handleClickOutside = () => {
            onClose();
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('click', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    const handleItemClick = (action: () => void) => {
        action();
        onClose();
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: position.y,
                left: position.x,
                zIndex: 1001,
                backgroundColor: 'white',
                border: '1px solid #d1d5db', // gray-300
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                minWidth: '110px',
                maxHeight: '200px', // 최대 5개 아이템 정도
                overflowY: 'auto',
                padding: '4px 0'
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {menuItems.map((item) => (
                <div
                    key={item.id}
                    onClick={() => handleItemClick(item.action)}
                    style={{
                        padding: '8px 16px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#374151',
                        transition: 'background-color 0.2s ease',
                        userSelect: 'none'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6'; // gray-100
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                >
                    {item.label}
                </div>
            ))}
        </div>
    );
}

export function ProfileUpdate({ onClose, onUpdate }: { onClose: () => void; onUpdate: () => void }) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // 파일 타입 검증
        if (!file.type.startsWith('image/')) {
            setError('이미지 파일만 선택할 수 있습니다.');
            return;
        }

        // 파일 크기 검증 (5MB 제한)
        if (file.size > 5 * 1024 * 1024) {
            setError('파일 크기는 5MB 이하여야 합니다.');
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            // 파일을 FormData로 전송
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('/api/upload-profile', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('이미지 업로드에 실패했습니다.');
            }

            const result = await response.json();
            
            // profile.json 업데이트
            const updateResponse = await fetch('/api/update-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: result.filename
                }),
            });

            if (!updateResponse.ok) {
                throw new Error('프로필 업데이트에 실패했습니다.');
            }

            onUpdate(); // 부모 컴포넌트에 업데이트 알림
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleClickOutside = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                cursor: 'pointer'
            }}
            onClick={handleClickOutside}
        >
            <div 
                style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    maxWidth: '400px',
                    width: '90%',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ marginBottom: '20px' }}>
                    <h2 style={{ 
                        fontSize: '20px', 
                        fontWeight: '600', 
                        marginBottom: '8px',
                        color: '#1f2937'
                    }}>
                        프로필 이미지 수정
                    </h2>
                    <p style={{ 
                        fontSize: '14px', 
                        color: '#6b7280',
                        margin: 0
                    }}>
                        새로운 프로필 이미지를 선택해주세요.
                    </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label 
                        htmlFor="profile-image-input"
                        style={{
                            display: 'block',
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px dashed #d1d5db',
                            borderRadius: '8px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            backgroundColor: '#f9fafb'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#3b82f6';
                            e.currentTarget.style.backgroundColor = '#eff6ff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#d1d5db';
                            e.currentTarget.style.backgroundColor = '#f9fafb';
                        }}
                    >
                        <div style={{ fontSize: '16px', color: '#374151', marginBottom: '4px' }}>
                            📁 이미지 선택
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            JPG, PNG, GIF (최대 5MB)
                        </div>
                    </label>
                    <input
                        id="profile-image-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                        disabled={isUploading}
                    />
                </div>

                {error && (
                    <div style={{
                        padding: '12px',
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        marginBottom: '16px'
                    }}>
                        <p style={{ 
                            color: '#dc2626', 
                            fontSize: '14px', 
                            margin: 0 
                        }}>
                            {error}
                        </p>
                    </div>
                )}

                {isUploading && (
                    <div style={{
                        padding: '12px',
                        backgroundColor: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '6px',
                        marginBottom: '16px',
                        textAlign: 'center'
                    }}>
                        <p style={{ 
                            color: '#1d4ed8', 
                            fontSize: '14px', 
                            margin: 0 
                        }}>
                            이미지를 업로드하고 있습니다...
                        </p>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onClose}
                        disabled={isUploading}
                        style={{
                            padding: '8px 16px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            backgroundColor: 'white',
                            color: '#374151',
                            cursor: isUploading ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            opacity: isUploading ? 0.5 : 1
                        }}
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}

export function ProfileDelete({ onClose, onUpdate }: { onClose: () => void; onUpdate: () => void }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    const handleDelete = async () => {
        setIsDeleting(true);
        setError(null);

        try {
            const response = await fetch('/api/delete-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('프로필 삭제에 실패했습니다.');
            }

            onUpdate(); // 부모 컴포넌트에 업데이트 알림
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleClickOutside = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                cursor: 'pointer'
            }}
            onClick={handleClickOutside}
        >
            <div 
                style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    maxWidth: '400px',
                    width: '90%',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ marginBottom: '20px' }}>
                    <h2 style={{ 
                        fontSize: '20px', 
                        fontWeight: '600', 
                        marginBottom: '8px',
                        color: '#dc2626'
                    }}>
                        ⚠️ 프로필 삭제
                    </h2>
                    <p style={{ 
                        fontSize: '14px', 
                        color: '#6b7280',
                        margin: 0
                    }}>
                        프로필 정보를 삭제하시겠습니까?<br/>
                        이미지 파일은 그대로 유지됩니다.
                    </p>
                </div>

                {error && (
                    <div style={{
                        padding: '12px',
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        marginBottom: '16px'
                    }}>
                        <p style={{ 
                            color: '#dc2626', 
                            fontSize: '14px', 
                            margin: 0 
                        }}>
                            {error}
                        </p>
                    </div>
                )}

                {isDeleting && (
                    <div style={{
                        padding: '12px',
                        backgroundColor: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '6px',
                        marginBottom: '16px',
                        textAlign: 'center'
                    }}>
                        <p style={{ 
                            color: '#1d4ed8', 
                            fontSize: '14px', 
                            margin: 0 
                        }}>
                            프로필을 삭제하고 있습니다...
                        </p>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        style={{
                            padding: '8px 16px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            backgroundColor: 'white',
                            color: '#374151',
                            cursor: isDeleting ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            opacity: isDeleting ? 0.5 : 1
                        }}
                    >
                        취소
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        style={{
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '6px',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            cursor: isDeleting ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            opacity: isDeleting ? 0.5 : 1
                        }}
                    >
                        삭제
                    </button>
                </div>
            </div>
        </div>
    );
}