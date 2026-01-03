import React from 'react';

export const Select = ({ label, options, ...props }) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
            <select
                className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md p-2 border bg-white"
                {...props}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
};
