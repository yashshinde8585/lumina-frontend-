import { describe, it, expect } from 'vitest';
import { validators, validateForm } from './validation';

describe('Validation Utils', () => {
    describe('validators.email', () => {
        it('returns error for empty email', () => {
            expect(validators.email('')).toBe('Email is required');
        });

        it('returns error for invalid email', () => {
            expect(validators.email('invalid-email')).toBe('Please enter a valid email address');
        });

        it('returns null for valid email', () => {
            expect(validators.email('test@example.com')).toBe(null);
        });
    });

    describe('validators.password', () => {
        it('Validates length', () => {
            expect(validators.password('Ab1')).toBe('Password must be at least 8 characters');
        });

        it('Validates uppercase', () => {
            expect(validators.password('abcdefg1')).toBe('Password must contain at least one uppercase letter');
        });

        it('Validates lowercase', () => {
            expect(validators.password('ABCDEFG1')).toBe('Password must contain at least one lowercase letter');
        });

        it('Validates number', () => {
            expect(validators.password('Abcdefgh')).toBe('Password must contain at least one number');
        });

        it('Returns null for valid password', () => {
            expect(validators.password('Abcdefg1')).toBe(null);
        });
    });

    describe('validateForm', () => {
        it('validates a full object correctly', () => {
            const data = {
                email: 'test@example.com',
                password: 'weak'
            };
            const schema = {
                email: validators.email,
                password: validators.password
            };

            const result = validateForm(data, schema);
            expect(result.isValid).toBe(false);
            expect(result.errors.password).toBeDefined();
            expect(result.errors.email).toBeUndefined();
        });
    });
});
