/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "enc-", // <-- adds the enc- prefix to all classes
  content: [
    "./pages/**/*.html",
    "./pages/**/*.js",
    "./*.html",       // <-- include root HTML files
    "./*.js",         // <-- include root JS files
    "./css/**/*.js",  // <-- optional: include JS inside root css folder if needed
  ],
  theme: {
    extend: {
      fontFamily: {
        myriad_pro: ['MyriadPro', 'sans-serif'],
        helvetica_neue: ['HelveticaNeue', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        worksans: ['Work Sans', 'sans-serif'],
      },
    },
  },
  corePlugins: {
    preflight: false, // optional: disables Tailwind's base styles if you want
  },
  plugins: [],
}