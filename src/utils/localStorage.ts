import { Genre, type Book } from '../utils/types'

let key = "selected"

export function SaveSelected(map: Map<string, Book>) {
	localStorage.setItem(key, JSON.stringify(Object.fromEntries(map.entries())))
}

export function LoadSelected(): Map<string, Book> {
	let text: string = localStorage.getItem(key) 
	let map: Map<string, Book> = new Map(Object.entries(JSON.parse(text)))
	return map 
}
