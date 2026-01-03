import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    success?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    success,
    id,
    className = '',
    required = false,
    ...props
}) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s/g, '-')}`;

    return (
        <div className="space-y-1">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                <input
                    id={inputId}
                    aria-required={required}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    className={`
                        w-full px-4 py-2.5 rounded-lg border transition-all
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-transparent
                        disabled:bg-gray-100 disabled:cursor-not-allowed
                        ${error
                            ? 'border-red-300 bg-red-50 focus:ring-red-500'
                            : success
                                ? 'border-green-500 bg-green-50 focus:ring-green-500'
                                : 'border-gray-300 bg-white hover:border-gray-400 focus:ring-blue-500'
                        }
                        ${className}
                    `}
                    required={required}
                    {...props}
                />
                {success && !error && (
                    <div className="absolute right-3 top-2.5 text-green-500 pointer-events-none">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                )}
            </div>
            {error && (
                <p
                    id={`${inputId}-error`}
                    className="text-sm text-red-600 flex items-center gap-1"
                    role="alert"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
};
