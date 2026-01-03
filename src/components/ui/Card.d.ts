import React from 'react';

export interface CardProps {
    children: React.ReactNode;
    className?: string;
    metadata?: React.ReactNode;
}

export const Card: React.FC<CardProps>;
