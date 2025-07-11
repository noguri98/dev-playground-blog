export default function HomePage() {
  return (
    // 전체 화면의 크기를 고정
    <main className='flex flex-col items-center px-4 py-1 gap-[100px]' style={{ width: '100vw', height: 'auto' }}>
      {/* 상단 메뉴바 */}
      <div className='flex justify-between items-center' style={{ width: '80vw', height: '30px'}}>
        {/* 임시 공백 : border-2 border-gray-300 추가하여 확인*/}
        <div className='flex' style={{ width: '20vw', height: '100%'}}></div>
        {/* 메뉴 버튼영역 : 함수로 정의하여 render*/}
        <div className='flex flex-row' style={{ width: 'auto', height: '100%'}}>
          <button className='flex justify-center items-center px-2 py-1 ' style={{ width: '100%', height: '100%'}}>
            <span className='text-gray-400'>내 정보</span>
          </button>
          <div className='flex justify-center items-center' style={{ width: '1px', height: '100%'}}>
            <span className='text-center text-gray-300'>|</span>
          </div>
        </div>
        

        
      </div>

      {/* 하단 화면 */}
      <div className='flex border-t-2 border-b-2 border-gray-300 py-2 gap-[10px]' style={{ width: '80vw', minHeight: '800px', height: 'auto'}}>
        {/* left */}
        <div className='flex border-1 border-gray-300 rounded-[20px]' style={{ width: '20%', minHeight: '500px', height: '100%'}}>

        </div>
        
        {/* 본문 컨테이너*/}
        <div className='flex flex-col justify-end' style={{ width: '80%', height: '100%'}}>
          
        </div>
      </div>
    </main>
  )
}