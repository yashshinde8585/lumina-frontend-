import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, className = '', ...props }) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
            <textarea
                className={`border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md p-2 border resize-y ${className}`}
                {...props}
            />
        </div>
    );
};
