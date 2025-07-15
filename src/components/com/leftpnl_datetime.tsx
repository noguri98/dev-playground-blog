"use client";

interface DateTimeInfo {
    date: string;
    time: string;
    full: string;
    timezone: string;
    location: string;
}

interface Info {
    nation: string;
    city: string;
}

export default function DateTime({ dateTimeInfo, info }: { dateTimeInfo: DateTimeInfo; info: Info }) {
    return (
        <div className='flex flex-col border-1 border-gray-300 rounded-[20px] p-3 gap-2' style={{ width: '100%', height: '150px'}}>            
            <div className='flex flex-col justify-start items-start'>
                <span className='text-sm font-medium text-gray-800'>
                    {dateTimeInfo.date} ({dateTimeInfo.timezone})
                </span>
                <span className='text-l font-bold text-gray-800'>
                    {dateTimeInfo.time}
                </span>
                <span className='text-xs text-gray-600'>
                    {dateTimeInfo.location}
                </span>
            </div>
        </div>
    );
}