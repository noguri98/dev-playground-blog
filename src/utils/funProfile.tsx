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
        ? `/image/profile/${profile.image || 'profile.png'}`
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

export function ProfileTool({ position, onClose }: { position: { x: number; y: number }; onClose: () => void }) {
    const menuItems = [
        { id: 'edit', label: '프로필 수정', action: () => console.log('프로필 수정') },
        { id: 'delete', label: '프로필 삭제', action: () => console.log('프로필 삭제') }
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

export function ProfileEdit() {
    
}