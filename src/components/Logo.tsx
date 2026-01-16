import React from 'react';

interface LogoProps {
    className?: string;
    size?: number;
    variant?: 'default' | 'white';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 32, variant = 'default' }) => {
    const isWhite = variant === 'white';

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="stemGradient" x1="0" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={isWhite ? "#FFFFFF" : "#2563EB"} />
                    <stop offset="100%" stopColor={isWhite ? "#E2E8F0" : "#1d4ed8"} />
                </linearGradient>
            </defs>

            {/* 1. The Strong Foundation (Stem) */}
            <path
                d="M6 7C6 5.34315 7.34315 4 9 4H10C11.6569 4 13 5.34315 13 7V25C13 26.6569 11.6569 28 10 28H9C7.34315 28 6 26.6569 6 25V7Z"
                fill="url(#stemGradient)"
            />

            {/* 2. The Thought / Plan (Loop) */}
            <path
                d="M13 5H17C20.866 5 24 8.13401 24 12C24 15.866 20.866 19 17 19H13V5Z"
                fill={isWhite ? "#F8FAFC" : "#3B82F6"}
                fillOpacity={isWhite ? "0.3" : "0.2"}
            />
            {/* The "Eye" of the loop - Focus */}
            <circle cx="17" cy="12" r="2.5" fill={isWhite ? "#FFFFFF" : "#3B82F6"} />

            {/* 3. The Growth / Action (Leg) */}
            <rect x="15.5" y="18" width="8" height="3" rx="1.5" transform="rotate(45 15.5 18)" fill={isWhite ? "#CBD5E1" : "#93C5FD"} />
            <rect x="18.5" y="21" width="8" height="3" rx="1.5" transform="rotate(45 18.5 21)" fill={isWhite ? "#E2E8F0" : "#60A5FA"} />
            <rect x="21.5" y="24" width="8" height="3" rx="1.5" transform="rotate(45 21.5 24)" fill={isWhite ? "#FFFFFF" : "#2563EB"} />

            {/* 4. The Result (Sparkle) */}
            <path
                d="M27 6L27.5 7.5L29 8L27.5 8.5L27 10L26.5 8.5L25 8L26.5 7.5L27 6Z"
                fill={isWhite ? "#FCD34D" : "#F59E0B"}
            />

        </svg>
    );
};
