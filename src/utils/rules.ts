import { writable, type Writable } from "svelte/store"

export let total = writable(20)
export let lyric = writable(1)
export let drama = writable(2)
export let categories: Writable<{[category: string]:number}> = writable({
	"Světová a česká literatura do konce 18. století": 2, 
	"Světová a česká literatura 19. století": 3,
	"Světová literatura 20. a 21. století": 5,
	"Česká literatura 20. a 21. století": 5,
})

export let catNames: Array<string> = [
	"Světová a česká literatura do konce 18. století", 
	"Světová a česká literatura 19. století",
	"Světová literatura 20. a 21. století",
	"Česká literatura 20. a 21. století",
]
