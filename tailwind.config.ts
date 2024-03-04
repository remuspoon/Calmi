import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      gridTemplateColumns: {
        'fill-40': 'repeat(auto-fill, 20rem)'
      }
    }
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#002E65',

          secondary: '#FFFFEB',

          accent: '#EDD6BF',

          neutral: '#4E3C32',

          'base-100': '#AAB9CC',

          info: '#D5DCE5',

          success: '#00ffff',

          warning: '#ffffff',

          error: '#ffffff'
        }
      }
    ]
  }
}
export default config
