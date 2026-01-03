/**
 * Form validation utilities
 */

export type Validator = (value: any, ...args: any[]) => string | null;

export const validators: Record<string, Validator> = {
    email: (value: string) => {
        if (!value) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return null;
    },

    password: (value: string) => {
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
        return null;
    },

    required: (value: string, fieldName = 'This field') => {
        if (!value || value.trim() === '') return `${fieldName} is required`;
        return null;
    },

    minLength: (value: string, min: number, fieldName = 'This field') => {
        if (value && value.length < min) {
            return `${fieldName} must be at least ${min} characters`;
        }
        return null;
    },

    maxLength: (value: string, max: number, fieldName = 'This field') => {
        if (value && value.length > max) {
            return `${fieldName} must be no more than ${max} characters`;
        }
        return null;
    }
};

/**
 * Validate form data against a schema
 * @param {Object} data - Form data to validate
 * @param {Object} schema - Validation schema { fieldName: validator }
 * @returns {Object} - { isValid: boolean, errors: { fieldName: errorMessage } }
 */
export const validateForm = (data: Record<string, any>, schema: Record<string, (value: any) => string | null>) => {
    const errors: Record<string, string> = {};

    Object.keys(schema).forEach(field => {
        const validator = schema[field];
        const error = validator(data[field]);
        if (error) {
            errors[field] = error;
        }
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
