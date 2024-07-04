<script>
	let { ...stuff } = $props()
</script>

<div class:wrapper={true}>
	<div class:pull={true} {...stuff}></div>
</div>

<style>
	.wrapper {
		padding: 1rem;
	}

	.pull {
		display: block;
		width: 3rem;
		height: .375rem;
		border-radius: 10px;
		margin-inline: auto;
	}
</style>