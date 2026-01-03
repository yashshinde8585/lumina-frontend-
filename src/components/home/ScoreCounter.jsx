import React from 'react';

const ScoreCounter = () => {
    const [matchScore, setMatchScore] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setMatchScore(prev => {
                if (prev >= 95) {
                    clearInterval(interval);
                    return 95;
                }
                return prev + 1;
            });
        }, 30);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center justify-center py-4 lg:py-6 relative">
            <svg className="w-20 h-20 lg:w-24 lg:h-24 transform -rotate-90">
                <circle cx="50%" cy="50%" r="36" stroke="#f3f4f6" strokeWidth="8" fill="transparent" />
                <circle cx="50%" cy="50%" r="36" stroke="#16a34a" strokeWidth="8" fill="transparent" strokeDasharray="226" strokeDashoffset={226 - (226 * matchScore) / 100} className="transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-xl lg:text-2xl font-bold text-gray-900">{matchScore}</span>
                <span className="text-[8px] lg:text-[10px] text-gray-400">SCORE</span>
            </div>
        </div>
    );
};

export default ScoreCounter;
