<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import { Daltonizer } from '../daltonize/daltonizer';
	import { deficiencies } from '../daltonize/deficiencies';

	export let stream;
	export let mode;

	const dispatch = createEventDispatcher();

	let canvas;
	let modes = Object.keys(deficiencies).sort().map(key => ({ value: key, label: deficiencies[key].name }));

	onMount(startRender)

	async function startRender()
	{
		const video = document.createElement('video');
		video.srcObject = stream;
		await video.play();

		const daltonizer = new Daltonizer(canvas, video);
		daltonizer.bindSource(video);

		const renderLoop = () =>
		{
			if (stream.active == false)
			{
				dispatch('stop');
				return;
			}

			daltonizer.render(mode);

			requestAnimationFrame(renderLoop);
		};
		renderLoop();
	}
</script>

<style>
	.container
	{
		width: 100%;
		height: 100%;
	}

	canvas
	{
		width: 100%;
		height: 100%;
		display: block;
		object-fit: contain;
	}

	select
	{
		position: absolute;
		right: 20px;
		bottom: 20px;
	}
</style>

<div class="container">
	<canvas bind:this={canvas}/>
</div>

<select bind:value={mode}>
	{#each modes as option}
		<option value={option.value} label={option.label}/>
	{/each}
</select>