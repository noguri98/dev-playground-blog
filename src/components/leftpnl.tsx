"use client";

import Profile from "@/components/leftpnl_profile";
import Monthly from "@/components/leftpnl_monthly";
import FileList from "@/components/leftpnl_filelist";

interface LeftPnlProps {
    jsonData: any;
}

export default function LeftPnl({ jsonData }: LeftPnlProps) {
    
    return (
        <div className='flex items-center flex-col gap-[20px]' style={{ width: '220px', height: '100%'}}>
            <Profile jsonData={jsonData} />
            <Monthly />
            <FileList />
        </div>
    )
}