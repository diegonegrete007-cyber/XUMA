'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import lessonsData from '../../../data/lessons.json';
import { getInitialState, saveState } from '../../../lib/store';

export default function LessonPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const lesson = lessonsData.find((l) => l.id === params.id);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [isFinished, setIsFinished] = useState(false);

    if (!lesson) return <div>Lección no encontrada</div>;

    const currentQuestion = lesson.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / lesson.questions.length) * 100;

    const handleCheck = () => {
        if (!selectedOption) return;

        const correct = selectedOption === currentQuestion.answer;
        setIsCorrect(correct);
    };

    const handleNext = () => {
        if (currentQuestionIndex < lesson.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsCorrect(null);
        } else {
            setIsFinished(true);
            completeLesson();
        }
    };

    const completeLesson = () => {
        const user = getInitialState();
        if (!user.completedLessons.includes(lesson.id)) {
            user.completedLessons.push(lesson.id);
            user.points += lesson.points;
            user.streak += 1;
            saveState(user);
        }
    };

    if (isFinished) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-indigo-500 text-white p-6 text-center animate-in">
                <h1 className="text-4xl font-black mb-4">¡Lección Completada!</h1>
                <p className="text-xl mb-8">Ganaste +{lesson.points} gemas 💎</p>
                <button
                    onClick={() => router.push('/')}
                    className="w-full max-w-xs bg-white text-indigo-600 font-bold py-4 rounded-xl shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all"
                >
                    CONTINUAR
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col p-6 max-w-md mx-auto">
            {/* Header / Progress */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => router.back()} className="text-slate-400 hover:text-slate-600">✕</button>
                <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-emerald-500 transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Question */}
            <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-slate-700 mb-8 text-center">
                    {currentQuestion.question}
                </h2>

                <div className="grid gap-4">
                    {currentQuestion.options.map((option) => (
                        <button
                            key={option}
                            onClick={() => !isCorrect && setSelectedOption(option)}
                            disabled={isCorrect === true}
                            className={`
                p-4 rounded-xl border-2 text-lg font-bold transition-all
                ${selectedOption === option
                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'}
                ${isCorrect !== null && option === currentQuestion.answer ? 'bg-emerald-100 border-emerald-500 text-emerald-700' : ''}
                ${isCorrect === false && selectedOption === option ? 'bg-red-100 border-red-500 text-red-700' : ''}
              `}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {/* Footer Action */}
            <div className={`fixed bottom-0 left-0 w-full border-t p-4 ${isCorrect === null ? 'bg-white' : isCorrect ? 'bg-emerald-100 border-emerald-200' : 'bg-red-100 border-red-200'}`}>
                <div className="max-w-md mx-auto flex justify-between items-center">
                    {isCorrect === true && <div className="text-emerald-700 font-bold text-xl">¡Correcto! 🎉</div>}
                    {isCorrect === false && <div className="text-red-700 font-bold text-xl">Incorrecto 😔</div>}

                    {!isCorrect && selectedOption && (
                        <button
                            onClick={handleCheck}
                            className="ml-auto bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl shadow-[0_4px_0_0_#059669] active:translate-y-1 active:shadow-none"
                        >
                            COMPROBAR
                        </button>
                    )}

                    {isCorrect !== null && (
                        <button
                            onClick={isCorrect ? handleNext : () => { setIsCorrect(null); setSelectedOption(null); }}
                            className={`ml-auto font-bold py-3 px-8 rounded-xl shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}
                        >
                            {isCorrect ? 'CONTINUAR' : 'REINTENTAR'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
