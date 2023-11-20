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
      }
    }
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#A6806A',

          secondary: '#FFFFEB',

          accent: '#EDD6BF',

          neutral: '#4E3C32',

          'base-100': '#EDD6BF',

          info: '#E5E6D4',

          success: '#00ffff',

          warning: '#ffffff',

          error: '#ffffff'
        }
      }
    ]
  }
}
export default config
