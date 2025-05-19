/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",      // كل الملفات داخل مجلد pages بأي امتداد js أو ts أو jsx أو tsx
    "./components/**/*.{js,ts,jsx,tsx}"  // كل الملفات داخل مجلد components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

