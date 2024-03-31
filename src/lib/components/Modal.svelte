<script lang="ts">
	import { scale,slide, fly } from "svelte/transition";
	export let open = false
	export let author = "G. Orwell"
</script>

{#if open}
<div in:fly={{duration: 300}} out:fly={{duration: 300}}
	class="border-box backdrop-blur-xl absolute top-[30%] shadow-[0_0px_20px_5px_rgba(255,255,255,0.2)] left-[25%] w-[50vw] rounded-lg z-[100] h-fit p-[10vh] bg-black text-white grid gap-[20px] justify-center items-center my-auto mx-auto text-center border-[1px] border-zinc-900">
	<div>
		<h1 class="text-2xl font-bold">{author} has already been selected</h1>
		<p class="opacity-[80%] text-lg">You can only select one book per author</p>
	</div>
	<button on:click={() => {
		open = !open
	}}
	class="hover:scale-110 duration-500 mx-auto shadow-[0_0px_20px_5px_rgba(255,255,255,0.6)] w-fit h-fit px-[20px] py-[5px] bg-white text-black font-bold rounded-md text-center">Understood</button>
</div>
{/if}
