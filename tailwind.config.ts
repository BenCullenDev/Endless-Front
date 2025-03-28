import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          green: 'var(--terminal-green)',
          dark: 'var(--terminal-dark)',
          darker: 'var(--terminal-darker)',
        },
      },
    },
  },
  plugins: [],
}

export default config 