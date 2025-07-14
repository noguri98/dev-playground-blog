"use client";

import { ProfileRender, ProfileShow, ProfileTool, ProfileUpdate } from "@/utils/funProfile";
import { useState, useEffect } from "react";

export default function Profile() {
    const [showViewer, setShowViewer] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [selectedImagePath, setSelectedImagePath] = useState('');
    const [profile, setProfile] = useState<any>(null);
    const [userInfo, setUserInfo] = useState<any>(null);

    // JSON 데이터 가져오기
    const getProfile = async () => {
        try {
            const response = await fetch("/data/profile.json");
            if (!response.ok) {
                throw new Error('Failed to fetch profile data');
            }
            const data = await response.json();
            
            // noguri 회원인지 확인
            if (data.user === 'noguri') {
                setUserInfo(data);
                setProfile(data.profile);
            } else {
                console.error('User not found or not noguri');
            }
        } catch (error) {
            console.error("Error loading profile data:", error);
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    const handleImageClick = (imagePath: string) => {
        setSelectedImagePath(imagePath);
        setShowViewer(true);
    };

    const handleContextMenu = (e: React.MouseEvent, imagePath: string) => {
        e.preventDefault();
        setSelectedImagePath(imagePath);
        setTooltipPosition({ x: e.clientX, y: e.clientY });
        setShowTooltip(true);
    };

    const handleEdit = () => {
        setShowEdit(true);
        setShowTooltip(false);
    };

    const handleProfileUpdate = () => {
        // 프로필 데이터를 다시 로드
        getProfile();
    };

    return (
        <div className="flex flex-col px-4 " style={{ width: '100%', height: 'auto'}}>      
          <div className="flex justify-center items-center" style={{ width: '100%', height: 'auto'}}>
            <ProfileRender 
                userInfo={userInfo}
                profile={profile}
                onImageClick={handleImageClick}
                onContextMenu={handleContextMenu}
            />
            
            {showViewer && (
                <ProfileShow 
                    imagePath={selectedImagePath} 
                    onClose={() => setShowViewer(false)} 
                />
            )}
            
            {showTooltip && (
                <ProfileTool 
                    position={tooltipPosition}
                    onClose={() => setShowTooltip(false)}
                    onEdit={handleEdit}
                />
            )}
            
            {showEdit && (
                <ProfileUpdate 
                    onClose={() => setShowEdit(false)}
                    onUpdate={handleProfileUpdate}
                />
            )}
          </div>
            {/* user info 보여주기 */}
            <span className="text-left text-xl ml-[3px]"> {userInfo?.user} </span>
            <span className="text-left text-sm ml-[3px]"> {userInfo?.info?.message} </span>

        </div>
    )
}