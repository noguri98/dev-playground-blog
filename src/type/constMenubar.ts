export interface MenuItem {
    id: string;
    label: string;
    path: string;
}

export const menuItems = [
    {
        id: 'prologue',
        label: '프롤로그',
        path: '/prologue'
    },
    {
        id: 'timeline',
        label: '타임라인',
        path: '/timeline'
    },
    {
        id: 'posts',
        label: '게시글',
        path: '/posts'
    }
];