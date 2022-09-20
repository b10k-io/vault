const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['IBM Plex Sans', ...defaultTheme.fontFamily.sans],
        'serif': ['IBM Plex Serif', ...defaultTheme.fontFamily.serif],
        'mono': ['IBM Plex Mono', ...defaultTheme.fontFamily.mono],
        // 'display': ['IBM Plex Mono', ...defaultTheme.fontFamily.display],
        // 'body': ['IBM Plex Mono', ...defaultTheme.fontFamily.body],
      }
    },
  },
  plugins: [],
}
