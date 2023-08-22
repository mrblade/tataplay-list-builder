const config = {
  content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],

  plugins: [require('flowbite/plugin')],

  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        primary: {
          '50': '#fff0fb',
          '100': '#ffe4f9',
          '200': '#ffc9f5',
          '300': '#ff9cec',
          '400': '#ff5fdc',
          '500': '#ff30c8',
          '600': '#f50da9',
          '700': '#e10091',
          '800': '#b00470',
          '900': '#92095f',
          '950': '#5b0037',
        }
      }
    }
  }
};

module.exports = config;