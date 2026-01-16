/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Platinum Mist Theme
                mist: '#F5F6F7',      // Main background
                silver: '#C1C4C8',    // Borders/dividers
                steel: '#7B7F85',     // Secondary text/icons
                charcoal: '#2B2E33',  // Primary text/headings
                brand: '#3B82F6',     // Primary brand color (blue)
                'resume-accent': 'var(--resume-accent)', // Dynamic Accent

                // Legacy colors (kept for compatibility)
                primary: '#2563EB',
                secondary: '#475569',
                paper: '#FFFFFF',
                canvas: '#F3F4F6',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [
        function ({ addUtilities, addComponents, addVariant, addBase, theme }) {
            // 1. CSS Variable for Accent Color
            addBase({
                ':root': {
                    '--resume-accent': theme('colors.brand'),
                },
            });

            // 2. Custom Variants for State Handling
            addVariant('layout-compact', '.layout-compact &');
            addVariant('layout-detailed', '.layout-detailed &');
            addVariant('ats-clean', '.ats-clean &');

            // Font variants (if needed mostly handled by parent class, but good for specific overrides)
            addVariant('serif-mode', '.font-serif-resume &');
            addVariant('sans-mode', '.font-sans-resume &');

            // 3. Semantic Resume Utilities
            addComponents({
                '.resume-preview': {
                    '@apply bg-white text-black transition-all duration-300': {},
                },
                '.resume-header': {
                    '@apply border-b-2 border-resume-accent': {},
                },
                '.resume-section': {
                    '@apply mb-6 layout-compact:mb-3': {},
                },
                '.resume-heading': {
                    '@apply font-bold uppercase tracking-wide mb-3 text-resume-accent border-b border-gray-200 flex justify-between items-center': {},
                    '@apply layout-compact:mb-1 layout-compact:pb-1 layout-compact:text-base text-xl': {},
                    '@apply ats-clean:border-none ats-clean:text-black ats-clean:mb-2': {},
                },
                // Quill Editor Overrides (formerly in <style>)
                '.ql-container.ql-snow': {
                    border: 'none !important',
                    fontFamily: 'inherit !important',
                    fontSize: 'inherit !important',
                },
                '.ql-editor': {
                    padding: '0 !important',
                    minHeight: 'fit-content !important',
                },
                '.ql-toolbar.ql-snow': {
                    border: 'none !important',
                    borderBottom: '1px solid #eee !important', // Using hex here as it's specific override
                    padding: '4px 0 !important',
                },
            });
        }
    ],
}
