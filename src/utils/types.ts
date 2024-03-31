export enum Genre {
	Epic,
	Lyric,
	Drama
}

export type Book = {
	title: string,
	author: string,
	category: string,
	country: string,
	century: string,
	genre: Genre
}
