import { writable, type Writable } from "svelte/store"

export let total = writable(20)
export let lyric = writable(1)
export let drama = writable(2)
export let categories: Writable<{[category: string]:number}> = writable({
	"W+CS-18": 2, 
	"W+CS-19": 3,
	"W-20-21": 5,
	"CS-20-21": 5,
})

export let catBadges: Map<string, Array<string>> = new Map()
catBadges.set("Světová a česká literatura do konce 18. století", ["epic", "drama", "world", "czech"])
catBadges.set("Světová literatura 19. století", ["epic", "world"])
catBadges.set("Česká literatura 19. století", ["epic", "czech"])
catBadges.set("Světová a česká dramatická tvorba 19. – 21. století", ["drama", "world", "czech"])
catBadges.set("Světová a česká poezie 20. a 21. století", ["lyric", "world", "czech"])
catBadges.set("Světová próza 20. a 21. století", ["epic", "world"])
catBadges.set("Česká próza 20. a 21. století", ["epic", "czech"])
export let catNames: Array<string> = [
	"All 18.", 
	"All 19.",
	"World 20./21.",
	"Czech 20./21.",
]


export let catLimits: Array<number> = [
	2, 
	3,
	5,
	5,
]

function UpdateStore(k: string, n: number) {
	categories.update(y => {
		y[k] -= n
		return y
	})
}

export function UpdateCat(country: string, century: string, n: number) {
	if (century === "18") {
		UpdateStore("W+CS-18", n)
	} else if (century === "19") {
		UpdateStore("W+CS-19", n)

	} else if (century === "20-21" && country === "world") {
		UpdateStore("W-20-21", n)
	} else if (century === "20-21" && country === "czech") {
		UpdateStore("CS-20-21", n)
	}
}

export let authors: Writable<Map<string, boolean>> = writable(new Map())
