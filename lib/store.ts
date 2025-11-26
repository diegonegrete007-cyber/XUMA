export interface UserState {
    points: number;
    streak: number;
    completedLessons: string[];
    lastLoginDate: string;
}

const STORAGE_KEY = 'xuma_user_data';

export const getInitialState = (): UserState => {
    if (typeof window === 'undefined') return { points: 0, streak: 0, completedLessons: [], lastLoginDate: '' };

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    return { points: 0, streak: 0, completedLessons: [], lastLoginDate: new Date().toISOString().split('T')[0] };
};

export const saveState = (state: UserState) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
};
