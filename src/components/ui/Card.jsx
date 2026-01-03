import React from 'react';

export const Card = ({ children, className = '', metadata }) => {
    return (
        <div className={`bg-white border border-silver shadow-sm rounded-xl p-6 ${className}`}>
            {metadata && (
                <div className="text-steel text-xs mb-3 flex items-center gap-2">
                    {metadata}
                </div>
            )}
            {children}
        </div>
    );
};
