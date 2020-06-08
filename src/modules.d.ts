declare module "*.vert"
{
	const content: string;
	export default content;
}

declare module "*.frag"
{
	const content: string;
	export default content;
}

declare module "*.svelte"
{
	import { SvelteComponent } from 'svelte';
	const content: SvelteComponent;
}