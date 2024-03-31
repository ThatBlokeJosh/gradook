<script lang="ts">
    import type { PageData } from "./$types";
    import {total, drama, lyric, categories, catNames, UpdateCat, catLimits, catBadges, authors} from "../utils/rules"
    import {SaveSelected, LoadSelected} from "../utils/localStorage"
    import { onMount } from "svelte";
    import { scale } from "svelte/transition";
    import { Genre, type Book } from '../utils/types'
    import Badge from "$lib/components/Badge.svelte";
    import Modal from "$lib/components/Modal.svelte";

    export let data: PageData;
    let books: Map<string, Array<Book>>  
    $: {if (data) {
      books = data.books
    }}

    function Get(key: string): Array<Book> {
      return books.get(key)
    }

    function Evaluate(): boolean {
      let out = $total <= 0 && $lyric <= 0 && $drama <= 0
      Object.values($categories).forEach(c => {
        out = out && c <= 0
      });
      return out
    }
    let complete: boolean = false 

    let key = 0
    
    let selected: Map<string, Book> = new Map<string, Book>

    onMount(() => {
      selected = LoadSelected()
      selected.forEach(book => {
        Change(book, 1)
      })
      complete = Evaluate()
    })

    let authorModal = {open: false, auhor: "G. Orwell"}
    function HandleClick(book: Book) {
        key += 1
        if (selected.get(book.title)) {
            selected.delete(book.title)
            authors.update(a => {
              a.delete(book.author)
              return new Map(a)
            })
            Change(book, -1)
            SaveSelected(selected)
            return
        }
        if ($authors.get(book.author) && !selected.get(book.title)) {
          authorModal.open = true
          authorModal.auhor = book.author
          return
        }
        selected.set(book.title, book)
        SaveSelected(selected)
        Change(book, 1)
    }

    function Change(book: Book, n: number) {
      total.update(t => {
        return t - n
      })

      UpdateCat(book.country, book.century, n)
      if (book.genre === Genre.Drama) {
        drama.update(d => {
          return d - n
        })
      } else if (book.genre === Genre.Lyric) {
        lyric.update(l => {
          return l - n
        })
      }
      if (n === 1) {
        authors.update(a => {
          a.set(book.author, true)
          return new Map(a)
        })
      }
      complete = Evaluate()
    }

    function N(n: number): number {
      if (n <= 0) {
        return 0
      }
      return n
    }
    let open = false
    function Dropdown() {
      open = !open
    }

    function Capital(t: string): string {
      let s = [...t]
      s[0] = s[0].toUpperCase()
      return s.join("")
    }
</script>

<div class="fixed right-[1vw] z-[50] top-[1vh] flex gap-[5px]">
<div class="bg-white shadow-[0_0px_20px_0px_rgba(255,255,255,1)] rounded-md right-[1vw] z-[50] drop-shadow-xl h-[35px] flex rounded-xl p-[5px] mx-auto my-auto justify-center items-center text-black font-bold text-lg gap-[10px] text-center">
  <p class={$lyric <= 0 ? "text-green-500" : "text-red-500"}><i class="fa-solid fa-guitar text-black fa-lg"></i> {1 - N($lyric)}<span class="text-xs text-black">/1</span></p>
  <p class={$drama <= 0 ? "text-green-500" : "text-red-500"}><i class="fa-solid fa-masks-theater text-black fa-lg"></i> {2 - N($drama)}<span class="text-xs text-black">/2</span></p>
  <p class={$total <= 0 ? "text-green-500" : "text-red-500"}><i class="fa-solid fa-book text-black fa-lg"></i> {20 - N($total)}<span class="text-xs text-black">/20</span></p>
</div>

<div class="bg-white w-[35px] h-[35px] duration-200 shadow-[0_0px_20px_0px_rgba(255,255,255,1)] rounded-md right-[1vw] z-[50] drop-shadow-xl top-[1vh] flex rounded-xl p-[5px] mx-auto my-auto justify-center items-center text-black font-bold text-lg gap-[10px] text-center">
  <button on:click={Dropdown} class="hover:scale-110 duration-200">
    <span class="fa-solid fa-lg {open ? 'fa-circle-arrow-up' : 'fa-circle-arrow-down'}"></span>
  </button>
