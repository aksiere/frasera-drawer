<script>
	import { clickoutside } from '$lib'
	import { cubicOut } from 'svelte/easing'
	
	let {
		open = false,
		querySelector = `[data-wrapper]`,
		maxOpacity = 60,
		maxHeight = 92,
		maxBorderRadius = 0,
		maxScalePadding = 0,
		transitionDuration = 400,
		transitionEasing = 'cubic-bezier(.32, .72, 0, 1)',
		onclose = () => {},
		children,
		...stuff
	} = $props()

	let drawer = $state()
	let dim = $state()

	const setParentTransitions = () => {
		document.querySelector(querySelector).style.transition = `transform ${transitionDuration}ms ${transitionEasing}, border-radius ${transitionDuration}ms ${transitionEasing}`
		dim.style.transition = `filter ${transitionDuration}ms ${transitionEasing}`
	}

	const setParentValues = (v1 = maxScalePadding, v2 = maxBorderRadius, v3 = maxOpacity) => {
		document.querySelector(querySelector).style.borderRadius = `${Math.round(v2)}px`
		document.querySelector(querySelector).style.transform = `scaleX(${100 - v1 / (window.innerWidth / 200)}%) scaleY(${100 - v1 / (window.innerHeight / 200)}%)`
		dim.style.filter = `opacity(${v3}%)`
	}

	$effect(() => {
		if (open) {
			setParentTransitions()
		}
	})

	const close = () => {
		if (open) {
			open = false
			onclose()
		}
	}

	const onclickoutside = (e) => {
		close()
	}

	const onkeydown = (e) => {
		switch (e.code) {
			case 'Escape':
				close()
				break
			default:
				break
		}
	}

	let is_down = $state(false)
	let point_when_down = $state(false)
	let point_when_up = $state(false)

	const onpointerdown = (e) => {
		// if (e.target.dataset.pullable !== 'true') return

		is_down = true
		point_when_down = { x: e.x, y: e.y, timestamp: performance.now() }

		dim.style.transition = 'none'
		drawer.style.transition = 'none'
		document.querySelector(`[data-wrapper]`).style.transition = 'none'
	}

	const onpointerup = (e) => {
		if (is_down) {
			is_down = false
			point_when_up = { x: e.x, y: e.y, timestamp: performance.now() }

			if (point_when_down.y === point_when_up.y) return
			
			setParentTransitions()
			if (((point_when_up.y - point_when_down.y) > (point_when_up.timestamp - point_when_down.timestamp))) {
				close()
			} else {
				drawer.style.transition = `transform ${transitionDuration}ms ${transitionEasing}`
				drawer.style.transform = 'translateY(0%)'
				setParentValues()
			}
		}
	}

	const onpointermove = (e) => {
		if (is_down) {
			// console.log(e);
			// if (e.y > (window.innerHeight - drawer.offsetTop)) {
				// close()
			// }

			if ((e.y - point_when_down.y) * -1 < 0) {
				drawer.style.transform = `translateY(${e.y - point_when_down.y}px`

				const t = (e.y - point_when_down.y) / (window.innerHeight - drawer.offsetTop)
				setParentValues((1 - t) * maxScalePadding, (1 - t) * maxBorderRadius, (1 - t) * maxOpacity)
			}
		}
	}

	function split_css_unit(value) {
		const split = typeof value === 'string' && value.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/)
		return split ? [parseFloat(split[1]), split[2] || 'px'] : [/** @type {number} */ (value), 'px']
	}

	function fly(node, { delay = 0, duration = transitionDuration, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
		const style = getComputedStyle(node)
		const target_opacity = +style.opacity
		const transform = style.transform === 'none' ? '' : style.transform
		const od = target_opacity * (1 - opacity)
		const [x_value, x_unit] = split_css_unit(x)
		const [y_value, y_unit] = split_css_unit(y)

		return {
			delay,
			duration,
			easing,
			css: (t, u) => {
				setParentValues(t * maxScalePadding, t * maxBorderRadius, t * maxOpacity)

				return `transform: ${transform} translate(${(1 - t) * x_value}${x_unit}, ${(1 - t) * y_value}${y_unit});`
			}
		}
	}
</script>

<svelte:window {onkeydown} />

{#if open}
	<div bind:this={dim} class='dim' style='--transition-type: {transitionEasing}; --transition-duration: {transitionDuration}ms'></div>
	<div bind:this={drawer} {...stuff} style='--height: {maxHeight}%; --border-radius: {maxBorderRadius}px' transition:fly={{ y: '100%', duration: transitionDuration, easing: cubicOut, opacity: 1 }} use:clickoutside {onclickoutside} {onpointerdown} {onpointerup} {onpointermove}>
		{@render children()}
	</div>
{/if}

<style>
	.dim {
		position: fixed;
		width: 100%;
		height: 100%;
		background: black;
		filter: opacity(0%);
		top: 0;
		left: 0;
		z-index: 99;
	}

	.dim + div {
		touch-action: none;
		border-top-left-radius: var(--border-radius);
		border-top-right-radius: var(--border-radius);
		position: fixed;
		height: var(--height);
		width: 100%;
		left: 0;
		bottom: 0;
		transform: translateY(var(--translate));
		transition: transform .5s cubic-bezier(.32, .72, 0, 1);
		cursor: grab;
		user-select: none;
		-webkit-user-select: none;
		overflow-y: auto;
		z-index: 100;

		&::-webkit-scrollbar {
			visibility: hidden;
		}

		&:active {
			cursor: grabbing;
		}
	}
</style>
