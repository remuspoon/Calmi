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
          primary: '#004798',

          secondary: '#D7EAFF',

          accent: '#EDD6BF',

          neutral: '#D7EAFF',

          'base-100': '#FFFFFF',

          info: '#FFFFFF',

          success: '#00ffff',

          warning: '#ffffff',

          error: '#ffffff'
        }
      }
    ]
  }
}
export default config
