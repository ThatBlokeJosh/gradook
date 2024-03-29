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

let key = "selected"

export function SaveSelected(map: Map<string, Book>) {
	localStorage.setItem(key, JSON.stringify(Object.fromEntries(map.entries())))
}

export function LoadSelected(): Map<string, Book> {
	let text: string = localStorage.getItem(key) 
	let map: Map<string, Book> = new Map(Object.entries(JSON.parse(text)))
	return map 
}
