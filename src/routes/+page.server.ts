import type { PageServerLoad } from './$types';
import * as books from "../utils/data/books.json"
import { Genre, type Book } from '../utils/types'


function Read(): Map<string, Array<Book>> {
	if (cached) {
		return cached
	}
	let map: Map<string, Array<Book>> = new Map(Object.entries(books.default))
	cached = map
	return map 
}

let cached: Map<string, Array<Book>>

export const load: PageServerLoad = async ({}) => {
	return {books: Read()};
};
