/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './src/**/**/*.{js,jsx,ts,tsx}',
  ],  
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: {
          light: '#FFFFFF',
          dark: '#2c2c2c',
        },
        text: {
          primary: {
            light: '#000000',
            dark: '#FFFFFF',
          },
          secondary: {
            light: '#555555',
            dark: '#CCCCCC',
          },
        },
        headerFooter: {
          light: '#333333',
          dark: '#0D0D0D',
        },
        card: {
          light: '#FAFAFA',
          dark: '#1E1E1E',
        },
        button: {
          primary: '#0070F3',
        },
        border: {
          light: '#CCCCCC',
          dark: '#444444',
        },
      },
    },
    darkMode: 'class', // Use class-based dark mode
  },
  plugins: [require("tailwindcss-animate")],
}