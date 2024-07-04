<script>
	import { page } from '$app/stores'
	import { fly } from 'svelte/transition'
	import { onMount } from 'svelte'

	import { Drawer } from '$lib/components'

	let duration = $state.frozen(500)
	let mounted = $state(false)
	onMount(() => (mounted = true))

	let open_1 = $state(false)
	let open_2 = $state(false)
</script>

<div data-wrapper class="h-full bg-white text-black p-[1rem] grid place-items-center text-center">
	{#if mounted}
		<div class="*:font-sans z-100 *:transition-all">
			<p class="text-[1.125rem] text-neutral-500 m-0">Frasera</p>
			<p class="text-[4rem] font-semibold text-neutral-900 m-0">Drawer</p>
			<button onclick={() => (open_1 = true)} type="button" class="mt-[3rem] cursor-pointer rounded-lg bg-white hover:bg-neutral-50 text-black px-4 py-2.5 text-sm font-medium border-none outline-none" aria-haspopup="dialog" aria-expanded="false">
				Propless
			</button>
			<button onclick={() => (open_2 = true)} type="button" class="mt-[3rem] cursor-pointer rounded-lg bg-white hover:bg-neutral-50 text-black px-4 py-2.5 text-sm font-medium border-none outline-none" aria-haspopup="dialog" aria-expanded="false">
				Customized
			</button>
		</div>
	{/if}

	<!-- <video muted autoplay loop class="hidden lg:block pointer-events-none absolute w-full inset-0 z-0 opacity-20 [mask-image:radial-gradient(80svh_50svh_at_top_center,black,transparent)]">
		<source src="{$page.url.origin}/assets/videos/background.mp4" type="video/mp4"/>
		Your browser does not support the video tag.
	</video> -->
</div>

<Drawer open={open_1} onclose={() => (open_1 = false)} class="bg-white text-black">
	<div class="p-[1rem] font-sans">Content</div>
</Drawer>

<Drawer open={open_2} onclose={() => (open_2 = false)} class="bg-white text-black" querySelector="[data-wrapper]" maxOpacity={80} maxBorderRadius={10} maxHeight={46} maxScalePadding={16}>
	<Drawer.Handle class="bg-neutral-200" />
	<div class="max-w-[32rem] mx-auto p-[1rem] font-sans">Content</div>
</Drawer>
