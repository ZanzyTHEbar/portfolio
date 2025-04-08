/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

const generateSizeClass = (upToSize, startAt = 80) => {
  const classes = {}
  for (let i = startAt; i < upToSize / 4; i += 4) {
    classes[i] = `${(i * 4) / 16}rem`
  }

  return classes
}

const labelsClasses = ['indigo', 'gray', 'green', 'blue', 'red', 'purple']
module.exports = {
  darkMode: 'class', // add class='dark' to <html> to enable dark mode - https://tailwindcss.com/docs/dark-mode
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  purge: {
    //Because we made a dynamic class with the label we need to add those classes
    // to the safe list so the purge does not remove that
    safelist: [
      ...labelsClasses.map((lbl) => `bg-${lbl}-500`),
      ...labelsClasses.map((lbl) => `bg-${lbl}-200`),
      ...labelsClasses.map((lbl) => `text-${lbl}-400`),
    ],
  },
  theme: {
    screens: {
      xxs: '300px',
      xs: '475px',
      ...defaultTheme.screens,
    },
    extend: {
      width: generateSizeClass(1024),
      minHeight: generateSizeClass(1024, 0),
      maxHeight: generateSizeClass(1024, 0),
      maxWidth: generateSizeClass(1024, 0),
      minWidth: generateSizeClass(1024, 0),
      borderWidth: {
        1: '1px',
      },
      fontFamily: {
        sans: ['Quicksand', ...defaultTheme.fontFamily.sans],
      },
      gridTemplateColumns: {
        '1/5': '1fr 5fr',
      },
      colors: {
        primary: "#8B5CF6",    // Purple
        secondary: "#64748B",  // Slate
        accent: "#F472B6",     // Pink
        neutral: "#F3F4F6",    // Gray
        "base-100": "#FFFFFF", // White
        info: "#38BDF8",       // Sky
        success: "#4ADE80",    // Green
        warning: "#FBBF24",    // Amber
        error: "#F87171",      // Red
        glass: "rgba(255, 255, 255, 0.25)",
        pastel: {
          blue: "#E1F0FF",
          purple: "#F3E8FF",
          pink: "#FCE7F3",
          green: "#DCFCE7",
          yellow: "#FEF9C3",
          orange: "#FFEDD5",
          gray: "#F3F4F6",
        },
        text: {
          primary: "#4A4A4A",
          secondary: "#7A7A7A",
          light: "#9CA3AF",
        },
        background: {
          primary: "#F5F6F5",
          secondary: "#E8F0F5",
        }
      },
      backdropFilter: {
        'none': 'none',
        'glass': 'blur(10px) saturate(180%)',
        'glass-sm': 'blur(5px) saturate(180%)',
        'glass-lg': 'blur(20px) saturate(180%)',
      },
      backgroundImage: {
        'glassmorphism': 'linear-gradient(to right bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3))',
        'gradient-pastel': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
        'glass-sm': '0 4px 16px 0 rgba(31, 38, 135, 0.07)',
        'glass-lg': '0 16px 48px 0 rgba(31, 38, 135, 0.15)',
      },
      borderColor: {
        'glass': 'rgba(255, 255, 255, 0.18)',
      },
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ]
} 