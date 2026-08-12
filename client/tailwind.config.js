/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // M1LLION brand bible, Working Edition 02 — muted earth + butter light.
        bone: '#F5F2EC',
        paper: '#EFEAE2',
        charcoal: '#1F1F1D',
        graphite: '#353432',
        olive: '#6C6A45',
        sage: '#AEB1A2',
        sand: '#DDD3C6',
        bronze: '#8B5E3C',
        clay: '#CFA89A',
        butter: '#E7D48B',
        stone: '#77726B',
        darkolive: '#454733',
        forest: '#394337',
        gold: {
          300: '#f6d365',
          400: '#f5c542',
          500: '#d6a722',
        },
      },
      fontFamily: {
        // Pinned by the brand bible's Canva font system.
        display: ['Anton', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
