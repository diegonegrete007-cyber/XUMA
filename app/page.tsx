'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import lessonsData from '../data/lessons.json';
import { getInitialState, UserState } from '../lib/store';

export default function Home() {
    const [user, setUser] = useState<UserState | null>(null);

    useEffect(() => {
        const loaded = getInitialState();
        setUser(loaded);
    }, []);

    if (!user) return <div className="p-10 text-center">Cargando XUMA...</div>;

    return (
        <main className="flex-1 bg-slate-50 relative">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 flex justify-between items-center">
                <h1 className="text-2xl font-black text-indigo-600 tracking-tight">XUMA</h1>
                <div className="flex gap-3 text-sm font-bold">
                    <div className="flex items-center gap-1 text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                        🔥 {user.streak}
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-3 py-1 rounded-full">
                        💎 {user.points}
                    </div>
                </div>
            </header>

            {/* Path / Lessons */}
            <div className="p-6 space-y-6 pb-20">
                {lessonsData.map((lesson, index) => {
                    const isCompleted = user.completedLessons.includes(lesson.id);
                    // Unlock if it's the first lesson OR the previous one is completed
                    const isUnlocked = index === 0 || user.completedLessons.includes(lessonsData[index - 1].id);

                    return (
                        <div key={lesson.id} className={`relative flex flex-col items-center ${index % 2 === 0 ? '-translate-x-4' : 'translate-x-4'}`}>
                            <Link
                                href={isUnlocked ? `/lesson/${lesson.id}` : '#'}
                                className={`
                  w-20 h-20 rounded-full flex items-center justify-center text-2xl shadow-[0_6px_0_0] transition-all active:translate-y-1 active:shadow-none
                  ${isCompleted
                                        ? 'bg-emerald-500 shadow-emerald-700 text-white'
                                        : isUnlocked
                                            ? 'bg-indigo-500 shadow-indigo-700 text-white animate-pulse'
                                            : 'bg-slate-200 shadow-slate-300 text-slate-400 cursor-not-allowed'}
                `}
                            >
                                {isCompleted ? '✓' : index + 1}
                            </Link>
                            <span className="mt-2 text-xs font-bold text-slate-500 uppercase tracking-wide">{lesson.title}</span>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Nav (Decorative for MVP) */}
            <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-slate-200 p-4 flex justify-around text-slate-400">
                <span className="text-indigo-600 font-bold">🏠 Inicio</span>
                <span>🏆 Ranking</span>
                <span>👤 Perfil</span>
            </div>
        </main>
    );
}
