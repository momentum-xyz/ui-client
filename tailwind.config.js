// const production = process.env.NODE_ENV !== 'development'
const plugin = require('tailwindcss/plugin');

const gradient = {
  'dark-blue-black-100': 'linear-gradient(315deg, #0C1019 0%, #202A44 100%)',
  'dark-blue-black-70':
      'linear-gradient(315deg, rgba(12, 16, 25, 0.7) 0%, rgba(32, 42, 68, 0.7) 100%)',
  'dark-blue-black-50':
      'linear-gradient(315deg, rgba(12, 16, 25, 0.5) 0%, rgba(32, 42, 68, 0.5) 100%)',
  'blue-green-100': 'linear-gradient(135deg, #05F2F2 0%, #07DB9F 100%)',
  'blue-green-20': 'linear-gradient(135deg, rgba(5, 242, 242, 0.2) 0%, rgba(7, 219, 159, 0.2) 100%)',
  'blue-red-100': 'linear-gradient(135deg, #05F2F2 0%, #F25D05 100%)',
  'red-sunset-10': 'linear-gradient(90deg, rgba(242, 93, 5, .2) 0%, rgba(242, 93, 5, 0) 100%)',
  input:
      'linear-gradient(180deg, rgba(12, 16, 25, 0.5) 0%, rgba(12, 16, 25, 0.4) 100%)',
};

