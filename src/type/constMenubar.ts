export interface MenuItem {
    id: string;
    label: string;
    path: string;
}

export const menuItems = [
    {
        id: 'home',
        label: '홈',
        path: '/'
    },
    {
        id: 'prologue',
        label: '프롤로그',
        path: '/menu/prologue'
    },
    {
        id: 'timeline',
        label: '타임라인',
        path: '/menu/timeline'
    },
    {
        id: 'posts',
        label: '게시글',
        path: '/menu/posts'
    }
];