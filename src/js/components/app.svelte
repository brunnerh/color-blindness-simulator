<script>
	import Simulation from './simulation.svelte';

	const isSupported = 'mediaDevices' in navigator && 'getDisplayMedia' in navigator.mediaDevices;

	let canvas;
	let mode = 'deuteranopia';
	let stream = null;

	async function start()
	{
		stream = await navigator.mediaDevices.getDisplayMedia();
	}
</script>

<style>
	:global(html, body)
	{
		width: 100%;
		height: 100%;
		background: #333;
		color: #eee;
		margin: 0;
		padding: 0;
		font-family: sans-serif;
	}

	.start-screen
	{
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.start-button
	{
		text-transform: uppercase;
		padding: 0.5em 1em;
		font-size: x-large;
		border: none;
		background: #444;
		color: #eee;
		transition: background-color 0.3s ease-in-out;
	}
	.start-button:hover, .start-button:focus
	{
		background: #555;
	}

	.not-supported
	{
		color: hsl(0, 100%, 80%);
	}
</style>

{#if stream != null}
	<Simulation {stream} bind:mode on:stop={() => stream = null}/>
{:else}
	<div class="start-screen">
		<h1>Color Blindness Simulator</h1>

		{#if isSupported}
			<button type="button" class="start-button" on:click={start}>Start</button>
		{:else}
			<span class="not-supported">Screen capture is not supported by your browser.</span>
		{/if}
	</div>
{/if}