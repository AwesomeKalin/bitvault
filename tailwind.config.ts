import forms from '@tailwindcss/forms';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				poppins: 'Poppins, sans-serif',
				'roboto-mono': 'Roboto Mono Variable, monospace',
			}
		}
	},

	plugins: [forms]
} satisfies Config;
