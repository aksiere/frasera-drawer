import {
	defineConfig,
	presetUno,
} from 'unocss'

export default defineConfig({
	theme: {
		colors: {
			'neutral-950': 'hsl(0 10% 3.9%)',
			'neutral-450': 'hsl(0 10% 56%)',
		},
		fontFamily: {
			'sans': 'GeistVF',
			'mono': 'GeistMonoVF',
		}
	},
	presets: [
		presetUno(),
	],
})
