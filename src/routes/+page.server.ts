import type { PageServerLoad } from './$types';
import { parseHTML } from 'linkedom'

const URL: string = "https://www.ssps.cz/studenti/maturitni-zkousky/maturitni-cetba/"

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

function genre(century: string): Genre {
	if (century.includes("poezie")) {
		return Genre.Lyric
	} else if (century.includes("dramatická")) {
		return Genre.Drama
	}
	return Genre.Epic
}

export const load: PageServerLoad = async ({ fetch }) => {
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
		let century = "" 
		let g = genre(century)
		p.forEach(b => {
			let split = b.split(" – ")
			if (split.length === 1 || split[1] === "21. století") {
				century = b
				g = genre(century)
				books.set(century, new Array<Book>)
			} else {
				let book: Book = {title: split[1].trim(), author: split[0], century: century, genre: g}
				books.get(century)?.push(book)
			}
		})
	})
	return {books: books};
};
