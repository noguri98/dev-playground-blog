"use client";

import { ProfileRender, ProfileShow, ProfileTool, ProfileUpdate, ProfileDelete } from "@/utils/funProfile";
import { useState } from "react";

export default function Profile({ jsonData }: { jsonData: any }) {
    const [showViewer, setShowViewer] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [selectedImagePath, setSelectedImagePath] = useState('');
    const [profile, setProfile] = useState<any>(jsonData.profile);
    const [userInfo, setUserInfo] = useState<any>(jsonData);
    
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

    const handleDelete = () => {
        setShowDelete(true);
        setShowTooltip(false);
    };

    const handleProfileUpdate = () => {
        // 프로필 업데이트 후 페이지 새로고침
        window.location.reload();
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
                    onDelete={handleDelete}
                />
            )}
            
            {showEdit && (
                <ProfileUpdate 
                    onClose={() => setShowEdit(false)}
                    onUpdate={handleProfileUpdate}
                />
            )}
            
            {showDelete && (
                <ProfileDelete 
                    onClose={() => setShowDelete(false)}
                    onUpdate={handleProfileUpdate}
                />
            )}
          </div>
            {/* user info 렌더링*/}
            <span className="text-left text-xl ml-[3px]"> {jsonData?.user} </span>
            <span className="text-left text-sm ml-[3px]"> {jsonData?.message} </span>
        </div>
    )
}