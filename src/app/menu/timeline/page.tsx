import { getJsonData } from "@/utils/funHomepage";

import DateTime from "@/components/datetime";
import MenuBar from "@/components/menubar";

import LeftPnl from "@/components/leftpnl";

export default function MenuTimeline() {
    const jsonData = getJsonData();
    
    return (
        <main className='flex flex-col items-center px-4 py-1 gap-[100px]' style={{ width: '100vw', height: 'auto' }}>
          {/* top_menu_bar: 추후 component로 분리 예정*/}
          <div className='flex justify-between items-center' style={{ width: '80vw', height: '30px'}}>
            {/* 임시 공백 : border-2 border-gray-300 추가하여 확인*/}
            <div className='flex' style={{ width: '20vw', height: '100%'}}></div>
            {/* menu_btn: 추후 component로 분리 예정*/}
            <div className='flex flex-row' style={{ width: 'auto', height: '100%'}}>
              <button className='flex justify-center items-center px-2 py-1 ' style={{ width: '100%', height: '100%'}}>
                <span className='text-gray-400'>info</span>
              </button>
              <div className='flex justify-center items-center' style={{ width: '1px', height: '100%'}}>
                <span className='text-center text-gray-300'>|</span>
              </div>
              <button className='flex justify-center items-center px-2 py-1 ' style={{ width: '100%', height: '100%'}}>
                <span className='text-gray-400' style={{ whiteSpace: 'nowrap'}}>setting</span>
              </button>
              <div className='flex justify-center items-center' style={{ width: '1px', height: '100%'}}>
                <span className='text-center text-gray-300'>|</span>
              </div>
            </div>
            
    
            
          </div>
    
          {/* display*/}
          <div className='flex flex-col pb-4' style={{ width: '80vw'}}>
            <div className='flex justify-between' style={{ width: '100%', height: '30px'}}>
              {/* menu-bar*/}
              <div className='flex flex-row justify-start items-center' style={{ minWidth: '270px', width: 'auto', height: '100%'}}> {/* border는 제거할 것! */}
                <MenuBar />
              </div>
              {/* datetime과 weather : weather은 animation으로 전환되면서 보여지기 */}
              <div className='flex flex-row justify-start items-center' style={{ width: '270px', height: '100%'}}> {/* border는 제거할 것! */}
                <DateTime info={jsonData.info} />
              </div>
            </div>
            <div className='flex border-t-2 border-b-2 border-gray-300 py-4' style={{ width: '100%', minHeight: '830px', height: 'auto'}}>
              {/* left_pnl*/}
              <LeftPnl jsonData={jsonData} />
            </div>
    
    
            
            {/* body_pnl */}
            <div className='flex flex-col justify-end' style={{ width: '', height: '100%'}}>
              
            </div>
          </div>
        </main>
      )
}