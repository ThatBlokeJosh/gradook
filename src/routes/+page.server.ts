import type { PageServerLoad } from './$types';
import { Fetch, Read } from './+server';

export const load: PageServerLoad = async ({}) => {
	return {books: Read()};
};