module.exports = {
  mode: 'jit',
  purge: {
    content: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
    options: {
      safelist: [
        'grid-cols-1',
        'grid-cols-2',
        'grid-cols-3',
        'grid-cols-4',
        'grid-cols-5',
      ],
      whitelistPatterns: [/^grid-cols-/, /^text-/],
    },
  },
  theme: {
    scale: {
      '0': '0',
      '25': '.25',
      '30': '.3',
      '40': '.4',
      '45': '.45',
      '50': '.5',
      '75': '.75',
      '90': '.9',
      '95': '.95',
      '100': '1',
      '105': '1.05',
      '110': '1.1',
      '125': '1.25',
      '150': '1.5',
      '200': '2',
    },
    spacing: {
      '-1': '-.625rem', // -10px
      0: '0',
      '.01': '.0149rem', // 2.39
      '.1': '.0625rem', // 1px
      '.3': '.11rem',
      '.2': '.125rem', // 2
      '.22': '.14rem', 
      '.25' : '.142rem',
      '.39': '.149rem', //2.39
      '.4': '.188rem', // 3px
      '.5': '.3125rem', // 5px
      '.6': '.391rem', // 6.25px
      '.7': '.438rem', // 7px
      '.8': '.5rem', // 8px
      '.9': '.563rem', //9px
      1: '.625rem', // 10px
      1.2 : '0.688rem', //11px
      1.25: '.75rem', // 12px
      1.3: '.813rem', // 13px
      1.4: '.8755rem', // 14px
      1.5: '.9375rem', // 15px
      1.6: `1.0rem`, // 16px
      2: '1.25rem', // 20px
      2.5: '1.5rem', // 24px
      2.6: '1.563rem', // 25px
      2.8: '1.75rem', // 28px
      3: '1.875rem', // 30px
      3.2: '2rem',  //32 px
      3.8: '2.375rem', //38px
      4: '2.5rem', // 40px
      4.3 : '2.6rem', // 43px
      4.5: '3rem', // 45px
      5: '3.4rem', //adjusting
      5.7: '3.563rem', // 57px
      6: '3.75rem', // 60px
      7: '4.375rem', // 70px
      8: '5rem', // 70px
      9: '5.625em', // 70px
      10: '6.25rem', // 100px
      10.1:'7.37rem',
      10.2: '7.7rem',
      10.5: '7.813rem', //125px
      11: '8.75rem',
      14: '9.063rem', // 145
      15: '9.375rem',
      15.5: '10.938rem', //175px
      16: '11rem',
      17: '11.25rem', // 180px
      19: '11.875rem', // 190px
      20: '12.5rem', //200
      21: '13.124rem', //210
      23: '13.75rem', //220px
      24.2: '15.125rem', // 242px
      25: '17rem',
      30: '18.75rem',
      32: '20rem',
      36: '22.5rem',
      40: '25rem',
      46: '28.063rem',
      48: '30rem',
      50: '38.75rem',
      64: '40rem',
      80: '52rem',
      96: '60rem',
      '560px': '560px'
    },
    borderRadius: {
      sm: '.125rem',
      DEFAULT: '.625rem',
      lg: '1.25rem',
      full: '50%',
    },
    colors: {
      transparant: 'transparent',
      'prime-blue': {
        100: 'rgba(5, 242, 242, 1)',
        90: 'rgba(5, 242, 242, .9)',
        80: 'rgba(5, 242, 242, .8)',
        70: 'rgba(5, 242, 242, .7)',
        60: 'rgba(5, 242, 242, .6)',
        50: 'rgba(5, 242, 242, .5)',
        40: 'rgba(5, 242, 242, .4)',
        30: 'rgba(5, 242, 242, .3)',
        20: 'rgba(5, 242, 242, .2)',
        10: 'rgba(5, 242, 242, .1)',
      },
      'dark-blue': {
        110: 'rgba(32, 42, 68, 1)',
        100: 'rgba(32, 42, 68, 1)',
        90: 'rgba(32, 42, 68, .9)',
        80: 'rgba(32, 42, 68, .8)',
        70: 'rgba(32, 42, 68, .7)',
        60: 'rgba(32, 42, 68, .6)',
        50: 'rgba(32, 42, 68, .5)',
        40: 'rgba(32, 42, 68, .4)',
        30: 'rgba(32, 42, 68, .3)',
        20: 'rgba(32, 42, 68, .2)',
        10: 'rgba(32, 42, 68, .1)',
      },
      'new-blue': {
        100: `rgba(5, 23, 69, 1)`,
        90: `rgba(5, 23, 69, .9)`,
        80: `rgba(5, 23, 69, .8)`,
        70: `rgba(5, 23, 69, .7)`,
        60: `rgba(5, 23, 69, .6)`,
        50: `rgba(5, 23, 69, .5)`,
        40: `rgba(5, 23, 69, .4)`,
        30: `rgba(5, 23, 69, .3)`,
        20: `rgba(5, 23, 69, .2)`,
        10: `rgba(5, 23, 69, .1)`
      },
      'red-sunset': {
        100: 'rgba(242, 93, 5, 1)',
        90: 'rgba(242, 93, 5, .9)',
        80: 'rgba(242, 93, 5, .8)',
        70: 'rgba(242, 93, 5, .7)',
        60: 'rgba(242, 93, 5, .6)',
        50: 'rgba(242, 93, 5, .5)',
        40: 'rgba(242, 93, 5, .4)',
        30: 'rgba(242, 93, 5, .3)',
        20: 'rgba(242, 93, 5, .2)',
        10: 'rgba(242, 93, 5, .1)',
      },
      'green-light': {
        100: 'rgba(7, 219, 159, 1)',
        90: 'rgba(7, 219, 159, .9)',
        80: 'rgba(7, 219, 159, .8)',
        70: 'rgba(7, 219, 159, .7)',
        60: 'rgba(7, 219, 159, .6)',
        50: 'rgba(7, 219, 159, .5)',
        40: 'rgba(7, 219, 159, .4)',
        30: 'rgba(7, 219, 159, .3)',
        20: 'rgba(7, 219, 159, .2)',
        10: 'rgba(7, 219, 159, .1)',
      },
      black: {
        100: 'rgba(12, 16, 25, 1)',
        90: 'rgba(12, 16, 25, .9)',
        80: 'rgba(12, 16, 25, .8)',
        70: 'rgba(12, 16, 25, .7)',
        60: 'rgba(12, 16, 25, .6)',
        50: 'rgba(12, 16, 25, .5)',
        40: 'rgba(12, 16, 25, .4)',
        30: 'rgba(12, 16, 25, .3)',
        20: 'rgba(12, 16, 25, .2)',
        10: 'rgba(12, 16, 25, .1)',
      },
      white: {
        100: 'rgba(255, 242, 241, 1)',
        90: 'rgba(255, 242, 241, .9)',
        80: 'rgba(255, 242, 241, .8)',
        70: 'rgba(255, 242, 241, .7)',
        60: 'rgba(255, 242, 241, .6)',
        50: 'rgba(255, 242, 241, .5)',
        40: 'rgba(255, 242, 241, .4)',
        30: 'rgba(255, 242, 241, .3)',
        20: 'rgba(255, 242, 241, .2)',
        10: 'rgba(255, 242, 241, .1)',
        5: 'rgba(255, 242, 241, .05)',
      },
      'new-blue': {
        100: 'rgba(5, 23, 69, 1)',
        90: 'rgba(5, 23, 69, .9)',
        80: 'rgba(5, 23, 69, .8)',
        70: 'rgba(5, 23, 69, .7)',
        60: 'rgba(5, 23, 69, .6)',
        50: 'rgba(5, 23, 69, .5)',
        40: 'rgba(5, 23, 69, .4)',
        30: 'rgba(5, 23, 69, .3)',
        20: 'rgba(5, 23, 69, .2)',
        10: 'rgba(5, 23, 69, .1)',
      },
    },
    zIndex: {
      base: 0, // main/unity bottom swap layer
      unity: 10, // unity top swap layer
      'unity-interface': 20, // unity ingame overlay layer
      main: 30, // main/ top swap layer
      overlay: 40, // footer/overlay layer
      'pop-over': 50, // popup/modal/livestream layer
      'autocomplete-list': "90 !important"
    },
    fontSize: {
      xxxs: '.484rem',      //8
      xxs: '.563rem',     //9
      xs: '0.625rem',   // 10
      sm: '.75rem',     // 12
      md: '.83rem',     // 13
      base: '.875rem',  // 14
      lg: '1rem',       // 16
      xl: '1.125rem',   // 18
    },
    fontFamily: {
      sans: ['IBM Plex Sans', 'sans-serif'],
    },
    extend: {
      transitionDuration: {
        0: '0ms',
        debug: '10000ms',
      },
      borderWidth: {
        0: '.8px',
        1: '1px',
        2: `2px`,
        3: `3px`
      },
      width: {
        "360px": "360px"
      },
      height:{
        "fit-content": "fit-content",
        "max": "max-content",
        "min": "min-content",
      },
      boxShadow: {
        white: '0px 0px 5px 1px rgba(255, 255, 255, 0.5)',
        black: '0px 0px 5px 1px rgba(0, 0, 0, 0.5)',
      },
      dropShadow: {
        white: '0 0 5px rgba(255, 255, 255, 1)',
      },
      transitionProperty: {
        height: 'height',
        width: 'width',
        spacing: 'margin, padding',
      },
    },
  },
  variants: {
    height: ['responsive', 'hover', 'focus'],
  },
  plugins: [
    plugin(function ({ addUtilities, e }) {
      let gradients = new Map(Object.entries(gradient));
      let utilities = {};
      gradients.forEach((value, key, map) => {
        utilities[`.bg-gradient-${e(key)}`] = {
          background: value,
        };
      });
      addUtilities(utilities);
    }),
    require('@tailwindcss/forms'),
  ],
};
