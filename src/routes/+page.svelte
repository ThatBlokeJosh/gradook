<script lang="ts">
    import type { PageData } from "./$types";
    import {total, drama, lyric, categories, catNames} from "../utils/rules"
    import {SaveSelected, LoadSelected} from "../utils/localStorage"
    import { onMount } from "svelte";

    enum Genre {
            Epic,
            Lyric,
            Drama
    }

    type Book = {
            title: string,
            author: string,
            century: string,
            genre: Genre
    }

    export let data: PageData;
    let books: Map<string, Array<Book>>  
    $: {if (data) {
      books = data.books
    }}

    function Get(key: string): Array<Book> {
      return books.get(key)
    }

    let key = 0
    
    let selected: Map<string, Book> = new Map<string, Book>

    onMount(() => {
      selected = LoadSelected()
      selected.forEach(book => {
        Change(book, 1)
      })
    })

    function HandleClick(book: Book) {
        key += 1
        if (selected.get(book.title)) {
            selected.delete(book.title)
            Change(book, -1)
            SaveSelected(selected)
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

      categories.update(map => {
        map[book.century] -= n
        return map
      })

      if (book.genre === Genre.Drama) {
        drama.update(d => {
          return d - n
        })
      } else if (book.genre === Genre.Lyric) {
        lyric.update(l => {
          return l - n
        })
      }
    }

    function N(n: number): number {
      if (n <= 0) {
        return 0
      }
      return n
    }
</script>

<div class="flex bg-slate-900 h-[5vh] mx-auto my-auto justify-center items-center text-white font-bold text-lg gap-[20px] text-center">
  <p class={$drama <= 0 ? "text-green-500" : "text-red-500"}>Drama: {N($drama)}</p>
  <p class={$total <= 0 ? "text-green-500" : "text-red-500"}>Total: {N($total)}</p>
  <p class={$lyric <= 0 ? "text-green-500" : "text-red-500"}>Lyric: {N($lyric)}</p>
</div>
<div class="flex bg-slate-900 h-[5vh] mx-auto my-auto justify-center items-center text-white font-bold text-lg gap-[20px] text-center">
  {#each Object.values($categories) as category, i}
    <p class={category <= 0 ? "text-green-500" : "text-red-500"}>{catNames[i]}: {N(category)}</p>
  {/each}
</div>
<div class="grid w-[100vw] bg-slate-800 text-white border-black p-[10px] h-[100vh] gap-[20px] overflow-scroll my-auto mx-auto">
  {#if books}
    {#each books.keys() as category}
      <div class="grid mx-auto my-auto gap-[10px]">
      <p class="text-2xl font-bold">{category}</p>
      <div class="grid grid-cols-5 gap-[10px]">
      {#each Get(category) as book}
        <div class="grid border-4 border-slate-700 px-[10px] py-[5px] items-center rounded-xl w-[19vw] h-[12vh]">
          <p><span class="font-bold">{book.title}</span> - <span class="italic">{book.author}</span>
          <span class="text-center text-lg my-auto flex justify-between">
            {#if book.genre === Genre.Epic}
              <div class="w-[50px] rounded-lg bg-purple-600 text-white font-bold">🐲</div>
              {:else if book.genre === Genre.Drama}
                <div class="w-[50px] rounded-lg bg-orange-600 text-white font-bold">🎭</div>
              {:else if book.genre === Genre.Lyric}
                <div class="w-[50px] rounded-lg bg-green-600 text-white font-bold">🎸</div>
            {/if}
            {#key key}
            <button class="hover:scale-[1.2] duration-200" on:click={() => {
              HandleClick(book)
            }} >{selected.get(book.title) === undefined ? "✅" : "❌"}</button>
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


