// Platinum Mist Resume Theme Configuration
const ResumeTheme = {
    // Color Palette
    colors: {
        primary: '#2B2E33',    // Charcoal - Primary text/headings
        secondary: '#7B7F85',  // Steel - Secondary text/icons
        border: '#C1C4C8',     // Silver - Borders/dividers
        background: '#FFFFFF', // White - Paper background
        accent: '#3B82F6',     // Brand blue - Links/highlights
    },

    // Typography Styles
    heading: {
        h1: 'text-3xl font-bold text-charcoal mb-2 uppercase text-center tracking-wide', // Name
        h2: 'text-sm font-bold uppercase text-brand border-b-2 border-silver mb-3 mt-4 pb-1 tracking-wider', // Section Headers
        h3: 'text-md font-bold text-charcoal mt-2', // Subsections
        h4: 'text-md font-bold text-charcoal mt-2 mb-0', // Job Titles
    },

    paragraph: 'text-[10.5pt] text-charcoal leading-snug mb-1',

    link: 'text-brand underline cursor-pointer hover:text-blue-700',

    list: {
        ul: 'list-disc ml-5 mb-2 text-[10pt] text-charcoal leading-snug marker:text-steel',
        ol: 'list-decimal ml-5 mb-2 text-[10pt] text-charcoal',
        listitem: 'pl-1 mb-0.5',
    },

    text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
        secondary: 'text-steel', // For metadata/dates
    },

    // Layout
    layoutContainer: 'block',
    layoutItem: 'block',

    // Borders & Dividers
    divider: 'border-silver',
    card: 'bg-white border border-silver shadow-sm',
};

export default ResumeTheme;
