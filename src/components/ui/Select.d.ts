import React from 'react';

export interface SelectOption {
    label: string;
    value: string | number;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: SelectOption[];
}

export const Select: React.FC<SelectProps>;