</div>

<div class="bg-white w-[35px] h-[35px] duration-200 shadow-[0_0px_20px_0px_rgba(255,255,255,1)] rounded-md right-[1vw] z-[50] drop-shadow-xl top-[1vh] flex rounded-xl p-[5px] mx-auto my-auto justify-center items-center text-black font-bold text-lg gap-[10px] text-center">
  <span class="fa-solid fa-xl {complete ? 'fa-circle-check text-green-500 shadow-[0_0px_20px_5px_rgba(0,255,0,1)]' : 'fa-circle-xmark text-red-500 shadow-[0_0px_20px_5px_rgba(255,0,0,1)]'}"></span>
</div>
</div>

{#if open}
  <div class="fixed right-[1vw] top-[7vh] z-[50] overflow-scroll grid shadow-xl rounded-lg text-center p-[15px] text-lg font-bold w-[20vw] h-[20vh] bg-black border-[1px] border-zinc-900 duration-500 text-white"
   in:scale={{duration: 200}} 
   out:scale={{duration: 200}} 
  >
  {#each Object.values($categories) as c, i}
    <p>{catNames[i]} <span class={c <= 0 ? "text-green-500" : "text-red-500"}>{catLimits[i] - N(c)}<span class="text-xs text-white">/{catLimits[i]}</span></p>
  {/each}
  </div>
{/if}
<Modal bind:open={authorModal.open} bind:author={authorModal.auhor}/>
<!-- <div class="flex bg-slate-900 h-[5vh] mx-auto my-auto justify-center items-center text-white font-bold text-lg gap-[20px] text-center"> -->
<!--   {#each Object.values($categories) as category, i} -->
<!--     <p class={category <= 0 ? "text-green-500" : "text-red-500"}>{catNames[i]}: {N(category)}</p> -->
<!--   {/each} -->
<!-- </div> -->
<div class="grid w-[100vw] p-[20px] bg-black text-white border-black p-[10px] h-[100vh] gap-[20px] overflow-scroll my-auto mx-auto">
  {#if books && books.keys()}
    {#each books.keys() as category}
      <div class="grid mx-auto my-auto gap-[10px]">
      <div class="flex gap-[10px] items-center">
        <p class="text-2xl font-bold">{category}</p>
        {#each catBadges.get(category) as badge}
            <Badge text={Capital(badge)}/>
        {/each}
      </div>
      <div class="grid grid-cols-5 gap-[15px]">
      {#each Get(category) as book}
        <div class="grid drop-shadow-xl bg-black hover:bg-zinc-950 hover:shadow-[0_0px_20px_0px_rgba(255,255,255,0.2)] duration-500 border-[1px] border-zinc-900 px-[10px] py-[5px] items-center overflow-scroll rounded-lg w-[19vw] h-[12vh] gap-[5px]">
          <p><span class="font-bold">{book.title}</span> - <span class="italic">{book.author}</span>
          <span class="text-center text-lg my-auto flex justify-between">
            <div class="flex gap-[5px]">
            {#if book.genre === Genre.Epic}
                    <Badge text="Epic"/>
              {:else if book.genre === Genre.Drama}
                    <Badge text="Drama"/>
              {:else if book.genre === Genre.Lyric}
                    <Badge text="Lyric"/>
            {/if}
            <Badge text={Capital(book.country)} />
            </div>
            {#key key}
            <button class="hover:scale-110 text-center grid justify-center items-center my-auto rounded-lg font-bold uppercase text-md p-2 duration-200 " on:click={() => {
              HandleClick(book)
            }} >
              <span class="fa-solid fa-xl {selected.get(book.title) === undefined ? 'fa-circle-xmark text-red-500 shadow-[0_0px_20px_7px_rgba(255,0,0,1)]' : 'fa-circle-check text-green-500 shadow-[0_0px_20px_7px_rgba(0,255,0,1)]'}"></span>
            </button>
            {/key}
          </span>
          </p>
        </div>
      {/each}
      </div>
      </div>
    {/each}
  {/if}
</div>


