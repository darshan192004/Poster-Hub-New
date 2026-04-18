/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#F8F9FA", // Light color
        secondary: "#FFEBEB", // Light pink color
        accent: "#FFE4E1", // Peach-like color
        lightBlue: "#E0F7FA", // Light blue color
        lightGreen: "#E8F5E9", // Light green color
        "black-100": "#100d25", 
        "white-100": "#f3f3f3",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #ffffff, #ffebeb, #e0f7fa, #e8f5e9)",
      },
    },
  },
  plugins: [],
};
