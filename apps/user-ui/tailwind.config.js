/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./{src,pages,components,app}/**/*.{ts,tsx,js,jsx,html}",
    "./src/**/*.{ts,tsx,js,jsx,html}",
    "!./{src,pages,components,app}/**/*.{stories,spec}.{ts,tsx,js,jsx,html}",
    //     ...createGlobPatternsForDependencies(__dirname)
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          main: "#3489FF",
        },
        black: {
          border: "#010f1c1a",
          main: "#000000",
        },
        border: {
          light: "#99999938",
        },
        primary: {
          light: "#f5f5f5",
        },
        gray: {
          light: "#f1f1f1",
        },
      },

      fontFamily: {
        Roboto: ["var(--font-roboto)", "sans-serif"],
        Poppins: ["var(--font-poppins)", "sans-serif"],
        Oregano: ["var(--font-oregano)", "cursive"],
      },
    },
  },
  plugins: [],
};
