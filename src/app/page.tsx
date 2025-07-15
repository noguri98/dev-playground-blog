import Profile from "@/components/com/leftpnl_profile";
import DateTime from "@/components/com/leftpnl_datetime";
import Monthly from "@/components/com/leftpnl_monthly";
import LeftPnl from "@/components/modules/leftpnl";

export default function HomePage() {
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
            <span className='text-gray-400' style={{ whiteSpace: 'nowrap'}}>time-line</span>
          </button>
          <div className='flex justify-center items-center' style={{ width: '1px', height: '100%'}}>
            <span className='text-center text-gray-300'>|</span>
          </div>
        </div>
        

        
      </div>

      {/* display*/}
      <div className='flex border-t-2 border-b-2 border-gray-300 py-4 gap-[10px]' style={{ width: '80vw', minHeight: '800px', height: 'auto'}}>
        {/* left_pnl*/}
        <LeftPnl />

        
        {/* body_pnl */}
        <div className='flex flex-col justify-end' style={{ width: '', height: '100%'}}>
          
        </div>
      </div>
    </main>
  )
}