'use client';

import { getMenuItems } from "@/utils/funMenubar";
import { useRoutePage } from "@/hooks/useMenubar";

export default function MenuBar() {
    const menuItems = getMenuItems();

    return (
        <div className='flex flex-1 items-center py-2' style={{ width: '100%', height: '100%'}}>
            {menuItems.map((item, index) => (
                <div key={item.id} className='flex items-center'>
                    <button 
                        className='flex justify-center items-center px-2 py-1 rounded transition-colors'>
                        <span 
                            className={'text-sm text-gray-400 hover:text-gray-600'}
                            style={{ whiteSpace: 'nowrap'}}
                        >
                            {item.label}
                        </span>
                    </button>
                    {index < menuItems.length - 1 && (
                        <div className='flex justify-center items-center'>
                            <span className='text-center text-gray-300'>|</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}