import React from 'react';
import DOMPurify from 'dompurify';

interface SafeHTMLProps extends React.HTMLAttributes<HTMLDivElement> {
    html: string;
    as?: 'div' | 'span' | 'p' | 'article';
}

/**
 * Safely renders HTML content using DOMPurify.
 * Prevents XSS attacks by sanitizing the input.
 */
export const SafeHTML: React.FC<SafeHTMLProps> = ({ html, as = 'div', className, ...props }) => {
    const Component = as as any;
    const sanitizedHTML = DOMPurify.sanitize(html);

    return (
        <Component
            className={className}
            dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
            {...props}
        />
    );
};
