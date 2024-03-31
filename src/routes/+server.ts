import { parseHTML } from 'linkedom'
import * as books from "../utils/data/books.json"
import { Genre, type Book } from '../utils/types'

const URL: string = "https://www.ssps.cz/studenti/maturitni-zkousky/maturitni-cetba/"

function genre(century: string): Genre {
	if (century.includes("poezie")) {
		return Genre.Lyric
	} else if (century.includes("dramatická")) {
		return Genre.Drama
	}
	return Genre.Epic
}


function century(category: string): string {
	if (category.includes("18")) {
		return "18"
	} else if (category.includes("19") && !category.includes("21")) {
		return "19"
	}
	return "20-21"
}


function country(category: string): string {
	if (category.toLowerCase().includes("česká") && !category.toLowerCase().includes("světová")) {
		return "czech"
	}
	return "world"
}

let cached: Map<string, Array<Book>>

export async function Fetch(): Promise<Map<string, Array<Book>>> {
	if (cached) {
		console.log(JSON.stringify(Object.fromEntries(cached.entries()), null, 2))
		return cached
	}
	const response = await fetch(`${URL}`, {
	method: 'GET',
	mode: 'cors',
	headers: {
		'content-type': 'application/json',
	},});		
	let data = {html: ""};
	try {
		data["html"] = await response.text();
	} catch {
	}
	const {document} = parseHTML(data["html"])
	const content = document.querySelector(".content")
	let arr: Array<string> = new Array<string>
	content?.querySelectorAll("p").forEach(e => {
		arr.push(e.innerText)
	})
	let rawBookArr = arr.slice(7)
	let books: Map<string, Array<Book>> = new Map<string, Array<Book>>
	rawBookArr.forEach((s, i) => {
		let p = s.split("\n").filter(Boolean)
		if (i === 0) {
			p = p.splice(1)
		}
		let category = "" 
		let g = genre(category)
		let c = century(category)
		let count = country(category)
		p.forEach(b => {
			let split = b.split(" – ")
			if (split.length === 1 || split[1] === "21. století") {
				category = b
				g = genre(category)
				c = century(category)
				count = country(category)
				books.set(category, new Array<Book>)
			} else {
				let book: Book = {title: split[1].trim(), author: split[0], category: category, genre: g, century: c, country: count}
				books.get(category)?.push(book)
			}
		})
	})
	cached = books
	return books;
};

export function Read(): Map<string, Array<Book>> {
	if (cached) {
		return cached
	}
	let map: Map<string, Array<Book>> = new Map(Object.entries(books.default))
	cached = map
	return map 
}
