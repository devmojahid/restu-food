/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        './pages/**/*.{js,jsx}',
        './components/**/*.{js,jsx}',
        './app/**/*.{js,jsx}',
        './src/**/*.{js,jsx}',
    ],
    prefix: "",
    theme: {
    	container: {
    		center: 'true',
    		padding: '1rem',
    		screens: {
    			'2xl': '1400px'
    		}
    	},
    	extend: {
    		colors: {
    			primary: {
    				DEFAULT: '#4A6CF7',
    				50: '#EEF1FE',
    				100: '#E4E9FD',
    				200: '#D5DDFC',
    				300: '#B7C5FA',
    				400: '#7D97F7',
    				500: '#4A6CF7',
    				600: '#1B43F4',
    				700: '#0B31D1',
    				800: '#08249C',
    				900: '#061B73',
    				foreground: '#FFFFFF'
    			},
    			secondary: {
    				DEFAULT: '#13C296',
    				foreground: '#FFFFFF'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			},
    			'slide-down': {
    				'0%': { transform: 'translateY(-10px)', opacity: '0' },
    				'100%': { transform: 'translateY(0)', opacity: '1' }
    			},
    			'fade-in': {
    				'0%': { opacity: '0' },
    				'100%': { opacity: '1' }
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			'slide-down': 'slide-down 0.3s ease-out',
    			'fade-in': 'fade-in 0.3s ease-out'
    		},
    		screens: {
    			'xs': '475px',
    			'2xl': '1536px',
    			'3xl': '1920px'
    		}
    	}
    },
    plugins: [require("tailwindcss-animate"), require("@tailwindcss/forms")],
}