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

                // Legacy colors (kept for compatibility)
                primary: '#2563EB',
                secondary: '#475569',
                paper: '#FFFFFF',
                canvas: '#F3F4F6',
            },
            fontFamily: {
                sans: ['Inter', 'Roboto', 'sans-serif'],
                serif: ['Merriweather', 'Garamond', 'serif'],
            },
        },
    },
    plugins: [],
}
