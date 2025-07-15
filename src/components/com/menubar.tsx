export default function MenuBar() {
    return (
        <div className='flex flex-1 items-center py-2' style={{ width: '100%', height: '100%'}}>
          <button className='flex justify-center items-center px-2 py-1 '>
            <span className='text-sm text-gray-400' style={{ whiteSpace: 'nowrap'}}>프롤로그</span>
          </button>
          <div className='flex justify-center items-center'>
            <span className='text-center text-gray-300'>|</span>
          </div>
          <button className='flex justify-center items-center px-2 py-1 '>
            <span className='text-sm text-gray-400' style={{ whiteSpace: 'nowrap'}}>타임라인</span>
          </button>
          <div className='flex justify-center items-center'>
            <span className='text-center text-gray-300'>|</span>
          </div>
        </div>
    )
}